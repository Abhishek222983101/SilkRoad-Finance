"use client";

import { InfiniteSlider } from "@/components/ui/infinite-slider";
import { ProgressiveBlur } from "@/components/ui/progressive-blur";

const logos = [
  { name: "Solana", src: "https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png" },
  { name: "Circle", src: "https://cryptologos.cc/logos/usd-coin-usdc-logo.png" },
  { name: "Serum", src: "https://cryptologos.cc/logos/serum-srm-logo.png" },
  { name: "Phantom", src: "https://ph-assets.imgix.net/static/phantom-icon-purple.png" },
  { name: "Chainlink", src: "https://cryptologos.cc/logos/chainlink-link-logo.png" },
  { name: "Arweave", src: "https://cryptologos.cc/logos/arweave-ar-logo.png" },
];

export function LogoCloud() {
  return (
    <div className="relative mx-auto max-w-5xl py-12">
      <h3 className="text-center text-sm font-mono text-gray-500 mb-8 uppercase tracking-widest">
        Trusted by Industry Leaders
      </h3>
      <div className="relative">
         {/* FIX: Changed 'speed' to 'duration' (Lower number = Faster) */}
         <InfiniteSlider gap={60} duration={20}>
            {logos.map((logo) => (
              <div key={logo.name} className="flex items-center space-x-2 grayscale hover:grayscale-0 transition-all opacity-50 hover:opacity-100">
                 <img src={logo.src} alt={logo.name} className="h-8 w-auto object-contain" />
                 <span className="text-lg font-bold text-white hidden md:block">{logo.name}</span>
              </div>
            ))}
         </InfiniteSlider>
         
         <ProgressiveBlur 
           blurIntensity={2} 
           className="pointer-events-none absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#020402] to-transparent" 
           direction="left" 
         />
         <ProgressiveBlur 
           blurIntensity={2} 
           className="pointer-events-none absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#020402] to-transparent" 
           direction="right" 
         />
      </div>
    </div>
  );
}