import React, { useState } from 'react';
import { GitMerge, ArrowUp, ArrowDown, CheckCircle2, RotateCcw, Trophy, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';

interface FlowLevel {
  id: number;
  title: string;
  problem: string;
  correctOrder: string[];
}

const FLOW_LEVELS: FlowLevel[] = [
  {
    id: 1,
    title: 'خوارزمية فحص العدد (موجب أم سالب)',
    problem: 'رتب الخطوات لبناء خوارزمية صحيحة تفحص هل العدد المدخل x موجب (> 0) أم سالب/صفر:',
    correctOrder: [
      '1. البداية (Start) - شكل بيضاوي',
      '2. أدخل قيمة العدد x (Input x) - متوازي أضلاع',
      '3. هل x > 0؟ (Decision) - معين',
      '4. إذا نعم: اطبع "العدد موجب" - متوازي أضلاع',
      '5. إذا لا: اطبع "العدد سالب أو صفر" - متوازي أضلاع',
      '6. النهاية والتوقف (Stop) - شكل بيضاوي'
    ]
  },
  {
    id: 2,
    title: 'خوارزمية حساب مساحة المستطيل',
    problem: 'رتب الخطوات الحسابية لطلب الطول والعرض وحساب المساحة وطباعتها:',
    correctOrder: [
      '1. البداية (Start) - شكل بيضاوي',
      '2. أدخل الطول L والعرض W (Input L, W) - متوازي أضلاع',
      '3. احسب المساحة: Area = L * W (Process) - مستطيل',
      '4. اطبع قيمة Area (Print Area) - متوازي أضلاع',
      '5. التوقف (Stop) - شكل بيضاوي'
    ]
  },
  {
    id: 3,
    title: 'خوارزمية حلقة جمع الأرقام من 1 إلى 5',
    problem: 'رتب خطوات حلقة تكرار while لجمع الأرقام وطباعة المجموع النهائي:',
    correctOrder: [
      '1. البداية وتعيين count = 1 و total = 0 - مستطيل',
      '2. هل count <= 5؟ (فحص شرط الحلقة) - معين',
      '3. إذا نعم: أضف count إلى total ثم زد count بواحد - مستطيل',
      '4. تكرار الخطوة السابقة طالما الشرط صائب - أسهم تكرار',
      '5. عند انتهاء الحلقة (إذا لا): اطبع total - متوازي أضلاع',
      '6. التوقف (Stop) - شكل بيضاوي'
    ]
  }
];

// Helper to shuffle array
const shuffle = (array: string[]) => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

export const FlowchartGame: React.FC<{ onScoreUpdate?: (points: number) => void }> = ({ onScoreUpdate }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const current = FLOW_LEVELS[levelIdx];
  const [items, setItems] = useState<string[]>(() => shuffle(current.correctOrder));
  const [feedback, setFeedback] = useState<{ isSuccess: boolean; msg: string } | null>(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const moveItem = (index: number, direction: 'up' | 'down') => {
    sound.playClick();
    const newItems = [...items];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newItems.length) return;

    const temp = newItems[index];
    newItems[index] = newItems[targetIdx];
    newItems[targetIdx] = temp;
    setItems(newItems);
    setFeedback(null);
  };

  const checkOrder = () => {
    const isCorrect = items.every((item, idx) => item === current.correctOrder[idx]);
    if (isCorrect) {
      sound.playSuccess();
      const points = 30;
      setScore((prev) => prev + points);
      if (onScoreUpdate) onScoreUpdate(points);

      setFeedback({
        isSuccess: true,
        msg: 'أحسنت صنعاً! ترتيب منطقي وهندسي سليم 100% 🎯'
      });
      confetti({ particleCount: 70, spread: 60, origin: { y: 0.7 } });
    } else {
      sound.playError();
      setFeedback({
        isSuccess: false,
        msg: 'الترتيب ما زال غير مكتمل منطقياً، تذكر: البداية أولاً، ثم الإدخال، فالمعالجة والشرط، ثم الطباعة والتوقف!'
      });
    }
  };

  const handleNextLevel = () => {
    sound.playClick();
    if (levelIdx < FLOW_LEVELS.length - 1) {
      const nextIdx = levelIdx + 1;
      setLevelIdx(nextIdx);
      setItems(shuffle(FLOW_LEVELS[nextIdx].correctOrder));
      setFeedback(null);
    } else {
      setIsFinished(true);
      sound.playWinFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setLevelIdx(0);
    setItems(shuffle(FLOW_LEVELS[0].correctOrder));
    setScore(0);
    setFeedback(null);
    setIsFinished(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-3xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800 flex items-center gap-1 w-fit">
            <GitMerge className="w-3.5 h-3.5" />
            تحدي المنطق البرمجي ومخططات الانسياب
          </span>
          <h2 className="text-xl font-black text-slate-800 mt-1">تجميع مخطط سير العمل (Flowchart Master)</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-left">
            <div className="text-[10px] text-slate-400">النقاط المكتسبة</div>
            <div className="text-lg font-black text-indigo-600 font-mono">{score} XP</div>
          </div>
          <button onClick={handleRestart} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100" title="إعادة اللعبة">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!isFinished ? (
        <div>
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>المستوى {levelIdx + 1} من {FLOW_LEVELS.length}</span>
            <span className="text-indigo-600 font-bold">{current.title}</span>
          </div>
          <p className="text-xs text-slate-600 mb-4 bg-slate-50 p-3 rounded-xl border border-slate-200">
            {current.problem}
          </p>

          {/* List of blocks */}
          <div className="space-y-2 mb-6">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 bg-indigo-50/50 hover:bg-indigo-50 border border-indigo-200/80 rounded-2xl shadow-sm transition-all"
              >
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-indigo-600 text-white font-bold text-xs flex items-center justify-center">
                    {idx + 1}
                  </span>
                  <span className="text-xs md:text-sm font-semibold text-slate-800">{item}</span>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    disabled={idx === 0}
                    onClick={() => moveItem(idx, 'up')}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 transition"
                    title="تحريك لأعلى"
                  >
                    <ArrowUp className="w-4 h-4 text-slate-600" />
                  </button>
                  <button
                    disabled={idx === items.length - 1}
                    onClick={() => moveItem(idx, 'down')}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-slate-100 disabled:opacity-30 transition"
                    title="تحريك لأسفل"
                  >
                    <ArrowDown className="w-4 h-4 text-slate-600" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Feedback */}
          {feedback && (
            <div
              className={`p-4 rounded-2xl border mb-6 text-xs leading-relaxed animate-fadeIn ${
                feedback.isSuccess
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-bold'
                  : 'bg-amber-50 border-amber-300 text-amber-950'
              }`}
            >
              {feedback.msg}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3">
            <button
              onClick={checkOrder}
              className="flex-1 py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl shadow transition"
            >
              تحقق من صحة الترتيب المنطقي
            </button>
            {feedback?.isSuccess && (
              <button
                onClick={handleNextLevel}
                className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow transition"
              >
                {levelIdx < FLOW_LEVELS.length - 1 ? 'المستوى التالي ⬅️' : 'استعراض النتيجة'}
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Finished Screen */
        <div className="text-center py-8">
          <Award className="w-16 h-16 text-indigo-500 mx-auto mb-3 animate-bounce" />
          <h3 className="text-2xl font-black text-slate-900 mb-1">عبقري الخوارزميات!</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            لقد أتقنت التفكير الحسابي وبناء مخططات الانسياب بدقة متناهية!
          </p>

          <div className="inline-block bg-indigo-50 p-6 rounded-2xl border border-indigo-200 mb-6">
            <div className="text-xs text-indigo-600">النقاط الكلية</div>
            <div className="text-4xl font-black text-indigo-700 mt-1">{score} XP</div>
          </div>

          <div>
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition"
            >
              إعادة المستويات
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
