'use client';
import React from 'react';
import { Twitter, Github, Linkedin, Disc } from 'lucide-react';

export function Footer() {
  return (
    <footer className="relative w-full border-t border-white/10 bg-black pt-16 pb-8 px-6 overflow-hidden">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
         <div className="col-span-1 md:col-span-1">
            <div className="flex items-center space-x-2 mb-4">
               <div className="w-6 h-6 bg-green-500 rounded flex items-center justify-center text-black font-bold text-xs">S</div>
               <span className="text-xl font-bold text-white">SilkRoad</span>
            </div>
            <p className="text-gray-500 text-sm">Empowering global trade with decentralized liquidity.</p>
         </div>

         <div>
            <h4 className="text-white font-bold mb-4">Platform</h4>
            <ul className="space-y-2 text-sm text-gray-400">
               <li className="hover:text-green-500 cursor-pointer">Marketplace</li>
               <li className="hover:text-green-500 cursor-pointer">Supplier Portal</li>
               <li className="hover:text-green-500 cursor-pointer">Tokenomics</li>
            </ul>
         </div>

         <div>
            <h4 className="text-white font-bold mb-4">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-400">
               <li className="hover:text-green-500 cursor-pointer">Documentation</li>
               <li className="hover:text-green-500 cursor-pointer">GitHub</li>
               <li className="hover:text-green-500 cursor-pointer">Audits</li>
            </ul>
         </div>

         <div>
            <h4 className="text-white font-bold mb-4">Connect</h4>
            <div className="flex space-x-4">
               <Twitter className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
               <Github className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
               <Linkedin className="w-5 h-5 text-gray-400 hover:text-white cursor-pointer" />
            </div>
         </div>
      </div>
      <div className="text-center border-t border-white/5 pt-8 text-gray-600 text-xs">
         © 2026 SilkRoad Finance. Built for Solana Turbine.
      </div>
    </footer>
  );
}