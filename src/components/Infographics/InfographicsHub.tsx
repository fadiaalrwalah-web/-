import React, { useState } from 'react';
import { Sparkles, Layers, Cpu, Leaf, AlertTriangle, Smartphone, GitBranch, ArrowRight, Share2, Check } from 'lucide-react';
import { INFOGRAPHICS_DATA, InfographicItem } from '../../data/infographicsData';
import { sound } from '../../utils/soundEffects';

export const InfographicsHub: React.FC = () => {
  const [selectedUnit, setSelectedUnit] = useState<string>('all');
  const [activeItem, setActiveItem] = useState<InfographicItem>(INFOGRAPHICS_DATA[0]);
  const [copied, setCopied] = useState(false);

  const filteredItems = selectedUnit === 'all'
    ? INFOGRAPHICS_DATA
    : INFOGRAPHICS_DATA.filter((i) => i.unit.includes(selectedUnit));

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Cpu': return <Cpu className="w-5 h-5" />;
      case 'GitBranch': return <GitBranch className="w-5 h-5" />;
      case 'Leaf': return <Leaf className="w-5 h-5" />;
      case 'AlertTriangle': return <AlertTriangle className="w-5 h-5" />;
      case 'Smartphone': return <Smartphone className="w-5 h-5" />;
      default: return <Layers className="w-5 h-5" />;
    }
  };

  const handleShare = () => {
    sound.playClick();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(`${activeItem.title} - ${activeItem.summaryTakeaway}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="py-6 max-w-6xl mx-auto space-y-8" dir="rtl">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-teal-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-teal-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 bg-white/20 backdrop-blur rounded-full text-xs font-bold flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                إنفوجرافيك تعليمي تفاعلي (Interactive Infographics)
              </span>
              <span className="text-xs text-teal-200">تبسيط بصري لمفاهيم الكتاب المدرسي</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black">المعرض البصري ورسوم الإنفوجرافيك</h1>
            <p className="text-xs md:text-sm text-slate-200 max-w-2xl mt-2 leading-relaxed">
              استكشف المفاهيم المعقدة والجداول والخرائط الذهنية بأسلوب بصري تفاعلي جذاب، لتسهيل الفهم والربط الذهني واسترجاع المعلومات قبل الامتحانات.
            </p>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-slate-200 pb-4">
        <button
          onClick={() => {
            sound.playClick();
            setSelectedUnit('all');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            selectedUnit === 'all'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          جميع تصاميم الإنفوجرافيك ({INFOGRAPHICS_DATA.length})
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setSelectedUnit('الأولى');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            selectedUnit === 'الأولى'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          الوحدة الأولى: الخوارزميات والبرمجة بايثون
        </button>
        <button
          onClick={() => {
            sound.playClick();
            setSelectedUnit('الثانية');
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            selectedUnit === 'الثانية'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          الوحدة الثانية: الحوسبة والحياة والاستدامة
        </button>
      </div>

      {/* Layout: Sidebar list + Detail View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* List of infographics */}
        <div className="lg:col-span-4 space-y-3">
          <div className="text-xs font-bold text-slate-500 mb-1">اختر المخطط الإنفوجرافيكي:</div>
          {filteredItems.map((item) => {
            const isSelected = activeItem.id === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  sound.playClick();
                  setActiveItem(item);
                }}
                className={`w-full text-right p-4 rounded-2xl border transition-all duration-200 flex items-start gap-3.5 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border-indigo-700 shadow-lg scale-102 ring-2 ring-indigo-300'
                    : 'bg-white hover:bg-indigo-50/60 border-slate-200 text-slate-800'
                }`}
              >
                <div className={`p-2.5 rounded-xl shrink-0 ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-indigo-600'
                }`}>
                  {getIcon(item.iconName)}
                </div>
                <div>
                  <div className={`text-[10px] font-bold ${isSelected ? 'text-indigo-200' : 'text-slate-400'}`}>
                    {item.badge}
                  </div>
                  <h4 className="text-sm font-bold mt-0.5 leading-snug">{item.title}</h4>
                  <p className={`text-[11px] mt-1 line-clamp-2 ${isSelected ? 'text-indigo-100' : 'text-slate-500'}`}>
                    {item.description}
                  </p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Detailed Infographic Display */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-xl space-y-6">
          {/* Header of Infographic */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                  {activeItem.category}
                </span>
                <span className="text-xs text-slate-400">{activeItem.unit}</span>
              </div>
              <h2 className="text-xl md:text-2xl font-black text-slate-900">{activeItem.title}</h2>
              <p className="text-xs md:text-sm text-slate-600 mt-1">{activeItem.description}</p>
            </div>

            <button
              onClick={handleShare}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 transition shrink-0"
              title="نسخ ملخص الإنفوجرافيك"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
              <span>{copied ? 'تم النسخ' : 'مشاركة الملخص'}</span>
            </button>
          </div>

          {/* Quick Stats if available */}
          {activeItem.stats && (
            <div className="grid grid-cols-2 gap-4">
              {activeItem.stats.map((st, sIdx) => (
                <div key={sIdx} className="bg-gradient-to-r from-slate-50 to-indigo-50/40 p-4 rounded-2xl border border-indigo-100 text-center">
                  <div className="text-[11px] text-slate-500">{st.label}</div>
                  <div className="text-lg md:text-xl font-black text-indigo-600 mt-0.5">{st.value}</div>
                </div>
              ))}
            </div>
          )}

          {/* Flowing Visual Cards / Nodes */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activeItem.stepsOrNodes.map((node, nIdx) => (
              <div
                key={nIdx}
                className="p-5 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-indigo-50/20 border border-slate-200 hover:border-indigo-300 transition-all shadow-sm hover:shadow-md flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="w-6 h-6 rounded-full bg-indigo-600 text-white text-xs font-bold flex items-center justify-center">
                      {nIdx + 1}
                    </span>
                    {node.tag && (
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800">
                        {node.tag}
                      </span>
                    )}
                  </div>
                  <h4 className="font-bold text-sm text-slate-900">{node.title}</h4>
                  {node.subtitle && (
                    <div className="text-xs text-indigo-600 font-semibold mb-1">{node.subtitle}</div>
                  )}
                  <p className="text-xs text-slate-600 leading-relaxed mt-2">{node.details}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Final Takeaway Box */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-indigo-50 to-teal-50 border border-indigo-200/80">
            <div className="text-xs font-bold text-indigo-900 flex items-center gap-1.5 mb-1">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>الخلاصة المعرفية للإنفوجرافيك:</span>
            </div>
            <p className="text-xs text-indigo-950 leading-relaxed font-medium">
              {activeItem.summaryTakeaway}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
