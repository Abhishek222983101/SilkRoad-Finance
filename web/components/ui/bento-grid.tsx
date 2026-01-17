"use client";
import { cn } from "@/lib/utils";
import { CheckCircle, TrendingUp, Video, Globe, Shield, Zap } from "lucide-react";

export interface BentoItem {
  title: string;
  description: string;
  icon: React.ReactNode;
  colSpan?: number;
}

const itemsSample: BentoItem[] = [
  {
    title: "Real-Time Analytics",
    description: "Track invoice status and liquidity flow instantly on-chain.",
    icon: <TrendingUp className="w-5 h-5 text-green-500" />,
    colSpan: 2,
  },
  {
    title: "Institutional Security",
    description: "Audited smart contracts with multi-sig vaults.",
    icon: <Shield className="w-5 h-5 text-blue-500" />,
  },
  {
    title: "Global Reach",
    description: "Access liquidity from investors worldwide.",
    icon: <Globe className="w-5 h-5 text-purple-500" />,
  },
  {
    title: "Atomic Settlement",
    description: "Zero T+2 delays. Funds settle in seconds.",
    icon: <Zap className="w-5 h-5 text-yellow-500" />,
    colSpan: 2,
  },
];

export function BentoGrid() {
  return (
    <div className="max-w-6xl mx-auto px-6 py-20">
       <h2 className="text-4xl font-bold text-white text-center mb-12">Why SilkRoad?</h2>
       <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {itemsSample.map((item, index) => (
            <div key={index} className={cn(
              "relative p-6 rounded-2xl border border-white/10 bg-[#0A0C0A] hover:border-green-500/50 transition-all group overflow-hidden",
              item.colSpan === 2 ? "md:col-span-2" : "md:col-span-1"
            )}>
               <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative z-10">
                  <div className="mb-4 p-3 bg-white/5 w-fit rounded-lg">{item.icon}</div>
                  <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{item.description}</p>
               </div>
            </div>
          ))}
       </div>
    </div>
  );
}