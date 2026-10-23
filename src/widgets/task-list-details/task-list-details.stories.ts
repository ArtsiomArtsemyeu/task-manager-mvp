import { expect, userEvent, within } from "storybook/test";
import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { TaskListDetailsWidget } from "./task-list-details";
import type { Task } from "@/src/entities/task";
import type { TaskListDto } from "@/src/entities/task-list";
import { getPortalBody } from "@/src/shared/lib/storybook";

const DEFAULT_DUE_DATE = "2030-06-15T12:00:00.000Z";
const OVERDUE_DUE_DATE = "2020-01-01T12:00:00.000Z";

const makeTask = (
  overrides: Partial<Task> & Pick<Task, "id" | "name">,
): Task => ({
  description: "",
  state: "new",
  priority: 2,
  dueDate: DEFAULT_DUE_DATE,
  ...overrides,
});

const sampleTasks: Task[] = [
  makeTask({
    id: "1",
    name: "Собрать требования",
    state: "new",
    priority: 1,
    description: "Уточнить scope у заказчика",
  }),
  makeTask({
    id: "2",
    name: "Подготовить отчёт",
    state: "in progress",
    priority: 3,
  }),
  makeTask({
    id: "3",
    name: "Обновить документацию",
    state: "done",
    priority: 2,
  }),
  makeTask({
    id: "4",
    name: "Закрыть инцидент",
    state: "overdue",
    priority: 3,
    dueDate: OVERDUE_DUE_DATE,
  }),
];

const sampleTaskList: TaskListDto = {
  id: "list-1",
  name: "Рабочие задачи",
  userId: "user-1",
  tasks: sampleTasks,
};

const emptyTaskList: TaskListDto = {
  id: "list-empty",
  name: "Пустой список",
  userId: "user-1",
  tasks: [],
};

const meta: Meta<typeof TaskListDetailsWidget> = {
  title: "Widgets/TaskListDetails",
  component: TaskListDetailsWidget,
  tags: ["autodocs"],
  args: {
    taskList: sampleTaskList,
  },
  parameters: {
    layout: "fullscreen",
  },
};

type Story = StoryObj<typeof TaskListDetailsWidget>;

export const Default: Story = {};

export const Empty: Story = {
  args: {
    taskList: emptyTaskList,
  },
  parameters: {
    docs: {
      description: {
        story: "Список без задач",
      },
    },
  },
};

export const FilterByDone: Story = {
  parameters: {
    docs: {
      description: {
        story:
          "Фильтрация задач в таблице и отображение задача со статусом done.",
      },
      story: { autoplay: true },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Выполнена" }));

    const rows = canvas.getAllByRole("row");
    // header + one done task
    await expect(rows).toHaveLength(2);
    await expect(
      canvas.getByRole("link", { name: "Обновить документацию" }),
    ).toBeInTheDocument();
  },
};

export const FilterEmptyResult: Story = {
  args: {
    taskList: {
      ...sampleTaskList,
      tasks: [
        makeTask({
          id: "1",
          name: "Только новая задача",
          state: "new",
        }),
      ],
    },
  },
  parameters: {
    docs: {
      description: {
        story:
          "Фильтрация задач в таблице о отображение сообщения о том, что задач не найдено.",
      },
      story: { autoplay: true },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await userEvent.click(canvas.getByRole("button", { name: "Просрочена" }));

    await expect(canvas.getByText("Задач не найдено")).toBeInTheDocument();
    await expect(
      canvas.getByText("Попробуйте другой фильтр статуса."),
    ).toBeInTheDocument();
  },
};

export const OpenAddTaskModal: Story = {
  parameters: {
    docs: {
      description: {
        story: "Кнопка Добавить задачу открывает модальное окно добавления задачи.",
      },
      story: { autoplay: true },
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const body = getPortalBody(canvasElement);

    await userEvent.click(
      canvas.getByRole("button", { name: "Добавить задачу" }),
    );

    await expect(
      body.getByRole("heading", { name: "Добавить задачу" }),
    ).toBeInTheDocument();
  },
};

export default meta;
