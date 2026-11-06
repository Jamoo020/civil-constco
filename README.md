# Finecon Builders Limited – Next.js Starter

This scaffold provides a premium, enterprise-style Next.js App Router project for a civil engineering and construction company focused on the Kenyan Coast.

Quick start:

```bash
npm install
npm run dev
```

Admin and deployment
--------------------

- Local testing: set a strong `ADMIN_PASSWORD` (at least 16 characters) and the site origin in `.env.local`. This file is ignored by git:

```
ADMIN_PASSWORD=<strong-admin-password>
ADMIN_ORIGIN=http://localhost:3000
```

- Admin sessions and login/upload rate limits are stored in SQLite at `.data/admin-security.sqlite` by default. Set `ADMIN_SECURITY_DB_PATH` only when the chosen path is writable and persistent. Back up this database; deleting it revokes all active admin sessions and clears rate limits.
- Local development image uploads use `.data/uploads` when `FINECONE_UPLOAD_DIR` is not set. `.data` is excluded from Git.
- Production filesystem image uploads require `FINECONE_UPLOAD_DIR` to be an absolute path to a writable persistent directory. The application rejects paths inside or overlapping `public` or `.next`, and does not fall back to `public/uploads`. Uploaded WebP files are served through `/uploads/{UUID}.webp`; they are not exposed as a static directory.
- On Truehost, configure `FINECONE_UPLOAD_DIR` in the Node.js application's private environment settings only after the hosting account and Node.js application directory are confirmed. Set it to the actual absolute path of a dedicated persistent directory; this README intentionally does not assume or prescribe a Truehost-specific path. Ensure the Node.js process user can create, read, and write files there. Confirm that the directory survives application restarts and redeployments. The Truehost plan and filesystem behavior have not been verified.
- Keep uploaded images outside both `public` and `.next`: `public` is handled as web content and `.next` is a replaceable build output. Back up the entire configured image directory regularly. Before restoring, stop or quiesce the app, restore the files with restrictive directory/file permissions, verify the configured path and ownership, then check representative `/uploads/{UUID}.webp` URLs. Include the image directory in the same backup and recovery plan as project data.
- This filesystem design is for one persistent Node.js application instance. Multiple instances do not share host-local files automatically; requests routed to another instance may not find an upload. Use shared storage or migrate the storage adapter to private object storage with an intentional public-delivery policy before scaling out. Keep the stable `/uploads/{UUID}.webp` URL contract, and move objects behind a storage/CDN adapter or authorized signed-URL delivery when migrating.
- Production requires a persistent Node.js host, Node.js 20.9 or later, `ADMIN_PASSWORD`, and `ADMIN_ORIGIN` set in the host's private environment settings. Configure the reverse proxy to overwrite `X-Real-IP` with the actual client address so login throttling cannot be bypassed with a spoofed header. Do not commit credentials, the SQLite database, or uploaded files. Confirm the hosting plan supports a persistent Next.js server and writable storage before purchasing.
- Set `GITHUB_TOKEN` and `GITHUB_REPO` only if project updates should be committed to GitHub. Set `CLOUDINARY_CLOUD_NAME` and `CLOUDINARY_UPLOAD_PRESET` only if uploaded images should use Cloudinary instead of the filesystem storage branch.

- If `GITHUB_TOKEN` and `GITHUB_REPO` are set, the admin commits project changes to `src/data/projects.json`. Otherwise, changes write to the host filesystem, which must be persistent and backed up.


Content is driven by reusable React data modules in `src/data/content.ts` for a clean, scalable architecture.
