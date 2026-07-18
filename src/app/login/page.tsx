'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { loginSchema, LoginFormValues } from '@/lib/validation/auth';
import { useLogin } from '@/lib/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: () => router.push('/dashboard'),
    });
  };

  return (
    <main
      className="relative flex min-h-screen items-center bg-slate-950 bg-cover bg-[position:70%_center] p-6 lg:p-16"
      style={{ backgroundImage: "url('/cityCallsLogin.png')" }}
    >
      <div className="absolute left-6 top-6 h-9 w-36 overflow-hidden rounded-md lg:left-12 lg:top-10">
        <img
          src="/citycallslogo.jpeg"
          alt="CityCalls"
          className="h-full w-full scale-150 object-cover object-center"
        />
      </div>

      <div className="w-full max-w-sm rounded-2xl bg-white/95 p-8 shadow-2xl backdrop-blur-sm">
        <div className="mb-6 h-9 w-36 overflow-hidden rounded-md bg-slate-950 lg:hidden">
          <img
            src="/citycallslogo.jpeg"
            alt="CityCalls"
            className="h-full w-full scale-150 object-cover object-center"
          />
        </div>
        <div className="mb-8 space-y-1.5">
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Welcome back</h2>
          <p className="text-sm text-muted-foreground">Sign in to your admin console to continue.</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="space-y-1.5">
            <Label htmlFor="identifier" className={errors.identifier ? 'text-destructive' : ''}>
              Email or Mobile
            </Label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="identifier"
                placeholder="e.g. admin@citycalls.local"
                className={`h-11 pl-10 ${errors.identifier ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                {...register('identifier')}
              />
            </div>
            {errors.identifier && <p className="text-[0.8rem] font-medium text-destructive">{errors.identifier.message}</p>}
          </div>

          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className={errors.password ? 'text-destructive' : ''}>
                Password
              </Label>
              <Link href="/forgot-password" className="text-sm font-medium text-primary hover:underline underline-offset-4">
                Forgot Password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className={`h-11 pl-10 pr-10 ${errors.password ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                {...register('password')}
              />
              <button
                type="button"
                onClick={() => setShowPassword((v) => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-[0.8rem] font-medium text-destructive">{errors.password.message}</p>}
          </div>

          {login.isError && (
            <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive font-medium border border-destructive/20">
              {login.error.response?.data?.message ?? 'Login failed. Please try again.'}
            </div>
          )}

          <Button type="submit" className="h-11 w-full text-base" disabled={login.isPending}>
            {login.isPending ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>
      </div>
    </main>
  );
}
