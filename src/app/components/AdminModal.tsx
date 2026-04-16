'use client';

import React, { useState, useEffect } from 'react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const ADMIN_PASSWORD = 'Sealteam1@';

export default function AdminModal({ isOpen, onClose, onSuccess }: AdminModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check if already logged in as admin
    const adminStatus = localStorage.getItem('isAdmin');
    setIsAdmin(adminStatus === 'true');
    if (adminStatus === 'true') {
      onSuccess();
    }
  }, [onSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (password === ADMIN_PASSWORD) {
      localStorage.setItem('isAdmin', 'true');
      setError('');
      setPassword('');
      setIsAdmin(true);
      onSuccess();
    } else {
      setError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('isAdmin');
    setIsAdmin(false);
    onClose();
  };

  if (!mounted) return null;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md flex items-center justify-center z-50 p-4">
      <div className="modern-card rounded-medium p-8 max-w-md w-full shadow-2xl border border-slate">
        {isAdmin ? (
          <div className="text-center">
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-bold font-sans-tight text-primary mb-4">Admin Mode Active</h2>
            <p className="text-secondary mb-6">You are logged in as administrator</p>
            <div className="flex gap-4">
              <button
                onClick={onClose}
                className="button-magnetic flex-1 bg-secondary-slate hover:bg-gray-600 text-white py-3 rounded-smooth font-semibold font-sans-tight transition-all"
              >
                Close
              </button>
              <button
                onClick={handleLogout}
                className="button-magnetic flex-1 bg-danger hover:bg-red-600 text-white py-3 rounded-smooth font-semibold transition-all"
              >
                Logout
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="text-center mb-6">
              <div className="text-5xl mb-4">🔐</div>
              <h2 className="text-2xl font-bold text-primary font-sans-tight">Admin Login</h2>
              <p className="text-secondary mt-2">Enter admin password to continue</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-primary font-semibold font-sans-tight mb-2 text-sm uppercase tracking-wide text-left">Password</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className="w-full bg-input border border-slate text-primary px-4 py-3 rounded-smooth focus:outline-none focus:ring-2 focus:ring-accent-blue font-sans placeholder:text-muted"
                  autoFocus
                />
                {error && (
                  <p className="text-danger text-sm mt-2 text-left">{error}</p>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button
                  type="button"
                  onClick={onClose}
                  className="button-magnetic flex-1 bg-secondary-slate hover:bg-gray-600 text-white py-3 rounded-smooth font-semibold font-sans-tight transition-all"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="button-magnetic flex-1 bg-accent-blue hover:bg-accent-indigo text-white py-3 rounded-smooth font-semibold transition-all"
                >
                  Login
                </button>
              </div>
            </form>

            <p className="text-warning text-sm text-center mt-6">
              ⚠️ This is for personal/internal use only. Password is visible in frontend code.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
