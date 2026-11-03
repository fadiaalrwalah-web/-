import React, { useState } from 'react';
import { BookOpen, Gamepad2, Award, Terminal, FileCheck, Layers, Volume2, VolumeX, Sparkles, User, FileText, ExternalLink, Menu, X } from 'lucide-react';
import { TabType, StudentProfile } from '../types';
import { sound } from '../utils/soundEffects';

interface HeaderProps {
  currentTab: TabType | 'infographics';
  onSelectTab: (tab: TabType | 'infographics') => void;
  student: StudentProfile;
  onUpdateName: (name: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentTab,
  onSelectTab,
  student,
  onUpdateName
}) => {
  const [isMuted, setIsMuted] = useState(sound.getMuted());
  const [isEditingName, setIsEditingName] = useState(false);
  const [nameInput, setNameInput] = useState(student.name);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMute = () => {
    const next = !isMuted;
    sound.setMuted(next);
    setIsMuted(next);
  };

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    if (nameInput.trim()) {
      onUpdateName(nameInput.trim());
      setIsEditingName(false);
      sound.playSuccess();
    }
  };

  const navItems: { id: TabType | 'infographics'; label: string; icon: any; badge?: string }[] = [
    { id: 'home', label: 'الرئيسية', icon: Sparkles },
    { id: 'lessons', label: 'الشرح التفاعلي', icon: BookOpen },
    { id: 'infographics', label: 'الإنفوجرافيك', icon: Layers, badge: 'جديد' },
    { id: 'pre-test', label: 'الامتحان القبلي', icon: FileCheck },
    { id: 'post-test', label: 'الامتحان البعدي', icon: Award },
    { id: 'games', label: 'الألعاب التعليمية', icon: Gamepad2, badge: '4 ألعاب' },
    { id: 'playground', label: 'مختبر بايثون', icon: Terminal }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs" dir="rtl">
      {/* Top Banner Bar */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white text-[11px] py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="font-bold">المملكة الأردنية الهاشمية 🇯🇴</span>
            <span>•</span>
            <span>المركز الوطني لتطوير المناهج | مبحث المهارات الرقمية - الصف الحادي عشر</span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="/assets/aistudio/_______________________________________________________________59503fc5.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:underline flex items-center gap-1 text-indigo-200 hover:text-white transition"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>تحميل كتاب الطالب الرسمي (PDF)</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div
          onClick={() => {
            sound.playClick();
            onSelectTab('home');
          }}
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-2xl bg-indigo-600 group-hover:bg-indigo-700 flex items-center justify-center text-white shadow-md shadow-indigo-600/30 transition">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <div className="font-black text-slate-900 text-base md:text-lg flex items-center gap-1.5 leading-tight">
              <span>المهارات الرقمية</span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800">
                11 علمي وأدبي
              </span>
            </div>
            <div className="text-[11px] text-slate-500 font-medium">المنصة التعليمية التفاعلية المتكاملة</div>
          </div>
        </div>

        {/* Desktop Nav Tabs */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onSelectTab(item.id);
                }}
                className={`relative px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  isActive
                    ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/20'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <IconComp className="w-4 h-4" />
                <span>{item.label}</span>
                {item.badge && (
                  <span className={`text-[9px] px-1.5 py-0.2 rounded-full font-bold ${
                    isActive ? 'bg-white text-indigo-700' : 'bg-amber-100 text-amber-800'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* User XP & Sound Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Sound Toggle */}
          <button
            onClick={toggleMute}
            className={`p-2 rounded-xl border transition ${
              isMuted ? 'bg-slate-100 text-slate-400 border-slate-200' : 'bg-indigo-50 text-indigo-700 border-indigo-200'
            }`}
            title={isMuted ? 'تشغيل المؤثرات الصوتية' : 'كتم المؤثرات الصوتية'}
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>

          {/* Student Profile Widget */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-2xl">
            <div className="w-7 h-7 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs">
              <User className="w-4 h-4" />
            </div>

            {isEditingName ? (
              <form onSubmit={handleSaveName} className="flex items-center gap-1">
                <input
                  type="text"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-24 px-2 py-0.5 text-xs border rounded bg-white"
                  autoFocus
                />
                <button type="submit" className="text-[10px] text-emerald-600 font-bold px-1">حفظ</button>
              </form>
            ) : (
              <div
                onClick={() => setIsEditingName(true)}
                className="cursor-pointer group text-right"
                title="اضغط لتعديل الاسم على الشهادة"
              >
                <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 flex items-center gap-1">
                  <span>{student.name || 'طالب متميز'}</span>
                  <span className="text-[10px] text-slate-400 font-normal">✏️</span>
                </div>
                <div className="text-[10px] text-emerald-600 font-mono font-bold">{student.xp} XP</div>
              </div>
            )}
          </div>

          {/* Mobile Menu Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 py-3 space-y-1 animate-fadeIn">
          {navItems.map((item) => {
            const IconComp = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  onSelectTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full p-2.5 rounded-xl text-xs font-bold text-right flex items-center justify-between ${
                  isActive ? 'bg-indigo-600 text-white' : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center gap-2">
                  <IconComp className="w-4 h-4" />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </header>
  );
};
