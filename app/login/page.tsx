'use client';

import { useState } from 'react';
import { authClient } from '@/lib/auth-client';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Github } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [isGithubLoading, setIsGithubLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (isSignup) {
        if (!name.trim()) {
          setError('Please enter your name');
          setIsLoading(false);
          return;
        }
        if (password.length < 6) {
          setError('Password must be at least 6 characters long');
          setIsLoading(false);
          return;
        }
        if (password !== confirmPassword) {
          setError("Passwords don't match");
          setIsLoading(false);
          return;
        }

        const result = await authClient.signUp.email({
          email,
          password,
          name,
        });

        if (!result.error) {
          router.push('/Home');
          router.refresh();
        } else {
          setError(result.error.message || 'Sign up failed');
        }
      } else {
        const result = await authClient.signIn.email({
          email,
          password,
        });

        if (!result.error) {
          router.push('/Home');
          router.refresh();
        } else {
          setError(result.error.message || 'Authentication failed');
        }
      }
    } catch (err) {
      console.error(isSignup ? 'Sign up error:' : 'Sign in error:', err);
      setError('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsGoogleLoading(true);
    setError('');
    
    try {
      // Better Auth handles the OAuth flow automatically
      // It will redirect to Google, then back to your callback URL
      await authClient.signIn.social({
        provider: 'google',
        callbackURL: '/Home', // Where to redirect after successful auth
      });
    } catch (error) {
      console.error('Google sign in error:', error);
      setError('Failed to sign in with Google');
      setIsGoogleLoading(false);
    }
  };

  const handleGithubSignIn = async () => {
    setIsGithubLoading(true);
    setError('');
    
    try {
      // Better Auth handles the OAuth flow automatically
      // It will redirect to GitHub, then back to your callback URL
      await authClient.signIn.social({
        provider: 'github',
        callbackURL: '/Home', // Where to redirect after successful auth
      });
    } catch (error) {
      console.error('Github sign in error:', error);
      setError('Failed to sign in with GitHub');
      setIsGithubLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center p-4 bg-background">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold tracking-tight">
            {isSignup ? 'Create your account' : 'Welcome back'}
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {isSignup ? 'Sign up to start using Pathfinity' : 'Sign in to your account'}
          </p>
        </div>

        {error && (
          <div className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          <div className="space-y-4 rounded-md">
            {isSignup && (
              <div>
                <Input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="Full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
            <div>
              <Input
                id="email"
                name="email"
                type="email"
                required
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full"
              />
            </div>
            <div>
              <Input
                id="password"
                name="password"
                type="password"
                required
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full"
              />
            </div>
            {isSignup && (
              <div>
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="Re-type password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full"
                />
              </div>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (isSignup ? 'Signing up...' : 'Signing in...') : (isSignup ? 'Create account' : 'Sign in with Email')}
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              disabled={isGoogleLoading || isGithubLoading}
              className="w-full"
            >
              {isGoogleLoading ? (
                <span className="mr-2">Loading...</span>
              ) : (
                <>
                  <Image
                    src="/google.svg"
                    alt="Google"
                    width={20}
                    height={20}
                    className="mr-2"
                  />
                  Google
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="outline"
              onClick={handleGithubSignIn}
              disabled={isGoogleLoading || isGithubLoading}
              className="w-full"
            >
              {isGithubLoading ? (
                <span className="mr-2">Loading...</span>
              ) : (
                <>
                  <Github className="mr-2 h-5 w-5" />
                  GitHub
                </>
              )}
            </Button>
          </div>
        </form>

        <div className="text-center text-sm">
          <span className="text-muted-foreground">{isSignup ? 'Already have an account? ' : "Don't have an account? "}</span>
          <button
            type="button"
            className="p-0 h-auto font-semibold text-indigo-600 hover:underline"
            onClick={() => setIsSignup((s) => !s)}
          >
            {isSignup ? 'Log in' : 'Sign up'}
          </button>
        </div>
      </div>
    </div>
  );
}