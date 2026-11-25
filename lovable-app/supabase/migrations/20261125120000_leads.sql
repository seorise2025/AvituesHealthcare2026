-- Leads from the three website forms.
-- Row level security is ON with no policies: the public key cannot read or
-- write this table. Only the submit-lead edge function (service role) writes it.
create table if not exists public.leads (
  ref               text primary key,
  created_at        timestamptz not null default now(),
  form_type         text not null check (form_type in ('employer', 'candidate', 'general')),
  data              jsonb not null,
  context           jsonb not null default '{}'::jsonb,
  marketing_opt_in  boolean not null default false,
  marketing_wording text,
  status            text not null default 'received',
  email_ok          boolean not null default false,
  confirm_ok        boolean not null default false,
  ip_hash           text,
  last_error        text
);

alter table public.leads enable row level security;

create index if not exists leads_ip_recent on public.leads (ip_hash, created_at desc);
create index if not exists leads_created on public.leads (created_at desc);

-- Keep leads for 90 days, in line with the privacy notice. Schedule it daily
-- (Lovable Cloud / Supabase: Database > Cron) with:  select public.purge_old_leads();
create or replace function public.purge_old_leads(days integer default 90)
returns integer
language sql
security definer
set search_path = public
as $$
  with gone as (
    delete from public.leads where created_at < now() - make_interval(days => days) returning 1
  )
  select count(*)::integer from gone;
$$;

revoke all on function public.purge_old_leads(integer) from public, anon, authenticated;
