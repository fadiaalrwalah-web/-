import React, { useState, useEffect } from 'react';
import { Star, Moon, RefreshCw, Trophy, HelpCircle, Code, CheckCircle, AlertCircle, Sparkles, User, Users } from 'lucide-react';
import confetti from 'canvas-confetti';
import { sound } from '../../utils/soundEffects';

interface GuessRecord {
  guess: string;
  stars: number;
  moons: number;
}

export const StarsAndMoonsGame: React.FC<{ onScoreUpdate?: (points: number) => void }> = ({ onScoreUpdate }) => {
  const [secret, setSecret] = useState<string>('');
  const [guessInput, setGuessInput] = useState<string>('');
  const [guesses, setGuesses] = useState<GuessRecord[]>([]);
  const [gameState, setGameState] = useState<'playing' | 'won' | 'lost'>('playing');
  const [maxAttempts] = useState(10);
  const [showRules, setShowRules] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [scratchpad, setScratchpad] = useState<Record<number, 'unknown' | 'eliminated' | 'confirmed'>>({
    0: 'unknown', 1: 'unknown', 2: 'unknown', 3: 'unknown', 4: 'unknown',
    5: 'unknown', 6: 'unknown', 7: 'unknown', 8: 'unknown', 9: 'unknown'
  });
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isTwoPlayer, setIsTwoPlayer] = useState(false);
  const [twoPlayerPhase, setTwoPlayerPhase] = useState<'enter_secret' | 'guessing'>('guessing');
  const [customSecretInput, setCustomSecretInput] = useState('');

  // Generate 4 unique random digits
  const generateSecret = () => {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    // Shuffle
    for (let i = digits.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [digits[i], digits[j]] = [digits[j], digits[i]];
    }
    return digits.slice(0, 4).join('');
  };

  const startNewGame = () => {
    sound.playClick();
    if (isTwoPlayer) {
      setTwoPlayerPhase('enter_secret');
      setCustomSecretInput('');
    } else {
      setSecret(generateSecret());
      setTwoPlayerPhase('guessing');
    }
    setGuesses([]);
    setGuessInput('');
    setGameState('playing');
    setErrorMsg('');
    setScratchpad({
      0: 'unknown', 1: 'unknown', 2: 'unknown', 3: 'unknown', 4: 'unknown',
      5: 'unknown', 6: 'unknown', 7: 'unknown', 8: 'unknown', 9: 'unknown'
    });
  };

  useEffect(() => {
    startNewGame();
  }, [isTwoPlayer]);

  // Logic calculation matching textbook count_stars and count_moons
  const calculateResult = (guess: string, sec: string) => {
    let stars = 0;
    let moons = 0;
    for (let i = 0; i < 4; i++) {
      if (guess[i] === sec[i]) {
        stars++;
      } else if (sec.includes(guess[i])) {
        moons++;
      }
    }
    return { stars, moons };
  };

  const handleStartCustomGame = (e: React.FormEvent) => {
    e.preventDefault();
    if (customSecretInput.length !== 4 || !/^\d{4}$/.test(customSecretInput)) {
      setErrorMsg('الرجاء إدخال 4 أرقام بالضبط');
      return;
    }
    const unique = new Set(customSecretInput.split(''));
    if (unique.size !== 4) {
      setErrorMsg('يجب أن تكون الأرقام الأربعة مختلفة تماماً وغير مكررة');
      return;
    }
    setSecret(customSecretInput);
    setTwoPlayerPhase('guessing');
    setErrorMsg('');
    sound.playSuccess();
  };

  const handleGuessSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (guessInput.length !== 4 || !/^\d{4}$/.test(guessInput)) {
      sound.playError();
      setErrorMsg('يجب إدخال 4 أرقام عددية بالضبط.');
      return;
    }

    const unique = new Set(guessInput.split(''));
    if (unique.size !== 4) {
      sound.playError();
      setErrorMsg('قواعد اللعبة تمنع تكرار أي رقم في التخمين!');
      return;
    }

    // Check if already guessed
    if (guesses.some((g) => g.guess === guessInput)) {
      sound.playError();
      setErrorMsg('لقد جربت هذا التخمين سابقاً!');
      return;
    }

    const { stars, moons } = calculateResult(guessInput, secret);
    const newRecord: GuessRecord = { guess: guessInput, stars, moons };
    const updatedGuesses = [newRecord, ...guesses];
    setGuesses(updatedGuesses);
    setGuessInput('');

    if (stars === 4) {
      // WIN!
      setGameState('won');
      sound.playWinFanfare();
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      const points = (maxAttempts - updatedGuesses.length + 1) * 30;
      if (onScoreUpdate) onScoreUpdate(points);
    } else if (updatedGuesses.length >= maxAttempts) {
      // LOST!
      setGameState('lost');
      sound.playError();
    } else {
      sound.playSuccess();
    }
  };

  const toggleDigitScratch = (digit: number) => {
    sound.playClick();
    setScratchpad((prev) => {
      const current = prev[digit];
      const next = current === 'unknown' ? 'eliminated' : current === 'eliminated' ? 'confirmed' : 'unknown';
      return { ...prev, [digit]: next };
    });
  };

  return (
    <div className="bg-white rounded-3xl p-6 md:p-8 shadow-xl border border-indigo-100 max-w-4xl mx-auto" dir="rtl">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              مشروع الوحدة الأساسي (الكتاب ص 16-17)
            </span>
            <div className="flex items-center gap-1 text-xs text-slate-500">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span>نجمة للمكان الصحيح</span>
              <Moon className="w-4 h-4 text-indigo-500 fill-indigo-500 ml-2" />
              <span>قمر للرقم الصحيح في مكان مختلف</span>
            </div>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mt-1 flex items-center gap-2">
            لعبة تخمين الأرقام: "نجوم وأقمار" (Stars & Moons)
          </h2>
        </div>

        <div className="flex items-center gap-2">
          {/* Mode switch */}
          <button
            onClick={() => {
              setIsTwoPlayer(!isTwoPlayer);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-100 hover:bg-slate-200 text-slate-700 transition"
          >
            {isTwoPlayer ? <Users className="w-4 h-4 text-indigo-600" /> : <User className="w-4 h-4 text-emerald-600" />}
            <span>{isTwoPlayer ? 'وضعية لاعبين اثنين' : 'ضد الحاسوب'}</span>
          </button>

          <button
            onClick={() => setShowRules(!showRules)}
            className="p-2 rounded-xl text-slate-500 hover:bg-slate-100 transition"
            title="تعليمات وقواعد اللعبة"
          >
            <HelpCircle className="w-5 h-5" />
          </button>

          <button
            onClick={() => setShowCode(!showCode)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 transition"
          >
            <Code className="w-4 h-4" />
            <span>كود بايثون</span>
          </button>

          <button
            onClick={startNewGame}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow transition"
          >
            <RefreshCw className="w-4 h-4" />
            <span>لعبة جديدة</span>
          </button>
        </div>
      </div>

      {/* Rules modal / drawer */}
      {showRules && (
        <div className="my-4 p-4 rounded-2xl bg-indigo-50/80 border border-indigo-200 text-xs leading-relaxed text-indigo-950">
          <h4 className="font-bold text-sm text-indigo-900 mb-2">قواعد اللعبة وسيناريو اللعب من كتاب الطالب:</h4>
          <ul className="list-disc list-inside space-y-1">
            <li>يقوم النظام بإضمار عدد سري مكون من 4 أرقام عشوائية ومختلفة تماماً (بدون تكرار).</li>
            <li>يقوم اللاعب بتخمين رقم مكون من 4 منازل، ويمنح 10 محاولات كحد أقصى.</li>
            <li><strong>النجوم ⭐:</strong> تمثل عدد المنازل التي استطاع اللاعب تخمين رقمها وموقعها الصحيح بدقة.</li>
            <li><strong>الأقمار 🌙:</strong> تمثل الأرقام الموجودة فعلاً في العدد المضمر ولكن في منزلة مختلفة.</li>
            <li><strong>الفوز 🏆:</strong> يتحقق بالحصول على 4 نجوم (4 Stars) قبل نفاد المحاولات العشر!</li>
          </ul>
        </div>
      )}

      {/* Python Code drawer */}
      {showCode && (
        <div className="my-4 p-4 rounded-2xl bg-slate-900 text-slate-100 font-mono text-xs border border-slate-800" dir="ltr">
          <div className="text-amber-400 font-bold mb-2 font-sans" dir="rtl">
            دوال بايثون للعبة كما وردت في الدرس السادس ص 128:
          </div>
          <pre className="text-emerald-400 whitespace-pre-wrap leading-relaxed overflow-x-auto">
{`# 1. دالة فحص النجوم
def count_stars(guess, secret):
    stars = 0
    for i in range(len(secret)):
        if guess[i] == secret[i]:
            stars += 1
    return stars

# 2. دالة فحص الأقمار
def count_moons(guess, secret):
    moons = 0
    for i in range(len(secret)):
        if guess[i] != secret[i] and guess[i] in secret:
            moons += 1
    return moons`}
          </pre>
        </div>
      )}

      {/* 2-Player Secret Entry Phase */}
      {isTwoPlayer && twoPlayerPhase === 'enter_secret' ? (
        <div className="my-8 max-w-md mx-auto text-center p-6 rounded-2xl bg-indigo-50 border border-indigo-200">
          <h3 className="text-lg font-bold text-indigo-900 mb-2">دور اللاعب الأول (إضمار الرقم السري):</h3>
          <p className="text-xs text-indigo-700 mb-4">
            أدخل 4 أرقام مختلفة ليقوم اللاعب الثاني بمحاولة تخمينها في 10 محاولات:
          </p>
          <form onSubmit={handleStartCustomGame} className="flex flex-col gap-3">
            <input
              type="password"
              maxLength={4}
              value={customSecretInput}
              onChange={(e) => setCustomSecretInput(e.target.value)}
              placeholder="مثال: 5821"
              className="px-4 py-3 text-center text-2xl font-mono tracking-widest rounded-xl border border-indigo-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
            />
            {errorMsg && <p className="text-xs text-rose-600 font-bold">{errorMsg}</p>}
            <button
              type="submit"
              className="py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow transition"
            >
              تثبيت الرقم وبدء التخمين
            </button>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 my-6">
          {/* Main Guessing Column */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            {/* Input & Status Banner */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
              <div className="flex items-center justify-between mb-3 text-xs font-bold text-slate-700">
                <span>المحاولات المتبقية:</span>
                <span className={`px-2.5 py-1 rounded-full ${
                  maxAttempts - guesses.length <= 3 ? 'bg-rose-100 text-rose-700 font-black' : 'bg-indigo-100 text-indigo-700'
                }`}>
                  {maxAttempts - guesses.length} من {maxAttempts}
                </span>
              </div>

              {gameState === 'playing' ? (
                <form onSubmit={handleGuessSubmit} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={4}
                    value={guessInput}
                    onChange={(e) => setGuessInput(e.target.value)}
                    placeholder="أدخل 4 أرقام فريدة (مثال: 4921)"
                    className="flex-1 px-4 py-3 rounded-xl border border-slate-300 font-mono text-center text-xl tracking-wider focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                    autoFocus
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 active:scale-95 text-white font-bold rounded-xl shadow transition flex items-center gap-1.5"
                  >
                    <span>تخمين</span>
                  </button>
                </form>
              ) : gameState === 'won' ? (
                <div className="p-4 rounded-xl bg-emerald-100 border border-emerald-300 text-emerald-900 text-center">
                  <Trophy className="w-10 h-10 text-emerald-600 mx-auto mb-1 animate-bounce" />
                  <div className="font-black text-lg">مبروك! لقد خمنت الرقم السري بنجاح 🎉</div>
                  <div className="text-xs mt-1">
                    الرقم هو: <span className="font-mono font-bold text-sm tracking-wider">{secret}</span> خلال {guesses.length} محاولات!
                  </div>
                  <button
                    onClick={startNewGame}
                    className="mt-3 px-4 py-1.5 bg-emerald-600 text-white rounded-lg text-xs font-bold shadow hover:bg-emerald-700"
                  >
                    العب جولة أخرى
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-rose-100 border border-rose-300 text-rose-900 text-center">
                  <AlertCircle className="w-10 h-10 text-rose-600 mx-auto mb-1" />
                  <div className="font-black text-lg">انتهت المحاولات العشر! حظاً أوفر في الجولة القادمة</div>
                  <div className="text-xs mt-1">
                    الرقم السري كان: <span className="font-mono font-bold text-sm tracking-wider">{secret}</span>
                  </div>
                  <button
                    onClick={startNewGame}
                    className="mt-3 px-4 py-1.5 bg-rose-600 text-white rounded-lg text-xs font-bold shadow hover:bg-rose-700"
                  >
                    حاول مرة أخرى
                  </button>
                </div>
              )}

              {errorMsg && (
                <div className="mt-2 text-xs text-rose-600 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{errorMsg}</span>
                </div>
              )}
            </div>

            {/* Guesses Log */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200">
              <h4 className="text-xs font-bold text-slate-700 mb-3 flex items-center justify-between">
                <span>سجل التخمينات السابقة ({guesses.length}):</span>
                <span className="text-[11px] text-slate-400 font-normal">الأحدث في الأعلى</span>
              </h4>

              {guesses.length === 0 ? (
                <div className="py-8 text-center text-xs text-slate-400">
                  لم تقم بأي تخمين بعد. أدخل 4 أرقام واضغط تخمين لبدء رحلة الاستنتاج!
                </div>
              ) : (
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                  {guesses.map((g, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 shadow-sm"
                    >
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center text-xs font-bold">
                          {guesses.length - idx}
                        </span>
                        <span className="font-mono text-base font-bold text-slate-800 tracking-wider">
                          {g.guess}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* Stars */}
                        <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-lg border border-amber-200 text-xs font-bold text-amber-800">
                          <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                          <span>{g.stars}</span>
                        </div>
                        {/* Moons */}
                        <div className="flex items-center gap-1 bg-indigo-50 px-2.5 py-1 rounded-lg border border-indigo-200 text-xs font-bold text-indigo-800">
                          <Moon className="w-4 h-4 text-indigo-600 fill-indigo-600" />
                          <span>{g.moons}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Helper Scratchpad Column */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            <div className="bg-gradient-to-br from-indigo-50/70 to-purple-50/70 p-5 rounded-2xl border border-indigo-100">
              <h4 className="text-sm font-bold text-indigo-900 mb-1 flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                لوحة الاستنتاج والملاحظات (Deduction Notepad):
              </h4>
              <p className="text-[11px] text-indigo-700/80 mb-3 leading-relaxed">
                انقر على الأرقام لتصنيفها أثناء التفكير:
                <br />
                رمادي = مجهول | أحمر مشطوب = مستبعد ❌ | أخضر = مؤكد وجوده ✅
              </p>

              <div className="grid grid-cols-5 gap-2">
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((digit) => {
                  const state = scratchpad[digit];
                  let btnClass = 'h-12 rounded-xl font-mono text-lg font-bold transition flex items-center justify-center relative ';
                  if (state === 'eliminated') {
                    btnClass += 'bg-rose-100 text-rose-400 line-through border border-rose-300';
                  } else if (state === 'confirmed') {
                    btnClass += 'bg-emerald-500 text-white shadow-md border-2 border-emerald-600';
                  } else {
                    btnClass += 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100';
                  }
                  return (
                    <button key={digit} onClick={() => toggleDigitScratch(digit)} className={btnClass}>
                      {digit}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quick Strategy Tips */}
            <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900 leading-relaxed">
              <div className="font-bold flex items-center gap-1 mb-1 text-amber-800">
                💡 استراتيجية الفوز السريع:
              </div>
              ابدأ باختيار 4 أرقام مختلفة مثل (0123) ثم (4567) لتحديد الأرقام الموجودة فعلاً في العدد المضمر قبل البدء بضبط أماكنها!
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
