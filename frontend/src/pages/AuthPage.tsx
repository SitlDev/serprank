import React, { useState } from 'react'
import { Lock, Mail } from 'lucide-react'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import { Alert } from '../components/Alert'
import { AuthService } from '../services/auth'
import { useNavigate, Link } from 'react-router-dom'

interface AuthPageProps {
  mode: 'login' | 'register'
}

export const AuthPage = ({ mode }: AuthPageProps) => {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    setIsLoading(true)

    try {
      let response
      if (mode === 'login') {
        response = await AuthService.login(email, password)
      } else {
        response = await AuthService.register(email, password, firstName, lastName)
      }

      // Save token
      AuthService.setToken(response.token)

      setSuccess(`${mode === 'login' ? 'Logged in' : 'Account created'} successfully!`)
      setTimeout(() => navigate('/dashboard'), 1500)
    } catch (err: any) {
      setError(err.response?.data?.error || 'An error occurred')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-slate-100 to-brand-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 rounded-xl gradient-brand flex items-center justify-center text-white font-bold text-xl">
              SR
            </div>
          </div>
          <h1 className="heading-md mb-2">SERPRank</h1>
          <p className="text-slate-600">
            {mode === 'login' ? 'Welcome back' : 'Find keywords you can actually rank for'}
          </p>
        </div>

        {/* Form Card */}
        <div className="card border border-slate-200 mb-6">
          {error && <Alert type="error" message={error} onClose={() => setError(null)} />}
          {success && <Alert type="success" message={success} />}

          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === 'register' && (
              <div className="grid grid-cols-2 gap-4">
                <Input
                  label="First Name"
                  placeholder="John"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
                <Input
                  label="Last Name"
                  placeholder="Doe"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            )}

            <Input
              label="Email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              icon={<Mail size={20} />}
              required
            />

            <Input
              label="Password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              icon={<Lock size={20} />}
              required
            />

            <Button type="submit" isLoading={isLoading} className="w-full">
              {mode === 'login' ? 'Sign In' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-slate-600">
            {mode === 'login' ? (
              <>
                Don't have an account?{' '}
                <Link to="/register" className="text-brand-600 hover:text-brand-700 font-semibold">
                  Sign up
                </Link>
              </>
            ) : (
              <>
                Already have an account?{' '}
                <Link to="/login" className="text-brand-600 hover:text-brand-700 font-semibold">
                  Sign in
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-xs text-slate-500">
          By continuing, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  )
}
