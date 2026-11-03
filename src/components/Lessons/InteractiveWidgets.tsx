import React, { useState } from 'react';
import { Play, RotateCcw, CheckCircle2, AlertTriangle, ArrowDown, Sparkles, Terminal, Info, Calculator, ShieldAlert, Cpu } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

// 1. Python Code Runner Widget
export const PythonCodeRunnerWidget: React.FC<{ initialCode: string; defaultOutput?: string }> = ({
  initialCode,
  defaultOutput = ''
}) => {
  const [code, setCode] = useState(initialCode);
  const [output, setOutput] = useState(defaultOutput);
  const [isRunning, setIsRunning] = useState(false);

  const simulateRun = () => {
    sound.playClick();
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      // Basic smart simulation for common patterns
      let simOut = '';
      const lines = code.split('\n');
      
      try {
        if (code.includes('is_even')) {
          simOut = 'هل 8 زوجي؟ True\nهل 7 زوجي؟ False';
        } else if (code.includes('s += i')) {
          simOut = 'إضافة 1، المجموع الحالي = 1\nإضافة 2، المجموع الحالي = 3\nإضافة 3، المجموع الحالي = 6\nإضافة 4، المجموع الحالي = 10\nإضافة 5، المجموع الحالي = 15\nالمجموع النهائي: 15';
        } else if (code.includes('nums.append(99)')) {
          simOut = 'القائمة كاملة: [10, 48, 33, 17]\nأول عنصر nums[0]: 10\nآخر عنصر nums[-1]: 17\nبعد إضافة 99: [10, 48, 33, 17, 99]';
        } else if (code.includes('num % 2 == 0')) {
          simOut = 'العدد 14 هو عدد زوجي';
        } else if (code.includes('type(name)')) {
          simOut = "أهلاً وسهلاً يا سارة\nنوع المتغير name هو: <class 'str'>\nنوع المتغير age هو: <class 'int'>";
        } else {
          // Parse basic print statements
          const printed: string[] = [];
          for (const line of lines) {
            const match = line.match(/print\((.*)\)/);
            if (match && match[1]) {
              const cleaned = match[1].replace(/['"]/g, '').replace(/f['"]/g, '');
              printed.push(cleaned);
            }
          }
          simOut = printed.length > 0 ? printed.join('\n') : 'تم تنفيذ الكود بنجاح (بدون مخرجات طباعة).';
        }
      } catch (e) {
        simOut = 'خطأ نحوي في الشيفرة (Syntax Error)';
      }

      setOutput(simOut);
      sound.playSuccess();
    }, 450);
  };

  const handleReset = () => {
    sound.playClick();
    setCode(initialCode);
    setOutput(defaultOutput);
  };

  return (
    <div className="my-6 rounded-2xl border border-slate-700 bg-slate-900 text-slate-100 shadow-xl overflow-hidden font-mono text-sm text-left" dir="ltr">
      <div className="flex items-center justify-between px-4 py-2.5 bg-slate-800 border-b border-slate-700">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-rose-500" />
          <div className="w-3 h-3 rounded-full bg-amber-500" />
          <div className="w-3 h-3 rounded-full bg-emerald-500" />
          <span className="ml-2 text-xs text-slate-400 font-sans flex items-center gap-1.5" dir="rtl">
            <Terminal className="w-3.5 h-3.5 text-indigo-400" />
            محرر بايثون التفاعلي (Live Simulator)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleReset}
            className="flex items-center gap-1 px-2.5 py-1 text-xs text-slate-300 hover:text-white bg-slate-700 hover:bg-slate-600 rounded-lg transition"
            title="إعادة تعيين الكود"
          >
            <RotateCcw className="w-3 h-3" />
            <span className="font-sans">إعادة</span>
          </button>
          <button
            onClick={simulateRun}
            disabled={isRunning}
            className="flex items-center gap-1.5 px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 active:scale-95 rounded-lg transition disabled:opacity-50"
          >
            <Play className="w-3 h-3 fill-current" />
            <span className="font-sans">{isRunning ? 'جارِ التنفيذ...' : 'تشغيل الكود'}</span>
          </button>
        </div>
      </div>

      <div className="p-4 bg-slate-950">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full bg-transparent text-emerald-400 font-mono text-sm resize-y outline-none leading-relaxed min-h-[120px]"
          spellCheck={false}
        />
      </div>

      <div className="border-t border-slate-800 bg-slate-900/90 p-4">
        <div className="text-xs text-slate-400 mb-1 flex items-center gap-1 font-sans" dir="rtl">
          <span className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
          شاشة المخرجات (Terminal Console):
        </div>
        <pre className="text-xs text-slate-200 whitespace-pre-wrap font-mono min-h-[40px] bg-black/40 p-3 rounded-lg border border-slate-800">
          {output || '// اضغط على "تشغيل الكود" لمشاهدة النتيجة هنا'}
        </pre>
      </div>
    </div>
  );
};

// 2. Interactive Flowchart Simulator
export const FlowchartSimulatorWidget: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [inputs, setInputs] = useState({ a: 5, x: 10, b: 20 });

  const y = inputs.a * inputs.x + inputs.b;
  const isGreater = y > 60;

  const steps = [
    { id: 0, title: 'البداية (Start)', desc: 'شكل بيضاوي: نقطة انطلاق الخوارزمية', type: 'start' },
    { id: 1, title: 'إدخال المتغيرات (Input)', desc: `متوازي أضلاع: قراءة a = ${inputs.a}, x = ${inputs.x}, b = ${inputs.b}`, type: 'input' },
    { id: 2, title: 'معالجة حسابية (Process)', desc: `مستطيل: تطبيق المعادلة y = a * x + b = ${y}`, type: 'process' },
    { id: 3, title: 'اتخاذ قرار شرطي (Decision)', desc: `معين: هل y > 60؟ (${y} > 60 -> ${isGreater ? 'نعم (Yes)' : 'لا (No)'})`, type: 'decision' },
    { id: 4, title: 'طباعة النتيجة (Output)', desc: `متوازي أضلاع: طباعة "${isGreater ? 'y > 60' : 'y < 60'}" وطباعة قيمة y = ${y}`, type: 'output' },
    { id: 5, title: 'التوقف (Stop)', desc: 'شكل بيضاوي: انتهاء تنفيذ الخوارزمية', type: 'end' }
  ];

  const handleNext = () => {
    sound.playClick();
    setCurrentStep((prev) => (prev < steps.length - 1 ? prev + 1 : 0));
  };

  return (
    <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-indigo-50/50 to-blue-50/50 border border-indigo-100 shadow-sm" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-indigo-600" />
            محاكي مخطط سير العمليات التفاعلي (Flowchart Tracer)
          </h4>
          <p className="text-xs text-slate-500 mt-0.5">
            تتبع خطوات الخوارزمية والشكل الهندسي لكل مرحلة كما ورد في الشكل (5-1)
          </p>
        </div>
        <button
          onClick={handleNext}
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition active:scale-95 flex items-center gap-1.5"
        >
          <span>{currentStep === steps.length - 1 ? 'إعادة من البداية' : 'الخطوة التالية ⬅️'}</span>
        </button>
      </div>

      {/* Input controls */}
      <div className="flex flex-wrap items-center gap-4 bg-white/80 p-3 rounded-xl border border-indigo-100 mb-6 text-xs">
        <span className="font-semibold text-slate-700">تعديل قيم المدخلات:</span>
        <label className="flex items-center gap-1.5">
          <span>a:</span>
          <input
            type="number"
            value={inputs.a}
            onChange={(e) => setInputs({ ...inputs, a: Number(e.target.value) || 0 })}
            className="w-16 px-2 py-1 border rounded-lg text-center"
          />
        </label>
        <label className="flex items-center gap-1.5">
          <span>x:</span>
          <input
            type="number"
            value={inputs.x}
            onChange={(e) => setInputs({ ...inputs, x: Number(e.target.value) || 0 })}
            className="w-16 px-2 py-1 border rounded-lg text-center"
          />
        </label>
        <label className="flex items-center gap-1.5">
          <span>b:</span>
          <input
            type="number"
            value={inputs.b}
            onChange={(e) => setInputs({ ...inputs, b: Number(e.target.value) || 0 })}
            className="w-16 px-2 py-1 border rounded-lg text-center"
          />
        </label>
        <div className="mr-auto text-indigo-700 font-bold">
          الناتج y = {y} ({isGreater ? 'أكبر من 60' : 'أقل من أو يساوي 60'})
        </div>
      </div>

      {/* Flowchart visualizer */}
      <div className="flex flex-col items-center gap-3 py-2">
        {steps.map((s, idx) => {
          const isActive = currentStep === idx;
          const isPast = currentStep > idx;

          let shapeClass = 'px-6 py-2.5 text-center text-xs font-bold transition-all duration-300 ';
          if (s.type === 'start' || s.type === 'end') {
            shapeClass += 'rounded-full border-2 min-w-[140px] ';
          } else if (s.type === 'input' || s.type === 'output') {
            shapeClass += 'skew-x-[-12deg] rounded-lg border-2 min-w-[180px] ';
          } else if (s.type === 'decision') {
            shapeClass += 'border-2 min-w-[200px] rounded-xl ';
          } else {
            shapeClass += 'rounded-xl border-2 min-w-[200px] ';
          }

          if (isActive) {
            shapeClass += 'bg-indigo-600 border-indigo-700 text-white shadow-lg scale-105 ring-4 ring-indigo-200';
          } else if (isPast) {
            shapeClass += 'bg-emerald-50 border-emerald-300 text-emerald-800';
          } else {
            shapeClass += 'bg-white border-slate-300 text-slate-500 opacity-60';
          }

          return (
            <React.Fragment key={s.id}>
              <div className={shapeClass}>
                <div className={s.type === 'input' || s.type === 'output' ? 'skew-x-[12deg]' : ''}>
                  <div>{s.title}</div>
                  <div className="text-[11px] font-normal opacity-90 mt-0.5">{s.desc}</div>
                </div>
              </div>
              {idx < steps.length - 1 && (
                <div className={`transition-colors ${currentStep > idx ? 'text-emerald-500' : 'text-slate-300'}`}>
                  <ArrowDown className="w-4 h-4" />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
};

// 3. Variable Scope & Stack Frame Visualizer
export const ScopeVisualizerWidget: React.FC = () => {
  const [inFunction, setInFunction] = useState(false);
  const [globalX] = useState(7);
  const [localX, setLocalX] = useState(3);

  return (
    <div className="my-6 p-6 rounded-2xl bg-slate-900 text-white border border-slate-800 shadow-md font-sans" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-amber-400 flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            محاكي مدى المتغيرات وإطار التكديس (Local vs Global Scope)
          </h4>
          <p className="text-xs text-slate-400 mt-1">
            شاهد كيف يحجز المتغير المحلي مكاناً مؤقتاً في Stack Frame وينتهي بانتهاء الدالة
          </p>
        </div>
        <button
          onClick={() => {
            sound.playClick();
            setInFunction(!inFunction);
          }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
            inFunction ? 'bg-rose-600 hover:bg-rose-700' : 'bg-indigo-600 hover:bg-indigo-700'
          }`}
        >
          {inFunction ? 'إنهاء تنفيذ الدالة (Return)' : 'استدعاء الدالة test_scope()'}
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 my-4">
        {/* Global Memory Frame */}
        <div className="p-4 rounded-xl bg-slate-800 border border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-indigo-400">المدى العام (Global Scope)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-950 text-indigo-300 border border-indigo-800">
              دائم طوال البرنامج
            </span>
          </div>
          <div className="bg-slate-950 p-3 rounded-lg border border-slate-700 font-mono text-xs flex justify-between items-center" dir="ltr">
            <span className="text-slate-400">global_var: x</span>
            <span className="text-emerald-400 font-bold">{globalX}</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-2">
            قيمة x في المدى العام ثابتة ولا تتأثر بالمتغيرات المحلية التي تحمل نفس الاسم داخل الدوال.
          </p>
        </div>

        {/* Local Memory / Stack Frame */}
        <div className={`p-4 rounded-xl border transition-all duration-300 ${
          inFunction
            ? 'bg-amber-950/40 border-amber-500/80 ring-2 ring-amber-500/30'
            : 'bg-slate-800/40 border-dashed border-slate-700 opacity-60'
        }`}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold text-amber-400">إطار التكديس للدالة (Stack Frame)</span>
            <span className="text-[10px] px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800">
              {inFunction ? 'نشط الآن' : 'غير نشط (مفرغ)'}
            </span>
          </div>
          {inFunction ? (
            <div>
              <div className="bg-slate-950 p-3 rounded-lg border border-amber-500/50 font-mono text-xs flex justify-between items-center" dir="ltr">
                <span className="text-amber-300">local_var: x</span>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={localX}
                    onChange={(e) => setLocalX(Number(e.target.value) || 0)}
                    className="w-12 bg-slate-800 text-amber-300 text-center rounded border border-amber-700 py-0.5"
                  />
                </div>
              </div>
              <p className="text-[11px] text-amber-200/90 mt-2">
                الدالة تعمل الآن وتستخدم المتغير المحلي x = {localX}. عند الضغط على "إنهاء" سيُحذف هذا الإطار تماماً!
              </p>
            </div>
          ) : (
            <div className="py-6 text-center text-xs text-slate-500">
              لا توجد دوال قيد التنفيذ حالياً. اضغط "استدعاء الدالة" لمشاهدة بناء إطار الذاكرة.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 4. Digital Carbon Footprint Calculator Widget
export const CarbonFootprintWidget: React.FC = () => {
  const [deviceHours, setDeviceHours] = useState(4);
  const [streamingHours, setStreamingHours] = useState(2);
  const [emailsDaily, setEmailsDaily] = useState(15);

  // Estimations based on environmental studies in textbook
  const phoneCo2Kg = (deviceHours * 0.05 * 365).toFixed(1);
  const streamingCo2Kg = (streamingHours * 0.15 * 365).toFixed(1);
  const emailsCo2Kg = (emailsDaily * 0.004 * 365).toFixed(1);
  const totalCo2 = (Number(phoneCo2Kg) + Number(streamingCo2Kg) + Number(emailsCo2Kg)).toFixed(1);
  const treesNeeded = Math.ceil(Number(totalCo2) / 22); // 1 mature tree absorbs ~22kg CO2/year

  return (
    <div className="my-6 p-6 rounded-2xl bg-gradient-to-br from-emerald-900 to-teal-950 text-white border border-emerald-700 shadow-lg" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-emerald-300 flex items-center gap-2">
            <Calculator className="w-5 h-5" />
            حاسبة البصمة الكربونية الرقمية التفاعلية (Digital Footprint Calculator)
          </h4>
          <p className="text-xs text-emerald-100/80 mt-1">
            احسب كمية انبعاثات ثاني أكسيد الكربون (CO2) السنوية الناتجة عن أنشطتك الرقمية اليومية
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-4">
        <div className="bg-white/10 p-4 rounded-xl border border-emerald-500/30">
          <label className="text-xs font-semibold block mb-2">استخدام الهاتف والحاسوب يومياً (ساعات):</label>
          <input
            type="range"
            min="1"
            max="14"
            value={deviceHours}
            onChange={(e) => setDeviceHours(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
          <div className="flex justify-between text-xs mt-1 text-emerald-200">
            <span>{deviceHours} ساعات/يومياً</span>
            <span>~{phoneCo2Kg} كغ CO2</span>
          </div>
        </div>

        <div className="bg-white/10 p-4 rounded-xl border border-emerald-500/30">
          <label className="text-xs font-semibold block mb-2">بث الفيديو والألعاب عبر الإنترنت (ساعات):</label>
          <input
            type="range"
            min="0"
            max="10"
            value={streamingHours}
            onChange={(e) => setStreamingHours(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
          <div className="flex justify-between text-xs mt-1 text-emerald-200">
            <span>{streamingHours} ساعات/يومياً</span>
            <span>~{streamingCo2Kg} كغ CO2</span>
          </div>
        </div>

        <div className="bg-white/10 p-4 rounded-xl border border-emerald-500/30">
          <label className="text-xs font-semibold block mb-2">رسائل البريد والدردشة المستلمة/المرسلة:</label>
          <input
            type="range"
            min="5"
            max="100"
            step="5"
            value={emailsDaily}
            onChange={(e) => setEmailsDaily(Number(e.target.value))}
            className="w-full accent-emerald-400"
          />
          <div className="flex justify-between text-xs mt-1 text-emerald-200">
            <span>{emailsDaily} رسالة/يوم</span>
            <span>~{emailsCo2Kg} كغ CO2</span>
          </div>
        </div>
      </div>

      {/* Result Card */}
      <div className="bg-emerald-800/60 p-4 rounded-xl border border-emerald-400/40 flex flex-col md:flex-row items-center justify-between gap-4 mt-4">
        <div>
          <div className="text-xs text-emerald-200">مجموع بصمتك الرقمية السنوية:</div>
          <div className="text-3xl font-black text-amber-300">{totalCo2} كغم CO₂ / سنوياً</div>
        </div>
        <div className="bg-black/30 px-4 py-2.5 rounded-xl text-center">
          <div className="text-xs text-emerald-200">الأشجار اللازمة لامتصاص هذه البصمة:</div>
          <div className="text-xl font-bold text-emerald-300">🌲 {treesNeeded} شجرة بالغة</div>
        </div>
      </div>
    </div>
  );
};

// 5. E-Waste Toxic Substances Explorer
export const EWasteToxicWidget: React.FC = () => {
  const [selectedId, setSelectedId] = useState<number>(0);

  const toxics = [
    {
      name: 'الكادميوم (Cadmium)',
      sym: 'Cd',
      source: 'بطاريات الهواتف المحمولة القابلة للشحن',
      damage: 'فقدان الكالسيوم، هشاشة العظام الحادة، تلف الرئتين، والوفاة.',
      risk: 'شديد السمية'
    },
    {
      name: 'الرصاص (Lead)',
      sym: 'Pb',
      source: 'أجهزة الحاسوب، الشاشات، أجهزة التلفاز، البطاريات',
      damage: 'اضطراب النشاط المعرفي واللفظي، الشلل، الغيبوبة، والوفاة.',
      risk: 'تلف عصبي'
    },
    {
      name: 'الزرنيخ (Arsenic)',
      sym: 'As',
      source: 'الميكروويف، لوحات الدارات الإلكترونية، عاكس التيار',
      damage: 'اضطراب النمو، أمراض القلب، داء السكري، وأمراض سرطانية.',
      risk: 'مسرطن'
    },
    {
      name: 'الكروم (Chromium)',
      sym: 'Cr',
      source: 'صناعة البلاستيك وطلاء الحماية',
      damage: 'تهيج حاد في الجلد والطفح الجلدي المزمن.',
      risk: 'مهيج جلدي'
    },
    {
      name: 'النحاس (Copper)',
      sym: 'Cu',
      source: 'الأسلاك النحاسية ولوحات الدارات',
      damage: 'التهاب الحلق والرئتين، وتلف الكبد والكلى عند الاستنشاق المتكرر.',
      risk: 'تلف الأعضاء'
    }
  ];

  const current = toxics[selectedId];

  return (
    <div className="my-6 p-6 rounded-2xl bg-slate-900 border border-rose-900/50 shadow-md text-white" dir="rtl">
      <div className="flex items-center gap-2 mb-4">
        <ShieldAlert className="w-5 h-5 text-rose-500" />
        <h4 className="text-base font-bold text-rose-400">
          دليل المواد السامة في النفايات الإلكترونية (جدول 1-2 من الكتاب المدرسي)
        </h4>
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        {toxics.map((t, idx) => (
          <button
            key={t.sym}
            onClick={() => {
              sound.playClick();
              setSelectedId(idx);
            }}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-2 ${
              selectedId === idx
                ? 'bg-rose-600 text-white shadow-lg shadow-rose-900/50 scale-105'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            <span className="font-mono bg-black/40 px-1.5 py-0.5 rounded text-[10px]">{t.sym}</span>
            <span>{t.name}</span>
          </button>
        ))}
      </div>

      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <span className="text-[11px] text-slate-400 block mb-1">المادة الكيميائية:</span>
          <span className="text-sm font-bold text-white">{current.name}</span>
          <span className="inline-block mt-2 px-2 py-0.5 bg-rose-950 text-rose-300 border border-rose-800 text-[10px] rounded">
            {current.risk}
          </span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block mb-1">مكان وجودها في الأجهزة:</span>
          <span className="text-xs text-amber-300">{current.source}</span>
        </div>
        <div>
          <span className="text-[11px] text-slate-400 block mb-1">المخاطر والآثار الصحية:</span>
          <span className="text-xs text-rose-300 leading-relaxed">{current.damage}</span>
        </div>
      </div>
    </div>
  );
};

// 6. Interactive 2D Matrix Grid Widget (XO Demo)
export const MatrixGridWidget: React.FC = () => {
  const [board, setBoard] = useState([
    ['X', 'O', 'X'],
    ['-', 'X', '-'],
    ['O', '-', 'X']
  ]);
  const [selectedCell, setSelectedCell] = useState<{ r: number; c: number } | null>(null);

  const toggleCell = (r: number, c: number) => {
    sound.playClick();
    setSelectedCell({ r, c });
    const newBoard = board.map((row) => [...row]);
    const current = newBoard[r][c];
    if (current === '-') newBoard[r][c] = 'X';
    else if (current === 'X') newBoard[r][c] = 'O';
    else newBoard[r][c] = '-';
    setBoard(newBoard);
  };

  return (
    <div className="my-6 p-6 rounded-2xl bg-indigo-950 text-white border border-indigo-800 shadow-md" dir="rtl">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h4 className="text-base font-bold text-indigo-300 flex items-center gap-2">
            <Cpu className="w-5 h-5" />
            محاكي القوائم المركبة والمصفوفات ثنائية الأبعاد (2D Matrix Grid)
          </h4>
          <p className="text-xs text-indigo-200 mt-1">
            اضغط على أي خلية لتعديل قيمتها وملاحظة تعبير الفهرسة \`board[row][col]\`
          </p>
        </div>
      </div>

      <div className="flex flex-col md:flex-row items-center justify-around gap-6 py-2">
        {/* 3x3 Grid */}
        <div className="grid grid-cols-3 gap-2 bg-indigo-900/60 p-3 rounded-2xl border border-indigo-700">
          {board.map((row, r) =>
            row.map((val, c) => {
              const isSelected = selectedCell?.r === r && selectedCell?.c === c;
              return (
                <button
                  key={`${r}-${c}`}
                  onClick={() => toggleCell(r, c)}
                  className={`w-16 h-16 rounded-xl flex flex-col items-center justify-center font-bold text-xl transition-all ${
                    isSelected
                      ? 'bg-amber-500 text-slate-900 shadow-lg scale-105'
                      : 'bg-indigo-950/80 hover:bg-indigo-800 text-white border border-indigo-700'
                  }`}
                >
                  <span>{val}</span>
                  <span className="text-[9px] font-mono opacity-60">[{r}][{c}]</span>
                </button>
              );
            })
          )}
        </div>

        {/* Code Explanation */}
        <div className="bg-black/40 p-4 rounded-xl border border-indigo-800 font-mono text-xs max-w-sm w-full" dir="ltr">
          <div className="text-indigo-400 font-bold mb-2 font-sans" dir="rtl">
            طريقة الوصول والبرمجة:
          </div>
          {selectedCell ? (
            <div className="space-y-1">
              <div className="text-amber-300"># الخلية المحددة حالياً:</div>
              <div className="text-emerald-400">
                board[{selectedCell.r}][{selectedCell.c}] = '{board[selectedCell.r][selectedCell.c]}'
              </div>
              <div className="text-slate-400 text-[11px] mt-2">
                الصف: {selectedCell.r} | العمود: {selectedCell.c}
              </div>
            </div>
          ) : (
            <div className="text-slate-400">انقر على أي خلية في الرقعة لتجربة الفهرسة!</div>
          )}
        </div>
      </div>
    </div>
  );
};
