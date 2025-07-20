import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Eye, Plus, X } from "lucide-react";
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

const InterpretCards = () => {
  const [question, setQuestion] = useState("");
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [interpretation, setInterpretation] = useState("");
  const [showCardList, setShowCardList] = useState(false);

  const addCard = (card: string) => {
    if (!selectedCards.includes(card)) {
      setSelectedCards([...selectedCards, card]);
      toast.success(`Đã thêm ${card}`);
    } else {
      toast.error("Lá bài này đã được chọn");
    }
  };

  const removeCard = (index: number) => {
    const newCards = selectedCards.filter((_, i) => i !== index);
    setSelectedCards(newCards);
  };

  const interpretCards = async () => {
    if (!question.trim()) {
      toast.error("Vui lòng nhập câu hỏi");
      return;
    }
    
    if (selectedCards.length === 0) {
      toast.error("Vui lòng chọn ít nhất 1 lá bài");
      return;
    }

    // This would be where you call your AI API
    const prompt = `Bạn là một tarot reader chuyên nghiệp và khả năng giải nghĩa rất sâu sắc từ các lá bài theo những bối cảnh câu hỏi khác nhau.
Câu hỏi của tôi là: ${question}
Trải bài của tôi là: ${selectedCards.join(", ")}`;

    // Mock interpretation for now
    setInterpretation(`Dựa trên câu hỏi "${question}" và những lá bài bạn đã chọn: ${selectedCards.join(", ")}, đây là lời giải nghĩa:

${selectedCards.map((card, index) => `🔮 **${card}**: Lá bài này thể hiện ${index === 0 ? 'khía cạnh cốt lõi' : index === 1 ? 'những thách thức' : 'tiềm năng phát triển'} trong vấn đề bạn quan tâm.`).join('\n\n')}

**Tổng quan**: Sự kết hợp của những lá bài này cho thấy một hành trình với nhiều khía cạnh cần được cân nhắc kỹ lưỡng.

*Lưu ý: Đây là giải nghĩa mẫu. Để có kết quả chính xác, hệ thống cần tích hợp AI.*`);

    toast.success("Đã hoàn thành giải nghĩa!");
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-4xl mx-auto">
        <Navigation />
        
        <Card className="p-8 shadow-card">
          <div className="text-center mb-8">
            <Eye className="h-12 w-12 mx-auto mb-4 text-primary animate-mystical-glow" />
            <h2 className="text-3xl font-bold mb-2">Giải Bài Tarot</h2>
            <p className="text-muted-foreground">Chọn những lá bài bạn đã rút và nhận được lời giải nghĩa</p>
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

            <div>
              <div className="flex items-center justify-between mb-4">
                <Label className="text-lg font-semibold">
                  Những lá bài đã chọn ({selectedCards.length})
                </Label>
                <Button
                  onClick={() => setShowCardList(!showCardList)}
                  variant="outline"
                  className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Thêm Bài
                </Button>
              </div>

              {selectedCards.length > 0 && (
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-4">
                  {selectedCards.map((card, index) => (
                    <Card key={index} className="p-3 bg-gradient-mystical relative group">
                      <Button
                        onClick={() => removeCard(index)}
                        variant="ghost"
                        size="sm"
                        className="absolute -top-2 -right-2 h-6 w-6 p-0 bg-destructive text-destructive-foreground rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                      <div className="text-center">
                        <div className="w-12 h-16 bg-primary/20 rounded mx-auto mb-2 flex items-center justify-center">
                          <Eye className="h-6 w-6 text-primary" />
                        </div>
                        <p className="text-sm font-medium text-primary-foreground">{card}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {showCardList && (
                <Card className="p-4 bg-muted/30">
                  <h4 className="font-semibold mb-3">Chọn lá bài:</h4>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
                    {tarotCards.map((card) => (
                      <Button
                        key={card}
                        onClick={() => addCard(card)}
                        variant="outline"
                        size="sm"
                        className={`text-xs ${
                          selectedCards.includes(card) 
                            ? 'bg-primary text-primary-foreground' 
                            : 'hover:bg-primary/10'
                        }`}
                        disabled={selectedCards.includes(card)}
                      >
                        {card}
                      </Button>
                    ))}
                  </div>
                </Card>
              )}
            </div>

            <div className="text-center">
              <Button
                onClick={interpretCards}
                className="bg-gradient-gold text-secondary-foreground hover:scale-105 transition-all duration-300 px-8 py-3 text-lg"
              >
                <Eye className="mr-2 h-5 w-5" />
                Giải Nghĩa Bài
              </Button>
            </div>

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

export default InterpretCards;