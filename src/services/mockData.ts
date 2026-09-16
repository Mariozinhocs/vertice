import { User, Campaign, Region, ActionPoint, Team, CheckIn, AuditLog } from '../types';

export const INITIAL_USERS: User[] = [
  {
    "id": "usr-admin",
    "name": "Mario Henrique",
    "username": "mario.henrique",
    "email": "admin@vertice.com",
    "password": "admin123",
    "mustChangePassword": false,
    "role": "admin",
    "phone": "(92) 98888-1000",
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    "active": true
  },
  {
    "id": "usr-gestor",
    "name": "Gabriel Acessos",
    "username": "gabriel.acessos",
    "email": "acessos@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "gestor_acesso",
    "phone": "(92) 98888-2000",
    "avatarUrl": "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=150",
    "active": true
  },
  {
    "id": "usr-coord-c",
    "name": "Marcelo Campbell",
    "username": "marcelo.campbell",
    "email": "marcelo.campbell@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "coordenador",
    "phone": "(92) 99999-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "active": true
  },
  {
    "id": "usr-agent-c-1-a",
    "name": "Agente A-C-1",
    "username": "agente.a.c.1",
    "email": "agente.a.c.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "teamId": "team-c-1",
    "teamName": "Equipe C-1",
    "assignedActionPointIds": [
      "pt-c-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-c-1-b",
    "name": "Agente B-C-1",
    "username": "agente.b.c.1",
    "email": "agente.b.c.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "teamId": "team-c-1",
    "teamName": "Equipe C-1",
    "assignedActionPointIds": [
      "pt-c-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-c-1-c",
    "name": "Agente C-C-1",
    "username": "agente.c.c.1",
    "email": "agente.c.c.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "teamId": "team-c-1",
    "teamName": "Equipe C-1",
    "assignedActionPointIds": [
      "pt-c-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-c-1-d",
    "name": "Agente D-C-1",
    "username": "agente.d.c.1",
    "email": "agente.d.c.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "teamId": "team-c-1",
    "teamName": "Equipe C-1",
    "assignedActionPointIds": [
      "pt-c-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-c-1-e",
    "name": "Agente E-C-1",
    "username": "agente.e.c.1",
    "email": "agente.e.c.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "teamId": "team-c-1",
    "teamName": "Equipe C-1",
    "assignedActionPointIds": [
      "pt-c-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-c-2-a",
    "name": "Agente A-C-2",
    "username": "agente.a.c.2",
    "email": "agente.a.c.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "teamId": "team-c-2",
    "teamName": "Equipe C-2",
    "assignedActionPointIds": [
      "pt-c-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-c-2-b",
    "name": "Agente B-C-2",
    "username": "agente.b.c.2",
    "email": "agente.b.c.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "teamId": "team-c-2",
    "teamName": "Equipe C-2",
    "assignedActionPointIds": [
      "pt-c-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-c-2-c",
    "name": "Agente C-C-2",
    "username": "agente.c.c.2",
    "email": "agente.c.c.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "teamId": "team-c-2",
    "teamName": "Equipe C-2",
    "assignedActionPointIds": [
      "pt-c-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-c-2-d",
    "name": "Agente D-C-2",
    "username": "agente.d.c.2",
    "email": "agente.d.c.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "teamId": "team-c-2",
    "teamName": "Equipe C-2",
    "assignedActionPointIds": [
      "pt-c-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-c-2-e",
    "name": "Agente E-C-2",
    "username": "agente.e.c.2",
    "email": "agente.e.c.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "teamId": "team-c-2",
    "teamName": "Equipe C-2",
    "assignedActionPointIds": [
      "pt-c-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-c-3-a",
    "name": "Agente A-C-3",
    "username": "agente.a.c.3",
    "email": "agente.a.c.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "teamId": "team-c-3",
    "teamName": "Equipe C-3",
    "assignedActionPointIds": [
      "pt-c-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-c-3-b",
    "name": "Agente B-C-3",
    "username": "agente.b.c.3",
    "email": "agente.b.c.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "teamId": "team-c-3",
    "teamName": "Equipe C-3",
    "assignedActionPointIds": [
      "pt-c-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-c-3-c",
    "name": "Agente C-C-3",
    "username": "agente.c.c.3",
    "email": "agente.c.c.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "teamId": "team-c-3",
    "teamName": "Equipe C-3",
    "assignedActionPointIds": [
      "pt-c-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-c-3-d",
    "name": "Agente D-C-3",
    "username": "agente.d.c.3",
    "email": "agente.d.c.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "teamId": "team-c-3",
    "teamName": "Equipe C-3",
    "assignedActionPointIds": [
      "pt-c-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-c-3-e",
    "name": "Agente E-C-3",
    "username": "agente.e.c.3",
    "email": "agente.e.c.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-c",
    "regionName": "CENTRAL",
    "teamId": "team-c-3",
    "teamName": "Equipe C-3",
    "assignedActionPointIds": [
      "pt-c-3"
    ],
    "active": true
  },
  {
    "id": "usr-coord-co",
    "name": "Sandro Maia",
    "username": "sandro.maia",
    "email": "sandro.maia@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "coordenador",
    "phone": "(92) 99999-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "active": true
  },
  {
    "id": "usr-agent-co-1-a",
    "name": "Agente A-CO-1",
    "username": "agente.a.co.1",
    "email": "agente.a.co.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "teamId": "team-co-1",
    "teamName": "Equipe CO-1",
    "assignedActionPointIds": [
      "pt-co-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-co-1-b",
    "name": "Agente B-CO-1",
    "username": "agente.b.co.1",
    "email": "agente.b.co.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "teamId": "team-co-1",
    "teamName": "Equipe CO-1",
    "assignedActionPointIds": [
      "pt-co-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-co-1-c",
    "name": "Agente C-CO-1",
    "username": "agente.c.co.1",
    "email": "agente.c.co.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "teamId": "team-co-1",
    "teamName": "Equipe CO-1",
    "assignedActionPointIds": [
      "pt-co-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-co-1-d",
    "name": "Agente D-CO-1",
    "username": "agente.d.co.1",
    "email": "agente.d.co.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "teamId": "team-co-1",
    "teamName": "Equipe CO-1",
    "assignedActionPointIds": [
      "pt-co-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-co-1-e",
    "name": "Agente E-CO-1",
    "username": "agente.e.co.1",
    "email": "agente.e.co.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "teamId": "team-co-1",
    "teamName": "Equipe CO-1",
    "assignedActionPointIds": [
      "pt-co-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-co-2-a",
    "name": "Agente A-CO-2",
    "username": "agente.a.co.2",
    "email": "agente.a.co.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "teamId": "team-co-2",
    "teamName": "Equipe CO-2",
    "assignedActionPointIds": [
      "pt-co-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-co-2-b",
    "name": "Agente B-CO-2",
    "username": "agente.b.co.2",
    "email": "agente.b.co.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "teamId": "team-co-2",
    "teamName": "Equipe CO-2",
    "assignedActionPointIds": [
      "pt-co-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-co-2-c",
    "name": "Agente C-CO-2",
    "username": "agente.c.co.2",
    "email": "agente.c.co.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "teamId": "team-co-2",
    "teamName": "Equipe CO-2",
    "assignedActionPointIds": [
      "pt-co-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-co-2-d",
    "name": "Agente D-CO-2",
    "username": "agente.d.co.2",
    "email": "agente.d.co.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "teamId": "team-co-2",
    "teamName": "Equipe CO-2",
    "assignedActionPointIds": [
      "pt-co-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-co-2-e",
    "name": "Agente E-CO-2",
    "username": "agente.e.co.2",
    "email": "agente.e.co.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "teamId": "team-co-2",
    "teamName": "Equipe CO-2",
    "assignedActionPointIds": [
      "pt-co-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-co-3-a",
    "name": "Agente A-CO-3",
    "username": "agente.a.co.3",
    "email": "agente.a.co.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "teamId": "team-co-3",
    "teamName": "Equipe CO-3",
    "assignedActionPointIds": [
      "pt-co-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-co-3-b",
    "name": "Agente B-CO-3",
    "username": "agente.b.co.3",
    "email": "agente.b.co.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "teamId": "team-co-3",
    "teamName": "Equipe CO-3",
    "assignedActionPointIds": [
      "pt-co-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-co-3-c",
    "name": "Agente C-CO-3",
    "username": "agente.c.co.3",
    "email": "agente.c.co.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "teamId": "team-co-3",
    "teamName": "Equipe CO-3",
    "assignedActionPointIds": [
      "pt-co-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-co-3-d",
    "name": "Agente D-CO-3",
    "username": "agente.d.co.3",
    "email": "agente.d.co.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "teamId": "team-co-3",
    "teamName": "Equipe CO-3",
    "assignedActionPointIds": [
      "pt-co-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-co-3-e",
    "name": "Agente E-CO-3",
    "username": "agente.e.co.3",
    "email": "agente.e.co.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-co",
    "regionName": "CENTRO-OESTE",
    "teamId": "team-co-3",
    "teamName": "Equipe CO-3",
    "assignedActionPointIds": [
      "pt-co-3"
    ],
    "active": true
  },
  {
    "id": "usr-coord-cs1",
    "name": "Emerson",
    "username": "emerson",
    "email": "emerson@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "coordenador",
    "phone": "(92) 99999-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "active": true
  },
  {
    "id": "usr-agent-cs1-1-a",
    "name": "Agente A-CS1-1",
    "username": "agente.a.cs1.1",
    "email": "agente.a.cs1.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "teamId": "team-cs1-1",
    "teamName": "Equipe CS1-1",
    "assignedActionPointIds": [
      "pt-cs1-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs1-1-b",
    "name": "Agente B-CS1-1",
    "username": "agente.b.cs1.1",
    "email": "agente.b.cs1.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "teamId": "team-cs1-1",
    "teamName": "Equipe CS1-1",
    "assignedActionPointIds": [
      "pt-cs1-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs1-1-c",
    "name": "Agente C-CS1-1",
    "username": "agente.c.cs1.1",
    "email": "agente.c.cs1.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "teamId": "team-cs1-1",
    "teamName": "Equipe CS1-1",
    "assignedActionPointIds": [
      "pt-cs1-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs1-1-d",
    "name": "Agente D-CS1-1",
    "username": "agente.d.cs1.1",
    "email": "agente.d.cs1.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "teamId": "team-cs1-1",
    "teamName": "Equipe CS1-1",
    "assignedActionPointIds": [
      "pt-cs1-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs1-1-e",
    "name": "Agente E-CS1-1",
    "username": "agente.e.cs1.1",
    "email": "agente.e.cs1.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "teamId": "team-cs1-1",
    "teamName": "Equipe CS1-1",
    "assignedActionPointIds": [
      "pt-cs1-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs1-2-a",
    "name": "Agente A-CS1-2",
    "username": "agente.a.cs1.2",
    "email": "agente.a.cs1.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "teamId": "team-cs1-2",
    "teamName": "Equipe CS1-2",
    "assignedActionPointIds": [
      "pt-cs1-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs1-2-b",
    "name": "Agente B-CS1-2",
    "username": "agente.b.cs1.2",
    "email": "agente.b.cs1.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "teamId": "team-cs1-2",
    "teamName": "Equipe CS1-2",
    "assignedActionPointIds": [
      "pt-cs1-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs1-2-c",
    "name": "Agente C-CS1-2",
    "username": "agente.c.cs1.2",
    "email": "agente.c.cs1.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "teamId": "team-cs1-2",
    "teamName": "Equipe CS1-2",
    "assignedActionPointIds": [
      "pt-cs1-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs1-2-d",
    "name": "Agente D-CS1-2",
    "username": "agente.d.cs1.2",
    "email": "agente.d.cs1.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "teamId": "team-cs1-2",
    "teamName": "Equipe CS1-2",
    "assignedActionPointIds": [
      "pt-cs1-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs1-2-e",
    "name": "Agente E-CS1-2",
    "username": "agente.e.cs1.2",
    "email": "agente.e.cs1.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "teamId": "team-cs1-2",
    "teamName": "Equipe CS1-2",
    "assignedActionPointIds": [
      "pt-cs1-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs1-3-a",
    "name": "Agente A-CS1-3",
    "username": "agente.a.cs1.3",
    "email": "agente.a.cs1.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "teamId": "team-cs1-3",
    "teamName": "Equipe CS1-3",
    "assignedActionPointIds": [
      "pt-cs1-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs1-3-b",
    "name": "Agente B-CS1-3",
    "username": "agente.b.cs1.3",
    "email": "agente.b.cs1.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "teamId": "team-cs1-3",
    "teamName": "Equipe CS1-3",
    "assignedActionPointIds": [
      "pt-cs1-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs1-3-c",
    "name": "Agente C-CS1-3",
    "username": "agente.c.cs1.3",
    "email": "agente.c.cs1.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "teamId": "team-cs1-3",
    "teamName": "Equipe CS1-3",
    "assignedActionPointIds": [
      "pt-cs1-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs1-3-d",
    "name": "Agente D-CS1-3",
    "username": "agente.d.cs1.3",
    "email": "agente.d.cs1.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "teamId": "team-cs1-3",
    "teamName": "Equipe CS1-3",
    "assignedActionPointIds": [
      "pt-cs1-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs1-3-e",
    "name": "Agente E-CS1-3",
    "username": "agente.e.cs1.3",
    "email": "agente.e.cs1.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs1",
    "regionName": "CENTRO-SUL 1",
    "teamId": "team-cs1-3",
    "teamName": "Equipe CS1-3",
    "assignedActionPointIds": [
      "pt-cs1-3"
    ],
    "active": true
  },
  {
    "id": "usr-coord-cs2",
    "name": "Juliano",
    "username": "juliano",
    "email": "juliano@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "coordenador",
    "phone": "(92) 99999-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "active": true
  },
  {
    "id": "usr-agent-cs2-1-a",
    "name": "Agente A-CS2-1",
    "username": "agente.a.cs2.1",
    "email": "agente.a.cs2.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "teamId": "team-cs2-1",
    "teamName": "Equipe CS2-1",
    "assignedActionPointIds": [
      "pt-cs2-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs2-1-b",
    "name": "Agente B-CS2-1",
    "username": "agente.b.cs2.1",
    "email": "agente.b.cs2.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "teamId": "team-cs2-1",
    "teamName": "Equipe CS2-1",
    "assignedActionPointIds": [
      "pt-cs2-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs2-1-c",
    "name": "Agente C-CS2-1",
    "username": "agente.c.cs2.1",
    "email": "agente.c.cs2.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "teamId": "team-cs2-1",
    "teamName": "Equipe CS2-1",
    "assignedActionPointIds": [
      "pt-cs2-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs2-1-d",
    "name": "Agente D-CS2-1",
    "username": "agente.d.cs2.1",
    "email": "agente.d.cs2.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "teamId": "team-cs2-1",
    "teamName": "Equipe CS2-1",
    "assignedActionPointIds": [
      "pt-cs2-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs2-1-e",
    "name": "Agente E-CS2-1",
    "username": "agente.e.cs2.1",
    "email": "agente.e.cs2.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "teamId": "team-cs2-1",
    "teamName": "Equipe CS2-1",
    "assignedActionPointIds": [
      "pt-cs2-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs2-2-a",
    "name": "Agente A-CS2-2",
    "username": "agente.a.cs2.2",
    "email": "agente.a.cs2.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "teamId": "team-cs2-2",
    "teamName": "Equipe CS2-2",
    "assignedActionPointIds": [
      "pt-cs2-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs2-2-b",
    "name": "Agente B-CS2-2",
    "username": "agente.b.cs2.2",
    "email": "agente.b.cs2.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "teamId": "team-cs2-2",
    "teamName": "Equipe CS2-2",
    "assignedActionPointIds": [
      "pt-cs2-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs2-2-c",
    "name": "Agente C-CS2-2",
    "username": "agente.c.cs2.2",
    "email": "agente.c.cs2.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "teamId": "team-cs2-2",
    "teamName": "Equipe CS2-2",
    "assignedActionPointIds": [
      "pt-cs2-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs2-2-d",
    "name": "Agente D-CS2-2",
    "username": "agente.d.cs2.2",
    "email": "agente.d.cs2.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "teamId": "team-cs2-2",
    "teamName": "Equipe CS2-2",
    "assignedActionPointIds": [
      "pt-cs2-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs2-2-e",
    "name": "Agente E-CS2-2",
    "username": "agente.e.cs2.2",
    "email": "agente.e.cs2.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "teamId": "team-cs2-2",
    "teamName": "Equipe CS2-2",
    "assignedActionPointIds": [
      "pt-cs2-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs2-3-a",
    "name": "Agente A-CS2-3",
    "username": "agente.a.cs2.3",
    "email": "agente.a.cs2.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "teamId": "team-cs2-3",
    "teamName": "Equipe CS2-3",
    "assignedActionPointIds": [
      "pt-cs2-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs2-3-b",
    "name": "Agente B-CS2-3",
    "username": "agente.b.cs2.3",
    "email": "agente.b.cs2.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "teamId": "team-cs2-3",
    "teamName": "Equipe CS2-3",
    "assignedActionPointIds": [
      "pt-cs2-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs2-3-c",
    "name": "Agente C-CS2-3",
    "username": "agente.c.cs2.3",
    "email": "agente.c.cs2.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "teamId": "team-cs2-3",
    "teamName": "Equipe CS2-3",
    "assignedActionPointIds": [
      "pt-cs2-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs2-3-d",
    "name": "Agente D-CS2-3",
    "username": "agente.d.cs2.3",
    "email": "agente.d.cs2.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "teamId": "team-cs2-3",
    "teamName": "Equipe CS2-3",
    "assignedActionPointIds": [
      "pt-cs2-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-cs2-3-e",
    "name": "Agente E-CS2-3",
    "username": "agente.e.cs2.3",
    "email": "agente.e.cs2.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-cs2",
    "regionName": "CENTRO-SUL 2",
    "teamId": "team-cs2-3",
    "teamName": "Equipe CS2-3",
    "assignedActionPointIds": [
      "pt-cs2-3"
    ],
    "active": true
  },
  {
    "id": "usr-coord-l1",
    "name": "Elanio",
    "username": "elanio",
    "email": "elanio@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "coordenador",
    "phone": "(92) 99999-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "active": true
  },
  {
    "id": "usr-agent-l1-1-a",
    "name": "Agente A-L1-1",
    "username": "agente.a.l1.1",
    "email": "agente.a.l1.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "teamId": "team-l1-1",
    "teamName": "Equipe L1-1",
    "assignedActionPointIds": [
      "pt-l1-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l1-1-b",
    "name": "Agente B-L1-1",
    "username": "agente.b.l1.1",
    "email": "agente.b.l1.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "teamId": "team-l1-1",
    "teamName": "Equipe L1-1",
    "assignedActionPointIds": [
      "pt-l1-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l1-1-c",
    "name": "Agente C-L1-1",
    "username": "agente.c.l1.1",
    "email": "agente.c.l1.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "teamId": "team-l1-1",
    "teamName": "Equipe L1-1",
    "assignedActionPointIds": [
      "pt-l1-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l1-1-d",
    "name": "Agente D-L1-1",
    "username": "agente.d.l1.1",
    "email": "agente.d.l1.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "teamId": "team-l1-1",
    "teamName": "Equipe L1-1",
    "assignedActionPointIds": [
      "pt-l1-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l1-1-e",
    "name": "Agente E-L1-1",
    "username": "agente.e.l1.1",
    "email": "agente.e.l1.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "teamId": "team-l1-1",
    "teamName": "Equipe L1-1",
    "assignedActionPointIds": [
      "pt-l1-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l1-2-a",
    "name": "Agente A-L1-2",
    "username": "agente.a.l1.2",
    "email": "agente.a.l1.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "teamId": "team-l1-2",
    "teamName": "Equipe L1-2",
    "assignedActionPointIds": [
      "pt-l1-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l1-2-b",
    "name": "Agente B-L1-2",
    "username": "agente.b.l1.2",
    "email": "agente.b.l1.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "teamId": "team-l1-2",
    "teamName": "Equipe L1-2",
    "assignedActionPointIds": [
      "pt-l1-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l1-2-c",
    "name": "Agente C-L1-2",
    "username": "agente.c.l1.2",
    "email": "agente.c.l1.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "teamId": "team-l1-2",
    "teamName": "Equipe L1-2",
    "assignedActionPointIds": [
      "pt-l1-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l1-2-d",
    "name": "Agente D-L1-2",
    "username": "agente.d.l1.2",
    "email": "agente.d.l1.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "teamId": "team-l1-2",
    "teamName": "Equipe L1-2",
    "assignedActionPointIds": [
      "pt-l1-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l1-2-e",
    "name": "Agente E-L1-2",
    "username": "agente.e.l1.2",
    "email": "agente.e.l1.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "teamId": "team-l1-2",
    "teamName": "Equipe L1-2",
    "assignedActionPointIds": [
      "pt-l1-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l1-3-a",
    "name": "Agente A-L1-3",
    "username": "agente.a.l1.3",
    "email": "agente.a.l1.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "teamId": "team-l1-3",
    "teamName": "Equipe L1-3",
    "assignedActionPointIds": [
      "pt-l1-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l1-3-b",
    "name": "Agente B-L1-3",
    "username": "agente.b.l1.3",
    "email": "agente.b.l1.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "teamId": "team-l1-3",
    "teamName": "Equipe L1-3",
    "assignedActionPointIds": [
      "pt-l1-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l1-3-c",
    "name": "Agente C-L1-3",
    "username": "agente.c.l1.3",
    "email": "agente.c.l1.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "teamId": "team-l1-3",
    "teamName": "Equipe L1-3",
    "assignedActionPointIds": [
      "pt-l1-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l1-3-d",
    "name": "Agente D-L1-3",
    "username": "agente.d.l1.3",
    "email": "agente.d.l1.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "teamId": "team-l1-3",
    "teamName": "Equipe L1-3",
    "assignedActionPointIds": [
      "pt-l1-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l1-3-e",
    "name": "Agente E-L1-3",
    "username": "agente.e.l1.3",
    "email": "agente.e.l1.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l1",
    "regionName": "LESTE 1",
    "teamId": "team-l1-3",
    "teamName": "Equipe L1-3",
    "assignedActionPointIds": [
      "pt-l1-3"
    ],
    "active": true
  },
  {
    "id": "usr-coord-l2",
    "name": "Paulo Henrique",
    "username": "paulo.henrique",
    "email": "paulo.henrique@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "coordenador",
    "phone": "(92) 99999-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "active": true
  },
  {
    "id": "usr-agent-l2-1-a",
    "name": "Agente A-L2-1",
    "username": "agente.a.l2.1",
    "email": "agente.a.l2.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "teamId": "team-l2-1",
    "teamName": "Equipe L2-1",
    "assignedActionPointIds": [
      "pt-l2-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l2-1-b",
    "name": "Agente B-L2-1",
    "username": "agente.b.l2.1",
    "email": "agente.b.l2.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "teamId": "team-l2-1",
    "teamName": "Equipe L2-1",
    "assignedActionPointIds": [
      "pt-l2-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l2-1-c",
    "name": "Agente C-L2-1",
    "username": "agente.c.l2.1",
    "email": "agente.c.l2.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "teamId": "team-l2-1",
    "teamName": "Equipe L2-1",
    "assignedActionPointIds": [
      "pt-l2-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l2-1-d",
    "name": "Agente D-L2-1",
    "username": "agente.d.l2.1",
    "email": "agente.d.l2.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "teamId": "team-l2-1",
    "teamName": "Equipe L2-1",
    "assignedActionPointIds": [
      "pt-l2-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l2-1-e",
    "name": "Agente E-L2-1",
    "username": "agente.e.l2.1",
    "email": "agente.e.l2.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "teamId": "team-l2-1",
    "teamName": "Equipe L2-1",
    "assignedActionPointIds": [
      "pt-l2-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l2-2-a",
    "name": "Agente A-L2-2",
    "username": "agente.a.l2.2",
    "email": "agente.a.l2.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "teamId": "team-l2-2",
    "teamName": "Equipe L2-2",
    "assignedActionPointIds": [
      "pt-l2-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l2-2-b",
    "name": "Agente B-L2-2",
    "username": "agente.b.l2.2",
    "email": "agente.b.l2.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "teamId": "team-l2-2",
    "teamName": "Equipe L2-2",
    "assignedActionPointIds": [
      "pt-l2-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l2-2-c",
    "name": "Agente C-L2-2",
    "username": "agente.c.l2.2",
    "email": "agente.c.l2.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "teamId": "team-l2-2",
    "teamName": "Equipe L2-2",
    "assignedActionPointIds": [
      "pt-l2-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l2-2-d",
    "name": "Agente D-L2-2",
    "username": "agente.d.l2.2",
    "email": "agente.d.l2.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "teamId": "team-l2-2",
    "teamName": "Equipe L2-2",
    "assignedActionPointIds": [
      "pt-l2-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l2-2-e",
    "name": "Agente E-L2-2",
    "username": "agente.e.l2.2",
    "email": "agente.e.l2.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "teamId": "team-l2-2",
    "teamName": "Equipe L2-2",
    "assignedActionPointIds": [
      "pt-l2-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l2-3-a",
    "name": "Agente A-L2-3",
    "username": "agente.a.l2.3",
    "email": "agente.a.l2.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "teamId": "team-l2-3",
    "teamName": "Equipe L2-3",
    "assignedActionPointIds": [
      "pt-l2-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l2-3-b",
    "name": "Agente B-L2-3",
    "username": "agente.b.l2.3",
    "email": "agente.b.l2.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "teamId": "team-l2-3",
    "teamName": "Equipe L2-3",
    "assignedActionPointIds": [
      "pt-l2-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l2-3-c",
    "name": "Agente C-L2-3",
    "username": "agente.c.l2.3",
    "email": "agente.c.l2.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "teamId": "team-l2-3",
    "teamName": "Equipe L2-3",
    "assignedActionPointIds": [
      "pt-l2-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l2-3-d",
    "name": "Agente D-L2-3",
    "username": "agente.d.l2.3",
    "email": "agente.d.l2.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "teamId": "team-l2-3",
    "teamName": "Equipe L2-3",
    "assignedActionPointIds": [
      "pt-l2-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l2-3-e",
    "name": "Agente E-L2-3",
    "username": "agente.e.l2.3",
    "email": "agente.e.l2.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l2",
    "regionName": "LESTE 2",
    "teamId": "team-l2-3",
    "teamName": "Equipe L2-3",
    "assignedActionPointIds": [
      "pt-l2-3"
    ],
    "active": true
  },
  {
    "id": "usr-coord-l3",
    "name": "Renato Queiroz",
    "username": "renato.queiroz",
    "email": "renato.queiroz@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "coordenador",
    "phone": "(92) 99999-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "active": true
  },
  {
    "id": "usr-agent-l3-1-a",
    "name": "Agente A-L3-1",
    "username": "agente.a.l3.1",
    "email": "agente.a.l3.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "teamId": "team-l3-1",
    "teamName": "Equipe L3-1",
    "assignedActionPointIds": [
      "pt-l3-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l3-1-b",
    "name": "Agente B-L3-1",
    "username": "agente.b.l3.1",
    "email": "agente.b.l3.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "teamId": "team-l3-1",
    "teamName": "Equipe L3-1",
    "assignedActionPointIds": [
      "pt-l3-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l3-1-c",
    "name": "Agente C-L3-1",
    "username": "agente.c.l3.1",
    "email": "agente.c.l3.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "teamId": "team-l3-1",
    "teamName": "Equipe L3-1",
    "assignedActionPointIds": [
      "pt-l3-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l3-1-d",
    "name": "Agente D-L3-1",
    "username": "agente.d.l3.1",
    "email": "agente.d.l3.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "teamId": "team-l3-1",
    "teamName": "Equipe L3-1",
    "assignedActionPointIds": [
      "pt-l3-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l3-1-e",
    "name": "Agente E-L3-1",
    "username": "agente.e.l3.1",
    "email": "agente.e.l3.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "teamId": "team-l3-1",
    "teamName": "Equipe L3-1",
    "assignedActionPointIds": [
      "pt-l3-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l3-2-a",
    "name": "Agente A-L3-2",
    "username": "agente.a.l3.2",
    "email": "agente.a.l3.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "teamId": "team-l3-2",
    "teamName": "Equipe L3-2",
    "assignedActionPointIds": [
      "pt-l3-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l3-2-b",
    "name": "Agente B-L3-2",
    "username": "agente.b.l3.2",
    "email": "agente.b.l3.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "teamId": "team-l3-2",
    "teamName": "Equipe L3-2",
    "assignedActionPointIds": [
      "pt-l3-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l3-2-c",
    "name": "Agente C-L3-2",
    "username": "agente.c.l3.2",
    "email": "agente.c.l3.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "teamId": "team-l3-2",
    "teamName": "Equipe L3-2",
    "assignedActionPointIds": [
      "pt-l3-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l3-2-d",
    "name": "Agente D-L3-2",
    "username": "agente.d.l3.2",
    "email": "agente.d.l3.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "teamId": "team-l3-2",
    "teamName": "Equipe L3-2",
    "assignedActionPointIds": [
      "pt-l3-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l3-2-e",
    "name": "Agente E-L3-2",
    "username": "agente.e.l3.2",
    "email": "agente.e.l3.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "teamId": "team-l3-2",
    "teamName": "Equipe L3-2",
    "assignedActionPointIds": [
      "pt-l3-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l3-3-a",
    "name": "Agente A-L3-3",
    "username": "agente.a.l3.3",
    "email": "agente.a.l3.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "teamId": "team-l3-3",
    "teamName": "Equipe L3-3",
    "assignedActionPointIds": [
      "pt-l3-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l3-3-b",
    "name": "Agente B-L3-3",
    "username": "agente.b.l3.3",
    "email": "agente.b.l3.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "teamId": "team-l3-3",
    "teamName": "Equipe L3-3",
    "assignedActionPointIds": [
      "pt-l3-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l3-3-c",
    "name": "Agente C-L3-3",
    "username": "agente.c.l3.3",
    "email": "agente.c.l3.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "teamId": "team-l3-3",
    "teamName": "Equipe L3-3",
    "assignedActionPointIds": [
      "pt-l3-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l3-3-d",
    "name": "Agente D-L3-3",
    "username": "agente.d.l3.3",
    "email": "agente.d.l3.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "teamId": "team-l3-3",
    "teamName": "Equipe L3-3",
    "assignedActionPointIds": [
      "pt-l3-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-l3-3-e",
    "name": "Agente E-L3-3",
    "username": "agente.e.l3.3",
    "email": "agente.e.l3.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-l3",
    "regionName": "LESTE 3",
    "teamId": "team-l3-3",
    "teamName": "Equipe L3-3",
    "assignedActionPointIds": [
      "pt-l3-3"
    ],
    "active": true
  },
  {
    "id": "usr-coord-n1",
    "name": "Cleuson",
    "username": "cleuson",
    "email": "cleuson@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "coordenador",
    "phone": "(92) 99999-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "active": true
  },
  {
    "id": "usr-agent-n1-1-a",
    "name": "Agente A-N1-1",
    "username": "agente.a.n1.1",
    "email": "agente.a.n1.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "teamId": "team-n1-1",
    "teamName": "Equipe N1-1",
    "assignedActionPointIds": [
      "pt-n1-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n1-1-b",
    "name": "Agente B-N1-1",
    "username": "agente.b.n1.1",
    "email": "agente.b.n1.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "teamId": "team-n1-1",
    "teamName": "Equipe N1-1",
    "assignedActionPointIds": [
      "pt-n1-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n1-1-c",
    "name": "Agente C-N1-1",
    "username": "agente.c.n1.1",
    "email": "agente.c.n1.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "teamId": "team-n1-1",
    "teamName": "Equipe N1-1",
    "assignedActionPointIds": [
      "pt-n1-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n1-1-d",
    "name": "Agente D-N1-1",
    "username": "agente.d.n1.1",
    "email": "agente.d.n1.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "teamId": "team-n1-1",
    "teamName": "Equipe N1-1",
    "assignedActionPointIds": [
      "pt-n1-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n1-1-e",
    "name": "Agente E-N1-1",
    "username": "agente.e.n1.1",
    "email": "agente.e.n1.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "teamId": "team-n1-1",
    "teamName": "Equipe N1-1",
    "assignedActionPointIds": [
      "pt-n1-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n1-2-a",
    "name": "Agente A-N1-2",
    "username": "agente.a.n1.2",
    "email": "agente.a.n1.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "teamId": "team-n1-2",
    "teamName": "Equipe N1-2",
    "assignedActionPointIds": [
      "pt-n1-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n1-2-b",
    "name": "Agente B-N1-2",
    "username": "agente.b.n1.2",
    "email": "agente.b.n1.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "teamId": "team-n1-2",
    "teamName": "Equipe N1-2",
    "assignedActionPointIds": [
      "pt-n1-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n1-2-c",
    "name": "Agente C-N1-2",
    "username": "agente.c.n1.2",
    "email": "agente.c.n1.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "teamId": "team-n1-2",
    "teamName": "Equipe N1-2",
    "assignedActionPointIds": [
      "pt-n1-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n1-2-d",
    "name": "Agente D-N1-2",
    "username": "agente.d.n1.2",
    "email": "agente.d.n1.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "teamId": "team-n1-2",
    "teamName": "Equipe N1-2",
    "assignedActionPointIds": [
      "pt-n1-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n1-2-e",
    "name": "Agente E-N1-2",
    "username": "agente.e.n1.2",
    "email": "agente.e.n1.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "teamId": "team-n1-2",
    "teamName": "Equipe N1-2",
    "assignedActionPointIds": [
      "pt-n1-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n1-3-a",
    "name": "Agente A-N1-3",
    "username": "agente.a.n1.3",
    "email": "agente.a.n1.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "teamId": "team-n1-3",
    "teamName": "Equipe N1-3",
    "assignedActionPointIds": [
      "pt-n1-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n1-3-b",
    "name": "Agente B-N1-3",
    "username": "agente.b.n1.3",
    "email": "agente.b.n1.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "teamId": "team-n1-3",
    "teamName": "Equipe N1-3",
    "assignedActionPointIds": [
      "pt-n1-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n1-3-c",
    "name": "Agente C-N1-3",
    "username": "agente.c.n1.3",
    "email": "agente.c.n1.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "teamId": "team-n1-3",
    "teamName": "Equipe N1-3",
    "assignedActionPointIds": [
      "pt-n1-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n1-3-d",
    "name": "Agente D-N1-3",
    "username": "agente.d.n1.3",
    "email": "agente.d.n1.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "teamId": "team-n1-3",
    "teamName": "Equipe N1-3",
    "assignedActionPointIds": [
      "pt-n1-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n1-3-e",
    "name": "Agente E-N1-3",
    "username": "agente.e.n1.3",
    "email": "agente.e.n1.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n1",
    "regionName": "NORTE 1",
    "teamId": "team-n1-3",
    "teamName": "Equipe N1-3",
    "assignedActionPointIds": [
      "pt-n1-3"
    ],
    "active": true
  },
  {
    "id": "usr-coord-n2",
    "name": "Aurilex",
    "username": "aurilex",
    "email": "aurilex@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "coordenador",
    "phone": "(92) 99999-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "active": true
  },
  {
    "id": "usr-agent-n2-1-a",
    "name": "Agente A-N2-1",
    "username": "agente.a.n2.1",
    "email": "agente.a.n2.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "teamId": "team-n2-1",
    "teamName": "Equipe N2-1",
    "assignedActionPointIds": [
      "pt-n2-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n2-1-b",
    "name": "Agente B-N2-1",
    "username": "agente.b.n2.1",
    "email": "agente.b.n2.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "teamId": "team-n2-1",
    "teamName": "Equipe N2-1",
    "assignedActionPointIds": [
      "pt-n2-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n2-1-c",
    "name": "Agente C-N2-1",
    "username": "agente.c.n2.1",
    "email": "agente.c.n2.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "teamId": "team-n2-1",
    "teamName": "Equipe N2-1",
    "assignedActionPointIds": [
      "pt-n2-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n2-1-d",
    "name": "Agente D-N2-1",
    "username": "agente.d.n2.1",
    "email": "agente.d.n2.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "teamId": "team-n2-1",
    "teamName": "Equipe N2-1",
    "assignedActionPointIds": [
      "pt-n2-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n2-1-e",
    "name": "Agente E-N2-1",
    "username": "agente.e.n2.1",
    "email": "agente.e.n2.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "teamId": "team-n2-1",
    "teamName": "Equipe N2-1",
    "assignedActionPointIds": [
      "pt-n2-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n2-2-a",
    "name": "Agente A-N2-2",
    "username": "agente.a.n2.2",
    "email": "agente.a.n2.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "teamId": "team-n2-2",
    "teamName": "Equipe N2-2",
    "assignedActionPointIds": [
      "pt-n2-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n2-2-b",
    "name": "Agente B-N2-2",
    "username": "agente.b.n2.2",
    "email": "agente.b.n2.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "teamId": "team-n2-2",
    "teamName": "Equipe N2-2",
    "assignedActionPointIds": [
      "pt-n2-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n2-2-c",
    "name": "Agente C-N2-2",
    "username": "agente.c.n2.2",
    "email": "agente.c.n2.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "teamId": "team-n2-2",
    "teamName": "Equipe N2-2",
    "assignedActionPointIds": [
      "pt-n2-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n2-2-d",
    "name": "Agente D-N2-2",
    "username": "agente.d.n2.2",
    "email": "agente.d.n2.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "teamId": "team-n2-2",
    "teamName": "Equipe N2-2",
    "assignedActionPointIds": [
      "pt-n2-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n2-2-e",
    "name": "Agente E-N2-2",
    "username": "agente.e.n2.2",
    "email": "agente.e.n2.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "teamId": "team-n2-2",
    "teamName": "Equipe N2-2",
    "assignedActionPointIds": [
      "pt-n2-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n2-3-a",
    "name": "Agente A-N2-3",
    "username": "agente.a.n2.3",
    "email": "agente.a.n2.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "teamId": "team-n2-3",
    "teamName": "Equipe N2-3",
    "assignedActionPointIds": [
      "pt-n2-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n2-3-b",
    "name": "Agente B-N2-3",
    "username": "agente.b.n2.3",
    "email": "agente.b.n2.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "teamId": "team-n2-3",
    "teamName": "Equipe N2-3",
    "assignedActionPointIds": [
      "pt-n2-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n2-3-c",
    "name": "Agente C-N2-3",
    "username": "agente.c.n2.3",
    "email": "agente.c.n2.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "teamId": "team-n2-3",
    "teamName": "Equipe N2-3",
    "assignedActionPointIds": [
      "pt-n2-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n2-3-d",
    "name": "Agente D-N2-3",
    "username": "agente.d.n2.3",
    "email": "agente.d.n2.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "teamId": "team-n2-3",
    "teamName": "Equipe N2-3",
    "assignedActionPointIds": [
      "pt-n2-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n2-3-e",
    "name": "Agente E-N2-3",
    "username": "agente.e.n2.3",
    "email": "agente.e.n2.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n2",
    "regionName": "NORTE 2",
    "teamId": "team-n2-3",
    "teamName": "Equipe N2-3",
    "assignedActionPointIds": [
      "pt-n2-3"
    ],
    "active": true
  },
  {
    "id": "usr-coord-n3",
    "name": "Jr. Nunes",
    "username": "jr..nunes",
    "email": "jr..nunes@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "coordenador",
    "phone": "(92) 99999-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "active": true
  },
  {
    "id": "usr-agent-n3-1-a",
    "name": "Agente A-N3-1",
    "username": "agente.a.n3.1",
    "email": "agente.a.n3.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "teamId": "team-n3-1",
    "teamName": "Equipe N3-1",
    "assignedActionPointIds": [
      "pt-n3-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n3-1-b",
    "name": "Agente B-N3-1",
    "username": "agente.b.n3.1",
    "email": "agente.b.n3.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "teamId": "team-n3-1",
    "teamName": "Equipe N3-1",
    "assignedActionPointIds": [
      "pt-n3-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n3-1-c",
    "name": "Agente C-N3-1",
    "username": "agente.c.n3.1",
    "email": "agente.c.n3.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "teamId": "team-n3-1",
    "teamName": "Equipe N3-1",
    "assignedActionPointIds": [
      "pt-n3-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n3-1-d",
    "name": "Agente D-N3-1",
    "username": "agente.d.n3.1",
    "email": "agente.d.n3.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "teamId": "team-n3-1",
    "teamName": "Equipe N3-1",
    "assignedActionPointIds": [
      "pt-n3-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n3-1-e",
    "name": "Agente E-N3-1",
    "username": "agente.e.n3.1",
    "email": "agente.e.n3.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "teamId": "team-n3-1",
    "teamName": "Equipe N3-1",
    "assignedActionPointIds": [
      "pt-n3-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n3-2-a",
    "name": "Agente A-N3-2",
    "username": "agente.a.n3.2",
    "email": "agente.a.n3.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "teamId": "team-n3-2",
    "teamName": "Equipe N3-2",
    "assignedActionPointIds": [
      "pt-n3-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n3-2-b",
    "name": "Agente B-N3-2",
    "username": "agente.b.n3.2",
    "email": "agente.b.n3.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "teamId": "team-n3-2",
    "teamName": "Equipe N3-2",
    "assignedActionPointIds": [
      "pt-n3-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n3-2-c",
    "name": "Agente C-N3-2",
    "username": "agente.c.n3.2",
    "email": "agente.c.n3.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "teamId": "team-n3-2",
    "teamName": "Equipe N3-2",
    "assignedActionPointIds": [
      "pt-n3-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n3-2-d",
    "name": "Agente D-N3-2",
    "username": "agente.d.n3.2",
    "email": "agente.d.n3.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "teamId": "team-n3-2",
    "teamName": "Equipe N3-2",
    "assignedActionPointIds": [
      "pt-n3-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n3-2-e",
    "name": "Agente E-N3-2",
    "username": "agente.e.n3.2",
    "email": "agente.e.n3.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "teamId": "team-n3-2",
    "teamName": "Equipe N3-2",
    "assignedActionPointIds": [
      "pt-n3-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n3-3-a",
    "name": "Agente A-N3-3",
    "username": "agente.a.n3.3",
    "email": "agente.a.n3.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "teamId": "team-n3-3",
    "teamName": "Equipe N3-3",
    "assignedActionPointIds": [
      "pt-n3-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n3-3-b",
    "name": "Agente B-N3-3",
    "username": "agente.b.n3.3",
    "email": "agente.b.n3.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "teamId": "team-n3-3",
    "teamName": "Equipe N3-3",
    "assignedActionPointIds": [
      "pt-n3-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n3-3-c",
    "name": "Agente C-N3-3",
    "username": "agente.c.n3.3",
    "email": "agente.c.n3.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "teamId": "team-n3-3",
    "teamName": "Equipe N3-3",
    "assignedActionPointIds": [
      "pt-n3-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n3-3-d",
    "name": "Agente D-N3-3",
    "username": "agente.d.n3.3",
    "email": "agente.d.n3.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "teamId": "team-n3-3",
    "teamName": "Equipe N3-3",
    "assignedActionPointIds": [
      "pt-n3-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n3-3-e",
    "name": "Agente E-N3-3",
    "username": "agente.e.n3.3",
    "email": "agente.e.n3.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n3",
    "regionName": "NORTE 3",
    "teamId": "team-n3-3",
    "teamName": "Equipe N3-3",
    "assignedActionPointIds": [
      "pt-n3-3"
    ],
    "active": true
  },
  {
    "id": "usr-coord-n4",
    "name": "Marcelo Botelho",
    "username": "marcelo.botelho",
    "email": "marcelo.botelho@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "coordenador",
    "phone": "(92) 99999-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "active": true
  },
  {
    "id": "usr-agent-n4-1-a",
    "name": "Agente A-N4-1",
    "username": "agente.a.n4.1",
    "email": "agente.a.n4.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "teamId": "team-n4-1",
    "teamName": "Equipe N4-1",
    "assignedActionPointIds": [
      "pt-n4-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n4-1-b",
    "name": "Agente B-N4-1",
    "username": "agente.b.n4.1",
    "email": "agente.b.n4.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "teamId": "team-n4-1",
    "teamName": "Equipe N4-1",
    "assignedActionPointIds": [
      "pt-n4-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n4-1-c",
    "name": "Agente C-N4-1",
    "username": "agente.c.n4.1",
    "email": "agente.c.n4.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "teamId": "team-n4-1",
    "teamName": "Equipe N4-1",
    "assignedActionPointIds": [
      "pt-n4-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n4-1-d",
    "name": "Agente D-N4-1",
    "username": "agente.d.n4.1",
    "email": "agente.d.n4.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "teamId": "team-n4-1",
    "teamName": "Equipe N4-1",
    "assignedActionPointIds": [
      "pt-n4-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n4-1-e",
    "name": "Agente E-N4-1",
    "username": "agente.e.n4.1",
    "email": "agente.e.n4.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "teamId": "team-n4-1",
    "teamName": "Equipe N4-1",
    "assignedActionPointIds": [
      "pt-n4-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n4-2-a",
    "name": "Agente A-N4-2",
    "username": "agente.a.n4.2",
    "email": "agente.a.n4.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "teamId": "team-n4-2",
    "teamName": "Equipe N4-2",
    "assignedActionPointIds": [
      "pt-n4-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n4-2-b",
    "name": "Agente B-N4-2",
    "username": "agente.b.n4.2",
    "email": "agente.b.n4.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "teamId": "team-n4-2",
    "teamName": "Equipe N4-2",
    "assignedActionPointIds": [
      "pt-n4-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n4-2-c",
    "name": "Agente C-N4-2",
    "username": "agente.c.n4.2",
    "email": "agente.c.n4.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "teamId": "team-n4-2",
    "teamName": "Equipe N4-2",
    "assignedActionPointIds": [
      "pt-n4-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n4-2-d",
    "name": "Agente D-N4-2",
    "username": "agente.d.n4.2",
    "email": "agente.d.n4.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "teamId": "team-n4-2",
    "teamName": "Equipe N4-2",
    "assignedActionPointIds": [
      "pt-n4-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n4-2-e",
    "name": "Agente E-N4-2",
    "username": "agente.e.n4.2",
    "email": "agente.e.n4.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "teamId": "team-n4-2",
    "teamName": "Equipe N4-2",
    "assignedActionPointIds": [
      "pt-n4-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n4-3-a",
    "name": "Agente A-N4-3",
    "username": "agente.a.n4.3",
    "email": "agente.a.n4.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "teamId": "team-n4-3",
    "teamName": "Equipe N4-3",
    "assignedActionPointIds": [
      "pt-n4-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n4-3-b",
    "name": "Agente B-N4-3",
    "username": "agente.b.n4.3",
    "email": "agente.b.n4.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "teamId": "team-n4-3",
    "teamName": "Equipe N4-3",
    "assignedActionPointIds": [
      "pt-n4-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n4-3-c",
    "name": "Agente C-N4-3",
    "username": "agente.c.n4.3",
    "email": "agente.c.n4.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "teamId": "team-n4-3",
    "teamName": "Equipe N4-3",
    "assignedActionPointIds": [
      "pt-n4-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n4-3-d",
    "name": "Agente D-N4-3",
    "username": "agente.d.n4.3",
    "email": "agente.d.n4.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "teamId": "team-n4-3",
    "teamName": "Equipe N4-3",
    "assignedActionPointIds": [
      "pt-n4-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-n4-3-e",
    "name": "Agente E-N4-3",
    "username": "agente.e.n4.3",
    "email": "agente.e.n4.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-n4",
    "regionName": "NORTE 4",
    "teamId": "team-n4-3",
    "teamName": "Equipe N4-3",
    "assignedActionPointIds": [
      "pt-n4-3"
    ],
    "active": true
  },
  {
    "id": "usr-coord-o",
    "name": "Nildo",
    "username": "nildo",
    "email": "nildo@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "coordenador",
    "phone": "(92) 99999-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "active": true
  },
  {
    "id": "usr-agent-o-1-a",
    "name": "Agente A-O-1",
    "username": "agente.a.o.1",
    "email": "agente.a.o.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "teamId": "team-o-1",
    "teamName": "Equipe O-1",
    "assignedActionPointIds": [
      "pt-o-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-o-1-b",
    "name": "Agente B-O-1",
    "username": "agente.b.o.1",
    "email": "agente.b.o.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "teamId": "team-o-1",
    "teamName": "Equipe O-1",
    "assignedActionPointIds": [
      "pt-o-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-o-1-c",
    "name": "Agente C-O-1",
    "username": "agente.c.o.1",
    "email": "agente.c.o.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "teamId": "team-o-1",
    "teamName": "Equipe O-1",
    "assignedActionPointIds": [
      "pt-o-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-o-1-d",
    "name": "Agente D-O-1",
    "username": "agente.d.o.1",
    "email": "agente.d.o.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "teamId": "team-o-1",
    "teamName": "Equipe O-1",
    "assignedActionPointIds": [
      "pt-o-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-o-1-e",
    "name": "Agente E-O-1",
    "username": "agente.e.o.1",
    "email": "agente.e.o.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "teamId": "team-o-1",
    "teamName": "Equipe O-1",
    "assignedActionPointIds": [
      "pt-o-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-o-2-a",
    "name": "Agente A-O-2",
    "username": "agente.a.o.2",
    "email": "agente.a.o.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "teamId": "team-o-2",
    "teamName": "Equipe O-2",
    "assignedActionPointIds": [
      "pt-o-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-o-2-b",
    "name": "Agente B-O-2",
    "username": "agente.b.o.2",
    "email": "agente.b.o.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "teamId": "team-o-2",
    "teamName": "Equipe O-2",
    "assignedActionPointIds": [
      "pt-o-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-o-2-c",
    "name": "Agente C-O-2",
    "username": "agente.c.o.2",
    "email": "agente.c.o.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "teamId": "team-o-2",
    "teamName": "Equipe O-2",
    "assignedActionPointIds": [
      "pt-o-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-o-2-d",
    "name": "Agente D-O-2",
    "username": "agente.d.o.2",
    "email": "agente.d.o.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "teamId": "team-o-2",
    "teamName": "Equipe O-2",
    "assignedActionPointIds": [
      "pt-o-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-o-2-e",
    "name": "Agente E-O-2",
    "username": "agente.e.o.2",
    "email": "agente.e.o.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "teamId": "team-o-2",
    "teamName": "Equipe O-2",
    "assignedActionPointIds": [
      "pt-o-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-o-3-a",
    "name": "Agente A-O-3",
    "username": "agente.a.o.3",
    "email": "agente.a.o.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "teamId": "team-o-3",
    "teamName": "Equipe O-3",
    "assignedActionPointIds": [
      "pt-o-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-o-3-b",
    "name": "Agente B-O-3",
    "username": "agente.b.o.3",
    "email": "agente.b.o.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "teamId": "team-o-3",
    "teamName": "Equipe O-3",
    "assignedActionPointIds": [
      "pt-o-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-o-3-c",
    "name": "Agente C-O-3",
    "username": "agente.c.o.3",
    "email": "agente.c.o.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "teamId": "team-o-3",
    "teamName": "Equipe O-3",
    "assignedActionPointIds": [
      "pt-o-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-o-3-d",
    "name": "Agente D-O-3",
    "username": "agente.d.o.3",
    "email": "agente.d.o.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "teamId": "team-o-3",
    "teamName": "Equipe O-3",
    "assignedActionPointIds": [
      "pt-o-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-o-3-e",
    "name": "Agente E-O-3",
    "username": "agente.e.o.3",
    "email": "agente.e.o.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-o",
    "regionName": "OESTE",
    "teamId": "team-o-3",
    "teamName": "Equipe O-3",
    "assignedActionPointIds": [
      "pt-o-3"
    ],
    "active": true
  },
  {
    "id": "usr-coord-r",
    "name": "Rosa Denise",
    "username": "rosa.denise",
    "email": "rosa.denise@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "coordenador",
    "phone": "(92) 99999-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "active": true
  },
  {
    "id": "usr-agent-r-1-a",
    "name": "Agente A-R-1",
    "username": "agente.a.r.1",
    "email": "agente.a.r.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "teamId": "team-r-1",
    "teamName": "Equipe R-1",
    "assignedActionPointIds": [
      "pt-r-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-r-1-b",
    "name": "Agente B-R-1",
    "username": "agente.b.r.1",
    "email": "agente.b.r.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "teamId": "team-r-1",
    "teamName": "Equipe R-1",
    "assignedActionPointIds": [
      "pt-r-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-r-1-c",
    "name": "Agente C-R-1",
    "username": "agente.c.r.1",
    "email": "agente.c.r.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "teamId": "team-r-1",
    "teamName": "Equipe R-1",
    "assignedActionPointIds": [
      "pt-r-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-r-1-d",
    "name": "Agente D-R-1",
    "username": "agente.d.r.1",
    "email": "agente.d.r.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "teamId": "team-r-1",
    "teamName": "Equipe R-1",
    "assignedActionPointIds": [
      "pt-r-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-r-1-e",
    "name": "Agente E-R-1",
    "username": "agente.e.r.1",
    "email": "agente.e.r.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "teamId": "team-r-1",
    "teamName": "Equipe R-1",
    "assignedActionPointIds": [
      "pt-r-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-r-2-a",
    "name": "Agente A-R-2",
    "username": "agente.a.r.2",
    "email": "agente.a.r.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "teamId": "team-r-2",
    "teamName": "Equipe R-2",
    "assignedActionPointIds": [
      "pt-r-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-r-2-b",
    "name": "Agente B-R-2",
    "username": "agente.b.r.2",
    "email": "agente.b.r.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "teamId": "team-r-2",
    "teamName": "Equipe R-2",
    "assignedActionPointIds": [
      "pt-r-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-r-2-c",
    "name": "Agente C-R-2",
    "username": "agente.c.r.2",
    "email": "agente.c.r.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "teamId": "team-r-2",
    "teamName": "Equipe R-2",
    "assignedActionPointIds": [
      "pt-r-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-r-2-d",
    "name": "Agente D-R-2",
    "username": "agente.d.r.2",
    "email": "agente.d.r.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "teamId": "team-r-2",
    "teamName": "Equipe R-2",
    "assignedActionPointIds": [
      "pt-r-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-r-2-e",
    "name": "Agente E-R-2",
    "username": "agente.e.r.2",
    "email": "agente.e.r.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "teamId": "team-r-2",
    "teamName": "Equipe R-2",
    "assignedActionPointIds": [
      "pt-r-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-r-3-a",
    "name": "Agente A-R-3",
    "username": "agente.a.r.3",
    "email": "agente.a.r.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "teamId": "team-r-3",
    "teamName": "Equipe R-3",
    "assignedActionPointIds": [
      "pt-r-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-r-3-b",
    "name": "Agente B-R-3",
    "username": "agente.b.r.3",
    "email": "agente.b.r.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "teamId": "team-r-3",
    "teamName": "Equipe R-3",
    "assignedActionPointIds": [
      "pt-r-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-r-3-c",
    "name": "Agente C-R-3",
    "username": "agente.c.r.3",
    "email": "agente.c.r.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "teamId": "team-r-3",
    "teamName": "Equipe R-3",
    "assignedActionPointIds": [
      "pt-r-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-r-3-d",
    "name": "Agente D-R-3",
    "username": "agente.d.r.3",
    "email": "agente.d.r.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "teamId": "team-r-3",
    "teamName": "Equipe R-3",
    "assignedActionPointIds": [
      "pt-r-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-r-3-e",
    "name": "Agente E-R-3",
    "username": "agente.e.r.3",
    "email": "agente.e.r.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-r",
    "regionName": "RURAL",
    "teamId": "team-r-3",
    "teamName": "Equipe R-3",
    "assignedActionPointIds": [
      "pt-r-3"
    ],
    "active": true
  },
  {
    "id": "usr-coord-s",
    "name": "Derick Almeida",
    "username": "derick.almeida",
    "email": "derick.almeida@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "coordenador",
    "phone": "(92) 99999-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "active": true
  },
  {
    "id": "usr-agent-s-1-a",
    "name": "Agente A-S-1",
    "username": "agente.a.s.1",
    "email": "agente.a.s.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "teamId": "team-s-1",
    "teamName": "Equipe S-1",
    "assignedActionPointIds": [
      "pt-s-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-s-1-b",
    "name": "Agente B-S-1",
    "username": "agente.b.s.1",
    "email": "agente.b.s.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "teamId": "team-s-1",
    "teamName": "Equipe S-1",
    "assignedActionPointIds": [
      "pt-s-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-s-1-c",
    "name": "Agente C-S-1",
    "username": "agente.c.s.1",
    "email": "agente.c.s.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "teamId": "team-s-1",
    "teamName": "Equipe S-1",
    "assignedActionPointIds": [
      "pt-s-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-s-1-d",
    "name": "Agente D-S-1",
    "username": "agente.d.s.1",
    "email": "agente.d.s.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "teamId": "team-s-1",
    "teamName": "Equipe S-1",
    "assignedActionPointIds": [
      "pt-s-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-s-1-e",
    "name": "Agente E-S-1",
    "username": "agente.e.s.1",
    "email": "agente.e.s.1@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "teamId": "team-s-1",
    "teamName": "Equipe S-1",
    "assignedActionPointIds": [
      "pt-s-1"
    ],
    "active": true
  },
  {
    "id": "usr-agent-s-2-a",
    "name": "Agente A-S-2",
    "username": "agente.a.s.2",
    "email": "agente.a.s.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "teamId": "team-s-2",
    "teamName": "Equipe S-2",
    "assignedActionPointIds": [
      "pt-s-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-s-2-b",
    "name": "Agente B-S-2",
    "username": "agente.b.s.2",
    "email": "agente.b.s.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "teamId": "team-s-2",
    "teamName": "Equipe S-2",
    "assignedActionPointIds": [
      "pt-s-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-s-2-c",
    "name": "Agente C-S-2",
    "username": "agente.c.s.2",
    "email": "agente.c.s.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "teamId": "team-s-2",
    "teamName": "Equipe S-2",
    "assignedActionPointIds": [
      "pt-s-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-s-2-d",
    "name": "Agente D-S-2",
    "username": "agente.d.s.2",
    "email": "agente.d.s.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "teamId": "team-s-2",
    "teamName": "Equipe S-2",
    "assignedActionPointIds": [
      "pt-s-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-s-2-e",
    "name": "Agente E-S-2",
    "username": "agente.e.s.2",
    "email": "agente.e.s.2@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "teamId": "team-s-2",
    "teamName": "Equipe S-2",
    "assignedActionPointIds": [
      "pt-s-2"
    ],
    "active": true
  },
  {
    "id": "usr-agent-s-3-a",
    "name": "Agente A-S-3",
    "username": "agente.a.s.3",
    "email": "agente.a.s.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "teamId": "team-s-3",
    "teamName": "Equipe S-3",
    "assignedActionPointIds": [
      "pt-s-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-s-3-b",
    "name": "Agente B-S-3",
    "username": "agente.b.s.3",
    "email": "agente.b.s.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "teamId": "team-s-3",
    "teamName": "Equipe S-3",
    "assignedActionPointIds": [
      "pt-s-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-s-3-c",
    "name": "Agente C-S-3",
    "username": "agente.c.s.3",
    "email": "agente.c.s.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "teamId": "team-s-3",
    "teamName": "Equipe S-3",
    "assignedActionPointIds": [
      "pt-s-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-s-3-d",
    "name": "Agente D-S-3",
    "username": "agente.d.s.3",
    "email": "agente.d.s.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "teamId": "team-s-3",
    "teamName": "Equipe S-3",
    "assignedActionPointIds": [
      "pt-s-3"
    ],
    "active": true
  },
  {
    "id": "usr-agent-s-3-e",
    "name": "Agente E-S-3",
    "username": "agente.e.s.3",
    "email": "agente.e.s.3@vertice.com",
    "password": "vertice2026",
    "mustChangePassword": false,
    "role": "campo",
    "phone": "(92) 98888-0000",
    "regionId": "reg-s",
    "regionName": "SUL",
    "teamId": "team-s-3",
    "teamName": "Equipe S-3",
    "assignedActionPointIds": [
      "pt-s-3"
    ],
    "active": true
  }
];

export const INITIAL_CAMPAIGNS: Campaign[] = [
  {
    id: 'cmp-manaus-2026',
    name: 'Campanha David Almeida - Avante Manaus',
    description: 'Operação de mobilização e auditoria de campo por zonas eleitorais em Manaus - AM.',
    candidateName: 'David Almeida - 70',
    cityState: 'Manaus - AM',
    startDate: '2026-08-01',
    endDate: '2026-10-04',
    status: 'ativa'
  }
];

export const INITIAL_REGIONS: Region[] = [
  {
    "id": "reg-c",
    "campaignId": "cmp-manaus-2026",
    "name": "CENTRAL",
    "description": "Base Operacional CENTRAL",
    "color": "#6366f1"
  },
  {
    "id": "reg-co",
    "campaignId": "cmp-manaus-2026",
    "name": "CENTRO-OESTE",
    "description": "Base Operacional CENTRO-OESTE",
    "color": "#eab308"
  },
  {
    "id": "reg-cs1",
    "campaignId": "cmp-manaus-2026",
    "name": "CENTRO-SUL 1",
    "description": "Base Operacional CENTRO-SUL 1",
    "color": "#8b5cf6"
  },
  {
    "id": "reg-cs2",
    "campaignId": "cmp-manaus-2026",
    "name": "CENTRO-SUL 2",
    "description": "Base Operacional CENTRO-SUL 2",
    "color": "#a855f7"
  },
  {
    "id": "reg-l1",
    "campaignId": "cmp-manaus-2026",
    "name": "LESTE 1",
    "description": "Base Operacional LESTE 1",
    "color": "#f97316"
  },
  {
    "id": "reg-l2",
    "campaignId": "cmp-manaus-2026",
    "name": "LESTE 2",
    "description": "Base Operacional LESTE 2",
    "color": "#ff6b00"
  },
  {
    "id": "reg-l3",
    "campaignId": "cmp-manaus-2026",
    "name": "LESTE 3",
    "description": "Base Operacional LESTE 3",
    "color": "#d97706"
  },
  {
    "id": "reg-n1",
    "campaignId": "cmp-manaus-2026",
    "name": "NORTE 1",
    "description": "Base Operacional NORTE 1",
    "color": "#3b82f6"
  },
  {
    "id": "reg-n2",
    "campaignId": "cmp-manaus-2026",
    "name": "NORTE 2",
    "description": "Base Operacional NORTE 2",
    "color": "#06b6d4"
  },
  {
    "id": "reg-n3",
    "campaignId": "cmp-manaus-2026",
    "name": "NORTE 3",
    "description": "Base Operacional NORTE 3",
    "color": "#0ea5e9"
  },
  {
    "id": "reg-n4",
    "campaignId": "cmp-manaus-2026",
    "name": "NORTE 4",
    "description": "Base Operacional NORTE 4",
    "color": "#2563eb"
  },
  {
    "id": "reg-o",
    "campaignId": "cmp-manaus-2026",
    "name": "OESTE",
    "description": "Base Operacional OESTE",
    "color": "#10b981"
  },
  {
    "id": "reg-r",
    "campaignId": "cmp-manaus-2026",
    "name": "RURAL",
    "description": "Base Operacional RURAL",
    "color": "#84cc16"
  },
  {
    "id": "reg-s",
    "campaignId": "cmp-manaus-2026",
    "name": "SUL",
    "description": "Base Operacional SUL",
    "color": "#ec4899"
  }
];

export const INITIAL_ACTION_POINTS: ActionPoint[] = [
  {
    "id": "pt-c-1",
    "regionId": "reg-c",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação C-1 (CENTRAL)",
    "description": "Operação de Campo em CENTRAL - Equipe C-1",
    "address": "Av. Principal de CENTRAL, Ponto 1 - Manaus AM",
    "latitude": -3.1366,
    "longitude": -60.0282,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-c-1",
    "assignedTeamName": "Equipe C-1",
    "status": "ativo"
  },
  {
    "id": "pt-c-2",
    "regionId": "reg-c",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação C-2 (CENTRAL)",
    "description": "Operação de Campo em CENTRAL - Equipe C-2",
    "address": "Av. Principal de CENTRAL, Ponto 2 - Manaus AM",
    "latitude": -3.1316,
    "longitude": -60.0232,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-c-2",
    "assignedTeamName": "Equipe C-2",
    "status": "ativo"
  },
  {
    "id": "pt-c-3",
    "regionId": "reg-c",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação C-3 (CENTRAL)",
    "description": "Operação de Campo em CENTRAL - Equipe C-3",
    "address": "Av. Principal de CENTRAL, Ponto 3 - Manaus AM",
    "latitude": -3.1266,
    "longitude": -60.0182,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-c-3",
    "assignedTeamName": "Equipe C-3",
    "status": "ativo"
  },
  {
    "id": "pt-co-1",
    "regionId": "reg-co",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação CO-1 (CENTRO-OESTE)",
    "description": "Operação de Campo em CENTRO-OESTE - Equipe CO-1",
    "address": "Av. Principal de CENTRO-OESTE, Ponto 1 - Manaus AM",
    "latitude": -3.0935,
    "longitude": -60.057,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-co-1",
    "assignedTeamName": "Equipe CO-1",
    "status": "ativo"
  },
  {
    "id": "pt-co-2",
    "regionId": "reg-co",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação CO-2 (CENTRO-OESTE)",
    "description": "Operação de Campo em CENTRO-OESTE - Equipe CO-2",
    "address": "Av. Principal de CENTRO-OESTE, Ponto 2 - Manaus AM",
    "latitude": -3.0885,
    "longitude": -60.052,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-co-2",
    "assignedTeamName": "Equipe CO-2",
    "status": "ativo"
  },
  {
    "id": "pt-co-3",
    "regionId": "reg-co",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação CO-3 (CENTRO-OESTE)",
    "description": "Operação de Campo em CENTRO-OESTE - Equipe CO-3",
    "address": "Av. Principal de CENTRO-OESTE, Ponto 3 - Manaus AM",
    "latitude": -3.0835,
    "longitude": -60.047,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-co-3",
    "assignedTeamName": "Equipe CO-3",
    "status": "ativo"
  },
  {
    "id": "pt-cs1-1",
    "regionId": "reg-cs1",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação CS1-1 (CENTRO-SUL 1)",
    "description": "Operação de Campo em CENTRO-SUL 1 - Equipe CS1-1",
    "address": "Av. Principal de CENTRO-SUL 1, Ponto 1 - Manaus AM",
    "latitude": -3.109,
    "longitude": -60.02,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-cs1-1",
    "assignedTeamName": "Equipe CS1-1",
    "status": "ativo"
  },
  {
    "id": "pt-cs1-2",
    "regionId": "reg-cs1",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação CS1-2 (CENTRO-SUL 1)",
    "description": "Operação de Campo em CENTRO-SUL 1 - Equipe CS1-2",
    "address": "Av. Principal de CENTRO-SUL 1, Ponto 2 - Manaus AM",
    "latitude": -3.104,
    "longitude": -60.015,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-cs1-2",
    "assignedTeamName": "Equipe CS1-2",
    "status": "ativo"
  },
  {
    "id": "pt-cs1-3",
    "regionId": "reg-cs1",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação CS1-3 (CENTRO-SUL 1)",
    "description": "Operação de Campo em CENTRO-SUL 1 - Equipe CS1-3",
    "address": "Av. Principal de CENTRO-SUL 1, Ponto 3 - Manaus AM",
    "latitude": -3.099,
    "longitude": -60.01,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-cs1-3",
    "assignedTeamName": "Equipe CS1-3",
    "status": "ativo"
  },
  {
    "id": "pt-cs2-1",
    "regionId": "reg-cs2",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação CS2-1 (CENTRO-SUL 2)",
    "description": "Operação de Campo em CENTRO-SUL 2 - Equipe CS2-1",
    "address": "Av. Principal de CENTRO-SUL 2, Ponto 1 - Manaus AM",
    "latitude": -3.09,
    "longitude": -60.023,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-cs2-1",
    "assignedTeamName": "Equipe CS2-1",
    "status": "ativo"
  },
  {
    "id": "pt-cs2-2",
    "regionId": "reg-cs2",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação CS2-2 (CENTRO-SUL 2)",
    "description": "Operação de Campo em CENTRO-SUL 2 - Equipe CS2-2",
    "address": "Av. Principal de CENTRO-SUL 2, Ponto 2 - Manaus AM",
    "latitude": -3.085,
    "longitude": -60.018,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-cs2-2",
    "assignedTeamName": "Equipe CS2-2",
    "status": "ativo"
  },
  {
    "id": "pt-cs2-3",
    "regionId": "reg-cs2",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação CS2-3 (CENTRO-SUL 2)",
    "description": "Operação de Campo em CENTRO-SUL 2 - Equipe CS2-3",
    "address": "Av. Principal de CENTRO-SUL 2, Ponto 3 - Manaus AM",
    "latitude": -3.08,
    "longitude": -60.013,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-cs2-3",
    "assignedTeamName": "Equipe CS2-3",
    "status": "ativo"
  },
  {
    "id": "pt-l1-1",
    "regionId": "reg-l1",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação L1-1 (LESTE 1)",
    "description": "Operação de Campo em LESTE 1 - Equipe L1-1",
    "address": "Av. Principal de LESTE 1, Ponto 1 - Manaus AM",
    "latitude": -3.081,
    "longitude": -59.96,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-l1-1",
    "assignedTeamName": "Equipe L1-1",
    "status": "ativo"
  },
  {
    "id": "pt-l1-2",
    "regionId": "reg-l1",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação L1-2 (LESTE 1)",
    "description": "Operação de Campo em LESTE 1 - Equipe L1-2",
    "address": "Av. Principal de LESTE 1, Ponto 2 - Manaus AM",
    "latitude": -3.076,
    "longitude": -59.955,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-l1-2",
    "assignedTeamName": "Equipe L1-2",
    "status": "ativo"
  },
  {
    "id": "pt-l1-3",
    "regionId": "reg-l1",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação L1-3 (LESTE 1)",
    "description": "Operação de Campo em LESTE 1 - Equipe L1-3",
    "address": "Av. Principal de LESTE 1, Ponto 3 - Manaus AM",
    "latitude": -3.071,
    "longitude": -59.95,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-l1-3",
    "assignedTeamName": "Equipe L1-3",
    "status": "ativo"
  },
  {
    "id": "pt-l2-1",
    "regionId": "reg-l2",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação L2-1 (LESTE 2)",
    "description": "Operação de Campo em LESTE 2 - Equipe L2-1",
    "address": "Av. Principal de LESTE 2, Ponto 1 - Manaus AM",
    "latitude": -3.06,
    "longitude": -59.943,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-l2-1",
    "assignedTeamName": "Equipe L2-1",
    "status": "ativo"
  },
  {
    "id": "pt-l2-2",
    "regionId": "reg-l2",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação L2-2 (LESTE 2)",
    "description": "Operação de Campo em LESTE 2 - Equipe L2-2",
    "address": "Av. Principal de LESTE 2, Ponto 2 - Manaus AM",
    "latitude": -3.055,
    "longitude": -59.938,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-l2-2",
    "assignedTeamName": "Equipe L2-2",
    "status": "ativo"
  },
  {
    "id": "pt-l2-3",
    "regionId": "reg-l2",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação L2-3 (LESTE 2)",
    "description": "Operação de Campo em LESTE 2 - Equipe L2-3",
    "address": "Av. Principal de LESTE 2, Ponto 3 - Manaus AM",
    "latitude": -3.05,
    "longitude": -59.933,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-l2-3",
    "assignedTeamName": "Equipe L2-3",
    "status": "ativo"
  },
  {
    "id": "pt-l3-1",
    "regionId": "reg-l3",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação L3-1 (LESTE 3)",
    "description": "Operação de Campo em LESTE 3 - Equipe L3-1",
    "address": "Av. Principal de LESTE 3, Ponto 1 - Manaus AM",
    "latitude": -3.043,
    "longitude": -59.925,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-l3-1",
    "assignedTeamName": "Equipe L3-1",
    "status": "ativo"
  },
  {
    "id": "pt-l3-2",
    "regionId": "reg-l3",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação L3-2 (LESTE 3)",
    "description": "Operação de Campo em LESTE 3 - Equipe L3-2",
    "address": "Av. Principal de LESTE 3, Ponto 2 - Manaus AM",
    "latitude": -3.038,
    "longitude": -59.92,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-l3-2",
    "assignedTeamName": "Equipe L3-2",
    "status": "ativo"
  },
  {
    "id": "pt-l3-3",
    "regionId": "reg-l3",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação L3-3 (LESTE 3)",
    "description": "Operação de Campo em LESTE 3 - Equipe L3-3",
    "address": "Av. Principal de LESTE 3, Ponto 3 - Manaus AM",
    "latitude": -3.033,
    "longitude": -59.915,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-l3-3",
    "assignedTeamName": "Equipe L3-3",
    "status": "ativo"
  },
  {
    "id": "pt-n1-1",
    "regionId": "reg-n1",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação N1-1 (NORTE 1)",
    "description": "Operação de Campo em NORTE 1 - Equipe N1-1",
    "address": "Av. Principal de NORTE 1, Ponto 1 - Manaus AM",
    "latitude": -3.03,
    "longitude": -59.985,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-n1-1",
    "assignedTeamName": "Equipe N1-1",
    "status": "ativo"
  },
  {
    "id": "pt-n1-2",
    "regionId": "reg-n1",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação N1-2 (NORTE 1)",
    "description": "Operação de Campo em NORTE 1 - Equipe N1-2",
    "address": "Av. Principal de NORTE 1, Ponto 2 - Manaus AM",
    "latitude": -3.025,
    "longitude": -59.98,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-n1-2",
    "assignedTeamName": "Equipe N1-2",
    "status": "ativo"
  },
  {
    "id": "pt-n1-3",
    "regionId": "reg-n1",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação N1-3 (NORTE 1)",
    "description": "Operação de Campo em NORTE 1 - Equipe N1-3",
    "address": "Av. Principal de NORTE 1, Ponto 3 - Manaus AM",
    "latitude": -3.02,
    "longitude": -59.975,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-n1-3",
    "assignedTeamName": "Equipe N1-3",
    "status": "ativo"
  },
  {
    "id": "pt-n2-1",
    "regionId": "reg-n2",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação N2-1 (NORTE 2)",
    "description": "Operação de Campo em NORTE 2 - Equipe N2-1",
    "address": "Av. Principal de NORTE 2, Ponto 1 - Manaus AM",
    "latitude": -3.003,
    "longitude": -60,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-n2-1",
    "assignedTeamName": "Equipe N2-1",
    "status": "ativo"
  },
  {
    "id": "pt-n2-2",
    "regionId": "reg-n2",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação N2-2 (NORTE 2)",
    "description": "Operação de Campo em NORTE 2 - Equipe N2-2",
    "address": "Av. Principal de NORTE 2, Ponto 2 - Manaus AM",
    "latitude": -2.998,
    "longitude": -59.995,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-n2-2",
    "assignedTeamName": "Equipe N2-2",
    "status": "ativo"
  },
  {
    "id": "pt-n2-3",
    "regionId": "reg-n2",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação N2-3 (NORTE 2)",
    "description": "Operação de Campo em NORTE 2 - Equipe N2-3",
    "address": "Av. Principal de NORTE 2, Ponto 3 - Manaus AM",
    "latitude": -2.993,
    "longitude": -59.99,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-n2-3",
    "assignedTeamName": "Equipe N2-3",
    "status": "ativo"
  },
  {
    "id": "pt-n3-1",
    "regionId": "reg-n3",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação N3-1 (NORTE 3)",
    "description": "Operação de Campo em NORTE 3 - Equipe N3-1",
    "address": "Av. Principal de NORTE 3, Ponto 1 - Manaus AM",
    "latitude": -3.02,
    "longitude": -59.945,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-n3-1",
    "assignedTeamName": "Equipe N3-1",
    "status": "ativo"
  },
  {
    "id": "pt-n3-2",
    "regionId": "reg-n3",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação N3-2 (NORTE 3)",
    "description": "Operação de Campo em NORTE 3 - Equipe N3-2",
    "address": "Av. Principal de NORTE 3, Ponto 2 - Manaus AM",
    "latitude": -3.015,
    "longitude": -59.94,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-n3-2",
    "assignedTeamName": "Equipe N3-2",
    "status": "ativo"
  },
  {
    "id": "pt-n3-3",
    "regionId": "reg-n3",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação N3-3 (NORTE 3)",
    "description": "Operação de Campo em NORTE 3 - Equipe N3-3",
    "address": "Av. Principal de NORTE 3, Ponto 3 - Manaus AM",
    "latitude": -3.01,
    "longitude": -59.935,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-n3-3",
    "assignedTeamName": "Equipe N3-3",
    "status": "ativo"
  },
  {
    "id": "pt-n4-1",
    "regionId": "reg-n4",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação N4-1 (NORTE 4)",
    "description": "Operação de Campo em NORTE 4 - Equipe N4-1",
    "address": "Av. Principal de NORTE 4, Ponto 1 - Manaus AM",
    "latitude": -2.98,
    "longitude": -60.015,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-n4-1",
    "assignedTeamName": "Equipe N4-1",
    "status": "ativo"
  },
  {
    "id": "pt-n4-2",
    "regionId": "reg-n4",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação N4-2 (NORTE 4)",
    "description": "Operação de Campo em NORTE 4 - Equipe N4-2",
    "address": "Av. Principal de NORTE 4, Ponto 2 - Manaus AM",
    "latitude": -2.975,
    "longitude": -60.01,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-n4-2",
    "assignedTeamName": "Equipe N4-2",
    "status": "ativo"
  },
  {
    "id": "pt-n4-3",
    "regionId": "reg-n4",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação N4-3 (NORTE 4)",
    "description": "Operação de Campo em NORTE 4 - Equipe N4-3",
    "address": "Av. Principal de NORTE 4, Ponto 3 - Manaus AM",
    "latitude": -2.97,
    "longitude": -60.005,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-n4-3",
    "assignedTeamName": "Equipe N4-3",
    "status": "ativo"
  },
  {
    "id": "pt-o-1",
    "regionId": "reg-o",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação O-1 (OESTE)",
    "description": "Operação de Campo em OESTE - Equipe O-1",
    "address": "Av. Principal de OESTE, Ponto 1 - Manaus AM",
    "latitude": -3.087,
    "longitude": -60.085,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-o-1",
    "assignedTeamName": "Equipe O-1",
    "status": "ativo"
  },
  {
    "id": "pt-o-2",
    "regionId": "reg-o",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação O-2 (OESTE)",
    "description": "Operação de Campo em OESTE - Equipe O-2",
    "address": "Av. Principal de OESTE, Ponto 2 - Manaus AM",
    "latitude": -3.082,
    "longitude": -60.08,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-o-2",
    "assignedTeamName": "Equipe O-2",
    "status": "ativo"
  },
  {
    "id": "pt-o-3",
    "regionId": "reg-o",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação O-3 (OESTE)",
    "description": "Operação de Campo em OESTE - Equipe O-3",
    "address": "Av. Principal de OESTE, Ponto 3 - Manaus AM",
    "latitude": -3.077,
    "longitude": -60.075,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-o-3",
    "assignedTeamName": "Equipe O-3",
    "status": "ativo"
  },
  {
    "id": "pt-r-1",
    "regionId": "reg-r",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação R-1 (RURAL)",
    "description": "Operação de Campo em RURAL - Equipe R-1",
    "address": "Av. Principal de RURAL, Ponto 1 - Manaus AM",
    "latitude": -2.925,
    "longitude": -60.035,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-r-1",
    "assignedTeamName": "Equipe R-1",
    "status": "ativo"
  },
  {
    "id": "pt-r-2",
    "regionId": "reg-r",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação R-2 (RURAL)",
    "description": "Operação de Campo em RURAL - Equipe R-2",
    "address": "Av. Principal de RURAL, Ponto 2 - Manaus AM",
    "latitude": -2.92,
    "longitude": -60.03,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-r-2",
    "assignedTeamName": "Equipe R-2",
    "status": "ativo"
  },
  {
    "id": "pt-r-3",
    "regionId": "reg-r",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação R-3 (RURAL)",
    "description": "Operação de Campo em RURAL - Equipe R-3",
    "address": "Av. Principal de RURAL, Ponto 3 - Manaus AM",
    "latitude": -2.915,
    "longitude": -60.025,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-r-3",
    "assignedTeamName": "Equipe R-3",
    "status": "ativo"
  },
  {
    "id": "pt-s-1",
    "regionId": "reg-s",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação S-1 (SUL)",
    "description": "Operação de Campo em SUL - Equipe S-1",
    "address": "Av. Principal de SUL, Ponto 1 - Manaus AM",
    "latitude": -3.147,
    "longitude": -60.017,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-s-1",
    "assignedTeamName": "Equipe S-1",
    "status": "ativo"
  },
  {
    "id": "pt-s-2",
    "regionId": "reg-s",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação S-2 (SUL)",
    "description": "Operação de Campo em SUL - Equipe S-2",
    "address": "Av. Principal de SUL, Ponto 2 - Manaus AM",
    "latitude": -3.142,
    "longitude": -60.012,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-s-2",
    "assignedTeamName": "Equipe S-2",
    "status": "ativo"
  },
  {
    "id": "pt-s-3",
    "regionId": "reg-s",
    "campaignId": "cmp-manaus-2026",
    "name": "Ponto de Ação S-3 (SUL)",
    "description": "Operação de Campo em SUL - Equipe S-3",
    "address": "Av. Principal de SUL, Ponto 3 - Manaus AM",
    "latitude": -3.137,
    "longitude": -60.007,
    "radiusMeters": 100,
    "scheduledDate": "2026-09-16",
    "startTime": "08:00",
    "endTime": "18:00",
    "assignedTeamId": "team-s-3",
    "assignedTeamName": "Equipe S-3",
    "status": "ativo"
  }
];

export const INITIAL_TEAMS: Team[] = [
  {
    "id": "team-c-1",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-c",
    "coordinatorName": "Marcelo Campbell",
    "name": "Equipe C-1",
    "regionId": "reg-c",
    "assignedPointIds": [
      "pt-c-1"
    ],
    "members": [
      {
        "id": "mbr-c-1-a",
        "name": "Agente A-C-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-c-1-b",
        "name": "Agente B-C-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-c-1-c",
        "name": "Agente C-C-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-c-1-d",
        "name": "Agente D-C-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-c-1-e",
        "name": "Agente E-C-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-c-2",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-c",
    "coordinatorName": "Marcelo Campbell",
    "name": "Equipe C-2",
    "regionId": "reg-c",
    "assignedPointIds": [
      "pt-c-2"
    ],
    "members": [
      {
        "id": "mbr-c-2-a",
        "name": "Agente A-C-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-c-2-b",
        "name": "Agente B-C-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-c-2-c",
        "name": "Agente C-C-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-c-2-d",
        "name": "Agente D-C-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-c-2-e",
        "name": "Agente E-C-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-c-3",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-c",
    "coordinatorName": "Marcelo Campbell",
    "name": "Equipe C-3",
    "regionId": "reg-c",
    "assignedPointIds": [
      "pt-c-3"
    ],
    "members": [
      {
        "id": "mbr-c-3-a",
        "name": "Agente A-C-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-c-3-b",
        "name": "Agente B-C-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-c-3-c",
        "name": "Agente C-C-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-c-3-d",
        "name": "Agente D-C-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-c-3-e",
        "name": "Agente E-C-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-co-1",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-co",
    "coordinatorName": "Sandro Maia",
    "name": "Equipe CO-1",
    "regionId": "reg-co",
    "assignedPointIds": [
      "pt-co-1"
    ],
    "members": [
      {
        "id": "mbr-co-1-a",
        "name": "Agente A-CO-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-co-1-b",
        "name": "Agente B-CO-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-co-1-c",
        "name": "Agente C-CO-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-co-1-d",
        "name": "Agente D-CO-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-co-1-e",
        "name": "Agente E-CO-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-co-2",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-co",
    "coordinatorName": "Sandro Maia",
    "name": "Equipe CO-2",
    "regionId": "reg-co",
    "assignedPointIds": [
      "pt-co-2"
    ],
    "members": [
      {
        "id": "mbr-co-2-a",
        "name": "Agente A-CO-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-co-2-b",
        "name": "Agente B-CO-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-co-2-c",
        "name": "Agente C-CO-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-co-2-d",
        "name": "Agente D-CO-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-co-2-e",
        "name": "Agente E-CO-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-co-3",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-co",
    "coordinatorName": "Sandro Maia",
    "name": "Equipe CO-3",
    "regionId": "reg-co",
    "assignedPointIds": [
      "pt-co-3"
    ],
    "members": [
      {
        "id": "mbr-co-3-a",
        "name": "Agente A-CO-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-co-3-b",
        "name": "Agente B-CO-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-co-3-c",
        "name": "Agente C-CO-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-co-3-d",
        "name": "Agente D-CO-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-co-3-e",
        "name": "Agente E-CO-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-cs1-1",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-cs1",
    "coordinatorName": "Emerson",
    "name": "Equipe CS1-1",
    "regionId": "reg-cs1",
    "assignedPointIds": [
      "pt-cs1-1"
    ],
    "members": [
      {
        "id": "mbr-cs1-1-a",
        "name": "Agente A-CS1-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs1-1-b",
        "name": "Agente B-CS1-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs1-1-c",
        "name": "Agente C-CS1-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs1-1-d",
        "name": "Agente D-CS1-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs1-1-e",
        "name": "Agente E-CS1-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-cs1-2",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-cs1",
    "coordinatorName": "Emerson",
    "name": "Equipe CS1-2",
    "regionId": "reg-cs1",
    "assignedPointIds": [
      "pt-cs1-2"
    ],
    "members": [
      {
        "id": "mbr-cs1-2-a",
        "name": "Agente A-CS1-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs1-2-b",
        "name": "Agente B-CS1-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs1-2-c",
        "name": "Agente C-CS1-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs1-2-d",
        "name": "Agente D-CS1-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs1-2-e",
        "name": "Agente E-CS1-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-cs1-3",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-cs1",
    "coordinatorName": "Emerson",
    "name": "Equipe CS1-3",
    "regionId": "reg-cs1",
    "assignedPointIds": [
      "pt-cs1-3"
    ],
    "members": [
      {
        "id": "mbr-cs1-3-a",
        "name": "Agente A-CS1-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs1-3-b",
        "name": "Agente B-CS1-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs1-3-c",
        "name": "Agente C-CS1-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs1-3-d",
        "name": "Agente D-CS1-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs1-3-e",
        "name": "Agente E-CS1-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-cs2-1",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-cs2",
    "coordinatorName": "Juliano",
    "name": "Equipe CS2-1",
    "regionId": "reg-cs2",
    "assignedPointIds": [
      "pt-cs2-1"
    ],
    "members": [
      {
        "id": "mbr-cs2-1-a",
        "name": "Agente A-CS2-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs2-1-b",
        "name": "Agente B-CS2-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs2-1-c",
        "name": "Agente C-CS2-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs2-1-d",
        "name": "Agente D-CS2-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs2-1-e",
        "name": "Agente E-CS2-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-cs2-2",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-cs2",
    "coordinatorName": "Juliano",
    "name": "Equipe CS2-2",
    "regionId": "reg-cs2",
    "assignedPointIds": [
      "pt-cs2-2"
    ],
    "members": [
      {
        "id": "mbr-cs2-2-a",
        "name": "Agente A-CS2-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs2-2-b",
        "name": "Agente B-CS2-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs2-2-c",
        "name": "Agente C-CS2-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs2-2-d",
        "name": "Agente D-CS2-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs2-2-e",
        "name": "Agente E-CS2-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-cs2-3",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-cs2",
    "coordinatorName": "Juliano",
    "name": "Equipe CS2-3",
    "regionId": "reg-cs2",
    "assignedPointIds": [
      "pt-cs2-3"
    ],
    "members": [
      {
        "id": "mbr-cs2-3-a",
        "name": "Agente A-CS2-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs2-3-b",
        "name": "Agente B-CS2-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs2-3-c",
        "name": "Agente C-CS2-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs2-3-d",
        "name": "Agente D-CS2-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-cs2-3-e",
        "name": "Agente E-CS2-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-l1-1",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-l1",
    "coordinatorName": "Elanio",
    "name": "Equipe L1-1",
    "regionId": "reg-l1",
    "assignedPointIds": [
      "pt-l1-1"
    ],
    "members": [
      {
        "id": "mbr-l1-1-a",
        "name": "Agente A-L1-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l1-1-b",
        "name": "Agente B-L1-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l1-1-c",
        "name": "Agente C-L1-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l1-1-d",
        "name": "Agente D-L1-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l1-1-e",
        "name": "Agente E-L1-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-l1-2",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-l1",
    "coordinatorName": "Elanio",
    "name": "Equipe L1-2",
    "regionId": "reg-l1",
    "assignedPointIds": [
      "pt-l1-2"
    ],
    "members": [
      {
        "id": "mbr-l1-2-a",
        "name": "Agente A-L1-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l1-2-b",
        "name": "Agente B-L1-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l1-2-c",
        "name": "Agente C-L1-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l1-2-d",
        "name": "Agente D-L1-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l1-2-e",
        "name": "Agente E-L1-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-l1-3",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-l1",
    "coordinatorName": "Elanio",
    "name": "Equipe L1-3",
    "regionId": "reg-l1",
    "assignedPointIds": [
      "pt-l1-3"
    ],
    "members": [
      {
        "id": "mbr-l1-3-a",
        "name": "Agente A-L1-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l1-3-b",
        "name": "Agente B-L1-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l1-3-c",
        "name": "Agente C-L1-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l1-3-d",
        "name": "Agente D-L1-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l1-3-e",
        "name": "Agente E-L1-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-l2-1",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-l2",
    "coordinatorName": "Paulo Henrique",
    "name": "Equipe L2-1",
    "regionId": "reg-l2",
    "assignedPointIds": [
      "pt-l2-1"
    ],
    "members": [
      {
        "id": "mbr-l2-1-a",
        "name": "Agente A-L2-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l2-1-b",
        "name": "Agente B-L2-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l2-1-c",
        "name": "Agente C-L2-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l2-1-d",
        "name": "Agente D-L2-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l2-1-e",
        "name": "Agente E-L2-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-l2-2",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-l2",
    "coordinatorName": "Paulo Henrique",
    "name": "Equipe L2-2",
    "regionId": "reg-l2",
    "assignedPointIds": [
      "pt-l2-2"
    ],
    "members": [
      {
        "id": "mbr-l2-2-a",
        "name": "Agente A-L2-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l2-2-b",
        "name": "Agente B-L2-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l2-2-c",
        "name": "Agente C-L2-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l2-2-d",
        "name": "Agente D-L2-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l2-2-e",
        "name": "Agente E-L2-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-l2-3",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-l2",
    "coordinatorName": "Paulo Henrique",
    "name": "Equipe L2-3",
    "regionId": "reg-l2",
    "assignedPointIds": [
      "pt-l2-3"
    ],
    "members": [
      {
        "id": "mbr-l2-3-a",
        "name": "Agente A-L2-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l2-3-b",
        "name": "Agente B-L2-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l2-3-c",
        "name": "Agente C-L2-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l2-3-d",
        "name": "Agente D-L2-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l2-3-e",
        "name": "Agente E-L2-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-l3-1",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-l3",
    "coordinatorName": "Renato Queiroz",
    "name": "Equipe L3-1",
    "regionId": "reg-l3",
    "assignedPointIds": [
      "pt-l3-1"
    ],
    "members": [
      {
        "id": "mbr-l3-1-a",
        "name": "Agente A-L3-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l3-1-b",
        "name": "Agente B-L3-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l3-1-c",
        "name": "Agente C-L3-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l3-1-d",
        "name": "Agente D-L3-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l3-1-e",
        "name": "Agente E-L3-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-l3-2",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-l3",
    "coordinatorName": "Renato Queiroz",
    "name": "Equipe L3-2",
    "regionId": "reg-l3",
    "assignedPointIds": [
      "pt-l3-2"
    ],
    "members": [
      {
        "id": "mbr-l3-2-a",
        "name": "Agente A-L3-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l3-2-b",
        "name": "Agente B-L3-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l3-2-c",
        "name": "Agente C-L3-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l3-2-d",
        "name": "Agente D-L3-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l3-2-e",
        "name": "Agente E-L3-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-l3-3",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-l3",
    "coordinatorName": "Renato Queiroz",
    "name": "Equipe L3-3",
    "regionId": "reg-l3",
    "assignedPointIds": [
      "pt-l3-3"
    ],
    "members": [
      {
        "id": "mbr-l3-3-a",
        "name": "Agente A-L3-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l3-3-b",
        "name": "Agente B-L3-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l3-3-c",
        "name": "Agente C-L3-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l3-3-d",
        "name": "Agente D-L3-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-l3-3-e",
        "name": "Agente E-L3-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-n1-1",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-n1",
    "coordinatorName": "Cleuson",
    "name": "Equipe N1-1",
    "regionId": "reg-n1",
    "assignedPointIds": [
      "pt-n1-1"
    ],
    "members": [
      {
        "id": "mbr-n1-1-a",
        "name": "Agente A-N1-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n1-1-b",
        "name": "Agente B-N1-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n1-1-c",
        "name": "Agente C-N1-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n1-1-d",
        "name": "Agente D-N1-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n1-1-e",
        "name": "Agente E-N1-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-n1-2",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-n1",
    "coordinatorName": "Cleuson",
    "name": "Equipe N1-2",
    "regionId": "reg-n1",
    "assignedPointIds": [
      "pt-n1-2"
    ],
    "members": [
      {
        "id": "mbr-n1-2-a",
        "name": "Agente A-N1-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n1-2-b",
        "name": "Agente B-N1-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n1-2-c",
        "name": "Agente C-N1-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n1-2-d",
        "name": "Agente D-N1-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n1-2-e",
        "name": "Agente E-N1-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-n1-3",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-n1",
    "coordinatorName": "Cleuson",
    "name": "Equipe N1-3",
    "regionId": "reg-n1",
    "assignedPointIds": [
      "pt-n1-3"
    ],
    "members": [
      {
        "id": "mbr-n1-3-a",
        "name": "Agente A-N1-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n1-3-b",
        "name": "Agente B-N1-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n1-3-c",
        "name": "Agente C-N1-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n1-3-d",
        "name": "Agente D-N1-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n1-3-e",
        "name": "Agente E-N1-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-n2-1",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-n2",
    "coordinatorName": "Aurilex",
    "name": "Equipe N2-1",
    "regionId": "reg-n2",
    "assignedPointIds": [
      "pt-n2-1"
    ],
    "members": [
      {
        "id": "mbr-n2-1-a",
        "name": "Agente A-N2-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n2-1-b",
        "name": "Agente B-N2-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n2-1-c",
        "name": "Agente C-N2-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n2-1-d",
        "name": "Agente D-N2-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n2-1-e",
        "name": "Agente E-N2-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-n2-2",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-n2",
    "coordinatorName": "Aurilex",
    "name": "Equipe N2-2",
    "regionId": "reg-n2",
    "assignedPointIds": [
      "pt-n2-2"
    ],
    "members": [
      {
        "id": "mbr-n2-2-a",
        "name": "Agente A-N2-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n2-2-b",
        "name": "Agente B-N2-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n2-2-c",
        "name": "Agente C-N2-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n2-2-d",
        "name": "Agente D-N2-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n2-2-e",
        "name": "Agente E-N2-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-n2-3",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-n2",
    "coordinatorName": "Aurilex",
    "name": "Equipe N2-3",
    "regionId": "reg-n2",
    "assignedPointIds": [
      "pt-n2-3"
    ],
    "members": [
      {
        "id": "mbr-n2-3-a",
        "name": "Agente A-N2-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n2-3-b",
        "name": "Agente B-N2-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n2-3-c",
        "name": "Agente C-N2-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n2-3-d",
        "name": "Agente D-N2-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n2-3-e",
        "name": "Agente E-N2-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-n3-1",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-n3",
    "coordinatorName": "Jr. Nunes",
    "name": "Equipe N3-1",
    "regionId": "reg-n3",
    "assignedPointIds": [
      "pt-n3-1"
    ],
    "members": [
      {
        "id": "mbr-n3-1-a",
        "name": "Agente A-N3-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n3-1-b",
        "name": "Agente B-N3-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n3-1-c",
        "name": "Agente C-N3-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n3-1-d",
        "name": "Agente D-N3-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n3-1-e",
        "name": "Agente E-N3-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-n3-2",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-n3",
    "coordinatorName": "Jr. Nunes",
    "name": "Equipe N3-2",
    "regionId": "reg-n3",
    "assignedPointIds": [
      "pt-n3-2"
    ],
    "members": [
      {
        "id": "mbr-n3-2-a",
        "name": "Agente A-N3-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n3-2-b",
        "name": "Agente B-N3-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n3-2-c",
        "name": "Agente C-N3-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n3-2-d",
        "name": "Agente D-N3-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n3-2-e",
        "name": "Agente E-N3-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-n3-3",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-n3",
    "coordinatorName": "Jr. Nunes",
    "name": "Equipe N3-3",
    "regionId": "reg-n3",
    "assignedPointIds": [
      "pt-n3-3"
    ],
    "members": [
      {
        "id": "mbr-n3-3-a",
        "name": "Agente A-N3-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n3-3-b",
        "name": "Agente B-N3-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n3-3-c",
        "name": "Agente C-N3-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n3-3-d",
        "name": "Agente D-N3-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n3-3-e",
        "name": "Agente E-N3-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-n4-1",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-n4",
    "coordinatorName": "Marcelo Botelho",
    "name": "Equipe N4-1",
    "regionId": "reg-n4",
    "assignedPointIds": [
      "pt-n4-1"
    ],
    "members": [
      {
        "id": "mbr-n4-1-a",
        "name": "Agente A-N4-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n4-1-b",
        "name": "Agente B-N4-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n4-1-c",
        "name": "Agente C-N4-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n4-1-d",
        "name": "Agente D-N4-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n4-1-e",
        "name": "Agente E-N4-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-n4-2",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-n4",
    "coordinatorName": "Marcelo Botelho",
    "name": "Equipe N4-2",
    "regionId": "reg-n4",
    "assignedPointIds": [
      "pt-n4-2"
    ],
    "members": [
      {
        "id": "mbr-n4-2-a",
        "name": "Agente A-N4-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n4-2-b",
        "name": "Agente B-N4-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n4-2-c",
        "name": "Agente C-N4-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n4-2-d",
        "name": "Agente D-N4-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n4-2-e",
        "name": "Agente E-N4-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-n4-3",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-n4",
    "coordinatorName": "Marcelo Botelho",
    "name": "Equipe N4-3",
    "regionId": "reg-n4",
    "assignedPointIds": [
      "pt-n4-3"
    ],
    "members": [
      {
        "id": "mbr-n4-3-a",
        "name": "Agente A-N4-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n4-3-b",
        "name": "Agente B-N4-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n4-3-c",
        "name": "Agente C-N4-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n4-3-d",
        "name": "Agente D-N4-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-n4-3-e",
        "name": "Agente E-N4-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-o-1",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-o",
    "coordinatorName": "Nildo",
    "name": "Equipe O-1",
    "regionId": "reg-o",
    "assignedPointIds": [
      "pt-o-1"
    ],
    "members": [
      {
        "id": "mbr-o-1-a",
        "name": "Agente A-O-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-o-1-b",
        "name": "Agente B-O-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-o-1-c",
        "name": "Agente C-O-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-o-1-d",
        "name": "Agente D-O-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-o-1-e",
        "name": "Agente E-O-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-o-2",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-o",
    "coordinatorName": "Nildo",
    "name": "Equipe O-2",
    "regionId": "reg-o",
    "assignedPointIds": [
      "pt-o-2"
    ],
    "members": [
      {
        "id": "mbr-o-2-a",
        "name": "Agente A-O-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-o-2-b",
        "name": "Agente B-O-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-o-2-c",
        "name": "Agente C-O-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-o-2-d",
        "name": "Agente D-O-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-o-2-e",
        "name": "Agente E-O-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-o-3",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-o",
    "coordinatorName": "Nildo",
    "name": "Equipe O-3",
    "regionId": "reg-o",
    "assignedPointIds": [
      "pt-o-3"
    ],
    "members": [
      {
        "id": "mbr-o-3-a",
        "name": "Agente A-O-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-o-3-b",
        "name": "Agente B-O-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-o-3-c",
        "name": "Agente C-O-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-o-3-d",
        "name": "Agente D-O-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-o-3-e",
        "name": "Agente E-O-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-r-1",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-r",
    "coordinatorName": "Rosa Denise",
    "name": "Equipe R-1",
    "regionId": "reg-r",
    "assignedPointIds": [
      "pt-r-1"
    ],
    "members": [
      {
        "id": "mbr-r-1-a",
        "name": "Agente A-R-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-r-1-b",
        "name": "Agente B-R-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-r-1-c",
        "name": "Agente C-R-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-r-1-d",
        "name": "Agente D-R-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-r-1-e",
        "name": "Agente E-R-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-r-2",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-r",
    "coordinatorName": "Rosa Denise",
    "name": "Equipe R-2",
    "regionId": "reg-r",
    "assignedPointIds": [
      "pt-r-2"
    ],
    "members": [
      {
        "id": "mbr-r-2-a",
        "name": "Agente A-R-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-r-2-b",
        "name": "Agente B-R-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-r-2-c",
        "name": "Agente C-R-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-r-2-d",
        "name": "Agente D-R-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-r-2-e",
        "name": "Agente E-R-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-r-3",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-r",
    "coordinatorName": "Rosa Denise",
    "name": "Equipe R-3",
    "regionId": "reg-r",
    "assignedPointIds": [
      "pt-r-3"
    ],
    "members": [
      {
        "id": "mbr-r-3-a",
        "name": "Agente A-R-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-r-3-b",
        "name": "Agente B-R-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-r-3-c",
        "name": "Agente C-R-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-r-3-d",
        "name": "Agente D-R-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-r-3-e",
        "name": "Agente E-R-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-s-1",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-s",
    "coordinatorName": "Derick Almeida",
    "name": "Equipe S-1",
    "regionId": "reg-s",
    "assignedPointIds": [
      "pt-s-1"
    ],
    "members": [
      {
        "id": "mbr-s-1-a",
        "name": "Agente A-S-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-s-1-b",
        "name": "Agente B-S-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-s-1-c",
        "name": "Agente C-S-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-s-1-d",
        "name": "Agente D-S-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-s-1-e",
        "name": "Agente E-S-1",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-s-2",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-s",
    "coordinatorName": "Derick Almeida",
    "name": "Equipe S-2",
    "regionId": "reg-s",
    "assignedPointIds": [
      "pt-s-2"
    ],
    "members": [
      {
        "id": "mbr-s-2-a",
        "name": "Agente A-S-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-s-2-b",
        "name": "Agente B-S-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-s-2-c",
        "name": "Agente C-S-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-s-2-d",
        "name": "Agente D-S-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-s-2-e",
        "name": "Agente E-S-2",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  },
  {
    "id": "team-s-3",
    "campaignId": "cmp-manaus-2026",
    "coordinatorId": "usr-coord-s",
    "coordinatorName": "Derick Almeida",
    "name": "Equipe S-3",
    "regionId": "reg-s",
    "assignedPointIds": [
      "pt-s-3"
    ],
    "members": [
      {
        "id": "mbr-s-3-a",
        "name": "Agente A-S-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-s-3-b",
        "name": "Agente B-S-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-s-3-c",
        "name": "Agente C-S-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-s-3-d",
        "name": "Agente D-S-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      },
      {
        "id": "mbr-s-3-e",
        "name": "Agente E-S-3",
        "role": "Agente de Campo",
        "phone": "(92) 98888-0000"
      }
    ],
    "status": "ativa"
  }
];

export const INITIAL_CHECKINS: CheckIn[] = [];

export const INITIAL_AUDIT_LOGS: AuditLog[] = [];
