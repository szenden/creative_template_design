'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase/client'
import TemplateForm, { TemplateFormData } from '@/components/TemplateForm'

export default function NewTemplatePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (data: TemplateFormData) => {
    setIsSubmitting(true)
    try {
      const { error } = await supabase.from('templates').insert([data])

      if (error) {
        console.error('Error creating template:', error)
        alert('Failed to create template. Please try again.')
        return
      }

      router.push('/templates')
      router.refresh()
    } catch (error) {
      console.error('Error creating template:', error)
      alert('Failed to create template. Please try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Create New Template
      </h1>
      <TemplateForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
    </div>
  )
}

