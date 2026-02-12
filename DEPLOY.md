# 🚀 GUIA DE DEPLOY - PASSO A PASSO

## 📋 **CHECKLIST ANTES DE COMEÇAR**

- [ ] Código está funcionando localmente
- [ ] Testes passaram
- [ ] Commit feito no Git
- [ ] Conta no Cloudflare criada (grátis)

---

## 🎯 **DEPLOY NO CLOUDFLARE PAGES (GRÁTIS E RÁPIDO)**

### **PASSO 1: CRIAR CONTA NO CLOUDFLARE** ⏱️ 3 minutos

1. **Acesse:** https://dash.cloudflare.com/sign-up
2. **Preencha:**
   - E-mail
   - Senha (mínimo 8 caracteres)
3. **Clique em:** "Sign Up"
4. **Verifique seu e-mail** e clique no link de confirmação
5. **Login** no Cloudflare Dashboard

---

### **PASSO 2: CONECTAR AO GITHUB** ⏱️ 2 minutos

1. **No dashboard do Cloudflare:**
   - Clique em **"Workers & Pages"** no menu lateral
   - Clique em **"Create Application"**
   - Selecione a aba **"Pages"**
   - Clique em **"Connect to Git"**

2. **Autorizar o Cloudflare:**
   - Clique em **"Connect GitHub"**
   - Autorize o Cloudflare Pages no GitHub
   - Selecione **"All repositories"** ou **"Only select repositories"**
   - Se selecionar repositórios específicos, escolha **"webapp"**
   - Clique em **"Install & Authorize"**

3. **Volte para o Cloudflare** (será redirecionado automaticamente)

---

### **PASSO 3: CONFIGURAR O PROJETO** ⏱️ 1 minuto

1. **Selecione o repositório:**
   - Encontre **"webapp"** na lista
   - Clique em **"Begin setup"**

2. **Configurações do build:**

   ```
   Project name: brasil-world
   Production branch: main
   Build command: npm run build
   Build output directory: dist
   Root directory: (leave blank)
   ```

3. **Environment variables:** (deixe vazio por enquanto)

4. **Clique em:** **"Save and Deploy"**

---

### **PASSO 4: AGUARDAR O DEPLOY** ⏱️ 2-3 minutos

1. **Acompanhe o progresso:**
   - Você verá um log em tempo real
   - Passos:
     - ✅ Initializing build environment
     - ✅ Cloning repository
     - ✅ Installing dependencies (npm install)
     - ✅ Building application (npm run build)
     - ✅ Deploying to Cloudflare's global network

2. **Aguarde a mensagem:**
   ```
   ✅ Success! Your site is live!
   ```

---

### **PASSO 5: ACESSAR O APP** ⏱️ Imediato

1. **URL gerada automaticamente:**
   ```
   https://brasil-world-xyz.pages.dev
   ```
   (xyz será um código aleatório)

2. **Teste o app:**
   - Clique na URL
   - Abra no celular
   - Teste instalar

3. **URLs disponíveis:**
   - **Production:** `https://brasil-world.pages.dev`
   - **Preview:** `https://main.brasil-world.pages.dev`

---

## 🔗 **ADICIONAR DOMÍNIO PERSONALIZADO (OPCIONAL)**

### **Se você tem um domínio próprio:**

1. **No dashboard do Cloudflare Pages:**
   - Vá em **"Custom domains"**
   - Clique em **"Set up a custom domain"**

2. **Digite seu domínio:**
   ```
   brasilworld.com
   ou
   app.brasilworld.com
   ```

3. **Configure o DNS:**
   - Cloudflare mostrará os registros necessários
   - Adicione um registro **CNAME**:
     ```
     Type: CNAME
     Name: @ (ou app)
     Target: brasil-world.pages.dev
     ```

4. **Aguarde propagação:** 5-60 minutos

---

## 📱 **TESTAR NO CELULAR**

### **Android:**

1. **Abra o Chrome**
2. **Acesse:** `https://brasil-world.pages.dev`
3. **Aguarde 2 segundos**
4. **Toque no menu (⋮)** no canto superior direito
5. **Selecione:** "Instalar app" ou "Adicionar à tela inicial"
6. **Confirme**
7. **Pronto!** Ícone aparece na tela inicial

### **iPhone:**

1. **Abra o Safari** (não funciona no Chrome no iOS)
2. **Acesse:** `https://brasil-world.pages.dev`
3. **Toque no botão Compartilhar** (□↑) na barra inferior
4. **Role para baixo** e toque em **"Adicionar à Tela Inicial"**
5. **Edite o nome** (opcional): "Brasil World"
6. **Toque em "Adicionar"**
7. **Pronto!** Ícone aparece na tela inicial

---

## 🔄 **ATUALIZAR O APP (FUTURO)**

### **Processo automático:**

1. **Faça suas alterações localmente**
2. **Commit:**
   ```bash
   git add -A
   git commit -m "feat: Nova funcionalidade"
   ```

3. **Push para o GitHub:**
   ```bash
   git push origin main
   ```

4. **Cloudflare detecta automaticamente** e faz novo deploy
5. **Em 2-3 minutos:** Nova versão no ar
6. **Usuários recebem atualização automaticamente**

---

## 🛡️ **ATIVAR PROTEÇÕES DO CLOUDFLARE**

### **1. Firewall Rules (Grátis):**

1. **No dashboard:**
   - Vá em **"Security"** → **"WAF"**
   - Ative **"Managed Rules"**
   - Selecione:
     - ✅ Cloudflare Managed Ruleset
     - ✅ Cloudflare OWASP Core Ruleset

### **2. Rate Limiting (Pago - $5/mês):**

1. **Vá em:** **"Security"** → **"Rate Limiting"**
2. **Crie uma regra:**
   ```
   If: incoming requests from a visitor
   Then: block
   When: more than 60 requests per 1 minute
   ```

### **3. Bot Fight Mode (Grátis):**

1. **Vá em:** **"Security"** → **"Bots"**
2. **Ative:** "Bot Fight Mode"
3. **Configuração:** "Verified Bots Only"

---

## 📊 **MONITORAR O APP**

### **Cloudflare Analytics (Grátis):**

1. **No dashboard do Pages:**
   - Clique em **"Analytics"**
   
2. **Métricas disponíveis:**
   - 📈 Número de visitas
   - 🌍 Países de origem
   - 📱 Dispositivos (mobile/desktop)
   - ⚡ Performance (tempo de carregamento)
   - 🚫 Requisições bloqueadas

### **Logs em tempo real:**

1. **Vá em:** **"Functions"** → **"Logs"**
2. **Veja:**
   - Requisições em tempo real
   - Erros
   - Warnings
   - Tempos de resposta

---

## ❓ **PROBLEMAS COMUNS**

### **"Build failed" durante deploy:**

**Causa:** Erro no build  
**Solução:**
```bash
# Teste localmente primeiro:
npm run build

# Se der erro, corrija e faça novo commit
git add -A
git commit -m "fix: Corrige erro de build"
git push origin main
```

### **"Module not found" no deploy:**

**Causa:** Dependência faltando  
**Solução:**
```bash
# Instale a dependência:
npm install nome-do-pacote

# Commit o package.json:
git add package.json package-lock.json
git commit -m "fix: Adiciona dependência faltante"
git push origin main
```

### **App não instala no celular:**

**Causa:** HTTPS obrigatório para PWA  
**Solução:** Cloudflare Pages já usa HTTPS automaticamente

### **"Acesso negado" na API:**

**Causa:** CORS bloqueando  
**Solução:** Adicione o domínio do Cloudflare em `ALLOWED_ORIGINS` no código

---

## ✅ **CHECKLIST FINAL**

Depois do deploy, teste:

- [ ] App abre no navegador
- [ ] Dados dos deputados carregam
- [ ] Abas funcionam (Despesas, Proposições, etc.)
- [ ] Tema claro/escuro funciona
- [ ] Som funciona (se ativado)
- [ ] App instala no celular (Android)
- [ ] App instala no celular (iPhone)
- [ ] Funciona offline (após primeira visita)

---

## 🎉 **PARABÉNS!**

Seu app está **ONLINE**, **PROTEGIDO** e **FUNCIONANDO**!

### **Compartilhe:**
```
🇧🇷 Transparência Parlamentar com dados oficiais!

📱 Instale o Brasil World:
https://brasil-world.pages.dev

✨ Grátis, rápido e sempre atualizado!
```

---

## 📞 **PRECISA DE AJUDA?**

- **Cloudflare Docs:** https://developers.cloudflare.com/pages/
- **Comunidade:** https://community.cloudflare.com/
- **Suporte:** https://dash.cloudflare.com/?to=/:account/support

**Boa sorte! 🚀**
