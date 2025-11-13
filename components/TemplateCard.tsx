import Link from 'next/link'

export interface Template {
  id: string
  name: string
  channel: 'facebook' | 'instagram' | 'linkedin' | 'display'
  status: 'draft' | 'active' | 'archived'
  created_at: string
  updated_at: string
  canvas?: any
}

interface TemplateCardProps {
  template: Template
}

export default function TemplateCard({ template }: TemplateCardProps) {
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
    <Link
      href={`/templates/${template.id}`}
      className="block p-6 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between mb-2">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          {template.name}
        </h3>
        <span
          className={`px-2 py-1 text-xs font-medium rounded ${statusColors[template.status]}`}
        >
          {template.status}
        </span>
      </div>
      <div className="flex items-center gap-2 mt-4">
        <span
          className={`px-3 py-1 text-sm font-medium rounded ${channelColors[template.channel]}`}
        >
          {template.channel}
        </span>
        <span className="text-sm text-gray-500 dark:text-gray-400">
          {new Date(template.created_at).toLocaleDateString()}
        </span>
      </div>
    </Link>
  )
}

