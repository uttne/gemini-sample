import { render, screen, fireEvent } from '@testing-library/react';
import LoadedFilesList from '../src/components/LoadedFilesList';
import { describe, it, expect, vi } from 'vitest';
import { TestResultFile } from '../src/types';

// Mock react-i18next
vi.mock('react-i18next', () => ({
  useTranslation: () => {
    return {
      t: (str: string) => str,
      i18n: {
        changeLanguage: () => new Promise(() => {}),
      },
    };
  },
  I18nextProvider: ({ children }: { children: React.ReactNode }) => children,
}));

// Extend the global interface to include mockOnDragEnd
declare global {
  var mockOnDragEnd: (event: { active: { id: string }; over: { id: string } }) => void;
}

// Mock @dnd-kit
vi.mock('@dnd-kit/core', () => ({
  DndContext: ({ children, onDragEnd }: { children: React.ReactNode; onDragEnd: (event: { active: { id: string }; over: { id: string } }) => void }) => {
    // Expose onDragEnd for testing
    global.mockOnDragEnd = onDragEnd;
    return <div>{children}</div>;
  },
  closestCenter: vi.fn(),
  KeyboardSensor: vi.fn(),
  PointerSensor: vi.fn(),
  useSensor: vi.fn(() => ({})),
  useSensors: vi.fn(() => ([{}])),
}));

vi.mock('@dnd-kit/sortable', () => ({
  SortableContext: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  sortableKeyboardCoordinates: vi.fn(),
  verticalListSortingStrategy: vi.fn(),
  useSortable: vi.fn(() => ({
    attributes: {},
    listeners: {},
    setNodeRef: vi.fn(),
    transform: { x: 0, y: 0, scaleX: 1, scaleY: 1 },
    transition: 'transform 0.2s ease-in-out',
  })),
  arrayMove: vi.fn((array: TestResultFile[], oldIndex: number, newIndex: number): TestResultFile[] => {
    const newArray = [...array];
    const [removed] = newArray.splice(oldIndex, 1);
    newArray.splice(newIndex, 0, removed);
    return newArray;
  }),
}));

describe('LoadedFilesList', () => {
  const mockFiles: TestResultFile[] = [
    {
      id: '1',
      fileName: 'file1.xml',
      suite: {
        name: 'Suite1',
        tests: 1,
        failures: 0,
        errors: 0,
        skipped: 0,
        time: 1,
        testcases: [],
      },
    },
    {
      id: '2',
      fileName: 'file2.xml',
      suite: {
        name: 'Suite2',
        tests: 1,
        failures: 0,
        errors: 0,
        skipped: 0,
        time: 1,
        testcases: [],
      },
    },
  ];

  it('renders noFilesLoaded message when no files are provided', () => {
    render(<LoadedFilesList files={[]} onDelete={vi.fn()} onReorder={vi.fn()} />);
    expect(screen.getByText('noFilesLoaded')).toBeInTheDocument();
    expect(screen.queryByText('file1.xml')).not.toBeInTheDocument();
  });

  it('renders file names and delete buttons when files are provided', () => {
    render(<LoadedFilesList files={mockFiles} onDelete={vi.fn()} onReorder={vi.fn()} />);
    expect(screen.getByText('file1.xml')).toBeInTheDocument();
    expect(screen.getByText('file2.xml')).toBeInTheDocument();
    expect(screen.getAllByRole('button', { name: 'Delete' }).length).toBe(2);
  });

  it('calls onDelete when delete button is clicked', () => {
    const onDeleteMock = vi.fn();
    render(<LoadedFilesList files={mockFiles} onDelete={onDeleteMock} onReorder={vi.fn()} />);

    fireEvent.click(screen.getAllByRole('button', { name: 'Delete' })[0]);
    expect(onDeleteMock).toHaveBeenCalledTimes(1);
    expect(onDeleteMock).toHaveBeenCalledWith('1');
  });

  it('calls onReorder when drag ends and order changes', () => {
    const onReorderMock = vi.fn();
    render(<LoadedFilesList files={mockFiles} onDelete={vi.fn()} onReorder={onReorderMock} />);

    // Simulate drag end event
    global.mockOnDragEnd({
      active: { id: '1' },
      over: { id: '2' },
    });

    expect(onReorderMock).toHaveBeenCalledTimes(1);
    expect(onReorderMock).toHaveBeenCalledWith([
      {
        id: '2',
        fileName: 'file2.xml',
        suite: {
          name: 'Suite2',
          tests: 1,
          failures: 0,
          errors: 0,
          skipped: 0,
          time: 1,
          testcases: [],
        },
      },
      {
        id: '1',
        fileName: 'file1.xml',
        suite: {
          name: 'Suite1',
          tests: 1,
          failures: 0,
          errors: 0,
          skipped: 0,
          time: 1,
          testcases: [],
        },
      },
    ]);
  });
});