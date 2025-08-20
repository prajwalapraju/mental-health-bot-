import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Save, BookOpen } from "lucide-react";
import { Link } from "wouter";

const emotionOptions = [
  { tag: "grateful", emoji: "😊", label: "Grateful" },
  { tag: "anxious", emoji: "😰", label: "Anxious" },
  { tag: "peaceful", emoji: "😌", label: "Peaceful" },
  { tag: "stressed", emoji: "😤", label: "Stressed" },
];

export default function JournalEntry() {
  const [content, setContent] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: recentEntries } = useQuery({
    queryKey: ["/api/journal"],
    select: (data) => data?.slice(0, 3) || [], // Show 3 most recent entries
  });

  const createMutation = useMutation({
    mutationFn: async (data: { content: string; emotions: string[] }) => {
      const response = await apiRequest("POST", "/api/journal", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      setContent("");
      setSelectedEmotions([]);
      toast({
        title: "Entry saved!",
        description: "Your journal entry has been saved successfully.",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to save journal entry.",
        variant: "destructive",
      });
    },
  });

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const handleSubmit = () => {
    if (!content.trim()) {
      toast({
        title: "Empty entry",
        description: "Please write something before saving.",
        variant: "destructive",
      });
      return;
    }

    createMutation.mutate({
      content: content.trim(),
      emotions: selectedEmotions,
    });
  };

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display">Quick Journal Entry</CardTitle>
          <Link href="/journal">
            <Button variant="ghost" size="sm" className="text-indigo-600 hover:text-indigo-700">
              <BookOpen className="w-4 h-4 mr-1" />
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <Textarea
          placeholder="How are you feeling? What's on your mind today?"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          className="min-h-32 resize-none"
        />
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Tag your emotions:
          </label>
          <div className="flex flex-wrap gap-2">
            {emotionOptions.map((option) => (
              <Button
                key={option.tag}
                variant={selectedEmotions.includes(option.tag) ? "default" : "outline"}
                size="sm"
                onClick={() => handleEmotionToggle(option.tag)}
                className="text-sm"
              >
                {option.emoji} {option.label}
              </Button>
            ))}
          </div>
        </div>

        <Button 
          onClick={handleSubmit}
          disabled={!content.trim() || createMutation.isPending}
          className="w-full bg-indigo-500 hover:bg-indigo-600"
        >
          <Save className="w-4 h-4 mr-2" />
          {createMutation.isPending ? "Saving..." : "Save Entry"}
        </Button>

        {/* Recent Entries Preview */}
        {recentEntries && recentEntries.length > 0 && (
          <div className="pt-4 border-t border-slate-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Recent Entries</h4>
            <div className="space-y-2">
              {recentEntries.map((entry: any) => (
                <div key={entry.id} className="text-sm p-2 bg-slate-50 rounded">
                  <div className="text-gray-600 line-clamp-2">
                    {entry.content.length > 60 
                      ? `${entry.content.substring(0, 60)}...`
                      : entry.content
                    }
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {new Date(entry.date).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
