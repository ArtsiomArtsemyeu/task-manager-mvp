import { NextResponse } from 'next/server';
import { loginBodySchema } from '@/src/entities/user';
import type { UserSession } from '@/src/entities/user';
import { defaultUser, errorMessages } from '@/src/shared/config';
import { parseRequestJson } from '@/src/shared/lib/zod';

export async function POST(request: Request) {
  try {
    const loginBody = await parseRequestJson(request, loginBodySchema);

    if (!loginBody.success) {
      return NextResponse.json(
        { error: errorMessages.validation.requiredFields },
        { status: 400 },
      );
    }

    if (
      loginBody.data.email !== defaultUser.email ||
      loginBody.data.password !== defaultUser.password
    ) {
      return NextResponse.json(
        { error: errorMessages.error.invalidCredentials },
        { status: 401 },
      );
    }

    const userSessionPayload: UserSession = {
      userId: defaultUser.id,
      email: defaultUser.email,
    };

    return NextResponse.json({ userSessionPayload }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: errorMessages.error.server },
      { status: 500 },
    );
  }
}
