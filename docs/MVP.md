# MVP v1 Scope

This document defines what ships first for the portfolio product.

## MVP Status
- Status: Complete
- Completion date: February 15, 2026
- Quality gate: `make check` passing

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
- Authenticated homepage settings management under `/dashboard/homepage`.
- Authenticated dashboard UX with workflow-first project operations (filters and inline flags).
- One content model: `Project`.
- One singleton settings model: `HomepageSettings`.
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

`homepage_settings` table columns:
- Hero copy: `hero_eyebrow`, `hero_headline`, `hero_subheadline`
- Hero CTA labels: `hero_primary_cta_label`, `hero_secondary_cta_label`
- Section headings/subtitles and final CTA labels
- Homepage image URLs: `hero_image_url`, `featured_image_1_url`, `featured_image_2_url`, `featured_image_3_url`, `capabilities_image_url`, `process_image_url`

## Behavior Rules
- Slug is auto-generated from title when omitted, and remains editable.
- Public listing order: `sort_order ASC`, then `published_at DESC`.
- Featured homepage section shows published + featured projects only (max 3).
- If published is enabled and `published_at` is empty, set it automatically.
- If published is disabled, clear `published_at`.
- Admin project list supports query filters:
  - `q`, `status`, `featured`, `sort`
- Admin inline flag updates are handled through:
  - `PATCH /dashboard/projects/{project}/flags`

## Contact
MVP contact CTA uses backend-provided config values exposed to frontend props:
- Email (`mailto`)
- LinkedIn profile
- GitHub profile

## Homepage Content Management
- Homepage primary copy and section image URLs are managed from `/dashboard/homepage`.
- Missing image URLs use frontend placeholders; no media upload pipeline is part of MVP.

## Definition Of Done
- Public pages and admin CRUD routes implemented.
- Only published projects visible publicly.
- Authenticated users can create/update/delete projects.
- Test coverage added for public visibility and admin behavior.
- `make check` passes.
