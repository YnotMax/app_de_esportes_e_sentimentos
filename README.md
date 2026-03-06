<div align="center">
  <img src="public/logo.png" alt="ViV Logo" width="120" />
  
  # 🧠 ViV NeuroFlow
  
  **Descubra qual atividade física combina com a neuroquímica do seu cérebro e crie hábitos duradouros.**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
  [![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
  [![Google Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?style=for-the-badge&logo=google&logoColor=white)](https://ai.google.dev/)
  [![Vite](https://img.shields.io/badge/Vite-B73BFE?style=for-the-badge&logo=vite&logoColor=FFD62E)](https://vitejs.dev/)
</div>

<br/>

<div align="center">
  <img src="public/capa.png" alt="Tela Inicial do ViV NeuroFlow" width="300" style="border-radius: 16px; box-shadow: 0 4px 8px rgba(0,0,0,0.2);" />
</div>

<br/>

## 📖 Sobre o Projeto

O **ViV NeuroFlow** é um aplicativo web progressivo (PWA) projetado para resolver um problema comum: *por que tantas pessoas desistem da academia nos primeiros meses?* 

A resposta está na **neurociência**. Diferentes cérebros buscam diferentes recompensas químicas (Dopamina, Serotonina, Endorfina). O ViV utiliza Inteligência Artificial para mapear o perfil neuroquímico do usuário através de um quiz comportamental e, em seguida, sugere os esportes que são o "match perfeito" para o seu cérebro.

Além disso, o app utiliza técnicas de **Engenharia Reversa de Hábitos**, quebrando o início de uma nova atividade em micro-passos logísticos e não intimidadores, guiados por um Coach de IA integrado.

> **Nota do Desenvolvedor:** Este aplicativo é um projeto pessoal criado por **Tony Max** para compartilhar com amigos e explorar as intersecções entre tecnologia, saúde mental e inteligência artificial.

---

## 🚀 Funcionalidades Principais (Para Usuários)

- 🧬 **Mapeamento de Neuro-Arquétipo:** Um quiz interativo que analisa sua bateria social, tolerância à dor, necessidade de estrutura e fontes de motivação.
- 🎯 **Match Esportivo via IA:** Sugestões personalizadas de esportes (desde opções populares até esportes de nicho) baseadas no seu perfil neuroquímico.
- 🗺️ **Jornada Pathfinder:** Quebra o início do esporte em 4 micro-passos logísticos (Equipamento, Local, Gatilho, Micro-meta) para evitar a autossabotagem.
- 💬 **NeuroFlow Bot (Coach de IA):** Um assistente virtual integrado que ajuda a superar bloqueios, sugere equipamentos econômicos e usa o **Google Maps** para encontrar locais reais perto de você para praticar o esporte.
- 🔒 **Privacidade First:** Seus dados e respostas do quiz são salvos apenas no armazenamento local do seu celular (`localStorage`). Nenhuma informação pessoal é enviada para bancos de dados externos.

---

## 💻 Vitrine Tecnológica (Para Recrutadores)

Este projeto foi construído com foco em performance, tipagem estática e integração avançada com LLMs (Large Language Models).

### Tech Stack
* **Frontend:** React 18 (Functional Components, Hooks)
* **Linguagem:** TypeScript (Interfaces estritas para respostas da IA e estado da aplicação)
* **Build Tool:** Vite (HMR ultrarrápido e build otimizado)
* **Estilização:** Tailwind CSS (Utility-first, design responsivo e mobile-first)
* **Ícones:** Lucide React
* **Deploy:** Vercel

### 🧠 Integração Avançada com IA (Google Gemini API)
O diferencial técnico deste app é como ele consome a API do Google Gemini (`@google/genai`):
1. **Structured JSON Output:** A IA não retorna texto livre para o perfil do usuário. Utiliza-se `responseSchema` para forçar a IA a devolver um JSON estrito, garantindo que o frontend renderize os dados sem falhas de parsing.
2. **System Instructions & Persona:** O "NeuroFlow Bot" possui instruções de sistema rigorosas para atuar como um coach de hábitos baseado em neurociência, mantendo o tom encorajador e prático.
3. **Tool Calling (Google Maps Grounding):** O chat integra a ferramenta de *Grounding* do Google Maps. Quando o usuário pergunta "Onde posso praticar isso?", a IA acessa dados reais de geolocalização e retorna links clicáveis para locais próximos.
4. **Resiliência:** Implementação de fallback para chaves de API e tratamento de erros (ex: `503 Service Unavailable` em horários de pico), utilizando o modelo `gemini-3-flash-preview` para máxima estabilidade e velocidade.

---

## 🛠️ Como rodar o projeto localmente

1. **Clone o repositório**
   ```bash
   git clone https://github.com/seu-usuario/viv-neuroflow.git
   ```

2. **Instale as dependências**
   ```bash
   cd viv-neuroflow
   npm install
   ```

3. **Configure as Variáveis de Ambiente**
   Crie um arquivo `.env` na raiz do projeto baseado no `.env.example`:
   ```env
   VITE_API_KEY=sua_chave_do_google_gemini_aqui
   ```

4. **Inicie o servidor de desenvolvimento**
   ```bash
   npm run dev
   ```

---

## ⚠️ Isenção de Responsabilidade

O **Instituto São José** (mencionado no logo/app) não possui autoria, vínculo oficial ou responsabilidade sobre o funcionamento, conteúdo ou resultados deste aplicativo. Trata-se de uma iniciativa independente.

---

## 👨‍💻 Autor

Criado com dedicação e foco em inovação por **Tony Max da Silva Costa**.

Vamos nos conectar?
- 💼 **LinkedIn:** [tony-max-da-silva-costa](https://www.linkedin.com/in/tony-max-da-silva-costa/)
- 📸 **Instagram:** [@tony_max_silva](https://www.instagram.com/tony_max_silva/)

<br/>
<div align="center">
  <i>Feito com carinho ❤️ e muita tecnologia.</i>
</div>
