import React, { useRef } from 'react';
import { Award, Download, Printer, X, CheckCircle, ShieldCheck, Sparkles } from 'lucide-react';
import { sound } from '../../utils/soundEffects';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  score: number;
  totalQuestions: number;
  percentage: number;
  date: string;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({
  isOpen,
  onClose,
  studentName,
  score,
  totalQuestions,
  percentage,
  date
}) => {
  const certRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const handlePrint = () => {
    sound.playClick();
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm" dir="rtl">
      <div className="bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-fadeIn relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 left-4 p-2 text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-full transition z-10"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Printable Area */}
        <div ref={certRef} className="p-8 md:p-10 border-8 border-indigo-100 bg-gradient-to-br from-indigo-50/40 via-white to-amber-50/30 text-center relative">
          {/* Ornamental Border Corner */}
          <div className="absolute top-4 right-4 w-12 h-12 border-t-2 border-r-2 border-indigo-400" />
          <div className="absolute bottom-4 left-4 w-12 h-12 border-b-2 border-l-2 border-indigo-400" />

          {/* Emblem */}
          <div className="inline-flex p-4 rounded-full bg-indigo-50 border-2 border-indigo-200 mb-4 shadow-sm">
            <Award className="w-12 h-12 text-indigo-600" />
          </div>

          <div className="text-xs font-bold text-indigo-600 tracking-wider uppercase mb-1">
            المملكة الأردنية الهاشمية - وزارة التربية والتعليم
          </div>
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight">
            شهادة إتمام وإتقان المهارات الرقمية
          </h2>
          <div className="text-xs text-slate-500 mt-1 mb-6">
            الصف الحادي عشر - الفصل الدراسي الأول (الخوارزميات والبرمجة والحوسبة الخضراء)
          </div>

          <p className="text-xs text-slate-600 mb-2">تشهد منصة المهارات الرقمية التفاعلية بأن الطالب/ـة المتميز/ة:</p>

          <div className="my-3 py-2 px-6 border-b-2 border-dashed border-indigo-300 inline-block">
            <span className="text-2xl md:text-3xl font-black text-indigo-900 font-serif">
              {studentName || 'طالب متميز'}
            </span>
          </div>

          <p className="text-xs text-slate-700 max-w-md mx-auto leading-relaxed mt-3 mb-6">
            قد اجتاز/ت بنجاح وتفوق **الامتحان البعدي الشامل** لمبحث المهارات الرقمية، مبرهناً/ـة على إتقان مفاهيم لغة بايثون، والجمل الشرطية، وحلقات التكرار، والقوائم، ومبادئ الحوسبة الخضراء وإدارة النفايات الإلكترونية.
          </p>

          {/* Score Badge */}
          <div className="flex items-center justify-center gap-6 my-6">
            <div className="bg-white px-5 py-2.5 rounded-2xl border border-indigo-100 shadow-sm text-center">
              <div className="text-[10px] text-slate-400 font-semibold">العلامة المحققة</div>
              <div className="text-xl font-black text-indigo-600 font-mono">
                {score} / {totalQuestions}
              </div>
            </div>
            <div className="bg-white px-5 py-2.5 rounded-2xl border border-indigo-100 shadow-sm text-center">
              <div className="text-[10px] text-slate-400 font-semibold">النسبة المئوية</div>
              <div className="text-xl font-black text-emerald-600 font-mono">
                {percentage}%
              </div>
            </div>
            <div className="bg-white px-5 py-2.5 rounded-2xl border border-indigo-100 shadow-sm text-center">
              <div className="text-[10px] text-slate-400 font-semibold">التقدير العام</div>
              <div className="text-sm font-bold text-amber-600 mt-1">
                {percentage >= 90 ? 'ممتاز مع مرتبة الشرف ⭐' : percentage >= 80 ? 'جيد جداً مرتفع 🏅' : 'ناجح بجدارة 🎯'}
              </div>
            </div>
          </div>

          {/* Footer of certificate */}
          <div className="pt-6 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
            <div>
              <span>تاريخ الإنجاز: </span>
              <span className="font-semibold text-slate-800 font-mono">{date}</span>
            </div>
            <div className="flex items-center gap-1.5 text-emerald-700 font-bold">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span>معتمدة رقمياً ومطابقة للمنهاج الوطني</span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-end gap-3">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow transition active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة أو حفظ كملف PDF</span>
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2.5 bg-white border border-slate-200 hover:bg-slate-100 text-slate-700 text-xs font-bold rounded-xl transition"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
