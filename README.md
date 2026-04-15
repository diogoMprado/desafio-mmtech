# 🗺️ Trip Planner — Desafio MMTECH

Sistema de planejamento de rotas de viagem com mapa interativo, cálculo de distância e tempo entre destinos.

![Node.js](https://img.shields.io/badge/Node.js-20-339933?logo=node.js)
![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-4169E1?logo=postgresql)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?logo=docker)
![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?logo=typescript)

---

## Funcionalidades

- ✅ **CRUD completo** de destinos (adicionar, editar, excluir)
- ✅ **Busca de cidades** com autocomplete via OpenRouteService Geocoding
- ✅ **Mapa interativo** (Leaflet + OpenStreetMap) com marcadores e rota traçada
- ✅ **Drag-and-drop** para reordenar destinos livremente
- ✅ **Cálculo de distância e tempo** entre cada trecho (via API OpenRouteService Directions)
- ✅ **Resumo total** da viagem (distância em km + tempo estimado)
- ✅ **Validações** nos formulários (campos obrigatórios, coordenadas válidas)
- ✅ **Layout responsivo** (desktop e mobile)
- ✅ **Docker Compose** — sobe tudo com um comando

---

## Arquitetura

```
desafio-mmtech/
├── backend/             # Node.js + Express + TypeScript + Sequelize
│   ├── src/
│   │   ├── config/      # Configuração do Sequelize/PostgreSQL
│   │   ├── controllers/ # Lógica dos endpoints
│   │   ├── middlewares/  # Validações + error handler
│   │   ├── models/      # Modelo Destination (Sequelize)
│   │   ├── routes/      # Rotas Express
│   │   └── services/    # Integração OpenRouteService
│   └── tests/           # Testes com Jest + Supertest
├── frontend/            # Angular 17 (standalone components)
│   └── src/app/
│       ├── components/  # Form, List (drag-drop), Map, Summary
│       ├── models/      # Interfaces TypeScript
│       └── services/    # HTTP client
├── docker-compose.yml   # PostgreSQL + Backend + Frontend
└── README.md
```

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Backend | **Node.js 20** + Express 4 + TypeScript |
| ORM | **Sequelize 6** |
| Banco de dados | **PostgreSQL 16** |
| Frontend | **Angular 17** (standalone components) |
| UI | **Angular Material 17** |
| Mapa | **Leaflet** + OpenStreetMap |
| Drag & drop | **Angular CDK** DragDrop |
| API de rotas | **OpenRouteService** (gratuita) |
| Testes | **Jest** + Supertest |
| Containerização | **Docker** + Docker Compose |

---

## Pré-requisitos

- [Docker](https://docs.docker.com/get-docker/) e [Docker Compose](https://docs.docker.com/compose/) instalados
- Uma API key gratuita do [OpenRouteService](https://openrouteservice.org/dev/#/signup)

---

## Como rodar (Docker — recomendado)

```bash
# 1. Clone o repositório
git clone https://github.com/diogoMprado/desafio-mmtech.git
cd desafio-mmtech

# 2. Configure a API key
cp .env.example .env
# Edite .env e insira sua ORS_API_KEY

# 3. Suba tudo
docker compose up --build

# 4. Acesse
# Frontend: http://localhost:4200
# Backend:  http://localhost:3000/api/health
```

---

## Como rodar (manual — sem Docker)

### Backend

```bash
cd backend
npm install

# Inicie um PostgreSQL local e configure as variáveis:
export DB_HOST=localhost
export DB_PORT=5432
export DB_USER=tripplanner
export DB_PASSWORD=tripplanner123
export DB_NAME=tripplannerdb
export ORS_API_KEY=sua_chave_aqui

npm run dev
# Rodando em http://localhost:3000
```

### Frontend

```bash
cd frontend
npm install
npm start
# Rodando em http://localhost:4200 (proxy para backend em :3000)
```

---

## Testes

```bash
cd backend
npm test
```

Os testes usam SQLite in-memory — não precisam de PostgreSQL rodando.

---

## Endpoints da API

| Método | Rota | Descrição |
|--------|------|-----------|
| `GET` | `/api/health` | Health check |
| `GET` | `/api/destinations` | Listar destinos (ordenados) |
| `POST` | `/api/destinations` | Criar destino |
| `PUT` | `/api/destinations/:id` | Atualizar destino |
| `DELETE` | `/api/destinations/:id` | Excluir destino (re-indexa ordem) |
| `PUT` | `/api/destinations/reorder` | Reordenar destinos |
| `GET` | `/api/route` | Calcular rota completa (distância + tempo) |
| `GET` | `/api/geocode?q=` | Buscar cidades (autocomplete) |

---

## Modelo de Dados

```sql
CREATE TABLE destinations (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    latitude    DECIMAL(10, 7) NOT NULL,
    longitude   DECIMAL(10, 7) NOT NULL,
    sort_order  INTEGER NOT NULL DEFAULT 0,
    created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## Decisões técnicas

- **Angular 17 Standalone** — componentes sem NgModule, padrão moderno
- **Sequelize** — ORM robusto para PostgreSQL, com validações integradas no modelo
- **OpenRouteService** — API gratuita (2000 req/dia), sem necessidade de cartão de crédito
- **Leaflet** — leve e open-source, sem dependência do Google Maps
- **SQLite in-memory nos testes** — rápido, sem infraestrutura externa
- **Docker multi-stage build** — imagens otimizadas para produção

---

## Autor

**Diogo Messias do Prado**
- GitHub: [github.com/diogoMprado](https://github.com/diogoMprado)
- LinkedIn: [linkedin.com/in/diogo-messias-do-prado-479a552a6](https://linkedin.com/in/diogo-messias-do-prado-479a552a6)
- Email: devdiogoprado@gmail.com
