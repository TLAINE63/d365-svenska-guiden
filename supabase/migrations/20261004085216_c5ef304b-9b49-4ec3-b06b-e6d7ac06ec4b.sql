create table public.search_perf_daily (
  id bigserial primary key,
  source text not null check (source in ('gsc','bing')),
  day date not null,
  query text not null,
  page text not null default '',
  country text not null default 'swe',
  clicks integer not null default 0,
  impressions integer not null default 0,
  position numeric,
  group_tag text not null default 'Övrigt',
  fetched_at timestamptz not null default now(),
  unique (source, day, query, page)
);
create index on public.search_perf_daily (source, day);
create index on public.search_perf_daily (group_tag);
alter table public.search_perf_daily enable row level security;
grant all on public.search_perf_daily to service_role;
grant usage, select on sequence public.search_perf_daily_id_seq to service_role;

create table public.search_perf_runs (
  id uuid primary key default gen_random_uuid(),
  source text not null,
  started_at timestamptz not null default now(),
  range_start date, range_end date,
  rows_saved integer default 0,
  status text not null default 'running',
  error text
);
alter table public.search_perf_runs enable row level security;
grant all on public.search_perf_runs to service_role;

create table public.competitor_csv_imports (
  id uuid primary key default gen_random_uuid(),
  domain text not null,
  export_date date not null,
  filename text,
  rows_total integer default 0,
  rows_matched integer default 0,
  created_at timestamptz not null default now()
);
alter table public.competitor_csv_imports enable row level security;
grant all on public.competitor_csv_imports to service_role;

create table public.competitor_csv_rows (
  id bigserial primary key,
  import_id uuid not null references public.competitor_csv_imports(id) on delete cascade,
  keyword text not null,
  position numeric,
  volume integer,
  url text,
  phrase_id uuid,
  group_tag text
);
create index on public.competitor_csv_rows (import_id);
alter table public.competitor_csv_rows enable row level security;
grant all on public.competitor_csv_rows to service_role;
grant usage, select on sequence public.competitor_csv_rows_id_seq to service_role;