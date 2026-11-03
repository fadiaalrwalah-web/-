import React, { useState } from 'react';
import { Bug, CheckCircle2, XCircle, ArrowLeft, RotateCcw, Trophy, Award, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';

interface BugChallenge {
  id: number;
  title: string;
  sourceRef: string;
  codeSnippet: string;
  bugLineNumber: number;
  explanation: string;
  options: { text: string; isCorrect: boolean }[];
}

const BUG_CHALLENGES: BugChallenge[] = [
  {
    id: 1,
    title: 'تسمية المتغيرات غير الصالحة',
    sourceRef: 'كتاب الطالب ص 47 (السؤال الثالث)',
    codeSnippet: `1st_funding = int(input("Enter 1st funding: "))
2nd_funding = int(input("Enter 2nd funding: "))
total = 1st_funding + 2nd_funding
print("Total =", total)`,
    bugLineNumber: 1,
    explanation: 'قواعد لغة بايثون تمنع بدء اسم المتغير برقم (1st_funding و 2nd_funding غير صحيحة)، ويجب كتابتها مثل funding_1st.',
    options: [
      { text: 'الخطأ هو بدء اسم المتغير برقم، والصواب كتابة funding_1 أو first_funding', isCorrect: true },
      { text: 'الخطأ هو استخدام دالة int()', isCorrect: false },
      { text: 'الخطأ هو استخدام علامة الجمع (+)', isCorrect: false }
    ]
  },
  {
    id: 2,
    title: 'استخدام الكلمات المحجوزة',
    sourceRef: 'كتاب الطالب ص 47 (السؤال الثالث)',
    codeSnippet: `fund1 = int(input("Enter: "))
fund2 = int(input("Enter: "))
raise = fund1 + fund2
print("Raise =", raise)`,
    bugLineNumber: 3,
    explanation: 'كلمة raise هي كلمة محجوزة (Reserved Word) في بايثون تستخدم لإطلاق الاستثناءات، ولا يجوز إطلاقاً استخدامها كاسم متغير!',
    options: [
      { text: 'كلمة raise كلمة محجوزة للغة ويجب استبدالها باسم مثل total_raise', isCorrect: true },
      { text: 'الخطأ في علامة التنصيص في دالة الطباعة', isCorrect: false },
      { text: 'الخطأ أن الأعداد يجب أن تكون float دائماً', isCorrect: false }
    ]
  },
  {
    id: 3,
    title: 'الخلط بين الإسناد والمقارنة',
    sourceRef: 'كتاب الطالب ص 75 و 136',
    codeSnippet: `count = 0
for i in range(10):
    if i % 2 = 0:
        count += 1
print("عدد الأرقام الزوجية:", count)`,
    bugLineNumber: 3,
    explanation: 'في سطر الفحص الشرطي تم استخدام عامل الإسناد (=) بدلاً من عامل المقارنة المنطقية (==)، فالصواب: if i % 2 == 0:',
    options: [
      { text: 'يجب استخدام عامل المقارنة (==) في جملة الشرط بدلاً من عامل الإسناد (=)', isCorrect: true },
      { text: 'حلقة for لا تدعم الدالة range()', isCorrect: false },
      { text: 'معامل باقي القسمة (%) غير مدعوم في بايثون', isCorrect: false }
    ]
  },
  {
    id: 4,
    title: 'دمج النصوص مع الأرقام مباشرة',
    sourceRef: 'كتاب الطالب ص 134 (السؤال الخامس)',
    codeSnippet: `name = "Hello"
result = name + 2
print(result)`,
    bugLineNumber: 2,
    explanation: 'في بايثون لا يمكن دمج سلسلة نصية (str) مع عدد صحيح (int) مباشرة باستخدام (+)، والصواب استخدام الفاصلة أو تحويله لنص: name + str(2)',
    options: [
      { text: 'لا يمكن جمع نص مع عدد صراحة؛ بل يجب استخدام str(2) أو وضع فاصلة في الطباعة', isCorrect: true },
      { text: 'يجب كتابة Hello بأحرف صغيرة فقط', isCorrect: false },
      { text: 'المتغير result يجب أن يُعرّف بكلمة def', isCorrect: false }
    ]
  },
  {
    id: 5,
    title: 'نسيان النقطتين الرأسيتين ومسافة البداية',
    sourceRef: 'كتاب الطالب ص 59 (نشاط اكتشاف الأخطاء)',
    codeSnippet: `grade = int(input("Enter grade: "))
if grade >= 85
    print("A")
else:
    print("F")`,
    bugLineNumber: 2,
    explanation: 'تنص قواعد بايثون على وجوب وضع نقطتين رأسيتين (:) في نهاية سطر الشرط (if condition:).',
    options: [
      { text: 'نسيان النقطتين الرأسيتين (:) بعد الشرط: if grade >= 85:', isCorrect: true },
      { text: 'كلمة print يجب أن تكتب Print بأحرف كبيرة', isCorrect: false },
      { text: 'علامة الأكبر من أو يساوي تكتب => وليس >=', isCorrect: false }
    ]
  }
];

export const BugHunterGame: React.FC<{ onScoreUpdate?: (points: number) => void }> = ({ onScoreUpdate }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [gameFinished, setGameFinished] = useState(false);

  const current = BUG_CHALLENGES[currentIdx];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    const isCorrect = current.options[idx].isCorrect;
    if (isCorrect) {
      sound.playSuccess();
      const newScore = score + 25;
      setScore(newScore);
      if (onScoreUpdate) onScoreUpdate(25);
    } else {
      sound.playError();
    }
  };

  const handleNextChallenge = () => {
    sound.playClick();
    if (currentIdx < BUG_CHALLENGES.length - 1) {
      setCurrentIdx(currentIdx + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      setGameFinished(true);
      sound.playWinFanfare();
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setCurrentIdx(0);
    setScore(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setGameFinished(false);
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-3xl mx-auto" dir="rtl">
      {/* Top Banner */}
      <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
        <div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-100 text-rose-800 flex items-center gap-1 w-fit">
            <Bug className="w-3.5 h-3.5" />
            تحدي اصطياد الأخطاء البرمجية
          </span>
          <h2 className="text-xl font-black text-slate-800 mt-1">صائد أخطاء بايثون (Python Bug Hunter)</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-left">
            <div className="text-[10px] text-slate-400">النقاط المكتسبة</div>
            <div className="text-lg font-black text-indigo-600 font-mono">{score} XP</div>
          </div>
          <button onClick={handleRestart} className="p-2 rounded-xl text-slate-400 hover:bg-slate-100" title="إعادة التحدي">
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {!gameFinished ? (
        <div>
          {/* Progress */}
          <div className="flex items-center justify-between text-xs text-slate-500 mb-2">
            <span>التحدي {currentIdx + 1} من {BUG_CHALLENGES.length}</span>
            <span className="text-indigo-600 font-bold">{current.sourceRef}</span>
          </div>
          <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mb-6">
            <div
              className="bg-indigo-600 h-full transition-all duration-300"
              style={{ width: `${((currentIdx + 1) / BUG_CHALLENGES.length) * 100}%` }}
            />
          </div>

          <h3 className="text-base font-bold text-slate-800 mb-3">{current.title}</h3>

          {/* Code Viewer with highlight */}
          <div className="bg-slate-900 rounded-2xl p-4 font-mono text-sm text-left mb-6 border border-slate-800 shadow-inner" dir="ltr">
            <div className="text-slate-400 text-xs mb-2 border-b border-slate-800 pb-1 font-sans" dir="rtl">
              الشيفرة البرمجية (ابحث عن الخطأ البرمجي في الأسطر):
            </div>
            {current.codeSnippet.split('\n').map((line, lIdx) => {
              const lineNum = lIdx + 1;
              const isBugLine = isAnswered && lineNum === current.bugLineNumber;
              return (
                <div
                  key={lIdx}
                  className={`flex items-center py-0.5 px-2 rounded ${
                    isBugLine ? 'bg-rose-950/70 text-rose-300 border border-rose-800' : 'text-slate-200'
                  }`}
                >
                  <span className="w-6 text-slate-500 select-none text-xs">{lineNum}</span>
                  <span className="whitespace-pre">{line}</span>
                  {isBugLine && <span className="ml-auto text-xs text-rose-400 font-sans font-bold">⚠️ السطر الخطأ</span>}
                </div>
              );
            })}
          </div>

          {/* Options */}
          <div className="space-y-3 mb-6">
            <div className="text-xs font-bold text-slate-700">ما هو سبب الخطأ وكيف يتم تصحيحه؟</div>
            {current.options.map((opt, oIdx) => {
              let btnClass = 'w-full text-right p-4 rounded-xl border text-xs md:text-sm font-semibold transition-all flex items-center justify-between ';
              if (!isAnswered) {
                btnClass += 'bg-slate-50 hover:bg-indigo-50/70 border-slate-200 text-slate-800';
              } else {
                if (opt.isCorrect) {
                  btnClass += 'bg-emerald-50 border-emerald-400 text-emerald-900 ring-2 ring-emerald-300';
                } else if (selectedOption === oIdx) {
                  btnClass += 'bg-rose-50 border-rose-400 text-rose-900';
                } else {
                  btnClass += 'bg-slate-50 border-slate-200 text-slate-400 opacity-60';
                }
              }

              return (
                <button
                  key={oIdx}
                  disabled={isAnswered}
                  onClick={() => handleSelectOption(oIdx)}
                  className={btnClass}
                >
                  <span>{opt.text}</span>
                  {isAnswered && opt.isCorrect && <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mr-2" />}
                  {isAnswered && selectedOption === oIdx && !opt.isCorrect && (
                    <XCircle className="w-5 h-5 text-rose-600 shrink-0 mr-2" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Explanation if answered */}
          {isAnswered && (
            <div className="p-4 rounded-2xl bg-indigo-50 border border-indigo-200 mb-6 text-xs text-indigo-950 leading-relaxed animate-fadeIn">
              <span className="font-bold block mb-1 text-indigo-900">💡 الشرح التوضيحي:</span>
              {current.explanation}
            </div>
          )}

          {/* Next Button */}
          {isAnswered && (
            <button
              onClick={handleNextChallenge}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl shadow-md transition flex items-center justify-center gap-2"
            >
              <span>{currentIdx < BUG_CHALLENGES.length - 1 ? 'التحدي التالي' : 'إنهاء واستعراض النتيجة'}</span>
              <ArrowLeft className="w-4 h-4" />
            </button>
          )}
        </div>
      ) : (
        /* Game Finished View */
        <div className="text-center py-8">
          <Award className="w-16 h-16 text-amber-500 mx-auto mb-3 animate-bounce" />
          <h3 className="text-2xl font-black text-slate-900 mb-1">أحسنت! أتممت بنجاح تحدي صائد الأخطاء</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mb-6">
            لقد أثبتّ قدرتك على تمييز الأخطاء النحوية والمنطقية الشائعة في كتاب المهارات الرقمية للصف الحادي عشر!
          </p>

          <div className="inline-block bg-slate-50 p-6 rounded-2xl border border-slate-200 mb-6">
            <div className="text-xs text-slate-400">إجمالي النقاط</div>
            <div className="text-4xl font-black text-indigo-600 mt-1">{score} / {BUG_CHALLENGES.length * 25} XP</div>
          </div>

          <div>
            <button
              onClick={handleRestart}
              className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition"
            >
              إعادة اللعب وتحسين النتيجة
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
