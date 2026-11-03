import React from 'react';
import { BookOpen, Gamepad2, Award, Terminal, FileCheck, Layers, Sparkles, CheckCircle2, TrendingUp, Download, ExternalLink, ArrowLeft, Trophy, Star, ShieldCheck, Zap } from 'lucide-react';
import { TabType, StudentProfile } from '../types';
import { CURRICULUM_LESSONS } from '../data/curriculumData';
import { sound } from '../utils/soundEffects';

interface DashboardProps {
  student: StudentProfile;
  onNavigate: (tab: TabType | 'infographics') => void;
  onStartLesson: (lessonId: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  student,
  onNavigate,
  onStartLesson
}) => {
  const completedCount = student.completedLessons.length;
  const totalLessons = CURRICULUM_LESSONS.length;
  const progressPercent = Math.round((completedCount / totalLessons) * 100);

  const unit1Lessons = CURRICULUM_LESSONS.filter((l) => l.unitId === 'unit1');
  const unit2Lessons = CURRICULUM_LESSONS.filter((l) => l.unitId === 'unit2');

  const unit1Completed = unit1Lessons.filter((l) => student.completedLessons.includes(l.id)).length;
  const unit2Completed = unit2Lessons.filter((l) => student.completedLessons.includes(l.id)).length;

  return (
    <div className="py-6 max-w-7xl mx-auto space-y-10" dir="rtl">
      {/* Hero Welcome Card */}
      <div className="relative rounded-3xl bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-950 text-white p-8 md:p-12 shadow-2xl overflow-hidden border border-indigo-700/50">
        {/* Decorative blur spheres */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-500/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-bold bg-white/20 backdrop-blur text-white flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                منهاج الصف الحادي عشر المطور 2024 / 2025
              </span>
              <span className="text-xs text-indigo-200">المركز الوطني لتطوير المناهج 🇯🇴</span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
              أهلاً بك يا {student.name || 'مبدع التقنية'} في منصة المهارات الرقمية
            </h1>

            <p className="text-xs md:text-sm text-indigo-100/90 leading-relaxed">
              منصة تفاعلية رائدة تجمع بين شروحات الدروس النظرية والتطبيقية، ومحاكي بايثون المباشر، وامتحانات قبلية لتشخيص مستواك، وامتحانات بعدية مع شهادة إتقان، وألعاب ذكاء ممتعة كلعبة "نجوم وأقمار" وصيد الأخطاء!
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('pre-test');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-900 font-bold text-xs rounded-xl shadow-lg transition"
              >
                <FileCheck className="w-4 h-4" />
                <span>ابدأ بالامتحان القبلي التشخيصي</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('lessons');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur active:scale-95 text-white font-bold text-xs rounded-xl border border-white/30 transition"
              >
                <BookOpen className="w-4 h-4" />
                <span>تصفح الدروس التفاعلية</span>
              </button>

              <button
                onClick={() => {
                  sound.playClick();
                  onNavigate('games');
                }}
                className="flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-500 active:scale-95 text-white font-bold text-xs rounded-xl shadow transition"
              >
                <Gamepad2 className="w-4 h-4" />
                <span>الألعاب الإلكترونية</span>
              </button>
            </div>
          </div>

          {/* Progress / Stats Card */}
          <div className="w-full lg:w-72 bg-white/10 backdrop-blur-md rounded-2xl p-5 border border-white/20 space-y-4 shrink-0">
            <div className="flex items-center justify-between text-xs">
              <span className="text-indigo-200">التقدم العام في المنهاج:</span>
              <span className="font-black text-amber-300 font-mono">{progressPercent}%</span>
            </div>

            <div className="w-full bg-white/20 h-2.5 rounded-full overflow-hidden">
              <div
                className="bg-amber-400 h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>

            <div className="grid grid-cols-2 gap-2 text-center text-xs pt-1">
              <div className="bg-white/10 p-2.5 rounded-xl">
                <div className="text-[10px] text-indigo-200">الدروس المنجزة</div>
                <div className="text-base font-black text-white mt-0.5">
                  {completedCount} / {totalLessons}
                </div>
              </div>
              <div className="bg-white/10 p-2.5 rounded-xl">
                <div className="text-[10px] text-indigo-200">رصيد الخبرة XP</div>
                <div className="text-base font-black text-emerald-300 mt-0.5">
                  {student.xp} XP
                </div>
              </div>
            </div>

            {student.preTestResult && (
              <div className="text-[11px] text-indigo-200 border-t border-white/10 pt-2 flex items-center justify-between">
                <span>نتيجة الامتحان القبلي:</span>
                <span className="font-bold text-white font-mono">{student.preTestResult.percentage}%</span>
              </div>
            )}
            {student.postTestResult && (
              <div className="text-[11px] text-emerald-300 flex items-center justify-between font-bold">
                <span>نتيجة الامتحان البعدي:</span>
                <span className="font-mono">{student.postTestResult.percentage}%</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Feature Navigation Cards (5 Quick Pillars) */}
      <div>
        <h2 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Zap className="w-5 h-5 text-indigo-600" />
          <span>أقسام المنصة التعليمية الرئيسية</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Card 1: Lessons */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigate('lessons');
            }}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-indigo-400 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-indigo-50 group-hover:bg-indigo-600 transition text-indigo-600 group-hover:text-white flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition mb-1">
                الشروحات التفاعلية
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                9 دروس مفصلة تغطي كامل محاور المنهاج، مع أمثلة بايثون حية ونقاط مضيئة ومصطلحات معربة.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-bold mt-4">
              <span>تصفح الدروس</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            </div>
          </div>

          {/* Card 2: Infographics */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigate('infographics');
            }}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-teal-400 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-50 group-hover:bg-teal-600 transition text-teal-600 group-hover:text-white flex items-center justify-center mb-4">
                <Layers className="w-6 h-6" />
              </div>
              <div className="flex items-center gap-1.5 mb-1">
                <h3 className="font-bold text-base text-slate-900 group-hover:text-teal-600 transition">
                  الإنفوجرافيك البصري
                </h3>
                <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-teal-100 text-teal-800">
                  حصري
                </span>
              </div>
              <p className="text-xs text-slate-500 leading-relaxed">
                خرائط ذهنية وتصاميم إنفوجرافيك لتبسيط ركائز الحوسبة الخضراء وجداول المواد السامة ومقارنة المترجم والمفسر.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-teal-600 font-bold mt-4">
              <span>استعراض الإنفوجرافيك</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            </div>
          </div>

          {/* Card 3: Games */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigate('games');
            }}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-purple-400 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-purple-50 group-hover:bg-purple-600 transition text-purple-600 group-hover:text-white flex items-center justify-center mb-4">
                <Gamepad2 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-purple-600 transition mb-1">
                الألعاب الإلكترونية (4)
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                لعبة نجوم وأقمار (مشروع الكتاب)، صائد أخطاء بايثون، بطل تدوير النفايات، وسباق مخططات الانسياب.
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-purple-600 font-bold mt-4">
              <span>العب الآن</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            </div>
          </div>

          {/* Card 4: Post-test & Certificate */}
          <div
            onClick={() => {
              sound.playClick();
              onNavigate('post-test');
            }}
            className="p-5 rounded-3xl bg-white border border-slate-200 hover:border-amber-400 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer group flex flex-col justify-between"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-50 group-hover:bg-amber-500 transition text-amber-600 group-hover:text-white flex items-center justify-center mb-4">
                <Award className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base text-slate-900 group-hover:text-amber-600 transition mb-1">
                الامتحان البعدي والشهادة
              </h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                اختبار ختامي من أسئلة الكتاب المعتمدة، مع قياس نسبة التطور وإصدار شهادة إتقان رقمية قابلة للطباعة!
              </p>
            </div>
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-amber-600 font-bold mt-4">
              <span>خوض الامتحان النهائي</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition" />
            </div>
          </div>
        </div>
      </div>

      {/* Curriculum Units Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Unit 1 Box */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-indigo-600 bg-indigo-50 px-2.5 py-0.5 rounded-full">
                الوحدة الأولى
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">الخوارزميات والبرمجة بايثون</h3>
              <p className="text-xs text-slate-500">Algorithms and Programming (6 دروس + مشروع نجوم وأقمار)</p>
            </div>
            <div className="text-left font-mono">
              <span className="text-xs text-slate-400">الإنجاز: </span>
              <span className="text-sm font-bold text-indigo-600">{unit1Completed} / {unit1Lessons.length}</span>
            </div>
          </div>

          <div className="space-y-2">
            {unit1Lessons.map((lesson) => {
              const isDone = student.completedLessons.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  onClick={() => onStartLesson(lesson.id)}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-indigo-50/70 border border-slate-200/80 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-white border border-slate-200 group-hover:border-indigo-400 text-slate-700 group-hover:text-indigo-600 text-xs font-bold flex items-center justify-center">
                      {lesson.lessonNumber}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-indigo-600 transition">
                        {lesson.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{lesson.englishTitle}</div>
                    </div>
                  </div>
                  {isDone ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>مكتمل</span>
                    </span>
                  ) : (
                    <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:-translate-x-1 transition" />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Unit 2 Box */}
        <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-4">
            <div>
              <span className="text-xs font-bold text-teal-600 bg-teal-50 px-2.5 py-0.5 rounded-full">
                الوحدة الثانية
              </span>
              <h3 className="text-lg font-black text-slate-900 mt-1">الحوسبة والحياة والاستدامة</h3>
              <p className="text-xs text-slate-500">Computing and Life (3 دروس + البصمة الرقمية والمبادرات)</p>
            </div>
            <div className="text-left font-mono">
              <span className="text-xs text-slate-400">الإنجاز: </span>
              <span className="text-sm font-bold text-teal-600">{unit2Completed} / {unit2Lessons.length}</span>
            </div>
          </div>

          <div className="space-y-2">
            {unit2Lessons.map((lesson) => {
              const isDone = student.completedLessons.includes(lesson.id);
              return (
                <div
                  key={lesson.id}
                  onClick={() => onStartLesson(lesson.id)}
                  className="p-3.5 rounded-2xl bg-slate-50 hover:bg-teal-50/70 border border-slate-200/80 transition-all flex items-center justify-between cursor-pointer group"
                >
                  <div className="flex items-center gap-3">
                    <span className="w-7 h-7 rounded-full bg-white border border-slate-200 group-hover:border-teal-400 text-slate-700 group-hover:text-teal-600 text-xs font-bold flex items-center justify-center">
                      {lesson.lessonNumber}
                    </span>
                    <div>
                      <div className="text-xs font-bold text-slate-800 group-hover:text-teal-600 transition">
                        {lesson.title}
                      </div>
                      <div className="text-[10px] text-slate-400">{lesson.englishTitle}</div>
                    </div>
                  </div>
                  {isDone ? (
                    <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>مكتمل</span>
                    </span>
                  ) : (
                    <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-teal-600 group-hover:-translate-x-1 transition" />
                  )}
                </div>
              );
            })}
          </div>

          {/* Book Banner inside Unit 2 column */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-teal-900 to-slate-900 text-white flex items-center justify-between gap-4 mt-4">
            <div>
              <div className="text-xs font-bold text-teal-300">الكتاب المعتمد في المدارس</div>
              <div className="text-sm font-black mt-0.5">كتاب المهارات الرقمية (196 صفحة كاملة)</div>
              <div className="text-[11px] text-slate-300 mt-1">تأليف: المركز الوطني لتطوير المناهج (2024م)</div>
            </div>
            <a
              href="/assets/aistudio/_______________________________________________________________59503fc5.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2.5 bg-teal-500 hover:bg-teal-400 text-slate-900 font-bold text-xs rounded-xl shadow transition shrink-0 flex items-center gap-1.5"
            >
              <Download className="w-4 h-4" />
              <span>تحميل PDF</span>
            </a>
          </div>
        </div>
      </div>

      {/* Badges and Gamification Achievements */}
      <div className="bg-white rounded-3xl p-6 md:p-8 border border-slate-200 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <span>أوسمة الإنجاز الرقمي (Digital Badges)</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              افتح الأوسمة التقديرية بإكمال الدروس، الفوز بالألعاب، وتحقيق درجات متقدمة في الاختبارات!
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {student.badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-2xl border text-center transition-all ${
                b.unlockedAt
                  ? 'bg-amber-50/70 border-amber-300 shadow-sm'
                  : 'bg-slate-50 border-slate-200 opacity-60 grayscale'
              }`}
            >
              <div className="text-3xl mb-1">{b.icon}</div>
              <div className="font-bold text-xs text-slate-800">{b.name}</div>
              <div className="text-[10px] text-slate-500 mt-1 leading-snug">{b.description}</div>
              {b.unlockedAt && (
                <div className="text-[9px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full mt-2 inline-block">
                  تم الفتح ✅
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
