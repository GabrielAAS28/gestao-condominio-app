# Gestão de Condomínio — Mobile App

[![React Native](https://img.shields.io/badge/React%20Native-0.80-61DAFB?logo=react&logoColor=white)](https://reactnative.dev/)
[![React](https://img.shields.io/badge/React-19.1-61DAFB?logo=react&logoColor=white)](https://react.dev/)
[![Node](https://img.shields.io/badge/Node-%3E%3D18-339933?logo=node.js&logoColor=white)](https://nodejs.org/)
[![License](https://img.shields.io/badge/license-Private-lightgrey)](#)

Aplicativo mobile (Android/iOS) que digitaliza a operação de um condomínio: reservas de áreas comuns, comunicados, ocorrências, encomendas, visitantes e cobranças. Construído em **React Native** sobre uma API **NestJS + PostgreSQL** (repositório separado).

---

## Sumário

- [Visão geral](#visão-geral)
- [Funcionalidades](#funcionalidades)
- [Arquitetura](#arquitetura)
- [Stack](#stack)
- [Pré-requisitos](#pré-requisitos)
- [Setup local](#setup-local)
- [Estrutura de pastas](#estrutura-de-pastas)
- [Seed do banco](#seed-do-banco)
- [Usuários de teste](#usuários-de-teste)
- [Scripts disponíveis](#scripts-disponíveis)
- [Roadmap](#roadmap)
- [Contribuindo](#contribuindo)

---

## Visão geral

O app é dividido em dois módulos:

| Módulo | Público | Recursos principais |
|--------|---------|---------------------|
| **Painel do Morador** | Proprietários, locatários | Reservas, cobranças, comunicados, ocorrências, perfil |
| **Painel do Gestor** | Síndicos, admin global, funcionários | Aprovação de reservas, gestão de áreas comuns, ocorrências, visitantes, encomendas |

A navegação principal é um **drawer** que decide o módulo conforme as `roles` do usuário no JWT (`ROLE_SINDICO_<id>`, `ROLE_ADMIN_<id>`, etc.) ou a flag `pesIsGlobalAdmin`.

## Funcionalidades

### Morador
- 🏠 **Início**: feed de comunicados com leitura confirmada
- 📅 **Reservas**: listagem de áreas comuns, criação, acompanhamento e cancelamento
- 💰 **Cobranças**: condomínio, gás e taxas de reserva (Pix / Boleto, copia-e-cola e compartilhar)
- ⚠️ **Ocorrências**: abertura e acompanhamento de chamados (manutenção, barulho, conflitos)
- 👤 **Perfil**: dados pessoais, troca de senha, dados do condomínio

### Gestão (síndico/admin)
- ✅ Aprovação/rejeição de reservas pendentes
- 🏢 CRUD de **áreas comuns** com turnos, capacidade, taxa, termos de uso e antecedência
- 📦 Encomendas (registro e retirada)
- 👋 Visitantes (entrada/saída com autorização do morador)
- 📣 Comunicados direcionados (todos, proprietários, inquilinos, funcionários)

## Arquitetura

```
┌────────────────────┐       HTTPS / JWT        ┌───────────────────────┐
│  React Native App  │ ───────────────────────▶ │  NestJS REST API      │
│  (Android / iOS)   │                          │  (api-gestao-condo)   │
└────────────────────┘                          └──────────┬────────────┘
        │                                                  │ Prisma
        │ AsyncStorage (token + user)                      ▼
        │                                       ┌───────────────────────┐
        ▼                                       │   PostgreSQL          │
   styled-components / StyleSheet               └───────────────────────┘
```

- **Auth**: JWT com refresh token, persistido em `AsyncStorage`. Refresh automático no `axios` interceptor.
- **Navegação**: `@react-navigation` (Drawer + Bottom Tabs + Native Stack).
- **HTTP**: `axios` com base URL configurável (`src/services/api.js`).
- **State**: Context API (`AuthContext`, `CondominioContext`).
- **Estilo**: misto de `styled-components` (módulos novos) e `StyleSheet` (módulos legados).

## Stack

**Mobile**

| Categoria | Biblioteca |
|-----------|-----------|
| Framework | React Native 0.80, React 19 |
| Navegação | React Navigation 7 (drawer / bottom-tabs / native-stack) |
| HTTP | Axios |
| Storage | `@react-native-async-storage/async-storage` |
| UI | `styled-components`, `react-native-vector-icons`, `react-native-reanimated` |
| Datas | `date-fns` (locale `pt-BR`) |
| Notificações | `react-native-push-notification` |
| Mídia | `react-native-image-picker` |

**Backend** (repo separado)

NestJS · Prisma · PostgreSQL · JWT · bcrypt

## Pré-requisitos

- **Node.js 18+** e npm
- **JDK 17** (Android)
- **Android Studio** com SDK 34+ e um emulador/AVD configurado, **ou** um dispositivo físico com depuração USB
- **Xcode 15+** + CocoaPods (apenas iOS)
- API rodando localmente (ver repositório `api-gestao-condominio`)

## Setup local

```bash
git clone https://github.com/GabrielAAS28/gestao-condominio-app
cd gestao-condominio-app

# 1. Instalar dependências
npm install

# 2. (iOS) instalar pods
cd ios && pod install && cd ..

# 3. Configurar URL da API em src/services/api.js
#    (por padrão: http://10.0.2.2:3000 para emulador Android)

# 4. Subir o Metro bundler
npm start

# 5. Em outro terminal:
npm run android    # Android
npm run ios        # iOS
```

> **Dica:** se o Metro estiver com cache antigo, use `npm start -- --reset-cache`.

## Estrutura de pastas

```
src/
├── contexts/                # AuthContext, CondominioContext
├── routes/                  # auth.routes.js, app.routes.js
├── screens/
│   ├── Home/
│   ├── Reservas/            # lista (áreas comuns / minhas reservas)
│   ├── CriarReserva/        # picker de área → encaminha para FazerReserva
│   ├── FazerReserva/        # formulário completo de reserva
│   ├── Cobrancas/           # lista de cobranças (mock)
│   ├── PagarCobranca/       # Pix / Boleto
│   ├── Ocorrencias/         # listagem
│   ├── DetalheOcorrencia/
│   ├── Encomendas/
│   ├── Visitantes/
│   ├── PainelGestao/        # dashboard do síndico
│   ├── GestaoAreasComuns/   # CRUD áreas comuns
│   ├── EditarAreaComum/     # form com turnos inline
│   ├── Perfil/
│   ├── MeusDados/
│   └── ...
├── services/                # api.js + serviços por módulo
└── styles/                  # tema styled-components
sql/
├── seed-areas-comuns.sql    # apenas áreas
└── seed-completo.sql        # dataset completo de simulação
```

## Seed do banco

Para testar o app contra dados realistas, popule o banco da API com o seed:

```bash
psql -h <host> -U <user> -d <db> -f sql/seed-completo.sql
```

O script é **idempotente** (`ON CONFLICT DO NOTHING`) e cria:

- 2 condomínios, 16 unidades, 12 pessoas
- 8 áreas comuns + 16 turnos
- Reservas (pendente, aprovada, concluída)
- Ocorrências, encomendas, visitantes, comunicados

> O hash bcrypt embutido corresponde à senha **`123456`**. Caso o login não autentique (variação na lib bcrypt), gere um novo com `node -e "console.log(require('bcrypt').hashSync('123456', 10))"` e substitua no SQL.

## Usuários de teste

Após rodar o seed, todos os logins abaixo usam senha **`123456`**:

| Email | Papel |
|-------|-------|
| `admin@condigtal.com` | Admin global |
| `sindico1@condigtal.com` | Síndico — Residencial Jardim das Flores |
| `sindico2@condigtal.com` | Síndico — Edifício Parque Verde |
| `porteiro1@condigtal.com` | Porteiro |
| `ana.almeida@email.com` | Morador (Jardim 101-A) |
| `bruno.costa@email.com` | Morador (Jardim 102-A) |
| `eliana.ferreira@email.com` | Morador (Parque Verde 301) |

(+ 5 outros moradores — ver final do `seed-completo.sql`).

## Scripts disponíveis

| Comando | O que faz |
|---------|-----------|
| `npm start` | Inicia o Metro bundler |
| `npm run android` | Build + deploy no Android |
| `npm run ios` | Build + deploy no iOS |
| `npm test` | Roda os testes Jest |
| `npm run lint` | ESLint |

## Roadmap

- [ ] Integração financeira real (substituir mock de `cobrancasService`)
- [ ] Geração automática de cobranças por mês fechado
- [ ] Push notifications para aprovação/rejeição de reservas
- [ ] Upload de imagens em ocorrências
- [ ] Modo offline para listagens consultadas

## Contribuindo

1. Crie uma branch a partir da `main`: `git checkout -b feat/minha-feature`
2. Faça commits pequenos e descritivos
3. Abra um Pull Request descrevendo o **porquê** da mudança e como testar
4. Aguarde o review

---

<sub>Projeto pessoal/acadêmico — Gabriel Antônio Soares · 2026</sub>
