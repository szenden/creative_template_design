-- Create templates table
create table if not exists templates (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  channel text check (channel in ('facebook','instagram','linkedin','display')) not null,
  status text check (status in ('draft','active','archived')) default 'draft',
  created_at timestamp with time zone default now(),
  updated_at timestamp with time zone default now()
);

-- Create index on channel for faster queries
create index if not exists idx_templates_channel on templates(channel);

-- Create index on status for faster queries
create index if not exists idx_templates_status on templates(status);

-- Create index on created_at for faster sorting
create index if not exists idx_templates_created_at on templates(created_at desc);

