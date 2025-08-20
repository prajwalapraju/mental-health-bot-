import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { Trash2, Edit3, Save, X } from "lucide-react";
import type { JournalEntry as JournalEntryType } from "@shared/schema";

const emotionOptions = [
  { tag: "grateful", emoji: "😊", label: "Grateful" },
  { tag: "anxious", emoji: "😰", label: "Anxious" },
  { tag: "peaceful", emoji: "😌", label: "Peaceful" },
  { tag: "stressed", emoji: "😤", label: "Stressed" },
  { tag: "happy", emoji: "😄", label: "Happy" },
  { tag: "sad", emoji: "😢", label: "Sad" },
  { tag: "excited", emoji: "🤩", label: "Excited" },
  { tag: "overwhelmed", emoji: "😵", label: "Overwhelmed" },
];

export default function Journal() {
  const [newEntry, setNewEntry] = useState("");
  const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editContent, setEditContent] = useState("");
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: journalEntries, isLoading } = useQuery<JournalEntryType[]>({
    queryKey: ["/api/journal"],
  });

  const createMutation = useMutation({
    mutationFn: async (data: { content: string; emotions: string[] }) => {
      const response = await apiRequest("POST", "/api/journal", data);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      setNewEntry("");
      setSelectedEmotions([]);
      toast({
        title: "Success",
        description: "Journal entry saved successfully!",
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

  const updateMutation = useMutation({
    mutationFn: async ({ id, content }: { id: string; content: string }) => {
      const response = await apiRequest("PUT", `/api/journal/${id}`, { content });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      setEditingId(null);
      setEditContent("");
      toast({
        title: "Success",
        description: "Journal entry updated successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update journal entry.",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const response = await apiRequest("DELETE", `/api/journal/${id}`);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/journal"] });
      toast({
        title: "Success",
        description: "Journal entry deleted successfully!",
      });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete journal entry.",
        variant: "destructive",
      });
    },
  });

  const handleSubmit = () => {
    if (!newEntry.trim()) return;
    
    createMutation.mutate({
      content: newEntry,
      emotions: selectedEmotions,
    });
  };

  const handleEmotionToggle = (emotion: string) => {
    setSelectedEmotions(prev =>
      prev.includes(emotion)
        ? prev.filter(e => e !== emotion)
        : [...prev, emotion]
    );
  };

  const startEditing = (entry: any) => {
    setEditingId(entry.id);
    setEditContent(entry.content);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditContent("");
  };

  const saveEdit = () => {
    if (!editContent.trim() || !editingId) return;
    
    updateMutation.mutate({
      id: editingId,
      content: editContent,
    });
  };

  return (
    <div className="container mx-auto px-4 py-6 max-w-4xl">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
          Journal
        </h1>
        <p className="text-gray-600">Reflect on your thoughts and feelings</p>
      </header>

      {/* New Entry Form */}
      <Card className="mb-8 animate-fade-in">
        <CardHeader>
          <CardTitle className="text-lg font-display">Write a new entry</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="How are you feeling? What's on your mind today?"
            value={newEntry}
            onChange={(e) => setNewEntry(e.target.value)}
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
            disabled={!newEntry.trim() || createMutation.isPending}
            className="w-full bg-indigo-500 hover:bg-indigo-600"
          >
            <Save className="w-4 h-4 mr-2" />
            {createMutation.isPending ? "Saving..." : "Save Entry"}
          </Button>
        </CardContent>
      </Card>

      {/* Journal Entries */}
      <div className="space-y-6">
        {isLoading ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading journal entries...</p>
          </div>
        ) : journalEntries?.length > 0 ? (
          journalEntries.map((entry: any) => (
            <Card key={entry.id} className="animate-fade-in">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    {new Date(entry.date).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                    })}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => startEditing(entry)}
                      disabled={editingId === entry.id}
                    >
                      <Edit3 className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => deleteMutation.mutate(entry.id)}
                      disabled={deleteMutation.isPending}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {editingId === entry.id ? (
                  <div className="space-y-3">
                    <Textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      className="min-h-24 resize-none"
                    />
                    <div className="flex gap-2">
                      <Button 
                        size="sm" 
                        onClick={saveEdit}
                        disabled={!editContent.trim() || updateMutation.isPending}
                      >
                        <Save className="w-4 h-4 mr-1" />
                        Save
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        onClick={cancelEditing}
                      >
                        <X className="w-4 h-4 mr-1" />
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-700 leading-relaxed mb-4">
                      {entry.content}
                    </p>
                    {entry.emotions && entry.emotions.length > 0 && (
                      <div className="flex flex-wrap gap-2">
                        {entry.emotions.map((emotion: string) => {
                          const emotionData = emotionOptions.find(opt => opt.tag === emotion);
                          return (
                            <Badge key={emotion} variant="secondary" className="text-xs">
                              {emotionData?.emoji} {emotionData?.label || emotion}
                            </Badge>
                          );
                        })}
                      </div>
                    )}
                  </>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card className="text-center py-12">
            <CardContent>
              <div className="text-6xl mb-4">📖</div>
              <h3 className="text-lg font-medium text-gray-800 mb-2">
                No journal entries yet
              </h3>
              <p className="text-gray-600">
                Start writing your first entry above to begin your journaling journey.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
