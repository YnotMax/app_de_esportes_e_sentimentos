import { GoogleGenAI, Type } from "@google/genai";
import { Archetype, JourneyStep, QuizAnswer } from "../types";

// Helper function to get the AI client with the correct key (Custom or Default)
const getAIClient = () => {
  const customKey = localStorage.getItem('neuroflow_custom_api_key');
  const apiKey = customKey && customKey.trim().length > 0 ? customKey : process.env.API_KEY;
  return new GoogleGenAI({ apiKey });
};

// Model constants
const FLASH_MODEL = 'gemini-2.5-flash';

/**
 * Analyzes quiz answers to determine the user's Neuro-Archetype.
 */
export const analyzeNeuroArchetype = async (answers: QuizAnswer[]): Promise<Archetype> => {
  const ai = getAIClient();
  const prompt = `
    Analise as seguintes respostas detalhadas de um usuário para uma avaliação de "Neuro-Compatibilidade" de exercícios.
    Os dados incluem bateria social, ambiente preferido, estilo de foco, necessidades de liberação de agressividade, preferência por estrutura, fonte de motivação, tolerância à dor e hábitos com equipamentos.

    Com base neste perfil abrangente, RETORNE EM PORTUGUÊS DO BRASIL:
    1. Atribua um "Nome de Arquétipo" criativo e impactante (ex: O Estrategista Zen, O Gladiador Social, O Solista da Natureza).
    2. Explique a neurociência/psicologia por trás disso (Por que essa pessoa falha em academias comuns? Quais neuroquímicos específicos como Dopamina/Serotonina/Endorfina ela busca baseada nas respostas?).
    3. Sugira 3 esportes/atividades específicos que sejam um par perfeito. Evite sugestões genéricas; seja específico (ex: em vez de "corrida", sugira "Trail Running" ou "Sprints" baseado nas respostas).
    
    Respostas do Usuário:
    ${answers.map(a => `- Contexto: ${a.category}, Escolha: ${a.selectedOption}`).join('\n')}
  `;

  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          name: { type: Type.STRING },
          description: { type: Type.STRING },
          neurochemistry: { type: Type.STRING },
          suggestedSports: { 
            type: Type.ARRAY,
            items: { type: Type.STRING }
          }
        },
        required: ["name", "description", "neurochemistry", "suggestedSports"]
      }
    }
  });

  return JSON.parse(response.text || "{}") as Archetype;
};

/**
 * Generates the "Pathfinder" journey steps for a specific sport.
 */
export const generateJourneySteps = async (sport: string): Promise<JourneyStep[]> => {
  const ai = getAIClient();
  const prompt = `
    Crie um plano de formação de hábito com "Engenharia Reversa" para um iniciante querendo começar: ${sport}.
    Quebre em exatamente 4 passos logísticos, evitando o treino real até o final.
    RETORNE EM PORTUGUÊS DO BRASIL.
    
    Os passos devem ser exatamente destes tipos, nesta ordem:
    1. equipment (Equipamento necessário - Gear needed)
    2. location (Local onde fazer - Where to do it)
    3. trigger (A ação preparatória - The preparatory action, ex: separar as roupas)
    4. micro-goal (Uma primeira meta minúscula e não intimidadora, ex: "Apenas calçar o tênis")

    Retorne um array JSON de passos com titulo e descrição em PT-BR.
  `;

  const response = await ai.models.generateContent({
    model: FLASH_MODEL,
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            id: { type: Type.INTEGER },
            title: { type: Type.STRING },
            description: { type: Type.STRING },
            type: { type: Type.STRING, enum: ["equipment", "location", "trigger", "micro-goal"] }
          },
          required: ["id", "title", "description", "type"]
        }
      }
    }
  });

  const rawSteps = JSON.parse(response.text || "[]");
  
  // Hydrate with initial status
  return rawSteps.map((s: any, index: number) => ({
    ...s,
    id: index + 1,
    status: index === 0 ? 'current' : 'locked' // First step is current, others locked
  }));
};

/**
 * Chat assistant for the Journey tab.
 * Uses Google Maps tool for location queries.
 */
export const getChatAssistance = async (
  message: string, 
  currentSport: string, 
  currentStepContext: string,
  userLocation?: GeolocationCoordinates
) => {
  const ai = getAIClient();
  
  let toolConfig = undefined;
  
  // Add tools if relevant
  if (userLocation) {
      toolConfig = {
          retrievalConfig: {
              latLng: {
                  latitude: userLocation.latitude,
                  longitude: userLocation.longitude
              }
          }
      }
  }

  const systemInstruction = `
    Você é um assistente de coach de hábitos solidário e ciente da neurociência chamado "NeuroFlow Bot".
    O usuário está tentando iniciar o hábito de ${currentSport}.
    Ele está atualmente travado no passo: "${currentStepContext}".
    Mantenha as respostas curtas, encorajadoras e práticas.
    Fale sempre em Português do Brasil.
    Se perguntarem sobre locais, use a ferramenta Google Maps para encontrar lugares reais próximos.
    Se perguntarem sobre equipamentos, dê opções econômicas e "pro".
  `;

  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash', // Use flash for speed, maps tool is available on flash
    contents: message,
    config: {
        systemInstruction: systemInstruction,
        tools: [{ googleMaps: {} }],
        toolConfig: toolConfig
    }
  });

  // Extract text and potential map links
  let text = response.text || "";
  const mapChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
  
  // Append map links to text if they exist (simple formatting)
  if (mapChunks.length > 0) {
      text += "\n\n**Sugestões de Locais:**\n";
      mapChunks.forEach((chunk: any) => {
          // Check for maps first (Google Maps Tool), then fallback to web
          if (chunk.maps?.uri) {
             text += `- [${chunk.maps.title}](${chunk.maps.uri})\n`;
          } else if (chunk.web?.uri) {
             text += `- [${chunk.web.title}](${chunk.web.uri})\n`;
          }
      });
  }

  return text;
};