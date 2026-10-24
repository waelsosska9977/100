import React from 'react';
import { X, BookOpen, CheckCircle, TrendingUp, ShieldAlert, Cpu, Sparkles } from 'lucide-react';

interface StrategyGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StrategyGuideModal: React.FC<StrategyGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121a2b] border border-[#2e4166] rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col shadow-2xl text-right">
        {/* Header */}
        <div className="p-4 border-b border-[#1f2d47] flex items-center justify-between bg-[#0f1626]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#7da8ff]/20 border border-[#7da8ff]/40 flex items-center justify-center text-[#7da8ff]">
              <BookOpen size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">دليل استراتيجية SOSSKA1 المؤسسية</h3>
              <p className="text-xs text-slate-400">قواعد التداول المنهجي وتدفق السيولة وإدارة المخاطر الصارمة</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#18233a] hover:bg-[#1f2d47] text-slate-400 hover:text-white transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed font-sans">
          {/* Section 1 */}
          <div className="p-3.5 rounded-xl bg-[#0b1020] border border-[#1f2d47] space-y-1.5">
            <h4 className="font-bold text-sm text-[#7da8ff] flex items-center gap-1.5">
              <TrendingUp size={15} />
              1. فلتر ماكرو البيتكوين (BTC Macro Trend)
            </h4>
            <p>
              يحدد الاتجاه العام للسوق بأكمله. يتم فحص تموضع سعر البيتكوين بالنسبة لـ <span className="font-mono text-white">EMA 100</span> على فريمي 15m و 1h:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 mr-2">
              <li><strong className="text-[#31d0a0]">Bullish Regime (أخضر):</strong> يُسمح بفتح صفقات الشراء Long فقط على العملات البديلة.</li>
              <li><strong className="text-[#ff7085]">Bearish Regime (أحمر):</strong> تجنب الشراء المندفع؛ يُفضل التداول على صفقات البيع Short أو انتظار انتهاء التصحيح.</li>
            </ul>
          </div>

          {/* Section 2 */}
          <div className="p-3.5 rounded-xl bg-[#0b1020] border border-[#1f2d47] space-y-1.5">
            <h4 className="font-bold text-sm text-[#31d0a0] flex items-center gap-1.5">
              <CheckCircle size={15} />
              2. مصفوفة الفريمات المتعددة (MTF Trend Matrix)
            </h4>
            <p>
              تراقب تموضع السعر بالنسبة للمتوسط المتحرك الأسي <span className="font-mono text-white">EMA 50</span> عبر ثلاثة فريمات زمنية متسلسلة (15m, 1h, 4h):
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 mr-2">
              <li><strong>توافق 3/3:</strong> أعلى درجات الزخم المؤسسي وتعتبر أقوى الفرص للدخول مع الاتجاه.</li>
              <li><strong>توافق 2/3:</strong> اتجاه أولي في مرحلة التشكل، يتطلب تأكيداً من مؤشر تدفق السيولة.</li>
            </ul>
          </div>

          {/* Section 3 */}
          <div className="p-3.5 rounded-xl bg-[#0b1020] border border-[#1f2d47] space-y-1.5">
            <h4 className="font-bold text-sm text-[#7da8ff] flex items-center gap-1.5">
              <Cpu size={15} />
              3. هيمنة السيولة المؤسسية (MCDX+ Smart Money Tracker)
            </h4>
            <p>
              يقيس توزيع تدفق الأموال بين:
            </p>
            <div className="grid grid-cols-3 gap-2 text-center font-mono my-2">
              <div className="p-2 rounded bg-[#18233a] border border-[#2e4166]">
                <span className="text-[#ff7085] font-bold block">Banker</span>
                <span className="text-[10px] text-slate-400">صناع السوق والحيتان</span>
              </div>
              <div className="p-2 rounded bg-[#18233a] border border-[#2e4166]">
                <span className="text-[#ffc66d] font-bold block">Hot Money</span>
                <span className="text-[10px] text-slate-400">السيولة المضاربية</span>
              </div>
              <div className="p-2 rounded bg-[#18233a] border border-[#2e4166]">
                <span className="text-[#31d0a0] font-bold block">Retail</span>
                <span className="text-[10px] text-slate-400">المتداولون الأفراد</span>
              </div>
            </div>
            <p>
              الفرصة الذهبية تكون عندما يتجاوز تدفق Banker نسبة <span className="font-mono text-white font-bold">50%</span> ويفضل فوق <span className="font-mono text-[#7da8ff] font-bold">75%</span>.
            </p>
          </div>

          {/* Section 4 */}
          <div className="p-3.5 rounded-xl bg-[#0b1020] border border-[#1f2d47] space-y-1.5">
            <h4 className="font-bold text-sm text-[#ffc66d] flex items-center gap-1.5">
              <ShieldAlert size={15} />
              4. مؤشر MFI ومناطق التشبع اللحظي (LAL3 Gemini)
            </h4>
            <p>
              مؤشر تدفق الأموال الحقيقي Money Flow Index أدق من RSI التقليدي لأنه يربط حركة السعر بحجم التداول الفعلي:
            </p>
            <ul className="list-disc list-inside space-y-1 text-slate-300 mr-2">
              <li><strong className="text-[#31d0a0]">MFI &lt; 25:</strong> تشبع بيعي حقيقي وتجميع حيتان — أفضل مناطق لصيد القيعان الارتدادية.</li>
              <li><strong className="text-[#ff7085]">MFI &gt; 75:</strong> تصريف مؤسسات وذروة شراء — إشارة تحذيرية لجني الأرباح أو التحوط.</li>
            </ul>
          </div>

          {/* Section 5 */}
          <div className="p-3.5 rounded-xl bg-[#0b1020] border border-[#1f2d47] space-y-1.5">
            <h4 className="font-bold text-sm text-white flex items-center gap-1.5">
              <Sparkles size={15} className="text-[#31d0a0]" />
              5. معادلة إدارة المخاطر اللحظية (SOSSKA1 Multiplier)
            </h4>
            <p>
              تعتمد حسابات وقف الخسارة والأهداف بدقة رياضية على تقلب السوق الحقيقي مقاساً بـ <span className="font-mono text-white font-bold">ATR(14)</span>:
            </p>
            <div className="p-2.5 rounded bg-[#151f33] border border-[#2e4166] font-mono text-[11px] space-y-1">
              <div className="text-[#ff7085]">🛑 وقف الخسارة (SL): Entry - (1.8 * ATR) لصفقات الشراء</div>
              <div className="text-[#31d0a0]">🎯 الهدف الأول (TP1): Entry + (2.5 * ATR) [نسبة عائد 1:1.39]</div>
              <div className="text-[#7da8ff]">🚀 الهدف الثاني (TP2): Entry + (5.0 * ATR) [نسبة عائد 1:2.78]</div>
              <div className="text-slate-300 pt-1 border-t border-[#1f2d47]">
                💼 حجم المركز = مبلغ المخاطرة بالدولار ÷ مسافة الوقف
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#1f2d47] flex justify-end bg-[#0f1626]">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-lg bg-[#7da8ff] hover:bg-[#6c98f0] text-slate-950 font-bold text-xs transition-colors"
          >
            فهمت المنهجية، متابعة التداول
          </button>
        </div>
      </div>
    </div>
  );
};
