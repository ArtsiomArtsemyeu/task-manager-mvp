'use client';

import { useHotkeys } from 'react-hotkeys-hook';
import type {
  FieldValues,
  Path,
  PathValue,
  UseFormGetValues,
  UseFormSetValue,
} from 'react-hook-form';

type UseFillFormStubsHotkeyOptions<T extends FieldValues> = {
  getValues: UseFormGetValues<T>;
  setValue: UseFormSetValue<T>;
  stubs: Partial<T> | (() => Partial<T>);
  enabled?: boolean;
};

function isEmptyValue(value: unknown): boolean {
  if (value === undefined || value === null) {
    return true;
  }

  if (typeof value === 'string') {
    return value.trim() === '';
  }

  return false;
}

export function useFillFormStubsHotkey<T extends FieldValues>({
  getValues,
  setValue,
  stubs,
  enabled = true,
}: UseFillFormStubsHotkeyOptions<T>) {
  useHotkeys(
    'alt+c',
    (event) => {
      event.preventDefault();

      const currentValues = getValues();
      const stubValues = typeof stubs === 'function' ? stubs() : stubs;

      (Object.keys(stubValues) as Path<T>[]).forEach((fieldName) => {
        const stubValue = stubValues[fieldName as keyof typeof stubValues];

        if (stubValue === undefined) {
          return;
        }

        if (isEmptyValue(currentValues[fieldName])) {
          setValue(fieldName, stubValue as PathValue<T, Path<T>>, {
            shouldDirty: true,
            shouldValidate: true,
          });
        }
      });
    },
    {
      enabled,
      enableOnFormTags: true,
      preventDefault: true,
    },
    [enabled, getValues, setValue, stubs],
  );
}
