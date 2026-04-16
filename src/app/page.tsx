'use client';

import React, { useState, useEffect } from 'react';
import InvoiceGenerator from './components/InvoiceGenerator';
import AdminModal from './components/AdminModal';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [appStarted, setAppStarted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check admin status
    const adminStatus = localStorage.getItem('isAdmin') === 'true';
    setIsAdmin(adminStatus);
  }, []);

  const handleAdminSuccess = () => {
    setIsAdmin(true);
    setShowAdminModal(false);
  };

  // Prevent hydration mismatch by not rendering until mounted
  if (!mounted) {
    return (
      <div className="min-h-screen bg-primary-dark flex items-center justify-center">
        <div className="text-secondary-slate text-xl font-mono-data">SIGNAL.WAITING...</div>
      </div>
    );
  }

  if (!appStarted) {
    return (
      <div className="min-h-screen bg-primary-dark overflow-hidden flex flex-col relative selection:bg-accent-indigo selection:text-white">
        {/* Floating Nav */}
        <nav className="fixed top-6 left-1/2 -translate-x-1/2 z-50 modern-card px-8 py-4 rounded-full flex items-center justify-between w-[95%] max-w-7xl">
          <div className="text-2xl font-bold font-sans-tight text-secondary-slate tracking-tighter uppercase">
            INVOICE<span className="text-accent-indigo">_</span>
          </div>
          <button
            onClick={() => setShowAdminModal(true)}
            className="text-sm font-mono-data text-secondary-slate hover:text-accent-blue transition-colors uppercase"
          >
            [ {isAdmin ? 'SYS_ADMIN' : 'SYS_LOGIN'} ]
          </button>
        </nav>

        {/* Hero Content */}
        <div className="flex-1 w-full flex flex-col justify-center sm:justify-end px-6 sm:px-12 md:px-24 pb-24 max-w-[1400px] mx-auto z-10 pt-40">
          <div className="max-w-5xl">
            <h1 className="text-6xl sm:text-[6rem] md:text-[9rem] leading-[0.9] text-secondary-slate uppercase tracking-tighter mb-8 flex flex-col">
              <span className="font-bold font-sans-tight inline-block text-black">Compute the</span>
              <span className="font-serif-drama text-accent-indigo inline-block mt-2 sm:-mt-4 italic">Ledger.</span>
            </h1>
            <p className="text-lg md:text-2xl font-sans text-text-secondary mb-16 max-w-2xl leading-relaxed">
              Raw precision generation. No abstractions. Output accurate financial signals directly to the grid.
            </p>
            <button
              onClick={() => setAppStarted(true)}
              className="button-magnetic bg-secondary-slate hover:bg-black text-white px-10 py-6 rounded-smooth font-bold font-sans-tight text-xl md:text-2xl flex items-center w-max gap-6 transition-all shadow-lg"
            >
              <span>Initialize Protocol</span>
              <span className="font-mono-data text-sm opacity-80 blink">→_</span>
            </button>
          </div>
        </div>
        
        {/* Admin Modal */}
        <AdminModal
          isOpen={showAdminModal}
          onClose={() => setShowAdminModal(false)}
          onSuccess={handleAdminSuccess}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen transition-colors bg-primary-slate">
      {/* Header - Modern Floating Island */}
      <div className="fixed top-0 left-0 right-0 z-40 modern-card rounded-none border-t-0 border-l-0 border-r-0">
        <div className="flex items-center justify-between px-6 py-4 max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold font-sans-tight text-secondary-slate uppercase tracking-tighter">
            INVOICE<span className="text-accent-indigo">_</span>PROTOCOL
          </h1>
          <div className="flex items-center gap-4">
            <button
               onClick={() => setAppStarted(false)}
               className="text-sm font-sans text-secondary-slate hover:text-accent-indigo transition-colors uppercase px-4 font-semibold"
            >
              [ ABORT ]
            </button>
            <button
              onClick={() => setShowAdminModal(true)}
              className="button-magnetic px-5 py-2 rounded-smooth bg-secondary-slate hover:bg-black text-white font-semibold font-sans-tight transition-all min-w-[100px] uppercase text-sm shadow-md"
            >
              {isAdmin ? 'SYS_ADMIN' : 'SYS_LOGIN'}
            </button>
          </div>
        </div>
      </div>

      {/* Main Content - Full Width */}
      <main className="pt-24 pb-12 min-h-screen max-w-7xl mx-auto px-4">
        <InvoiceGenerator />
      </main>

      {/* Admin Modal */}
      <AdminModal
        isOpen={showAdminModal}
        onClose={() => setShowAdminModal(false)}
        onSuccess={handleAdminSuccess}
      />
    </div>
  );
}
