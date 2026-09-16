import { CheckInStatus } from '../types';

export interface StructuredAddress {
  road: string;
  neighborhood: string;
  cityState: string;
  postalCode: string;
  country: string;
}

export interface WatermarkOptions {
  campaignName?: string;
  baseName?: string;
  agentName?: string;
  coordinatorName?: string;
  teamName?: string;
  pointName?: string;
  pointAddress?: string;
  dateStr?: string;
  lat: number;
  lng: number;
  status?: CheckInStatus;
  accuracy?: number;
}

/**
 * Tenta obter endereço reverso estruturado via OpenStreetMap Nominatim com timeout e fallback local
 */
export async function getReverseGeocodedAddress(
  lat: number,
  lng: number,
  fallbackAddress?: string
): Promise<StructuredAddress> {
  // Endereço padrão de fallback baseado em Manaus / Ponto
  const defaultAddress: StructuredAddress = {
    road: fallbackAddress || 'Avenida Ephigênio Salles, 530',
    neighborhood: 'Prq 10 de Novembro',
    cityState: 'Manaus AM',
    postalCode: '69055-736',
    country: 'Brasil'
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2800);

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&addressdetails=1`,
      {
        signal: controller.signal,
        headers: { 'Accept-Language': 'pt-BR,pt;q=0.9' }
      }
    );
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.address) {
        const addr = data.address;
        const road = addr.road || addr.pedestrian || addr.street || addr.footway || fallbackAddress || 'Avenida Principal';
        const houseNumber = addr.house_number ? `, ${addr.house_number}` : '';
        const neighborhood = addr.suburb || addr.neighbourhood || addr.quarter || addr.residential || 'Centro';
        const city = addr.city || addr.town || addr.municipality || 'Manaus';
        const stateRaw = addr.state || 'AM';
        const state = stateRaw.toLowerCase().includes('amazonas') ? 'AM' : stateRaw;
        const postalCode = addr.postcode || '69055-736';
        const country = addr.country || 'Brasil';

        return {
          road: `${road}${houseNumber}`,
          neighborhood,
          cityState: `${city} ${state}`,
          postalCode,
          country
        };
      }
    }
  } catch (err) {
    // Falha silenciosa ou offline, usa fallback
  }

  // Se o fallbackAddress foi fornecido e tem vírgulas, tenta desmembrar
  if (fallbackAddress && fallbackAddress.includes(',')) {
    const parts = fallbackAddress.split(',').map((s) => s.trim());
    if (parts.length >= 2) {
      return {
        road: parts[0] + (parts[1] ? `, ${parts[1]}` : ''),
        neighborhood: parts[2] || defaultAddress.neighborhood,
        cityState: defaultAddress.cityState,
        postalCode: defaultAddress.postalCode,
        country: defaultAddress.country
      };
    }
  }

  return defaultAddress;
}

/**
 * Renderiza o mini mapa de evidência com visual satélite/dark e pin estilizado 100% vetorial no Canvas
 * (Garante 0% de risco de CORS/SecurityError e funciona instantaneamente tanto online quanto offline)
 */
function createVectorMapSnapshot(
  lat: number,
  lng: number,
  width: number,
  height: number
): HTMLCanvasElement {
  const mapCanvas = document.createElement('canvas');
  mapCanvas.width = width;
  mapCanvas.height = height;
  const mctx = mapCanvas.getContext('2d');
  if (!mctx) return mapCanvas;

  // 1. Fundo do Mapa (Estilo Apple Maps / Carto Dark Satellite)
  const bgGrad = mctx.createLinearGradient(0, 0, width, height);
  bgGrad.addColorStop(0, '#1a2332');
  bgGrad.addColorStop(1, '#0f172a');
  mctx.fillStyle = bgGrad;
  mctx.fillRect(0, 0, width, height);

  // 2. Blocos urbanos / Quadras residenciais
  mctx.fillStyle = 'rgba(30, 41, 59, 0.7)';
  mctx.fillRect(width * 0.08, height * 0.08, width * 0.35, height * 0.35);
  mctx.fillRect(width * 0.55, height * 0.08, width * 0.37, height * 0.28);
  mctx.fillRect(width * 0.08, height * 0.55, width * 0.38, height * 0.37);
  mctx.fillRect(width * 0.55, height * 0.48, width * 0.37, height * 0.44);

  // 3. Área verde / Parque (detalhe cartográfico)
  mctx.fillStyle = 'rgba(16, 185, 129, 0.15)';
  mctx.beginPath();
  mctx.roundRect ? mctx.roundRect(width * 0.6, height * 0.52, width * 0.28, height * 0.35, 6) : mctx.fillRect(width * 0.6, height * 0.52, width * 0.28, height * 0.35);
  mctx.fill();

  // 4. Malha viária e Avenidas principais
  // Avenidas largas (cor de destaque sutil)
  mctx.strokeStyle = '#334155';
  mctx.lineWidth = Math.max(5, width * 0.05);
  mctx.lineCap = 'round';
  mctx.beginPath();
  mctx.moveTo(0, height * 0.46);
  mctx.lineTo(width, height * 0.42);
  mctx.moveTo(width * 0.48, 0);
  mctx.lineTo(width * 0.46, height);
  mctx.stroke();

  // Ruas secundárias
  mctx.strokeStyle = '#475569';
  mctx.lineWidth = Math.max(2.5, width * 0.025);
  mctx.beginPath();
  mctx.moveTo(0, height * 0.18);
  mctx.lineTo(width * 0.48, height * 0.18);
  mctx.moveTo(width * 0.48, height * 0.78);
  mctx.lineTo(width, height * 0.78);
  mctx.moveTo(width * 0.22, height * 0.46);
  mctx.lineTo(width * 0.22, height);
  mctx.moveTo(width * 0.76, 0);
  mctx.lineTo(width * 0.76, height * 0.42);
  mctx.stroke();

  // Rota curvada de destaque (estilo GPS)
  mctx.strokeStyle = 'rgba(59, 130, 246, 0.4)';
  mctx.lineWidth = Math.max(3, width * 0.03);
  mctx.beginPath();
  mctx.moveTo(width * 0.05, height * 0.46);
  mctx.lineTo(width * 0.48, height * 0.44);
  mctx.lineTo(width * 0.47, height * 0.95);
  mctx.stroke();

  // 5. Marca d'água "Mapas" no canto inferior esquerdo
  mctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
  mctx.font = `bold ${Math.max(8, Math.round(width * 0.07))}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
  mctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
  mctx.shadowBlur = 3;
  mctx.fillText(' Mapas', 8, height - 8);
  mctx.shadowBlur = 0;

  // 6. Pin de Localização Centralizado (Círculo azul vibrante com anel concêntrico e ponto branco)
  const pinCenterX = width / 2;
  const pinCenterY = height / 2;

  // Halo / Anel externo de precisão pulsante
  mctx.fillStyle = 'rgba(59, 130, 246, 0.28)';
  mctx.beginPath();
  mctx.arc(pinCenterX, pinCenterY, width * 0.13, 0, 2 * Math.PI);
  mctx.fill();

  // Círculo principal azul GPS
  mctx.fillStyle = '#2563eb';
  mctx.beginPath();
  mctx.arc(pinCenterX, pinCenterY, width * 0.065, 0, 2 * Math.PI);
  mctx.fill();

  // Borda branca do pin
  mctx.strokeStyle = '#ffffff';
  mctx.lineWidth = Math.max(2, width * 0.02);
  mctx.stroke();

  // Ponto central branco
  mctx.fillStyle = '#ffffff';
  mctx.beginPath();
  mctx.arc(pinCenterX, pinCenterY, width * 0.022, 0, 2 * Math.PI);
  mctx.fill();

  return mapCanvas;
}

/**
 * Busca tiles reais do mapa baseados na coordenada e renderiza no canvas.
 * Se houver falha (offline ou erro de CORS), cai no fallback do mapa vetorial simulado.
 */
async function createRealMapSnapshot(
  lat: number,
  lng: number,
  width: number,
  height: number
): Promise<HTMLCanvasElement> {
  const mapCanvas = document.createElement('canvas');
  mapCanvas.width = width;
  mapCanvas.height = height;
  const mctx = mapCanvas.getContext('2d');
  if (!mctx) return mapCanvas;

  try {
    const zoom = 15;
    const tileSize = 256;
    const x = ((lng + 180) / 360) * Math.pow(2, zoom);
    const y = ((1 - Math.log(Math.tan((lat * Math.PI) / 180) + 1 / Math.cos((lat * Math.PI) / 180)) / Math.PI) / 2) * Math.pow(2, zoom);
    
    const tileX = Math.floor(x);
    const tileY = Math.floor(y);
    const pixelX = Math.floor((x - tileX) * tileSize);
    const pixelY = Math.floor((y - tileY) * tileSize);

    const startX = width / 2 - pixelX;
    const startY = height / 2 - pixelY;

    // Fundo escuro
    mctx.fillStyle = '#0f172a';
    mctx.fillRect(0, 0, width, height);

    const promises = [];
    for (let dx = -1; dx <= 1; dx++) {
      for (let dy = -1; dy <= 1; dy++) {
        // Usa Carto Dark para combinar com o estilo do app
        const url = `https://a.basemaps.cartocdn.com/dark_all/${zoom}/${tileX + dx}/${tileY + dy}.png`;
        promises.push(
          new Promise<{img: HTMLImageElement, dx: number, dy: number} | null>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => resolve({ img, dx, dy });
            img.onerror = () => resolve(null);
            img.src = url;
          })
        );
      }
    }

    const tiles = await Promise.all(promises);
    let loadedTiles = 0;
    for (const t of tiles) {
      if (t) {
        mctx.drawImage(t.img, startX + t.dx * tileSize, startY + t.dy * tileSize, tileSize, tileSize);
        loadedTiles++;
      }
    }

    // Se falhou ao carregar os tiles (ex: offline), dispara erro para usar fallback
    if (loadedTiles === 0) throw new Error('Falha ao carregar tiles');

    // Marca d'água "Mapas" no canto inferior esquerdo
    mctx.fillStyle = 'rgba(255, 255, 255, 0.75)';
    mctx.font = `bold ${Math.max(8, Math.round(width * 0.07))}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif`;
    mctx.shadowColor = 'rgba(0, 0, 0, 0.9)';
    mctx.shadowBlur = 3;
    mctx.fillText('RealMap', 8, height - 8);
    mctx.shadowBlur = 0;

    // Pin de Localização Centralizado
    const pinCenterX = width / 2;
    const pinCenterY = height / 2;

    mctx.fillStyle = 'rgba(59, 130, 246, 0.28)';
    mctx.beginPath();
    mctx.arc(pinCenterX, pinCenterY, width * 0.13, 0, 2 * Math.PI);
    mctx.fill();

    mctx.fillStyle = '#2563eb';
    mctx.beginPath();
    mctx.arc(pinCenterX, pinCenterY, width * 0.065, 0, 2 * Math.PI);
    mctx.fill();

    mctx.strokeStyle = '#ffffff';
    mctx.lineWidth = Math.max(2, width * 0.02);
    mctx.stroke();

    mctx.fillStyle = '#ffffff';
    mctx.beginPath();
    mctx.arc(pinCenterX, pinCenterY, width * 0.022, 0, 2 * Math.PI);
    mctx.fill();

    return mapCanvas;
  } catch (err) {
    // Fallback para o mapa vetorial simulado se offline ou bloqueado
    return createVectorMapSnapshot(lat, lng, width, height);
  }
}

/**
 * Formata data em formato pt-BR por extenso curto: Ex: 14 de set. de 2026, 08:38:58
 */
function formatTimestampLong(date: Date): string {
  const months = ['jan.', 'fev.', 'mar.', 'abr.', 'mai.', 'jun.', 'jul.', 'ago.', 'set.', 'out.', 'nov.', 'dez.'];
  const day = String(date.getDate()).padStart(2, '0');
  const monthStr = months[date.getMonth()];
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${day} de ${monthStr} de ${year}, ${hours}:${minutes}:${seconds}`;
}

export function getBaseNameFromTeam(teamName?: string, regionName?: string): string {
  if (regionName && regionName.trim().length > 0) return regionName;
  if (!teamName) return 'CENTRAL';

  const lower = teamName.toLowerCase();
  if (lower.includes('c-') || lower.includes('central')) return 'CENTRAL';
  if (lower.includes('co-') || lower.includes('centro-oeste')) return 'CENTRO-OESTE';
  if (lower.includes('cs1-') || lower.includes('centro-sul 1')) return 'CENTRO-SUL 1';
  if (lower.includes('cs2-') || lower.includes('centro-sul 2')) return 'CENTRO-SUL 2';
  if (lower.includes('l1-') || lower.includes('leste 1')) return 'LESTE 1';
  if (lower.includes('l2-') || lower.includes('leste 2')) return 'LESTE 2';
  if (lower.includes('n1-') || lower.includes('norte 1')) return 'NORTE 1';
  if (lower.includes('n2-') || lower.includes('norte 2')) return 'NORTE 2';
  if (lower.includes('o-') || lower.includes('oeste')) return 'OESTE';
  if (lower.includes('s-') || lower.includes('sul')) return 'SUL';
  if (lower.includes('r-') || lower.includes('rural')) return 'RURAL';

  return 'CENTRAL';
}

/**
 * Aplica a marca d'água georreferenciada de evidência com mini mapa no canto superior esquerdo
 * e metadados com endereço completo no canto superior direito.
 */
export async function generateWatermarkedImage(
  imageFileOrBase64: File | string,
  options: WatermarkOptions
): Promise<string> {
  // Busca dados de endereço geocodificado
  const addressInfo = await getReverseGeocodedAddress(options.lat, options.lng, options.pointAddress);

  return new Promise((resolve, reject) => {
    const img = new Image();

    img.onload = async () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Não foi possível obter contexto 2D do canvas'));
        return;
      }

      // Redimensiona para resolução ideal de evidência (máx 1440px)
      const maxDim = 1440;
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

      // 1. Desenha a foto capturada
      ctx.drawImage(img, 0, 0, width, height);

      // 2. Prepara tamanhos relativos
      const basePadding = Math.max(16, Math.round(width * 0.025));
      const fontSize = Math.max(13, Math.round(width * 0.022));
      const lineHeight = fontSize * 1.35;

      // Data e hora
      const dateStr = options.dateStr || formatTimestampLong(new Date());

      // Coordenadas
      const coordsStr = `GPS: ${options.lat.toFixed(6)}, ${options.lng.toFixed(6)}`;

      // Metadados estruturados de Base e Agente conforme o sistema
      const baseText = options.baseName ? `BASE: ${options.baseName.toUpperCase()}` : null;
      const agentText = options.agentName ? `AGENTE: ${options.agentName}` : (options.coordinatorName ? `COORD: ${options.coordinatorName}` : null);
      const teamText = options.teamName ? `EQUIPE: ${options.teamName}` : null;

      const metaLines: string[] = [];
      if (baseText) metaLines.push(baseText);
      if (agentText) metaLines.push(agentText);
      if (teamText) metaLines.push(teamText);
      metaLines.push(dateStr);
      metaLines.push(coordsStr);
      metaLines.push(addressInfo.road);
      metaLines.push(`${addressInfo.neighborhood}, ${addressInfo.cityState}`);
      if (addressInfo.postalCode) metaLines.push(addressInfo.postalCode);
      metaLines.push(addressInfo.country);

      // ==========================================
      // CANTO SUPERIOR ESQUERDO: MINI MAPA COM PIN
      // ==========================================
      const mapSize = Math.max(110, Math.round(width * 0.16));
      const mapX = basePadding;
      const mapY = basePadding;

      try {
        const mapCanvas = await createRealMapSnapshot(options.lat, options.lng, mapSize, mapSize);

        ctx.save();
        // Sombra do mapa
        ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
        ctx.shadowBlur = 12;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 4;

        // Borda e corte com cantos arredondados
        const mapRadius = 14;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(mapX, mapY, mapSize, mapSize, mapRadius);
        } else {
          ctx.rect(mapX, mapY, mapSize, mapSize);
        }
        ctx.clip();
        ctx.drawImage(mapCanvas, mapX, mapY, mapSize, mapSize);
        ctx.restore();

        // Contorno fino sutil do mapa
        ctx.save();
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        if (ctx.roundRect) {
          ctx.roundRect(mapX, mapY, mapSize, mapSize, mapRadius);
        } else {
          ctx.rect(mapX, mapY, mapSize, mapSize);
        }
        ctx.stroke();
        ctx.restore();
      } catch (err) {
        console.error('Erro ao renderizar mini mapa no canvas:', err);
      }

      // ====================================================
      // CANTO SUPERIOR DIREITO: METADADOS EM BOX TRANSLÚCIDO
      // ====================================================
      ctx.font = `400 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`;

      // Calcula a largura máxima do texto
      let maxTextWidth = 0;
      for (const line of metaLines) {
        const w = ctx.measureText(line).width;
        if (w > maxTextWidth) maxTextWidth = w;
      }

      const boxPaddingX = 14;
      const boxPaddingY = 12;
      const boxWidth = maxTextWidth + boxPaddingX * 2;
      const boxHeight = metaLines.length * lineHeight + boxPaddingY * 2;
      const boxX = width - boxWidth - basePadding;
      const boxY = basePadding;

      // Desenha caixa semitransparente escurecida com cantos arredondados
      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.42)';
      ctx.beginPath();
      if (ctx.roundRect) {
        ctx.roundRect(boxX, boxY, boxWidth, boxHeight, 10);
      } else {
        ctx.fillRect(boxX, boxY, boxWidth, boxHeight);
      }
      ctx.fill();
      ctx.restore();

      // Renderiza cada linha de texto alinhada à direita ou início do box
      ctx.save();
      ctx.fillStyle = '#ffffff';
      ctx.font = `400 ${fontSize}px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif`;
      ctx.textAlign = 'right';
      ctx.shadowColor = 'rgba(0, 0, 0, 0.75)';
      ctx.shadowBlur = 3;
      ctx.shadowOffsetX = 1;
      ctx.shadowOffsetY = 1;

      const textRightX = boxX + boxWidth - boxPaddingX;
      let textCurrentY = boxY + boxPaddingY + fontSize;

      for (let i = 0; i < metaLines.length; i++) {
        ctx.fillText(metaLines[i], textRightX, textCurrentY);
        textCurrentY += lineHeight;
      }
      ctx.restore();

      // ==========================================
      // RETORNA IMAGEM COMPRIMIDA EM BASE64 JPEG
      // ==========================================
      resolve(canvas.toDataURL('image/jpeg', 0.88));
    };

    img.onerror = () => reject(new Error("Erro ao carregar imagem para aplicar marca d'água"));

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

export function getStatusColorHex(status?: CheckInStatus): string {
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

/**
 * Normaliza e resolve URLs de imagens (seja Base64, URL absoluta ou caminho relativo no servidor)
 */
export function getImageUrl(url?: string): string {
  if (!url) return '';
  if (
    url.startsWith('data:') ||
    url.startsWith('http://') ||
    url.startsWith('https://') ||
    url.startsWith('blob:')
  ) {
    return url;
  }

  const currentPath = window.location.pathname;
  const dir = currentPath.endsWith('/') ? currentPath : currentPath + '/';
  const clean = url.startsWith('/') ? url.substring(1) : url;
  return `${dir}${clean}`;
}

