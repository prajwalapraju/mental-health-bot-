import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { 
  Sparkles, 
  Heart, 
  Star, 
  Crown,
  Feather,
  Zap,
  TreePine,
  Flower
} from "lucide-react";
import type { Companion } from "@shared/schema";

interface CompanionProps {
  showDetails?: boolean;
  size?: 'small' | 'medium' | 'large';
}

const companionStages = {
  seed: { icon: "🌱", name: "Tiny Seed", description: "A small spark of potential, waiting to grow" },
  sprout: { icon: "🌿", name: "Growing Sprout", description: "Beginning to flourish with your care" },
  bloom: { icon: "🌸", name: "Beautiful Bloom", description: "Radiating warmth and emotional wisdom" },
  radiant: { icon: "✨", name: "Radiant Spirit", description: "A powerful companion, glowing with shared experiences" }
};

const companionColors = {
  silver: "from-gray-300 to-gray-500",
  gold: "from-yellow-300 to-yellow-500", 
  rose: "from-pink-300 to-rose-500",
  emerald: "from-green-300 to-emerald-500",
  sapphire: "from-blue-300 to-blue-500",
  amethyst: "from-purple-300 to-violet-500",
  rainbow: "from-pink-300 via-purple-300 via-blue-300 via-green-300 to-yellow-300"
};

const accessories = {
  wings: { icon: Feather, name: "Ethereal Wings", description: "Gained through moments of hope" },
  crown: { icon: Crown, name: "Crown of Wisdom", description: "Earned through self-reflection" },
  aura: { icon: Sparkles, name: "Healing Aura", description: "Developed through self-compassion" },
  star: { icon: Star, name: "Guiding Star", description: "Unlocked through persistence" },
  heart: { icon: Heart, name: "Empathy Crystal", description: "Formed through emotional growth" }
};

export default function CompanionCharacter({ showDetails = true, size = 'medium' }: CompanionProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: companion, isLoading } = useQuery<Companion>({
    queryKey: ["/api/companion"],
  });

  const updateCompanionMutation = useMutation({
    mutationFn: async (updates: Partial<Companion>) => {
      return apiRequest("/api/companion", "PATCH", updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/companion"] });
      setIsAnimating(true);
      setTimeout(() => setIsAnimating(false), 2000);
    },
  });

  const handleInteraction = () => {
    if (!companion) return;
    
    const experienceGained = Math.floor(Math.random() * 5) + 1;
    const newExperience = companion.experience + experienceGained;
    const newLevel = Math.floor(newExperience / 100) + 1;
    
    updateCompanionMutation.mutate({
      experience: newExperience,
      level: Math.max(companion.level, newLevel)
    });

    toast({
      title: "Companion loved the interaction! ✨",
      description: `+${experienceGained} experience gained`,
    });
  };

  if (isLoading) {
    return <div className="flex items-center justify-center p-8">
      <div className="animate-spin text-4xl">🌱</div>
    </div>;
  }

  if (!companion) {
    return <div className="text-center p-8">No companion found</div>;
  }

  const stage = companionStages[companion.stage as keyof typeof companionStages] || companionStages.seed;
  const colorGradient = companionColors[companion.color as keyof typeof companionColors] || companionColors.silver;
  const experienceProgress = (companion.experience % 100);
  const experienceToNext = 100 - experienceProgress;

  const sizeClasses = {
    small: "w-16 h-16 text-3xl",
    medium: "w-24 h-24 text-5xl", 
    large: "w-32 h-32 text-7xl"
  };

  return (
    <Card className={`${showDetails ? '' : 'border-none shadow-none bg-transparent'} relative overflow-hidden`}>
      {showDetails && (
        <CardHeader className="text-center">
          <CardTitle className="flex items-center justify-center gap-2">
            <Sparkles className="w-5 h-5 text-purple-500" />
            {companion.name}
            <Badge variant="secondary">Level {companion.level}</Badge>
          </CardTitle>
          <p className="text-sm text-muted-foreground">{stage.description}</p>
        </CardHeader>
      )}
      
      <CardContent className={`${showDetails ? 'pt-0' : 'p-0'} text-center`}>
        {/* Companion Character */}
        <div className="relative mb-4 flex justify-center">
          <div 
            className={`
              ${sizeClasses[size]} 
              ${isAnimating ? 'animate-bounce' : 'hover:scale-110 transition-transform cursor-pointer'} 
              bg-gradient-to-br ${colorGradient} 
              rounded-full flex items-center justify-center
              shadow-lg relative
            `}
            onClick={handleInteraction}
          >
            <span className="filter drop-shadow-lg">{stage.icon}</span>
            
            {/* Accessories */}
            {companion.accessories?.map((accessory, index) => {
              const AccessoryIcon = accessories[accessory as keyof typeof accessories]?.icon || Star;
              return (
                <AccessoryIcon 
                  key={accessory}
                  className={`absolute w-4 h-4 text-white animate-pulse ${
                    index === 0 ? 'top-0 right-0' : 
                    index === 1 ? 'bottom-0 left-0' :
                    index === 2 ? 'top-0 left-0' : 'bottom-0 right-0'
                  }`}
                />
              );
            })}
            
            {/* Magical sparkles animation */}
            {isAnimating && (
              <div className="absolute inset-0 pointer-events-none">
                <Sparkles className="absolute top-1 left-1 w-3 h-3 text-yellow-400 animate-ping" />
                <Star className="absolute bottom-1 right-1 w-3 h-3 text-pink-400 animate-ping animation-delay-300" />
                <Heart className="absolute top-1 right-1 w-3 h-3 text-red-400 animate-ping animation-delay-600" />
              </div>
            )}
          </div>
        </div>

        {showDetails && (
          <>
            {/* Experience Progress */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span>Experience</span>
                <span>{companion.experience} XP</span>
              </div>
              <Progress value={experienceProgress} className="h-2" />
              <p className="text-xs text-muted-foreground">
                {experienceToNext} XP to level {companion.level + 1}
              </p>
            </div>

            {/* Stage Info */}
            <div className="bg-muted/30 rounded-lg p-3 mb-4">
              <h4 className="font-medium text-sm flex items-center gap-1">
                <TreePine className="w-4 h-4" />
                {stage.name}
              </h4>
              <p className="text-xs text-muted-foreground mt-1">{stage.description}</p>
            </div>

            {/* Accessories */}
            {companion.accessories && companion.accessories.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium text-sm flex items-center gap-1">
                  <Crown className="w-4 h-4" />
                  Earned Accessories
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {companion.accessories.map((accessory) => {
                    const acc = accessories[accessory as keyof typeof accessories];
                    if (!acc) return null;
                    const IconComponent = acc.icon;
                    return (
                      <div key={accessory} className="flex items-center gap-1 bg-muted/30 rounded p-2">
                        <IconComponent className="w-3 h-3" />
                        <span>{acc.name}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Interaction Button */}
            <Button 
              onClick={handleInteraction}
              variant="outline" 
              size="sm" 
              className="mt-4 w-full"
              disabled={updateCompanionMutation.isPending}
            >
              {updateCompanionMutation.isPending ? (
                "Interacting..."
              ) : (
                <>
                  <Heart className="w-4 h-4 mr-2" />
                  Give Love
                </>
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}