create table if not exists public.anna_stays (
  id text primary key,
  booking_ref text,
  guest_name text not null,
  room text not null,
  checkin_date date not null,
  checkout_date date not null,
  status text not null default 'booked' check (status in ('booked','arriving','checked_in','checked_out','cancelled')),
  source text not null default 'manual',
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.anna_room_ops (
  room text primary key,
  housekeeping_status text not null default 'clean' check (housekeeping_status in ('clean','dirty','in_progress','inspected','dnd')),
  room_note text,
  updated_at timestamptz not null default now()
);

create table if not exists public.anna_shift_handover (
  id text primary key,
  message text not null,
  created_by text,
  pinned boolean not null default false,
  resolved_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.anna_payment_events (
  id text primary key,
  booking_ref text,
  provider text not null,
  amount numeric(12,2),
  currency text,
  status text not null,
  room text,
  guest_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists anna_stays_dates_idx on public.anna_stays(checkin_date, checkout_date);
create index if not exists anna_stays_room_idx on public.anna_stays(room, status);
create index if not exists anna_shift_handover_open_idx on public.anna_shift_handover(resolved_at, pinned, created_at desc);
create index if not exists anna_payment_events_booking_idx on public.anna_payment_events(booking_ref, created_at desc);

alter table public.anna_stays enable row level security;
alter table public.anna_room_ops enable row level security;
alter table public.anna_shift_handover enable row level security;
alter table public.anna_payment_events enable row level security;

-- No public policies by design. Reception server routes use a server-only
-- Supabase service-role key and guest-facing code never receives it.
