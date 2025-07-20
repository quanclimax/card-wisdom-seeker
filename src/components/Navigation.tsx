import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Sparkles, Eye, BookOpen } from "lucide-react";

const Navigation = () => {
  const location = useLocation();

  const navItems = [
    {
      path: "/",
      label: "Bốc Bài",
      icon: Sparkles,
      description: "Để số phận chọn bài cho bạn"
    },
    {
      path: "/interpret",
      label: "Giải Bài", 
      icon: Eye,
      description: "Giải nghĩa bài bạn đã chọn"
    },
    {
      path: "/cards",
      label: "Tra Bài",
      icon: BookOpen,
      description: "Tìm hiểu ý nghĩa từng lá bài"
    }
  ];

  return (
    <nav className="mb-8">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold bg-gradient-mystical bg-clip-text text-transparent mb-2">
          ✨ Mystical Tarot ✨
        </h1>
        <p className="text-muted-foreground">Khám phá bí ẩn qua lá bài tarot</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <Link key={item.path} to={item.path}>
              <Card className={`p-6 transition-all duration-300 hover:scale-105 hover:shadow-mystical cursor-pointer ${
                isActive 
                  ? 'bg-gradient-primary border-primary shadow-mystical' 
                  : 'hover:border-primary/50'
              }`}>
                <div className="text-center">
                  <Icon className={`h-8 w-8 mx-auto mb-3 ${
                    isActive ? 'text-primary-foreground' : 'text-primary'
                  }`} />
                  <h3 className={`text-lg font-semibold mb-2 ${
                    isActive ? 'text-primary-foreground' : 'text-foreground'
                  }`}>
                    {item.label}
                  </h3>
                  <p className={`text-sm ${
                    isActive ? 'text-primary-foreground/80' : 'text-muted-foreground'
                  }`}>
                    {item.description}
                  </p>
                </div>
              </Card>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default Navigation;