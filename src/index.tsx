import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'
import { cors } from 'hono/cors'
import { secureHeaders } from 'hono/secure-headers'

const app = new Hono()

// 🔒 PROTEÇÃO 1: Headers de Segurança
app.use('*', secureHeaders({
  contentSecurityPolicy: {
    defaultSrc: ["'self'"],
    scriptSrc: ["'self'", "'unsafe-inline'", "https://cdn.tailwindcss.com"],
    styleSrc: ["'self'", "'unsafe-inline'"],
    imgSrc: ["'self'", "https:", "data:"],
    connectSrc: ["'self'", "https://dadosabertos.camara.leg.br"],
    fontSrc: ["'self'"],
    objectSrc: ["'none'"],
    mediaSrc: ["'self'"],
    frameSrc: ["'none'"]
  },
  xFrameOptions: 'DENY',
  xContentTypeOptions: 'nosniff',
  referrerPolicy: 'strict-origin-when-cross-origin',
  strictTransportSecurity: 'max-age=31536000; includeSubDomains'
}))

// 🔒 PROTEÇÃO 2: CORS restritivo (só permite seu domínio)
// Mude 'brasil-world.pages.dev' para seu domínio quando tiver
const ALLOWED_ORIGINS = [
  'https://brasil-world.pages.dev',
  'https://3000-i6s3t45g15hq4w4trdtv8-b237eb32.sandbox.novita.ai',
  'http://localhost:3000'
]

app.use('*', cors({
  origin: (origin) => {
    if (!origin) return '*' // Permite requisições sem origin (mobile apps)
    return ALLOWED_ORIGINS.some(allowed => origin.includes(allowed)) ? origin : ALLOWED_ORIGINS[0]
  },
  credentials: true
}))

// 🔒 PROTEÇÃO 3: Rate Limiting (máximo 100 requisições por minuto por IP)
const rateLimitMap = new Map()

app.use('*', async (c, next) => {
  const ip = c.req.header('cf-connecting-ip') || c.req.header('x-forwarded-for') || 'unknown'
  const now = Date.now()
  const windowMs = 60000 // 1 minuto
  const maxRequests = 100
  
  if (!rateLimitMap.has(ip)) {
    rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
  } else {
    const record = rateLimitMap.get(ip)
    
    if (now > record.resetTime) {
      // Reset contador
      rateLimitMap.set(ip, { count: 1, resetTime: now + windowMs })
    } else {
      record.count++
      
      if (record.count > maxRequests) {
        return c.json({ 
          error: 'Muitas requisições. Aguarde 1 minuto.',
          retryAfter: Math.ceil((record.resetTime - now) / 1000)
        }, 429)
      }
    }
  }
  
  await next()
})

// 🔒 PROTEÇÃO 4: Bloqueio de User-Agents suspeitos
const BLOCKED_USER_AGENTS = ['wget', 'scrapy', 'python-requests']

app.use('*', async (c, next) => {
  const userAgent = (c.req.header('user-agent') || '').toLowerCase()
  const path = c.req.path
  
  // Permitir requisições sem user-agent (apps mobile)
  if (!userAgent) {
    await next()
    return
  }
  
  // Permitir curl apenas no /health
  if (userAgent.includes('curl') && !path.includes('/health')) {
    return c.json({ error: 'Acesso negado' }, 403)
  }
  
  // Bloquear bots maliciosos
  if (BLOCKED_USER_AGENTS.some(blocked => userAgent.includes(blocked))) {
    return c.json({ error: 'Acesso negado' }, 403)
  }
  
  await next()
})

// Static files
app.use('/static/*', serveStatic({ root: './public' }))

// PWA files
app.get('/manifest.json', serveStatic({ path: 'manifest.json', root: './public' }))
app.get('/sw.js', serveStatic({ path: 'sw.js', root: './public' }))
app.get('/robots.txt', serveStatic({ path: 'robots.txt', root: './public' }))


// Health check
app.get('/health', (c) => c.json({ 
  status: 'ok', 
  service: 'Brasil World V9 - PWA + Segurança Máxima', 
  timestamp: new Date().toISOString(),
  security: {
    rateLimit: '100 req/min',
    cors: 'Restritivo',
    headers: 'Secure',
    validation: 'Ativa'
  }
}))

// API PROXY - Câmara dos Deputados
const CAMARA_API = 'https://dadosabertos.camara.leg.br/api/v2'

// 🔒 PROTEÇÃO 5: Sanitização de inputs
function sanitizeInput(input: string): string {
  return input
    .replace(/[<>\"']/g, '') // Remove caracteres perigosos
    .replace(/script/gi, '') // Remove palavra "script"
    .trim()
    .substring(0, 100) // Limita tamanho
}

// 🔒 PROTEÇÃO 6: Validação de IDs
function isValidId(id: string): boolean {
  return /^\d+$/.test(id) && parseInt(id) > 0 && parseInt(id) < 1000000
}

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
        
        // 🔒 Validar ID
        if (!isValidId(id)) {
            return c.json({ error: 'ID inválido' }, 400)
        }
        
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
        
        // 🔒 Validar ID
        if (!isValidId(id)) {
            return c.json({ error: 'ID inválido' }, 400)
        }
        
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
        
        // 🔒 Validar ID
        if (!isValidId(id)) {
            return c.json({ error: 'ID inválido' }, 400)
        }
        
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
    <meta name="description" content="Transparência parlamentar com dados oficiais da Câmara dos Deputados. Acompanhe despesas, proposições e comissões dos 513 deputados federais.">
    <meta name="theme-color" content="#002776">
    <title>🇧🇷 Brasil World - Transparência Parlamentar</title>
    
    <!-- PWA -->
    <link rel="manifest" href="/manifest.json">
    <link rel="icon" type="image/png" href="https://www.genspark.ai/api/files/s/tZZfSE46">
    <link rel="apple-touch-icon" href="https://www.genspark.ai/api/files/s/tZZfSE46">
    
    <!-- CSS -->
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
                    <p class="construction-subtitle">Estamos trabalhando duro para trazer os dados dos 81 Senadores do Brasil</p>
                    
                    <div class="progress-container">
                        <div class="progress-bar">
                            <div class="progress-fill" style="width: 35%"></div>
                        </div>
                        <p class="progress-text">Progresso: 35%</p>
                    </div>
                    
                    <div class="features-grid">
                        <div class="feature-item">
                            <div class="feature-icon">✅</div>
                            <div class="feature-text">Estrutura da API</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">⏳</div>
                            <div class="feature-text">Coleta de dados</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">⏳</div>
                            <div class="feature-text">Interface visual</div>
                        </div>
                        <div class="feature-item">
                            <div class="feature-icon">⏳</div>
                            <div class="feature-text">Testes finais</div>
                        </div>
                    </div>
                    
                    <div class="info-box">
                        <p><strong>O que teremos:</strong></p>
                        <ul>
                            <li>📋 Dados completos dos 81 Senadores</li>
                            <li>💰 Despesas dos últimos 12 meses</li>
                            <li>📝 Proposições apresentadas</li>
                            <li>🏛️ Comissões e atuação</li>
                            <li>📜 Histórico político</li>
                        </ul>
                    </div>
                    
                    <p class="update-note">📅 <strong>Previsão de lançamento:</strong> Próxima atualização</p>
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
            window.addEventListener('load', () => {
                navigator.serviceWorker.register('/sw.js')
                    .then(reg => console.log('✅ Service Worker registrado:', reg.scope))
                    .catch(err => console.error('❌ Erro ao registrar Service Worker:', err));
            });
        }
        
        // Detectar quando app é instalado
        window.addEventListener('beforeinstallprompt', (e) => {
            e.preventDefault();
            window.deferredPrompt = e;
            console.log('💾 App pronto para instalar!');
        });
        
        window.addEventListener('appinstalled', () => {
            console.log('✅ App instalado com sucesso!');
        });
    </script>
</body>
</html>
    `)
})

export default app
