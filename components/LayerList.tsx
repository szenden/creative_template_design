'use client'

import { CanvasLayer } from '@/types/canvas'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface LayerListProps {
  layers: CanvasLayer[]
  selectedLayerId: string | null
  onLayerSelect: (layerId: string) => void
  onLayerDelete: (layerId: string) => void
  onLayerReorder: (newOrder: CanvasLayer[]) => void
  onLayerMove: (layerId: string, direction: 'up' | 'down') => void
}

interface SortableLayerItemProps {
  layer: CanvasLayer
  isSelected: boolean
  onSelect: () => void
  onDelete: () => void
}

function SortableLayerItem({
  layer,
  isSelected,
  onSelect,
  onDelete,
}: SortableLayerItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: layer.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-3 rounded-lg border cursor-pointer transition-colors ${
        isSelected
          ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-700'
          : 'bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
      }`}
      onClick={onSelect}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M5 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM5 7a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2zM5 12a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6 0a1 1 0 1 0 0 2 1 1 0 0 0 0-2z" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <div className="text-sm font-medium text-gray-900 dark:text-white truncate">
          {layer.type === 'text'
            ? `Text: ${layer.text?.substring(0, 20) || 'Empty'}...`
            : `Image: ${layer.imageUrl?.split('/').pop() || 'No URL'}`}
        </div>
        <div className="text-xs text-gray-500 dark:text-gray-400">
          {Math.round(layer.width)} × {Math.round(layer.height)}
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          onDelete()
        }}
        className="p-1 text-red-500 hover:text-red-700 dark:hover:text-red-400 transition-colors"
        title="Delete layer"
      >
        <svg
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="currentColor"
        >
          <path d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 5.885 16h4.23a2 2 0 0 0 1.994-1.84L13.962 3.5h.538a.5.5 0 0 0 0-1H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-4.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Z" />
        </svg>
      </button>
    </div>
  )
}

export default function LayerList({
  layers,
  selectedLayerId,
  onLayerSelect,
  onLayerDelete,
  onLayerReorder,
  onLayerMove,
}: LayerListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event

    if (over && active.id !== over.id) {
      const oldIndex = layers.findIndex((layer) => layer.id === active.id)
      const newIndex = layers.findIndex((layer) => layer.id === over.id)
      const newOrder = arrayMove(layers, oldIndex, newIndex)
      onLayerReorder(newOrder)
    }
  }

  return (
    <div className="w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 h-full overflow-y-auto">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Layers
        </h3>
        <span className="text-xs text-gray-500 dark:text-gray-400">
          {layers.length}
        </span>
      </div>

      {layers.length === 0 ? (
        <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-8">
          No layers yet. Add a text or image layer to get started.
        </p>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={layers.map((l) => l.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
              {layers.map((layer, index) => (
                <div key={layer.id} className="relative">
                  <SortableLayerItem
                    layer={layer}
                    isSelected={selectedLayerId === layer.id}
                    onSelect={() => onLayerSelect(layer.id)}
                    onDelete={() => onLayerDelete(layer.id)}
                  />
                  <div className="absolute right-12 top-1/2 -translate-y-1/2 flex gap-1">
                    {index > 0 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onLayerMove(layer.id, 'up')
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Move up"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M8 15a.5.5 0 0 0 .5-.5V2.707l3.146 3.147a.5.5 0 0 0 .708-.708l-4-4a.5.5 0 0 0-.708 0l-4 4a.5.5 0 1 0 .708.708L7.5 2.707V14.5A.5.5 0 0 0 8 15z" />
                        </svg>
                      </button>
                    )}
                    {index < layers.length - 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onLayerMove(layer.id, 'down')
                        }}
                        className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        title="Move down"
                      >
                        <svg
                          width="12"
                          height="12"
                          viewBox="0 0 16 16"
                          fill="currentColor"
                        >
                          <path d="M8 1a.5.5 0 0 1 .5.5v11.793l3.146-3.147a.5.5 0 0 1 .708.708l-4 4a.5.5 0 0 1-.708 0l-4-4a.5.5 0 0 1 .708-.708L7.5 13.293V1.5A.5.5 0 0 1 8 1z" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </SortableContext>
        </DndContext>
      )}
    </div>
  )
}

