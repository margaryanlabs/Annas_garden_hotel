create table if not exists public.anna_guest_requests (
  id text primary key,
  request_type text not null,
  label text not null,
  message text,
  note text,
  guest_name text not null,
  room text not null,
  lang text,
  checkout_date date,
  status text not null default 'new' check (status in ('new','acknowledged','in_progress','done','cancelled')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  source text not null default 'guest_qr',
  assigned_to text,
  operator_note text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists anna_guest_requests_room_idx on public.anna_guest_requests(room);
create index if not exists anna_guest_requests_status_idx on public.anna_guest_requests(status, created_at desc);
create index if not exists anna_guest_requests_type_idx on public.anna_guest_requests(request_type, created_at desc);

alter table public.anna_guest_requests enable row level security;

-- No public policies on purpose. Guest writes and reception reads/updates go through
-- server routes using SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS.
