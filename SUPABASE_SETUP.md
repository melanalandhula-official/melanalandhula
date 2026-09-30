# Melanalandhula — Supabase Free setup

This version is configured for the Supabase project you already created.

## Already completed
- Supabase Free project
- Public `Gallery` storage bucket
- `announcements` table
- Admin user

## 1. Run the v5 SQL
Open Supabase -> SQL Editor -> New query.
Paste the contents of `supabase-schema.sql` and click Run.

This creates the missing `gallery` table and makes sure the `Gallery` storage upload/update/delete policies exist.

## 2. Add the public project keys
Open Project Settings -> API.
Copy:
- Project URL
- Publishable key

Put them in `supabase-config.js`.

Never put a Secret/service_role key in the website.

## 3. Upload to GitHub Pages
Upload/replace the website files in your existing repository.

## 4. Admin page
After GitHub Pages updates, open:
https://melanalandhula-official.github.io/melanalandhula/admin.html

Log in with the Supabase admin account.

You can then:
- publish announcements
- upload gallery photos from your phone
- delete announcements/photos

## Free plan
Supabase Free has usage/storage/bandwidth limits. It is not unlimited.


Configuration completed: Project URL + Publishable key have been inserted into supabase-config.js.
