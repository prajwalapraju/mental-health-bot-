import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useIsMobile } from "@/hooks/use-mobile";

const moodEmojis = ["😔", "😐", "🙂", "😊", "😄"];
const moodLabels = ["Very Low", "Low", "Neutral", "Good", "Very High"];

export default function MoodTracker() {
  const [selectedMood, setSelectedMood] = useState<number>(3);
  const [notes, setNotes] = useState("");
  const isMobile = useIsMobile();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recentMoods } = useQuery({
    queryKey: ["/api/mood"],
    select: (data) => data?.slice(0, 7) || [], // Get last 7 entries for mini chart
  });

  const moodMutation = useMutation({
    mutationFn: async (data: { mood: number; notes?: string }) => {
      const response = await apiRequest("POST", "/api/mood", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/mood"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setNotes("");
      toast({
        title: "Mood recorded!",
        description: "Thank you for checking in with yourself today.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to record mood. Please try again.",
        variant: "destructive",
      });
    },
  });

  const handleMoodSelect = (mood: number) => {
    setSelectedMood(mood);
  };

  const handleSubmit = () => {
    moodMutation.mutate({
      mood: selectedMood,
      notes: notes.trim() || undefined,
    });
  };

  if (isMobile) {
    return (
      <Card className="animate-fade-in">
        <CardContent className="p-6">
          <h2 className="text-xl font-display font-semibold text-gray-800 mb-4">
            How are you feeling?
          </h2>
          <div className="flex justify-between items-center mb-4">
            {moodEmojis.map((emoji, index) => (
              <Button
                key={index}
                variant={selectedMood === index + 1 ? "default" : "outline"}
                className={`w-12 h-12 rounded-full text-2xl p-0 ${
                  selectedMood === index + 1 
                    ? "bg-primary-500 hover:bg-primary-600" 
                    : "bg-slate-100 hover:bg-primary-100"
                }`}
                onClick={() => handleMoodSelect(index + 1)}
              >
                {emoji}
              </Button>
            ))}
          </div>
          <input
            type="range"
            min="1"
            max="5"
            value={selectedMood}
            onChange={(e) => setSelectedMood(parseInt(e.target.value))}
            className="w-full h-2 bg-slate-200 rounded-lg appearance-none slider mb-2"
          />
          <div className="flex justify-between text-xs text-gray-500 mb-4">
            <span>Very Low</span>
            <span>Very High</span>
          </div>
          <Textarea
            placeholder="Any notes about how you're feeling? (optional)"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="mb-4 min-h-20"
          />
          <Button 
            onClick={handleSubmit}
            disabled={moodMutation.isPending}
            className="w-full"
          >
            {moodMutation.isPending ? "Recording..." : "Record Mood"}
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="animate-fade-in">
      <CardHeader>
        <CardTitle className="text-xl font-display">Mood Check-in</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex justify-between items-center">
          {moodEmojis.map((emoji, index) => (
            <Button
              key={index}
              variant={selectedMood === index + 1 ? "default" : "outline"}
              className={`w-16 h-16 rounded-full text-3xl p-0 ${
                selectedMood === index + 1 
                  ? "bg-primary-500 hover:bg-primary-600" 
                  : "bg-slate-100 hover:bg-primary-100"
              }`}
              onClick={() => handleMoodSelect(index + 1)}
            >
              {emoji}
            </Button>
          ))}
        </div>
        <input
          type="range"
          min="1"
          max="5"
          value={selectedMood}
          onChange={(e) => setSelectedMood(parseInt(e.target.value))}
          className="w-full h-3 bg-slate-200 rounded-lg appearance-none slider"
        />
        <div className="flex justify-between text-sm text-gray-500">
          <span>Very Low</span>
          <span>Very High</span>
        </div>
        
        <Textarea
          placeholder="Any notes about how you're feeling? (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="min-h-20"
        />

        <Button 
          onClick={handleSubmit}
          disabled={moodMutation.isPending}
          className="w-full"
        >
          {moodMutation.isPending ? "Recording..." : "Record Mood"}
        </Button>

        {/* Mini trend visualization */}
        {recentMoods && recentMoods.length > 1 && (
          <div className="mt-6">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Trend</h4>
            <div className="flex items-end space-x-1 h-20">
              {recentMoods.reverse().map((entry: any, index: number) => (
                <div
                  key={entry.id}
                  className="flex-1 bg-primary-200 rounded-t"
                  style={{ height: `${(entry.mood / 5) * 100}%` }}
                  title={`${new Date(entry.date).toLocaleDateString()}: ${entry.mood}/5`}
                />
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
