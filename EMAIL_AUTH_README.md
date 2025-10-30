# Email Authentication with OAuth Integration

This guide explains how to use the dual authentication system in Pathfinity, which supports both email/password and OAuth (GitHub, Google) authentication.

## Features

- ✅ Email and password sign up
- ✅ Email and password login
- ✅ Password validation (minimum 6 characters)
- ✅ User session management
- ✅ Social authentication (GitHub, Google) alongside email auth
- ✅ **Automatic password generation for OAuth users**
- ✅ **Password management for OAuth users**
- ✅ Secure password hashing
- ✅ Form validation and error handling

## How the Dual Authentication Works

### OAuth Users Get Passwords Too!

When users sign up via GitHub or Google OAuth:

1. **Automatic Password Generation**: The system automatically generates a secure 16-character password
2. **Seamless Integration**: OAuth users can immediately use email/password login
3. **Password Management**: Users can change their auto-generated password via the profile page

### Authentication Flow

1. **OAuth Sign Up**: User signs up with GitHub/Google
2. **Password Generation**: System creates a secure password automatically
3. **Dual Access**: User can now log in with either:
   - OAuth (GitHub/Google)
   - Email and the generated password

## How to Use

### 1. Sign Up with OAuth (Recommended)

1. Navigate to `/login`
2. Click "Google" or "GitHub" button
3. Complete OAuth flow with provider
4. **System automatically generates a password for you**
5. Access your account via `/profile` to manage your password

### 2. Sign Up with Email

1. Navigate to `/login`
2. Click "Sign up" to toggle to sign-up mode
3. Fill in: Full name, Email address, Password, Confirm password
4. Click "Create account"

### 3. Sign In (Multiple Options)

**Option A: Email/Password**
1. Navigate to `/login`
2. Enter your email and password
3. Click "Sign in with Email"

**Option B: OAuth**
1. Navigate to `/login`
2. Click "Google" or "GitHub"
3. Complete OAuth flow

### 4. Managing Your Password

Visit `/profile` to:
- View your account information
- **Set a custom password** (if you signed up via OAuth)
- **Change your existing password**
- Sign out

## Technical Implementation

### OAuth Password Generation

```typescript
// When OAuth user is created
events: {
  user: {
    created: async (user) => {
      if (!user.password && user.email) {
        // Generate secure random password
        const randomPassword = generateSecurePassword();
        const hashedPassword = await bcrypt.hash(randomPassword, 12);
        
        // Update user with hashed password
        await db.update(schema.user)
          .set({ password: hashedPassword })
          .where(eq(schema.user.id, user.id));
      }
    },
  },
}
```

### Password Management API

- `POST /api/auth/change-password` - Change/set password
- Validates current password (or allows setting for OAuth users)
- Encrypts new password with bcrypt

## Configuration

### Environment Variables

Create a `.env.local` file with:

```bash
BETTER_AUTH_SECRET=your-secret-key-here
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers
GITHUB_CLIENT_ID=your-github-client-id
GITHUB_CLIENT_SECRET=your-github-client-secret
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Database Schema

The users table includes:

- `password`: text (nullable) - Stores hashed passwords
- `email`: text (required, unique) - User's email address
- `emailVerified`: boolean - Email verification status (also used to detect OAuth users)

## API Routes

- `POST /api/auth/sign-up` - Email sign up
- `POST /api/auth/sign-in` - Email sign in
- `POST /api/auth/sign-out` - Sign out
- `GET /api/auth/session` - Get current session
- `POST /api/auth/change-password` - Change/set password
- OAuth routes handled automatically by Better Auth

## Security Features

- **Automatic password hashing** using bcrypt (cost factor 12)
- **Secure random password generation** (16 characters, mixed case + symbols)
- **CSRF protection** via Better Auth
- **SQL injection protection** via Drizzle ORM
- **Session management** with secure tokens

## User Experience Benefits

1. **Flexibility**: Users can choose their preferred authentication method
2. **Future-proof**: OAuth users aren't locked out of email/password login
3. **Account Recovery**: Email/password provides backup access method
4. **Seamless Transition**: Switch between auth methods without creating new accounts

## Testing

### Test OAuth + Password Flow

1. Sign up with GitHub/Google OAuth
2. Visit `/profile` to see your auto-generated password capability
3. Set a custom password
4. Sign out and sign back in with email/password
5. Verify both OAuth and email/password work for the same account

### Test Email Flow

1. Sign up with email/password
2. Sign in/out with email/password
3. Visit `/profile` to change password

## Next Steps

To enhance the system further:

1. **Email Notifications**: Send generated password to OAuth users via email
2. **Password Strength Meter**: Add visual feedback for password complexity
3. **Two-Factor Authentication**: Add 2FA for enhanced security
4. **Account Linking**: Allow users to link multiple OAuth providers

This dual authentication system provides maximum flexibility while maintaining security best practices! 🚀