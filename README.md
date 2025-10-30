# Pathfinity

Pathfinity is a Next.js application with advanced authentication features including automatic account linking between OAuth and email/password authentication.

## 🚀 Features

- **Multiple Authentication Methods**: Email/password, GitHub OAuth, Google OAuth
- **Automatic Account Linking**: Seamlessly links OAuth accounts to existing email accounts
- **Dual Authentication**: OAuth users can also use email/password login
- **Secure Password Generation**: Auto-generated passwords for OAuth users
- **Profile Management**: Users can change passwords and manage account settings
- **Modern UI**: Built with shadcn/ui components and Tailwind CSS

## 🔐 Authentication Features

### Account Linking
- **Automatic**: No manual linking required
- **Bi-directional**: Works for OAuth→Email and Email→OAuth flows  
- **Secure**: Maintains data integrity and user sessions
- **Seamless**: Single account per email address

### Supported Providers
- ✅ Email/Password authentication
- ✅ GitHub OAuth
- ✅ Google OAuth
- ✅ Automatic password generation for OAuth users

## 📖 Documentation

- [`AUTH_SETUP.md`](AUTH_SETUP.md) - Initial authentication setup guide
- [`EMAIL_AUTH_README.md`](EMAIL_AUTH_README.md) - Email authentication details
- [`ACCOUNT_LINKING_README.md`](ACCOUNT_LINKING_README.md) - Account linking implementation guide

## 🛠️ Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database (Neon recommended)
- GitHub OAuth app
- Google OAuth app

### Environment Setup

1. Copy environment variables:
```bash
cp .env.example .env.local
```

2. Configure your `.env.local`:
```bash
# Database
DATABASE_URL=your_postgresql_url

# Authentication
BETTER_AUTH_SECRET=your_secret_key
NEXT_PUBLIC_BETTER_AUTH_URL=http://localhost:3000

# OAuth Providers
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
```

### Installation

1. Install dependencies:
```bash
npm install
```

2. Push database schema:
```bash
npx drizzle-kit push
```

3. Start development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000)

## 🧪 Testing Account Linking

Visit `/test-account-linking` for a comprehensive testing guide, or try these scenarios:

1. **Link OAuth to Email Account**:
   - Create account with email/password
   - Sign in with GitHub/Google using same email
   - Both authentication methods now work

2. **Use OAuth-Generated Password**:
   - Sign in with GitHub/Google
   - Visit `/profile` to see auto-generated password
   - Sign out and use email/password login

## 📁 Project Structure

```
├── app/                    # Next.js app directory
│   ├── (with-sidebar)/    # Sidebar layout pages
│   ├── api/auth/          # Authentication API routes
│   ├── components/        # React components
│   ├── login/             # Login page
│   └── profile/           # Profile management
├── lib/                   # Core authentication logic
├── src/db/               # Database schema and connection
├── hooks/                # Custom React hooks
└── types/                # TypeScript type definitions
```

## 🔧 Tech Stack

- **Framework**: Next.js 14 with App Router
- **Authentication**: Better Auth
- **Database**: PostgreSQL with Drizzle ORM
- **Styling**: Tailwind CSS + shadcn/ui
- **TypeScript**: Full type safety
- **Deployment**: Vercel-ready

## 🤝 Contributing

Contributions are welcome! Please read the documentation files for implementation details.

## 📄 License

[MIT License](LICENSE)
