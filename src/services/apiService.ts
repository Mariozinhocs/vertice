import { Region, ActionPoint, Team, User, CheckIn } from '../types';

const getApiUrl = (endpoint: string) => {
  const path = window.location.pathname;
  if (path.startsWith('/lab') || path.includes('/lab/')) {
    return `/lab/api/${endpoint}`;
  }
  if (path.startsWith('/hml') || path.includes('/hml/')) {
    return `/hml/api/${endpoint}`;
  }
  return `/api/${endpoint}`;
};

export const apiService = {
  // Regiões / Bases
  getRegions: async (): Promise<Region[]> => {
    try {
      const res = await fetch(getApiUrl('regioes.php'));
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return [];
    }
  },
  saveRegion: async (region: Region): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl('regioes.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(region)
      });
      return res.ok;
    } catch {
      return false;
    }
  },
  deleteRegion: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${getApiUrl('regioes.php')}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Pontos de Atuação
  getActionPoints: async (): Promise<ActionPoint[]> => {
    try {
      const res = await fetch(getApiUrl('pontos.php'));
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return [];
    }
  },
  saveActionPoint: async (point: ActionPoint): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl('pontos.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(point)
      });
      return res.ok;
    } catch {
      return false;
    }
  },
  deleteActionPoint: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${getApiUrl('pontos.php')}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Equipes
  getTeams: async (): Promise<Team[]> => {
    try {
      const res = await fetch(getApiUrl('equipes.php'));
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return [];
    }
  },
  saveTeam: async (team: Team): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl('equipes.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(team)
      });
      return res.ok;
    } catch {
      return false;
    }
  },
  deleteTeam: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${getApiUrl('equipes.php')}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Usuários / Coordenadores
  getUsers: async (): Promise<User[]> => {
    try {
      const res = await fetch(getApiUrl('usuarios.php'));
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return [];
    }
  },
  saveUser: async (user: User): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl('usuarios.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
      });
      return res.ok;
    } catch {
      return false;
    }
  },
  deleteUser: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${getApiUrl('usuarios.php')}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch {
      return false;
    }
  },

  // Checkins
  getCheckIns: async (): Promise<CheckIn[]> => {
    try {
      const res = await fetch(getApiUrl('checkins.php'));
      if (!res.ok) throw new Error('API Error');
      return await res.json();
    } catch {
      return [];
    }
  },
  saveCheckIn: async (checkIn: CheckIn): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl('checkins.php'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(checkIn)
      });
      return res.ok;
    } catch {
      return false;
    }
  },
  deleteCheckIn: async (id: string): Promise<boolean> => {
    try {
      const res = await fetch(`${getApiUrl('checkins.php')}?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      return res.ok;
    } catch {
      return false;
    }
  },
  
  // Reset Geral para Validação do Zero
  resetOperationalData: async (): Promise<boolean> => {
    try {
      const res = await fetch(getApiUrl('reset_data.php'), { method: 'POST' });
      return res.ok;
    } catch {
      return false;
    }
  }
};
