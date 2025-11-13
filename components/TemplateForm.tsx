'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Template } from './TemplateCard'

const templateSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100, 'Name is too long'),
  channel: z.enum(['facebook', 'instagram', 'linkedin', 'display'], {
    required_error: 'Channel is required',
  }),
  status: z
    .enum(['draft', 'active', 'archived'])
    .optional()
    .default('draft'),
})

export type TemplateFormData = z.infer<typeof templateSchema>

interface TemplateFormProps {
  template?: Template
  onSubmit: (data: TemplateFormData) => void | Promise<void>
  isSubmitting?: boolean
}

export default function TemplateForm({
  template,
  onSubmit,
  isSubmitting = false,
}: TemplateFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TemplateFormData>({
    resolver: zodResolver(templateSchema),
    defaultValues: template
      ? {
          name: template.name,
          channel: template.channel,
          status: template.status,
        }
      : {
          status: 'draft',
        },
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="space-y-6 max-w-2xl mx-auto"
    >
      <div>
        <label
          htmlFor="name"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Template Name
        </label>
        <input
          id="name"
          type="text"
          {...register('name')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
          placeholder="Enter template name"
        />
        {errors.name && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.name.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="channel"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Channel
        </label>
        <select
          id="channel"
          {...register('channel')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        >
          <option value="">Select a channel</option>
          <option value="facebook">Facebook</option>
          <option value="instagram">Instagram</option>
          <option value="linkedin">LinkedIn</option>
          <option value="display">Display</option>
        </select>
        {errors.channel && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.channel.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="status"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          Status
        </label>
        <select
          id="status"
          {...register('status')}
          className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-800 dark:text-white"
        >
          <option value="draft">Draft</option>
          <option value="active">Active</option>
          <option value="archived">Archived</option>
        </select>
        {errors.status && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.status.message}
          </p>
        )}
      </div>

      <div className="flex gap-4">
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {isSubmitting ? 'Saving...' : template ? 'Update Template' : 'Create Template'}
        </button>
        <a
          href="/templates"
          className="px-6 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
        >
          Cancel
        </a>
      </div>
    </form>
  )
}

