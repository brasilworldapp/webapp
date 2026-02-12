import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'

const app = new Hono()

// CORS simples
app.use('*', cors({ origin: '*' }))

// Static files
app.use('/static/*', serveStatic({ root: './public' }))

// Servir arquivos na raiz
app.get('/manifest.json', async (c) => {
  const manifest = {
    "name": "Brasil World - Transparência Parlamentar",
    "short_name": "Brasil World",
    "description": "Transparência parlamentar com dados oficiais da Câmara dos Deputados",
    "start_url": "/",
    "display": "standalone",
    "background_color": "#002776",
    "theme_color": "#002776",
    "orientation": "portrait",
    "icons": [
      {
        "src": "https://www.genspark.ai/api/files/s/tZZfSE46",
        "sizes": "512x512",
        "type": "image/png",
        "purpose": "any maskable"
      }
    ]
  }
  return c.json(manifest)
})

app.get('/sw.js', async (c) => {
  const sw = `
// Brasil World Service Worker
const CACHE_NAME = 'brasil-world-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  return self.clients.claim();
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});
`
  return c.text(sw, 200, { 'Content-Type': 'application/javascript' })
})

// Health check
app.get('/health', (c) => c.json({ status: 'ok', timestamp: new Date().toISOString() }))

// API PROXY - Câmara dos Deputados
const CAMARA_API = 'https://dadosabertos.camara.leg.br/api/v2'

// Listar todos os deputados
app.get('/api/deputados', async (c) => {
    try {
        const url = new URL(`${CAMARA_API}/deputados`)
        const params = c.req.query()
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        
        const response = await fetch(url.toString())
        const data = await response.json()
        return c.json(data)
    } catch (err: any) {
        return c.json({ error: 'Erro ao buscar deputados', message: err.message }, 500)
    }
})

// Detalhes de um deputado
app.get('/api/deputados/:id', async (c) => {
    try {
        const id = c.req.param('id')
        const response = await fetch(`${CAMARA_API}/deputados/${id}`)
        const data = await response.json()
        return c.json(data)
    } catch (err: any) {
        return c.json({ error: 'Erro ao buscar deputado', message: err.message }, 500)
    }
})

// Despesas de um deputado
app.get('/api/deputados/:id/despesas', async (c) => {
    try {
        const id = c.req.param('id')
        const url = new URL(`${CAMARA_API}/deputados/${id}/despesas`)
        const params = c.req.query()
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        
        const response = await fetch(url.toString())
        const data = await response.json()
        return c.json(data)
    } catch (err: any) {
        return c.json({ error: 'Erro ao buscar despesas', message: err.message }, 500)
    }
})

// Proposições por autor
app.get('/api/proposicoes', async (c) => {
    try {
        const url = new URL(`${CAMARA_API}/proposicoes`)
        const params = c.req.query()
        Object.keys(params).forEach(key => url.searchParams.append(key, params[key]))
        
        const response = await fetch(url.toString())
        const data = await response.json()
        return c.json(data)
    } catch (err: any) {
        return c.json({ error: 'Erro ao buscar proposições', message: err.message }, 500)
    }
})

// Órgãos (comissões) de um deputado
app.get('/api/deputados/:id/orgaos', async (c) => {
    try {
        const id = c.req.param('id')
        const response = await fetch(`${CAMARA_API}/deputados/${id}/orgaos`)
        const data = await response.json()
        return c.json(data)
    } catch (err: any) {
        return c.json({ error: 'Erro ao buscar órgãos', message: err.message }, 500)
    }
})

// HOME - Single Page Application
app.get('/', (c) => {
    return c.html(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Transparência parlamentar com dados oficiais da Câmara dos Deputados">
    <meta name="theme-color" content="#002776">
    <title>🇧🇷 Brasil World - Transparência Parlamentar</title>
    
    <!-- PWA -->
    <link rel="manifest" href="/manifest.json">
    <link rel="icon" type="image/png" href="https://www.genspark.ai/api/files/s/tZZfSE46">
    <link rel="apple-touch-icon" href="https://www.genspark.ai/api/files/s/tZZfSE46">
    
    <link rel="stylesheet" href="/static/style.css">
</head>
<body>
    <!-- LOADING SCREEN -->
    <div id="loading-screen">
        <div class="loading-content">
            <div class="brazil-flag-loader">
                <div class="flag-stripe blue"></div>
                <div class="flag-stripe yellow"></div>
                <div class="flag-stripe green"></div>
            </div>
            <h2>Brasil World</h2>
            <p class="loading-text">Carregando dados oficiais da Câmara dos Deputados...</p>
        </div>
    </div>

    <!-- APP CONTAINER -->
    <div id="app-container" style="display: none;">
        <!-- HEADER -->
        <header class="header">
            <div class="header-content">
                <div class="header-title">
                    <svg width="32" height="32" viewBox="0 0 32 32" style="margin-right: 12px;">
                        <rect width="32" height="10.67" fill="#009739"/>
                        <rect y="10.67" width="32" height="10.67" fill="#FFDF00"/>
                        <rect y="21.33" width="32" height="10.67" fill="#002776"/>
                    </svg>
                    <div>
                        <h1>Brasil World</h1>
                        <p class="subtitle">Portal de Transparência • Dados Oficiais da Câmara dos Deputados</p>
                    </div>
                </div>
                <div class="header-actions">
                    <span class="badge-oficial">Oficial</span>
                    <button id="sound-toggle" class="theme-toggle" title="Alternar som">🔊</button>
                    <button id="theme-toggle" class="theme-toggle" title="Alternar tema">🌙</button>
                </div>
            </div>
        </header>

        <!-- NAVIGATION TABS -->
        <div class="main-navigation">
            <div class="nav-container">
                <button class="nav-tab active" data-section="deputados">
                    <span class="nav-icon">🏛️</span>
                    <span class="nav-text">Deputados Federais</span>
                    <span class="nav-count">513</span>
                </button>
                <button class="nav-tab" data-section="senadores">
                    <span class="nav-icon">⚖️</span>
                    <span class="nav-text">Senadores</span>
                    <span class="nav-badge">Em breve</span>
                </button>
            </div>
        </div>

        <!-- FILTERS -->
        <div class="filters">
            <input type="text" id="search-input" placeholder="🔍 Buscar deputado por nome..." class="search-input">
            <select id="partido-filter" class="filter-select">
                <option value="">Todos os partidos</option>
            </select>
            <select id="uf-filter" class="filter-select">
                <option value="">Todos os estados</option>
            </select>
        </div>

        <!-- DEPUTIES GRID -->
        <div id="deputies-section" class="content-section active">
            <div id="deputies-grid" class="deputies-grid"></div>
        </div>

        <!-- SENADORES SECTION -->
        <div id="senadores-section" class="content-section">
            <div class="senadores-placeholder">
                <div class="construction-banner">
                    <div class="construction-icon">🚧</div>
                    <h2>Senadores em Desenvolvimento</h2>
                    <p class="construction-subtitle">Estamos trabalhando para trazer os dados dos 81 Senadores</p>
                    
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 35%"></div>
                        </div>
                        <p class="progress-text">Progresso: 35%</p>
                    </div>
                </div>
            </div>
        </div>

        <!-- MODAL PERFIL -->
        <div id="modal-perfil" class="modal">
            <div class="modal-content">
                <button id="modal-close" class="modal-close">✕</button>
                <div id="modal-body"></div>
            </div>
        </div>
    </div>

    <script src="/static/app.js"></script>
    
    <!-- PWA Service Worker -->
    <script>
        if ('serviceWorker' in navigator) {
            navigator.serviceWorker.register('/sw.js')
                .then(() => console.log('✅ PWA ativo'))
                .catch((err) => console.error('❌ Erro PWA:', err));
        }
    </script>
</body>
</html>
    `)
})

export default app
