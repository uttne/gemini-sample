import React from 'react';
import { useTranslation } from 'react-i18next';
import type { TestResultFile } from '../types';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
  arrayMove,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

interface Props {
  files: TestResultFile[];
  onDelete: (id: string) => void;
  onReorder: (newOrder: TestResultFile[]) => void;
}

const SortableItem: React.FC<{ file: TestResultFile; onDelete: (id: string) => void }> = ({ file, onDelete }) => {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: file.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      className="flex items-center justify-between py-2"
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab pr-2 text-gray-400 hover:text-gray-600"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM3 15a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      <span className="text-gray-700">{file.fileName}</span>
      <button
        onClick={() => onDelete(file.id)}
        className="rounded-md bg-red-500 px-3 py-1 text-sm font-medium text-white hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
      >
        Delete
      </button>
    </li>
  );
};

const LoadedFilesList: React.FC<Props> = ({ files, onDelete, onReorder }) => {
  const { t } = useTranslation();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      const oldIndex = files.findIndex((file) => file.id === active.id);
      const newIndex = files.findIndex((file) => file.id === over?.id);
      onReorder(arrayMove(files, oldIndex, newIndex));
    }
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-xl font-semibold text-gray-800">{t('loadedFilesTitle')}</h2>
      {files.length === 0 ? (
        <p className="text-gray-500">{t('noFilesLoaded')}</p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext items={files.map(file => file.id)} strategy={verticalListSortingStrategy}>
            <ul className="divide-y divide-gray-200 max-h-64 overflow-y-auto">
              {files.map((file) => (
                <SortableItem key={file.id} file={file} onDelete={onDelete} />
              ))}
            </ul>
          </SortableContext>
        </DndContext>
      )}
    </div>
  );
};

export default LoadedFilesList;