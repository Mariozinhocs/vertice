import Dexie, { Table } from 'dexie';
import { CheckIn, ActionPoint, Team } from '../types';

export class VerticeOfflineDatabase extends Dexie {
  checkins!: Table<CheckIn, string>;
  actionPoints!: Table<ActionPoint, string>;
  teams!: Table<Team, string>;

  constructor() {
    super('VerticeCampoDB');
    
    this.version(1).stores({
      checkins: 'id, teamId, actionPointId, coordinatorId, status, synced, timestamp',
      actionPoints: 'id, regionId, campaignId',
      teams: 'id, coordinatorId, campaignId'
    });
  }
}

export const offlineDb = new VerticeOfflineDatabase();

/**
 * Salva um check-in localmente no IndexedDB quando offline ou como cópia de segurança.
 */
export async function saveCheckInOffline(checkIn: CheckIn): Promise<string> {
  await offlineDb.checkins.put(checkIn);
  return checkIn.id;
}

/**
 * Obtém todos os check-ins pendentes de sincronização
 */
export async function getPendingSyncCheckIns(): Promise<CheckIn[]> {
  return await offlineDb.checkins.where('synced').equals(0).toArray();
}

/**
 * Marca check-in como sincronizado
 */
export async function markCheckInAsSynced(id: string): Promise<void> {
  await offlineDb.checkins.update(id, { synced: true });
}

/**
 * Cache de pontos de atuação para uso offline no celular do coordenador
 */
export async function cacheOfflineActionPoints(points: ActionPoint[]): Promise<void> {
  await offlineDb.actionPoints.clear();
  await offlineDb.actionPoints.bulkPut(points);
}

/**
 * Resgata pontos de atuação em cache offline
 */
export async function getCachedActionPoints(): Promise<ActionPoint[]> {
  return await offlineDb.actionPoints.toArray();
}
