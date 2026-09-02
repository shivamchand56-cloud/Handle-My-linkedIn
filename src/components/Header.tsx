import React, { useState } from 'react';
import { 
  Sparkles, 
  Calendar, 
  Zap, 
  BookOpen, 
  Compass, 
  Search,
  User,
  X,
  ChevronRight
} from 'lucide-react';

interface HeaderProps {
  activeTab: 'immediate' | 'campaign' | 'algorithm' | 'domains';
  setActiveTab: (tab: 'immediate' | 'campaign' | 'algorithm' | 'domains') => void;
  authorName: string;
  authorHeadline: string;
  onOpenProfileModal?: () => void;
  searchQuery?: string;
  setSearchQuery?: (q: string) => void;
  currentDomainName?: string;
  currentLevel?: string;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  authorName,
  authorHeadline,
  onOpenProfileModal,
  searchQuery = '',
  setSearchQuery,
  currentDomainName = 'Marketing & Growth Strategy',
  currentLevel = 'expert',
}) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  const NAV_ITEMS = [
    { id: 'immediate', label: 'Post Builder', shortLabel: 'Post', icon: Zap },
    { id: 'campaign', label: 'Campaign Sprint', shortLabel: 'Sprint', icon: Calendar },
    { id: 'domains', label: 'Domain Vault', shortLabel: 'Vault', icon: Compass },
    { id: 'algorithm', label: 'Algorithm', shortLabel: 'Algo', icon: BookOpen },
  ] as const;

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-[#E5E7EB] sticky top-0 z-40 shrink-0">
      <div className="max-w-7xl mx-auto px-3 sm:px-5">
        <div className="h-14 flex items-center justify-between gap-2 sm:gap-4">
          
          {/* LEFT: Brand Identity & Active Track Tag */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div 
              onClick={() => setActiveTab('immediate')} 
              className="flex items-center gap-2 cursor-pointer select-none group"
              title="Handle My LinkedIn"
            >
              <div className="w-8 h-8 rounded-lg bg-[#0077B5] group-hover:bg-[#004182] text-white flex items-center justify-center font-black text-base shadow-xs transition">
                in
              </div>
              <div className="flex flex-col">
                <span className="text-xs sm:text-sm font-black tracking-tight text-[#111827] group-hover:text-[#0077B5] transition leading-tight">
                  Handle My LinkedIn
                </span>
                <span className="text-[9px] font-bold text-[#0077B5] tracking-wider uppercase leading-none hidden xs:inline">
                  Authority Engine
                </span>
              </div>
            </div>

            {/* Subtle Active Track Chip */}
            <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-[#E5E7EB] text-[11px] text-[#4B5563]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#0077B5]" />
              <span className="font-semibold text-[#111827] truncate max-w-[160px]">{currentDomainName}</span>
              <span className="text-[#9CA3AF]">•</span>
              <span className="capitalize text-[#6B7280]">{currentLevel}</span>
            </div>
          </div>

          {/* CENTER: Sleek Segmented Capsule Touchpoints */}
          <nav className="flex items-center bg-[#F3F4F6] p-1 rounded-xl border border-[#E5E7EB] overflow-x-auto max-w-full no-scrollbar">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-tab-${item.id}`}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer select-none ${
                    isActive
                      ? 'bg-white text-[#0077B5] shadow-xs ring-1 ring-black/5'
                      : 'text-[#4B5563] hover:text-[#111827] hover:bg-black/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#0077B5]' : 'text-[#6B7280]'}`} />
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.shortLabel}</span>
                </button>
              );
            })}
          </nav>

          {/* RIGHT: Expandable Search & Author Profile */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Expandable Search Pill */}
            <div className="relative flex items-center">
              {isSearchOpen ? (
                <div className="flex items-center bg-white border border-[#0077B5] rounded-full pl-2.5 pr-1 py-1 shadow-sm w-48 sm:w-64 transition-all">
                  <Search className="w-3.5 h-3.5 text-[#0077B5] mr-1.5 shrink-0" />
                  <input
                    type="text"
                    autoFocus
                    value={searchQuery}
                    onChange={(e) => setSearchQuery && setSearchQuery(e.target.value)}
                    placeholder="Search 14+ domains..."
                    className="w-full bg-transparent text-xs text-[#111827] outline-none placeholder:text-[#9CA3AF]"
                  />
                  <button
                    onClick={() => {
                      setIsSearchOpen(false);
                      if (setSearchQuery) setSearchQuery('');
                    }}
                    className="p-1 hover:bg-[#F3F4F6] rounded-full text-[#6B7280] cursor-pointer ml-1"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setIsSearchOpen(true)}
                  className="p-2 text-[#4B5563] hover:text-[#0077B5] hover:bg-[#F3F4F6] rounded-full transition cursor-pointer"
                  title="Search domain playbooks"
                >
                  <Search className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Profile Avatar Touchpoint */}
            <button
              id="author-profile-pill"
              onClick={onOpenProfileModal}
              className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full bg-[#F3F4F6] hover:bg-[#E5E7EB] border border-[#E5E7EB] transition cursor-pointer"
              title="Edit Author Identity"
            >
              <div className="w-6 h-6 rounded-full bg-[#0077B5] text-white flex items-center justify-center text-[11px] font-black shadow-2xs">
                {authorName ? authorName.charAt(0).toUpperCase() : 'U'}
              </div>
              <span className="text-xs font-bold text-[#111827] max-w-[80px] sm:max-w-[110px] truncate hidden md:inline">
                {authorName.split(' ')[0] || 'Author'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
