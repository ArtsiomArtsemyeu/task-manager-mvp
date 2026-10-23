import { expect, fn, userEvent } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AddTaskModal } from "./add-task-modal";
import { errorMessages } from "@/src/shared/config/error";
import { getPortalBody } from "@/src/shared/lib/storybook";

const meta: Meta<typeof AddTaskModal> = {
  title: "Features/AddTaskModal",
  component: AddTaskModal,
  tags: ["autodocs"],
  args: {
    isOpen: true,
    taskListId: "list-1",
  },
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof AddTaskModal>;

export const Default: Story = {
  args: {
    onClose: fn(),
  },
};

export const RequiredFields: Story = {
  args: {
    onClose: fn(),
  },
  parameters: {
    docs: {
      description: {
        story:
          "Отправка пустой формы. Валидация обязательных полей и отображение сообщений ошибок: Название обязательно и Дедлайн обязателен.",
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
    await expect(
      body.getByText(errorMessages.validation.dueDateRequired),
    ).toBeInTheDocument();
  },
};

export default meta;
