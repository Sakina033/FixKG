'use client'

import { ForgotPage, LoginPage, RegisterPage } from './account-flows'

export function AuthRoute({ mode }: { mode: 'login' | 'register' | 'forgot' }) {
  const navigate = (path: string) => window.location.assign(path)
  const props = { onNavigate: (view: string) => navigate(view === 'login' ? '/login' : view === 'register' ? '/register' : view === 'forgot' ? '/forgot-password' : '/'), onClose: () => navigate('/') }
  if (mode === 'register') return <RegisterPage {...props} onLogin={() => navigate('/')} />
  if (mode === 'forgot') return <ForgotPage {...props} />
  return <LoginPage {...props} onLogin={() => navigate('/')} />
}
