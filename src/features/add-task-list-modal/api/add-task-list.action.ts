"use server";

export type AddTaskListActionState = {
  error?: string;
  success?: boolean;
} | null;

export async function addTaskListAction(
  prevState: AddTaskListActionState,
  formData: FormData,
): Promise<AddTaskListActionState> {
  const name = formData.get("name");

  const response = await fetch("http:/localhost:3000/api/data/task-lists", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name }),
  });

  if (!response.ok) {
    return { error: "Некорректное имя списка" };
  }
  return { success: true };
}
