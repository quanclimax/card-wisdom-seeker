// Google Gemini API Configuration
const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

export interface GeminiResponse {
  candidates: Array<{
    content: {
      parts: Array<{
        text: string;
      }>;
    };
  }>;
}

export interface TarotInterpretationRequest {
  question: string;
  spreadName: string;
  cards: string[];
  spreadPositions: string[];
}

export const callGeminiAPI = async (request: TarotInterpretationRequest): Promise<string> => {
  if (!GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY is not configured. Please add VITE_GEMINI_API_KEY to your .env file');
  }

  const prompt = `Bạn là một tarot reader chuyên nghiệp với kiến thức sâu rộng về tarot và khả năng giải nghĩa rất sâu sắc từ các lá bài theo những bối cảnh câu hỏi khác nhau.

Hãy giải nghĩa trải bài tarot sau đây:

**Câu hỏi của người dùng**: ${request.question}
**Kiểu trải bài**: ${request.spreadName}
**Các lá bài đã rút**: ${request.cards.join(', ')}

**Yêu cầu giải nghĩa**:
1. Giải nghĩa từng lá bài theo vị trí của nó trong trải bài
2. Giải thích ý nghĩa của từng vị trí: ${request.spreadPositions.join(', ')}
3. Đưa ra lời khuyên cụ thể dựa trên sự kết hợp của các lá bài
4. Sử dụng giọng điệu thân thiện, dễ hiểu nhưng vẫn giữ tính chuyên nghiệp
5. Trả lời bằng tiếng Việt

**Format trả lời**:
- Giải nghĩa từng lá bài theo vị trí
- Tổng quan về ý nghĩa của trải bài
- Lời khuyên cụ thể cho người dùng

Hãy trả lời chi tiết và hữu ích.`;

  try {
    const response = await fetch(GEMINI_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-goog-api-key': GEMINI_API_KEY,
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          topK: 40,
          topP: 0.95,
          maxOutputTokens: 2048,
        },
        safetySettings: [
          {
            category: "HARM_CATEGORY_HARASSMENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_HATE_SPEECH",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_SEXUALLY_EXPLICIT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          },
          {
            category: "HARM_CATEGORY_DANGEROUS_CONTENT",
            threshold: "BLOCK_MEDIUM_AND_ABOVE"
          }
        ]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Gemini API error: ${response.status} ${response.statusText} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Gemini API raw response:', data);
    if (!data || !data.candidates || !Array.isArray(data.candidates) || !data.candidates[0]?.content?.parts?.[0]?.text) {
      throw new Error('No valid response from Gemini API');
    }
    return data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Error calling Gemini API:', error);
    throw error;
  }
};

// Fallback interpretation when API fails
export const getFallbackInterpretation = (request: TarotInterpretationRequest): string => {
  const positionDescriptions: { [key: string]: string } = {
    "Quá khứ": "Thể hiện nền tảng và những trải nghiệm đã qua đã tạo nên hoàn cảnh hiện tại.",
    "Hiện tại": "Cho thấy tình hình hiện tại và những yếu tố đang ảnh hưởng đến câu hỏi của bạn.",
    "Tương lai": "Chỉ ra hướng phát triển có thể xảy ra nếu bạn tiếp tục theo con đường hiện tại.",
    "Tình huống": "Mô tả hoàn cảnh và bối cảnh hiện tại của vấn đề.",
    "Hành động": "Gợi ý những bước đi cụ thể bạn nên thực hiện.",
    "Kết quả": "Dự đoán kết quả có thể đạt được từ hành động.",
    "Tâm trí": "Phản ánh suy nghĩ và nhận thức của bạn về vấn đề.",
    "Thể xác": "Liên quan đến hành động và thực tế vật chất.",
    "Tinh thần": "Chỉ ra ý nghĩa sâu xa và bài học tâm linh.",
    "Trung tâm": "Vấn đề cốt lõi và trọng tâm của câu hỏi.",
    "Thách thức": "Những khó khăn và trở ngại cần vượt qua.",
    "Câu trả lời": "Lời khuyên trực tiếp cho câu hỏi của bạn.",
    "Lựa chọn 1": "Kết quả của lựa chọn đầu tiên.",
    "Lựa chọn 2": "Kết quả của lựa chọn thứ hai."
  };

  const positionText = request.cards.map((card, index) => 
    `🔮 **${request.spreadPositions[index]} - ${card}**: ${positionDescriptions[request.spreadPositions[index]] || "Thể hiện khía cạnh quan trọng của vấn đề."}`
  ).join('\n\n');

  return `Dựa trên câu hỏi "${request.question}" và trải bài ${request.spreadName}, đây là lời giải nghĩa:

${positionText}

**Tổng quan**: Sự kết hợp của những lá bài này cho thấy một hành trình với nhiều khía cạnh cần được cân nhắc kỹ lưỡng.

*Lưu ý: Đây là giải nghĩa mẫu. Vui lòng kiểm tra kết nối API để có kết quả chính xác hơn.*`;
}; 