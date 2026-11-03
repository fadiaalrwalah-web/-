import React, { useState } from 'react';
import { BookOpen, CheckCircle2, ChevronRight, ChevronLeft, Lightbulb, Shield, Code, Sparkles, HelpCircle, FileText, ExternalLink, Layers, Gamepad2, Award } from 'lucide-react';
import { CURRICULUM_LESSONS } from '../../data/curriculumData';
import { Lesson, TabType } from '../../types';
import {
  PythonCodeRunnerWidget,
  FlowchartSimulatorWidget,
  ScopeVisualizerWidget,
  CarbonFootprintWidget,
  EWasteToxicWidget,
  MatrixGridWidget
} from './InteractiveWidgets';
import { sound } from '../../utils/soundEffects';

interface LessonsViewerProps {
  initialLessonId?: string;
  completedLessons: string[];
  onCompleteLesson: (lessonId: string) => void;
  onOpenPlayground: () => void;
  onNavigateTab?: (tab: TabType | 'infographics') => void;
}

export const LessonsViewer: React.FC<LessonsViewerProps> = ({
  initialLessonId,
  completedLessons,
  onCompleteLesson,
  onOpenPlayground,
  onNavigateTab
}) => {
  const [selectedLessonId, setSelectedLessonId] = useState<string>(
    initialLessonId || CURRICULUM_LESSONS[0].id
  );
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);

  const currentLesson: Lesson =
    CURRICULUM_LESSONS.find((l) => l.id === selectedLessonId) || CURRICULUM_LESSONS[0];

  const isCurrentCompleted = completedLessons.includes(currentLesson.id);

  const handleLessonChange = (id: string) => {
    sound.playClick();
    setSelectedLessonId(id);
    setQuizAnswers({});
    setQuizSubmitted(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectQuizOption = (qIdx: number, optIdx: number) => {
    sound.playClick();
    setQuizAnswers({ ...quizAnswers, [qIdx]: optIdx });
  };

  const handleGradeQuiz = () => {
    sound.playClick();
    setQuizSubmitted(true);
    let allCorrect = true;
    currentLesson.quickQuiz.forEach((q, idx) => {
      if (quizAnswers[idx] !== q.correctIndex) {
        allCorrect = false;
      }
    });

    if (allCorrect) {
      sound.playSuccess();
      onCompleteLesson(currentLesson.id);
    } else {
      sound.playError();
    }
  };

  const currentLessonIndex = CURRICULUM_LESSONS.findIndex((l) => l.id === currentLesson.id);
  const prevLesson = currentLessonIndex > 0 ? CURRICULUM_LESSONS[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < CURRICULUM_LESSONS.length - 1 ? CURRICULUM_LESSONS[currentLessonIndex + 1] : null;

  return (
    <div className="py-6 max-w-7xl mx-auto space-y-8" dir="rtl">
      {/* Top Breadcrumb & Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <div className="flex items-center gap-2 text-xs text-slate-500 font-semibold">
          <BookOpen className="w-4 h-4 text-indigo-600" />
          <span>{currentLesson.unitTitle}</span>
          <span>/</span>
          <span className="text-slate-900 font-bold">{currentLesson.title}</span>
        </div>

        <div className="flex items-center gap-3">
          <a
            href="/assets/aistudio/_______________________________________________________________59503fc5.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
            title="تحميل أو فتح كتاب الطالب المدرسي PDF"
          >
            <FileText className="w-3.5 h-3.5 text-indigo-600" />
            <span>كتاب الطالب الرسمي (PDF)</span>
            <ExternalLink className="w-3 h-3 text-slate-400" />
          </a>

          {isCurrentCompleted ? (
            <span className="flex items-center gap-1 text-xs font-bold text-emerald-700 bg-emerald-100 px-3 py-1.5 rounded-xl">
              <CheckCircle2 className="w-4 h-4" />
              <span>مكتمل ومُتقن</span>
            </span>
          ) : (
            <span className="text-xs text-slate-400 font-medium">قيد الدراسة</span>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Navigation Sidebar */}
        <div className="lg:col-span-4 space-y-6">
          <div className="bg-white rounded-3xl p-5 border border-slate-200 shadow-sm sticky top-20">
            <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center justify-between">
              <span>فهرس الدروس المقررة</span>
              <span className="text-xs text-indigo-600 font-normal">
                {completedLessons.length} من {CURRICULUM_LESSONS.length} منجزة
              </span>
            </h3>

            {/* Units Groups */}
            <div className="space-y-4">
              {/* Unit 1 */}
              <div>
                <div className="text-[11px] font-bold text-indigo-600 uppercase tracking-wider mb-2">
                  الوحدة 1: الخوارزميات والبرمجة (بايثون)
                </div>
                <div className="space-y-1.5">
                  {CURRICULUM_LESSONS.filter((l) => l.unitId === 'unit1').map((l) => {
                    const isSelected = selectedLessonId === l.id;
                    const isDone = completedLessons.includes(l.id);
                    return (
                      <button
                        key={l.id}
                        onClick={() => handleLessonChange(l.id)}
                        className={`w-full text-right p-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-indigo-600 text-white font-bold shadow-md'
                            : 'bg-slate-50 hover:bg-indigo-50/60 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {l.lessonNumber}
                          </span>
                          <span className="truncate max-w-[200px]">{l.title}</span>
                        </div>
                        {isDone && <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Unit 2 */}
              <div className="pt-2 border-t border-slate-100">
                <div className="text-[11px] font-bold text-teal-600 uppercase tracking-wider mb-2">
                  الوحدة 2: الحوسبة والحياة والاستدامة
                </div>
                <div className="space-y-1.5">
                  {CURRICULUM_LESSONS.filter((l) => l.unitId === 'unit2').map((l) => {
                    const isSelected = selectedLessonId === l.id;
                    const isDone = completedLessons.includes(l.id);
                    return (
                      <button
                        key={l.id}
                        onClick={() => handleLessonChange(l.id)}
                        className={`w-full text-right p-3 rounded-xl text-xs font-semibold transition-all flex items-center justify-between ${
                          isSelected
                            ? 'bg-teal-700 text-white font-bold shadow-md'
                            : 'bg-slate-50 hover:bg-teal-50/60 text-slate-700'
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className={`w-5 h-5 rounded-full text-[10px] flex items-center justify-center font-bold ${
                            isSelected ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-600'
                          }`}>
                            {l.lessonNumber}
                          </span>
                          <span className="truncate max-w-[200px]">{l.title}</span>
                        </div>
                        {isDone && <CheckCircle2 className={`w-3.5 h-3.5 ${isSelected ? 'text-white' : 'text-emerald-600'}`} />}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Lesson Content Area */}
        <div className="lg:col-span-8 bg-white rounded-3xl p-6 md:p-10 border border-slate-200 shadow-xl space-y-8">
          {/* Header */}
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-indigo-600 mb-1">
              <span>الدرس {currentLesson.lessonNumber}</span>
              <span>•</span>
              <span>زمن القراءة: {currentLesson.readTime}</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
              {currentLesson.title}
            </h1>
            <div className="text-xs text-slate-400 font-mono mt-1" dir="ltr">
              {currentLesson.englishTitle}
            </div>
            <p className="text-xs md:text-sm text-slate-600 mt-3 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-200">
              {currentLesson.summary}
            </p>
          </div>

          {/* Objectives */}
          <div className="p-5 rounded-2xl bg-indigo-50/50 border border-indigo-100">
            <h3 className="font-bold text-xs text-indigo-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-indigo-600" />
              <span>نتاجات التعلم المتوقعة (Learning Outcomes):</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-indigo-950">
              {currentLesson.objectives.map((obj, oIdx) => (
                <li key={oIdx} className="flex items-start gap-2">
                  <span className="text-indigo-600 font-bold">•</span>
                  <span>{obj}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Key Terms Table */}
          {currentLesson.keyTerms.length > 0 && (
            <div>
              <h3 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-indigo-600" />
                <span>المفاهيم والمصطلحات الأساسية (Key Terms):</span>
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentLesson.keyTerms.map((term, tIdx) => (
                  <div key={tIdx} className="p-4 rounded-2xl bg-slate-50 border border-slate-200">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-xs text-slate-900">{term.ar}</span>
                      <span className="text-[10px] font-mono text-indigo-600" dir="ltr">{term.en}</span>
                    </div>
                    <p className="text-xs text-slate-600 leading-relaxed mt-1">{term.def}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Embedded Lesson Infographic */}
          {currentLesson.infographic && (
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-950 via-slate-900 to-slate-950 text-white border border-indigo-800/60 shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-indigo-800/40 pb-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-3 py-0.5 rounded-full text-[10px] font-bold bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                      إنفوجرافيك الدرس البصري التفاعلي
                    </span>
                    <span className="text-xs text-amber-300">★ ملخص فوري ذكي</span>
                  </div>
                  <h3 className="text-lg font-black text-white">{currentLesson.infographic.title}</h3>
                  <p className="text-xs text-slate-300 mt-0.5">{currentLesson.infographic.subtitle}</p>
                </div>

                {onNavigateTab && (
                  <button
                    onClick={() => onNavigateTab('infographics')}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/30 hover:bg-indigo-600 text-indigo-200 hover:text-white rounded-xl text-xs font-semibold border border-indigo-500/40 transition shrink-0"
                  >
                    <Layers className="w-3.5 h-3.5" />
                    <span>معرض الإنفوجرافيك الشامل</span>
                  </button>
                )}
              </div>

              {/* Infographic Visual Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {currentLesson.infographic.cards.map((c, cIdx) => (
                  <div
                    key={cIdx}
                    className="p-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <span className="w-5 h-5 rounded-full bg-indigo-500 text-white font-bold text-[11px] flex items-center justify-center">
                          {cIdx + 1}
                        </span>
                        {c.badge && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                            {c.badge}
                          </span>
                        )}
                      </div>
                      <h4 className="font-bold text-xs md:text-sm text-slate-100">{c.title}</h4>
                      <p className="text-xs text-slate-300 mt-1.5 leading-relaxed">{c.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Key Formula or Golden Rule */}
              {currentLesson.infographic.keyFormulaOrRule && (
                <div className="p-3.5 rounded-2xl bg-gradient-to-r from-amber-500/20 to-indigo-500/20 border border-amber-400/30 flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-amber-400 shrink-0" />
                  <div className="text-xs text-amber-200 font-semibold leading-relaxed">
                    <span className="font-black text-amber-300">القاعدة الذهبية للدرس: </span>
                    {currentLesson.infographic.keyFormulaOrRule}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Quick Lesson Hub Shortcuts */}
          <div className="flex flex-wrap items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200">
            <span className="text-xs font-bold text-slate-700">أنشطة تابعة للدرس:</span>
            <button
              onClick={onOpenPlayground}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-100 hover:bg-indigo-200 text-indigo-800 text-xs font-bold transition"
            >
              <Code className="w-3.5 h-3.5 text-indigo-600" />
              <span>تجربة الكود في مختبر بايثون</span>
            </button>
            {onNavigateTab && (
              <>
                <button
                  onClick={() => onNavigateTab('games')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-800 text-xs font-bold transition"
                >
                  <Gamepad2 className="w-3.5 h-3.5 text-purple-600" />
                  <span>تطبيق عملي عبر الألعاب</span>
                </button>
                <button
                  onClick={() => onNavigateTab('pre-test')}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-100 hover:bg-blue-200 text-blue-800 text-xs font-bold transition"
                >
                  <Award className="w-3.5 h-3.5 text-blue-600" />
                  <span>اختبر نفسك في الامتحان</span>
                </button>
              </>
            )}
          </div>

          {/* Lesson Sections with Interactive Widgets */}
          <div className="space-y-8 pt-4 border-t border-slate-100">
            {currentLesson.sections.map((section) => (
              <div key={section.id} className="space-y-4">
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <span className="w-2 h-5 rounded-full bg-indigo-600" />
                  <span>{section.title}</span>
                </h3>

                <div className="text-xs md:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                  {section.content}
                </div>

                {/* Lightbulb Note */}
                {section.lightbulbNote && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-950 flex items-start gap-3">
                    <Lightbulb className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-amber-900 block mb-0.5">إضاءة تعليمية هامة:</span>
                      {section.lightbulbNote}
                    </div>
                  </div>
                )}

                {/* Digital Citizenship Note */}
                {section.digitalCitizenship && (
                  <div className="p-4 rounded-2xl bg-teal-50 border border-teal-200 text-xs text-teal-950 flex items-start gap-3">
                    <Shield className="w-5 h-5 text-teal-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-teal-900 block mb-0.5">المواطنة الرقمية والأخلاقيات:</span>
                      {section.digitalCitizenship}
                    </div>
                  </div>
                )}

                {/* Code Example */}
                {section.codeExample && (
                  <div className="rounded-2xl bg-slate-900 text-slate-100 p-4 font-mono text-xs text-left border border-slate-800 shadow-md" dir="ltr">
                    <div className="text-[11px] text-slate-400 mb-2 border-b border-slate-800 pb-1 font-sans" dir="rtl">
                      مثال برمجي (Python Snippet):
                    </div>
                    <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed overflow-x-auto">
                      {section.codeExample}
                    </pre>
                    {section.codeOutput && (
                      <div className="mt-3 pt-3 border-t border-slate-800">
                        <div className="text-[10px] text-slate-400 font-sans mb-1" dir="rtl">المخرجات في الشاشة:</div>
                        <pre className="text-slate-300 text-[11px]">{section.codeOutput}</pre>
                      </div>
                    )}
                  </div>
                )}

                {/* Embedded Interactive Widgets */}
                {section.interactiveType === 'code_runner' && (
                  <PythonCodeRunnerWidget
                    initialCode={section.interactiveData?.code || section.codeExample || ''}
                  />
                )}
                {section.interactiveType === 'flowchart' && <FlowchartSimulatorWidget />}
                {section.interactiveType === 'scope_visualizer' && <ScopeVisualizerWidget />}
                {section.interactiveType === 'carbon_calc' && <CarbonFootprintWidget />}
                {section.interactiveType === 'ewaste_guide' && <EWasteToxicWidget />}
                {section.interactiveType === 'matrix_grid' && <MatrixGridWidget />}
              </div>
            ))}
          </div>

          {/* Quick Quiz at end of lesson */}
          {currentLesson.quickQuiz && currentLesson.quickQuiz.length > 0 && (
            <div className="p-6 md:p-8 rounded-3xl bg-gradient-to-br from-indigo-50/80 via-white to-purple-50/80 border border-indigo-200 shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-indigo-100 pb-3">
                <div>
                  <h3 className="font-black text-base text-indigo-950 flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                    <span>اختبر فهمك السريع للدرس (Quick Check):</span>
                  </h3>
                  <p className="text-xs text-indigo-800/80 mt-0.5">
                    أجب عن الأسئلة الآتية لتأكيد إتمام الدرس وكسب نقاط الخبرة!
                  </p>
                </div>
              </div>

              <div className="space-y-6">
                {currentLesson.quickQuiz.map((q, qIdx) => (
                  <div key={qIdx} className="space-y-3">
                    <div className="font-bold text-xs md:text-sm text-slate-800">
                      {qIdx + 1}. {q.question}
                    </div>
                    <div className="space-y-2">
                      {q.options.map((opt, oIdx) => {
                        const isSelected = quizAnswers[qIdx] === oIdx;
                        const isCorrect = oIdx === q.correctIndex;
                        let btnStyle = 'w-full text-right p-3.5 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ';
                        if (!quizSubmitted) {
                          btnStyle += isSelected
                            ? 'bg-indigo-600 text-white border-indigo-700 shadow-sm'
                            : 'bg-white hover:bg-slate-50 border-slate-200 text-slate-700';
                        } else {
                          if (isCorrect) {
                            btnStyle += 'bg-emerald-100 border-emerald-400 text-emerald-900 font-bold';
                          } else if (isSelected && !isCorrect) {
                            btnStyle += 'bg-rose-100 border-rose-400 text-rose-900';
                          } else {
                            btnStyle += 'bg-white border-slate-200 text-slate-400 opacity-60';
                          }
                        }

                        return (
                          <button
                            key={oIdx}
                            disabled={quizSubmitted}
                            onClick={() => handleSelectQuizOption(qIdx, oIdx)}
                            className={btnStyle}
                          >
                            <span>{opt}</span>
                            {quizSubmitted && isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                          </button>
                        );
                      })}
                    </div>

                    {quizSubmitted && (
                      <div className="text-[11px] text-slate-600 bg-white p-3 rounded-xl border border-slate-200">
                        <strong>💡 التوضيح: </strong>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {!quizSubmitted ? (
                <button
                  onClick={handleGradeQuiz}
                  disabled={Object.keys(quizAnswers).length < currentLesson.quickQuiz.length}
                  className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
                >
                  تصحيح الإجابات وتأكيد إتمام الدرس
                </button>
              ) : (
                <div className="p-4 rounded-2xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-center text-xs font-bold">
                  تم تصحيح النشاط وحفظ تقدمك بنجاح! 🎉
                </div>
              )}
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
            {prevLesson ? (
              <button
                onClick={() => handleLessonChange(prevLesson.id)}
                className="flex items-center gap-1.5 px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition"
              >
                <ChevronRight className="w-4 h-4" />
                <span>الدرس السابق: {prevLesson.title}</span>
              </button>
            ) : <div />}

            {nextLesson ? (
              <button
                onClick={() => handleLessonChange(nextLesson.id)}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition"
              >
                <span>الدرس التالي: {nextLesson.title}</span>
                <ChevronLeft className="w-4 h-4" />
              </button>
            ) : (
              <button
                onClick={onOpenPlayground}
                className="flex items-center gap-1.5 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition"
              >
                <Code className="w-4 h-4" />
                <span>الانتقال لمختبر بايثون التفاعلي</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
