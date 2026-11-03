export type TabType = 'home' | 'lessons' | 'pre-test' | 'post-test' | 'games' | 'playground' | 'book';

export interface LessonInfographic {
  title: string;
  subtitle: string;
  cards: {
    title: string;
    description: string;
    badge?: string;
    icon?: string;
    color?: string;
  }[];
  keyFormulaOrRule?: string;
}

export interface Lesson {
  id: string;
  unitId: 'unit1' | 'unit2';
  unitTitle: string;
  unitNumber: number;
  lessonNumber: number;
  title: string;
  englishTitle: string;
  readTime: string;
  summary: string;
  objectives: string[];
  keyTerms: { ar: string; en: string; def: string }[];
  infographic?: LessonInfographic;
  sections: {
    id: string;
    title: string;
    content: string;
    codeExample?: string;
    codeOutput?: string;
    explanation?: string;
    interactiveType?: 'code_runner' | 'flowchart' | 'scope_visualizer' | 'carbon_calc' | 'matrix_grid' | 'ewaste_guide';
    interactiveData?: any;
    lightbulbNote?: string;
    digitalCitizenship?: string;
  }[];
  quickQuiz: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  }[];
}

export interface Question {
  id: number;
  text: string;
  codeSnippet?: string;
  options: string[];
  correctIndex: number;
  unit: 'الخوارزميات والبرمجة' | 'الحوسبة والحياة';
  topic: string;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface ExamResult {
  examType: 'pre' | 'post';
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
  answers: { questionId: number; selectedIndex: number; isCorrect: boolean }[];
  topicBreakdown: Record<string, { correct: number; total: number }>;
}

export interface StudentProfile {
  name: string;
  xp: number;
  completedLessons: string[];
  preTestResult?: ExamResult;
  postTestResult?: ExamResult;
  badges: { id: string; name: string; icon: string; description: string; unlockedAt?: string }[];
  starsAndMoonsHighScore: number;
  bugHunterScore: number;
  greenHeroScore: number;
}
