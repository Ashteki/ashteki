<!-- Copied/created by assistant: concise repo-specific instructions for AI coding agents -->
# Copilot instructions for the Ashteki repo

Summary
- Ashteki is a web app split into two main runtime pieces: the lobby server (Express + REST/API + UI) and one or more game nodes (game engine processes). The frontend is a React + Redux app built with Webpack. Persistent data is stored in MongoDB (monk). Redis is used for realtime/session needs and socket.io is used for all real-time communication.

Quick start (dev)
- Install: npm install
- Import data (one-time): node server/scripts/importdata && node server/scripts/importprecons
- Run lobby (dev with HMR): npm start (runs node . -> server/index.js uses webpack dev middleware when NODE_ENV != production)
- Run a game node: npm run game (runs node server/gamenode)
- Alternative: docker-compose up then run the import scripts inside the container (see README).

Important scripts (package.json)
- start: node . (lobby)
- game: node server/gamenode (game engine/process)
- build: npm install && webpack --config webpack.production.js
- test: cross-env JASMINE_CONFIG_PATH=./jasmine.json jasmine
- lint / lint:js:fix: ESLint rules are enforced — follow .eslintrc

Project layout and where to look
- client/ — React app and Redux store. Key files: `client/index.jsx`, `client/index.dev.jsx`, `client/configureStore.dev.js`, `client/Components/` and `client/pages/`.
- server/ — Express server, APIs, game node code, and scripts. Key files: `server/index.js` (launcher), `server/server.js` (Express wiring, passport JWT, webpack dev middleware), `server/gamenode` (game node process), `server/api/` (REST endpoints), `server/scripts/` (importdata, user tooling).
- data/ — card data, sets and decks used by the engine (imported by scripts).
- public/ and dist/ — static assets and the built frontend.
- webpack.*.js — webpack configs (dev/prod/common). Use webpack.dev.js to understand HMR setup (webpackHotMiddleware + dev middleware).

Runtime and integration notes (examples to reference in code)
- Two distinct processes must run: the lobby (Express + static UI) and at least one game node. Lobby spawns/coordinates nodes via `server/gamenode` and `lobby.js`.
- Auth: passport-jwt (see `server/server.js` JWT strategy); tokens are expected as Bearer tokens.
- Realtime: socket.io/socket.io-client are used for game messages. Search for `socket.io` and `gamenode` to find communication flows.
- DB: monk (MongoDB) — config via `config/default.json5` or `config/local.json5`. Do not hardcode connection strings; prefer config service (`server/services/ConfigService`).

Conventions and patterns
- Game engine changes require unit tests before merging. See README and jasmine.json. Tests run with `npm test`.
- Frontend uses SCSS and imports via Webpack. Keep style files under `client/styles/` and component styles near pages when present (e.g., `pages/*.scss`).
- Linting: ESLint (AirBnB config) is enforced. Run `npm run lint` and `npm run lint:js:fix`.

What to do when editing the engine or network code
- If changing game logic, update/add jasmine tests under `test/` covering new behavior. Engine logic often references files in `server/script/` and `server/gamenode`.
- When touching authentication or APIs, update `server/api/` endpoints and check usages in `client/util.js` or `client/Components/*`.

:notes:
- When you need to find the lobby startup flow, open `server/index.js` and `server/server.js` (they show initialization order and middleware). For hot-reload front-end behaviour inspect `webpack.dev.js` and `client/index.dev.jsx`.
- If you need card/game data, check `data/` and the import scripts in `server/scripts/`.

If anything here is unclear or you want deeper examples (e.g., step-by-step to run a local hot-reload dev session on Windows), tell me which area and I will expand with concrete commands and file references.
