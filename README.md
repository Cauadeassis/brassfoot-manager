# ⚽ Futebol de Bolso

**Futebol de Bolso** é um jogo moderno de gestão de futebol para navegadores. Assuma o controle de um clube, gerencie táticas, compre e venda jogadores e leve seu time ao topo da tabela!

Este projeto nasceu como um ambiente de estudos básicos de HTML/CSS/JS.

## ✨ Funcionalidades Principais

### 🧠 Engine de Simulação de Partidas

- **Posse de bola:** Calculada com base na diferença de qualidade entre os times que estão jogando.
- **Finalizações:** Calculadas com base na posse de bola e na sorte do time.
- **Conversão a gols:** O resultado de cada chute depende dos atributos do atacante (ex: `shooting`, `vision`), dos atributos do goleiro (`reflexes`) e de sorte.
- **Sistema Tático Dinâmico:** O estilo de jogo da equipe (Ofensivo, Defensivo, Equilibrado) interfere nas chances de criação de jogadas.
- **Bolas Paradas:** O jogo possui sistema de escanteios, faltas e pênaltis! O usuário pode definir seus batedores ou deixar com que o motor decida aleatoriamente.
- **Progressão:** No final de cada jogo, são computadas as assistências e gols para os jogadores da linha e as defesas para os goleiros. O usuário pode visualizar esses dados em uma tabela de artilharia.

### 💰 Mercado de Transferências Profissional

- **Filtros Avançados:** Busque jogadores por nome, posição ou clube.
- **Ordenação Interativa:** Tabelas de mercado com cabeçalhos clicáveis (Overall, Valor, Idade), permitindo ao jogador analisar o mercado com rapidez usando UI Patterns de Progressive Disclosure.
- **Inteligência da CPU:** Times controlados pela máquina gerenciam seus próprios elencos, liberando jogadores velhos ou com baixo rendimento para a lista de "Agentes Livres".

### 📊 Gestão de Campeonatos

- **Tabela Dinâmica:** Classificação atualizada em tempo real com regras visuais automáticas (destaque para G5/Z5 e para o time do usuário).
- **Calendário e Rodadas:** Orquestração completa de rodadas, calculando vitórias, empates, derrotas e saldo de gols.

### 💾 Sistema de Usuários e Saves (Em desenvolvimento)

- **Multi-Saves:** Suporte para múltiplos "slots" de gravação por usuário.
- **Persistência em Nuvem:** Dados da carreira, times e histórico salvos em banco de dados relacional.

---

## 🛠️ Tecnologias Utilizadas

O projeto foi refatorado seguindo os princípios **SOLID** e **Clean Code**, garantindo um código escalável, testável e de fácil manutenção.

**Frontend:**

- [React](https://reactjs.org/) / [Next.js](https://nextjs.org/) - Renderização de interfaces e rotas.
- [Zustand](https://zustand-demo.pmnd.rs/) - Gerenciamento de estado global ultra-rápido e sem boilerplate (`useGameStore`).
- **CSS Modules** - Estilização escopada com layouts responsivos (CSS Grid/Flexbox).

**Backend & Dados _(Em desenvolvimento)_:**

- **Next.js Server Actions / API Routes** - Lógica de servidor integrada.
- [Prisma ORM](https://www.prisma.io/) - Modelagem de dados e tipagem forte em todo o ecossistema.
- [PostgreSQL](https://www.postgresql.org/) - Banco de dados relacional (armazenando estados complexos do jogo via campos `JSONB`).
- [Auth.js](https://authjs.dev/) - Autenticação segura de usuários.

---

## 🚀 Como executar o projeto localmente

### Pré-requisitos

- Node.js (v18 ou superior)
- Gerenciador de pacotes (npm, yarn, pnpm ou bun)

### Instalação

1. Clone este repositório:

   ```bash
   git clone [https://github.com/seu-usuario/brassfoot-manager.git](https://github.com/seu-usuario/brassfoot-manager.git)

   ```

2. Acesse a pasta do projeto:

   ```bash
   cd brassfoot-manager

   ```

3. Instale as dependências:

   ```bash
   npm install

   ```

4. Comandos:
   ```bash
   npm run dev // inicia o jogo na porta 3000
   npm run analyze // faz uma análise da perfomance da aplicação
   npm run typescript // escaneia o código em busca de erros
   ```
