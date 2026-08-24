import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CheckIn, Team, ActionPoint, Campaign, OperationalMetrics } from '../types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface ReportData {
  campaign: Campaign;
  dateStr: string;
  metrics: OperationalMetrics;
  teams: Team[];
  actionPoints: ActionPoint[];
  checkIns: CheckIn[];
  generatedBy: string;
}

/**
 * Gera e realiza download do Relatório Diário Oficial da Operação em PDF
 */
export function generateDailyPDFReport(data: ReportData): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4'
  });

  const pageWidth = doc.internal.pageSize.getWidth();
  let currentY = 15;

  // Cabeçalho Institucional
  doc.setFillColor(31, 41, 55); // Slate 800
  doc.rect(0, 0, pageWidth, 25, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(16);
  doc.text('VÉRTICE - RELATÓRIO DIÁRIO DA OPERAÇÃO', 14, 12);

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Campanha: ${data.campaign.name} | Data de Referência: ${data.dateStr}`, 14, 18);
  doc.text(`Gerado por: ${data.generatedBy} em ${format(new Date(), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}`, pageWidth - 14, 18, { align: 'right' });

  currentY = 32;

  // Quadro de Resumo Executivo / KPIs
  doc.setDrawColor(226, 232, 240);
  doc.setFillColor(248, 250, 252);
  doc.roundedRect(14, currentY, pageWidth - 28, 26, 2, 2, 'FD');

  doc.setTextColor(15, 23, 42);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('RESUMO EXECUTIVO DA OPERAÇÃO DE CAMPO', 18, currentY + 7);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8.5);

  const colWidth = (pageWidth - 36) / 4;
  
  // Coluna 1
  doc.text(`Total de Equipes: ${data.metrics.totalTeams}`, 18, currentY + 14);
  doc.text(`Equipes Ativas no Campo: ${data.metrics.teamsActive}`, 18, currentY + 20);

  // Coluna 2
  doc.text(`Pontos Programados: ${data.actionPoints.length}`, 18 + colWidth, currentY + 14);
  doc.text(`Pontos Atendidos: ${data.metrics.pointsAttended}`, 18 + colWidth, currentY + 20);

  // Coluna 3
  doc.text(`Check-ins Validados: ${data.metrics.checkInsValidated}`, 18 + colWidth * 2, currentY + 14);
  doc.text(`Check-ins em Análise: ${data.metrics.checkInsInAnalysis}`, 18 + colWidth * 2, currentY + 20);

  // Coluna 4
  doc.text(`Check-ins Rejeitados: ${data.metrics.checkInsRejected}`, 18 + colWidth * 3, currentY + 14);
  doc.text(`Evidências Fotográficas: ${data.checkIns.filter(c => c.imageUrl).length}`, 18 + colWidth * 3, currentY + 20);

  currentY += 34;

  // Tabela Detalhada de Atuação das Equipes
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text('DETALHAMENTO POR EQUIPE E PONTO DE ATUAÇÃO', 14, currentY);

  currentY += 4;

  const tableRows = data.teams.map((team) => {
    const checkIn = data.checkIns.find((c) => c.teamId === team.id);
    const assignedPoint = data.actionPoints.find((p) => team.assignedPointIds.includes(p.id));

    return [
      team.name,
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
    head: [['Equipe', 'Coordenador', 'Ponto de Atuação', 'Horário', 'Distância', 'Evidência', 'Status']],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [79, 70, 229], // Indigo 600
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 8.5
    },
    bodyStyles: {
      fontSize: 8,
      textColor: [30, 41, 59]
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252]
    },
    margin: { left: 14, right: 14 }
  });

  // Rodapé da LGPD e Assinatura Eleitoral
  const finalY = (doc as any).lastAutoTable.finalY || currentY + 40;

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
      `Identificador do Relatório: REF-${Date.now().toString(36).toUpperCase()}`,
      14,
      finalY + 17
    );
  }

  // Baixa o PDF
  doc.save(`Relatorio_Diario_Campo_${data.dateStr.replace(/\//g, '-')}.pdf`);
}

/**
 * Exporta o Relatório Diário em formato CSV
 */
export function exportDailyCSVReport(data: ReportData): void {
  const headers = ['Equipe', 'Coordenador', 'Ponto de Atuação', 'Horário Check-in', 'Distância (m)', 'Precisão GPS (m)', 'Integrantes', 'Status', 'Observações'];
  
  const rows = data.teams.map((team) => {
    const checkIn = data.checkIns.find((c) => c.teamId === team.id);
    const assignedPoint = data.actionPoints.find((p) => team.assignedPointIds.includes(p.id));

    return [
      `"${team.name}"`,
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

  const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', `Relatorio_Diario_Campo_${data.dateStr.replace(/\//g, '-')}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
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
