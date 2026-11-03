import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Dashboard } from './components/Dashboard';
import { LessonsViewer } from './components/Lessons/LessonsViewer';
import { InfographicsHub } from './components/Infographics/InfographicsHub';
import { ExamComponent } from './components/Exams/ExamComponent';
import { GamesHub } from './components/Games/GamesHub';
import { PythonPlayground } from './components/Playground/PythonPlayground';
import { PRE_TEST_QUESTIONS, POST_TEST_QUESTIONS } from './data/examsData';
import { TabType, StudentProfile, ExamResult } from './types';
import { sound } from './utils/soundEffects';

const INITIAL_BADGES = [
  { id: 'first_lesson', name: 'المتعلم الشغوف', icon: '📖', description: 'إتمام أول درس تفاعلي بالكامل' },
  { id: 'python_dev', name: 'مطور بايثون', icon: '🐍', description: 'إتقان دروس المتغيرات والحلقات والقوائم' },
  { id: 'green_hero', name: 'حارس البيئة الرقمية', icon: '🌱', description: 'إتقان مفاهيم الحوسبة الخضراء وتدوير النفايات' },
  { id: 'bug_hunter', name: 'صائد الأخطاء', icon: '🐞', description: 'الفوز في تحدي اصطياد أخطاء بايثون' },
  { id: 'star_guesser', name: 'سيد النجوم والأقمار', icon: '⭐', description: 'تخمين الرقم السري في لعبة نجوم وأقمار' },
  { id: 'post_master', name: 'خبير المهارات الرقمية', icon: '🎓', description: 'الحصول على أكثر من 80% في الامتحان البعدي' }
];

export default function App() {
  const [currentTab, setCurrentTab] = useState<TabType | 'infographics'>('home');
  const [targetLessonId, setTargetLessonId] = useState<string | undefined>();

  // Student Profile state with localStorage persistence
  const [student, setStudent] = useState<StudentProfile>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('digital_skills_student_profile');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          // ignore
        }
      }
    }
    return {
      name: 'طالب حادي عشر',
      xp: 150,
      completedLessons: ['u1-l1'],
      badges: INITIAL_BADGES.map((b) => ({ ...b, unlockedAt: b.id === 'first_lesson' ? 'اليوم' : undefined })),
      starsAndMoonsHighScore: 0,
      bugHunterScore: 0,
      greenHeroScore: 0
    };
  });

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('digital_skills_student_profile', JSON.stringify(student));
    }
  }, [student]);

  const addXp = (amount: number) => {
    setStudent((prev) => ({ ...prev, xp: prev.xp + amount }));
  };

  const handleUpdateName = (name: string) => {
    setStudent((prev) => ({ ...prev, name }));
  };

  const unlockBadge = (badgeId: string) => {
    setStudent((prev) => {
      const alreadyUnlocked = prev.badges.find((b) => b.id === badgeId && b.unlockedAt);
      if (alreadyUnlocked) return prev;

      return {
        ...prev,
        xp: prev.xp + 50,
        badges: prev.badges.map((b) =>
          b.id === badgeId
            ? { ...b, unlockedAt: new Date().toLocaleDateString('ar-JO') }
            : b
        )
      };
    });
  };

  const handleCompleteLesson = (lessonId: string) => {
    setStudent((prev) => {
      if (prev.completedLessons.includes(lessonId)) return prev;
      const updated = [...prev.completedLessons, lessonId];
      return {
        ...prev,
        completedLessons: updated,
        xp: prev.xp + 40
      };
    });

    unlockBadge('first_lesson');
    if (lessonId === 'u1-l2' || lessonId === 'u1-l4' || lessonId === 'u1-l5') {
      unlockBadge('python_dev');
    }
    if (lessonId === 'u2-l1' || lessonId === 'u2-l2') {
      unlockBadge('green_hero');
    }
  };

  const handleSaveExamResult = (result: ExamResult) => {
    if (result.examType === 'pre') {
      setStudent((prev) => ({
        ...prev,
        preTestResult: result,
        xp: prev.xp + result.score * 10
      }));
    } else {
      setStudent((prev) => ({
        ...prev,
        postTestResult: result,
        xp: prev.xp + result.score * 15
      }));
      if (result.percentage >= 80) {
        unlockBadge('post_master');
      }
    }
  };

  const handleStartLesson = (lessonId: string) => {
    sound.playClick();
    setTargetLessonId(lessonId);
    setCurrentTab('lessons');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800 antialiased font-['Cairo',sans-serif]">
      {/* Universal Header */}
      <Header
        currentTab={currentTab}
        onSelectTab={(tab) => {
          sound.playClick();
          setCurrentTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        student={student}
        onUpdateName={handleUpdateName}
      />

      {/* Main Tab Content */}
      <main className="flex-1 px-4 sm:px-6 lg:px-8 max-w-7xl w-full mx-auto pb-16">
        {currentTab === 'home' && (
          <Dashboard
            student={student}
            onNavigate={(tab) => {
              sound.playClick();
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onStartLesson={handleStartLesson}
          />
        )}

        {currentTab === 'lessons' && (
          <LessonsViewer
            initialLessonId={targetLessonId}
            completedLessons={student.completedLessons}
            onCompleteLesson={handleCompleteLesson}
            onOpenPlayground={() => {
              sound.playClick();
              setCurrentTab('playground');
            }}
            onNavigateTab={(tab) => {
              sound.playClick();
              setCurrentTab(tab);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentTab === 'infographics' && <InfographicsHub />}

        {currentTab === 'pre-test' && (
          <ExamComponent
            examType="pre"
            title="الامتحان القبلي التشخيصي (Diagnostic Pre-Test)"
            subtitle="اختبار لتحديد مستوى معلوماتك الأساسية في مباحث البرمجة والحوسبة الخضراء قبل البدء، لتوجيه خطتك التعليمية بشكل أمثل."
            questions={PRE_TEST_QUESTIONS}
            studentName={student.name}
            onSaveResult={handleSaveExamResult}
            onNavigateToLessons={() => {
              sound.playClick();
              setCurrentTab('lessons');
            }}
          />
        )}

        {currentTab === 'post-test' && (
          <ExamComponent
            examType="post"
            title="الامتحان البعدي الشامل (Final Post-Test)"
            subtitle="اختبار قياس الكفاءة والإتقان بعد دراسة المنهاج وحل الأنشطة والألعاب، مستنداً إلى أسئلة الكتاب المعتمدة مع إصدار شهادة إتقان رقمية."
            questions={POST_TEST_QUESTIONS}
            studentName={student.name}
            preTestResult={student.preTestResult}
            onSaveResult={handleSaveExamResult}
            onNavigateToLessons={() => {
              sound.playClick();
              setCurrentTab('lessons');
            }}
          />
        )}

        {currentTab === 'games' && <GamesHub onAddXp={addXp} />}

        {currentTab === 'playground' && <PythonPlayground />}
      </main>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-10 border-t border-slate-800 text-xs" dir="rtl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center md:text-right">
            <div className="text-white font-bold text-sm">منصة المهارات الرقمية التفاعلية - الصف الحادي عشر</div>
            <div>
              مستندة إلى منهاج المملكة الأردنية الهاشمية المطور (1445هـ / 2024م)
            </div>
            <div className="text-[11px] text-slate-500">
              المركز الوطني لتطوير المناهج (NCCD) بالتعاون مع وزارة التربية والتعليم ووزارة الاقتصاد الرقمي والريادة.
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
            <button onClick={() => setCurrentTab('home')} className="hover:text-white transition">الرئيسية</button>
            <button onClick={() => setCurrentTab('lessons')} className="hover:text-white transition">الشرح التفاعلي</button>
            <button onClick={() => setCurrentTab('infographics')} className="hover:text-white transition">الإنفوجرافيك</button>
            <button onClick={() => setCurrentTab('games')} className="hover:text-white transition">الألعاب التعليمية</button>
            <button onClick={() => setCurrentTab('playground')} className="hover:text-white transition">مختبر بايثون</button>
            <a
              href="/assets/aistudio/_______________________________________________________________59503fc5.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="text-indigo-400 hover:text-indigo-300 transition"
            >
              كتاب الطالب PDF
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
