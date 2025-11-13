'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import { CanvasLayer } from '@/types/canvas'
import CanvasEditor from '@/components/CanvasEditor'
import PropertyPanel from '@/components/PropertyPanel'
import LayerList from '@/components/LayerList'
import Link from 'next/link'

interface Template {
  id: string
  name: string
  channel: 'facebook' | 'instagram' | 'linkedin' | 'display'
  status: 'draft' | 'active' | 'archived'
  created_at: string
  updated_at: string
  canvas?: CanvasLayer[] | null
}

export default function TemplateDetailPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const [template, setTemplate] = useState<Template | null>(null)
  const [layers, setLayers] = useState<CanvasLayer[]>([])
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saveMessage, setSaveMessage] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTemplate() {
      try {
        const { data, error } = await supabase
          .from('templates')
          .select('*')
          .eq('id', id)
          .single()

        if (error) {
          console.error('Error fetching template:', error)
          router.push('/templates')
          return
        }

        setTemplate(data)
        if (data.canvas && Array.isArray(data.canvas)) {
          setLayers(data.canvas)
        }
      } catch (error) {
        console.error('Error fetching template:', error)
        router.push('/templates')
      } finally {
        setLoading(false)
      }
    }

    if (id) {
      fetchTemplate()
    }
  }, [id, router])

  const handleAddLayer = (type: 'text' | 'image') => {
    const newLayer: CanvasLayer = {
      id: `layer-${Date.now()}`,
      type,
      x: 100,
      y: 100,
      width: type === 'text' ? 200 : 150,
      height: type === 'text' ? 50 : 150,
      rotation: 0,
      opacity: 1,
      ...(type === 'text'
        ? {
            text: 'New Text',
            fontSize: 24,
            fontFamily: 'Arial',
            fill: '#000000',
            align: 'left' as const,
          }
        : {
            imageUrl: '',
            objectFit: 'contain' as const,
          }),
    }
    setLayers([...layers, newLayer])
    setSelectedLayerId(newLayer.id)
  }

  const handleLayerUpdate = (layerId: string, updates: Partial<CanvasLayer>) => {
    setLayers(
      layers.map((layer) =>
        layer.id === layerId ? { ...layer, ...updates } : layer
      )
    )
  }

  const handleLayerDelete = (layerId: string) => {
    setLayers(layers.filter((layer) => layer.id !== layerId))
    if (selectedLayerId === layerId) {
      setSelectedLayerId(null)
    }
  }

  const handleLayerReorder = (newOrder: CanvasLayer[]) => {
    setLayers(newOrder)
  }

  const handleLayerMove = (layerId: string, direction: 'up' | 'down') => {
    const index = layers.findIndex((l) => l.id === layerId)
    if (index === -1) return

    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= layers.length) return

    const newLayers = [...layers]
    const [moved] = newLayers.splice(index, 1)
    newLayers.splice(newIndex, 0, moved)
    setLayers(newLayers)
  }

  const handleSave = async () => {
    if (!template) return

    setSaving(true)
    setSaveMessage(null)

    try {
      const { error } = await supabase
        .from('templates')
        .update({
          canvas: layers,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) {
        console.error('Error saving canvas:', error)
        setSaveMessage('Failed to save. Please try again.')
        return
      }

      setSaveMessage('Saved successfully!')
      setTimeout(() => setSaveMessage(null), 3000)
    } catch (error) {
      console.error('Error saving canvas:', error)
      setSaveMessage('Failed to save. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Loading...</div>
      </div>
    )
  }

  if (!template) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">Template not found</div>
      </div>
    )
  }

  const selectedLayer = layers.find((l) => l.id === selectedLayerId) || null

  const channelColors: Record<Template['channel'], string> = {
    facebook: 'bg-blue-100 text-blue-800',
    instagram: 'bg-pink-100 text-pink-800',
    linkedin: 'bg-blue-100 text-blue-800',
    display: 'bg-purple-100 text-purple-800',
  }

  const statusColors: Record<Template['status'], string> = {
    draft: 'bg-gray-100 text-gray-800',
    active: 'bg-green-100 text-green-800',
    archived: 'bg-yellow-100 text-yellow-800',
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <Link
              href="/templates"
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white"
            >
              ← Back to Templates
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {template.name}
            </h1>
          </div>
          <div className="flex items-center gap-4">
            <span
              className={`px-3 py-1 text-sm font-medium rounded ${statusColors[template.status]}`}
            >
              {template.status}
            </span>
            <span
              className={`px-3 py-1 text-sm font-medium rounded ${channelColors[template.channel]}`}
            >
              {template.channel}
            </span>
            <button
              onClick={handleSave}
              disabled={saving}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
            {saveMessage && (
              <span
                className={`text-sm ${
                  saveMessage.includes('Failed')
                    ? 'text-red-600'
                    : 'text-green-600'
                }`}
              >
                {saveMessage}
              </span>
            )}
          </div>
        </div>

        {/* Add Layer Buttons */}
        <div className="flex gap-2 mb-4">
          <button
            onClick={() => handleAddLayer('text')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            + Add Text
          </button>
          <button
            onClick={() => handleAddLayer('image')}
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            + Add Image
          </button>
        </div>
      </div>

      {/* Main Editor Layout */}
      <div className="grid grid-cols-[256px_1fr_320px] gap-4 h-[calc(100vh-280px)]">
        {/* Layer List */}
        <LayerList
          layers={layers}
          selectedLayerId={selectedLayerId}
          onLayerSelect={setSelectedLayerId}
          onLayerDelete={handleLayerDelete}
          onLayerReorder={handleLayerReorder}
          onLayerMove={handleLayerMove}
        />

        {/* Canvas Editor */}
        <CanvasEditor
          layers={layers}
          selectedLayerId={selectedLayerId}
          onLayerSelect={setSelectedLayerId}
          onLayerUpdate={handleLayerUpdate}
          onLayerDelete={handleLayerDelete}
          stageWidth={800}
          stageHeight={600}
        />

        {/* Property Panel */}
        <PropertyPanel
          selectedLayer={selectedLayer}
          onLayerUpdate={handleLayerUpdate}
        />
      </div>
    </div>
  )
}

