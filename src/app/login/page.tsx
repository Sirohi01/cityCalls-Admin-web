'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/lib/validation/auth';
import { useLogin } from '@/lib/hooks/useAuth';
import {
  PhoneCall,
  Users,
  CalendarCheck,
  BarChart3,
  ShieldCheck,
  Mail,
  Smartphone,
  Zap,
  CheckCircle2,
  Clock,
  Star,
  ArrowRight,
  Loader2,
  AlertCircle
} from 'lucide-react';
import bgImage from '@/assets/login/loginbg.png';

export default function LoginPage() {
  const router = useRouter();
  const login = useLogin();
  const [loginMethod, setLoginMethod] = useState<'email' | 'mobile'>('email');

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: 'password' // Temporary since the UI shows OTP but API might need password
    }
  });

  const onSubmit = (values: LoginFormValues) => {
    login.mutate(
      { ...values, rememberMe: true },
      { onSuccess: () => router.push('/dashboard') }
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <main
        className="w-full max-w-7xl h-[90vh] max-h-[800px] flex flex-col relative overflow-hidden bg-[length:100%_100%] bg-no-repeat rounded-xl shadow-2xl bg-white"
        style={{ backgroundImage: `url(${bgImage.src})` }}
      >
        <div className="flex-1 grid lg:grid-cols-2 relative z-10 h-full pb-16">

          {/* Left Section - Floating text over the background's white area */}
          <div className="hidden lg:flex flex-col justify-between py-10 px-10 h-full">
            <div>

              <h1 className="text-3xl font-semibold text-gray-900 leading-tight mt-14 mb-4 [text-shadow:_0_0_15px_#ffffff,_0_0_30px_#ffffff]">
                Smart CRM for<br />
                <span className="text-[#649622] [text-shadow:_0_0_15px_#ffffff,_0_0_30px_#ffffff]">Smarter Service</span>
              </h1>

              {/* Small green horizontal line */}
              <div className="w-12 h-1 bg-[#8cc63f] mb-6 rounded-full shadow-[0_0_10px_#ffffff]"></div>

              <p className="text-gray-800 font-medium text-base mb-6 max-w-md [text-shadow:_0_0_10px_#ffffff,_0_0_20px_#ffffff]">
                Manage calls, customers and service operations in one powerful platform.
              </p>

              <div className="space-y-6 max-w-md">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#8cc63f]">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5 text-sm [text-shadow:_0_0_15px_#fff,_0_0_20px_#fff,_0_0_20px_#fff]">Call Management</h3>
                    <p className="text-xs font-medium text-gray-800 leading-relaxed [text-shadow:_0_0_8px_#fff,_0_0_8px_#fff,_0_0_8px_#fff,_0_0_8px_#fff]">Track calls, assign technicians and close tickets faster.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#8cc63f]">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5 text-sm [text-shadow:_0_0_15px_#fff,_0_0_20px_#fff,_0_0_20px_#fff]">Customer Management</h3>
                    <p className="text-xs font-medium text-gray-800 leading-relaxed [text-shadow:_0_0_8px_#fff,_0_0_8px_#fff,_0_0_8px_#fff,_0_0_8px_#fff]">Keep customer details, history and interactions organized.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#8cc63f]">
                    <CalendarCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5 text-sm [text-shadow:_0_0_15px_#fff,_0_0_20px_#fff,_0_0_20px_#fff]">Service Scheduling</h3>
                    <p className="text-xs font-medium text-gray-800 leading-relaxed [text-shadow:_0_0_8px_#fff,_0_0_8px_#fff,_0_0_8px_#fff,_0_0_8px_#fff]">Schedule visits and manage technicians efficiently.</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 bg-white/90 backdrop-blur-sm rounded-full shadow-lg flex items-center justify-center text-[#8cc63f]">
                    <BarChart3 className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-gray-900 mb-0.5 text-sm [text-shadow:_0_0_15px_#fff,_0_0_20px_#fff,_0_0_20px_#fff]">Reports & Analytics</h3>
                    <p className="text-xs font-medium text-gray-800 leading-relaxed [text-shadow:_0_0_8px_#fff,_0_0_8px_#fff,_0_0_8px_#fff,_0_0_8px_#fff]">Get real-time insights and grow your service business.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-8 flex items-center gap-4 bg-white/80 backdrop-blur-md w-max px-5 py-3 rounded-2xl shadow-lg border border-white/50">
              <div className="w-8 h-8 bg-[#8cc63f] rounded-full flex items-center justify-center text-white shrink-0">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-gray-900">
                Your data is 100% secure<br />
                <span className="text-gray-600 font-medium">and always protected.</span>
              </p>
            </div>
          </div>

          {/* Right Section - Login Card */}
          <div className="flex items-center justify-start relative z-10 lg:-ml-20">
            <div className="w-full max-w-[350px] bg-white rounded-2xl shadow-2xl p-7">
              <div className="text-center mb-6">
                <h2 className="text-[24px] font-bold text-gray-900 mb-2">
                  Welcome <span className="text-[#8cc63f]">Back!</span>
                </h2>
                <p className="text-gray-500 text-sm">Sign in to your <span className="font-medium text-[#8cc63f]">CityCalls</span> admin account</p>
              </div>

              {/* Tabs */}
              <div className="flex p-1 bg-gray-50/80 rounded-xl mb-6 border border-gray-100">
                <button
                  type="button"
                  onClick={() => setLoginMethod('email')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${loginMethod === 'email' ? 'bg-white text-[#8cc63f] shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Mail className="w-4 h-4" />
                  Email
                </button>
                <button
                  type="button"
                  onClick={() => setLoginMethod('mobile')}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-lg transition-all ${loginMethod === 'mobile' ? 'bg-white text-[#8cc63f] shadow-sm border border-gray-100' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  <Smartphone className="w-4 h-4" />
                  Mobile
                </button>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-900">
                    Enter your {loginMethod}
                  </label>
                  <div className="relative">
                    {loginMethod === 'email' ? (
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    ) : (
                      <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    )}
                    <input
                      type={loginMethod === 'email' ? 'email' : 'tel'}
                      placeholder={`Enter your ${loginMethod} address`}
                      className={`w-full h-11 pl-10 pr-4 bg-white border ${errors.identifier ? 'border-red-300 focus:ring-red-500 focus:border-red-500' : 'border-gray-200 focus:ring-[#8cc63f] focus:border-[#8cc63f]'} rounded-xl text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#8cc63f] transition-colors shadow-sm`}
                      {...register('identifier')}
                    />
                  </div>
                  {errors.identifier && (
                    <p className="text-xs text-red-500 mt-1">{errors.identifier.message}</p>
                  )}
                </div>

                {login.isError && (
                  <div className="flex items-start gap-2 rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-600">
                    <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                    {login.error.response?.data?.message ?? 'Login failed. Please try again.'}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={login.isPending}
                  className="w-full h-11 bg-[#5a9c21] hover:bg-[#4b821b] text-white rounded-xl font-medium text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#8cc63f]/20 transition-all active:scale-[0.98]"
                >
                  {login.isPending ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      Send OTP <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>

              <div className="mt-6 relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-100"></div>
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="px-4 bg-white text-gray-400">or continue with</span>
                </div>
              </div>

              <div className="mt-6 pt-5 flex items-center justify-center gap-2 text-xs text-[#8cc63f] font-medium">
                <ShieldCheck className="w-4 h-4" />
                Secure login with OTP verification
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Floating Bar */}
        <div className="hidden lg:flex absolute bottom-4 left-1/2 -translate-x-1/2 bg-white rounded-xl shadow-xl border border-gray-100 py-2.5 px-6 items-center gap-8 z-20 w-max scale-90 origin-bottom">
          <div className="flex gap-2 items-center">
            <Zap className="w-4 h-4 text-[#8cc63f]" />
            <div>
              <h4 className="text-xs font-semibold text-gray-900 leading-tight">Fast Response</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Quick action on every call</p>
            </div>
          </div>

          <div className="w-px h-6 bg-gray-100"></div>

          <div className="flex gap-2 items-center">
            <ShieldCheck className="w-4 h-4 text-[#8cc63f]" />
            <div>
              <h4 className="text-xs font-semibold text-gray-900 leading-tight">Verified Technicians</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Skilled & background verified</p>
            </div>
          </div>

          <div className="w-px h-6 bg-gray-100"></div>

          <div className="flex gap-2 items-center">
            <Clock className="w-4 h-4 text-[#8cc63f]" />
            <div>
              <h4 className="text-xs font-semibold text-gray-900 leading-tight">On-time Service</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Punctuality you can rely on</p>
            </div>
          </div>

          <div className="w-px h-6 bg-gray-100"></div>

          <div className="flex gap-2 items-center">
            <Star className="w-4 h-4 text-[#8cc63f]" />
            <div>
              <h4 className="text-xs font-semibold text-gray-900 leading-tight">Customer Satisfaction</h4>
              <p className="text-[10px] text-gray-500 mt-0.5">Our priority, every time</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
