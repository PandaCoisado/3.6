

import { GoogleGenAI } from "@google/genai";
import { Material, Transaction } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getBusinessInsights = async (materials: Material[], transactions: Transaction[]) => {
  const prompt = `
    Analise os dados deste Ferro Velho e forneça 3 insights estratégicos curtos (máximo 2 frases cada) em Português.
    Materiais atuais e preços (Compra/Venda): ${JSON.stringify(materials.map(m => ({ n: m.name, c: m.buyPrice, v: m.sellPrice })))}
    // Fix: Access material names by mapping through the items array of the Transaction object
    Últimas transações: ${JSON.stringify(transactions.slice(-10).map(t => ({ t: t.type, m: t.items.map(i => i.materialName).join(', '), v: t.total })))}
    
    Foque em lucro, materiais mais rentáveis ou sugestões de ajuste de preço baseado na margem.
    Retorne apenas os insights em formato de lista Markdown.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: prompt,
    });
    return response.text || "Sem insights no momento.";
  } catch (error) {
    console.error("Error fetching insights:", error);
    return "Não foi possível conectar ao consultor de IA.";
  }
};