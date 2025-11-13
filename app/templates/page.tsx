import { supabase } from '@/lib/supabase/client'
import TemplateCard, { Template } from '@/components/TemplateCard'
import Link from 'next/link'

async function getTemplates(): Promise<Template[]> {
  const { data, error } = await supabase
    .from('templates')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching templates:', error)
    return []
  }

  return data || []
}

export default async function TemplatesPage() {
  const templates = await getTemplates()

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Templates
        </h1>
        <Link
          href="/templates/new"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Create Template
        </Link>
      </div>

      {templates.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 dark:text-gray-400 mb-4">
            No templates found. Create your first template to get started.
          </p>
          <Link
            href="/templates/new"
            className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Create Template
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} />
          ))}
        </div>
      )}
    </div>
  )
}

