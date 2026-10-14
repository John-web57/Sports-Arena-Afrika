import React, { useState } from 'react';
import { Lock, Key, Eye, EyeOff, CheckCircle2, AlertCircle, X, RefreshCw, Copy, Check } from 'lucide-react';
import api from '../services/api';

export default function ChangePasswordModal({ isOpen, onClose, username = 'admin', onPasswordChanged }) {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleGenerate = () => {
    const generated = 'Arena@' + Math.floor(100000 + Math.random() * 900000);
    setNewPassword(generated);
    setConfirmPassword(generated);
    setShowPassword(true);
    setError('');
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(newPassword);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      alert(`Password: ${newPassword}`);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!newPassword.trim()) {
      setError('Please enter a new password.');
      return;
    }

    if (newPassword.length < 4) {
      setError('Password must be at least 4 characters long.');
      return;
    }

    if (confirmPassword && newPassword !== confirmPassword) {
      setError('Passwords do not match. Please re-enter.');
      return;
    }

    const cleanPass = newPassword.trim();

    try {
      // 1. Store in custom admin password key if admin or general
      if (!username || username.toLowerCase() === 'admin') {
        localStorage.setItem('arena_admin_custom_password', cleanPass);
      }

      // 2. Update staff users list in localStorage
      try {
        const stored = localStorage.getItem('sportsarena_staff_users');
        if (stored) {
          const staffList = JSON.parse(stored);
          const updated = staffList.map(u => {
            if (u.username.toLowerCase() === (username || 'admin').toLowerCase()) {
              return { ...u, password: cleanPass };
            }
            return u;
          });
          localStorage.setItem('sportsarena_staff_users', JSON.stringify(updated));
        }
      } catch (err) {}

      // 3. Inform API if available
      try {
        if (api.updateUserPassword) {
          await api.updateUserPassword(username || 'admin', cleanPass);
        }
      } catch (err) {}

      if (onPasswordChanged) {
        onPasswordChanged(cleanPass);
      }

      setSuccess(true);
    } catch (err) {
      setError('Failed to update password. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-[#12121A] border border-[#2B2B3E] rounded-3xl w-full max-w-md overflow-hidden shadow-2xl relative">
        
        {/* Top Decorative Line */}
        <div className="h-1 bg-gradient-to-r from-[#D90429] via-[#EF233C] to-[#F59E0B]" />

        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-[#232332] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#D90429]/20 border border-[#D90429]/40 flex items-center justify-center text-[#EF233C]">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black uppercase text-white font-['Montserrat'] tracking-wide">
                Set Account Password
              </h3>
              <p className="text-xs text-gray-400">
                User: <strong className="text-white">@{username}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-[#1E1E2C] transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        {success ? (
          <div className="p-6 text-center space-y-5">
            <div className="w-14 h-14 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div className="space-y-1.5">
              <h4 className="text-lg font-black text-white font-['Montserrat'] uppercase">
                Password Successfully Set!
              </h4>
              <p className="text-xs text-gray-300">
                Your new newsroom login password has been saved and is active immediately.
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-[#181824] border border-[#2B2B3E] flex items-center justify-between text-xs">
              <div className="text-left">
                <span className="text-[10px] text-gray-500 uppercase block font-mono">Your New Password</span>
                <span className="font-mono text-sm font-bold text-white tracking-wider">{newPassword}</span>
              </div>
              <button
                type="button"
                onClick={handleCopy}
                className="px-3 py-1.5 rounded-lg bg-[#2563EB] hover:bg-blue-600 text-white text-xs font-bold flex items-center gap-1.5 transition shadow"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>
            </div>

            <button
              onClick={() => {
                setSuccess(false);
                onClose();
              }}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-[#D90429] to-[#EF233C] text-white text-xs font-black uppercase tracking-wider shadow-sports-glow font-['Montserrat'] hover:scale-102 transition"
            >
              Done & Return to Portal
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            
            {error && (
              <div className="p-3 rounded-xl bg-red-950/40 border border-red-800 text-red-200 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-red-400 flex-shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {/* Quick Auto-Generate Button */}
            <div className="flex items-center justify-between p-3 rounded-xl bg-[#181824] border border-[#2B2B3E]">
              <span className="text-xs text-gray-300 font-medium">Need a secure password?</span>
              <button
                type="button"
                onClick={handleGenerate}
                className="px-2.5 py-1 rounded-lg bg-[#232332] hover:bg-[#2E2E42] text-[11px] font-bold text-amber-400 hover:text-amber-300 border border-[#3A3A50] flex items-center gap-1.5 transition"
              >
                <RefreshCw className="w-3 h-3" />
                <span>Auto Generate</span>
              </button>
            </div>

            {/* New Password */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-gray-300 font-['Montserrat'] uppercase tracking-wider">
                New Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  autoFocus
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter your new password"
                  className="w-full bg-[#181824] border border-[#2B2B3E] focus:border-[#EF233C] focus:ring-2 focus:ring-[#EF233C]/20 rounded-xl pl-10 pr-11 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition"
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

            {/* Confirm New Password */}
            <div className="space-y-1.5 text-left">
              <label className="block text-xs font-bold text-gray-300 font-['Montserrat'] uppercase tracking-wider">
                Confirm Password *
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-500">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-type your new password"
                  className="w-full bg-[#181824] border border-[#2B2B3E] focus:border-[#EF233C] focus:ring-2 focus:ring-[#EF233C]/20 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-white placeholder-gray-500 outline-none transition"
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-3 border-t border-[#232332] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl bg-[#181822] text-xs font-bold text-gray-400 hover:text-white border border-[#232332]"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#D90429] to-[#EF233C] text-white text-xs font-black uppercase tracking-wider shadow-sports-glow font-['Montserrat'] hover:scale-102 transition"
              >
                Save & Set Password
              </button>
            </div>
          </form>
        )}

      </div>
    </div>
  );
}
