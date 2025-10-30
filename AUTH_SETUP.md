# Authentication Setup Guide

Your application is now configured with **Better Auth** for GitHub and Google authentication! 🎉

## What's Already Configured

✅ Database schema with users, sessions, accounts, and verifications tables  
✅ Better Auth integration with Drizzle ORM  
✅ GitHub and Google OAuth providers  
✅ Login page with email/password and social sign-in  
✅ API routes for authentication handlers  

## Setup Steps

### 1. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

### 2. Set Up GitHub OAuth

1. Go to [GitHub Developer Settings](https://github.com/settings/developers)
2. Click **"New OAuth App"**
3. Fill in the details:
   - **Application name**: Pathfinity
   - **Homepage URL**: `http://localhost:3000`
   - **Authorization callback URL**: `http://localhost:3000/api/auth/callback/github`
4. Click **"Register application"**
5. Copy the **Client ID**
6. Click **"Generate a new client secret"** and copy it
7. Add both to your `.env.local`:
   ```
   GITHUB_CLIENT_ID=your_client_id_here
   GITHUB_CLIENT_SECRET=your_client_secret_here
   ```

### 3. Set Up Google OAuth

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Navigate to **"APIs & Services"** > **"Credentials"**
4. Click **"Create Credentials"** > **"OAuth client ID"**
5. Configure the consent screen if prompted
6. Select **"Web application"** as the application type
7. Fill in the details:
   - **Name**: Pathfinity
   - **Authorized JavaScript origins**: `http://localhost:3000`
   - **Authorized redirect URIs**: `http://localhost:3000/api/auth/callback/google`
8. Click **"Create"**
9. Copy the **Client ID** and **Client Secret**
10. Add both to your `.env.local`:
    ```
    GOOGLE_CLIENT_ID=your_client_id_here
    GOOGLE_CLIENT_SECRET=your_client_secret_here
    ```

### 4. Set Up Database

Make sure your Neon database URL is in `.env.local`:

```
DATABASE_URL=postgresql://username:password@host.neon.tech/database?sslmode=require
```

### 5. Run Database Migrations

```bash
npx drizzle-kit push
```

Or if you prefer migrations:

```bash
npx drizzle-kit generate
npx drizzle-kit migrate
```

### 6. Generate a Secret Key

Generate a random secret for Better Auth:

```bash
# Using Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Add it to `.env.local`:

```
BETTER_AUTH_SECRET=your_generated_secret_here
BETTER_AUTH_URL=http://localhost:3000
```

### 7. Start Your Development Server

```bash
npm run dev
```

## How Authentication Works

### Email/Password Sign In

The email/password flow uses Better Auth's built-in email provider:

```typescript
await authClient.signIn.email({
  email,
  password,
});
```

### Social Sign In (GitHub & Google)

Social authentication is handled by Better Auth's social provider:

```typescript
await authClient.signIn.social({
  provider: 'google', // or 'github'
  callbackURL: '/dashboard',
});
```

When a user clicks the social sign-in button:
1. Better Auth redirects to the OAuth provider (GitHub/Google)
2. User authorizes your app
3. Provider redirects back to your callback URL
4. Better Auth creates/updates the user and session
5. User is redirected to the `callbackURL`

## Testing

1. Navigate to `http://localhost:3000/login`
2. Try signing in with:
   - Email and password
   - Google account
   - GitHub account

## Production Setup

For production, update these in your environment:

```
BETTER_AUTH_URL=https://yourdomain.com
```

And update your OAuth callback URLs in GitHub and Google:
- GitHub: `https://yourdomain.com/api/auth/callback/github`
- Google: `https://yourdomain.com/api/auth/callback/google`

## Files Modified/Created

- ✅ `lib/auth.ts` - Better Auth server configuration
- ✅ `lib/auth-client.ts` - Better Auth client for React components
- ✅ `src/app/api/auth/[...all]/route.ts` - API route handler
- ✅ `src/db/index.ts` - Database connection with Neon
- ✅ `src/db/schema.ts` - Database schema for auth tables
- ✅ `app/login/page.tsx` - Login page with social sign-in
- ✅ `.env.example` - Environment variable template

## Troubleshooting

### "Failed query: relation already exists"
Run: `npx drizzle-kit push --force` to sync schema

### OAuth redirect errors
Verify callback URLs match exactly in both GitHub/Google settings and your environment variables

### Session not persisting
Check that `BETTER_AUTH_SECRET` is set and consistent across restarts

## Next Steps

- Add a sign-up page for email/password registration
- Implement password reset functionality
- Add email verification
- Customize the user profile page
- Add role-based access control

Enjoy your fully functional authentication system! 🚀
