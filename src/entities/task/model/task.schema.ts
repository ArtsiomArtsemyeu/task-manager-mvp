import { z } from 'zod';
import { TASK_STATES } from '../config/task.config';

export const taskStateSchema = z.enum(TASK_STATES);

export const createTaskBodySchema = z.object({
  name: z.string(),
  description: z.string(),
  state: taskStateSchema,
  priority: z.number(),
  dueDate: z.string(),
  taskListId: z.string(),
});

export const updateTaskBodySchema = z.object({
  name: z.string().nullish(),
  description: z.string().nullish(),
  state: taskStateSchema.nullish(),
  priority: z.number().nullish(),
  dueDate: z.string().nullish(),
});

export type CreateTaskBody = z.infer<typeof createTaskBodySchema>;
export type UpdateTaskBody = z.infer<typeof updateTaskBodySchema>;
