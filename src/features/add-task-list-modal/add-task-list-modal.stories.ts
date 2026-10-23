import { expect, fn, userEvent } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AddTaskListModal } from "./add-task-list-modal";
import { errorMessages } from "@/src/shared/config";
import { getPortalBody } from "@/src/shared/lib/storybook";

const meta: Meta<typeof AddTaskListModal> = {
  title: "Features/AddTaskListModal",
  component: AddTaskListModal,
  tags: ["autodocs"],
  args: {
    isOpen: true,
  },
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof AddTaskListModal>;

export const Default: Story = {
  args: {
    onClose: fn(),
  },
};

export const RequiredName: Story = {
  args: {
    onClose: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Отправка пустой формы. Валидация обязательного поля и отображение сообщения ошибки: Название обязательно.",
      },
      story: { autoplay: true },
    },
  },
  play: async ({ canvasElement }) => {
    const body = getPortalBody(canvasElement);

    await userEvent.click(body.getByRole("button", { name: "Создать" }));

    await expect(
      body.getByText(errorMessages.validation.nameRequired),
    ).toBeInTheDocument();
  },
};

export default meta;
