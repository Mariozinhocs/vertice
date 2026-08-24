import React, { useState, useEffect } from 'react';
import { ActionPoint, Team, CheckIn, CheckInStatus } from '../../types';
import { evaluateCheckInGeofence } from '../../services/geoService';
import { generateWatermarkedImage } from '../../services/imageService';
import { MapPin, Camera, AlertTriangle, CheckCircle2, XCircle, Clock, Navigation, Users, FileText, ArrowRight, ArrowLeft } from 'lucide-react';

interface CheckInFlowProps {
  team: Team;
  actionPoints: ActionPoint[];
  campaignName: string;
  isOnline: boolean;
  onCompleteCheckIn: (checkIn: CheckIn) => void;
  onCancel: () => void;
}

export const CheckInFlow: React.FC<CheckInFlowProps> = ({
  team,
  actionPoints,
  campaignName,
  isOnline,
  onCompleteCheckIn,
  onCancel,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [selectedPointId, setSelectedPointId] = useState<string>(
    team.assignedPointIds[0] || actionPoints[0]?.id || ''
  );
  
  // GPS State
  const [loadingGps, setLoadingGps] = useState<boolean>(false);
  const [gpsError, setGpsError] = useState<string | null>(null);
  const [lat, setLat] = useState<number | null>(null);
  const [lng, setLng] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);

  // Form State
  const [memberCount, setMemberCount] = useState<number>(team.members.length || 3);
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

  const selectedPoint = actionPoints.find((p) => p.id === selectedPointId);

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
  }, [selectedPointId, lat, lng, accuracy]);

  // Trata captura / seleção de imagem da câmera
  const handlePhotoCapture = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !selectedPoint || lat === null || lng === null) return;

    setImageFile(file);
    setGeneratingWatermark(true);

    try {
      const statusToApply = !isOnline ? 'pendente_sync' : evaluationResult?.status || 'validado';
      const watermarkBase64 = await generateWatermarkedImage(file, {
        campaignName,
        teamName: team.name,
        pointName: selectedPoint.name,
        dateStr: new Date().toLocaleString('pt-BR'),
        lat,
        lng,
        status: statusToApply,
      });

      setPreviewWatermark(watermarkBase64);
    } catch (err) {
      console.error('Erro ao gerar marca d\'água:', err);
    } finally {
      setGeneratingWatermark(false);
    }
  };

  const handleSubmitCheckIn = () => {
    if (!selectedPoint || lat === null || lng === null || accuracy === null) return;

    const finalStatus: CheckInStatus = !isOnline
      ? 'pendente_sync'
      : evaluationResult?.status || 'validado';

    const newCheckIn: CheckIn = {
      id: `chk-${Date.now()}`,
      teamId: team.id,
      teamName: team.name,
      actionPointId: selectedPoint.id,
      pointName: selectedPoint.name,
      coordinatorId: team.coordinatorId,
      coordinatorName: team.coordinatorName,
      latitude: lat,
      longitude: lng,
      gpsAccuracyMeters: accuracy,
      distanceCalculatedMeters: evaluationResult?.distanceMeters || 0,
      memberCount,
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
    <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 shadow-2xl max-w-lg mx-auto text-slate-100">
      
      {/* Wizard Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-800 mb-6">
        <div>
          <h2 className="text-lg font-bold text-white flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <span>Registro de Check-in em Campo</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">{team.name}</p>
        </div>

        {/* Indicator de Passos */}
        <div className="flex items-center space-x-1 text-xs font-bold text-slate-400">
          <span className={`px-2 py-0.5 rounded-full ${step === 1 ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>1</span>
          <span>-</span>
          <span className={`px-2 py-0.5 rounded-full ${step === 2 ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>2</span>
          <span>-</span>
          <span className={`px-2 py-0.5 rounded-full ${step === 3 ? 'bg-indigo-600 text-white' : 'bg-slate-800'}`}>3</span>
        </div>
      </div>

      {/* STEP 1: Seleção de Ponto e Captura de GPS */}
      {step === 1 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2">
              1. Selecione o Ponto de Atuação
            </label>
            <select
              value={selectedPointId}
              onChange={(e) => setSelectedPointId(e.target.value)}
              className="w-full bg-slate-950 border border-slate-700 text-white rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none"
            >
              {actionPoints.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name} ({p.address})
                </option>
              ))}
            </select>
          </div>

          {/* Card de GPS Status */}
          <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2 text-sm font-semibold text-slate-200">
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
              <div className="flex items-center space-x-2 text-xs text-indigo-400 py-2">
                <div className="w-3 h-3 border-2 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <span>Obtendo latitude, longitude e precisão...</span>
              </div>
            )}

            {gpsError && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-lg text-xs text-rose-300 flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                <span>{gpsError}</span>
              </div>
            )}

            {lat !== null && lng !== null && (
              <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">LATITUDE</span>
                  <span className="font-mono text-slate-200 font-bold">{lat.toFixed(5)}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">LONGITUDE</span>
                  <span className="font-mono text-slate-200 font-bold">{lng.toFixed(5)}</span>
                </div>
                <div className="bg-slate-900 p-2 rounded-lg border border-slate-800">
                  <span className="text-[10px] text-slate-400 block uppercase">PRECISÃO</span>
                  <span className={`font-bold ${accuracy! <= 30 ? 'text-emerald-400' : 'text-amber-400'}`}>
                    ±{accuracy}m
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Resultado de Geofencing / Raio */}
          {evaluationResult && selectedPoint && (
            <div
              className={`p-4 rounded-xl border text-xs space-y-1.5 transition-all ${
                evaluationResult.status === 'validado'
                  ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300'
                  : evaluationResult.status === 'pendente_analise'
                  ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                  : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
              }`}
            >
              <div className="flex items-center space-x-2 font-bold text-sm">
                {evaluationResult.status === 'validado' ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                ) : evaluationResult.status === 'pendente_analise' ? (
                  <AlertTriangle className="w-5 h-5 text-amber-400" />
                ) : (
                  <XCircle className="w-5 h-5 text-rose-400" />
                )}
                <span className="capitalize">Check-in {evaluationResult.status.replace('_', ' ')}</span>
              </div>
              <p>{evaluationResult.reason}</p>
              <div className="text-[11px] opacity-80 pt-1">
                Distância calculada: <strong>{evaluationResult.distanceMeters}m</strong> | Raio máximo: <strong>{selectedPoint.radiusMeters}m</strong>
              </div>
            </div>
          )}

          {/* Next Button */}
          <div className="flex items-center space-x-3 pt-4">
            <button
              onClick={onCancel}
              className="w-1/3 py-3 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800"
            >
              Cancelar
            </button>
            <button
              disabled={lat === null || loadingGps}
              onClick={() => setStep(2)}
              className="w-2/3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <span>Avançar para Detalhes</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Detalhes dos Integrantes e Observações */}
      {step === 2 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Users className="w-4 h-4 text-indigo-400" />
              <span>2. Integrantes Presentes em Campo</span>
            </label>
            <div className="flex items-center space-x-3 bg-slate-950 p-3 rounded-xl border border-slate-800">
              <button
                type="button"
                onClick={() => setMemberCount(Math.max(1, memberCount - 1))}
                className="w-10 h-10 rounded-lg bg-slate-800 text-white font-bold text-lg hover:bg-slate-700 active:scale-95"
              >
                -
              </button>
              <span className="flex-1 text-center font-extrabold text-2xl text-white">
                {memberCount}
              </span>
              <button
                type="button"
                onClick={() => setMemberCount(memberCount + 1)}
                className="w-10 h-10 rounded-lg bg-slate-800 text-white font-bold text-lg hover:bg-slate-700 active:scale-95"
              >
                +
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Observações Operacionais (Opcional)</span>
            </label>
            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Ex: Alta receptividade, panfletagem concluída no setor 2..."
              className="w-full bg-slate-950 border border-slate-700 text-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none placeholder-slate-500"
            />
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              onClick={() => setStep(1)}
              className="w-1/3 py-3 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800 flex items-center justify-center space-x-1"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Voltar</span>
            </button>
            <button
              onClick={() => setStep(3)}
              className="w-2/3 bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/30 flex items-center justify-center space-x-2"
            >
              <span>Avançar para Foto Evidência</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Foto Evidência Fotográfica com Marca d'água */}
      {step === 3 && (
        <div className="space-y-5">
          <div>
            <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-2 flex items-center space-x-1.5">
              <Camera className="w-4 h-4 text-indigo-400" />
              <span>3. Captura da Foto Evidência (Marca d'água Automática)</span>
            </label>

            {!previewWatermark ? (
              <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer bg-slate-950/50 hover:bg-slate-950 transition-all text-center group">
                <Camera className="w-10 h-10 text-slate-400 group-hover:text-indigo-400 transition-colors mb-2" />
                <span className="text-sm font-semibold text-slate-200">Tirar Foto com a Câmera</span>
                <span className="text-xs text-slate-400 mt-1">
                  O sistema gerará um carimbo inviolável com data, hora, GPS e status.
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
                    alt="Evidência com Marca d'água"
                    className="w-full h-56 object-cover"
                  />
                  <div className="absolute top-2 right-2 bg-slate-900/90 text-emerald-400 text-[10px] font-bold px-2 py-1 rounded-md border border-slate-700 shadow">
                    Marca d'água Aplicada
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
                <span>Processando marca d'água Canvas em alta resolução...</span>
              </div>
            )}
          </div>

          <div className="flex items-center space-x-3 pt-4">
            <button
              onClick={() => setStep(2)}
              className="w-1/3 py-3 rounded-xl border border-slate-700 text-slate-300 text-sm font-semibold hover:bg-slate-800"
            >
              Voltar
            </button>
            <button
              onClick={handleSubmitCheckIn}
              disabled={generatingWatermark}
              className="w-2/3 bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white py-3 rounded-xl text-sm font-bold shadow-lg shadow-emerald-600/30 flex items-center justify-center space-x-2"
            >
              <CheckCircle2 className="w-5 h-5" />
              <span>{isOnline ? 'Finalizar & Enviar' : 'Salvar Offline'}</span>
            </button>
          </div>
        </div>
      )}

    </div>
  );
};
