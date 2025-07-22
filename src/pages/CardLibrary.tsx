import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BookOpen, Search, Sparkles } from "lucide-react";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";

// Extended tarot cards with categories
const tarotCards = {
  "Major Arcana": [
    "The Fool", "The Magician", "The High Priestess", "The Empress", "The Emperor",
    "The Hierophant", "The Lovers", "The Chariot", "Strength", "The Hermit",
    "Wheel of Fortune", "Justice", "The Hanged Man", "Death", "Temperance",
    "The Devil", "The Tower", "The Star", "The Moon", "The Sun",
    "Judgement", "The World"
  ],
  "Cups (Cung Bách)": [
    "Ace of Cups", "Two of Cups", "Three of Cups", "Four of Cups", "Five of Cups",
    "Six of Cups", "Seven of Cups", "Eight of Cups", "Nine of Cups", "Ten of Cups",
    "Page of Cups", "Knight of Cups", "Queen of Cups", "King of Cups"
  ],
  "Pentacles (Đồng Xu)": [
    "Ace of Pentacles", "Two of Pentacles", "Three of Pentacles", "Four of Pentacles", "Five of Pentacles",
    "Six of Pentacles", "Seven of Pentacles", "Eight of Pentacles", "Nine of Pentacles", "Ten of Pentacles",
    "Page of Pentacles", "Knight of Pentacles", "Queen of Pentacles", "King of Pentacles"
  ],
  "Swords (Kiếm)": [
    "Ace of Swords", "Two of Swords", "Three of Swords", "Four of Swords", "Five of Swords",
    "Six of Swords", "Seven of Swords", "Eight of Swords", "Nine of Swords", "Ten of Swords",
    "Page of Swords", "Knight of Swords", "Queen of Swords", "King of Swords"
  ],
  "Wands (Gậy)": [
    "Ace of Wands", "Two of Wands", "Three of Wands", "Four of Wands", "Five of Wands",
    "Six of Wands", "Seven of Wands", "Eight of Wands", "Nine of Wands", "Ten of Wands",
    "Page of Wands", "Knight of Wands", "Queen of Wands", "King of Wands"
  ]
};

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

const CardLibrary = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [cardMeaning, setCardMeaning] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("Major Arcana");

  const filteredCards = tarotCards[selectedCategory as keyof typeof tarotCards].filter(card =>
    card.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getCardMeaning = async (card: string) => {
    setSelectedCard(card);
    setCardMeaning("");

    // This would be where you call your AI API
    const prompt = `Bạn là một tarot reader chuyên nghiệp và hãy cho tôi biết ý nghĩa của lá: ${card}`;

    // Mock meaning for now
    setTimeout(() => {
      setCardMeaning(`🔮 **${card}**

**Ý nghĩa chính:**
Lá bài ${card} mang trong mình những thông điệp sâu sắc về ${card.includes('Ace') ? 'khởi đầu mới và tiềm năng' : card.includes('King') ? 'quyền lực và sự trưởng thành' : card.includes('Queen') ? 'trực giác và sự nuôi dưỡng' : 'hành trình và thử thách'}.

**Trong tình yêu:**
${card} thể hiện ${card.includes('Cups') ? 'những cảm xúc sâu sắc và mối quan hệ ý nghĩa' : card.includes('Pentacles') ? 'sự ổn định và cam kết lâu dài' : card.includes('Swords') ? 'những thách thức trong giao tiếp' : 'đam mê và năng lượng mới'}.

**Trong sự nghiệp:**
Lá bài này gợi ý ${card.includes('Pentacles') ? 'cơ hội tài chính và thành công vật chất' : card.includes('Wands') ? 'động lực làm việc và sáng tạo' : card.includes('Swords') ? 'cần suy nghĩ logic và quyết đoán' : 'cần lắng nghe trực giác'}.

**Lời khuyên:**
${card} khuyên bạn nên ${card.includes('Major') ? 'chú ý đến những bài học lớn trong cuộc sống' : 'tập trung vào những chi tiết nhỏ trong cuộc sống hàng ngày'}.

*Lưu ý: Đây là giải nghĩa mẫu. Để có kết quả chính xác, hệ thống cần tích hợp AI.*`);
    }, 1000);

    toast.success(`Đang tải ý nghĩa của ${card}...`);
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <Navigation />
        
        <Card className="p-8 shadow-card">
          <div className="text-center mb-8">
            <BookOpen className="h-12 w-12 mx-auto mb-4 text-primary animate-mystical-glow" />
            <h2 className="text-3xl font-bold mb-2">Thư Viện Tarot</h2>
            <p className="text-muted-foreground">Tìm hiểu ý nghĩa của từng lá bài</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Panel - Card Selection */}
            <div className="lg:col-span-2 space-y-6">
              {/* Search */}
              <div className="space-y-2">
                <Label htmlFor="search">Tìm kiếm lá bài</Label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder="Nhập tên lá bài..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 bg-muted/50"
                  />
                </div>
              </div>

              {/* Category Tabs */}
              <div className="flex flex-wrap gap-2">
                {Object.keys(tarotCards).map((category) => (
                  <Button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    variant={selectedCategory === category ? "default" : "outline"}
                    className={selectedCategory === category ? "bg-gradient-primary" : ""}
                  >
                    {category}
                  </Button>
                ))}
              </div>

              {/* Cards Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {filteredCards.map((card) => (
                  <Card
                    key={card}
                    className={`p-4 cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-mystical ${
                      selectedCard === card ? 'bg-gradient-mystical shadow-mystical' : 'hover:border-primary/50'
                    }`}
                    onClick={() => getCardMeaning(card)}
                  >
                    <div className="text-center">
                      <div className="w-16 h-24 bg-primary/20 rounded-lg mx-auto mb-3 flex items-center justify-center">
                        {tarotImageMap[card] ? (
                          <img src={tarotImageMap[card]} alt={card} className="h-full w-full object-contain" />
                        ) : (
                          <Sparkles className="h-8 w-8 text-primary" />
                        )}
                      </div>
                      <h3 className={`text-sm font-medium ${
                        selectedCard === card ? 'text-primary-foreground' : 'text-foreground'
                      }`}>
                        {card}
                      </h3>
                    </div>
                  </Card>
                ))}
              </div>
            </div>

            {/* Right Panel - Card Meaning */}
            <div className="space-y-6">
              <Card className="p-6 bg-muted/30 min-h-[400px]">
                {selectedCard ? (
                  <div>
                    <h3 className="text-xl font-semibold mb-4 text-primary text-center">
                      {selectedCard}
                    </h3>
                    <div className="w-24 h-36 bg-gradient-mystical rounded-lg mx-auto mb-6 flex items-center justify-center shadow-mystical">
                      {tarotImageMap[selectedCard] ? (
                        <img src={tarotImageMap[selectedCard]} alt={selectedCard} className="h-full w-full object-contain" />
                      ) : (
                        <Sparkles className="h-12 w-12 text-primary-foreground" />
                      )}
                    </div>
                    {cardMeaning ? (
                      <div className="whitespace-pre-line text-foreground">
                        {cardMeaning}
                      </div>
                    ) : (
                      <div className="text-center text-muted-foreground">
                        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
                        Đang tải ý nghĩa...
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                    <div>
                      <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
                      <p>Chọn một lá bài để xem ý nghĩa</p>
                    </div>
                  </div>
                )}
              </Card>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CardLibrary;