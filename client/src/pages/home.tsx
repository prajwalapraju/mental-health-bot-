import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Phone, Sparkles, Heart, BookOpen, Zap, Wind, Star } from "lucide-react";
import { Link } from "wouter";
import type { MoodEntry } from "@shared/schema";

const realms = [
  {
    id: "joy",
    name: "Joy Realm",
    description: "Celebrate your happiness and amplify positive energy",
    gradient: "from-yellow-400 via-orange-400 to-pink-500",
    icon: Star,
    character: "✨",
    mood: "joyful",
    features: ["Celebration badges", "Uplifting prompts", "Joy journaling", "Gratitude exercises"],
    bgPattern: "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))]"
  },
  {
    id: "anxiety",
    name: "Anxiety Realm", 
    description: "Find peace and calm in a safe, soothing space",
    gradient: "from-blue-400 via-cyan-400 to-teal-500",
    icon: Wind,
    character: "🌊",
    mood: "anxious",
    features: ["Breathing guides", "Grounding exercises", "Calming visuals", "Progressive relaxation"],
    bgPattern: "bg-[radial-gradient(ellipse_at_bottom,_var(--tw-gradient-stops))]"
  },
  {
    id: "reflection",
    name: "Reflection Realm",
    description: "Explore your thoughts and memories in tranquil contemplation",
    gradient: "from-purple-400 via-violet-400 to-indigo-500",
    icon: BookOpen,
    character: "🌙",
    mood: "reflective",
    features: ["Deep journal prompts", "Memory vault", "Mindful reflection", "Emotional processing"],
    bgPattern: "bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]"
  }
];

export default function Home() {
  const isMobile = useIsMobile();
  const [selectedRealm, setSelectedRealm] = useState<string | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);
  
  const { data: user } = useQuery<{ id: string; username: string; name: string }>({
    queryKey: ["/api/user"],
  });

  const { data: recentMoods } = useQuery<MoodEntry[]>({
    queryKey: ["/api/mood"],
  });

  const userName = user?.name || "traveler";
  
  // Get recent mood average to suggest a realm
  const recentMoodAvg = recentMoods && recentMoods.length > 0 
    ? recentMoods.slice(-3).reduce((sum, entry) => sum + entry.mood, 0) / Math.min(3, recentMoods.length)
    : 3;

  const getSuggestedRealm = () => {
    if (recentMoodAvg >= 4) return "joy";
    if (recentMoodAvg <= 2) return "anxiety";
    return "reflection";
  };

  const suggestedRealmId = getSuggestedRealm();
  const suggestedRealm = realms.find(r => r.id === suggestedRealmId);

  const handleRealmSelect = (realmId: string) => {
    setIsTransitioning(true);
    setSelectedRealm(realmId);
    
    // Simulate realm transition
    setTimeout(() => {
      // Navigate to the specific realm experience
      window.location.href = `/realm/${realmId}`;
    }, 1000);
  };

  if (isTransitioning && selectedRealm) {
    const realm = realms.find(r => r.id === selectedRealm);
    return (
      <div className={`min-h-screen flex items-center justify-center bg-gradient-to-br ${realm?.gradient} ${realm?.bgPattern}`}>
        <div className="text-center text-white animate-pulse">
          <div className="text-6xl mb-4">{realm?.character}</div>
          <h2 className="text-3xl font-bold mb-2">Entering {realm?.name}</h2>
          <p className="text-xl opacity-90">Preparing your sanctuary...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-10 left-10 w-72 h-72 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob"></div>
        <div className="absolute top-0 right-4 w-72 h-72 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 tracking-tight">
            Welcome, <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{userName}</span>
          </h1>
          <p className="text-xl text-purple-200 mb-6">Choose your wellness realm based on how you feel right now</p>
          
          {/* Crisis Support Button */}
          <button className="bg-red-500 hover:bg-red-600 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105">
            <Phone className="w-5 h-5 mr-2 inline" />
            Crisis Support
          </button>
        </header>

        {/* Suggested Realm */}
        {suggestedRealm && (
          <div className="mb-12 animate-fade-in">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-semibold text-white mb-2">Suggested for You</h2>
              <p className="text-purple-200">Based on your recent mood patterns</p>
            </div>
            
            <div 
              className={`max-w-md mx-auto cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl`}
              onClick={() => handleRealmSelect(suggestedRealm.id)}
            >
              <div className={`bg-gradient-to-br ${suggestedRealm.gradient} ${suggestedRealm.bgPattern} rounded-3xl p-8 text-white shadow-xl border border-white/20`}>
                <div className="text-center">
                  <div className="text-5xl mb-4">{suggestedRealm.character}</div>
                  <h3 className="text-2xl font-bold mb-3">{suggestedRealm.name}</h3>
                  <p className="text-white/90 mb-6">{suggestedRealm.description}</p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-white/80">
                    <Zap className="w-4 h-4" />
                    <span>Recommended</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* All Realms */}
        <div className="mb-12">
          <h2 className="text-2xl font-semibold text-white text-center mb-8">All Wellness Realms</h2>
          
          <div className={`grid gap-8 ${isMobile ? 'grid-cols-1' : 'md:grid-cols-3'}`}>
            {realms.map((realm, index) => (
              <div
                key={realm.id}
                className={`cursor-pointer transform transition-all duration-300 hover:scale-105 hover:shadow-2xl animate-fade-in`}
                style={{ animationDelay: `${index * 200}ms` }}
                onClick={() => handleRealmSelect(realm.id)}
              >
                <div className={`bg-gradient-to-br ${realm.gradient} ${realm.bgPattern} rounded-3xl p-8 text-white shadow-xl border border-white/20 h-full`}>
                  <div className="text-center mb-6">
                    <div className="text-4xl mb-4">{realm.character}</div>
                    <h3 className="text-2xl font-bold mb-3">{realm.name}</h3>
                    <p className="text-white/90 text-sm leading-relaxed">{realm.description}</p>
                  </div>
                  
                  <div className="space-y-3">
                    {realm.features.map((feature, idx) => (
                      <div key={idx} className="flex items-center space-x-3 text-sm text-white/80">
                        <div className="w-2 h-2 bg-white/60 rounded-full"></div>
                        <span>{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <div className="mt-6 text-center">
                    <div className="inline-flex items-center justify-center px-4 py-2 bg-white/20 rounded-full text-sm font-medium backdrop-blur-sm">
                      Enter Realm
                      <realm.icon className="w-4 h-4 ml-2" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Access Tools */}
        <div className="text-center">
          <h3 className="text-xl font-semibold text-white mb-6">Quick Tools</h3>
          <div className="flex justify-center space-x-4 flex-wrap gap-4">
            <Link href="/mood">
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 backdrop-blur-sm border border-white/20">
                <Heart className="w-5 h-5 mr-2 inline" />
                Track Mood
              </button>
            </Link>
            <Link href="/journal">
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 backdrop-blur-sm border border-white/20">
                <BookOpen className="w-5 h-5 mr-2 inline" />
                Journal
              </button>
            </Link>
            <Link href="/hobbies">
              <button className="bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full font-medium transition-all duration-200 backdrop-blur-sm border border-white/20">
                <Sparkles className="w-5 h-5 mr-2 inline" />
                Activities
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}