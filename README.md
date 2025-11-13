# Instama - Creative Templates & Designs App

A Next.js 14+ application for managing creative templates and designs with Supabase backend.

## Tech Stack

- **Frontend**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Auth)
- **Validation**: React Hook Form + Zod
- **State Management**: React hooks (useState/useEffect)

## Getting Started

### Prerequisites

- Node.js 18+ installed
- A Supabase project (sign up at [supabase.com](https://supabase.com))

### Installation

1. Install dependencies:

```bash
npm install
```

2. Set up environment variables:

Copy `.env.local.example` to `.env.local` and fill in your Supabase credentials:

```bash
cp .env.local.example .env.local
```

Update `.env.local` with your Supabase project URL and anon key:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

3. Set up the database:

Run the SQL schema in your Supabase SQL Editor:

```bash
# Open supabase/schema.sql and run it in Supabase SQL Editor
```

Or execute this SQL in your Supabase dashboard:

```sql
create table if not exists templates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  channel text check (channel in ('facebook','instagram','linkedin','display')) not null,
  status text check (status in ('draft','active','archived')) default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

create index if not exists idx_templates_channel on templates(channel);
create index if not exists idx_templates_status on templates(status);
create index if not exists idx_templates_created_at on templates(created_at desc);
```

4. Run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
app/
  templates/
    page.tsx                  # Templates list page
    new/page.tsx              # Create template page
    [id]/edit/page.tsx        # Edit template page
  layout.tsx
  globals.css
lib/
  supabase/
    client.ts                 # Supabase client configuration
components/
  TemplateCard.tsx            # Template card component
  TemplateForm.tsx          # Template form component
supabase/
  schema.sql                  # Database schema
```

## Features

- ✅ Create, read, update templates
- ✅ Filter by channel (Facebook, Instagram, LinkedIn, Display)
- ✅ Template status management (Draft, Active, Archived)
- ✅ Form validation with React Hook Form + Zod
- ✅ Responsive design with Tailwind CSS

## Learn More

- [Next.js Documentation](https://nextjs.org/docs)
- [Supabase Documentation](https://supabase.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
