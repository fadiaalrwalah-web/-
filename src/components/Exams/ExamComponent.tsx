import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle, AlertCircle, Clock, Trophy, ArrowRight, ArrowLeft, RotateCcw, Award, Sparkles, TrendingUp, BookOpen } from 'lucide-react';
import confetti from 'canvas-confetti';
import { Question, ExamResult } from '../../types';
import { sound } from '../../utils/soundEffects';
import { CertificateModal } from './CertificateModal';

interface ExamComponentProps {
  examType: 'pre' | 'post';
  title: string;
  subtitle: string;
  questions: Question[];
  studentName: string;
  preTestResult?: ExamResult;
  onSaveResult: (result: ExamResult) => void;
  onNavigateToLessons: (lessonId?: string) => void;
}

export const ExamComponent: React.FC<ExamComponentProps> = ({
  examType,
  title,
  subtitle,
  questions,
  studentName,
  preTestResult,
  onSaveResult,
  onNavigateToLessons
}) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(questions.length * 60); // 1 min per question
  const [timerActive, setTimerActive] = useState(true);
  const [showCertificate, setShowCertificate] = useState(false);

  // Timer countdown
  useEffect(() => {
    if (!timerActive || isSubmitted) return;
    const interval = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleSubmitExam();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [timerActive, isSubmitted]);

  const currentQ = questions[currentIdx];

  const handleSelectOption = (qId: number, optIdx: number) => {
    if (isSubmitted) return;
    sound.playClick();
    setAnswers({ ...answers, [qId]: optIdx });
  };

  const handleSubmitExam = () => {
    sound.playSuccess();
    setIsSubmitted(true);
    setTimerActive(false);

    let correctCount = 0;
    const answerRecords: ExamResult['answers'] = [];
    const topicBreakdown: ExamResult['topicBreakdown'] = {};

    questions.forEach((q) => {
      const selected = answers[q.id];
      const isCorrect = selected === q.correctIndex;
      if (isCorrect) correctCount++;

      answerRecords.push({
        questionId: q.id,
        selectedIndex: selected !== undefined ? selected : -1,
        isCorrect
      });

      if (!topicBreakdown[q.topic]) {
        topicBreakdown[q.topic] = { correct: 0, total: 0 };
      }
      topicBreakdown[q.topic].total++;
      if (isCorrect) {
        topicBreakdown[q.topic].correct++;
      }
    });

    const percentage = Math.round((correctCount / questions.length) * 100);
    const result: ExamResult = {
      examType,
      score: correctCount,
      totalQuestions: questions.length,
      percentage,
      date: new Date().toLocaleDateString('ar-JO', { year: 'numeric', month: 'long', day: 'numeric' }),
      answers: answerRecords,
      topicBreakdown
    };

    onSaveResult(result);

    if (percentage >= 70) {
      sound.playWinFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    }
  };

  const handleRestart = () => {
    sound.playClick();
    setAnswers({});
    setIsSubmitted(false);
    setCurrentIdx(0);
    setTimeLeft(questions.length * 60);
    setTimerActive(true);
  };

  const score = Object.keys(answers).reduce((acc, qId) => {
    const q = questions.find((item) => item.id === Number(qId));
    return q && answers[Number(qId)] === q.correctIndex ? acc + 1 : acc;
  }, 0);
  const percentage = Math.round((score / questions.length) * 100);

  // Format time (MM:SS)
  const formatTime = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="py-6 max-w-4xl mx-auto space-y-6" dir="rtl">
      {/* Header Banner */}
      <div className={`p-8 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 ${
        examType === 'pre'
          ? 'bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900'
          : 'bg-gradient-to-r from-purple-900 via-indigo-900 to-emerald-950'
      }`}>
        <div>
          <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur inline-block mb-2">
            {examType === 'pre' ? '🔍 الامتحان القبلي التشخيصي (Diagnostic Pre-Test)' : '🏆 الامتحان البعدي الشامل (Final Post-Test)'}
          </span>
          <h1 className="text-2xl md:text-3xl font-black">{title}</h1>
          <p className="text-xs md:text-sm text-slate-200 mt-1 max-w-xl leading-relaxed">{subtitle}</p>
        </div>

        {/* Status / Timer */}
        {!isSubmitted ? (
          <div className="flex items-center gap-4 bg-white/10 backdrop-blur p-4 rounded-2xl border border-white/20 shrink-0">
            <Clock className="w-6 h-6 text-amber-300" />
            <div>
              <div className="text-[10px] text-slate-300">الوقت المتبقي</div>
              <div className="text-xl font-black font-mono text-white">{formatTime(timeLeft)}</div>
            </div>
          </div>
        ) : (
          <div className="bg-white/20 backdrop-blur p-4 rounded-2xl text-center shrink-0 border border-white/30">
            <div className="text-xs text-slate-200">النتيجة النهائية</div>
            <div className="text-3xl font-black text-amber-300 font-mono mt-0.5">{percentage}%</div>
            <div className="text-[11px] text-white/80">{score} من {questions.length} أسئلة</div>
          </div>
        )}
      </div>

      {!isSubmitted ? (
        /* Question Answering View */
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-6">
          {/* Question Nav Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pb-4 border-b border-slate-100">
            {questions.map((q, idx) => {
              const isAnswered = answers[q.id] !== undefined;
              const isCurrent = currentIdx === idx;
              return (
                <button
                  key={q.id}
                  onClick={() => {
                    sound.playClick();
                    setCurrentIdx(idx);
                  }}
                  className={`w-8 h-8 rounded-xl font-bold text-xs transition flex items-center justify-center ${
                    isCurrent
                      ? 'bg-indigo-600 text-white ring-2 ring-indigo-300'
                      : isAnswered
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-slate-100 text-slate-400 hover:bg-slate-200'
                  }`}
                >
                  {idx + 1}
                </button>
              );
            })}
          </div>

          {/* Current Question */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
              <span>السؤال {currentIdx + 1} من {questions.length}</span>
              <span className="font-semibold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                {currentQ.topic}
              </span>
            </div>

            <h3 className="text-base md:text-lg font-bold text-slate-900 leading-relaxed mb-4">
              {currentQ.text}
            </h3>

            {currentQ.codeSnippet && (
              <pre className="p-4 bg-slate-900 text-emerald-400 rounded-2xl font-mono text-xs mb-6 text-left" dir="ltr">
                {currentQ.codeSnippet}
              </pre>
            )}

            {/* Options */}
            <div className="space-y-3">
              {currentQ.options.map((opt, oIdx) => {
                const isSelected = answers[currentQ.id] === oIdx;
                return (
                  <button
                    key={oIdx}
                    onClick={() => handleSelectOption(currentQ.id, oIdx)}
                    className={`w-full p-4 rounded-2xl border text-right transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-indigo-50 border-indigo-600 text-indigo-900 font-bold ring-2 ring-indigo-200'
                        : 'bg-slate-50/70 hover:bg-slate-100/80 border-slate-200 text-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        isSelected ? 'bg-indigo-600 text-white' : 'bg-slate-200 text-slate-600'
                      }`}>
                        {String.fromCharCode(65 + oIdx)}
                      </span>
                      <span className="text-sm">{opt}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Navigation & Submit */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            <button
              disabled={currentIdx === 0}
              onClick={() => {
                sound.playClick();
                setCurrentIdx(currentIdx - 1);
              }}
              className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition disabled:opacity-40"
            >
              <ArrowRight className="w-4 h-4" />
              <span>السابق</span>
            </button>

            {currentIdx < questions.length - 1 ? (
              <button
                onClick={() => {
                  sound.playClick();
                  setCurrentIdx(currentIdx + 1);
                }}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition"
              >
                <span>التالي</span>
                <ArrowLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={handleSubmitExam}
                className="flex items-center gap-1.5 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-lg transition active:scale-95"
              >
                <span>تسليم الامتحان وإنهاء الاختبار ✅</span>
              </button>
            )}
          </div>
        </div>
      ) : (
        /* Result & Analysis View */
        <div className="space-y-6">
          {/* Summary Card */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm text-center">
            <Trophy className="w-16 h-16 text-amber-500 mx-auto mb-2 animate-bounce" />
            <h2 className="text-2xl font-black text-slate-900">
              {percentage >= 85 ? 'أداء استثنائي ومتميز جداً! 🌟' : percentage >= 60 ? 'أداء جيد جداً! استمر بالتقدم 👍' : 'فرصة رائعة للمراجعة وتعزيز المهارات 📚'}
            </h2>
            <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
              عزيزي/عزيزتي {studentName || 'المتعلم'}، لقد أتممت {title}. تفضل بمراجعة تحليل إجاباتك بالتفصيل أدناه.
            </p>

            {/* Growth comparison if post-test and pre-test exists */}
            {examType === 'post' && preTestResult && (
              <div className="my-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-50 to-indigo-50 border border-emerald-200 max-w-lg mx-auto flex items-center justify-between">
                <div className="text-right">
                  <div className="text-xs font-bold text-emerald-900 flex items-center gap-1">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    مقياس التطور والتحسن المعرفي:
                  </div>
                  <div className="text-[11px] text-slate-600 mt-0.5">
                    الامتحان القبلي: {preTestResult.percentage}% ⬅️ الامتحان البعدي: {percentage}%
                  </div>
                </div>
                <div className="px-3.5 py-1.5 rounded-xl bg-emerald-600 text-white font-black text-sm font-mono">
                  {percentage - preTestResult.percentage >= 0 ? `+${percentage - preTestResult.percentage}% تحسن!` : `${percentage - preTestResult.percentage}%`}
                </div>
              </div>
            )}

            {/* Actions for Certificate or Lessons */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              {examType === 'post' && percentage >= 60 && (
                <button
                  onClick={() => {
                    sound.playClick();
                    setShowCertificate(true);
                  }}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-xs rounded-xl shadow-md transition active:scale-95"
                >
                  <Award className="w-4 h-4" />
                  <span>عرض وطباعة شهادة الإتقان والتفوق 🎓</span>
                </button>
              )}

              <button
                onClick={() => onNavigateToLessons()}
                className="flex items-center gap-1.5 px-5 py-3 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs rounded-xl transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>الانتقال للشرح التفاعلي للدروس</span>
              </button>

              <button
                onClick={handleRestart}
                className="flex items-center gap-1.5 px-4 py-3 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 font-bold text-xs rounded-xl transition"
              >
                <RotateCcw className="w-4 h-4" />
                <span>إعادة المحاولة</span>
              </button>
            </div>
          </div>

          {/* Diagnostic Questions Review */}
          <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              مراجعة وتصحيح الأسئلة مع الشرح التوضيحي ({questions.length} سؤال):
            </h3>

            <div className="space-y-4">
              {questions.map((q, idx) => {
                const userChoice = answers[q.id];
                const isCorrect = userChoice === q.correctIndex;
                return (
                  <div
                    key={q.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      isCorrect ? 'bg-emerald-50/40 border-emerald-200' : 'bg-rose-50/40 border-rose-200'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <span className="font-bold text-xs text-slate-700">
                        {idx + 1}. {q.text}
                      </span>
                      {isCorrect ? (
                        <span className="flex items-center gap-1 text-emerald-700 text-xs font-bold shrink-0 bg-emerald-100 px-2 py-0.5 rounded-full">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>صحيحة (+1)</span>
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-rose-700 text-xs font-bold shrink-0 bg-rose-100 px-2 py-0.5 rounded-full">
                          <XCircle className="w-3.5 h-3.5" />
                          <span>غير صحيحة</span>
                        </span>
                      )}
                    </div>

                    {q.codeSnippet && (
                      <pre className="p-3 bg-slate-900 text-emerald-300 rounded-xl font-mono text-[11px] mb-3 text-left" dir="ltr">
                        {q.codeSnippet}
                      </pre>
                    )}

                    <div className="text-xs space-y-1 mb-2">
                      <div className="text-slate-600">
                        إجابتك: <span className={isCorrect ? 'font-bold text-emerald-800' : 'font-bold text-rose-800'}>
                          {userChoice !== undefined ? q.options[userChoice] : 'لم تتم الإجابة'}
                        </span>
                      </div>
                      {!isCorrect && (
                        <div className="text-emerald-800 font-bold">
                          الإجابة الصحيحة النموذجية: {q.options[q.correctIndex]}
                        </div>
                      )}
                    </div>

                    {/* Explanation */}
                    <div className="text-[11px] text-slate-600 bg-white/80 p-2.5 rounded-xl border border-slate-200 leading-relaxed">
                      <strong className="text-slate-800">💡 التعليل: </strong>
                      {q.explanation}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Certificate Modal */}
      <CertificateModal
        isOpen={showCertificate}
        onClose={() => setShowCertificate(false)}
        studentName={studentName}
        score={score}
        totalQuestions={questions.length}
        percentage={percentage}
        date={new Date().toLocaleDateString('ar-JO', { year: 'numeric', month: 'long', day: 'numeric' })}
      />
    </div>
  );
};
