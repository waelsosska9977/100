import React from 'react';
import { SavedTrade } from '../types';
import { X, Trash2, Download, ArrowUpRight, ArrowDownRight, Clock, ShieldCheck, FileSpreadsheet } from 'lucide-react';

interface TradeJournalModalProps {
  isOpen: boolean;
  onClose: () => void;
  trades: SavedTrade[];
  onDeleteTrade: (id: string) => void;
  onClearAll: () => void;
}

export const TradeJournalModal: React.FC<TradeJournalModalProps> = ({
  isOpen,
  onClose,
  trades,
  onDeleteTrade,
  onClearAll,
}) => {
  if (!isOpen) return null;

  const formatPrice = (p: number) => {
    if (p < 0.001) return p.toFixed(6);
    if (p < 1) return p.toFixed(4);
    if (p < 50) return p.toFixed(3);
    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatDate = (ts: number) => {
    return new Intl.DateTimeFormat('ar-EG-u-nu-latn', {
      timeZone: 'Africa/Cairo',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(ts));
  };

  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(trades, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `sosska1_trades_${Date.now()}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#121a2b] border border-[#2e4166] rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col shadow-2xl text-right">
        {/* Header */}
        <div className="p-4 border-b border-[#1f2d47] flex items-center justify-between bg-[#0f1626]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#31d0a0]/20 border border-[#31d0a0]/40 flex items-center justify-center text-[#31d0a0]">
              <ShieldCheck size={18} />
            </div>
            <div>
              <h3 className="font-bold text-base text-white">سجل الصفقات المحفوظة (Trade Journal)</h3>
              <p className="text-xs text-slate-400">حفظ محلي في المتصفح لجميع حسابات إدارة المخاطر</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {trades.length > 0 && (
              <>
                <button
                  onClick={handleExportJson}
                  className="px-2.5 py-1.5 rounded-lg bg-[#18233a] hover:bg-[#1f2d47] border border-[#2e4166] text-xs font-medium text-slate-300 hover:text-white flex items-center gap-1.5 transition-colors"
                  title="تصدير السجل كملف JSON"
                >
                  <Download size={13} />
                  <span>تصدير JSON</span>
                </button>
                <button
                  onClick={onClearAll}
                  className="px-2.5 py-1.5 rounded-lg bg-[#ff7085]/15 hover:bg-[#ff7085]/25 border border-[#ff7085]/30 text-xs font-medium text-[#ff7085] flex items-center gap-1.5 transition-colors"
                >
                  <Trash2 size={13} />
                  <span>مسح الكل</span>
                </button>
              </>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg bg-[#18233a] hover:bg-[#1f2d47] text-slate-400 hover:text-white transition-colors"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* List Content */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {trades.length === 0 ? (
            <div className="py-12 text-center space-y-2">
              <FileSpreadsheet size={36} className="text-slate-600 mx-auto" />
              <div className="text-sm font-semibold text-slate-300">لا توجد صفقات محفوظة بعد</div>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                عند حساب أي صفقة في حاسبة الفرص، اضغط على زر &quot;حفظ في السجل&quot; لمتابعتها وإدارتها هنا.
              </p>
            </div>
          ) : (
            trades.map((trade) => {
              const isLong = trade.direction === 'LONG';
              return (
                <div
                  key={trade.id}
                  className="p-3.5 rounded-xl bg-[#0b1020] border border-[#1f2d47] hover:border-[#2e4166] transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-white">
                        {trade.symbol}
                      </span>
                      <span
                        className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded text-[11px] font-bold font-mono ${
                          isLong
                            ? 'bg-[#31d0a0]/15 text-[#31d0a0] border border-[#31d0a0]/30'
                            : 'bg-[#ff7085]/15 text-[#ff7085] border border-[#ff7085]/30'
                        }`}
                      >
                        {isLong ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                        {trade.direction}
                      </span>
                      <span className="text-[11px] text-slate-400 font-mono flex items-center gap-1 mr-2">
                        <Clock size={11} className="text-[#ffc66d]" />
                        {formatDate(trade.timestamp)}
                      </span>
                    </div>

                    <button
                      onClick={() => onDeleteTrade(trade.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-[#ff7085] hover:bg-[#ff7085]/10 transition-colors"
                      title="حذف هذه الصفقة"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>

                  {/* Numbers Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 rounded bg-[#121a2b] border border-[#1f2d47] font-mono text-xs">
                    <div>
                      <span className="text-[10px] text-slate-400 font-sans block">سعر الدخول:</span>
                      <span className="font-bold text-slate-200">${formatPrice(trade.entryPrice)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#ff7085] font-sans block">وقف الخسارة:</span>
                      <span className="font-bold text-[#ff7085]">${formatPrice(trade.sl)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#31d0a0] font-sans block">الهدف الأول:</span>
                      <span className="font-bold text-[#31d0a0]">${formatPrice(trade.tp1)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-[#7da8ff] font-sans block">الهدف الثاني:</span>
                      <span className="font-bold text-[#7da8ff]">${formatPrice(trade.tp2)}</span>
                    </div>
                  </div>

                  {/* Sizing Footer */}
                  <div className="flex flex-wrap items-center justify-between text-[11px] text-slate-400 font-mono mt-2 pt-1 border-t border-[#18233a]">
                    <span>حجم المركز: ${trade.positionSizeUsd.toFixed(2)} USDT</span>
                    <span>مبلغ المخاطرة: ${trade.riskAmountUsd.toFixed(2)} ({trade.riskPercent}%)</span>
                    <span>رأس المال: ${trade.capital.toFixed(0)}</span>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-[#1f2d47] flex justify-between items-center text-xs text-slate-400 bg-[#0f1626]">
          <span>إجمالي الصفقات: {trades.length}</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-[#18233a] hover:bg-[#1f2d47] text-white text-xs font-semibold transition-colors"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
};
