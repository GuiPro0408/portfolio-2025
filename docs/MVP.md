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
- Public project listing at `/projects` with server-driven filtering (`q`, `stack`, `sort`), pagination (9 per page), debounced search, multi-stack filtering, active-filter chips, and skeleton loading states.
- Public project detail at `/projects/{slug}` for published projects only, with JSON-LD structured data (`CreativeWork`, `BreadcrumbList`), OpenGraph/Twitter meta, and canonical URLs.
- Public contact page at `/contact` with form submission, honeypot/anti-spam, throttle protection, and queued email dispatch.
- SEO endpoints: `/sitemap.xml` and `/robots.txt`.
- Owner-only authenticated project management under `/dashboard/projects/*`.
- Owner-only authenticated homepage settings management under `/dashboard/homepage`.
- Authenticated dashboard UX with workflow-first project operations (filters and inline flags).
- Two content models: `Project` and `Technology` (with `project_technology` pivot table).
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

`technologies` table columns:
- `name`, `name_normalized` (lowercase, used for case-insensitive filtering)

`project_technology` pivot table:
- Links `project_id` to `technology_id`; derived from the `stack` field via `SyncProjectTechnologies` action.

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
- Public project list supports query filters:
  - `q` — free-text search matching title, summary, and technology names (case-insensitive).
  - `stack` — comma-separated technology names for multi-stack filtering.
  - `sort` — `editorial` (default), `newest`, `oldest`.
  - Pagination: 9 per page.
- Admin project list supports query filters:
  - `q`, `status`, `featured`, `sort`
- Admin inline flag updates are handled through:
  - `PATCH /dashboard/projects/{project}/flags`

## Contact
MVP contact CTA uses backend-provided config values exposed to frontend props:
- Email (`mailto`)
- LinkedIn profile
- GitHub profile

The `/contact` page provides a form submission flow:
- Validated via `ContactRequest` (honeypot field, throttle protection).
- Dispatches `SendContactSubmissionNotification` queued job for email delivery.
- Anti-spam measures prevent automated submissions.

## Homepage Content Management
- Homepage primary copy and section image URLs are managed from `/dashboard/homepage`.
- Missing image URLs use frontend placeholders; no media upload pipeline is part of MVP.
- Homepage image inputs accept:
  - absolute URLs (`https://...`)
  - app paths (`/images/...`)
  - filename-only values (`*.webp`, `*.png`, etc.) normalized to `/images/homepage/{folder}/...`.

## Public Navigation Consistency
- Public header/footer use shared `PublicLayout` contract across:
  - `/`
  - `/contact`
  - `/projects`
  - `/projects/{slug}`
- Contact CTA visibility depends on `contact` prop from backend on all public pages.

## Definition Of Done
- Public pages and admin CRUD routes implemented.
- Only published projects visible publicly.
- The configured owner can create/update/delete projects.
- Test coverage added for public visibility and admin behavior.
- `make check` passes.
