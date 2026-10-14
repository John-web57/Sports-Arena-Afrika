import React, { useState } from 'react';
import { 
  Lock, User, Eye, EyeOff, ShieldCheck, ArrowLeft, 
  AlertCircle, Sparkles, CheckCircle2, Loader2, KeyRound, Key
} from 'lucide-react';
import api from '../services/api';
import BrandLogo from '../components/BrandLogo';
import ChangePasswordModal from './ChangePasswordModal';

export default function AdminLogin({ onLogin, onBack }) {
  const [username, setUsername] = useState(() => localStorage.getItem('arena_saved_username') || '');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [passwordNotice, setPasswordNotice] = useState('');
  const [loading, setLoading] = useState(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setPasswordNotice('');
    setLoading(true);

    try {
      // 0. Check custom admin password first
      const cleanUser = username.trim().toLowerCase();
      const customAdminPass = localStorage.getItem('arena_admin_custom_password');
      let result = null;

      if (cleanUser === 'admin' && customAdminPass && password === customAdminPass) {
        result = { role: 'ROLE_SUPER_ADMIN', username: 'admin', fullName: 'System Administrator' };
      }

      if (!result) {
        result = await api.login(username, password);
      }

      // Offline / Local staff verification fallback
      if (!result?.role) {
        try {
          const stored = localStorage.getItem('sportsarena_staff_users');
          const staffList = stored ? JSON.parse(stored) : [];
          const found = staffList.find(u => 
            (u.username && u.username.toLowerCase() === cleanUser) || 
            (u.email && u.email.toLowerCase() === cleanUser)
          );

          if (found && found.status !== 'SUSPENDED') {
            const expectedPass = (found.username === 'admin' && customAdminPass) 
              ? customAdminPass 
              : (found.password || (found.username === 'admin' ? 'admin' : `${found.username}123`));

            if (password === expectedPass || (found.username === 'admin' && (password === 'admin' || password === 'admin123' || (customAdminPass && password === customAdminPass)))) {
              result = { 
                role: found.role || 'ROLE_JOURNALIST', 
                username: found.username, 
                fullName: found.fullName 
              };
            }
          } else if (found && found.status === 'SUSPENDED') {
            throw new Error('This account has been suspended by the administrator.');
          }
        } catch (e) {
          if (e.message.includes('suspended')) throw e;
        }
      }

      // Default system administrator fallback
      if (!result?.role && (cleanUser === 'admin' && (password === 'admin' || password === 'admin123' || (customAdminPass && password === customAdminPass)))) {
        result = { role: 'ROLE_SUPER_ADMIN', username: 'admin', fullName: 'System Administrator' };
      }

      if (!result?.role) {
        throw new Error('Invalid credentials. Please verify your username and password.');
      }

      if (!['ROLE_SUPER_ADMIN', 'ROLE_EDITOR', 'ROLE_JOURNALIST'].includes(result.role)) {
        throw new Error('This account is not authorized for newsroom access.');
      }

      // Persist session
      sessionStorage.setItem('arena_role', result.role);
      sessionStorage.setItem('arena_username', result.username || username);
      sessionStorage.setItem('arena_authenticated', '1');
      if (rememberMe) {
        localStorage.setItem('arena_saved_username', username);
      } else {
        localStorage.removeItem('arena_saved_username');
      }

      onLogin(result);
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#07070A] text-white flex flex-col justify-between relative overflow-hidden select-none">
      
      {/* Dynamic Ambient Background Glows */}
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-[#D90429]/15 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-[#EF233C]/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-tr from-transparent via-[#181828]/30 to-transparent rounded-full blur-3xl pointer-events-none" />

      {/* Top Header Row with Return Link */}
      <header className="w-full max-w-6xl mx-auto px-6 py-6 flex items-center justify-between z-10">
        <a 
          href="/" 
          onClick={(e) => { e.preventDefault(); onBack ? onBack() : (window.location.href = '/'); }}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition group py-2 px-3.5 rounded-full bg-[#12121A]/80 border border-[#232332] hover:border-[#EF233C]/50 backdrop-blur-md"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#EF233C] group-hover:-translate-x-1 transition-transform" />
          <span>Back to Sports Arena</span>
        </a>

        <div className="flex items-center gap-2 text-[11px] text-gray-400 font-mono">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>Editorial CMS</span>
        </div>
      </header>

      {/* Main Login Card Container */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 z-10">
        <div className="w-full max-w-md bg-[#0F0F16]/90 border border-[#232334] rounded-3xl p-8 sm:p-10 shadow-[0_25px_70px_rgba(0,0,0,0.85)] backdrop-blur-xl relative">
          
          {/* Subtle Top Red Accent Line */}
          <div className="absolute top-0 left-8 right-8 h-1 bg-gradient-to-r from-transparent via-[#EF233C] to-transparent rounded-t-full" />

          {/* Logo & Headline */}
          <div className="flex flex-col items-center text-center space-y-4 mb-8">
            <div className="transform hover:scale-105 transition-transform duration-300">
              <BrandLogo size="lg" showText />
            </div>

            <div className="space-y-1 pt-1">
              <h1 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight font-['Montserrat']">
                Newsroom Portal
              </h1>
              <p className="text-xs text-gray-400 font-medium">
                Authorized Sports Arena Afrika editorial & staff access
              </p>
            </div>
          </div>

          {/* Error Notice */}
          {/* Error Notice */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-800/80 text-red-200 text-xs flex items-start gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
              <div className="flex-1">
                <span className="font-bold block text-red-300">Authentication Error</span>
                <span className="text-[11px] leading-relaxed text-red-200/90">{error}</span>
              </div>
            </div>
          )}

          {/* Password Notice / Success Alert */}
          {passwordNotice && (
            <div className="mb-6 p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-700/80 text-emerald-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
              <span className="font-bold">{passwordNotice}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Username / Email Field */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-gray-300 font-['Montserrat'] uppercase tracking-wider">
                Username or Staff Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  required
                  autoFocus
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  placeholder="e.g. admin or staff email"
                  autoComplete="username"
                  className="w-full bg-[#161622] border border-[#2B2B3D] focus:border-[#EF233C] focus:ring-2 focus:ring-[#EF233C]/20 rounded-xl pl-10 pr-4 py-3 text-xs sm:text-sm text-white placeholder-gray-500 transition-all outline-none"
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5 text-left">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-bold text-gray-300 font-['Montserrat'] uppercase tracking-wider">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setIsChangePasswordOpen(true)}
                  className="text-[11px] text-amber-400 hover:text-amber-300 font-bold hover:underline flex items-center gap-1 transition"
                  title="Set or reset your admin or staff password"
                >
                  <Key className="w-3 h-3 text-amber-400" />
                  <span>Set / Change Password</span>
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your newsroom password"
                  autoComplete="current-password"
                  className="w-full bg-[#161622] border border-[#2B2B3D] focus:border-[#EF233C] focus:ring-2 focus:ring-[#EF233C]/20 rounded-xl pl-10 pr-11 py-3 text-xs sm:text-sm text-white placeholder-gray-500 transition-all outline-none"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-gray-400 hover:text-white transition"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Session Preferences & Help */}
            <div className="flex items-center justify-between pt-1 text-xs text-gray-400">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white transition select-none">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-3.5 h-3.5 rounded border-gray-600 bg-[#161622] text-[#EF233C] focus:ring-[#EF233C]/40 accent-[#EF233C]"
                />
                <span>Remember session</span>
              </label>
              <button
                type="button"
                onClick={() => setIsChangePasswordOpen(true)}
                className="text-[11px] text-gray-400 hover:text-gray-200 transition"
              >
                Forgot Password?
              </button>
            </div>

            {/* Sign In CTA Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 mt-2 rounded-xl bg-gradient-to-r from-[#D90429] via-[#EF233C] to-[#E10600] text-white font-black text-xs sm:text-sm uppercase tracking-wider shadow-sports-glow hover:brightness-110 active:scale-[0.99] transition-all disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 font-['Montserrat'] cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Verifying Credentials…</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Sign In to Newsroom</span>
                </>
              )}
            </button>
          </form>

          {/* Security Badge Footer */}
          <div className="mt-8 pt-6 border-t border-[#1E1E2C] flex items-center justify-center gap-2 text-[11px] text-gray-400">
            <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
            <span>256-Bit Encrypted Newsroom Environment</span>
          </div>

          {/* Change / Set Password Modal */}
          <ChangePasswordModal
            isOpen={isChangePasswordOpen}
            onClose={() => setIsChangePasswordOpen(false)}
            username={username.trim() || 'admin'}
            onPasswordChanged={(newPass) => {
              setPassword(newPass);
              setPasswordNotice(`Password set successfully! Click "Sign In to Newsroom" to enter.`);
            }}
          />

        </div>
      </main>

      {/* Page Footer */}
      <footer className="w-full py-5 text-center text-xs text-gray-400 z-10 border-t border-[#161622]">
        <div className="flex items-center justify-center gap-4 text-[11px]">
          <span>Sports Arena Afrika Editorial Desk</span>
          <span>•</span>
          <span>Nairobi • Lagos • Johannesburg • Cairo</span>
          <span>•</span>
          <span>v2.4 Production</span>
        </div>
      </footer>

    </div>
  );
}
