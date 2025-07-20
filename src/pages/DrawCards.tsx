import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Sparkles, Shuffle, Eye } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

// Mock tarot cards data
const tarotCards = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
  "Judgement", "The World"
];

const DrawCards = () => {
  const [question, setQuestion] = useState("");
  const [drawnCards, setDrawnCards] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [interpretation, setInterpretation] = useState("");

  const drawCards = () => {
    if (!question.trim()) {
      toast.error("Vui lòng nhập câu hỏi trước khi bốc bài");
      return;
    }

    setIsDrawing(true);
    setInterpretation("");
    
    // Simulate card drawing animation
    setTimeout(() => {
      const shuffled = [...tarotCards].sort(() => Math.random() - 0.5);
      const drawn = shuffled.slice(0, 3); // Draw 3 cards for a simple spread
      setDrawnCards(drawn);
      setIsDrawing(false);
      toast.success("Đã bốc được 3 lá bài!");
    }, 2000);
  };

  const interpretCards = async () => {
    if (drawnCards.length === 0) {
      toast.error("Vui lòng bốc bài trước khi giải nghĩa");
      return;
    }

    // This would be where you call your AI API
    const prompt = `Bạn là một tarot reader chuyên nghiệp và khả năng giải nghĩa rất sâu sắc từ các lá bài theo những bối cảnh câu hỏi khác nhau.
Câu hỏi của tôi là: ${question}
Trải bài của tôi là: ${drawnCards.join(", ")}`;

    // Mock interpretation for now
    setInterpretation(`Dựa trên câu hỏi "${question}" và trải bài ${drawnCards.join(", ")}, đây là lời giải nghĩa:

🔮 **Quá khứ - ${drawnCards[0]}**: Thể hiện nền tảng và những trải nghiệm đã qua đã tạo nên hoàn cảnh hiện tại.

🔮 **Hiện tại - ${drawnCards[1]}**: Cho thấy tình hình hiện tại và những yếu tố đang ảnh hưởng đến câu hỏi của bạn.

🔮 **Tương lai - ${drawnCards[2]}**: Chỉ ra hướng phát triển có thể xảy ra nếu bạn tiếp tục theo con đường hiện tại.

*Lưu ý: Đây là giải nghĩa mẫu. Để có kết quả chính xác, hệ thống cần tích hợp AI.*`);

    toast.success("Đã hoàn thành giải nghĩa!");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Navigation />
        
        <Card className="p-8 shadow-card">
          <div className="text-center mb-8">
            <Sparkles className="h-12 w-12 mx-auto mb-4 text-primary animate-mystical-glow" />
            <h2 className="text-3xl font-bold mb-2">Bốc Bài Tarot</h2>
            <p className="text-muted-foreground">Đặt câu hỏi và để vũ trụ chọn bài cho bạn</p>
          </div>

          <div className="space-y-6">
            <div>
              <Label htmlFor="question" className="text-lg font-semibold">
                Câu hỏi của bạn
              </Label>
              <Textarea
                id="question"
                placeholder="Nhập câu hỏi bạn muốn hỏi tarot..."
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="mt-2 min-h-[100px] bg-muted/50"
              />
            </div>

            <div className="text-center">
              <Button
                onClick={drawCards}
                disabled={isDrawing}
                className="bg-gradient-primary hover:scale-105 transition-all duration-300 px-8 py-3 text-lg"
              >
                {isDrawing ? (
                  <>
                    <Shuffle className="mr-2 h-5 w-5 animate-spin" />
                    Đang bốc bài...
                  </>
                ) : (
                  <>
                    <Sparkles className="mr-2 h-5 w-5" />
                    Bốc Bài
                  </>
                )}
              </Button>
            </div>

            {drawnCards.length > 0 && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {drawnCards.map((card, index) => (
                    <Card key={index} className="p-6 text-center bg-gradient-mystical animate-float shadow-mystical">
                      <div className="mb-3">
                        <div className="w-16 h-24 bg-primary/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                          <Sparkles className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-primary-foreground">{card}</h3>
                      </div>
                      <p className="text-sm text-primary-foreground/80">
                        {index === 0 ? "Quá khứ" : index === 1 ? "Hiện tại" : "Tương lai"}
                      </p>
                    </Card>
                  ))}
                </div>

                <div className="text-center">
                  <Button
                    onClick={interpretCards}
                    className="bg-gradient-gold text-secondary-foreground hover:scale-105 transition-all duration-300"
                  >
                    <Eye className="mr-2 h-5 w-5" />
                    Giải Nghĩa Bài
                  </Button>
                </div>
              </div>
            )}

            {interpretation && (
              <Card className="p-6 bg-muted/50">
                <h3 className="text-xl font-semibold mb-4 text-primary">Lời Giải Nghĩa</h3>
                <div className="whitespace-pre-line text-foreground">
                  {interpretation}
                </div>
              </Card>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default DrawCards;