import partnersHeroImg from "@/assets/partners-comparison-hero.jpg";

const PartnerComparisonHero = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Main image */}
      <div className="relative">
        <img
          src={partnersHeroImg}
          alt="Man och kvinna jämför offerter från Microsoft-partners"
          className="max-h-[350px] sm:max-h-[400px] md:max-h-[450px] w-auto object-contain rounded-lg shadow-2xl"
        />
        
        {/* Floating offer bubbles */}
        <div className="absolute -top-2 -left-4 sm:-left-8 md:-left-16 bg-white rounded-xl shadow-xl p-3 sm:p-4 animate-fade-in border border-gray-100 min-w-[130px] sm:min-w-[150px]">
          <div className="text-xs sm:text-sm font-bold text-gray-800 mb-1 text-left">Offert #1</div>
          <div className="text-base sm:text-lg font-bold text-emerald-600 mb-2 text-left">850 000 kr</div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-emerald-500 rounded-full flex items-center justify-center text-white text-xs font-bold">X</div>
            <span className="text-xs text-gray-600 text-left">Partner X</span>
          </div>
          {/* Speech bubble pointer */}
          <div className="absolute -bottom-2 right-8 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45 transform" />
        </div>

        <div className="absolute -top-6 sm:-top-8 right-0 sm:right-4 md:right-0 bg-white rounded-xl shadow-xl p-3 sm:p-4 animate-fade-in border border-gray-100 min-w-[130px] sm:min-w-[150px]" style={{ animationDelay: "0.2s" }}>
          <div className="text-xs sm:text-sm font-bold text-gray-800 mb-1 text-left">Offert #2</div>
          <div className="text-base sm:text-lg font-bold text-blue-600 mb-2 text-left">920 000 kr</div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Y</div>
            <span className="text-xs text-gray-600 text-left">Partner Y</span>
          </div>
          {/* Speech bubble pointer */}
          <div className="absolute -bottom-2 left-8 w-4 h-4 bg-white border-r border-b border-gray-100 rotate-45 transform" />
        </div>

        <div className="absolute bottom-4 sm:bottom-8 -right-2 sm:-right-4 md:-right-12 bg-white rounded-xl shadow-xl p-3 sm:p-4 animate-fade-in border border-gray-100 min-w-[130px] sm:min-w-[150px]" style={{ animationDelay: "0.4s" }}>
          <div className="text-xs sm:text-sm font-bold text-gray-800 mb-1 text-left">Offert #3</div>
          <div className="text-base sm:text-lg font-bold text-amber-600 mb-2 text-left">780 000 kr</div>
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 sm:w-6 sm:h-6 bg-amber-500 rounded-full flex items-center justify-center text-white text-xs font-bold">Z</div>
            <span className="text-xs text-gray-600 text-left">Partner Z</span>
          </div>
          {/* Speech bubble pointer */}
          <div className="absolute -top-2 left-8 w-4 h-4 bg-white border-l border-t border-gray-100 rotate-45 transform" />
        </div>
      </div>
    </div>
  );
};

export default PartnerComparisonHero;
