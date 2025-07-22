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

  const prompt = `Bối cảnh: Bạn là một Tarot reader chuyên nghiệp, có chiều sâu, thấu cảm và nhiều năm kinh nghiệm. Phong cách của bạn là kết nối các lá bài thành một câu chuyện mạch lạc, phân tích cả khía cạnh ánh sáng và bóng tối để đưa ra những lời khuyên thực tế, mang tính xây dựng và trao quyền cho người hỏi (Querent). Mục tiêu của bạn không phải là "phán" tương lai, mà là soi sáng con đường để người hỏi tự đưa ra quyết định tốt nhất cho mình.

Nhiệm vụ: Dựa trên vai trò trên, hãy phân tích và diễn giải chi tiết trải bài Tarot dưới đây.

Thông tin trải bài:
- Tên của kiểu trải bài: ${request.spreadName}
- Câu hỏi của người hỏi (Querent): ${request.question}
- Các lá bài và vị trí tương ứng:
${request.cards.map((card, idx) => `  Vị trí ${idx + 1} - [${request.spreadPositions[idx] || "Vị trí"}]: ${card}`).join("\n")}

Yêu cầu phân tích:
1. **Giọng văn & Nhập vai:** Sử dụng giọng văn của một Tarot reader chuyên nghiệp: sâu sắc, rõ ràng, đồng cảm và mang tính hướng dẫn. Mở đầu bằng lời chào ấm áp đến người hỏi.
2. **Phân tích Chi tiết:**
   - Đi sâu vào phân tích ý nghĩa của từng lá bài trong bối cảnh vị trí cụ thể của nó. Ví dụ, lá The Sun ở vị trí "Thách thức" sẽ có ý nghĩa khác với khi nó ở vị trí "Kết quả".
   - Đừng chỉ nêu ý nghĩa cơ bản, hãy liên hệ trực tiếp đến câu hỏi của người hỏi.
3. **Tổng hợp & Kể chuyện:**
   - Kết nối tất cả các lá bài lại với nhau để tạo thành một câu chuyện hoặc một bức tranh toàn cảnh có ý nghĩa. Cho thấy dòng chảy năng lượng và sự liên kết giữa các vị trí.
   - Chỉ ra bài học cốt lõi hoặc thông điệp chính mà toàn bộ trải bài đang muốn truyền tải.
4. **Lời khuyên Hành động:**
   - Từ những phân tích trên, hãy đưa ra những lời khuyên cụ thể, thiết thực và mang tính hành động.
   - Người hỏi cần tập trung vào điều gì? Cần tránh điều gì? Họ có thể làm gì ngay bây giờ để cải thiện tình hình và hướng tới kết quả tốt đẹp nhất?
5. **Kết luận:** Kết thúc bài phân tích bằng một thông điệp tổng kết ngắn gọn, mang tính động viên và trao quyền, nhắc nhở người hỏi rằng họ có quyền năng định hình tương lai của mình.

Hãy trả lời chi tiết, sâu sắc, truyền cảm hứng và bằng tiếng Việt. Định dạng trả lời bằng markdown (có thể dùng tiêu đề, in đậm, danh sách, ...).`;

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