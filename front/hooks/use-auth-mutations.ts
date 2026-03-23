'use client';

import { useMutation } from '@tanstack/react-query';
import { useRouter } from 'next/navigation';
import { login, register, logout, forgotPassword, resetPassword } from '@/api/auth';
import { useAuth } from '@/contexts/auth-context';
import type { LoginCredentials, RegisterData } from '@/types';

export function useLogin() {
  const router = useRouter();
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: (credentials: LoginCredentials) => login(credentials),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.token);
      // Laisser React appliquer le contexte avant la navigation, sinon le layout
      // protégé peut encore voir isAuthenticated === false et renvoyer vers l’accueil.
      setTimeout(() => {
        router.replace('/dashboard');
      }, 0);
    },
  });
}

export function useRegister() {
  const router = useRouter();
  const { setAuth } = useAuth();

  return useMutation({
    mutationFn: (data: RegisterData) => register(data),
    onSuccess: (response) => {
      setAuth(response.data.user, response.data.token);
      setTimeout(() => {
        router.replace('/dashboard');
      }, 0);
    },
  });
}

export function useLogout() {
  const router = useRouter();
  const { clearAuth } = useAuth();

  return useMutation({
    mutationFn: () => logout(),
    // Toujours vider la session locale et revenir à l’accueil (même si l’API échoue).
    onSettled: () => {
      clearAuth();
      router.replace('/');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: (email: string) => forgotPassword(email),
  });
}

export function useResetPassword() {
  const router = useRouter();

  return useMutation({
    mutationFn: ({ token, newPassword }: { token: string; newPassword: string }) =>
      resetPassword(token, newPassword),
    onSuccess: () => {
      router.push('/login');
    },
  });
}
