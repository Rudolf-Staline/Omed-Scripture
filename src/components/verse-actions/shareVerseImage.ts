export type VerseImageStyle = 'minimal' | 'parchment' | 'dark' | 'sunrise' | 'plain';

interface ShareVerseImageInput {
  text: string;
  reference: string;
  translation: string;
  style?: VerseImageStyle;
}

const styles: Record<VerseImageStyle, { bg: string; text: string; accent: string; muted: string; border: string }> = {
  minimal: { bg: '#FAFAF7', text: '#2C2416', accent: '#8B6F47', muted: '#A89880', border: '#E7DFD1' },
  parchment: { bg: '#F3E4C8', text: '#332615', accent: '#8B5E34', muted: '#856B4F', border: '#B98C52' },
  dark: { bg: '#171717', text: '#F8F3EA', accent: '#D6B35A', muted: '#B8AD9E', border: '#3A3228' },
  sunrise: { bg: '#FFF0DF', text: '#3A241F', accent: '#D97445', muted: '#9B6B5A', border: '#F2C6A8' },
  plain: { bg: '#FFFFFF', text: '#171717', accent: '#171717', muted: '#525252', border: '#FFFFFF' },
};

export const createShareVerseImage = async ({ text, reference, translation, style = 'minimal' }: ShareVerseImageInput): Promise<Blob | null> => {
  const palette = styles[style] ?? styles.minimal;
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');
  if (!ctx) return null;

  ctx.fillStyle = palette.bg;
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  if (style !== 'plain') {
    ctx.strokeStyle = palette.border;
    ctx.lineWidth = style === 'parchment' ? 14 : 8;
    ctx.strokeRect(54, 54, canvas.width - 108, canvas.height - 108);
  }

  ctx.fillStyle = palette.text;
  ctx.textAlign = 'center';
  ctx.font = style === 'plain' ? '50px "Inter", sans-serif' : 'italic 56px "Lora", serif';
  const words = `« ${text} »`.split(' ');
  let line = '';
  let y = 280;
  const maxWidth = 820;
  words.forEach((word, index) => {
    const testLine = `${line}${word} `;
    if (ctx.measureText(testLine).width > maxWidth && index > 0) {
      ctx.fillText(line, canvas.width / 2, y);
      line = `${word} `;
      y += 78;
    } else line = testLine;
  });
  ctx.fillText(line, canvas.width / 2, y);

  ctx.font = 'bold 40px "Inter", sans-serif';
  ctx.fillStyle = palette.accent;
  ctx.fillText(reference, canvas.width / 2, y + 150);
  ctx.font = '30px "Inter", sans-serif';
  ctx.fillStyle = palette.muted;
  ctx.fillText(translation.toUpperCase(), canvas.width / 2, y + 220);
  ctx.fillStyle = palette.accent;
  ctx.fillText('✦ Omed Scripture', canvas.width / 2, canvas.height - 150);

  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
};
