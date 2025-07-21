import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Sparkles, Shuffle, Eye, Clock, Heart, Target, Zap, BookOpen, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { callGeminiAPI, getFallbackInterpretation, TarotInterpretationRequest } from "@/lib/gemini";
import TarotModal from "@/components/TarotModal";
import React from "react";

// Major Arcana cards (22 lá)
const majorArcana = [
  "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
  "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
  "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
  "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
  "Judgement", "The World"
];

// Minor Arcana - Cups (Cốc) - 14 lá
const cups = [
  "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups", "Five of Cups",
  "Six of Cups", "Seven of Cups", "Eight of Cups", "Nine of Cups", "Ten of Cups",
  "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups"
];

// Minor Arcana - Wands (Gậy) - 14 lá
const wands = [
  "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands", "Five of Wands",
  "Six of Wands", "Seven of Wands", "Eight of Wands", "Nine of Wands", "Ten of Wands",
  "Page of Wands", "Knight of Wands", "Queen of Wands", "King of Wands"
];

// Minor Arcana - Swords (Kiếm) - 14 lá
const swords = [
  "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords", "Five of Swords",
  "Six of Swords", "Seven of Swords", "Eight of Swords", "Nine of Swords", "Ten of Swords",
  "Page of Swords", "Knight of Swords", "Queen of Swords", "King of Swords"
];

// Minor Arcana - Pentacles (Đồng xu) - 14 lá
const pentacles = [
  "Ace of Pentacles", "Two of Pentacles", "Three of Pentacles", "Four of Pentacles", "Five of Pentacles",
  "Six of Pentacles", "Seven of Pentacles", "Eight of Pentacles", "Nine of Pentacles", "Ten of Pentacles",
  "Page of Pentacles", "Knight of Pentacles", "Queen of Pentacles", "King of Pentacles"
];

// Complete tarot deck (78 lá)
const completeTarotDeck = [
  ...majorArcana,
  ...cups,
  ...wands,
  ...swords,
  ...pentacles
];

// Spread options
const spreadOptions = [
  {
    id: "past-present-future",
    name: "Quá khứ - Hiện tại - Tương lai",
    description: "Xem xét hành trình thời gian",
    cardCount: 3,
    positions: ["Quá khứ", "Hiện tại", "Tương lai"]
  },
  {
    id: "situation-action-outcome",
    name: "Tình huống - Hành động - Kết quả",
    description: "Tập trung vào hành động",
    cardCount: 3,
    positions: ["Tình huống", "Hành động", "Kết quả"]
  },
  {
    id: "mind-body-spirit",
    name: "Tâm trí - Thể xác - Tinh thần",
    description: "Cân bằng ba khía cạnh",
    cardCount: 3,
    positions: ["Tâm trí", "Thể xác", "Tinh thần"]
  },
  {
    id: "celtic-cross",
    name: "Celtic Cross (Rút gọn)",
    description: "Trải bài chi tiết",
    cardCount: 5,
    positions: ["Trung tâm", "Thách thức", "Quá khứ", "Tương lai", "Kết quả"]
  },
  {
    id: "single-card",
    name: "Một lá bài",
    description: "Câu trả lời đơn giản",
    cardCount: 1,
    positions: ["Câu trả lời"]
  },
  {
    id: "two-cards",
    name: "Hai lá bài",
    description: "So sánh hai lựa chọn",
    cardCount: 2,
    positions: ["Lựa chọn 1", "Lựa chọn 2"]
  }
];

// Question suggestions
const questionSuggestions = [
  "Tôi nên làm gì để cải thiện mối quan hệ hiện tại?",
  "Công việc hiện tại có phù hợp với tôi không?",
  "Làm thế nào để vượt qua khó khăn này?",
  "Tôi có nên thay đổi hướng đi trong cuộc sống không?",
  "Điều gì đang ngăn cản tôi đạt được mục tiêu?",
  "Tôi cần tập trung vào điều gì trong thời gian tới?",
  "Làm sao để tìm thấy hạnh phúc thực sự?",
  "Tôi có nên tin tưởng vào quyết định này không?"
];

const tarotImageMap: Record<string, string> = {
  // Major Arcana
  "The Fool": "https://upload.wikimedia.org/wikipedia/commons/9/90/RWS_Tarot_00_Fool.jpg",
  "The Magician": "https://upload.wikimedia.org/wikipedia/commons/d/de/RWS_Tarot_01_Magician.jpg",
  "The High Priestess": "https://upload.wikimedia.org/wikipedia/commons/8/88/RWS_Tarot_02_High_Priestess.jpg",
  "The Empress": "https://upload.wikimedia.org/wikipedia/commons/d/d2/RWS_Tarot_03_Empress.jpg",
  "The Emperor": "https://upload.wikimedia.org/wikipedia/commons/c/c3/RWS_Tarot_04_Emperor.jpg",
  "The Hierophant": "https://upload.wikimedia.org/wikipedia/commons/8/8d/RWS_Tarot_05_Hierophant.jpg",
  "The Lovers": "https://upload.wikimedia.org/wikipedia/commons/3/3a/TheLovers.jpg",
  "The Chariot": "https://upload.wikimedia.org/wikipedia/commons/3/3b/RWS_Tarot_07_Chariot.jpg",
  "Strength": "https://upload.wikimedia.org/wikipedia/commons/f/f5/RWS_Tarot_08_Strength.jpg",
  "The Hermit": "https://upload.wikimedia.org/wikipedia/commons/4/4d/RWS_Tarot_09_Hermit.jpg",
  "Wheel of Fortune": "https://upload.wikimedia.org/wikipedia/commons/3/3c/RWS_Tarot_10_Wheel_of_Fortune.jpg",
  "Justice": "https://upload.wikimedia.org/wikipedia/commons/c/c0/RWS_Tarot_11_Justice.jpg",
  "The Hanged Man": "https://upload.wikimedia.org/wikipedia/commons/2/2b/RWS_Tarot_12_Hanged_Man.jpg",
  "Death": "https://upload.wikimedia.org/wikipedia/commons/d/d7/RWS_Tarot_13_Death.jpg",
  "Temperance": "https://upload.wikimedia.org/wikipedia/commons/f/f8/RWS_Tarot_14_Temperance.jpg",
  "The Devil": "https://upload.wikimedia.org/wikipedia/commons/5/55/RWS_Tarot_15_Devil.jpg",
  "The Tower": "https://upload.wikimedia.org/wikipedia/commons/5/53/RWS_Tarot_16_Tower.jpg",
  "The Star": "https://upload.wikimedia.org/wikipedia/commons/d/db/RWS_Tarot_17_Star.jpg",
  "The Moon": "https://upload.wikimedia.org/wikipedia/commons/7/7f/RWS_Tarot_18_Moon.jpg",
  "The Sun": "https://upload.wikimedia.org/wikipedia/commons/1/17/RWS_Tarot_19_Sun.jpg",
  "Judgement": "https://upload.wikimedia.org/wikipedia/commons/d/dd/RWS_Tarot_20_Judgement.jpg",
  "The World": "https://upload.wikimedia.org/wikipedia/commons/f/ff/RWS_Tarot_21_World.jpg",
  // Minor Arcana - Cups
  "Ace of Cups": "https://upload.wikimedia.org/wikipedia/commons/3/36/Cups01.jpg",
  "Two of Cups": "https://upload.wikimedia.org/wikipedia/commons/f/f8/Cups02.jpg",
  "Three of Cups": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Cups03.jpg",
  "Four of Cups": "https://upload.wikimedia.org/wikipedia/commons/6/60/Cups04.jpg",
  "Five of Cups": "https://upload.wikimedia.org/wikipedia/commons/1/17/Cups05.jpg",
  "Six of Cups": "https://upload.wikimedia.org/wikipedia/commons/6/66/Cups06.jpg",
  "Seven of Cups": "https://upload.wikimedia.org/wikipedia/commons/8/84/Cups07.jpg",
  "Eight of Cups": "https://upload.wikimedia.org/wikipedia/commons/6/60/Cups08.jpg",
  "Nine of Cups": "https://upload.wikimedia.org/wikipedia/commons/2/24/Cups09.jpg",
  "Ten of Cups": "https://upload.wikimedia.org/wikipedia/commons/8/84/Cups10.jpg",
  "Page of Cups": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Cups11.jpg",
  "Knight of Cups": "https://upload.wikimedia.org/wikipedia/commons/8/84/Cups12.jpg",
  "Queen of Cups": "https://upload.wikimedia.org/wikipedia/commons/5/52/Cups13.jpg",
  "King of Cups": "https://upload.wikimedia.org/wikipedia/commons/7/7a/Cups14.jpg",
  // Minor Arcana - Wands
  "Ace of Wands": "https://upload.wikimedia.org/wikipedia/commons/1/11/Wands01.jpg",
  "Two of Wands": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Wands02.jpg",
  "Three of Wands": "https://upload.wikimedia.org/wikipedia/commons/f/ff/Wands03.jpg",
  "Four of Wands": "https://upload.wikimedia.org/wikipedia/commons/a/a4/Wands04.jpg",
  "Five of Wands": "https://upload.wikimedia.org/wikipedia/commons/9/9b/Wands05.jpg",
  "Six of Wands": "https://upload.wikimedia.org/wikipedia/commons/3/3b/Wands06.jpg",
  "Seven of Wands": "https://upload.wikimedia.org/wikipedia/commons/e/e4/Wands07.jpg",
  "Eight of Wands": "https://upload.wikimedia.org/wikipedia/commons/6/6b/Wands08.jpg",
  "Nine of Wands": "https://upload.wikimedia.org/wikipedia/commons/2/2b/Wands09.jpg",
  "Ten of Wands": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Wands10.jpg",
  "Page of Wands": "https://upload.wikimedia.org/wikipedia/commons/1/1c/Wands11.jpg",
  "Knight of Wands": "https://upload.wikimedia.org/wikipedia/commons/0/0d/Wands12.jpg",
  "Queen of Wands": "https://upload.wikimedia.org/wikipedia/commons/0/0b/Wands13.jpg",
  "King of Wands": "https://upload.wikimedia.org/wikipedia/commons/1/1c/Wands14.jpg",
  // Minor Arcana - Swords
  "Ace of Swords": "https://upload.wikimedia.org/wikipedia/commons/1/1a/Swords01.jpg",
  "Two of Swords": "https://upload.wikimedia.org/wikipedia/commons/9/9e/Swords02.jpg",
  "Three of Swords": "https://upload.wikimedia.org/wikipedia/commons/0/02/Swords03.jpg",
  "Four of Swords": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Swords04.jpg",
  "Five of Swords": "https://upload.wikimedia.org/wikipedia/commons/2/23/Swords05.jpg",
  "Six of Swords": "https://upload.wikimedia.org/wikipedia/commons/6/62/Swords06.jpg",
  "Seven of Swords": "https://upload.wikimedia.org/wikipedia/commons/3/34/Swords07.jpg",
  "Eight of Swords": "https://upload.wikimedia.org/wikipedia/commons/9/9c/Swords08.jpg",
  "Nine of Swords": "https://upload.wikimedia.org/wikipedia/commons/2/2c/Swords09.jpg",
  "Ten of Swords": "https://upload.wikimedia.org/wikipedia/commons/d/d4/Swords10.jpg",
  "Page of Swords": "https://upload.wikimedia.org/wikipedia/commons/8/8c/Swords11.jpg",
  "Knight of Swords": "https://upload.wikimedia.org/wikipedia/commons/0/02/Swords12.jpg",
  "Queen of Swords": "https://upload.wikimedia.org/wikipedia/commons/1/1c/Swords13.jpg",
  "King of Swords": "https://upload.wikimedia.org/wikipedia/commons/3/34/Swords14.jpg",
  // Minor Arcana - Pentacles
  "Ace of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/f/fd/Pents01.jpg",
  "Two of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/8/8d/Pents02.jpg",
  "Three of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/4/42/Pents03.jpg",
  "Four of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/2/2b/Pents04.jpg",
  "Five of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/8/88/Pents05.jpg",
  "Six of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Pents06.jpg",
  "Seven of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Pents07.jpg",
  "Eight of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Pents08.jpg",
  "Nine of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Pents09.jpg",
  "Ten of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/4/42/Pents10.jpg",
  "Page of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/6/6a/Pents11.jpg",
  "Knight of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/8/88/Pents12.jpg",
  "Queen of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/9/9f/Pents13.jpg",
  "King of Pentacles": "https://upload.wikimedia.org/wikipedia/commons/2/2d/Pents14.jpg"
};

const DrawCards = () => {
  const [question, setQuestion] = useState("");
  const [selectedSpread, setSelectedSpread] = useState("past-present-future");
  const [drawnCards, setDrawnCards] = useState<string[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [interpretation, setInterpretation] = useState("");
  const [isInterpreting, setIsInterpreting] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [autoInterpret, setAutoInterpret] = useState(false);

  const selectedSpreadData = spreadOptions.find(spread => spread.id === selectedSpread);

  const drawCards = () => {
    if (!question.trim()) {
      toast.error("Vui lòng nhập câu hỏi trước khi bốc bài");
      return;
    }

    setIsDrawing(true);
    setInterpretation("");
    setShowModal(true);
    setAutoInterpret(false);
    
    setTimeout(() => {
      const shuffled = [...completeTarotDeck].sort(() => Math.random() - 0.5);
      const drawn = shuffled.slice(0, selectedSpreadData?.cardCount || 3);
      setDrawnCards(drawn);
      setIsDrawing(false);
      setAutoInterpret(true); // Trigger auto AI
      toast.success(`Đã bốc được ${drawn.length} lá bài!`);
    }, 2000);
  };

  // Tự động gọi AI khi vừa bốc bài xong
  React.useEffect(() => {
    if (autoInterpret && drawnCards.length > 0 && !isDrawing) {
      interpretCards();
      setAutoInterpret(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [autoInterpret, drawnCards, isDrawing]);

  const interpretCards = async () => {
    if (drawnCards.length === 0) {
      toast.error("Vui lòng bốc bài trước khi giải nghĩa");
      return;
    }

    setIsInterpreting(true);
    setInterpretation("");
    setShowModal(true);

    try {
      const request: TarotInterpretationRequest = {
        question: question,
        spreadName: selectedSpreadData?.name || "Trải bài",
        cards: drawnCards,
        spreadPositions: selectedSpreadData?.positions || []
      };

      const result = await callGeminiAPI(request);
      setInterpretation(result);
      toast.success("Đã hoàn thành giải nghĩa với AI!");
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Fallback to mock interpretation
      const request: TarotInterpretationRequest = {
        question: question,
        spreadName: selectedSpreadData?.name || "Trải bài",
        cards: drawnCards,
        spreadPositions: selectedSpreadData?.positions || []
      };
      
      const fallbackResult = getFallbackInterpretation(request);
      setInterpretation(fallbackResult);
      
      toast.error("Không thể kết nối AI. Đang sử dụng giải nghĩa mẫu. Vui lòng kiểm tra API key.");
    } finally {
      setIsInterpreting(false);
    }
  };

  const addSuggestion = (suggestion: string) => {
    setQuestion(suggestion);
  };

  return (
    <>
      {/* Tarot Modal Popup */}
      <TarotModal
        open={showModal}
        loading={isDrawing || isInterpreting}
        cards={drawnCards.map(name => ({ name, image: tarotImageMap[name] }))}
        aiResult={interpretation}
        onClose={() => setShowModal(false)}
      />
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
              {/* Spread Selection */}
              <div>
                <Label className="text-lg font-semibold mb-3 block">
                  Chọn kiểu trải bài
                </Label>
                <Select value={selectedSpread} onValueChange={setSelectedSpread}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Chọn kiểu trải bài" />
                  </SelectTrigger>
                  <SelectContent>
                    {spreadOptions.map((spread) => (
                      <SelectItem key={spread.id} value={spread.id}>
                        <div className="flex flex-col">
                          <span className="font-medium">{spread.name}</span>
                          <span className="text-sm text-muted-foreground">{spread.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Question Input */}
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
                
                {/* Question Suggestions */}
                <div className="mt-3">
                  <Label className="text-sm font-medium text-muted-foreground mb-2 block">
                    Gợi ý câu hỏi:
                  </Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    {questionSuggestions.slice(0, 6).map((suggestion, index) => (
                      <Button
                        key={index}
                        variant="outline"
                        size="sm"
                        onClick={() => addSuggestion(suggestion)}
                        className="text-xs text-left justify-start h-auto p-2"
                      >
                        <BookOpen className="h-3 w-3 mr-2 flex-shrink-0" />
                        {suggestion}
                      </Button>
                    ))}
                  </div>
                </div>
              </div>

              {/* Draw Button */}
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
                      Bốc {selectedSpreadData?.cardCount || 3} Lá Bài
                    </>
                  )}
                </Button>
              </div>

              {/* Drawn Cards */}
              {drawnCards.length > 0 && (
                <div className="space-y-6">
                  <div className={`grid gap-4 ${
                    drawnCards.length === 1 ? 'grid-cols-1 max-w-md mx-auto' :
                    drawnCards.length === 2 ? 'grid-cols-1 md:grid-cols-2' :
                    'grid-cols-1 md:grid-cols-3 lg:grid-cols-5'
                  }`}>
                    {drawnCards.map((card, index) => (
                      <Card key={index} className="p-6 text-center bg-gradient-mystical animate-float shadow-mystical">
                        <div className="mb-3">
                          <div className="w-16 h-24 bg-primary/20 rounded-lg mx-auto mb-3 flex items-center justify-center overflow-hidden">
                            {tarotImageMap[card] ? (
                              <img
                                src={tarotImageMap[card]}
                                alt={card}
                                className="object-cover w-full h-full"
                              />
                            ) : (
                              <Sparkles className="h-8 w-8 text-primary" />
                            )}
                          </div>
                          <h3 className="font-semibold text-primary-foreground text-sm">{card}</h3>
                        </div>
                        <p className="text-xs text-primary-foreground/80">
                          {selectedSpreadData?.positions[index] || `Vị trí ${index + 1}`}
                        </p>
                      </Card>
                    ))}
                  </div>

                  {/* Không render nút Giải Nghĩa Bài với AI nữa */}
                </div>
              )}

              {/* Interpretation */}
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
    </>
  );
};

export default DrawCards;