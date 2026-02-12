# 🇧🇷 Brasil World - PWA com Proteção Máxima

## 📱 **O QUE É?**

Brasil World é um **Progressive Web App (PWA)** instalável que fornece transparência parlamentar com dados oficiais da Câmara dos Deputados.

## ✨ **RECURSOS**

### **Funcionalidades:**
- ✅ 513 Deputados Federais
- ✅ Despesas dos últimos 12 meses
- ✅ Proposições (2024-2025)
- ✅ Comissões ativas e encerradas
- ✅ Trajetória política completa
- ✅ Tema claro/escuro
- ✅ Sons interativos
- ✅ Funciona offline (PWA)
- ✅ Instalável no celular

### **PWA (Progressive Web App):**
- 📱 Instalável como app nativo
- 🔄 Atualiza automaticamente
- 💾 Funciona offline
- ⚡ Carregamento instantâneo
- 🔔 Notificações (futuro)

### **🔒 PROTEÇÕES IMPLEMENTADAS:**

#### **1. Rate Limiting**
- Máximo 100 requisições por minuto por IP
- Bloqueia automaticamente IPs abusivos
- Reset automático a cada 1 minuto

#### **2. CORS Restritivo**
- Apenas domínios autorizados podem acessar
- Protege contra roubo de dados
- Lista de domínios permitidos:
  - `brasil-world.pages.dev`
  - `localhost:3000` (dev)

#### **3. Security Headers**
- `X-Frame-Options: DENY` - Anti-clickjacking
- `X-Content-Type-Options: nosniff` - Anti-MIME sniffing
- `X-XSS-Protection` - Proteção XSS
- `Strict-Transport-Security` - Force HTTPS
- `Content-Security-Policy` - Política restritiva de conteúdo

#### **4. Validação de Inputs**
- IDs validados (somente números, 1-999999)
- Sanitização de strings
- Remoção de caracteres perigosos
- Limite de tamanho de inputs

#### **5. Bloqueio de Bots**
- User-agents maliciosos bloqueados
- `robots.txt` configurado
- Scrapers conhecidos banidos
- GPTBot, ChatGPT, Claude bloqueados

#### **6. Anti-DDoS Básico**
- Cloudflare Protection ativo
- Limite de CPU: 50ms
- Cache inteligente
- Headers otimizados

## 🚀 **COMO COLOCAR ONLINE**

### **OPÇÃO 1: Cloudflare Pages (RECOMENDADO)**

#### **Passo 1: Criar conta no Cloudflare**
1. Acesse: https://dash.cloudflare.com/sign-up
2. Crie uma conta grátis
3. Verifique seu e-mail

#### **Passo 2: Conectar ao GitHub**
1. No Cloudflare, vá em **Pages**
2. Clique em **Create a project**
3. Conecte sua conta GitHub
4. Selecione o repositório `webapp`

#### **Passo 3: Configurar Build**
```
Build command: npm run build
Build output directory: dist
Root directory: /
```

#### **Passo 4: Deploy**
1. Clique em **Save and Deploy**
2. Aguarde 2-3 minutos
3. **Pronto!** Seu app está online em:
   ```
   https://brasil-world.pages.dev
   ```

### **OPÇÃO 2: Vercel (Alternativa)**

1. Acesse: https://vercel.com/
2. Import Git Repository
3. Selecione o repositório
4. Configure:
   ```
   Build Command: npm run build
   Output Directory: dist
   Install Command: npm install
   ```
5. Deploy

### **OPÇÃO 3: Netlify**

1. Acesse: https://app.netlify.com/
2. Add new site → Import from Git
3. Configure:
   ```
   Build command: npm run build
   Publish directory: dist
   ```
4. Deploy

## 📲 **COMO INSTALAR NO CELULAR**

### **Android (Chrome):**
1. Abra o link do app no Chrome
2. Toque no menu (⋮)
3. Selecione **"Instalar app"** ou **"Adicionar à tela inicial"**
4. Confirme
5. **Pronto!** Ícone aparecerá na tela inicial

### **iPhone (Safari):**
1. Abra o link do app no Safari
2. Toque no botão **Compartilhar** (□↑)
3. Role para baixo e toque em **"Adicionar à Tela Inicial"**
4. Confirme
5. **Pronto!** Ícone aparecerá na tela inicial

## 🔄 **COMO ATUALIZAR**

### **Automaticamente:**
- PWA atualiza sozinho a cada carregamento
- Service Worker busca novas versões
- Usuário não precisa fazer nada

### **Manualmente (desenvolvimento):**
```bash
# 1. Fazer alterações no código
# 2. Commit
git add -A
git commit -m "feat: Nova funcionalidade"
git push origin main

# 3. Cloudflare faz deploy automático
# 4. Em 2-3 minutos, app está atualizado
```

## 🛡️ **CONFIGURAÇÕES DE SEGURANÇA**

### **Alterar CORS (domínios permitidos):**

Edite `src/index.tsx`, linha ~28:

```typescript
const ALLOWED_ORIGINS = [
  'https://seu-dominio.com',  // Adicione seu domínio aqui
  'https://brasil-world.pages.dev',
  'http://localhost:3000'
]
```

### **Alterar Rate Limit:**

Edite `src/index.tsx`, linha ~48:

```typescript
const windowMs = 60000 // 1 minuto
const maxRequests = 100 // Máximo de requisições
```

### **Bloquear User-Agents:**

Edite `src/index.tsx`, linha ~70:

```typescript
const BLOCKED_USER_AGENTS = ['wget', 'scrapy', 'python-requests', 'SEU-BOT-AQUI']
```

## 📊 **MONITORAMENTO**

### **Health Check:**
```
https://brasil-world.pages.dev/health
```

Retorna:
```json
{
  "status": "ok",
  "service": "Brasil World V9 - PWA + Segurança Máxima",
  "timestamp": "2026-02-12T00:59:54.722Z",
  "security": {
    "rateLimit": "100 req/min",
    "cors": "Restritivo",
    "headers": "Secure",
    "validation": "Ativa"
  }
}
```

### **Cloudflare Analytics:**
- Acesse o dashboard do Cloudflare Pages
- Veja:
  - Número de visitas
  - Requisições bloqueadas
  - Tráfego por país
  - Performance

## 🐛 **SOLUÇÃO DE PROBLEMAS**

### **App não instala no celular:**
- Certifique-se de estar usando HTTPS
- Limpe o cache do navegador
- Tente em modo anônimo primeiro

### **"Acesso negado" na API:**
- Verifique se seu domínio está em `ALLOWED_ORIGINS`
- Certifique-se de não estar usando um bot/scraper
- Verifique o rate limit (máx 100 req/min)

### **App não atualiza:**
- Force atualização: CTRL+SHIFT+R (desktop)
- Limpe o cache do Service Worker
- Desinstale e reinstale o app

## 📞 **SUPORTE**

- **Issues:** https://github.com/seu-usuario/webapp/issues
- **E-mail:** seu-email@example.com
- **Docs API:** https://dadosabertos.camara.leg.br/swagger/api.html

## 📄 **LICENÇA**

MIT License - Livre para uso pessoal e comercial

---

## 🎉 **PRONTO PARA USO!**

Seu app está **100% funcional**, **protegido** e **atualiza automaticamente**.

### **Próximos passos:**
1. Faça deploy no Cloudflare Pages
2. Compartilhe o link
3. Veja as pessoas instalando
4. Acompanhe as estatísticas

**Boa sorte! 🚀🇧🇷**
