import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CheckIn, Team, ActionPoint, Campaign, OperationalMetrics, Region, User } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export type ReportPeriodType = 'daily' | 'weekly';

export interface WeeklyTeamSummary {
  teamId: string;
  teamName: string;
  regionName: string;
  coordinatorName: string;
  totalCheckIns: number;
  validatedCheckIns: number;
  inAnalysisCheckIns: number;
  rejectedCheckIns: number;
  pointsVisitedCount: number;
  lastCheckInDate?: string;
  complianceRate: number;
}

export interface ReportExportOptions {
  campaign: Campaign;
  periodMode: ReportPeriodType;
  dateStr: string;
  metrics: {
    totalTeams: number;
    teamsActive: number;
    pointsAttended: number;
    totalActionPoints: number;
    checkInsValidated: number;
    checkInsInAnalysis: number;
    checkInsRejected: number;
    totalEvidences: number;
  };
  teams: Team[];
  regions?: Region[];
  users?: User[];
  actionPoints: ActionPoint[];
  checkIns: CheckIn[];
  weeklySummaries?: WeeklyTeamSummary[];
  generatedBy: string;
}

function getTeamRegionName(team: Team, regions: Region[] = [], users: User[] = []): string {
  if (team.regionId) {
    const r = regions.find((reg) => reg.id === team.regionId);
    if (r) return r.name;
  }
  const coord = users.find((u) => u.id === team.coordinatorId || u.name === team.coordinatorName);
  if (coord) {
    if (coord.regionName) return coord.regionName;
    if (coord.regionId) {
      const r = regions.find((reg) => reg.id === coord.regionId);
      if (r) return r.name;
    }
  }
  return '—';
}

interface LegacyReportData {
  campaign: Campaign;
  dateStr: string;
  metrics: OperationalMetrics;
  teams: Team[];
  actionPoints: ActionPoint[];
  checkIns: CheckIn[];
  generatedBy: string;
}

/**
 * Gera e realiza download do Relatório Oficial da Operação (Diário ou Semanal) em PDF
 */
export function generatePDFReport(options: ReportExportOptions): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 15;

  const isWeekly = options.periodMode === 'weekly';
  const title = isWeekly
    ? 'VÉRTICE - RELATÓRIO SEMANAL DA OPERAÇÃO'
    : 'VÉRTICE - RELATÓRIO DIÁRIO DA OPERAÇÃO';

  // Cabeçalho Institucional
  doc.setFillColor(31, 41, 55); // Slate 800
  doc.rect(0, 0, pageWidth, 28, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(14);
  doc.text(title, 14, 10);

  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.text(`Campanha: ${options.campaign.name}`, 14, 16);
  doc.text(`Período de Referência: ${options.dateStr}`, 14, 22);
  doc.text(
    `Gerado por: ${options.generatedBy} em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`,
    pageWidth - 14,
    22,
    { align: 'right' }
  );

  currentY = 34;

  // Quadro de Resumo Executivo / KPIs
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, currentY, pageWidth - 28, 26, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(9.5);
  doc.text(
    isWeekly ? 'RESUMO EXECUTIVO DA SEMANA' : 'RESUMO EXECUTIVO DA OPERAÇÃO DE CAMPO',
    18,
    currentY + 7
  );

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  const colWidth = (pageWidth - 36) / 4;

  // Coluna 1
  doc.text(`Total de Equipes: ${options.metrics.totalTeams}`, 18, currentY + 14);
  doc.text(`Equipes Ativas: ${options.metrics.teamsActive}`, 18, currentY + 20);

  // Coluna 2
  doc.text(`Pontos Totais: ${options.metrics.totalActionPoints}`, 18 + colWidth, currentY + 14);
  doc.text(`Pontos Atendidos: ${options.metrics.pointsAttended}`, 18 + colWidth, currentY + 20);

  // Coluna 3
  doc.text(`Validados: ${options.metrics.checkInsValidated}`, 18 + colWidth * 2, currentY + 14);
  doc.text(`Em Análise: ${options.metrics.checkInsInAnalysis}`, 18 + colWidth * 2, currentY + 20);

  // Coluna 4
  doc.text(`Rejeitados: ${options.metrics.checkInsRejected}`, 18 + colWidth * 3, currentY + 14);
  doc.text(`Evidências Fotos: ${options.metrics.totalEvidences}`, 18 + colWidth * 3, currentY + 20);

  currentY += 34;

  // Tabela Detalhada
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10.5);
  
  if (isWeekly && options.weeklySummaries) {
    doc.text('CONSOLIDADO SEMANAL POR EQUIPE E BASE', 14, currentY);
    currentY += 4;

    const tableRows = options.weeklySummaries.map((sum) => [
      sum.teamName,
      sum.regionName || '—',
      sum.coordinatorName,
      sum.totalCheckIns.toString(),
      sum.validatedCheckIns.toString(),
      sum.rejectedCheckIns.toString(),
      sum.pointsVisitedCount.toString(),
      `${sum.complianceRate}%`,
      sum.lastCheckInDate ? format(new Date(sum.lastCheckInDate), 'dd/MM HH:mm') : '—'
    ]);

    autoTable(doc, {
      startY: currentY,
      head: [['Equipe', 'Base / Zona', 'Coordenador', 'Total Check-ins', 'Validados', 'Rejeitados', 'Pontos', 'Taxa Aprov.', 'Última Atividade']],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: [30, 41, 59]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 14, right: 14 }
    });
  } else {
    doc.text('DETALHAMENTO DIÁRIO POR EQUIPE, BASE E PONTO DE ATUAÇÃO', 14, currentY);
    currentY += 4;

    const tableRows = options.teams.map((team) => {
      const checkIn = options.checkIns.find((c) => c.teamId === team.id);
      const assignedPoint = options.actionPoints.find((p) => team.assignedPointIds.includes(p.id));
      const regionName = getTeamRegionName(team, options.regions, options.users);

      return [
        team.name,
        regionName,
        team.coordinatorName,
        assignedPoint ? assignedPoint.name : 'Não definido',
        checkIn ? format(new Date(checkIn.timestamp), 'HH:mm') : '—',
        checkIn ? `${checkIn.distanceCalculatedMeters} m` : '—',
        checkIn ? (checkIn.imageUrl ? 'Sim (Anexa)' : 'Não') : 'Não',
        checkIn ? formatStatusLabel(checkIn.status) : 'Sem Check-in'
      ];
    });

    autoTable(doc, {
      startY: currentY,
      head: [['Equipe', 'Base / Zona', 'Coordenador', 'Ponto de Atuação', 'Horário (Local)', 'Distância', 'Evidência', 'Status']],
      body: tableRows,
      theme: 'grid',
      headStyles: {
        fillColor: [79, 70, 229],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        fontSize: 8
      },
      bodyStyles: {
        fontSize: 7.5,
        textColor: [30, 41, 59]
      },
      alternateRowStyles: {
        fillColor: [248, 250, 252]
      },
      margin: { left: 14, right: 14 }
    });
  }

  // Rodapé da LGPD e Assinatura Eleitoral
  const finalY = (doc as any).lastAutoTable?.finalY || currentY + 40;

  if (finalY + 30 < doc.internal.pageSize.getHeight()) {
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(100, 116, 139);
    doc.text(
      'Este relatório foi gerado em conformidade com as regras de proteção de dados (LGPD - Lei 13.709/2018) e resoluções do TSE.',
      14,
      finalY + 12
    );
    doc.text(
      `Identificador do Relatório: REF-${options.periodMode.toUpperCase()}-${Date.now().toString(36).toUpperCase()}`,
      14,
      finalY + 17
    );
  }

  // Download do arquivo
  const filename = isWeekly
    ? `Relatorio_Semanal_Campo_${options.dateStr.replace(/\s+/g, '_').replace(/\//g, '-')}.pdf`
    : `Relatorio_Diario_Campo_${options.dateStr.replace(/\//g, '-')}.pdf`;

  doc.save(filename);
}

/**
 * Exporta o Relatório Oficial (Diário ou Semanal) em formato CSV
 */
export function exportCSVReport(options: ReportExportOptions): void {
  const isWeekly = options.periodMode === 'weekly';
  
  let headers: string[] = [];
  let rows: string[][] = [];

  if (isWeekly && options.weeklySummaries) {
    headers = [
      'Equipe',
      'Base / Zona',
      'Coordenador',
      'Total Check-ins',
      'Check-ins Validados',
      'Em Análise',
      'Rejeitados',
      'Pontos Visitados',
      'Taxa de Aprovação (%)',
      'Última Atividade'
    ];

    rows = options.weeklySummaries.map((sum) => [
      `"${sum.teamName}"`,
      `"${sum.regionName || ''}"`,
      `"${sum.coordinatorName}"`,
      `"${sum.totalCheckIns}"`,
      `"${sum.validatedCheckIns}"`,
      `"${sum.inAnalysisCheckIns}"`,
      `"${sum.rejectedCheckIns}"`,
      `"${sum.pointsVisitedCount}"`,
      `"${sum.complianceRate}%"`,
      `"${sum.lastCheckInDate ? format(new Date(sum.lastCheckInDate), 'dd/MM/yyyy HH:mm') : ''}"`
    ]);
  } else {
    headers = [
      'Equipe',
      'Base / Zona',
      'Coordenador',
      'Ponto de Atuação',
      'Horário Check-in (Local)',
      'Distância (m)',
      'Precisão GPS (m)',
      'Integrantes',
      'Status',
      'Observações'
    ];

    rows = options.teams.map((team) => {
      const checkIn = options.checkIns.find((c) => c.teamId === team.id);
      const assignedPoint = options.actionPoints.find((p) => team.assignedPointIds.includes(p.id));
      const regionName = getTeamRegionName(team, options.regions, options.users);

      return [
        `"${team.name}"`,
        `"${regionName}"`,
        `"${team.coordinatorName}"`,
        `"${assignedPoint ? assignedPoint.name : 'Não definido'}"`,
        `"${checkIn ? format(new Date(checkIn.timestamp), 'HH:mm') : ''}"`,
        `"${checkIn ? checkIn.distanceCalculatedMeters : ''}"`,
        `"${checkIn ? checkIn.gpsAccuracyMeters : ''}"`,
        `"${checkIn ? checkIn.memberCount : ''}"`,
        `"${checkIn ? formatStatusLabel(checkIn.status) : 'Sem Check-in'}"`,
        `"${checkIn ? (checkIn.notes || '').replace(/"/g, '""') : ''}"`
      ];
    });
  }

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map((r) => r.join(';'))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  
  const filename = isWeekly
    ? `Relatorio_Semanal_Campo_${options.dateStr.replace(/\s+/g, '_').replace(/\//g, '-')}.csv`
    : `Relatorio_Diario_Campo_${options.dateStr.replace(/\//g, '-')}.csv`;

  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

// Funções legadas para compatibilidade
export function generateDailyPDFReport(data: LegacyReportData): void {
  generatePDFReport({
    campaign: data.campaign,
    periodMode: 'daily',
    dateStr: data.dateStr,
    metrics: {
      totalTeams: data.metrics.totalTeams,
      teamsActive: data.metrics.teamsActive,
      pointsAttended: data.metrics.pointsAttended,
      totalActionPoints: data.actionPoints.length,
      checkInsValidated: data.metrics.checkInsValidated,
      checkInsInAnalysis: data.metrics.checkInsInAnalysis,
      checkInsRejected: data.metrics.checkInsRejected,
      totalEvidences: data.checkIns.filter((c) => c.imageUrl).length
    },
    teams: data.teams,
    actionPoints: data.actionPoints,
    checkIns: data.checkIns,
    generatedBy: data.generatedBy
  });
}

export function exportDailyCSVReport(data: LegacyReportData): void {
  exportCSVReport({
    campaign: data.campaign,
    periodMode: 'daily',
    dateStr: data.dateStr,
    metrics: {
      totalTeams: data.metrics.totalTeams,
      teamsActive: data.metrics.teamsActive,
      pointsAttended: data.metrics.pointsAttended,
      totalActionPoints: data.actionPoints.length,
      checkInsValidated: data.metrics.checkInsValidated,
      checkInsInAnalysis: data.metrics.checkInsInAnalysis,
      checkInsRejected: data.metrics.checkInsRejected,
      totalEvidences: data.checkIns.filter((c) => c.imageUrl).length
    },
    teams: data.teams,
    actionPoints: data.actionPoints,
    checkIns: data.checkIns,
    generatedBy: data.generatedBy
  });
}

function formatStatusLabel(status: string): string {
  switch (status) {
    case 'validado':
      return 'Validado';
    case 'pendente_analise':
      return 'Em Análise';
    case 'rejeitado':
      return 'Rejeitado';
    case 'pendente_sync':
      return 'Pendente Sync';
    default:
      return status;
  }
}

