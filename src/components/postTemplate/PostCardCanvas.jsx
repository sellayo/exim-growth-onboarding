import React, { useRef, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function PostCardCanvas({ templateType, data, imageUrl }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    renderCanvas();
  }, [templateType, data, imageUrl]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Canvas size: 800 x 800 (Ideal square format for WhatsApp & Social preview)
    const W = 800;
    const H = 800;
    canvas.width = W;
    canvas.height = H;

    // 1. Background Fill (Deep Ocean Navy Gradient)
    const bgGrad = ctx.createLinearGradient(0, 0, W, H);
    bgGrad.addColorStop(0, '#041544');
    bgGrad.addColorStop(0.5, '#0A3FA6');
    bgGrad.addColorStop(1, '#062060');
    ctx.fillStyle = bgGrad;
    ctx.fillRect(0, 0, W, H);

    // Subtle background mesh grid accent
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < W; x += 40) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, H);
      ctx.stroke();
    }
    for (let y = 0; y < H; y += 40) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(W, y);
      ctx.stroke();
    }

    // 2. Top Header Brand Bar (Y: 25 to 90)
    ctx.fillStyle = 'rgba(255, 255, 255, 0.96)';
    roundRect(ctx, 35, 25, W - 70, 65, 18);
    ctx.fill();

    // Brand Logo Text
    ctx.fillStyle = '#041544';
    ctx.font = '900 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('EXIM', 55, 64);

    ctx.fillStyle = '#F57E13';
    ctx.font = '900 22px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('GROWTH NETWORK', 118, 64);

    // Template Type Badge
    let badgeText = 'BUYER REQUIREMENT';
    let badgeColor = '#F57E13';
    if (templateType === 'supplier') {
      badgeText = 'SUPPLIER OFFER / REQUEST';
      badgeColor = '#10B981';
    } else if (templateType === 'logistics') {
      badgeText = 'LOGISTICS & SHIPPING';
      badgeColor = '#3B82F6';
    } else if (templateType === 'question') {
      badgeText = 'COMMUNITY QUESTION';
      badgeColor = '#8B5CF6';
    }

    ctx.fillStyle = badgeColor;
    roundRect(ctx, W - 265, 40, 215, 34, 10);
    ctx.fill();

    ctx.fillStyle = '#FFFFFF';
    ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(badgeText, W - 157, 61);
    ctx.textAlign = 'left';

    // 3. Image Display Box (Y: 105 to 360, Height 255)
    const imgX = 35;
    const imgY = 105;
    const imgW = W - 70;
    const imgH = 255;

    ctx.save();
    roundRect(ctx, imgX, imgY, imgW, imgH, 20);
    ctx.clip();

    // Draw dark background under image
    ctx.fillStyle = '#0F172A';
    ctx.fillRect(imgX, imgY, imgW, imgH);

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      // Draw image scaled cover
      const scale = Math.max(imgW / img.width, imgH / img.height);
      const x = imgX + (imgW - img.width * scale) / 2;
      const y = imgY + (imgH - img.height * scale) / 2;
      ctx.drawImage(img, x, y, img.width * scale, img.height * scale);

      ctx.restore(); // Always restore context after image clip!
      renderTextOverlay(ctx, W, H);
    };
    img.onerror = () => {
      ctx.restore();
      renderTextOverlay(ctx, W, H);
    };
    img.src = imageUrl || '/logo.png';
  };

  const renderTextOverlay = (ctx, W, H) => {
    // 4. Specs Container Card Box (Y: 375 to 725, Height 350)
    const boxX = 35;
    const boxY = 375;
    const boxW = W - 70;
    const boxH = 350;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.97)';
    roundRect(ctx, boxX, boxY, boxW, boxH, 20);
    ctx.fill();

    // Fields Schema according to templateType
    let fields = [];
    if (templateType === 'buyer') {
      fields = [
        { label: 'PRODUCT NAME', value: data.product || 'Not Specified', icon: '📦' },
        { label: 'QUANTITY', value: data.quantity || 'Not Specified', icon: '⚖️' },
        { label: 'DESTINATION PORT / COUNTRY', value: data.destination || 'Not Specified', icon: '📍' },
        { label: 'TIMELINE & REQUIREMENTS', value: `${data.timeline || 'Immediate'} • ${data.requirements || 'Standard Quality'}`, icon: '⏱️' },
      ];
    } else if (templateType === 'supplier') {
      fields = [
        { label: 'PRODUCT NAME', value: data.product || 'Not Specified', icon: '📦' },
        { label: 'MOQ (MINIMUM ORDER QUANTITY)', value: data.moq || 'Flexible', icon: '🔢' },
        { label: 'LOCATION / ORIGIN', value: data.location || 'Not Specified', icon: '🏭' },
        { label: 'CERTIFICATIONS & COMPLIANCE', value: data.certifications || 'ISO / Export Grade', icon: '🏆' },
      ];
    } else if (templateType === 'logistics') {
      fields = [
        { label: 'ORIGIN LOCATION / PORT', value: data.origin || 'Not Specified', icon: '🛫' },
        { label: 'DESTINATION PORT', value: data.destination || 'Not Specified', icon: '🛬' },
        { label: 'CONTAINER & CARGO TYPE', value: data.container || 'FCL / LCL', icon: '🚢' },
        { label: 'TIMELINE & SHIPMENT', value: data.timeline || 'Immediate Shipping', icon: '⏱️' },
      ];
    } else if (templateType === 'question') {
      fields = [
        { label: 'PROBLEM / TRADE TOPIC', value: data.problem || 'Trade Inquiry', icon: '❓' },
        { label: 'BACKGROUND CONTEXT', value: data.context || 'Not Specified', icon: '📌' },
        { label: 'SPECIFIC QUESTION', value: data.question || 'Advice requested', icon: '💡' },
      ];
    }

    // Append contact details as a dedicated field if present
    if (data.contactPhone || data.contactEmail || data.contactWebsite) {
      const contactParts = [];
      if (data.contactPhone) contactParts.push(`Ph: ${data.contactPhone}`);
      if (data.contactEmail) contactParts.push(`Mail: ${data.contactEmail}`);
      if (data.contactWebsite) contactParts.push(`Web: ${data.contactWebsite}`);

      fields.push({
        label: 'DIRECT CONTACT DETAILS',
        value: contactParts.join('   •   '),
        icon: '📞'
      });
    }

    const fieldSpacing = fields.length > 4 ? 45 : 55;
    let yOffset = boxY + 25;

    fields.forEach((field) => {
      // Label
      ctx.fillStyle = '#64748B';
      ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${field.icon}  ${field.label}`, boxX + 22, yOffset);

      // Value (wrapped multi-line if long)
      ctx.fillStyle = field.label === 'DIRECT CONTACT DETAILS' ? '#0B3FAD' : '#0F172A';
      ctx.font = field.label === 'DIRECT CONTACT DETAILS' ? '800 13px "Plus Jakarta Sans", sans-serif' : '700 14px "Plus Jakarta Sans", sans-serif';
      
      const nextY = wrapText(ctx, field.value, boxX + 22, yOffset + 17, boxW - 44, 17, 2);
      yOffset = Math.max(yOffset + fieldSpacing, nextY + 15);
    });

    // 5. Bottom CTA Footer Bar (Y: 740 to 780)
    ctx.fillStyle = '#041544';
    roundRect(ctx, 35, H - 55, W - 70, 40, 14);
    ctx.fill();

    ctx.fillStyle = '#F57E13';
    ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💬 DM for more details | EXIM Growth Network', W / 2, H - 30);
    ctx.textAlign = 'left';
  };

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `EXIM_Trade_Post_${templateType}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  };

  return (
    <div className="flex flex-col items-center gap-3 w-full">
      {/* HTML5 Canvas Container (Fits 100% width on mobile) */}
      <div className="w-full max-w-[420px] rounded-3xl shadow-xl overflow-hidden border border-slate-200 bg-slate-950 p-1 mx-auto">
        <canvas ref={canvasRef} className="w-full h-auto rounded-2xl block" />
      </div>

      {/* Download Canvas Image Button */}
      <button
        type="button"
        onClick={handleDownload}
        className="w-full sm:w-auto px-6 py-3 rounded-xl bg-ocean-950 hover:bg-ocean-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-gold-500/30"
      >
        <Download className="w-4 h-4 text-gold-400" />
        <span>Download Banner Image (.PNG)</span>
      </button>
    </div>
  );
}

// Multi-line text wrapping helper to prevent canvas text overflow
function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 2) {
  const words = (text || '').split(' ');
  let line = '';
  let currentY = y;
  let linesCount = 0;

  for (let n = 0; n < words.length; n++) {
    const testLine = line + words[n] + ' ';
    const metrics = ctx.measureText(testLine);
    const testWidth = metrics.width;
    if (testWidth > maxWidth && n > 0) {
      ctx.fillText(line, x, currentY);
      line = words[n] + ' ';
      currentY += lineHeight;
      linesCount++;
      if (linesCount >= maxLines - 1) {
        // Truncate remaining
        let remaining = words.slice(n).join(' ');
        while (ctx.measureText(remaining + '...').width > maxWidth && remaining.length > 0) {
          remaining = remaining.slice(0, -1);
        }
        ctx.fillText(remaining + '...', x, currentY);
        return currentY;
      }
    } else {
      line = testLine;
    }
  }
  ctx.fillText(line, x, currentY);
  return currentY;
}

// Canvas helper function for rounded rectangles
function roundRect(ctx, x, y, width, height, radius) {
  ctx.beginPath();
  ctx.moveTo(x + radius, y);
  ctx.lineTo(x + width - radius, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
  ctx.lineTo(x + width, y + height - radius);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  ctx.lineTo(x + radius, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
  ctx.lineTo(x, y + radius);
  ctx.quadraticCurveTo(x, y, x + radius, y);
  ctx.closePath();
}
