import { CalculatorResult, CalculatorState, CrossoverMoveInfo } from '../types';

export function formatTelegramSignal(
  input: CalculatorState,
  result: CalculatorResult,
  additionalInfo?: {
    bankerDominance?: number;
    mfi?: number;
    volumeBurst?: number;
    confluencePercent?: number;
    verdictText?: string;
    regime?: string;
    crossoverMove?: CrossoverMoveInfo;
  }
): string {
  const isLong = input.direction === 'LONG';
  const dirEmoji = isLong ? '🟢 LONG (شراء)' : '🔴 SHORT (بيع)';
  const arrow = isLong ? '↗️' : '↘️';

  const cairoTime = new Intl.DateTimeFormat('en-GB', {
    timeZone: 'Africa/Cairo',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  }).format(new Date());

  const cairoDate = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Africa/Cairo',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());

  const formatPrice = (p: number) => {
    if (p < 0.0001) return p.toFixed(7);
    if (p < 0.01) return p.toFixed(5);
    if (p < 1) return p.toFixed(4);
    if (p < 50) return p.toFixed(3);
    return p.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  };

  const formatPointsMove = (pts: number) => {
    const sign = pts >= 0 ? '+' : '';
    const abs = Math.abs(pts);
    const formatted =
      abs < 0.0001
        ? pts.toFixed(7)
        : abs < 0.01
        ? pts.toFixed(5)
        : abs < 1
        ? pts.toFixed(4)
        : abs < 50
        ? pts.toFixed(3)
        : pts.toFixed(2);
    return `${sign}${formatted}$`;
  };

  const lines = [
    `⚡ <b>SOSSKA1 Institutional Opportunity Lab</b>`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `🎯 <b>الأصل:</b> <code>${input.symbol}</code> | ${dirEmoji} ${arrow}`,
    `⏱ <b>التوقيت (Cairo):</b> <code>${cairoDate} ${cairoTime}</code>`,
  ];

  if (additionalInfo?.confluencePercent !== undefined) {
    lines.push(
      `📊 <b>نسبة التوافق مع التحليل:</b> <code>${additionalInfo.confluencePercent}%</code>`
    );
  }
  if (additionalInfo?.verdictText) {
    lines.push(`🚦 <b>قرار الدخول:</b> <b>${additionalInfo.verdictText}</b>`);
  }
  if (additionalInfo?.crossoverMove) {
    const cm = additionalInfo.crossoverMove;
    lines.push(
      `📏 <b>الحركة منذ التقاطع:</b> <code>${formatPointsMove(cm.pointsMove)} (${cm.pctMove >= 0 ? '+' : ''}${cm.pctMove.toFixed(2)}%) | ${cm.atrMove.toFixed(2)} ATR (منذ ${cm.barsAgo} شمعة)</code> — <b>${cm.entryStatusText}</b>`
    );
  }

  lines.push(
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `📥 <b>نقطة الدخول (Entry):</b> <code>${formatPrice(result.entryPrice)} USDT</code>`,
    `🛑 <b>وقف الخسارة (SL):</b> <code>${formatPrice(result.sl)} USDT</code> (1.8× ATR) [${result.slDistancePercent.toFixed(2)}%]`,
    `🎯 <b>الهدف الأول (TP1):</b> <code>${formatPrice(result.tp1)} USDT</code> (2.5× ATR) [${result.tp1DistancePercent.toFixed(2)}%] <i>R:R 1:${result.rrTp1.toFixed(2)}</i>`,
    `🚀 <b>الهدف الثاني (TP2):</b> <code>${formatPrice(result.tp2)} USDT</code> (5.0× ATR) [${result.tp2DistancePercent.toFixed(2)}%] <i>R:R 1:${result.rrTp2.toFixed(2)}</i>`,
    `━━━━━━━━━━━━━━━━━━━━━━━━━`,
    `💼 <b>حجم المركز المقترح:</b> <code>$${result.positionSizeUsd.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} USDT</code> (${result.positionSizeUnits.toFixed(4)} Units)`,
    `🛡 <b>مبلغ المخاطرة:</b> <code>$${result.riskAmountUsd.toFixed(2)} USDT</code> (${input.riskPercent}% من رأس المال)`,
    `📐 <b>مؤشر التقلب ATR(14):</b> <code>${formatPrice(input.atr)}</code>`
  );

  if (additionalInfo?.bankerDominance !== undefined || additionalInfo?.mfi !== undefined) {
    lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
    if (additionalInfo.bankerDominance !== undefined) {
      lines.push(
        `🏦 <b>تدفق السيولة المؤسسية (MCDX+):</b> <code>${additionalInfo.bankerDominance.toFixed(1)}% Banker Flow</code>`
      );
    }
    if (additionalInfo.mfi !== undefined) {
      const mfiDesc =
        additionalInfo.mfi < 25
          ? 'تجميع حيتان (Oversold)'
          : additionalInfo.mfi > 75
          ? 'تصريف مؤسسات (Overbought)'
          : 'منطقة محايدة';
      lines.push(`🌊 <b>مؤشر تدفق الأموال (MFI):</b> <code>${additionalInfo.mfi.toFixed(1)}</code> [${mfiDesc}]`);
    }
    if (additionalInfo.volumeBurst !== undefined) {
      lines.push(`⚡ <b>انفجار الفوليوم:</b> <code>${additionalInfo.volumeBurst.toFixed(1)}x Volume Burst</code>`);
    }
  }

  lines.push(`━━━━━━━━━━━━━━━━━━━━━━━━━`);
  lines.push(`🔒 <i>إدارة رأس المال الصارمة هي سر استمرار المحترفين في الأسواق.</i>`);

  return lines.join('\n');
}
