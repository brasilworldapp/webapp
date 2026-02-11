import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'

const app = new Hono()

// CORS
app.use('*', cors({ origin: '*' }))

// Static files
app.use('/static/*', serveStatic({ root: './public' }))

// Health check
app.get('/health', (c) => c.json({ status: 'ok', service: 'Brasil World V6', timestamp: new Date().toISOString() }))

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
    <title>🇧🇷 Brasil World - Transparência Parlamentar</title>
    <link rel="stylesheet" href="/static/style.css">
</head>
<body>
    <!-- LOADING SCREEN -->
    <div id="loading-screen">
        <div class="loading-content">
            <div class="brazil-flag-loader">
                <div class="flag-stripe green"></div>
                <div class="flag-stripe yellow"></div>
                <div class="flag-stripe blue"></div>
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
                    <button id="theme-toggle" class="theme-toggle" title="Alternar tema">🌙</button>
                </div>
            </div>
        </header>

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
        <div id="deputies-grid" class="deputies-grid"></div>

        <!-- MODAL PERFIL -->
        <div id="modal-perfil" class="modal">
            <div class="modal-content">
                <button id="modal-close" class="modal-close">✕</button>
                <div id="modal-body"></div>
            </div>
        </div>
    </div>

    <script src="/static/app.js"></script>
</body>
</html>
    `)
})

export default app
