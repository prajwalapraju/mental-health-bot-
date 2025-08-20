import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { getDailyAffirmation, getRandomAffirmation } from "@/lib/affirmations";
import { Heart, RefreshCw, Share2 } from "lucide-react";

export default function DailyAffirmation() {
  const [currentAffirmation, setCurrentAffirmation] = useState(getDailyAffirmation());
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: favoriteAffirmations } = useQuery({
    queryKey: ["/api/affirmations/favorites"],
  });

  const favoriteMutation = useMutation({
    mutationFn: async (affirmation: string) => {
      const response = await apiRequest("POST", "/api/affirmations/favorites", {
        affirmation,
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/affirmations/favorites"] });
      toast({
        title: "Saved!",
        description: "Affirmation added to your favorites.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save affirmation.",
        variant: "destructive",
      });
    },
  });

  const handleNewAffirmation = () => {
    setCurrentAffirmation(getRandomAffirmation());
  };

  const handleFavorite = () => {
    const isAlreadyFavorite = favoriteAffirmations?.some(
      (fav: any) => fav.affirmation === currentAffirmation
    );

    if (isAlreadyFavorite) {
      toast({
        title: "Already saved",
        description: "This affirmation is already in your favorites.",
      });
      return;
    }

    favoriteMutation.mutate(currentAffirmation);
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Daily Affirmation",
          text: currentAffirmation,
        });
      } catch (error) {
        // User cancelled sharing
      }
    } else {
      // Fallback: copy to clipboard
      try {
        await navigator.clipboard.writeText(currentAffirmation);
        toast({
          title: "Copied!",
          description: "Affirmation copied to clipboard.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy affirmation.",
          variant: "destructive",
        });
      }
    }
  };

  const isAlreadyFavorite = favoriteAffirmations?.some(
    (fav: any) => fav.affirmation === currentAffirmation
  );

  return (
    <Card className="animate-fade-in bg-gradient-to-br from-sage-50 to-sage-100 border-sage-200">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display">Daily Affirmation</CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleNewAffirmation}
            className="text-sage-600 hover:text-sage-700"
          >
            <RefreshCw className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="bg-white rounded-lg p-6">
          <p className="text-gray-700 leading-relaxed italic text-center text-lg">
            "{currentAffirmation}"
          </p>
        </div>
        
        <div className="flex justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleFavorite}
            disabled={favoriteMutation.isPending}
            className={`font-medium ${
              isAlreadyFavorite 
                ? "text-red-600 hover:text-red-700" 
                : "text-sage-600 hover:text-sage-700"
            }`}
          >
            <Heart className={`w-4 h-4 mr-1 ${isAlreadyFavorite ? "fill-current" : ""}`} />
            {isAlreadyFavorite ? "Favorited" : "Save to Favorites"}
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleShare}
            className="text-sage-600 hover:text-sage-700 font-medium"
          >
            <Share2 className="w-4 h-4 mr-1" />
            Share
          </Button>
        </div>

        {favoriteAffirmations && favoriteAffirmations.length > 0 && (
          <div className="pt-4 border-t border-sage-200">
            <h4 className="text-sm font-medium text-gray-700 mb-2">
              Your Favorites ({favoriteAffirmations.length})
            </h4>
            <div className="text-xs text-gray-600">
              You have {favoriteAffirmations.length} saved affirmation{favoriteAffirmations.length !== 1 ? 's' : ''}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
