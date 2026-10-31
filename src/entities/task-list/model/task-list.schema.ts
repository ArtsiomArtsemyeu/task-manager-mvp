import { z } from 'zod';

export const createTaskListBodySchema = z.object({
  name: z.string(),
  taskIds: z.array(z.string()).optional(),
});

export const updateTaskListBodySchema = z.object({
  name: z.string(),
});

export type CreateTaskListBody = z.infer<typeof createTaskListBodySchema>;
export type UpdateTaskListBody = z.infer<typeof updateTaskListBodySchema>;
