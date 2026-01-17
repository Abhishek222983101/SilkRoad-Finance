import React from "react";

interface SectionWithMockupProps {
  title: React.ReactNode;
  description: string;
  mockupImage?: string; // We added this optional prop
}

export const SectionWithMockup = ({ title, description, mockupImage }: SectionWithMockupProps) => {
  return (
    <section className="relative w-full py-20 overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          
          {/* Left Side: Text */}
          <div className="flex-1 text-center lg:text-left z-10">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-6 leading-tight">
              {title}
            </h2>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              {description}
            </p>
            <button className="px-8 py-4 bg-[#00E500]/10 border border-[#00E500]/50 text-[#00E500] font-bold rounded-full hover:bg-[#00E500] hover:text-black transition-all shadow-[0_0_20px_rgba(0,229,0,0.1)]">
              Learn More
            </button>
          </div>

          {/* Right Side: Image / Diagram */}
          <div className="flex-1 w-full relative z-10">
            <div className="relative rounded-3xl border border-white/10 bg-black/50 backdrop-blur-sm p-2 shadow-2xl">
              {/* Glow Effect behind image */}
              <div className="absolute -inset-1 bg-gradient-to-r from-[#00E500]/20 to-transparent blur-2xl opacity-30 pointer-events-none" />
              
              {mockupImage ? (
                <img 
                  src={mockupImage} 
                  alt="Architecture Diagram" 
                  className="w-full h-auto rounded-2xl border border-white/5 shadow-lg"
                />
              ) : (
                // Fallback if no image provided
                <div className="w-full aspect-video bg-white/5 rounded-2xl flex items-center justify-center border border-white/10 border-dashed">
                  <span className="text-gray-600">No Image Available</span>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};