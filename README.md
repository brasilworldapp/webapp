# 🇧🇷 Brasil World - Transparência Parlamentar

> Portal completo de transparência política com dados oficiais da Câmara dos Deputados

## 🎯 Sobre o Projeto

Brasil World é um aplicativo web/mobile que permite aos cidadãos brasileiros acompanharem a atuação dos deputados federais com total transparência. Todos os dados são obtidos diretamente da API oficial da Câmara dos Deputados.

## ✨ Recursos Principais

### 📋 Dados Completos
- **513 Deputados Federais** com informações atualizadas
- Foto, nome, partido, estado, gabinete
- Email, telefone e contato direto

### 💰 Despesas Transparentes
- **Últimos 12 meses** de despesas
- Atualização automática do Diário Oficial
- Total gasto e detalhamento completo
- Fornecedores e datas

### 📝 Proposições
- Todas as proposições apresentadas
- Filtro por tipo (PL, PEC, PDL, etc.)
- Ementas completas
- Links para o portal oficial

### 🏛️ Comissões
- Comissões ativas e encerradas
- Cargo ocupado
- Tempo de atuação
- Links diretos

### 📊 Frequência
- Links para consulta oficial
- Portal da Câmara integrado

### 📜 Trajetória Política
- Mandato atual
- Formação acadêmica
- Histórico partidário

## 🎨 Interface Moderna

### 🌓 Tema Claro/Escuro
- Alternância suave entre temas
- Cores da bandeira do Brasil
- Design responsivo

### 🔊 Efeitos Sonoros
- Sons arcade nos clicks
- Controle de volume
- Feedback tátil

### ⚡ Performance
- Cache inteligente por ID
- Carregamento rápido
- Otimizado para mobile

## 🚀 Tecnologias

### Backend
- **Hono** - Framework web ultra-rápido
- **Cloudflare Workers** - Edge computing
- **TypeScript** - Tipagem estática

### Frontend
- **Vanilla JavaScript** - Sem dependências pesadas
- **CSS Variables** - Temas dinâmicos
- **LocalStorage** - Cache offline

### API
- **Câmara dos Deputados** - Dados oficiais 100%
- **Proxy CORS** - Acesso sem bloqueios

## 📱 Como Usar

### Online
Acesse: https://3000-i6s3t45g15hq4w4trdtv8-b237eb32.sandbox.novita.ai

### Localmente
```bash
# Clone o repositório
git clone [seu-repositório]

# Entre na pasta
cd webapp

# Instale dependências
npm install

# Build
npm run build

# Inicie com PM2
pm2 start ecosystem.config.cjs

# Ou use Wrangler
npm run dev:sandbox
```

## 📦 Estrutura do Projeto

```
webapp/
├── src/
│   └── index.tsx           # Backend Hono
├── public/
│   └── static/
│       ├── app.js          # Frontend JavaScript
│       ├── style.css       # Estilos completos
│       └── manifest.json   # PWA manifest
├── ecosystem.config.cjs    # PM2 config
├── wrangler.jsonc          # Cloudflare config
└── package.json
```

## 🔧 Desenvolvimento

### Comandos Disponíveis

```bash
# Desenvolvimento local
npm run dev

# Build para produção
npm run build

# Preview produção
npm run preview

# Deploy Cloudflare
npm run deploy
```

### Variáveis de Ambiente

Nenhuma variável necessária! Tudo funciona out-of-the-box.

## 🌐 Deploy

### Cloudflare Pages
```bash
npm run deploy
```

### Outros Serviços
O app é compatível com:
- Vercel
- Netlify
- AWS Amplify
- Google Cloud Run

## 📊 Dados e Cache

### Cache LocalStorage
- **Deputados:** 30 minutos
- **Despesas:** 7 dias
- **Proposições:** 30 minutos
- **Comissões:** 30 minutos

### API Oficial
Todos os dados vêm de:
https://dadosabertos.camara.leg.br/api/v2

## 🎯 Roadmap

### Em Desenvolvimento
- [ ] **Senadores** (81 parlamentares)
- [ ] **Vereadores** por cidade
- [ ] **Governadores** e deputados estaduais
- [ ] **Notificações** de novas proposições
- [ ] **Comparações** entre deputados
- [ ] **Exportação** de dados (PDF, CSV)

### Futuro
- [ ] App nativo (iOS/Android)
- [ ] Push notifications
- [ ] Modo offline completo
- [ ] Análises e estatísticas

## 📱 Play Store

Quer publicar na Play Store? Leia o guia completo:
**[GUIA_PLAY_STORE.md](./GUIA_PLAY_STORE.md)**

## 🤝 Contribuindo

Contribuições são bem-vindas! Por favor:

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-feature`)
3. Commit suas mudanças (`git commit -m 'Add: nova feature'`)
4. Push para a branch (`git push origin feature/nova-feature`)
5. Abra um Pull Request

## 📄 Licença

Este projeto é de código aberto para fins educacionais e de transparência.

## 👥 Autor

**Brasil World Tecnologia**
- Transparência política ao alcance de todos
- 100% dados oficiais do governo brasileiro

## 🙏 Agradecimentos

- **Câmara dos Deputados** - API oficial
- **Cloudflare** - Infraestrutura
- **Comunidade open source** - Ferramentas incríveis

## 📞 Contato

- Email: contato@brasilworld.com.br
- Issues: [GitHub Issues]
- Twitter: @brasilworld

## 🌟 Mostre seu Apoio

Se este projeto te ajudou, dê uma ⭐ no GitHub!

---

**Feito com ❤️ para o povo brasileiro**

🇧🇷 Transparência é fundamental para a democracia
