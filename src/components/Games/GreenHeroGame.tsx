import React, { useState } from 'react';
import { Leaf, Trash2, HeartHandshake, Zap, ShieldCheck, CheckCircle2, RotateCcw, Award } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';

interface EcoItem {
  id: number;
  name: string;
  category: 'toxic_recycle' | 'donate_reuse' | 'energy_saving' | 'data_safety';
  icon: string;
  hint: string;
  explanation: string;
}

const ECO_ITEMS: EcoItem[] = [
  {
    id: 1,
    name: 'بطارية هاتف محمول قديمة منتفخة',
    category: 'toxic_recycle',
    icon: '🔋',
    hint: 'تحتوي على الكادميوم ومواد خطرة قابلة للاشتعال والتسمم',
    explanation: 'البطاريات التالفة تحتوي على الكادميوم السام ويجب تسليمها لمركز إعادة تدوير معتمد (مثل مشروع تفكيك) ولا يجوز رميها في النفايات العادية.'
  },
  {
    id: 2,
    name: 'حاسوب محمول (Laptop) يعمل بحالة جيدة استبدل بأحدث منه',
    category: 'donate_reuse',
    icon: '💻',
    hint: 'يمكن لطالب آخر أو مدرسة الاستفادة منه بدلاً من التخلص منه',
    explanation: 'تجديد الأجهزة الصالحة والتبرع بها للمدارس أو الجمعيات يعزز التكافل ويطيل عمر الجهاز ويقلل النفايات.'
  },
  {
    id: 3,
    name: 'مغادرة مكتب الحاسوب لأكثر من ساعة في الدوام',
    category: 'energy_saving',
    icon: '⚡',
    hint: 'إجراء يقلل استهلاك الكهرباء عند عدم استخدام الجهاز',
    explanation: 'يجب ضبط الجهاز على وضع السكون (Sleep Mode) أو إطفاؤه لترشيد استهلاك الطاقة وخفض انبعاثات الكربون.'
  },
  {
    id: 4,
    name: 'قرص صلب (Hard Drive) قديم يحوي ملفات شخصية وصوراً قبل التبرع',
    category: 'data_safety',
    icon: '🛡️',
    hint: 'إجراء وقائي حاسم لحماية الخصوصية',
    explanation: 'تنظيف البيانات (Data Sanitization) ومسحها نهائياً أمر إلزامي قبل تسليم أي جهاز للتدوير لحماية الخصوصية.'
  },
  {
    id: 5,
    name: 'شاشة حاسوب قديمة مكسورة تحتوي على لحام الرصاص',
    category: 'toxic_recycle',
    icon: '🖥️',
    hint: 'الشاشات المكسورة تطلق سموم الرصاص وتتطلب معالجة خاصة',
    explanation: 'يجب تفكيك ومعالجة الشاشات في مرافق متخصصة لمنع تسرب الرصاص إلى التربة والمياه الجوفية.'
  },
  {
    id: 6,
    name: 'شراء طابعة جديدة تحمل ملصق نجمة الطاقة (Energy Star)',
    category: 'energy_saving',
    icon: '⭐',
    hint: 'اختيار أجهزة مطابقة لمعايير الاستهلاك المنخفض للطاقة',
    explanation: 'اختيار الأجهزة التي تحمل ملصق Energy Star يضمن استهلاك طاقة أقل بنسبة تصل إلى 40% مقارنة بالأجهزة العادية.'
  }
];

export const GreenHeroGame: React.FC<{ onScoreUpdate?: (points: number) => void }> = ({ onScoreUpdate }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [lastFeedback, setLastFeedback] = useState<{ isCorrect: boolean; text: string } | null>(null);
  const [isFinished, setIsFinished] = useState(false);

  const currentItem = ECO_ITEMS[currentIdx];

  const bins = [
    {
      id: 'toxic_recycle',
      title: 'تدوير نفايات سامة',
      subtitle: 'مشاريع كـ "تفكيك" ووزارة البيئة',
      icon: Trash2,
      color: 'bg-rose-50 hover:bg-rose-100 border-rose-300 text-rose-900'
    },
    {
      id: 'donate_reuse',
      title: 'إعادة استخدام وتبرع',
      subtitle: 'أجهزة صالحة للمدارس والمحتاجين',
      icon: HeartHandshake,
      color: 'bg-blue-50 hover:bg-blue-100 border-blue-300 text-blue-900'
    },
    {
      id: 'energy_saving',
      title: 'ترشيد استهلاك وطاقة',
      subtitle: 'وضع السكون وملصق Energy Star',
      icon: Zap,
      color: 'bg-amber-50 hover:bg-amber-100 border-amber-300 text-amber-900'
    },
    {
      id: 'data_safety',
      title: 'تنظيف بيانات وأمان',
      subtitle: 'مسح نهائي لحماية الخصوصية',
      icon: ShieldCheck,
      color: 'bg-emerald-50 hover:bg-emerald-100 border-emerald-300 text-emerald-900'
    }
  ];

  const handleClassify = (binId: string) => {
    if (lastFeedback) return;

    const isCorrect = binId === currentItem.category;
    if (isCorrect) {
      sound.playSuccess();
      const newStreak = streak + 1;
      const points = 20 + newStreak * 5;
      setScore((prev) => prev + points);
      setStreak(newStreak);
      if (onScoreUpdate) onScoreUpdate(points);
      setLastFeedback({
        isCorrect: true,
        text: `إجابة صحيحة رائعة! 🎉 ${currentItem.explanation}`
      });
    } else {
      sound.playError();
      setStreak(0);
      setLastFeedback({
        isCorrect: false,
        text: `تصنيف غير دقيق! 💡 ${currentItem.explanation}`
      });
    }
  };

  const handleNext = () => {
    sound.playClick();
    setLastFeedback(null);
    if (currentIdx < ECO_ITEMS.length - 1) {
      setCurrentIdx(currentIdx + 1);
    } else {
      setIsFinished(true);
      sound.playWinFanfare();
      confetti({ particleCount: 100, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIdx(0);
    setScore(0);
    setStreak(0);
    setLastFeedback(null);
    setIsFinished(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-emerald-100 max-w-3xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 flex items-center gap-1 w-fit">
            <Leaf className="w-3.5 h-3.5" />
            تحدي الاستدامة والحوسبة الخضراء
          </span>
          <h2 className="text-xl font-black text-slate-800 mt-1">بطل الحوسبة الخضراء (Green Computing Hero)</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-left">
            <div className="text-[10px] text-slate-400">النقاط الخضراء</div>
            <div className="text-lg font-black text-emerald-600 font-mono">{score} XP</div>
          </div>
          <button onClick={handleRestart} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100" title="إعادة التحدي">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isFinished ? (
        <div>
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>العنصر {currentIdx + 1} من {ECO_ITEMS.length}</span>
            {streak > 1 && (
              <span className="text-amber-600 font-bold animate-pulse">🔥 سلسلة إجابات متتالية: {streak}</span>
            )}
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
            <div
              className="bg-emerald-500 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / ECO_ITEMS.length) * 100}%` }}
            />
          </div>

          {/* Item Card */}
          <div className="bg-gradient-to-br from-slate-50 to-emerald-50/50 p-6 rounded-3xl border border-emerald-100 text-center mb-6 shadow-sm">
            <div className="text-5xl mb-2">{currentItem.icon}</div>
            <h3 className="text-lg font-bold text-slate-900 mb-1">{currentItem.name}</h3>
            <p className="text-xs text-slate-500 max-w-md mx-auto">{currentItem.hint}</p>
          </div>

          {/* 4 Classification Bins */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
            {bins.map((bin) => {
              const IconComp = bin.icon;
              return (
                <button
                  key={bin.id}
                  disabled={lastFeedback !== null}
                  onClick={() => handleClassify(bin.id)}
                  className={`p-4 rounded-2xl border text-right transition-all flex items-start gap-3 ${bin.color} ${
                    lastFeedback !== null ? 'opacity-70 cursor-not-allowed' : 'active:scale-98 shadow-sm hover:shadow'
                  }`}
                >
                  <div className="p-2 rounded-xl bg-white/80 shadow-sm shrink-0">
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm">{bin.title}</div>
                    <div className="text-[11px] opacity-80 mt-0.5">{bin.subtitle}</div>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Feedback banner */}
          {lastFeedback && (
            <div
              className={`p-4 rounded-2xl border mb-6 text-xs leading-relaxed animate-fadeIn ${
                lastFeedback.isCorrect
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              {lastFeedback.text}
              <button
                onClick={handleNext}
                className="mt-3 w-full py-2.5 bg-slate-900 hover:bg-black text-white font-bold rounded-xl text-xs transition"
              >
                {currentIdx < ECO_ITEMS.length - 1 ? 'العنصر التالي ⬅️' : 'استعراض النتيجة النهائية'}
              </button>
            </div>
          )}
        </div>
      ) : (
        /* Finished View */
        <div className="text-center py-8">
          <Award className="w-16 h-16 text-emerald-500 mx-auto mb-3 animate-bounce" />
          <h3 className="text-2xl font-black text-slate-900 mb-1">تهانينا! أنت سفير الحوسبة الخضراء</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            أثبتّ وعيك الكامل باستراتيجيات تقليل النفايات الإلكترونية وترشيد الطاقة وفق المنهج الأردني!
          </p>

          <div className="inline-block bg-emerald-50 p-6 rounded-2xl border border-emerald-200 mb-6">
            <div className="text-xs text-emerald-600">رصيد النقاط البيئية</div>
            <div className="text-4xl font-black text-emerald-700 mt-1">{score} XP</div>
          </div>

          <div>
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition"
            >
              إعادة اللعب وتحدي نفسك
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
