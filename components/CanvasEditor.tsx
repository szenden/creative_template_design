'use client'

import { useRef, useEffect, useState } from 'react'
import { Stage, Layer, Text, Image, Transformer } from 'react-konva'
import Konva from 'konva'
import { CanvasLayer } from '@/types/canvas'

interface CanvasEditorProps {
  layers: CanvasLayer[]
  selectedLayerId: string | null
  onLayerSelect: (layerId: string | null) => void
  onLayerUpdate: (layerId: string, updates: Partial<CanvasLayer>) => void
  onLayerDelete: (layerId: string) => void
  stageWidth?: number
  stageHeight?: number
}

export default function CanvasEditor({
  layers,
  selectedLayerId,
  onLayerSelect,
  onLayerUpdate,
  onLayerDelete,
  stageWidth = 800,
  stageHeight = 600,
}: CanvasEditorProps) {
  const stageRef = useRef<Konva.Stage>(null)
  const transformerRef = useRef<Konva.Transformer>(null)
  const [imageCache, setImageCache] = useState<Record<string, HTMLImageElement>>({})
  const [imageErrors, setImageErrors] = useState<Record<string, boolean>>({})

  // Update transformer when selection changes
  useEffect(() => {
    if (!transformerRef.current || !selectedLayerId) {
      transformerRef.current?.nodes([])
      return
    }

    const selectedNode = stageRef.current?.findOne(`#${selectedLayerId}`)
    if (selectedNode) {
      transformerRef.current.nodes([selectedNode])
      transformerRef.current.getLayer()?.batchDraw()
    }
  }, [selectedLayerId])

  // Load images
  useEffect(() => {
    if (typeof window === 'undefined') return

    layers.forEach((layer) => {
      if (layer.type === 'image' && layer.imageUrl) {
        // If image is already cached and not in error state, skip
        if (imageCache[layer.imageUrl] && !imageErrors[layer.imageUrl]) {
          return
        }

        // Clear error state if URL changed
        if (imageErrors[layer.imageUrl]) {
          setImageErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors[layer.imageUrl!]
            return newErrors
          })
        }

        const img = document.createElement('img')
        
        // Try with crossOrigin first, but don't fail if CORS is not supported
        // Some servers don't support CORS but still allow image loading
        try {
          img.crossOrigin = 'anonymous'
        } catch {
          // Ignore crossOrigin errors
        }
        
        img.src = layer.imageUrl
        
        img.onload = () => {
          setImageCache((prev) => ({ ...prev, [layer.imageUrl!]: img }))
          setImageErrors((prev) => {
            const newErrors = { ...prev }
            delete newErrors[layer.imageUrl!]
            return newErrors
          })
        }
        
        img.onerror = () => {
          const imageUrl = layer.imageUrl
          if (!imageUrl) return
          
          console.error('Failed to load image:', imageUrl)
          setImageErrors((prev) => ({ ...prev, [imageUrl]: true }))
          
          // Try loading without crossOrigin as fallback
          if (img.crossOrigin) {
            const fallbackImg = document.createElement('img')
            fallbackImg.src = imageUrl
            fallbackImg.onload = () => {
              setImageCache((prev) => ({ ...prev, [imageUrl]: fallbackImg }))
              setImageErrors((prev) => {
                const newErrors = { ...prev }
                delete newErrors[imageUrl]
                return newErrors
              })
            }
            fallbackImg.onerror = () => {
              console.error('Failed to load image even without CORS:', imageUrl)
            }
          }
        }
      }
    })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layers])

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedLayerId) return

      const selectedLayer = layers.find((l) => l.id === selectedLayerId)
      if (!selectedLayer) return

      const nudgeAmount = e.shiftKey ? 10 : 1

      if (e.key === 'ArrowUp') {
        e.preventDefault()
        onLayerUpdate(selectedLayerId, { y: selectedLayer.y - nudgeAmount })
      } else if (e.key === 'ArrowDown') {
        e.preventDefault()
        onLayerUpdate(selectedLayerId, { y: selectedLayer.y + nudgeAmount })
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        onLayerUpdate(selectedLayerId, { x: selectedLayer.x - nudgeAmount })
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        onLayerUpdate(selectedLayerId, { x: selectedLayer.x + nudgeAmount })
      } else if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault()
        onLayerDelete(selectedLayerId)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [selectedLayerId, layers, onLayerUpdate, onLayerDelete])

  const handleLayerDragEnd = (layerId: string, e: Konva.KonvaEventObject<DragEvent>) => {
    const node = e.target
    onLayerUpdate(layerId, {
      x: node.x(),
      y: node.y(),
    })
  }

  const handleLayerTransformEnd = (layerId: string, e: Konva.KonvaEventObject<Event>) => {
    const node = e.target
    const scaleX = node.scaleX()
    const scaleY = node.scaleY()

    // Reset scale and update width/height
    node.scaleX(1)
    node.scaleY(1)

    onLayerUpdate(layerId, {
      x: node.x(),
      y: node.y(),
      width: Math.max(5, node.width() * scaleX),
      height: Math.max(5, node.height() * scaleY),
      rotation: node.rotation(),
    })
  }

  const handleStageClick = (e: Konva.KonvaEventObject<MouseEvent>) => {
    const clickedOnEmpty = e.target === e.target.getStage()
    if (clickedOnEmpty) {
      onLayerSelect(null)
    }
  }

  return (
    <div className="bg-gray-100 dark:bg-gray-900 rounded-lg p-4 overflow-auto">
      <div className="inline-block bg-white dark:bg-gray-800 rounded shadow-lg">
        <Stage
          ref={stageRef}
          width={stageWidth}
          height={stageHeight}
          onClick={handleStageClick}
          onTap={handleStageClick}
        >
          <Layer>
            {layers.map((layer) => {
              const key = layer.id

              if (layer.type === 'text') {
                return (
                  <Text
                    key={key}
                    id={layer.id}
                    x={layer.x}
                    y={layer.y}
                    width={layer.width}
                    height={layer.height}
                    rotation={layer.rotation}
                    opacity={layer.opacity}
                    text={layer.text || ''}
                    fontSize={layer.fontSize || 24}
                    fontFamily={layer.fontFamily || 'Arial'}
                    fill={layer.fill || '#000000'}
                    align={layer.align || 'left'}
                    draggable
                    onClick={() => onLayerSelect(layer.id)}
                    onTap={() => onLayerSelect(layer.id)}
                    onDragEnd={(e) => handleLayerDragEnd(layer.id, e)}
                    onTransformEnd={(e) => handleLayerTransformEnd(layer.id, e)}
                  />
                )
              } else if (layer.type === 'image') {
                const img = imageCache[layer.imageUrl || '']
                const hasError = imageErrors[layer.imageUrl || '']
                
                // Show placeholder if image is loading or has error
                if (!img || hasError) {
                  // Center text vertically by adjusting y position
                  const textY = layer.y + layer.height / 2 - 7 // Approximate center
                  return (
                    <Text
                      key={key}
                      id={layer.id}
                      x={layer.x}
                      y={textY}
                      width={layer.width}
                      height={layer.height}
                      rotation={layer.rotation}
                      opacity={layer.opacity * 0.5}
                      text={hasError ? 'Image failed to load' : 'Loading image...'}
                      fontSize={14}
                      fontFamily="Arial"
                      fill="#999999"
                      align="center"
                      draggable
                      onClick={() => onLayerSelect(layer.id)}
                      onTap={() => onLayerSelect(layer.id)}
                      onDragEnd={(e) => handleLayerDragEnd(layer.id, e)}
                      onTransformEnd={(e) => handleLayerTransformEnd(layer.id, e)}
                    />
                  )
                }

                let imageWidth = img.width
                let imageHeight = img.height

                // Apply objectFit
                if (layer.objectFit === 'contain') {
                  const scale = Math.min(
                    layer.width / img.width,
                    layer.height / img.height
                  )
                  imageWidth = img.width * scale
                  imageHeight = img.height * scale
                } else if (layer.objectFit === 'cover') {
                  const scale = Math.max(
                    layer.width / img.width,
                    layer.height / img.height
                  )
                  imageWidth = img.width * scale
                  imageHeight = img.height * scale
                } else {
                  imageWidth = layer.width
                  imageHeight = layer.height
                }

                return (
                  // eslint-disable-next-line jsx-a11y/alt-text
                  <Image
                    key={key}
                    id={layer.id}
                    x={layer.x}
                    y={layer.y}
                    width={imageWidth}
                    height={imageHeight}
                    rotation={layer.rotation}
                    opacity={layer.opacity}
                    image={img}
                    draggable
                    onClick={() => onLayerSelect(layer.id)}
                    onTap={() => onLayerSelect(layer.id)}
                    onDragEnd={(e) => handleLayerDragEnd(layer.id, e)}
                    onTransformEnd={(e) => handleLayerTransformEnd(layer.id, e)}
                  />
                )
              }
              return null
            })}
            <Transformer
              ref={transformerRef}
              boundBoxFunc={(oldBox, newBox) => {
                // Limit minimum size
                if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
                  return oldBox
                }
                return newBox
              }}
            />
          </Layer>
        </Stage>
      </div>
    </div>
  )
}

