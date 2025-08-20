import { Link, useLocation } from "wouter";
import { Home, TrendingUp, BookOpen, BarChart3, Sparkles } from "lucide-react";

export default function BottomNavigation() {
  const [location] = useLocation();

  const navItems = [
    { path: "/", icon: Home, label: "Home" },
    { path: "/mood", icon: TrendingUp, label: "Mood" },
    { path: "/journal", icon: BookOpen, label: "Journal" },
    { path: "/hobbies", icon: Sparkles, label: "Activities" },
    { path: "/progress", icon: BarChart3, label: "Progress" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 px-4 py-2 z-50">
      <div className="flex justify-around max-w-md mx-auto">
        {navItems.map((item) => {
          const isActive = location === item.path;
          const IconComponent = item.icon;
          
          return (
            <Link key={item.path} href={item.path}>
              <button
                className={`flex flex-col items-center py-2 px-3 transition-colors duration-200 ${
                  isActive
                    ? "text-primary-600"
                    : "text-gray-400 hover:text-gray-600"
                }`}
              >
                <IconComponent className="w-5 h-5 mb-1" />
                <span className="text-xs">{item.label}</span>
              </button>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
