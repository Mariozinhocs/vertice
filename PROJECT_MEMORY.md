# 🧠 Project Memory — SGO Vértice

Documento de memória do projeto Vértice para referência de arquitetura, padrões, ambientes e convenções operacionais.

---

## 📌 Visão Geral do Sistema
O **Vértice** é um **Sistema de Gestão Operacional (SGO)** voltado para campanhas e operações de campo. A aplicação é construída como um **PWA (Progressive Web App)** responsivo e offline-first.

* **Frontend:** React 18, TypeScript, Tailwind CSS, Vite, Lucide Icons.
* **Backend:** API REST em PHP 8.x + Banco de Dados MySQL (Hostinger).
* **Persistência Offline:** Dexie.js (IndexedDB) + LocalStorage Cache.

---

## 🌐 Ambientes & Infraestrutura

| Ambiente | Subdiretório | URL do Sistema | Script de Deploy Automatizado |
| :--- | :--- | :--- | :--- |
| **LAB (Laboratório)** | `/lab` | `https://vertice.hubdigital360.com/lab` | `.\deploy-lab.ps1` |
| **HML (Homologação)** | `/hml` | `https://vertice.hubdigital360.com/hml` | `.\deploy-hml.ps1` |
| **PROD (Produção)** | `/` *(raiz)* | `https://vertice.hubdigital360.com/` | `.\deploy-prod.ps1` |

---

## 🔐 Níveis de Acesso & Perfis (RBAC)

1. **Super Admin / Admin:** Acesso total aos painéis de gestão, cadastro de usuários, zonas, campanhas, relatórios com exportação PDF/Excel/CSV e mapas operacionais.
2. **Coordenador:** Gestão de equipes atribuídas, validação de check-ins de campo, envio de avisos em tempo real e monitoramento de pontos de ação da sua zona.
3. **Operador de Campo:** Acesso móvel otimizado, registro de check-in com foto e geolocalização EXIF, termos de aceite/disclaimer e funcionamento offline.
4. **Auditor:** Leitura e auditoria de logs de sistema e histórico de alterações em tempo real.

---

## 🛠️ Arquitetura de Código & Módulos

```text
├── api/                           <- API REST em PHP 8 (MySQL)
│   ├── checkins.php               <- Endpoints de Check-in e fotos
│   ├── equipes.php                <- Endpoints de Gestão de Equipes
│   ├── pontos.php                 <- Endpoints de Pontos de Ação
│   ├── regioes.php                <- Endpoints de Zonas/Regiões
│   ├── usuarios.php               <- Autenticação e Perfis
│   └── database/schema.sql        <- Estrutura do Banco de Dados
├── src/
│   ├── components/
│   │   ├── admin/                 <- Modais CRUD (User, Region, Team, ActionPoint)
│   │   ├── auth/                  <- LoginScreen, ChangePassword, Disclaimer
│   │   ├── coordinator/           <- Painel e Fluxo de Check-in
│   │   ├── field/                 <- Interface móbile de campo
│   │   └── common/                <- Componentes reutilizáveis
│   ├── services/
│   │   ├── apiService.ts          <- Comunicação com a API PHP / Fallback Mock
│   │   ├── offlineStorage.ts      <- Banco offline IndexedDB (Dexie)
│   │   ├── imageService.ts        <- Compressão e geolocalização de fotos
│   │   └── reportService.ts       <- Exportação de relatórios
│   └── types/index.ts             <- Definições de Tipos TypeScript
```

---

## 📷 Convenção dos Ícones de Câmera & Status de Horário (CameraStatusBadge)

Cada equipe e ponto de ação exibe uma miniatura/badge com ícone de câmera dinâmico ao lado do nome (nas listagens, nos cards e na **FICHA DA EQUIPE**):

1. **⚪ Câmera Cinza (`BEFORE_SCHEDULE`):**
   * **Condição:** A hora atual é *anterior* ao horário agendado de início da ação (ex: antes das `08:00`) ou a data agendada é futura.
   * **Comportamento ao Clicar:** Exibe modal informativo com o horário previsto para liberação do check-in.

2. **🔴 Câmera Vermelha / Pulsante (`IN_SCHEDULE_NO_CHECKIN`):**
   * **Condição:** A hora atual já está *no horário da ação* (ex: entre `08:00` e `18:00`), mas o check-in fotográfico *ainda não foi realizado*.
   * **Comportamento ao Clicar:** Exibe alerta em destaque sobre pendência de check-in em ação em andamento.

3. **🟢 Câmera Verde / Miniatura da Foto (`CHECKIN_DONE`):**
   * **Condição:** O check-in com evidência fotográfica foi *realizado com sucesso* para a equipe no dia.
   * **Comportamento ao Clicar:** Abre diretamente a imagem georreferenciada em tamanho expandido com dados de auditoria GPS.

---

## ⚡ Comandos Úteis

* **Desenvolvimento Local:** `npm run dev`
* **Compilação de Produção:** `npm run build`
* **Deploy para LAB:** `.\deploy-lab.ps1`
* **Deploy para HML:** `.\deploy-hml.ps1`
* **Deploy para PROD:** `.\deploy-prod.ps1`
* **Sincronização Git:** `git add .` -> `git commit -m "..."` -> `git push origin master`
