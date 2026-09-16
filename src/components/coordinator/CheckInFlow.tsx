import React, { useState, useEffect } from 'react';
import { ActionPoint, Team, CheckIn, CheckInStatus } from '../../types';
import { evaluateCheckInGeofence } from '../../services/geoService';
import { generateWatermarkedImage, getBaseNameFromTeam } from '../../services/imageService';
import { hasReachedPhotoLimit } from '../../services/evidenceRules';
import { MapPin, Camera, AlertTriangle, CheckCircle2, XCircle, Clock, Navigation, Users, User, FileText, ArrowRight, ArrowLeft, CheckSquare, Square } from 'lucide-react';

interface CheckInFlowProps {
  team: Team;
  actionPoints: ActionPoint[];
  initialPointId?: string;
  campaignName: string;
  isOnline: boolean;
  checkIns?: CheckIn[];
  userId?: string;
  onCompleteCheckIn: (checkIn: CheckIn) => void;
  onCancel: () => void;
}

export const CheckInFlow: React.FC<CheckInFlowProps> = ({
  team,
  actionPoints,
  initialPointId,
  campaignName,
  isOnline,
  checkIns = [],
  userId,
  onCompleteCheckIn,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPointId, setSelectedPointId] = useState<string>(
    initialPointId || team?.assignedPointIds?.[0] || actionPoints[0]?.id || ''
  );
  
  // GPS State
  const [loadingGps, setLoadingGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // Form State - Integrantes e Modo Grupo vs Individual
  const initialCount = team?.members?.length || 2;
  const [isGroup, setIsGroup] = useState<boolean>(initialCount > 1);
  const [memberCount, setMemberCount] = useState<number>(initialCount > 1 ? initialCount : 1);
  const [notes, setNotes] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewWatermark, setPreviewWatermark] = useState<string | null>(null);
  const [generatingWatermark, setGeneratingWatermark] = useState<boolean>(false);

  // Geofence Evaluation State
  const [evaluationResult, setEvaluationResult] = useState<{
    distanceMeters: number;
    status: CheckInStatus;
    reason: string;
  } | null>(null);

  const selectedPoint = actionPoints.find((p) => p.id === selectedPointId) || actionPoints[0];
  const limitCheck = hasReachedPhotoLimit(checkIns, selectedPointId, userId, team?.id);

  // Sincroniza contagem ao alternar Individual vs Grupo
  const handleToggleGroup = (groupMode: boolean) => {
    setIsGroup(groupMode);
    if (!groupMode) {
      setMemberCount(1);
    } else {
      setMemberCount((prev) => (prev <= 1 ? Math.max(2, team?.members?.length || 2) : prev));
    }
  };

  // Captura localização GPS ao carregar
  useEffect(() => {
    captureLocation();
  }, []);

  const captureLocation = () => {
    setLoadingGps(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError('Geolocalização não é suportada pelo seu navegador/dispositivo.');
      setLoadingGps(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLat(position.coords.latitude);
        setLng(position.coords.longitude);
        setAccuracy(Math.round(position.coords.accuracy));
        setLoadingGps(false);
      },
      (error) => {
        let msg = 'Erro ao capturar GPS.';
        if (error.code === error.PERMISSION_DENIED) msg = 'Permissão de localização negada pelo usuário.';
        else if (error.code === error.POSITION_UNAVAILABLE) msg = 'Sinal GPS indisponível.';
        else if (error.code === error.TIMEOUT) msg = 'Tempo limite esgotado ao buscar GPS.';
        setGpsError(msg);
        setLoadingGps(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  };

  // Avalia geofencing quando o ponto selecionado ou o GPS mudam
  useEffect(() => {
    if (selectedPoint && lat !== null && lng !== null && accuracy !== null) {
      const evalRes = evaluateCheckInGeofence(
        lat,
        lng,
        selectedPoint.latitude,
        selectedPoint.longitude,
        selectedPoint.radiusMeters,
        accuracy
      );
      setEvaluationResult(evalRes);
    }
  }, [selectedPointId, lat, lng, accuracy, selectedPoint]);

  // Trata captura / seleção de imagem da câmera
  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPoint || lat === null || lng === null) return;

    setImageFile(file);
    setGeneratingWatermark(true);

    try {
      const statusToApply = !isOnline ? 'pendente_sync' : evaluationResult?.status || 'validado';
      const baseName = getBaseNameFromTeam(team.name);
      const agentName = userId
        ? (team.members?.find((m) => m.id === userId)?.name || team.members?.[0]?.name || team.coordinatorName)
        : (team.members?.[0]?.name || team.coordinatorName || 'Agente de Campo');

      const watermarkBase64 = await generateWatermarkedImage(file, {
        campaignName,
        baseName,
        agentName,
        coordinatorName: team.coordinatorName,
        teamName: team.name,
        pointName: selectedPoint.name,
        pointAddress: selectedPoint.address,
        lat,
        lng,
        accuracy: accuracy || undefined,
        status: statusToApply,
      });

      setPreviewWatermark(watermarkBase64);
    } catch (err) {
      console.error("Erro ao gerar marca d'água:", err);
    } finally {
      setGeneratingWatermark(false);
    }
  };

  const handleSubmitCheckIn = () => {
    if (!selectedPoint || lat === null || lng === null || accuracy === null) return;

    const finalStatus: CheckInStatus = !isOnline
      ? 'pendente_sync'
      : evaluationResult?.status || 'validado';

    const baseName = getBaseNameFromTeam(team.name);
    const agentName = userId
      ? (team.members?.find((m) => m.id === userId)?.name || team.members?.[0]?.name || team.coordinatorName)
      : (team.members?.[0]?.name || team.coordinatorName || 'Agente de Campo');

    const newCheckIn: CheckIn = {
      id: `chk-${Date.now()}`,
      teamId: team.id,
      teamName: team.name,
      baseName,
      agentName,
      actionPointId: selectedPoint.id,
      pointName: selectedPoint.name,
      coordinatorId: team.coordinatorId,
      coordinatorName: team.coordinatorName,
      latitude: lat,
      longitude: lng,
      gpsAccuracyMeters: accuracy,
      distanceCalculatedMeters: evaluationResult?.distanceMeters || 0,
      memberCount: isGroup ? memberCount : 1,
      imageUrl: previewWatermark || undefined,
      imageWatermarkUrl: previewWatermark || undefined,
      notes: notes.trim() || undefined,
      status: finalStatus,
      statusReason: evaluationResult?.reason || 'Check-in registrado via PWA.',
      timestamp: new Date().toISOString(),
      synced: isOnline,
      offlineCreated: !isOnline,
    };

    onCompleteCheckIn(newCheckIn);
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl max-w-lg mx-auto text-slate-100 font-['Inter',sans-serif]">
      
      {/* Wizard Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-5">
        <div>
          <h2 className="text-base sm:text-lg font-bold text-white flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <span>Registro de Check-in em Campo</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{team.name}</p>
        </div>

        {/* Indicator de Passos */}
        <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-400">
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 1 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-800 text-slate-400'}`}>1</span>
          <span className="text-slate-600">-</span>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 2 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-800 text-slate-400'}`}>2</span>
          <span className="text-slate-600">-</span>
          <span className={`w-6 h-6 rounded-full flex items-center justify-center ${step === 3 ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30' : 'bg-slate-800 text-slate-400'}`}>3</span>
        </div>
      </div>

      {/* STEP 1: Seleção de Ponto e Captura de GPS */}
      {step === 1 && (
        <div className="space-y-4">
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider">
                1. Ponto de Atuação / Ação do Dia
              </label>
              {actionPoints.length > 1 && (
                <span className="text-[10px] font-semibold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                  {actionPoints.length} ações vinculadas
                </span>
              )}
            </div>

            {/* Dropdown de Pontos de Atuação */}
            <div className="relative">
              <select
                value={selectedPointId}
                onChange={(e) => setSelectedPointId(e.target.value)}
                className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-xs sm:text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none transition-all cursor-pointer font-medium"
              >
                {actionPoints.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.address || 'Sem endereço'}
                  </option>
                ))}
              </select>
            </div>

            {selectedPoint && (
              <p className="text-[11px] text-slate-400 pl-1">
                Local: <strong className="text-slate-300">{selectedPoint.name}</strong> ({selectedPoint.address})
              </p>
            )}
          </div>

          {/* Card de GPS Status */}
          <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-xs sm:text-sm font-semibold text-slate-200">
                <Navigation className="w-4 h-4 text-emerald-400" />
                <span>Geolocalização do Dispositivo</span>
              </div>
              <button
                onClick={captureLocation}
                disabled={loadingGps}
                className="text-xs text-indigo-400 hover:text-indigo-300 underline font-medium"
              >
                {loadingGps ? 'Buscando...' : 'Recalibrar GPS'}
              </button>
            </div>

            {loadingGps && (
              <div className="flex items-center space-x-2 text-xs text-indigo-400 py-1.5">
                <div className="w-3.5 h-3.5 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Obtendo latitude, longitude e precisão...</span>
              </div>
            )}

            {gpsError && (
              <div className="p-2.5 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{gpsError}</span>
              </div>
            )}

            {lat !== null && lng !== null && (
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase font-semibold">LATITUDE</span>
                  <span className="font-mono text-slate-200 font-bold text-xs">{lat.toFixed(5)}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase font-semibold">LONGITUDE</span>
                  <span className="font-mono text-slate-200 font-bold text-xs">{lng.toFixed(5)}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[9px] text-slate-400 block uppercase font-semibold">PRECISÃO</span>
                  <span className={`font-bold text-xs ${accuracy! <= 30 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    ±{accuracy}m
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Resultado de Geofencing / Raio */}
          {evaluationResult && selectedPoint && (
            <div
              className={`p-3.5 rounded-xl border text-xs space-y-1.5 transition-all ${
                evaluationResult.status === 'validado'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : evaluationResult.status === 'pendente_analise'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold text-sm">
                {evaluationResult.status === 'validado' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                ) : evaluationResult.status === 'pendente_analise' ? (
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
                ) : (
                  <XCircle className="w-4 h-4 text-rose-400 shrink-0" />
                )}
                <span className="capitalize">Check-in {evaluationResult.status.replace('_', ' ')}</span>
              </div>
              <p className="text-[11px] leading-relaxed">{evaluationResult.reason}</p>
              <div className="text-[10px] opacity-80 pt-0.5">
                Distância calculada: <strong>{evaluationResult.distanceMeters}m</strong> | Raio máximo permitido: <strong>{selectedPoint.radiusMeters}m</strong>
              </div>
            </div>
          )}

          {/* Alerta de Limite Atingido (1 Foto por Evento) */}
          {limitCheck.isBlocked && (
            <div className="p-3.5 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-200 space-y-1.5 text-xs">
              <div className="flex items-center space-x-2 font-bold text-amber-400">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>Evidência Já Registrada ({limitCheck.existingCount}/{limitCheck.maxAllowed} foto)</span>
              </div>
              <p className="text-[11px] leading-relaxed">
                Você já enviou a foto de evidência para a ação <strong className="text-white">{selectedPoint?.name}</strong>. A regra atual permite 1 foto por evento por usuário.
              </p>
              {limitCheck.existingCheckIn && (
                <div className="pt-1 border-t border-amber-500/20 text-[10px] text-slate-300">
                  Status do envio: <strong className="uppercase text-emerald-400">{limitCheck.existingCheckIn.status.replace('_', ' ')}</strong>
                </div>
              )}
            </div>
          )}

          {/* Next Button */}
          <div className="flex items-center space-x-3 pt-3">
            <button
              onClick={onCancel}
              className="w-1/3 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-all"
            >
              Cancelar
            </button>
            <button
              disabled={lat === null || loadingGps || limitCheck.isBlocked}
              onClick={() => setStep(2)}
              className="w-2/3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <span>{limitCheck.isBlocked ? 'Limite de Envios Atingido' : 'Avançar para Detalhes'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Detalhes dos Integrantes (Individual vs Grupo) e Observações */}
      {step === 2 && (
        <div className="space-y-4">
          <div className="space-y-3">
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>2. Modalidade & Integrantes em Campo</span>
            </label>

            {/* Checkbox Individual vs Grupo */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* Opção Individual */}
              <button
                type="button"
                onClick={() => handleToggleGroup(false)}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                  !isGroup
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {!isGroup ? (
                  <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs text-white">Individual</div>
                  <div className="text-[10px] text-slate-400">1 pessoa em campo</div>
                </div>
              </button>

              {/* Opção Em Grupo */}
              <button
                type="button"
                onClick={() => handleToggleGroup(true)}
                className={`p-3 rounded-xl border flex items-center gap-2.5 text-left transition-all ${
                  isGroup
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {isGroup ? (
                  <CheckSquare className="w-4 h-4 text-indigo-400 shrink-0" />
                ) : (
                  <Square className="w-4 h-4 text-slate-500 shrink-0" />
                )}
                <div>
                  <div className="font-bold text-xs text-white">Em Grupo</div>
                  <div className="text-[10px] text-slate-400">Equipe / Dupla</div>
                </div>
              </button>
            </div>

            {/* Caixa de Integrantes com Digitação Direta */}
            {isGroup ? (
              <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 space-y-2 animate-fadeIn">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span className="font-semibold">Quantidade de Integrantes no Local:</span>
                  <span className="text-[10px] text-indigo-400 font-mono">Digite ou ajuste no +/-</span>
                </div>
                
                <div className="flex items-center space-x-3">
                  <button
                    type="button"
                    onClick={() => setMemberCount(Math.max(2, memberCount - 1))}
                    className="w-11 h-11 rounded-xl bg-slate-800 text-white font-extrabold text-xl hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center border border-slate-700"
                  >
                    -
                  </button>
                  
                  {/* Input Numérico com Digitação Direta */}
                  <input
                    type="number"
                    min={2}
                    max={99}
                    value={memberCount}
                    onChange={(e) => {
                      const val = parseInt(e.target.value, 10);
                      if (!isNaN(val)) {
                        setMemberCount(Math.max(1, Math.min(99, val)));
                      } else {
                        setMemberCount(2);
                      }
                    }}
                    className="flex-1 bg-slate-900 border border-slate-700 rounded-xl py-2 text-center font-extrabold text-2xl text-white focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
                  />

                  <button
                    type="button"
                    onClick={() => setMemberCount(Math.min(99, memberCount + 1))}
                    className="w-11 h-11 rounded-xl bg-slate-800 text-white font-extrabold text-xl hover:bg-slate-700 active:scale-95 transition-all flex items-center justify-center border border-slate-700"
                  >
                    +
                  </button>
                </div>
              </div>
            ) : (
              <div className="bg-slate-950/60 p-3 rounded-xl border border-slate-800 flex items-center gap-2.5 text-xs text-slate-300">
                <User className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>Check-in registrado como ação <strong>individual (1 integrante)</strong>.</span>
              </div>
            )}
          </div>

          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center space-x-1.5">
              <FileText className="w-3.5 h-3.5 text-indigo-400" />
              <span>Observações Operacionais (Opcional)</span>
            </label>
            <textarea
              rows={2}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Alta receptividade, panfletagem concluída no setor..."
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-2.5 text-xs focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
            />
          </div>

          <div className="flex items-center space-x-3 pt-3">
            <button
              onClick={() => setStep(1)}
              className="w-1/3 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-800 flex items-center justify-center space-x-1 transition-all"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <span>Avançar para Evidência</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Foto Evidência Fotográfica com Mini Mapa e Metadados */}
      {step === 3 && (
        <div className="space-y-4">
          <div>
            <label className="block text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Camera className="w-4 h-4 text-indigo-400" />
              <span>3. Captura da Foto Evidência (Carimbo com Mini Mapa & Metas)</span>
            </label>

            {!previewWatermark ? (
              <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition-all text-center group">
                <Camera className="w-10 h-10 text-slate-400 group-hover:text-indigo-400 transition-colors mb-2" />
                <span className="text-sm font-semibold text-slate-200">Tirar Foto com a Câmera</span>
                <span className="text-xs text-slate-400 mt-1">
                  O sistema gerará automaticamente o carimbo com metadados e o mini print do mapa georreferenciado.
                </span>
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  onChange={handlePhotoCapture}
                  className="hidden"
                />
              </label>
            ) : (
              <div className="space-y-3">
                <div className="relative rounded-2xl overflow-hidden border border-slate-700 shadow-xl bg-slate-950">
                  <img
                    src={previewWatermark}
                    alt="Evidência com Carimbo"
                    className="w-full max-h-80 object-contain mx-auto"
                  />
                  <div className="absolute bottom-2 right-2 bg-slate-900/90 text-emerald-400 text-[10px] font-bold px-2.5 py-1 rounded-md border border-slate-700 shadow">
                    Carimbo Georreferenciado Aplicado
                  </div>
                </div>

                <label className="block text-center text-xs text-indigo-400 hover:text-indigo-300 underline font-semibold cursor-pointer py-1">
                  Tirar outra foto
                  <input
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handlePhotoCapture}
                    className="hidden"
                  />
                </label>
              </div>
            )}

            {generatingWatermark && (
              <div className="flex items-center justify-center space-x-2 text-xs text-indigo-400 py-3">
                <div className="w-4 h-4 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Processando carimbo e renderizando mini mapa no canvas...</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 pt-3">
            <button
              onClick={() => setStep(2)}
              className="w-1/3 py-2.5 rounded-xl border border-slate-700 text-slate-300 text-xs sm:text-sm font-semibold hover:bg-slate-800 transition-all"
            >
              Voltar
            </button>
            <button
              onClick={handleSubmitCheckIn}
              disabled={generatingWatermark || !previewWatermark}
              className="w-2/3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 disabled:opacity-50 text-white py-2.5 rounded-xl text-xs sm:text-sm font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isOnline ? 'Finalizar & Enviar' : 'Salvar Offline'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
