interface ShareVerseImageInput {
  text: string;
  reference: string;
  translation: string;
}

export const createShareVerseImage = async ({ text, reference, translation }: ShareVerseImageInput): Promise<Blob | null> => {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1080;
  const ctx = canvas.getContext('2d');

  if (!ctx) return null;

  ctx.fillStyle = '#FAFAF7';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = '#8B6F47';
  ctx.lineWidth = 10;
  ctx.strokeRect(50, 50, canvas.width - 100, canvas.height - 100);
  ctx.fillStyle = '#2C2416';
  ctx.textAlign = 'center';
  ctx.font = 'italic 56px "Lora", serif';

  const words = `« ${text} »`.split(' ');
  let line = '';
  let y = 300;
  const maxWidth = 800;

  words.forEach((word, index) => {
    const testLine = `${line}${word} `;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && index > 0) {
      ctx.fillText(line, canvas.width / 2, y);
      line = `${word} `;
      y += 80;
    } else {
      line = testLine;
    }
  });
  ctx.fillText(line, canvas.width / 2, y);

  ctx.font = 'bold 40px "Playfair Display", serif';
  ctx.fillStyle = '#8B6F47';
  ctx.fillText(reference, canvas.width / 2, y + 150);

  ctx.font = '30px "Inter", sans-serif';
  ctx.fillStyle = '#A89880';
  ctx.fillText(translation.toUpperCase(), canvas.width / 2, y + 220);

  ctx.font = '30px "Inter", sans-serif';
  ctx.fillStyle = '#C9A84C';
  ctx.fillText('✦ Omed Scripture', canvas.width / 2, canvas.height - 150);

  return new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, 'image/png'));
};
