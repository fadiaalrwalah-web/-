import React, { useState } from 'react';
import { Gamepad2, Star, Bug, Leaf, GitMerge, Trophy, Sparkles, ArrowLeft } from 'lucide-react';
import { StarsAndMoonsGame } from './StarsAndMoonsGame';
import { BugHunterGame } from './BugHunterGame';
import { GreenHeroGame } from './GreenHeroGame';
import { FlowchartGame } from './FlowchartGame';
import { sound } from '../../utils/soundEffects';

interface GamesHubProps {
  onAddXp?: (points: number) => void;
}

export const GamesHub: React.FC<GamesHubProps> = ({ onAddXp }) => {
  const [activeGame, setActiveGame] = useState<'hub' | 'stars' | 'bughunter' | 'greenhero' | 'flowchart'>('hub');

  const games = [
    {
      id: 'stars' as const,
      title: 'لعبة "نجوم وأقمار" (Stars & Moons)',
      badge: 'مشروع الوحدة الأساسي',
      badgeColor: 'bg-amber-100 text-amber-800',
      desc: 'لعبة الذكاء والتخمين الرقمي الواردة في كتاب الطالب؛ خمن الرقم السري من 4 منازل واجمع النجوم والأقمار في 10 محاولات.',
      icon: Star,
      iconColor: 'text-amber-500 fill-amber-500',
      difficulty: 'متوسطة إلى متقدمة',
      unit: 'الوحدة الأولى: البرمجة'
    },
    {
      id: 'bughunter' as const,
      title: 'صائد أخطاء بايثون (Python Bug Hunter)',
      badge: 'تحدي الأكواد',
      badgeColor: 'bg-rose-100 text-rose-800',
      desc: 'تدرب على اكتشاف الأخطاء النحوية والمنطقية والمسافات البادئة وتسمية المتغيرات كما وردت في امتحانات وأسئلة الكتاب.',
      icon: Bug,
      iconColor: 'text-rose-500',
      difficulty: 'متوسطة',
      unit: 'الوحدة الأولى: بايثون'
    },
    {
      id: 'greenhero' as const,
      title: 'بطل الحوسبة الخضراء وتدوير النفايات',
      badge: 'الاستدامة والبيئة',
      badgeColor: 'bg-emerald-100 text-emerald-800',
      desc: 'صنف الأجهزة والممارسات الحاسوبية لحماية البيئة من سموم الرصاص والكادميوم، والتعرف على مشروع تفكيك ونجمة الطاقة.',
      icon: Leaf,
      iconColor: 'text-emerald-500',
      difficulty: 'سهلة وممتعة',
      unit: 'الوحدة الثانية: الحوسبة والحياة'
    },
    {
      id: 'flowchart' as const,
      title: 'تجميع مخططات سير العمل (Flowcharts)',
      badge: 'المنطق والتفكير الحسابي',
      badgeColor: 'bg-indigo-100 text-indigo-800',
      desc: 'رتب الأشكال الهندسية والخطوات الخوارزمية لبناء مخططات تدفق متقنة لحل المشكلات البرمجية الحسابية والشرطية.',
      icon: GitMerge,
      iconColor: 'text-indigo-500',
      difficulty: 'منطقية تفاعلية',
      unit: 'الوحدة الأولى: الخوارزميات'
    }
  ];

  if (activeGame !== 'hub') {
    return (
      <div className="py-6 space-y-6" dir="rtl">
        <button
          onClick={() => {
            sound.playClick();
            setActiveGame('hub');
          }}
          className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-bold rounded-xl shadow-sm transition"
        >
          <ArrowLeft className="w-4 h-4 rotate-180" />
          <span>العودة لمركز الألعاب التعليمية</span>
        </button>

        {activeGame === 'stars' && <StarsAndMoonsGame onScoreUpdate={onAddXp} />}
        {activeGame === 'bughunter' && <BugHunterGame onScoreUpdate={onAddXp} />}
        {activeGame === 'greenhero' && <GreenHeroGame onScoreUpdate={onAddXp} />}
        {activeGame === 'flowchart' && <FlowchartGame onScoreUpdate={onAddXp} />}
      </div>
    );
  }

  return (
    <div className="py-6 max-w-6xl mx-auto" dir="rtl">
      {/* Hero Header */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 text-white rounded-3xl p-8 mb-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 left-0 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold flex items-center gap-1.5">
                <Gamepad2 className="w-3.5 h-3.5 text-amber-300" />
                ألعاب إلكترونية تعليمية هادفة
              </span>
              <span className="text-xs text-indigo-200">المنهاج الأردني المطور 2024-2025</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black">ساحة الألعاب والتحديات البرمجية</h1>
            <p className="text-xs md:text-sm text-indigo-100/90 max-w-xl mt-2 leading-relaxed">
              عزز مهاراتك في مبحث المهارات الرقمية من خلال 4 ألعاب تفاعلية مبتكرة، مستوحاة مباشرة من مشاريع وأسئلة كتاب الطالب والأنشطة العملية!
            </p>
          </div>
          <div className="bg-white/10 backdrop-blur border border-white/20 p-5 rounded-2xl text-center shrink-0">
            <Trophy className="w-10 h-10 text-amber-400 mx-auto mb-1 animate-pulse" />
            <div className="text-xs text-indigo-200">نقاط الخبرة والإنجاز</div>
            <div className="text-xl font-bold text-white mt-0.5">اربح +100 XP بكل فوز</div>
          </div>
        </div>
      </div>

      {/* Grid of 4 Games */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {games.map((g) => {
          const IconComp = g.icon;
          return (
            <div
              key={g.id}
              className="bg-white rounded-3xl p-6 border border-slate-200 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3.5 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 transition-colors">
                    <IconComp className={`w-7 h-7 ${g.iconColor} group-hover:text-white transition-colors`} />
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${g.badgeColor}`}>
                    {g.badge}
                  </span>
                </div>

                <div className="text-[11px] font-semibold text-slate-400 mb-1">{g.unit}</div>
                <h3 className="text-lg font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors">
                  {g.title}
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-6">{g.desc}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
                <span className="text-xs text-slate-400 font-medium">مستوى الصعوبة: {g.difficulty}</span>
                <button
                  onClick={() => {
                    sound.playClick();
                    setActiveGame(g.id);
                  }}
                  className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                >
                  <span>ابدأ اللعب الآن</span>
                  <ArrowLeft className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
