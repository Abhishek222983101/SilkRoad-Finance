"use client";

import React, { useState, useEffect, useRef } from 'react';
import dynamic from "next/dynamic";
import { Menu, X } from "lucide-react";

// Dynamic Wallet Button to prevent Hydration Error
const WalletMultiButtonDynamic = dynamic(
  async () => (await import('@solana/wallet-adapter-react-ui')).WalletMultiButton,
  { ssr: false }
);

const AnimatedNavLink = ({ href, children }: { href: string; children: React.ReactNode }) => {
  return (
    <a href={href} className="group relative inline-block overflow-hidden h-5 flex items-center text-sm font-medium">
      <div className="flex flex-col transition-transform duration-400 ease-out transform group-hover:-translate-y-1/2">
        <span className="text-gray-400 group-hover:text-white transition-colors">{children}</span>
        <span className="text-white text-[#00E500]">{children}</span>
      </div>
    </a>
  );
};

export function GlassNavbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [headerShapeClass, setHeaderShapeClass] = useState('rounded-full');
  const shapeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const toggleMenu = () => setIsOpen(!isOpen);

  useEffect(() => {
    if (shapeTimeoutRef.current) clearTimeout(shapeTimeoutRef.current);
    if (isOpen) {
      setHeaderShapeClass('rounded-2xl');
    } else {
      shapeTimeoutRef.current = setTimeout(() => {
        setHeaderShapeClass('rounded-full');
      }, 300);
    }
    return () => { if (shapeTimeoutRef.current) clearTimeout(shapeTimeoutRef.current); };
  }, [isOpen]);

  return (
    <header className={`fixed top-6 left-1/2 transform -translate-x-1/2 z-50
                        flex flex-col items-center
                        pl-6 pr-4 py-3 backdrop-blur-md
                        ${headerShapeClass}
                        border border-white/10 bg-black/40
                        w-[90%] md:w-auto min-w-[320px] md:min-w-[600px]
                        transition-[border-radius] duration-300 ease-in-out shadow-[0_0_20px_rgba(0,0,0,0.5)]`}>

      <div className="flex items-center justify-between w-full gap-x-6">
        
        {/* LOGO */}
        <div className="flex items-center space-x-2">
           <div className="w-8 h-8 bg-gradient-to-br from-[#00E500] to-black rounded-lg flex items-center justify-center text-black font-bold border border-[#00E500]/50 shadow-[0_0_10px_rgba(0,229,0,0.3)]">S</div>
           <span className="text-lg font-bold tracking-tight text-white hidden sm:block">SilkRoad</span>
        </div>

        {/* DESKTOP NAV */}
        <nav className="hidden md:flex items-center space-x-8">
          <AnimatedNavLink href="#">Protocol</AnimatedNavLink>
          <AnimatedNavLink href="#">Governance</AnimatedNavLink>
          <AnimatedNavLink href="#">Docs</AnimatedNavLink>
        </nav>

        {/* ACTIONS */}
        <div className="hidden md:flex items-center gap-3">
          <WalletMultiButtonDynamic style={{ height: '36px', borderRadius: '99px', fontSize: '14px', fontWeight: '600', background: '#111', border: '1px solid #333' }} />
        </div>

        {/* MOBILE MENU TOGGLE */}
        <button className="md:hidden text-gray-300" onClick={toggleMenu}>
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* MOBILE MENU DROPDOWN */}
      <div className={`md:hidden flex flex-col items-center w-full transition-all ease-in-out duration-300 overflow-hidden
                       ${isOpen ? 'max-h-[400px] opacity-100 pt-6 pb-2' : 'max-h-0 opacity-0 pt-0 pointer-events-none'}`}>
        <nav className="flex flex-col items-center space-y-4 text-base w-full mb-6">
           <a href="#" className="text-gray-300 hover:text-white">Protocol</a>
           <a href="#" className="text-gray-300 hover:text-white">Governance</a>
           <a href="#" className="text-gray-300 hover:text-white">Docs</a>
        </nav>
        <div className="w-full flex justify-center">
            <WalletMultiButtonDynamic style={{ width: '100%', justifyContent: 'center', background: '#222' }} />
        </div>
      </div>
    </header>
  );
}