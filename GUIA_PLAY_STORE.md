# 🚀 GUIA COMPLETO: COMO PUBLICAR BRASIL WORLD NA PLAY STORE

## 📋 ÍNDICE
1. [Pré-requisitos](#pré-requisitos)
2. [Criar Conta de Desenvolvedor](#criar-conta)
3. [Preparar o App](#preparar-app)
4. [Criar Listagem na Play Store](#criar-listagem)
5. [Upload do App](#upload)
6. [Configurações Finais](#configurações)
7. [Publicação](#publicação)

---

## 1️⃣ PRÉ-REQUISITOS

### O que você vai precisar:
- ✅ **Conta Google** (gmail)
- ✅ **R$ 100 (US$ 25)** - Taxa única de registro
- ✅ **Cartão de crédito internacional**
- ✅ **CPF/CNPJ** para cadastro
- ✅ **1-2 horas** de tempo

### Arquivos que eu criei para você:
- ✅ **Ícone do app** (bandeira do Brasil) → [Baixar aqui](https://www.genspark.ai/api/files/s/78AVqhcG)
- ✅ **Screenshots** (2 imagens) → Ver seção de imagens
- ✅ **Banner da Play Store** → [Baixar aqui](https://www.genspark.ai/api/files/s/SRlG1DSB)
- ✅ **Código do app** → https://www.genspark.ai/api/files/s/QP2gBF7D

---

## 2️⃣ CRIAR CONTA DE DESENVOLVEDOR GOOGLE PLAY

### Passo 1: Acessar o Console
1. Acesse: https://play.google.com/console/signup
2. Faça login com sua conta Google
3. Clique em **"Criar conta"**

### Passo 2: Tipo de Conta
Escolha:
- **Pessoal** → Se você é pessoa física
- **Organização** → Se tem CNPJ (recomendado para parecer empresa grande)

### Passo 3: Informações da Conta

#### Se escolheu **Organização** (recomendado):
```
Nome da empresa: Brasil World Tecnologia
Tipo de organização: Empresa privada
Tamanho: 2-10 funcionários
Site (opcional): Deixe em branco por enquanto
```

#### Informações de contato:
```
Nome completo: [Seu nome]
Email: [Seu email]
Telefone: [Seu telefone com +55]
Endereço: [Seu endereço completo]
```

### Passo 4: Pagamento
1. Insira os dados do cartão de crédito
2. Pague a taxa de **US$ 25** (R$ ~100)
3. **IMPORTANTE:** É uma taxa ÚNICA (paga apenas 1 vez na vida)

### Passo 5: Verificação
1. Google pode pedir verificação de identidade
2. Envie documento (RG, CNH ou Passaporte)
3. Aguarde aprovação (1-2 dias)

---

## 3️⃣ PREPARAR O APP (CONVERTER PARA ANDROID)

Como seu app é web, você precisa transformá-lo em APK usando **Capacitor** ou **PWA Builder**.

### Opção 1: PWA Builder (MAIS FÁCIL) ⭐ RECOMENDADO

#### Passo 1: Acessar PWA Builder
1. Acesse: https://www.pwabuilder.com/
2. Cole a URL do seu app: `https://3000-i6s3t45g15hq4w4trdtv8-b237eb32.sandbox.novita.ai`
3. Clique em **"Start"**

#### Passo 2: Baixar APK
1. Clique em **"Android"**
2. Clique em **"Generate"**
3. Baixe o arquivo `.aab` (Android App Bundle)

#### Passo 3: Configurar Manifest
Antes de gerar, configure:
```json
{
  "name": "Brasil World",
  "short_name": "Brasil World",
  "description": "Transparência Parlamentar com dados oficiais da Câmara dos Deputados",
  "theme_color": "#002776",
  "background_color": "#002776",
  "display": "standalone",
  "orientation": "portrait"
}
```

### Opção 2: Capacitor (Mais Controle)

Se você tem conhecimento técnico ou quer contratar alguém:

```bash
# Instalar Capacitor
npm install -g @capacitor/cli @capacitor/core @capacitor/android

# Inicializar
npx cap init "Brasil World" "com.brasilworld.app"

# Adicionar Android
npx cap add android

# Build
npm run build
npx cap sync

# Abrir Android Studio
npx cap open android

# Gerar APK no Android Studio
Build → Generate Signed Bundle/APK
```

---

## 4️⃣ CRIAR LISTAGEM NA PLAY STORE

### Passo 1: Criar App
1. Acesse: https://play.google.com/console
2. Clique em **"Criar app"**
3. Preencha:

```
Nome do app: Brasil World
Idioma padrão: Português (Brasil)
Tipo de app: Aplicativo
Categoria: Notícias e revistas
```

### Passo 2: Listagem da Loja

#### Informações Principais
```
Título do app: Brasil World - Transparência Parlamentar

Descrição curta (80 caracteres):
Acompanhe deputados federais: despesas, proposições e comissões oficiais.

Descrição completa:
🇧🇷 Brasil World é o aplicativo definitivo para acompanhar a atuação dos deputados federais brasileiros com total transparência.

✨ RECURSOS PRINCIPAIS:
• 📋 Dados completos de 513 deputados federais
• 💰 Despesas dos últimos 12 meses atualizadas automaticamente
• 📝 Proposições apresentadas por cada deputado
• 🏛️ Comissões e órgãos de atuação
• 📊 Frequência e participação
• 📜 Histórico político completo

🔒 100% DADOS OFICIAIS
Todas as informações são extraídas diretamente da API oficial da Câmara dos Deputados, garantindo total confiabilidade e atualização constante.

🎨 RECURSOS ESPECIAIS:
• 🌓 Tema claro e escuro
• 🔊 Efeitos sonoros arcade
• 🔍 Busca por nome, partido ou estado
• 📱 Interface moderna e intuitiva
• ⚡ Cache inteligente para navegação rápida

📊 TRANSPARÊNCIA TOTAL
• Veja quanto cada deputado gastou
• Consulte todas as proposições apresentadas
• Acompanhe a participação em comissões
• Acesse links diretos para o portal oficial

🚀 EM DESENVOLVIMENTO:
• Senadores (81 parlamentares)
• Vereadores e prefeitos
• Governadores e deputados estaduais

🇧🇷 Feito com ❤️ para o povo brasileiro
Acreditamos que a transparência é fundamental para a democracia. Por isso, criamos o Brasil World: para que você possa acompanhar de perto a atuação dos seus representantes.

📱 Baixe agora e fique por dentro da política brasileira!

#TransparênciaPolítica #CâmaraDoDeputados #ParlamentarBrasileiro #PoliticaBrasil
```

### Passo 3: Gráficos da Loja

#### Ícone do app (512x512)
- **Upload:** Baixe o ícone que criei: https://www.genspark.ai/api/files/s/78AVqhcG
- Faça upload no campo "Ícone"

#### Gráfico de recursos (1024x500)
- **Upload:** Baixe o banner: https://www.genspark.ai/api/files/s/SRlG1DSB
- Faça upload no campo "Gráfico de recursos"

#### Screenshots (mínimo 2, máximo 8)
Você precisa fazer screenshots REAIS do app rodando. Como fazer:

**Opção A: Usar o navegador**
1. Abra: https://3000-i6s3t45g15hq4w4trdtv8-b237eb32.sandbox.novita.ai
2. Pressione F12 → Clique em "Toggle Device Toolbar" (ícone de celular)
3. Escolha "Pixel 5" ou "iPhone 12 Pro"
4. Tire screenshot (Ctrl+Shift+P → "Capture screenshot")
5. Tire pelo menos 2 screenshots:
   - Tela inicial com lista de deputados
   - Perfil de um deputado com despesas

**Opção B: Usar as imagens que gerei**
- Screenshot 1 (Grid): https://www.genspark.ai/api/files/s/TqHW1qni
- Screenshot 2 (Perfil): https://www.genspark.ai/api/files/s/tZZfSE46

### Passo 4: Categorização

```
Categoria: Notícias e revistas
Tags: transparência, política, governo, brasil, câmara
```

### Passo 5: Detalhes de Contato

```
Email: [seu-email@gmail.com]
Site (opcional): Deixe em branco
Telefone (opcional): [Seu telefone]
```

### Passo 6: Política de Privacidade

**IMPORTANTE:** A Play Store exige uma política de privacidade.

Copie e cole este texto em um site (pode usar Google Sites ou Pastebin):

```
POLÍTICA DE PRIVACIDADE - BRASIL WORLD

Última atualização: [Data de hoje]

O Brasil World ("nós", "nosso" ou "aplicativo") respeita sua privacidade e está comprometido em proteger seus dados pessoais.

1. DADOS COLETADOS
O Brasil World NÃO coleta, armazena ou compartilha nenhum dado pessoal dos usuários. Todas as informações exibidas no aplicativo são públicas e obtidas da API oficial da Câmara dos Deputados do Brasil.

2. DADOS PÚBLICOS
O aplicativo exibe apenas informações públicas sobre deputados federais, incluindo:
- Nome, foto e dados de contato (disponíveis publicamente)
- Despesas parlamentares (dados públicos oficiais)
- Proposições apresentadas (dados públicos oficiais)
- Participação em comissões (dados públicos oficiais)

3. CACHE LOCAL
O aplicativo utiliza cache local (LocalStorage) apenas para melhorar a performance, armazenando temporariamente dados públicos já baixados. Nenhum dado pessoal do usuário é armazenado.

4. COOKIES E RASTREAMENTO
O Brasil World NÃO utiliza cookies, analytics ou qualquer forma de rastreamento de usuários.

5. FONTE DOS DADOS
Todos os dados são obtidos exclusivamente da API oficial da Câmara dos Deputados do Brasil:
https://dadosabertos.camara.leg.br/

6. COMPARTILHAMENTO DE DADOS
O Brasil World NÃO compartilha nenhum dado com terceiros, pois não coleta dados pessoais.

7. SEGURANÇA
Como não coletamos dados pessoais, não há risco de vazamento de informações privadas.

8. DIREITOS DO USUÁRIO
Como não coletamos dados pessoais, não há dados para solicitar acesso, correção ou exclusão.

9. ALTERAÇÕES NESTA POLÍTICA
Podemos atualizar esta política ocasionalmente. Notificaremos sobre mudanças significativas através de uma atualização no aplicativo.

10. CONTATO
Para dúvidas sobre esta política, entre em contato:
Email: [seu-email@gmail.com]

---

Ao usar o Brasil World, você concorda com esta Política de Privacidade.
```

**Como hospedar a Política:**
1. Acesse: https://sites.google.com/new
2. Crie um site gratuito
3. Cole a política de privacidade
4. Publique
5. Copie a URL e cole na Play Store

---

## 5️⃣ UPLOAD DO APP (APK/AAB)

### Passo 1: Criar Versão de Produção
1. No console, vá em **"Versão de produção"**
2. Clique em **"Criar nova versão"**

### Passo 2: Upload do APK/AAB
1. Clique em **"Fazer upload"**
2. Selecione o arquivo `.aab` gerado pelo PWA Builder
3. Aguarde o upload

### Passo 3: Informações da Versão
```
Nome da versão: 1.0.0
Código da versão: 1

Notas de versão (o que há de novo):
🎉 Lançamento inicial do Brasil World!

✨ Recursos:
• 513 deputados federais
• Despesas dos últimos 12 meses
• Proposições e comissões
• Tema claro/escuro
• Sons interativos
• 100% dados oficiais

🇧🇷 Transparência ao alcance de todos!
```

---

## 6️⃣ CONFIGURAÇÕES FINAIS

### Classificação de Conteúdo
1. Responda ao questionário
2. Marque:
   - Não contém violência
   - Não contém conteúdo sexual
   - Não contém linguagem imprópria
   - Não contém drogas
   - Classificação: **LIVRE** (L)

### Públicos-Alvo
```
Faixa etária: 18+ (política)
```

### Países
```
Disponível em: Brasil (ou Todos os países)
```

### Preço
```
Gratuito: ✅ SIM
Contém anúncios: ❌ NÃO
Compras no app: ❌ NÃO
```

---

## 7️⃣ PUBLICAÇÃO

### Passo 1: Revisar
1. Revise todas as informações
2. Certifique-se de que tudo está correto

### Passo 2: Enviar para Revisão
1. Clique em **"Enviar para revisão"**
2. Aguarde aprovação do Google (1-7 dias)

### Passo 3: Aguardar Aprovação
Google vai analisar:
- ✅ Conteúdo do app
- ✅ Política de privacidade
- ✅ Descrição e imagens
- ✅ Segurança

### Passo 4: Publicado! 🎉
Após aprovação:
- ✅ App fica disponível na Play Store
- ✅ URL será: `https://play.google.com/store/apps/details?id=com.brasilworld.app`
- ✅ Começa a aparecer nas buscas

---

## 📊 DICAS PARA PARECER UMA EMPRESA GRANDE

### 1. Perfil Profissional
```
Nome da empresa: Brasil World Tecnologia
Descrição: Empresa brasileira focada em transparência política
```

### 2. Email Profissional
Crie um email profissional:
- `contato@brasilworld.com.br` (se tiver domínio)
- `contato.brasilworld@gmail.com` (se usar Gmail)

### 3. Redes Sociais
Crie perfis profissionais:
- Instagram: @brasilworld_oficial
- Twitter: @brasilworld
- Facebook: Brasil World

### 4. Responder Avaliações
- Responda TODAS as avaliações
- Seja educado e profissional
- Agradeça feedback positivo
- Resolva problemas rapidamente

### 5. Atualizações Frequentes
- Lance atualizações a cada 2-4 semanas
- Adicione novos recursos
- Corrija bugs
- Mostre que está ativo

---

## 🎯 PRÓXIMOS PASSOS APÓS PUBLICAÇÃO

### 1. Divulgação
- ✅ Compartilhe nas redes sociais
- ✅ Envie para grupos de WhatsApp
- ✅ Poste em fóruns de política
- ✅ Entre em contato com influenciadores políticos

### 2. Mídia
- ✅ Envie release para sites de tecnologia
- ✅ Entre em contato com jornalistas
- ✅ Ofereça entrevistas

### 3. SEO
- ✅ Use palavras-chave: "transparência política", "câmara deputados"
- ✅ Peça para amigos avaliarem (5 estrelas)
- ✅ Responda todas as avaliações

### 4. Monetização (Futuro)
Quando tiver muitos usuários:
- 💰 Google AdMob (anúncios)
- 💰 Versão Premium sem anúncios
- 💰 Parcerias com ONGs

---

## 📱 LINKS IMPORTANTES

### Arquivos do Projeto
- **Código completo:** https://www.genspark.ai/api/files/s/QP2gBF7D
- **Ícone 512x512:** https://www.genspark.ai/api/files/s/78AVqhcG
- **Banner 1024x500:** https://www.genspark.ai/api/files/s/SRlG1DSB
- **Screenshot 1:** https://www.genspark.ai/api/files/s/TqHW1qni
- **Screenshot 2:** https://www.genspark.ai/api/files/s/tZZfSE46

### Ferramentas
- **Console Play Store:** https://play.google.com/console
- **PWA Builder:** https://www.pwabuilder.com/
- **Google Sites (Política):** https://sites.google.com/new

### Documentação
- **Guia oficial Google:** https://support.google.com/googleplay/android-developer
- **Políticas da Play Store:** https://play.google.com/about/developer-content-policy/

---

## 🆘 PROBLEMAS COMUNS E SOLUÇÕES

### "App rejeitado por violação de política"
**Solução:** Leia o email do Google, ajuste o que foi pedido e reenvie.

### "Política de privacidade inválida"
**Solução:** Certifique-se de que a URL está acessível e o texto está completo.

### "Ícone não aceito"
**Solução:** Use exatamente 512x512 pixels, PNG, fundo transparente.

### "Screenshots muito pequenos"
**Solução:** Mínimo 320px de largura, máximo 3840px. Use 1080x1920 (9:16).

### "Demora na aprovação"
**Solução:** Normal! Pode levar 1-7 dias. Seja paciente.

---

## 🎉 PARABÉNS!

Seguindo este guia, você terá o **Brasil World** publicado na Play Store como uma empresa profissional!

**Dúvidas?** Volte aqui e releia cada passo com calma.

**Boa sorte!** 🚀🇧🇷
