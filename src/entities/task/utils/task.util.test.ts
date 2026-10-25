import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import type { Task } from '../model/task.model';
import {
  calculateTaskCountByState,
  calculateTaskListProgress,
  getTaskPriorityLevel,
  getTomorrowDateTimeLocal,
  sortTasks,
  toDateTimeLocalValue,
} from './task.util';

const makeTask = (overrides: Partial<Task> = {}): Task => ({
  id: '1',
  name: 'Task',
  description: '',
  state: 'new',
  priority: 1,
  dueDate: '2030-01-01T00:00:00.000Z',
  ...overrides,
});

const taskNames = (tasks: Task[]): string[] =>
  tasks.map((task: Task) => task.name);

const tasksByStates: Task[] = [
  makeTask({ id: '1', state: 'new' }),
  makeTask({ id: '2', state: 'new' }),
  makeTask({ id: '3', state: 'in progress' }),
  makeTask({ id: '4', state: 'done' }),
  makeTask({ id: '5', state: 'done' }),
  makeTask({ id: '6', state: 'done' }),
  makeTask({ id: '7', state: 'overdue' }),
];

describe('calculateTaskCountByState', () => {
  it('возвращает 0 для пустого списка задач', () => {
    expect(calculateTaskCountByState([], 'new')).toBe(0);
  });

  it('возвращает 0, если задач с таким статусом нет в списке', () => {
    const tasks = [
      makeTask({ id: '1', state: 'new' }),
      makeTask({ id: '2', state: 'done' }),
    ];

    expect(calculateTaskCountByState(tasks, 'overdue')).toBe(0);
  });

  it('считает задачи с определённым статусом', () => {
    expect(calculateTaskCountByState(tasksByStates, 'new')).toBe(2);
    expect(calculateTaskCountByState(tasksByStates, 'in progress')).toBe(1);
    expect(calculateTaskCountByState(tasksByStates, 'done')).toBe(3);
    expect(calculateTaskCountByState(tasksByStates, 'overdue')).toBe(1);
  });
});

describe('calculateTaskListProgress', () => {
  it('возвращает прогресс равный 0 для пустого списка задач', () =>
    expect(calculateTaskListProgress([])).toBe(0));

  it('возвращает округлённый процент выполненных задач', () => {
    const tasks = [
      makeTask({ id: '1', state: 'done' }),
      makeTask({ id: '2', state: 'new' }),
      makeTask({ id: '3', state: 'done' }),
    ];

    expect(calculateTaskListProgress(tasks)).toBe(67);
  });
});

describe('sortTasks', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-06-15T12:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('не меняет порядок задач в исходном массиве', () => {
    const tasks = [
      makeTask({ id: '1', name: 'Выполненная', state: 'done' }),
      makeTask({ id: '2', name: 'Активная', state: 'new' }),
    ];
    const originalTaskNamesOrder = taskNames(tasks);

    sortTasks(tasks);

    expect(taskNames(tasks)).toEqual(originalTaskNamesOrder);
  });

  it('возвращает пустой массив, если в списке нет задач', () =>
    expect(sortTasks([])).toEqual([]));

  it('незавершенные задачи идут перед выполненными задачами в списке', () => {
    const tasks = [
      makeTask({ id: '1', name: 'Выполненная', state: 'done' }),
      makeTask({ id: '2', name: 'Активная', state: 'new' }),
      makeTask({ id: '3', name: 'Тоже выполненная', state: 'done' }),
    ];

    expect(taskNames(sortTasks(tasks))).toEqual([
      'Активная',
      'Выполненная',
      'Тоже выполненная',
    ]);
  });

  it('просроченные задачи идут первыми среду незавершенных задач', () => {
    const tasks = [
      makeTask({
        id: '1',
        name: 'Обычная',
        state: 'new',
        dueDate: '2026-07-01T12:00:00.000Z',
      }),
      makeTask({
        id: '2',
        name: 'Просроченная по статусу',
        state: 'overdue',
        dueDate: '2026-07-10T12:00:00.000Z',
      }),
      makeTask({
        id: '3',
        name: 'Просроченная по дате',
        state: 'new',
        dueDate: '2026-06-01T12:00:00.000Z',
      }),
    ];

    expect(taskNames(sortTasks(tasks))).toEqual([
      'Просроченная по дате',
      'Просроченная по статусу',
      'Обычная',
    ]);
  });

  it('при одинковом статусе выше задача, у которой раньше дедлайн — выше в списке', () => {
    const tasks = [
      makeTask({
        id: '1',
        name: 'Позже',
        dueDate: '2026-08-01T12:00:00.000Z',
      }),
      makeTask({
        id: '2',
        name: 'Раньше',
        dueDate: '2026-07-01T12:00:00.000Z',
      }),
    ];

    expect(taskNames(sortTasks(tasks))).toEqual(['Раньше', 'Позже']);
  });

  it('при одинаковом дедлайне выше согласно приоритетy — выше в списке', () => {
    const sameDueDate = '2026-07-01T12:00:00.000Z';
    const tasks = [
      makeTask({
        id: '1',
        name: 'Низкий приоритет',
        priority: 1,
        dueDate: sameDueDate,
      }),
      makeTask({
        id: '2',
        name: 'Высокий приоритет',
        priority: 5,
        dueDate: sameDueDate,
      }),
    ];

    expect(taskNames(sortTasks(tasks))).toEqual([
      'Высокий приоритет',
      'Низкий приоритет',
    ]);
  });

  it('выполненные задачи не считаются просроченными и остаются в конце', () => {
    const tasks = [
      makeTask({
        id: '1',
        name: 'Выполненная, но с прошлой датой',
        state: 'done',
        dueDate: '2026-01-01T12:00:00.000Z',
      }),
      makeTask({
        id: '2',
        name: 'Просроченная',
        state: 'overdue',
        dueDate: '2026-01-01T12:00:00.000Z',
      }),
      makeTask({
        id: '3',
        name: 'Активная',
        state: 'new',
        dueDate: '2026-07-01T12:00:00.000Z',
      }),
    ];

    expect(taskNames(sortTasks(tasks))).toEqual([
      'Просроченная',
      'Активная',
      'Выполненная, но с прошлой датой',
    ]);
  });

  it('сортировка задач согласно всем правилам', () => {
    const tasks = [
      makeTask({
        id: '1',
        name: 'Выполненная',
        state: 'done',
        priority: 10,
        dueDate: '2026-01-01T12:00:00.000Z',
      }),
      makeTask({
        id: '2',
        name: 'Активная с поздним дедлайном',
        state: 'new',
        priority: 1,
        dueDate: '2026-09-01T12:00:00.000Z',
      }),
      makeTask({
        id: '3',
        name: 'Просроченная',
        state: 'overdue',
        priority: 1,
        dueDate: '2026-01-01T12:00:00.000Z',
      }),
      makeTask({
        id: '4',
        name: 'Активная с ранним дедлайном',
        state: 'new',
        priority: 1,
        dueDate: '2026-07-01T12:00:00.000Z',
      }),
      makeTask({
        id: '5',
        name: 'Активная с тем же дедлайном, но выше приоритет',
        state: 'new',
        priority: 5,
        dueDate: '2026-07-01T12:00:00.000Z',
      }),
    ];

    expect(taskNames(sortTasks(tasks))).toEqual([
      'Просроченная',
      'Активная с тем же дедлайном, но выше приоритет',
      'Активная с ранним дедлайном',
      'Активная с поздним дедлайном',
      'Выполненная',
    ]);
  });
});

describe('toDateTimeLocalValue', () => {
  it('возвращает пустую строку для невалидной даты', () => {
    expect(toDateTimeLocalValue('not-a-date')).toBe('');
  });

  it('возвращает значение в формате datetime-local', () => {
    const result = toDateTimeLocalValue('2026-10-24T12:00:00.000Z');
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}$/);
  });
});

describe('getTomorrowDateTimeLocal', () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2026-10-24T08:00:00.000Z'));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('возвращает завтрашний полдень в формате datetime-local', () => {
    const result = getTomorrowDateTimeLocal();
    expect(result).toMatch(/^\d{4}-\d{2}-\d{2}T12:00$/);

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const expectedDay = String(tomorrow.getDate()).padStart(2, '0');
    const expectedMonth = String(tomorrow.getMonth() + 1).padStart(2, '0');
    expect(
      result.startsWith(
        `${tomorrow.getFullYear()}-${expectedMonth}-${expectedDay}`,
      ),
    ).toBe(true);
  });
});

describe('getTaskPriorityLevel', () => {
  it('определяет уровень приоритета', () => {
    expect(getTaskPriorityLevel(1)).toBe('low');
    expect(getTaskPriorityLevel(2)).toBe('medium');
    expect(getTaskPriorityLevel(3)).toBe('high');
    expect(getTaskPriorityLevel(10)).toBe('high');
  });
});
