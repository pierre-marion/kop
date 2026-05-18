# Setup Supabase pour Kop

## 1. Variables d'environnement

Dans le fichier `.env` à la racine du repo (déjà créé si tu as suivi le flow) :

```
EXPO_PUBLIC_FOOTBALL_DATA_TOKEN=ta_clé_football_data
EXPO_PUBLIC_SUPABASE_URL=https://ton-projet.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

> Le fichier `.env` est gitignoré, donc ces secrets ne quittent pas ta machine.

## 2. SQL à exécuter dans Supabase

Va dans **Supabase Dashboard → SQL Editor → New query**, colle le bloc ci-dessous et clique **Run**.

```sql
-- ============================================
-- Tables
-- ============================================

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text,
  avatar_url text,
  theme text default 'auto' check (theme in ('dark', 'light', 'auto')),
  language text default 'fr' check (language in ('fr', 'en')),
  notif_live_matches boolean default true,
  notif_goals boolean default true,
  notif_news boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists public.favorites (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  kind text not null check (kind in ('team', 'competition', 'player')),
  entity_id text not null,
  display_name text,
  meta jsonb default '{}'::jsonb,
  created_at timestamptz default now(),
  unique (user_id, kind, entity_id)
);

create index if not exists favorites_user_idx on public.favorites(user_id);

-- ============================================
-- Row Level Security
-- ============================================

alter table public.profiles enable row level security;
alter table public.favorites enable row level security;

drop policy if exists "profiles_self_select" on public.profiles;
drop policy if exists "profiles_self_insert" on public.profiles;
drop policy if exists "profiles_self_update" on public.profiles;

create policy "profiles_self_select" on public.profiles
  for select using (auth.uid() = id);
create policy "profiles_self_insert" on public.profiles
  for insert with check (auth.uid() = id);
create policy "profiles_self_update" on public.profiles
  for update using (auth.uid() = id);

drop policy if exists "favorites_self_all" on public.favorites;

create policy "favorites_self_all" on public.favorites
  for all using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================
-- Trigger : crée un profil automatiquement à l'inscription
-- ============================================

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
```

## 3. Réglage Auth

Va dans **Authentication → Providers** :

- **Email** : activé par défaut. Pour le dev, tu peux **désactiver "Confirm email"** (Authentication → URL Configuration) pour ne pas avoir à confirmer chaque compte test.
- En prod : laisse la confirmation activée.

## 4. Tester

1. `npm install` (les nouvelles deps : Supabase, AsyncStorage, i18next, expo-localization, etc.)
2. Relance Expo (`npx expo start --clear` pour vider le cache)
3. Ouvre l'app, va sur **Profil** → **Créer un compte**
4. Inscris-toi avec un email
5. Vérifie dans Supabase Dashboard → Table Editor → `profiles` que ta ligne apparaît
6. Clique "Suivre" sur une équipe → vérifie dans `favorites` que la ligne apparaît

## Ce qui marche déjà

- ✅ Login / Register email+password
- ✅ Profile screen (paramètres : thème, langue, notifs)
- ✅ Favoris : bouton SUIVRE sur les pages équipe et compétition, sauvegardés localement + cloud si connecté
- ✅ Synchro favoris local ↔ cloud à la connexion
- ✅ Paramètres synchronisés sur le profil cloud si connecté

## Ce qui reste à faire (sessions suivantes)

- 🔜 Appliquer le thème clair à TOUS les composants existants (gros chantier — migrer du `colors` statique vers `useThemeColors()`)
- 🔜 Extraire toutes les strings dans les fichiers de traduction et utiliser `useTranslation` partout
- 🔜 OAuth Apple + Google (quand prêt pour la publication)
- 🔜 Notifications push (expo-notifications)
- 🔜 Page "Mes favoris" pour gérer ses suivis depuis le profile
