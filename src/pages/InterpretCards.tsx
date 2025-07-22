import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Eye, Plus, X, Crown, Heart, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import { callGeminiAPI, getFallbackInterpretation, TarotInterpretationRequest } from "@/lib/gemini";

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

// Thêm tarotImageMap
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

const InterpretCards = () => {
  const [question, setQuestion] = useState("");
  const [selectedCards, setSelectedCards] = useState<string[]>([]);
  const [interpretation, setInterpretation] = useState("");
  const [activeTab, setActiveTab] = useState("major");
  const [isInterpreting, setIsInterpreting] = useState(false);

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

    setIsInterpreting(true);
    setInterpretation("");

    try {
      const request: TarotInterpretationRequest = {
        question: question,
        spreadName: "Trải bài tùy chọn",
        cards: selectedCards,
        spreadPositions: selectedCards.map((_, index) => `Vị trí ${index + 1}`)
      };

      // Try to call Gemini API
      const result = await callGeminiAPI(request);
      setInterpretation(result);
      toast.success("Đã hoàn thành giải nghĩa với AI!");
    } catch (error) {
      console.error('Error calling Gemini API:', error);
      
      // Fallback to mock interpretation
      const request: TarotInterpretationRequest = {
        question: question,
        spreadName: "Trải bài tùy chọn",
        cards: selectedCards,
        spreadPositions: selectedCards.map((_, index) => `Vị trí ${index + 1}`)
      };
      
      const fallbackResult = getFallbackInterpretation(request);
      setInterpretation(fallbackResult);
      
      toast.error("Không thể kết nối AI. Đang sử dụng giải nghĩa mẫu. Vui lòng kiểm tra API key.");
    } finally {
      setIsInterpreting(false);
    }
  };

  const renderCardGrid = (cards: string[]) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
      {cards.map((card) => (
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
  );

  const renderCardImagesGrid = (cards: string[]) => (
    <div className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 max-h-96 overflow-y-auto mb-4">
      {cards.map((card) => (
        <div key={card} className="flex flex-col items-center">
          <div className="w-20 h-32 rounded-lg bg-background/80 shadow border border-primary/30 mb-2 overflow-hidden flex items-center justify-center">
            {tarotImageMap[card] ? (
              <img src={tarotImageMap[card]} alt={card} className="object-cover w-full h-full" />
            ) : (
              <span className="text-xs text-primary-foreground text-center p-2">{card}</span>
            )}
          </div>
          <span className="text-xs text-center text-primary-foreground/80">{card}</span>
        </div>
      ))}
    </div>
  );

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
                        <div className="w-12 h-16 bg-primary/20 rounded mx-auto mb-2 flex items-center justify-center overflow-hidden">
                          {tarotImageMap[card] ? (
                            <img src={tarotImageMap[card]} alt={card} className="object-cover w-full h-full" />
                          ) : (
                            <Eye className="h-6 w-6 text-primary" />
                          )}
                        </div>
                        <p className="text-sm font-medium text-primary-foreground">{card}</p>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              <Card className="p-4 bg-muted/30">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid w-full grid-cols-5 mb-4">
                    <TabsTrigger value="major" className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Major Arcana
                    </TabsTrigger>
                    <TabsTrigger value="cups" className="flex items-center gap-2">
                      <Heart className="h-4 w-4" />
                      Cups
                    </TabsTrigger>
                    <TabsTrigger value="wands" className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Wands
                    </TabsTrigger>
                    <TabsTrigger value="swords" className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Swords
                    </TabsTrigger>
                    <TabsTrigger value="pentacles" className="flex items-center gap-2">
                      <Crown className="h-4 w-4" />
                      Pentacles
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="major" className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Crown className="h-5 w-5 text-primary" />
                      <h4 className="font-semibold">Major Arcana - Những lá bài chính (22 lá)</h4>
                    </div>
                    {renderCardGrid(majorArcana)}
                  </TabsContent>

                  <TabsContent value="cups" className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Heart className="h-5 w-5 text-blue-400" />
                      <h4 className="font-semibold">Cups - Cốc (Tình cảm, Tình yêu) - 14 lá</h4>
                    </div>
                    {renderCardGrid(cups)}
                  </TabsContent>

                  <TabsContent value="wands" className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Crown className="h-5 w-5 text-yellow-400" />
                      <h4 className="font-semibold">Wands - Gậy (Sáng tạo, Năng lượng) - 14 lá</h4>
                    </div>
                    {renderCardGrid(wands)}
                  </TabsContent>

                  <TabsContent value="swords" className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Crown className="h-5 w-5 text-gray-400" />
                      <h4 className="font-semibold">Swords - Kiếm (Trí tuệ, Thách thức) - 14 lá</h4>
                    </div>
                    {renderCardGrid(swords)}
                  </TabsContent>

                  <TabsContent value="pentacles" className="space-y-4">
                    <div className="flex items-center gap-2 mb-3">
                      <Crown className="h-5 w-5 text-green-400" />
                      <h4 className="font-semibold">Pentacles - Đồng xu (Vật chất, Thực tế) - 14 lá</h4>
                    </div>
                    {renderCardGrid(pentacles)}
                  </TabsContent>
                </Tabs>
              </Card>
            </div>

            <div className="text-center">
              <Button
                onClick={interpretCards}
                disabled={isInterpreting}
                className="bg-gradient-gold text-secondary-foreground hover:scale-105 transition-all duration-300"
              >
                {isInterpreting ? (
                  <>
                    <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                    AI đang giải nghĩa...
                  </>
                ) : (
                  <>
                    <Eye className="mr-2 h-5 w-5" />
                    Giải Nghĩa Bài với AI
                  </>
                )}
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