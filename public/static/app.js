// ==========================================
// BRASIL WORLD V6 - JAVASCRIPT COMPLETO
// Criado do ZERO - Sem bugs
// ==========================================

console.log('🇧🇷 Brasil World V6 iniciando...');

// ==========================================
// CONFIGURAÇÕES
// ==========================================
const CONFIG = {
    API_BASE: '/api',
    CACHE_DURATION: 30 * 60 * 1000, // 30 minutos
    RETRY_ATTEMPTS: 3,
    RETRY_DELAY: 1000
};

// ==========================================
// CORES DOS PARTIDOS
// ==========================================
const PARTY_COLORS = {
    'PT': '#E3000F', 'PSDB': '#0080FF', 'MDB': '#006600', 'PP': '#203E8A',
    'PSD': '#00A859', 'PDT': '#ff6600', 'REPUBLICANOS': '#1D74D8',
    'PL': '#004999', 'PSB': '#ff8c00', 'UNIÃO': '#003399', 'PODE': '#20ac98',
    'PSOL': '#FFDD00', 'PCDOB': '#B00000', 'CIDADANIA': '#F25C05',
    'AVANTE': '#fa8c05', 'PATRIOTA': '#006633', 'SOLIDARIEDADE': '#FF4500',
    'PROS': '#f87820', 'NOVO': '#ff8000', 'REDE': '#00a650', 'PMB': '#CC0000',
    'UP': '#8B0000', 'PRTB': '#008000', 'DC': '#009900', 'PCB': '#CC0000',
    'PCO': '#8B0000', 'AGIR': '#0077c8', 'MOBILIZA': '#FF6B00'
};

// ==========================================
// CACHE
// ==========================================
const Cache = {
    get(key) {
        try {
            const item = localStorage.getItem(key);
            if (!item) return null;
            const { value, expiry } = JSON.parse(item);
            if (Date.now() > expiry) {
                localStorage.removeItem(key);
                return null;
            }
            return value;
        } catch {
            return null;
        }
    },
    
    set(key, value, duration = CONFIG.CACHE_DURATION) {
        try {
            const expiry = Date.now() + duration;
            localStorage.setItem(key, JSON.stringify({ value, expiry }));
        } catch (err) {
            console.warn('Cache error:', err);
        }
    }
};

// ==========================================
// FETCH COM RETRY
// ==========================================
async function fetchWithRetry(url, attempts = CONFIG.RETRY_ATTEMPTS) {
    for (let i = 0; i < attempts; i++) {
        try {
            const response = await fetch(url);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return await response.json();
        } catch (err) {
            if (i === attempts - 1) throw err;
            await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY * (i + 1)));
        }
    }
}

// ==========================================
// API FUNCTIONS
// ==========================================
const API = {
    async getDeputados() {
        const cached = Cache.get('deputados');
        if (cached) return cached;
        
        const data = await fetchWithRetry(`${CONFIG.API_BASE}/deputados?ordem=ASC&ordenarPor=nome`);
        const deputados = data.dados || [];
        Cache.set('deputados', deputados);
        return deputados;
    },
    
    async getDetalhes(id) {
        const cached = Cache.get(`deputado_${id}`);
        if (cached) return cached;
        
        const data = await fetchWithRetry(`${CONFIG.API_BASE}/deputados/${id}`);
        const detalhes = data.dados;
        Cache.set(`deputado_${id}`, detalhes);
        return detalhes;
    },
    
    async getDespesas(id) {
        const cached = Cache.get(`despesas_${id}`);
        if (cached) return cached;
        
        const ano = new Date().getFullYear();
        const data = await fetchWithRetry(`${CONFIG.API_BASE}/deputados/${id}/despesas?ano=${ano}&ordem=DESC&ordenarPor=dataDocumento`);
        const despesas = data.dados || [];
        Cache.set(`despesas_${id}`, despesas);
        return despesas;
    },
    
    async getProposicoes(id) {
        const cached = Cache.get(`proposicoes_${id}`);
        if (cached) return cached;
        
        const ano = new Date().getFullYear();
        try {
            const [atual, anterior] = await Promise.all([
                fetchWithRetry(`${CONFIG.API_BASE}/proposicoes?autor=${id}&ano=${ano}&itens=100`).catch(() => ({ dados: [] })),
                fetchWithRetry(`${CONFIG.API_BASE}/proposicoes?autor=${id}&ano=${ano - 1}&itens=100`).catch(() => ({ dados: [] }))
            ]);
            
            const proposicoes = [...(atual.dados || []), ...(anterior.dados || [])];
            Cache.set(`proposicoes_${id}`, proposicoes);
            return proposicoes;
        } catch {
            return [];
        }
    },
    
    async getComissoes(id) {
        const cached = Cache.get(`comissoes_${id}`);
        if (cached) return cached;
        
        const data = await fetchWithRetry(`${CONFIG.API_BASE}/deputados/${id}/orgaos`);
        const comissoes = data.dados || [];
        Cache.set(`comissoes_${id}`, comissoes);
        return comissoes;
    }
};

// ==========================================
// STATE
// ==========================================
const State = {
    deputados: [],
    filtrados: [],
    
    setDeputados(deputados) {
        this.deputados = deputados;
        this.filtrados = deputados;
    },
    
    filtrar({ nome = '', partido = '', uf = '' }) {
        this.filtrados = this.deputados.filter(d => {
            const matchNome = !nome || d.nome.toLowerCase().includes(nome.toLowerCase());
            const matchPartido = !partido || d.siglaPartido === partido;
            const matchUf = !uf || d.siglaUf === uf;
            return matchNome && matchPartido && matchUf;
        });
        renderGrid();
    }
};

// ==========================================
// RENDER FUNCTIONS
// ==========================================
function renderDeputadoCard(deputado) {
    const cor = PARTY_COLORS[deputado.siglaPartido] || '#718096';
    return `
        <div class="deputy-card" onclick="abrirPerfil(${deputado.id})">
            <div class="deputy-photo">
                <img src="${deputado.urlFoto}" alt="${deputado.nome}" 
                     onerror="this.src='https://www.camara.leg.br/internet/deputado/bandep/sem-foto.jpg'">
            </div>
            <h3 class="deputy-name">${deputado.nome}</h3>
            <span class="party-badge" style="background: ${cor};">${deputado.siglaPartido} / ${deputado.siglaUf}</span>
        </div>
    `;
}

function renderGrid() {
    const grid = document.getElementById('deputies-grid');
    if (!grid) return;
    
    if (State.filtrados.length === 0) {
        grid.innerHTML = '<p style="text-align: center; grid-column: 1/-1; padding: 3rem; color: #64748B;">Nenhum deputado encontrado</p>';
        return;
    }
    
    grid.innerHTML = State.filtrados.map(renderDeputadoCard).join('');
}

// ==========================================
// MODAL / PERFIL
// ==========================================
async function abrirPerfil(id) {
    const modal = document.getElementById('modal-perfil');
    const body = document.getElementById('modal-body');
    
    if (!modal || !body) return;
    
    modal.style.display = 'flex';
    body.innerHTML = '<div style="text-align: center; padding: 3rem;"><div style="width: 48px; height: 48px; border: 4px solid #002776; border-top-color: transparent; border-radius: 50%; animation: spin 0.8s linear infinite; margin: 0 auto 1rem;"></div><p>Carregando perfil...</p></div>';
    
    try {
        const [detalhes, despesas, proposicoes, comissoes] = await Promise.all([
            API.getDetalhes(id),
            API.getDespesas(id).catch(() => []),
            API.getProposicoes(id).catch(() => []),
            API.getComissoes(id).catch(() => [])
        ]);
        
        body.innerHTML = renderPerfil(detalhes, despesas, proposicoes, comissoes);
        attachTabListeners();
        
        console.log(`✅ Perfil carregado: ${detalhes.nomeCivil}`, {
            despesas: despesas.length,
            proposicoes: proposicoes.length,
            comissoes: comissoes.length
        });
    } catch (err) {
        console.error('❌ Erro ao carregar perfil:', err);
        body.innerHTML = '<div style="text-align: center; padding: 3rem; color: #ef4444;"><h3>❌ Erro ao carregar perfil</h3><p>Tente novamente mais tarde</p></div>';
    }
}

function renderPerfil(detalhes, despesas, proposicoes, comissoes) {
    const status = detalhes.ultimoStatus;
    const cor = PARTY_COLORS[status.siglaPartido] || '#718096';
    
    return `
        <div class="profile-header">
            <img src="${status.urlFoto}" alt="${status.nomeEleitoral}" 
                 onerror="this.src='https://www.camara.leg.br/internet/deputado/bandep/sem-foto.jpg'">
            <div>
                <h2>${status.nomeEleitoral}</h2>
                ${detalhes.nomeCivil !== status.nomeEleitoral ? `<p style="opacity: 0.9;">${detalhes.nomeCivil}</p>` : ''}
                <span class="party-badge" style="background: ${cor}; margin-top: 0.5rem;">${status.siglaPartido} / ${status.siglaUf}</span>
            </div>
        </div>
        
        <div class="tabs">
            <button class="tab-button active" data-tab="dados">📋 Dados</button>
            <button class="tab-button" data-tab="despesas">💰 Despesas</button>
            <button class="tab-button" data-tab="proposicoes">📝 Proposições</button>
            <button class="tab-button" data-tab="comissoes">🏛️ Comissões</button>
            <button class="tab-button" data-tab="trajetoria">📜 Trajetória</button>
        </div>
        
        <div class="tab-contents">
            <div class="tab-content active" data-tab-content="dados">${renderAbaDados(detalhes)}</div>
            <div class="tab-content" data-tab-content="despesas">${renderAbaDespesas(despesas)}</div>
            <div class="tab-content" data-tab-content="proposicoes">${renderAbaProposicoes(proposicoes)}</div>
            <div class="tab-content" data-tab-content="comissoes">${renderAbaComissoes(comissoes)}</div>
            <div class="tab-content" data-tab-content="trajetoria">${renderAbaTrajetoria(detalhes)}</div>
        </div>
    `;
}

// ==========================================
// ABAS
// ==========================================
function renderAbaDados(detalhes) {
    const calcIdade = (data) => {
        if (!data) return 'N/A';
        const hoje = new Date();
        const nasc = new Date(data);
        let idade = hoje.getFullYear() - nasc.getFullYear();
        const m = hoje.getMonth() - nasc.getMonth();
        if (m < 0 || (m === 0 && hoje.getDate() < nasc.getDate())) idade--;
        return idade;
    };
    
    return `
        <div class="info-grid">
            <div class="info-row"><span class="info-label">Nome Civil:</span><span>${detalhes.nomeCivil}</span></div>
            <div class="info-row"><span class="info-label">Nascimento:</span><span>${detalhes.dataNascimento ? new Date(detalhes.dataNascimento).toLocaleDateString('pt-BR') : 'N/A'} (${calcIdade(detalhes.dataNascimento)} anos)</span></div>
            <div class="info-row"><span class="info-label">Naturalidade:</span><span>${detalhes.municipioNascimento || 'N/A'} / ${detalhes.ufNascimento || ''}</span></div>
            <div class="info-row"><span class="info-label">Escolaridade:</span><span>${detalhes.escolaridade || 'N/A'}</span></div>
            <div class="info-row"><span class="info-label">Email:</span><span>${detalhes.ultimoStatus.email || 'N/A'}</span></div>
            <div class="info-row"><span class="info-label">Gabinete:</span><span>${detalhes.ultimoStatus.gabinete?.nome || 'N/A'}</span></div>
            <div class="info-row"><span class="info-label">Telefone:</span><span>${detalhes.ultimoStatus.gabinete?.telefone || 'N/A'}</span></div>
        </div>
    `;
}

function renderAbaDespesas(despesas) {
    if (despesas.length === 0) {
        return '<div style="text-align: center; padding: 3rem;"><div style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;">💰</div><p style="color: #64748B;">Nenhuma despesa registrada em 2025</p></div>';
    }
    
    const total = despesas.reduce((sum, d) => sum + (parseFloat(d.valorDocumento) || 0), 0);
    
    return `
        <div style="background: linear-gradient(135deg, #009739, #007a2e); padding: 2rem; border-radius: 12px; color: white; text-align: center; margin-bottom: 2rem;">
            <p style="font-size: 1rem; opacity: 0.9; margin-bottom: 0.5rem;">💰 Total de Despesas 2025</p>
            <p style="font-size: 2.5rem; font-weight: 800;">R$ ${total.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</p>
            <p style="font-size: 0.875rem; opacity: 0.8; margin-top: 0.5rem;">${despesas.length} lançamentos</p>
        </div>
        
        <div style="max-height: 500px; overflow-y: auto;">
            ${despesas.slice(0, 100).map(d => `
                <div style="background: var(--bg-tertiary); padding: 1rem; margin-bottom: 0.75rem; border-radius: 8px; border-left: 4px solid #002776;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem;">
                        <strong style="color: var(--text-primary);">${d.tipoDespesa || 'Despesa'}</strong>
                        <strong style="color: #009739; font-size: 1.1rem;">R$ ${parseFloat(d.valorDocumento || 0).toLocaleString('pt-BR', { minimumFractionDigits: 2 })}</strong>
                    </div>
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">
                        <div>📅 ${d.dataDocumento ? new Date(d.dataDocumento).toLocaleDateString('pt-BR') : 'N/A'}</div>
                        <div>🏢 ${d.nomeFornecedor || 'Fornecedor não informado'}</div>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderAbaProposicoes(proposicoes) {
    if (proposicoes.length === 0) {
        return '<div style="text-align: center; padding: 3rem;"><div style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;">📝</div><p style="color: #64748B;">Nenhuma proposição apresentada</p></div>';
    }
    
    const tipos = {};
    proposicoes.forEach(p => {
        tipos[p.siglaTipo] = (tipos[p.siglaTipo] || 0) + 1;
    });
    const estatisticas = Object.entries(tipos).sort((a, b) => b[1] - a[1]);
    
    return `
        <div style="background: linear-gradient(135deg, #002776, #001a5c); padding: 2rem; border-radius: 12px; color: white; margin-bottom: 2rem;">
            <h3 style="font-weight: 700; margin-bottom: 1rem;">📊 Estatísticas</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 1rem;">
                ${estatisticas.slice(0, 6).map(([tipo, count]) => `
                    <div style="background: rgba(255,255,255,0.15); padding: 1rem; border-radius: 8px; text-align: center;">
                        <div style="font-size: 2rem; font-weight: 800;">${count}</div>
                        <div style="font-size: 0.875rem; opacity: 0.9;">${tipo}</div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        <div style="margin-bottom: 1rem;"><strong>Total: ${proposicoes.length} proposições</strong></div>
        
        <div style="display: grid; gap: 1rem; max-height: 500px; overflow-y: auto;">
            ${proposicoes.slice(0, 50).map(p => {
                const cores = { 'PL': '#3b82f6', 'PEC': '#8b5cf6', 'PDL': '#10b981', 'PLP': '#f59e0b', 'PRC': '#ef4444', 'REQ': '#06b6d4' };
                const cor = cores[p.siglaTipo] || '#6b7280';
                return `
                    <div style="background: white; padding: 1.5rem; border-radius: 8px; border-left: 4px solid ${cor};">
                        <div style="display: flex; justify-content: space-between; margin-bottom: 0.75rem;">
                            <span style="background: ${cor}; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-weight: 700; font-size: 0.875rem;">${p.siglaTipo}</span>
                            <span style="font-weight: 600; color: #64748B;">${p.numero}/${p.ano}</span>
                        </div>
                        <p style="font-size: 0.95rem; color: #334155; line-height: 1.6;">${p.ementa || 'Sem ementa'}</p>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function renderAbaComissoes(comissoes) {
    if (comissoes.length === 0) {
        return '<div style="text-align: center; padding: 3rem;"><div style="font-size: 3rem; opacity: 0.3; margin-bottom: 1rem;">🏛️</div><p style="color: #64748B;">Nenhuma comissão registrada</p></div>';
    }
    
    return `
        <div style="margin-bottom: 1rem;"><strong>Total: ${comissoes.length} comissões</strong></div>
        <div style="display: grid; gap: 1rem;">
            ${comissoes.map(c => `
                <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: 8px;">
                    <h4 style="font-weight: 700; color: var(--text-primary); margin-bottom: 0.5rem;">${c.nome || c.siglaOrgao || 'Comissão'}</h4>
                    ${c.titulo ? `<p style="font-weight: 600; color: #002776; margin-bottom: 0.5rem;">${c.titulo}</p>` : ''}
                    <div style="font-size: 0.875rem; color: var(--text-secondary);">
                        📅 ${c.dataInicio ? new Date(c.dataInicio).toLocaleDateString('pt-BR') : 'Data não informada'}
                        ${c.dataFim ? ` até ${new Date(c.dataFim).toLocaleDateString('pt-BR')}` : ' até o presente'}
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

function renderAbaTrajetoria(detalhes) {
    const status = detalhes.ultimoStatus;
    const gabinete = status.gabinete || {};
    const cor = PARTY_COLORS[status.siglaPartido] || '#718096';
    
    return `
        <div style="background: linear-gradient(135deg, #009739, #007a2e); color: white; padding: 2rem; border-radius: 12px; margin-bottom: 2rem;">
            <h3 style="font-size: 1.5rem; font-weight: 800; margin-bottom: 0.5rem;">📜 Trajetória Política</h3>
            <p style="opacity: 0.9;">Informações sobre o mandato atual</p>
        </div>
        
        <div style="background: white; padding: 2rem; border-radius: 12px; border: 3px solid #FFDF00; margin-bottom: 1.5rem;">
            <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1.5rem; color: var(--text-primary);">🏛️ Mandato Atual (${new Date().getFullYear()})</h3>
            <div class="info-grid">
                <div class="info-row"><span class="info-label">Cargo:</span><span>Deputado Federal</span></div>
                <div class="info-row">
                    <span class="info-label">Partido/UF:</span>
                    <span>
                        <span class="party-badge" style="background: ${cor};">${status.siglaPartido}</span>
                        ${status.siglaUf}
                    </span>
                </div>
                <div class="info-row"><span class="info-label">Gabinete:</span><span>${gabinete.nome || 'Não informado'}</span></div>
                <div class="info-row"><span class="info-label">Andar:</span><span>${gabinete.andar || 'Não informado'}</span></div>
                <div class="info-row"><span class="info-label">Prédio:</span><span>${gabinete.predio || 'Não informado'}</span></div>
                <div class="info-row">
                    <span class="info-label">Situação:</span>
                    <span style="background: #009739; color: white; padding: 0.25rem 0.75rem; border-radius: 4px; font-weight: 700; font-size: 0.875rem;">✅ EXERCÍCIO</span>
                </div>
            </div>
        </div>
        
        <div style="background: var(--bg-tertiary); padding: 1.5rem; border-radius: 12px;">
            <h3 style="font-weight: 700; margin-bottom: 1rem;">📚 Formação</h3>
            <div class="info-row"><span class="info-label">Escolaridade:</span><span>${detalhes.escolaridade || 'Não informado'}</span></div>
        </div>
    `;
}

// ==========================================
// TAB LISTENERS
// ==========================================
function attachTabListeners() {
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.addEventListener('click', () => {
            const tab = btn.dataset.tab;
            
            document.querySelectorAll('.tab-button').forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            btn.classList.add('active');
            document.querySelector(`[data-tab-content="${tab}"]`)?.classList.add('active');
        });
    });
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
async function init() {
    console.log('🚀 Iniciando aplicação...');
    
    try {
        // Carregar deputados
        const deputados = await API.getDeputados();
        State.setDeputados(deputados);
        
        console.log(`✅ ${deputados.length} deputados carregados`);
        
        // Renderizar grid
        renderGrid();
        
        // Popular filtros
        const partidos = [...new Set(deputados.map(d => d.siglaPartido))].sort();
        const ufs = [...new Set(deputados.map(d => d.siglaUf))].sort();
        
        const partidoSelect = document.getElementById('partido-filter');
        const ufSelect = document.getElementById('uf-filter');
        
        if (partidoSelect) {
            partidoSelect.innerHTML = '<option value="">Todos os partidos</option>' + 
                partidos.map(p => `<option value="${p}">${p}</option>`).join('');
        }
        
        if (ufSelect) {
            ufSelect.innerHTML = '<option value="">Todos os estados</option>' + 
                ufs.map(u => `<option value="${u}">${u}</option>`).join('');
        }
        
        // Event listeners
        document.getElementById('search-input')?.addEventListener('input', (e) => {
            State.filtrar({ nome: e.target.value });
        });
        
        document.getElementById('partido-filter')?.addEventListener('change', (e) => {
            State.filtrar({ partido: e.target.value });
        });
        
        document.getElementById('uf-filter')?.addEventListener('change', (e) => {
            State.filtrar({ uf: e.target.value });
        });
        
        document.getElementById('modal-close')?.addEventListener('click', () => {
            document.getElementById('modal-perfil').style.display = 'none';
        });
        
        // Remover loading
        setTimeout(() => {
            const loading = document.getElementById('loading-screen');
            const app = document.getElementById('app-container');
            
            if (loading) loading.remove();
            if (app) app.style.display = 'block';
            
            console.log('✅ Aplicação pronta!');
        }, 1500);
        
    } catch (err) {
        console.error('❌ Erro fatal:', err);
        alert('Erro ao carregar a aplicação. Recarregue a página.');
    }
}

// Adicionar CSS para spinner
const style = document.createElement('style');
style.textContent = '@keyframes spin { to { transform: rotate(360deg); } }';
document.head.appendChild(style);

// Iniciar
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
