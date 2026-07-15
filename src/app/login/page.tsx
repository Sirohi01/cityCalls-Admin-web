'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { loginSchema, LoginFormValues } from '@/lib/validation/auth';
import { useLogin } from '@/lib/hooks/useAuth';

// Per docs/rohit/07-form-field-specifications.md "Login Form (Admin Web)".
// Functional skeleton — visual design per docs/rohit/02-design-system.md is Rohit's pass.
export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({ resolver: zodResolver(loginSchema) });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(values, {
      onSuccess: () => router.push('/'),
    });
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="w-full max-w-sm space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-sm"
      >
        <h1 className="text-lg font-semibold text-gray-900">CityCalls Admin</h1>

        <div>
          <label htmlFor="identifier" className="block text-sm font-medium text-gray-700">
            Email or Mobile
          </label>
          <input
            id="identifier"
            type="text"
            {...register('identifier')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.identifier && <p className="mt-1 text-sm text-red-600">{errors.identifier.message}</p>}
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            {...register('password')}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
          />
          {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>

        {login.isError && (
          <p className="text-sm text-red-600">
            {login.error.response?.data?.message ?? 'Login failed. Please try again.'}
          </p>
        )}

        <button
          type="submit"
          disabled={login.isPending}
          className="w-full rounded-md bg-gray-900 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          {login.isPending ? 'Signing in...' : 'Sign in'}
        </button>
      </form>
    </main>
  );
}
