import { CheckInStatus } from '../types';

interface WatermarkOptions {
  campaignName: string;
  teamName: string;
  pointName: string;
  dateStr: string;
  lat: number;
  lng: number;
  status: CheckInStatus;
}

/**
 * Aplica uma marca d'água oficial de auditoria eleitoral na imagem capturada pela câmera
 */
export async function generateWatermarkedImage(
  imageFileOrBase64: File | string,
  options: WatermarkOptions
): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Não foi possível obter contexto 2D do canvas'));
        return;
      }

      // Redimensiona mantendo proporção para máximo 1280px de largura/altura
      const maxDim = 1280;
      let width = img.width;
      let height = img.height;

      if (width > maxDim || height > maxDim) {
        if (width > height) {
          height = Math.round((height * maxDim) / width);
          width = maxDim;
        } else {
          width = Math.round((width * maxDim) / height);
          height = maxDim;
        }
      }

      canvas.width = width;
      canvas.height = height;

      // Desenha imagem original
      ctx.drawImage(img, 0, 0, width, height);

      // Desenha faixa de cabeçalho da marca d'água (rodape escuro)
      const overlayHeight = Math.max(120, height * 0.18);
      const gradient = ctx.createLinearGradient(0, height - overlayHeight, 0, height);
      gradient.addColorStop(0, 'rgba(15, 23, 42, 0.85)');
      gradient.addColorStop(1, 'rgba(2, 6, 23, 0.98)');

      ctx.fillStyle = gradient;
      ctx.fillRect(0, height - overlayHeight, width, overlayHeight);

      // Linha separadora de destaque
      const badgeColor = getStatusColorHex(options.status);
      ctx.fillStyle = badgeColor;
      ctx.fillRect(0, height - overlayHeight, width, 4);

      // Configuração de texto
      const fontSize = Math.max(14, Math.round(width * 0.022));
      ctx.fillStyle = '#ffffff';
      ctx.font = `600 ${fontSize}px Inter, sans-serif`;

      const paddingLeft = Math.round(width * 0.04);
      let currentY = height - overlayHeight + fontSize + 16;

      // Linha 1: Campanha e Equipe
      ctx.fillText(`CAMPAÑA: ${options.campaignName.toUpperCase()} | EQUIPE: ${options.teamName}`, paddingLeft, currentY);

      // Linha 2: Ponto de Atuação
      currentY += fontSize + 8;
      ctx.fillStyle = '#cbd5e1';
      ctx.font = `400 ${fontSize - 2}px Inter, sans-serif`;
      ctx.fillText(`PONTO: ${options.pointName}`, paddingLeft, currentY);

      // Linha 3: Data, Hora e Coordenadas
      currentY += fontSize + 6;
      ctx.fillText(`DATA: ${options.dateStr} | GPS: ${options.lat.toFixed(6)}, ${options.lng.toFixed(6)}`, paddingLeft, currentY);

      // Badge de Status (canto direito inferior)
      const badgeText = `STATUS: ${options.status.toUpperCase()}`;
      ctx.font = `700 ${fontSize}px Inter, sans-serif`;
      const badgeWidth = ctx.measureText(badgeText).width + 24;
      const badgeHeight = fontSize + 12;
      const badgeX = width - badgeWidth - paddingLeft;
      const badgeY = height - overlayHeight + 16;

      // Fundo do Badge
      ctx.fillStyle = badgeColor;
      ctx.roundRect ? ctx.roundRect(badgeX, badgeY, badgeWidth, badgeHeight, 6) : ctx.fillRect(badgeX, badgeY, badgeWidth, badgeHeight);
      ctx.fill();

      // Texto do Badge
      ctx.fillStyle = '#ffffff';
      ctx.fillText(badgeText, badgeX + 12, badgeY + fontSize + 2);

      // Retorna em Base64 JPEG comprimido 0.85
      resolve(canvas.toDataURL('image/jpeg', 0.85));
    };

    img.onerror = () => reject(new Error('Erro ao carregar imagem para marca d\'água'));

    if (typeof imageFileOrBase64 === 'string') {
      img.src = imageFileOrBase64;
    } else {
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result) img.src = e.target.result as string;
      };
      reader.readAsDataURL(imageFileOrBase64);
    }
  });
}

function getStatusColorHex(status: CheckInStatus): string {
  switch (status) {
    case 'validado':
      return '#10b981'; // Emerald 500
    case 'pendente_analise':
      return '#f59e0b'; // Amber 500
    case 'rejeitado':
      return '#f43f5e'; // Rose 500
    case 'pendente_sync':
      return '#6366f1'; // Indigo 500
    default:
      return '#64748b';
  }
}
