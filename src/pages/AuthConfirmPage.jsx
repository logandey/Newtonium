import React, { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { Bot, CheckCircle, XCircle, Loader } from 'lucide-react'

export default function AuthConfirmPage() {
  const [status, setStatus] = useState('verifying') // verifying, success, error

  useEffect(() => {
    const handleConfirmation = async () => {
      const params = new URLSearchParams(window.location.search)
      const tokenHash = params.get('token_hash')
      const type = params.get('type')

      if (tokenHash && type) {
        const { error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type,
        })

        if (error) {
          console.error('Confirmation error:', error)
          setStatus('error')
        } else {
          setStatus('success')
          // Redirect to app after short delay
          setTimeout(() => {
            window.location.href = '/'
          }, 2000)
        }
      } else {
        setStatus('error')
      }
    }

    handleConfirmation()
  }, [])

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col items-center justify-center px-5">
      <div className="w-16 h-16 rounded-2xl bg-brand-600/20 border border-brand-500/30 flex items-center justify-center mx-auto mb-6">
        <Bot size={32} className="text-brand-400" />
      </div>

      {status === 'verifying' && (
        <div className="text-center animate-fade-in-up">
          <Loader size={32} className="text-brand-400 mx-auto mb-4 animate-spin" />
          <h2 className="text-xl font-bold text-white">Verifying your email...</h2>
          <p className="text-surface-400 mt-2 text-sm">Just a moment</p>
        </div>
      )}

      {status === 'success' && (
        <div className="text-center animate-fade-in-up">
          <CheckCircle size={32} className="text-emerald-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Email confirmed!</h2>
          <p className="text-surface-400 mt-2 text-sm">Redirecting you to Newtonium...</p>
        </div>
      )}

      {status === 'error' && (
        <div className="text-center animate-fade-in-up">
          <XCircle size={32} className="text-red-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-white">Confirmation failed</h2>
          <p className="text-surface-400 mt-2 text-sm">This link may have expired. Try signing up again.</p>
          <a
            href="/"
            className="inline-block mt-4 px-6 py-2.5 bg-brand-600 hover:bg-brand-500 text-white text-sm font-medium rounded-xl transition-colors"
          >
            Back to Newtonium
          </a>
        </div>
      )}
    </div>
  )
}
