# Admin Client for Blog API

An independently deployable admin application for the Blog API. Built with the
Next.js App Router, strict TypeScript, and Tailwind CSS.

## Features

- Dashboard with post, comment, and user summaries
- Browse posts, view details and comments, create and edit posts, and publish,
  unpublish, or delete them
- Add, edit (where permitted by the API), and remove comments
- View and remove user accounts
- Sign in and update account profile, username, or password
- Cookie-based admin sessions and live post/comment updates over WebSocket
- Responsive navigation, loading, error, and empty states
- API URL configured through the deployment environment

## Routes

| Route | Description |
| --- | --- |
| `/` | Admin dashboard |
| `/posts` | Posts list and publishing actions |
| `/posts/[id]` | Post details and comment management |
| `/createPost` | Create a post |
| `/editPost/[id]` | Edit a post |
| `/signIn` | Admin sign in |
| `/account` | Account profile and security settings |
| `/users` | User management |

## Local development

Requirements: Node.js 18.18 or newer and npm.

```bash
npm install
cp .env.example .env.local
npm run dev
```

The app runs at `http://localhost:3000`. Set `NEXT_PUBLIC_BLOG_API_URL` in
`.env.local` to the independently running API's origin (for example,
`http://localhost:5000`). No credentials are stored in this repository. The
API must allow the client origin in its CORS configuration.
The browser sends requests with credentials enabled and relies on the backend's
HttpOnly `blog_admin_session` cookie; the API keeps the admin and public user
sessions separate, including during local development on different ports. After
the backend introduces role-specific cookies, sign in again once in each app;
the previous shared cookie is no longer used. The client does not read or
persist the JWT.
For a separately hosted client and API, the API must allow the exact client
origin with credentialed CORS, and its session cookie must be usable in that
cross-site context (typically `SameSite=None; Secure` over HTTPS). Post detail
pages subscribe to the API's `/ws` endpoint and automatically reconnect and
resubscribe after a dropped connection.

## Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Next.js development server |
| `npm run build` | Create a production build |
| `npm run start` | Serve a production build |
| `npm run typecheck` | Run strict TypeScript checking |
| `npm run lint` | Run Next.js ESLint checks |
| `npm test` | Run Vitest tests |

## Deployment

This directory remains the root of the **admin-client-blog-api** repository and
is deployed independently from both the Blog API and the public user client.
Import this repository as its own Vercel project, keep the project root at the
repository root, and configure `NEXT_PUBLIC_BLOG_API_URL` in the Vercel
environment settings for each target environment. Vercel detects Next.js
automatically; no SPA rewrite to `index.html` is needed.

The API stays independently deployed. Its CORS allow-list must include the
admin deployment's origin; configure that on the API deployment separately.

## Related projects

- [Blog API Backend](https://github.com/ChoforJr/blog-api)
- [Public User Client](https://github.com/ChoforJr/user-client-blog-api)

## Author

**FORSAKANG CHOFOR JUNIOR** · [GitHub](https://github.com/ChoforJr) ·
[LinkedIn](https://www.linkedin.com/in/choforforsakang/)
