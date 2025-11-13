'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import TemplateForm, { TemplateFormData } from '@/components/TemplateForm'
import TemplateCard, { Template } from '@/components/TemplateCard'

export default function EditTemplatePage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string
  const [template, setTemplate] = useState<Template | null>(null)
  const [loading, setLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)

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

  const handleSubmit = async (data: TemplateFormData) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase
        .from('templates')
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq('id', id)

      if (error) {
        console.error('Error updating template:', error)
        alert('Failed to update template. Please try again.')
        return
      }

      router.push('/templates')
      router.refresh()
    } catch (error) {
      console.error('Error updating template:', error)
      alert('Failed to update template. Please try again.')
    } finally {
      setIsSubmitting(false)
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

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Edit Template
      </h1>
      <TemplateForm
        template={template}
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  )
}

