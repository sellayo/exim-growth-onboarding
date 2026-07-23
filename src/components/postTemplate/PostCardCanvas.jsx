import React, { useRef, useEffect } from 'react';
import { Download } from 'lucide-react';

export default function PostCardCanvas({ templateType, data, imageUrl, canvasRef: externalCanvasRef, onCanvasReady }) {
  const internalCanvasRef = useRef(null);
  const canvasRef = externalCanvasRef || internalCanvasRef;

  useEffect(() => {
    renderCanvas();
  }, [templateType, data, imageUrl]);

  const renderCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Canvas size: 800 x 800 (Square format for WhatsApp & Social preview)
    const W = 800;
    const H = 800;
    canvas.width = W;
    canvas.height = H;

    const drawAll = (loadedImg) => {
      // Clear canvas
      ctx.clearRect(0, 0, W, H);

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

      // Brand Logo Text: EXIM (Blue) GROWTH NETWORK (Orange)
      ctx.fillStyle = '#0B3FAD';
      ctx.font = '900 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('EXIM GROWTH', 55, 64);

      ctx.fillStyle = '#F57E13';
      ctx.font = '900 22px "Plus Jakarta Sans", sans-serif';
      ctx.fillText('NETWORK', 225, 64);

      // Template Type Badge
      let badgeText = 'BUY REQUIREMENT';
      let badgeColor = '#10B981';

      if (templateType === 'supplier') {
        badgeText = 'SELL OFFER / REQUEST';
        badgeColor = '#EF4444';
      } else if (templateType === 'logistics') {
        badgeText = 'LOGISTICS & SHIPPING';
        badgeColor = '#3B82F6';
      } else if (templateType === 'exim_service') {
        badgeText = 'EXIM SERVICE REQUEST';
        badgeColor = '#D97706';
      } else if (templateType === 'question') {
        badgeText = 'COMMUNITY QUESTION';
        badgeColor = '#8B5CF6';
      }

      ctx.fillStyle = badgeColor;
      roundRect(ctx, W - 250, 38, 200, 38, 12);
      ctx.fill();

      ctx.fillStyle = '#FFFFFF';
      ctx.font = '900 12px "Plus Jakarta Sans", sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(badgeText, W - 150, 62);
      ctx.textAlign = 'left';

      // 3. Image Display Box (Y: 105 to 345, Height 240)
      const imgX = 35;
      const imgY = 105;
      const imgW = W - 70;
      const imgH = 240;

      ctx.save();
      roundRect(ctx, imgX, imgY, imgW, imgH, 20);
      ctx.clip();

      // Draw dark background under image
      ctx.fillStyle = '#0F172A';
      ctx.fillRect(imgX, imgY, imgW, imgH);

      if (loadedImg && loadedImg.width > 0) {
        // Draw image scaled cover
        const scale = Math.max(imgW / loadedImg.width, imgH / loadedImg.height);
        const x = imgX + (imgW - loadedImg.width * scale) / 2;
        const y = imgY + (imgH - loadedImg.height * scale) / 2;
        ctx.drawImage(loadedImg, x, y, loadedImg.width * scale, loadedImg.height * scale);
      }
      ctx.restore(); // Always restore context after image clip!

      // 4. Specs Container Card Box & Bottom CTA
      renderTextOverlay(ctx, W, H);

      if (onCanvasReady) onCanvasReady(canvas);
    };

    const targetSrc = imageUrl || '/logo.png';
    const img = new Image();
    if (!targetSrc.startsWith('data:')) {
      img.crossOrigin = 'anonymous';
    }
    img.onload = () => drawAll(img);
    img.onerror = () => drawAll(null);
    img.src = targetSrc;
  };

  const renderTextOverlay = (ctx, W, H) => {
    // 4. Specs Container Card Box (Y: 358 to 720, Height 362)
    const boxX = 35;
    const boxY = 358;
    const boxW = W - 70; // 730px wide
    const boxH = 362;

    ctx.fillStyle = 'rgba(255, 255, 255, 0.98)';
    roundRect(ctx, boxX, boxY, boxW, boxH, 20);
    ctx.fill();

    // Dual Column Layout Setup
    const leftX = boxX + 22; // 57px
    const leftW = 330;
    const dividerX = boxX + 365; // 400px
    const rightX = boxX + 380; // 415px
    const rightW = 328;

    // Draw vertical dividing line between left and right columns
    ctx.strokeStyle = '#CBD5E1';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(dividerX, boxY + 20);
    ctx.lineTo(dividerX, boxY + boxH - 20);
    ctx.stroke();

    // --- LEFT COLUMN: POSTER & CONTACT DETAILS ---
    ctx.fillStyle = '#0F172A';
    ctx.font = '900 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText('👤 POSTER & CONTACT INFO', leftX, boxY + 30);

    const leftFields = [];
    
    let posterType = 'BUYER';
    if (templateType === 'supplier') posterType = 'SUPPLIER / SELLER';
    if (templateType === 'logistics') posterType = 'LOGISTICS REQUESTER';
    if (templateType === 'exim_service') posterType = 'SERVICE SEEKER';
    if (templateType === 'question') posterType = 'COMMUNITY MEMBER';

    leftFields.push({ label: 'POST TYPE', value: posterType, highlight: true });

    if (data.companyName) {
      leftFields.push({ label: 'COMPANY NAME', value: data.companyName, icon: '🏢' });
    }
    if (data.contactName) {
      leftFields.push({ label: 'CONTACT PERSON', value: data.contactName, icon: '👤' });
    }
    if (data.contactPhone) {
      leftFields.push({ label: 'PHONE / WHATSAPP', value: data.contactPhone, icon: '📞' });
    }
    if (data.contactEmail) {
      leftFields.push({ label: 'EMAIL ADDRESS', value: data.contactEmail, icon: '✉️' });
    }
    if (data.contactWebsite) {
      leftFields.push({ label: 'WEBSITE / SOCIAL LINK', value: data.contactWebsite, icon: '🌐' });
    }

    let leftY = boxY + 58;
    leftFields.forEach((field) => {
      ctx.fillStyle = '#64748B';
      ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(`${field.icon ? field.icon + ' ' : ''}${field.label}`, leftX, leftY);

      if (field.highlight) {
        ctx.fillStyle = templateType === 'buyer' ? '#059669' : (templateType === 'supplier' ? '#DC2626' : '#0B3FAD');
        ctx.font = '900 14px "Plus Jakarta Sans", sans-serif';
      } else {
        ctx.fillStyle = '#0F172A';
        ctx.font = '700 13px "Plus Jakarta Sans", sans-serif';
      }

      const nextY = wrapText(ctx, field.value, leftX, leftY + 16, leftW, 16, 2);
      leftY = Math.max(leftY + 46, nextY + 14);
    });

    // --- RIGHT COLUMN: DYNAMIC HEADER BASED ON TEMPLATE TYPE ---
    let rightColumnTitle = '📦 PRODUCT & TRADE SPECS';
    if (templateType === 'logistics') rightColumnTitle = '🚢 LOGISTICS & CARGO SPECS';
    if (templateType === 'exim_service') rightColumnTitle = '🛠️ SERVICE REQUEST DETAILS';
    if (templateType === 'question') rightColumnTitle = '💡 COMMUNITY QUESTION DETAILS';

    ctx.fillStyle = '#0F172A';
    ctx.font = '900 13px "Plus Jakarta Sans", sans-serif';
    ctx.fillText(rightColumnTitle, rightX, boxY + 30);

    let rightFields = [];
    if (templateType === 'buyer') {
      rightFields = [
        { label: 'PRODUCT REQUIRED', value: data.product || 'Not Specified' },
        ...(data.price ? [{ label: 'TARGET PRICE / RATE', value: data.price, isHighlight: true }] : []),
        { label: 'QUANTITY REQUIRED', value: data.quantity || 'Not Specified' },
        { label: 'DESTINATION PORT / COUNTRY', value: data.destination || 'Not Specified' },
        { label: 'TIMELINE', value: data.timeline || 'Immediate' },
        { label: 'QUALITY & REQUIREMENTS', value: data.requirements || 'Standard Grade', maxLines: 4 }
      ];
    } else if (templateType === 'supplier') {
      rightFields = [
        { label: 'PRODUCT OFFERED', value: data.product || 'Not Specified' },
        ...(data.price ? [{ label: 'OFFERING PRICE / RATE', value: data.price, isHighlight: true }] : []),
        { label: 'MOQ (MIN ORDER QTY)', value: data.moq || 'Flexible' },
        { label: 'ORIGIN / LOCATION', value: data.location || 'Not Specified' },
        { label: 'CERTIFICATIONS & GRADE', value: data.certifications || 'Export Certified', maxLines: 4 }
      ];
    } else if (templateType === 'logistics') {
      rightFields = [
        { label: 'CONTAINER & CARGO TYPE', value: data.container || 'FCL / LCL' },
        ...(data.product ? [{ label: 'PRODUCT / CARGO', value: data.product }] : []),
        { label: 'ORIGIN PORT / CITY', value: data.origin || 'Not Specified' },
        { label: 'DESTINATION PORT', value: data.destination || 'Not Specified' },
        { label: 'TIMELINE / VESSEL', value: data.timeline || 'Immediate' }
      ];
    } else if (templateType === 'exim_service') {
      rightFields = [
        { label: 'EXIM SERVICE REQUIRED', value: data.serviceType || 'EXIM Advisory' },
        { label: 'SERVICE REQUIREMENTS', value: data.serviceDetails || 'General Assistance', maxLines: 4 },
        { label: 'LOCATION / PORT', value: data.locationPort || 'Not Specified' },
        { label: 'TIMELINE', value: data.timeline || 'Immediate' }
      ];
    } else if (templateType === 'question') {
      rightFields = [
        { label: 'PROBLEM / TOPIC', value: data.problem || 'Trade Inquiry' },
        { label: 'BACKGROUND CONTEXT', value: data.context || 'Not Specified', maxLines: 3 },
        { label: 'SPECIFIC QUESTION', value: data.question || 'Advice requested', maxLines: 3 }
      ];
    }

    let rightY = boxY + 54;
    rightFields.forEach((field) => {
      ctx.fillStyle = '#64748B';
      ctx.font = '800 11px "Plus Jakarta Sans", sans-serif';
      ctx.fillText(field.label, rightX, rightY);

      if (field.isHighlight) {
        ctx.fillStyle = templateType === 'buyer' ? '#059669' : '#DC2626';
        ctx.font = '900 13.5px "Plus Jakarta Sans", sans-serif';
      } else {
        ctx.fillStyle = '#0F172A';
        ctx.font = '800 13px "Plus Jakarta Sans", sans-serif';
      }

      const maxL = field.maxLines || 2;
      const nextY = wrapText(ctx, field.value, rightX, rightY + 15, rightW, 15, maxL);
      rightY = Math.max(rightY + 40, nextY + 12);
    });

    // 5. Bottom CTA Footer Bar (Y: 732 to 776)
    ctx.fillStyle = '#041544';
    roundRect(ctx, 35, H - 58, W - 70, 44, 14);
    ctx.fill();

    ctx.fillStyle = '#F57E13';
    ctx.font = '900 14px "Plus Jakarta Sans", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('💬 DM for details | EXIM Growth Network', W / 2, H - 30);
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
      <div className="w-full max-w-[440px] rounded-3xl shadow-xl overflow-hidden border border-slate-200 bg-slate-950 p-1 mx-auto">
        <canvas ref={canvasRef} className="w-full h-auto rounded-2xl block" />
      </div>

      {/* Download Canvas Image Button */}
      <button
        type="button"
        onClick={handleDownload}
        className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-ocean-950 hover:bg-ocean-900 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md transition-all cursor-pointer border border-gold-500/30"
      >
        <Download className="w-4 h-4 text-gold-400" />
        <span>Download Banner Image (.PNG)</span>
      </button>
    </div>
  );
}

// Multi-line text wrapping helper to prevent canvas text truncation
function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines = 4) {
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
        // Truncate remaining only if maxLines exceeded
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

// Standard Canvas helper function for rounded rectangles with precise control points
function roundRect(ctx, x, y, width, height, radius) {
  if (typeof radius === 'number') {
    radius = { tl: radius, tr: radius, br: radius, bl: radius };
  } else {
    radius = { tl: 0, tr: 0, br: 0, bl: 0, ...radius };
  }
  ctx.beginPath();
  ctx.moveTo(x + radius.tl, y);
  ctx.lineTo(x + width - radius.tr, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius.tr);
  ctx.lineTo(x + width, y + height - radius.br);
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius.br, y + height);
  ctx.lineTo(x + radius.bl, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius.bl);
  ctx.lineTo(x, y + radius.tl);
  ctx.quadraticCurveTo(x, y, x + radius.tl, y);
  ctx.closePath();
}
