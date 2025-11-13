'use client'

import { CanvasLayer } from '@/types/canvas'

interface PropertyPanelProps {
  selectedLayer: CanvasLayer | null
  onLayerUpdate: (layerId: string, updates: Partial<CanvasLayer>) => void
}

export default function PropertyPanel({ selectedLayer, onLayerUpdate }: PropertyPanelProps) {
  if (!selectedLayer) {
    return (
      <div className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-full overflow-y-auto">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Properties
        </h3>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          Select a layer to edit its properties
        </p>
      </div>
    )
  }

  const handleUpdate = (updates: Partial<CanvasLayer>) => {
    onLayerUpdate(selectedLayer.id, updates)
  }

  return (
    <div className="w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-full overflow-y-auto">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
        Properties
      </h3>

      <div className="space-y-4">
        {/* Position */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Position
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                X
              </label>
              <input
                type="number"
                value={selectedLayer.x}
                onChange={(e) =>
                  handleUpdate({ x: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Y
              </label>
              <input
                type="number"
                value={selectedLayer.y}
                onChange={(e) =>
                  handleUpdate({ y: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Size */}
        <div>
          <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Size
          </h4>
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Width
              </label>
              <input
                type="number"
                value={selectedLayer.width}
                onChange={(e) =>
                  handleUpdate({ width: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-600 dark:text-gray-400 mb-1">
                Height
              </label>
              <input
                type="number"
                value={selectedLayer.height}
                onChange={(e) =>
                  handleUpdate({ height: parseFloat(e.target.value) || 0 })
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
          </div>
        </div>

        {/* Rotation */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Rotation
          </label>
          <input
            type="number"
            value={selectedLayer.rotation}
            onChange={(e) =>
              handleUpdate({ rotation: parseFloat(e.target.value) || 0 })
            }
            className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            min="0"
            max="360"
            step="1"
          />
        </div>

        {/* Opacity */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Opacity
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={selectedLayer.opacity}
            onChange={(e) =>
              handleUpdate({ opacity: parseFloat(e.target.value) })
            }
            className="w-full"
          />
          <span className="text-xs text-gray-600 dark:text-gray-400">
            {Math.round(selectedLayer.opacity * 100)}%
          </span>
        </div>

        {/* Text-specific properties */}
        {selectedLayer.type === 'text' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text Content
              </label>
              <textarea
                value={selectedLayer.text || ''}
                onChange={(e) => handleUpdate({ text: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Size
              </label>
              <input
                type="number"
                value={selectedLayer.fontSize || 24}
                onChange={(e) =>
                  handleUpdate({ fontSize: parseInt(e.target.value) || 24 })
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                min="8"
                max="200"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Font Family
              </label>
              <select
                value={selectedLayer.fontFamily || 'Arial'}
                onChange={(e) => handleUpdate({ fontFamily: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="Arial">Arial</option>
                <option value="Helvetica">Helvetica</option>
                <option value="Times New Roman">Times New Roman</option>
                <option value="Courier New">Courier New</option>
                <option value="Verdana">Verdana</option>
                <option value="Georgia">Georgia</option>
                <option value="Palatino">Palatino</option>
                <option value="Comic Sans MS">Comic Sans MS</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Text Color
              </label>
              <input
                type="color"
                value={selectedLayer.fill || '#000000'}
                onChange={(e) => handleUpdate({ fill: e.target.value })}
                className="w-full h-10 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Alignment
              </label>
              <select
                value={selectedLayer.align || 'left'}
                onChange={(e) =>
                  handleUpdate({
                    align: e.target.value as 'left' | 'center' | 'right',
                  })
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="left">Left</option>
                <option value="center">Center</option>
                <option value="right">Right</option>
              </select>
            </div>
          </>
        )}

        {/* Image-specific properties */}
        {selectedLayer.type === 'image' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Image URL
              </label>
              <input
                type="url"
                value={selectedLayer.imageUrl || ''}
                onChange={(e) => handleUpdate({ imageUrl: e.target.value })}
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                placeholder="https://example.com/image.jpg"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Object Fit
              </label>
              <select
                value={selectedLayer.objectFit || 'contain'}
                onChange={(e) =>
                  handleUpdate({
                    objectFit: e.target.value as 'contain' | 'cover' | 'fill',
                  })
                }
                className="w-full px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="contain">Contain</option>
                <option value="cover">Cover</option>
                <option value="fill">Fill</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

