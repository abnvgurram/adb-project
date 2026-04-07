## Nhost setup for this MVP

Run these SQL files in the Nhost SQL editor, in order:

1. `nhost/sql/001_create_listings_table.sql`
2. `nhost/sql/002_seed_sample_listings.sql`

If you already created the table before this gallery update, run:

3. `nhost/sql/003_add_gallery_image_urls.sql`

If you already created the table before the max-5 gallery rule, also run:

4. `nhost/sql/004_limit_gallery_image_urls_to_5.sql`

## Required permissions for this local-only admin phase

Because the admin route currently uses only a local UI button and no real auth,
the frontend can write to Nhost only if the `public` role has permissions on
the `listings` table.

Set these permissions in the Nhost / Hasura dashboard for role `public`:

- `select`: allow all columns and all rows
- `insert`: allow all columns
- `update`: allow all columns and all rows
- `delete`: allow all rows

## Important

This is intentionally insecure and should be used only for local testing.

Before any real deployment, replace this with:

- real Nhost auth
- role-based permissions
- no public write access

## Gallery URL behavior

The admin form now uses repeatable image URL fields instead of file upload:

- `Image 1 URL` is used as the main cover image
- up to 5 image URLs are allowed
- the max-5 rule is enforced in both the frontend and the database
- no Nhost storage bucket setup is required for this version

## Current frontend expectations

The React app expects this table shape:

- `id`
- `title`
- `listing_type`
- `price`
- `address`
- `city`
- `state`
- `zip_code`
- `beds`
- `baths`
- `sqft`
- `description`
- `cover_image_url`
- `gallery_image_urls`
- `featured`
- `published`
- `created_at`
- `updated_at`
