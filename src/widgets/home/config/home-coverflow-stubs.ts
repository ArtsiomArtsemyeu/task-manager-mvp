import type { TaskListDto } from '@/src/entities/task-list';
import type { Task } from '@/src/entities/task';

type StubListKey = 'work' | 'home' | 'health' | 'study' | 'finance';

type HomeCoverflowStubDefinition = {
  id: string;
  nameKey: StubListKey;
  tasks: Task[];
};

function dueIn(days: number): string {
  const date = new Date();
  date.setUTCHours(12, 0, 0, 0);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString();
}

export const HOME_COVERFLOW_STUB_DEFINITIONS: HomeCoverflowStubDefinition[] = [
  {
    id: 'stub-work',
    nameKey: 'work',
    tasks: [
      {
        id: 'stub-work-1',
        name: 'Plan sprint',
        description: '',
        state: 'done',
        priority: 2,
        dueDate: dueIn(-1),
      },
      {
        id: 'stub-work-2',
        name: 'Review design',
        description: '',
        state: 'in progress',
        priority: 2,
        dueDate: dueIn(4),
      },
      {
        id: 'stub-work-3',
        name: 'Send update',
        description: '',
        state: 'new',
        priority: 1,
        dueDate: dueIn(6),
      },
    ],
  },
  {
    id: 'stub-home',
    nameKey: 'home',
    tasks: [
      {
        id: 'stub-home-1',
        name: 'Groceries',
        description: '',
        state: 'new',
        priority: 1,
        dueDate: dueIn(5),
      },
      {
        id: 'stub-home-2',
        name: 'Pay bills',
        description: '',
        state: 'in progress',
        priority: 3,
        dueDate: dueIn(7),
      },
      {
        id: 'stub-home-3',
        name: 'Clean desk',
        description: '',
        state: 'done',
        priority: 1,
        dueDate: dueIn(-3),
      },
    ],
  },
  {
    id: 'stub-health',
    nameKey: 'health',
    tasks: [
      {
        id: 'stub-health-1',
        name: 'Morning run',
        description: '',
        state: 'done',
        priority: 2,
        dueDate: dueIn(-2),
      },
      {
        id: 'stub-health-2',
        name: 'Stretch',
        description: '',
        state: 'in progress',
        priority: 1,
        dueDate: dueIn(5),
      },
    ],
  },
  {
    id: 'stub-study',
    nameKey: 'study',
    tasks: [
      {
        id: 'stub-study-1',
        name: 'Read chapter',
        description: '',
        state: 'in progress',
        priority: 2,
        dueDate: dueIn(5),
      },
      {
        id: 'stub-study-2',
        name: 'Practice words',
        description: '',
        state: 'new',
        priority: 1,
        dueDate: dueIn(6),
      },
      {
        id: 'stub-study-3',
        name: 'Watch lesson',
        description: '',
        state: 'done',
        priority: 1,
        dueDate: dueIn(-1),
      },
      {
        id: 'stub-study-4',
        name: 'Write notes',
        description: '',
        state: 'new',
        priority: 2,
        dueDate: dueIn(8),
      },
    ],
  },
  {
    id: 'stub-finance',
    nameKey: 'finance',
    tasks: [
      {
        id: 'stub-finance-1',
        name: 'Check budget',
        description: '',
        state: 'done',
        priority: 2,
        dueDate: dueIn(-4),
      },
      {
        id: 'stub-finance-2',
        name: 'Save transfer',
        description: '',
        state: 'new',
        priority: 2,
        dueDate: dueIn(5),
      },
    ],
  },
];

export function buildHomeCoverflowStubs(
  resolveName: (key: StubListKey) => string,
): TaskListDto[] {
  return HOME_COVERFLOW_STUB_DEFINITIONS.map((stub) => ({
    id: stub.id,
    name: resolveName(stub.nameKey),
    userId: 'stub-user',
    tasks: stub.tasks,
  }));
}
