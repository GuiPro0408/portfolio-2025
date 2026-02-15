# MVP v1 Scope

This document defines what ships first for the portfolio product.

## Goal
Deliver a complete first vertical slice with public portfolio discovery and authenticated project management.

## Active Development Mode
- Local development database: SQLite
- `DB_URL` must stay empty during SQLite-first local development because it overrides connection behavior.

## In Scope
- Public homepage at `/` with intro, featured projects, and contact CTA.
- Public project listing at `/projects`.
- Public project detail at `/projects/{slug}` for published projects only.
- Authenticated project management under `/dashboard/projects/*`.
- One content model: `Project`.
- Feature tests for visibility, auth protection, and CRUD behavior.

## Out Of Scope
- Blog or article system.
- Rich text editor.
- File upload/media library.
- Role-based authorization.
- Multi-language support.

## Core Data Model
`projects` table columns:
- `title`, `slug`, `summary`, `body`
- `stack` (comma-separated string)
- `cover_image_url`, `repo_url`, `live_url`
- `is_featured`, `is_published`, `published_at`, `sort_order`

## Behavior Rules
- Slug is auto-generated from title when omitted, and remains editable.
- Public listing order: `sort_order ASC`, then `published_at DESC`.
- Featured homepage section shows published + featured projects only (max 3).
- If published is enabled and `published_at` is empty, set it automatically.
- If published is disabled, clear `published_at`.

## Contact
MVP contact CTA uses backend-provided config values exposed to frontend props:
- Email (`mailto`)
- LinkedIn profile
- GitHub profile

## Definition Of Done
- Public pages and admin CRUD routes implemented.
- Only published projects visible publicly.
- Authenticated users can create/update/delete projects.
- Test coverage added for public visibility and admin behavior.
- `make check` passes.
