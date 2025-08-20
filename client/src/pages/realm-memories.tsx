import { useState, useEffect, useRef } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Slider } from "@/components/ui/slider";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CompanionCharacter from "@/components/companion-character";
import { 
  Stars, 
  Sparkles, 
  Eye, 
  Plus,
  Search,
  Filter,
  Calendar,
  Heart,
  Brain,
  Zap,
  Moon,
  Sun,
  Palette,
  MapPin,
  Link,
  X,
  Save
} from "lucide-react";

const constellationColors = [
  { name: "Sapphire", value: "blue", class: "bg-blue-500" },
  { name: "Emerald", value: "green", class: "bg-green-500" },
  { name: "Ruby", value: "red", class: "bg-red-500" },
  { name: "Amethyst", value: "purple", class: "bg-purple-500" },
  { name: "Citrine", value: "yellow", class: "bg-yellow-500" },
  { name: "Rose", value: "pink", class: "bg-pink-500" },
  { name: "Silver", value: "gray", class: "bg-gray-500" }
];

const memoryTypes = [
  { type: "journal", icon: Brain, name: "Reflection", color: "text-blue-500" },
  { type: "mood", icon: Heart, name: "Feeling", color: "text-pink-500" },
  { type: "quest", icon: Zap, name: "Growth", color: "text-purple-500" },
  { type: "milestone", icon: Stars, name: "Achievement", color: "text-yellow-500" }
];

export default function RealmMemories() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMemory, setSelectedMemory] = useState<any>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [newMemory, setNewMemory] = useState({
    title: "",
    emotionalImpact: 5,
    color: "blue",
    size: 3
  });
  const [canvasSize, setCanvasSize] = useState({ width: 800, height: 600 });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: memoryNodes = [], isLoading } = useQuery({
    queryKey: ["/api/memories"],
  });

  const { data: journalEntries = [] } = useQuery({
    queryKey: ["/api/journal"],
  });

  const { data: moodEntries = [] } = useQuery({
    queryKey: ["/api/mood"],
  });

  const createMemoryMutation = useMutation({
    mutationFn: async (memoryData: any) => {
      return apiRequest("/api/memories", "POST", memoryData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories"] });
      setShowCreateForm(false);
      setNewMemory({ title: "", emotionalImpact: 5, color: "blue", size: 3 });
      toast({
        title: "Memory star created!",
        description: "Your moment has been added to the constellation",
      });
    },
  });

  const deleteMemoryMutation = useMutation({
    mutationFn: async (memoryId: string) => {
      return apiRequest(`/api/memories/${memoryId}`, "DELETE", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/memories"] });
      setSelectedMemory(null);
      toast({
        title: "Memory removed",
        description: "The memory has been deleted from your constellation",
      });
    },
  });

  // Generate constellation coordinates
  const generateConstellationData = () => {
    if (!Array.isArray(memoryNodes)) return [];
    
    return memoryNodes.map((memory: any, index: number) => {
      // Create a spiral pattern for memories
      const angle = (index * 137.5) * (Math.PI / 180); // Golden angle for natural distribution
      const radius = Math.min(canvasSize.width, canvasSize.height) * 0.3 * Math.sqrt(index + 1) / Math.sqrt(memoryNodes.length);
      
      const x = canvasSize.width / 2 + radius * Math.cos(angle);
      const y = canvasSize.height / 2 + radius * Math.sin(angle);
      
      return {
        ...memory,
        x: Math.max(20, Math.min(canvasSize.width - 20, x)),
        y: Math.max(20, Math.min(canvasSize.height - 20, y))
      };
    });
  };

  // Draw constellation on canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.fillStyle = '#0a0a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add background stars
    for (let i = 0; i < 100; i++) {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const size = Math.random() * 1.5;
      
      ctx.fillStyle = `rgba(255, 255, 255, ${Math.random() * 0.8})`;
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fill();
    }

    const memories = generateConstellationData();
    
    // Draw connections between memories (if they exist)
    memories.forEach((memory: any) => {
      if (memory.connectedTo && Array.isArray(memory.connectedTo)) {
        memory.connectedTo.forEach((connectionId: string) => {
          const connectedMemory = memories.find((m: any) => m.id === connectionId);
          if (connectedMemory) {
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(memory.x, memory.y);
            ctx.lineTo(connectedMemory.x, connectedMemory.y);
            ctx.stroke();
          }
        });
      }
    });

    // Draw memory nodes
    memories.forEach((memory: any) => {
      const colorMap: { [key: string]: string } = {
        blue: '#3b82f6',
        green: '#10b981',
        red: '#ef4444',
        purple: '#8b5cf6',
        yellow: '#f59e0b',
        pink: '#ec4899',
        gray: '#6b7280'
      };

      const baseSize = (memory.size || 3) * 2;
      const glowSize = (memory.emotionalImpact || 5) * 0.5;
      
      // Draw glow effect
      const gradient = ctx.createRadialGradient(
        memory.x, memory.y, 0,
        memory.x, memory.y, baseSize + glowSize
      );
      gradient.addColorStop(0, colorMap[memory.color] || '#3b82f6');
      gradient.addColorStop(0.5, `${colorMap[memory.color] || '#3b82f6'}40`);
      gradient.addColorStop(1, 'transparent');
      
      ctx.fillStyle = gradient;
      ctx.beginPath();
      ctx.arc(memory.x, memory.y, baseSize + glowSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Draw main star
      ctx.fillStyle = colorMap[memory.color] || '#3b82f6';
      ctx.beginPath();
      ctx.arc(memory.x, memory.y, baseSize, 0, Math.PI * 2);
      ctx.fill();
      
      // Add sparkle effect for high emotional impact
      if (memory.emotionalImpact > 7) {
        ctx.strokeStyle = '#ffffff';
        ctx.lineWidth = 1;
        for (let i = 0; i < 4; i++) {
          const angle = (i * Math.PI) / 2;
          const length = baseSize + 4;
          ctx.beginPath();
          ctx.moveTo(
            memory.x + Math.cos(angle) * (baseSize + 2),
            memory.y + Math.sin(angle) * (baseSize + 2)
          );
          ctx.lineTo(
            memory.x + Math.cos(angle) * length,
            memory.y + Math.sin(angle) * length
          );
          ctx.stroke();
        }
      }
    });
  }, [memoryNodes, canvasSize]);

  // Handle canvas click
  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const memories = generateConstellationData();
    const clickedMemory = memories.find((memory: any) => {
      const distance = Math.sqrt((x - memory.x) ** 2 + (y - memory.y) ** 2);
      return distance <= (memory.size || 3) * 2 + 5;
    });

    if (clickedMemory) {
      setSelectedMemory(clickedMemory);
    }
  };

  const handleCreateMemory = () => {
    if (!newMemory.title.trim()) {
      toast({
        title: "Please add a title",
        description: "Give your memory a meaningful name",
        variant: "destructive"
      });
      return;
    }

    createMemoryMutation.mutate({
      title: newMemory.title,
      emotionalImpact: newMemory.emotionalImpact,
      color: newMemory.color,
      size: newMemory.size,
      xPosition: Math.random() * canvasSize.width,
      yPosition: Math.random() * canvasSize.height,
      connectedTo: []
    });
  };

  const createFromJournalEntry = (entry: any) => {
    createMemoryMutation.mutate({
      title: entry.content.slice(0, 50) + "...",
      journalEntryId: entry.id,
      emotionalImpact: entry.emotions?.length > 0 ? Math.min(entry.emotions.length * 2, 10) : 5,
      color: "blue",
      size: 3,
      xPosition: Math.random() * canvasSize.width,
      yPosition: Math.random() * canvasSize.height,
      connectedTo: []
    });
  };

  const createFromMoodEntry = (entry: any) => {
    createMemoryMutation.mutate({
      title: `Mood: ${entry.mood}/5 ${entry.notes ? '- ' + entry.notes.slice(0, 30) + '...' : ''}`,
      moodEntryId: entry.id,
      emotionalImpact: entry.mood * 2,
      color: entry.mood > 3 ? "green" : entry.mood < 3 ? "red" : "yellow",
      size: Math.max(1, Math.min(5, entry.mood)),
      xPosition: Math.random() * canvasSize.width,
      yPosition: Math.random() * canvasSize.height,
      connectedTo: []
    });
  };

  const filteredMemories = Array.isArray(memoryNodes) ? 
    memoryNodes.filter((memory: any) => 
      memory.title.toLowerCase().includes(searchTerm.toLowerCase())
    ) : [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-950 via-purple-950 to-black">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Realm Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Stars className="w-8 h-8 text-indigo-400" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Memory Constellation
            </h1>
            <Moon className="w-8 h-8 text-purple-400" />
          </div>
          <p className="text-lg text-indigo-200 max-w-2xl mx-auto">
            Your personal universe of memories, emotions, and growth moments visualized as a living constellation
          </p>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Constellation View */}
          <div className="lg:col-span-3">
            <Card className="bg-gray-900/50 border-indigo-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 text-white">
                    <Eye className="w-5 h-5" />
                    Your Memory Universe
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      onClick={() => setShowCreateForm(true)}
                      className="bg-indigo-600 hover:bg-indigo-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Memory
                    </Button>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search memories..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 bg-gray-800 border-gray-700 text-white"
                    />
                  </div>
                  <Badge variant="secondary" className="text-indigo-200">
                    {filteredMemories.length} memories
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="p-0">
                <div className="relative">
                  <canvas
                    ref={canvasRef}
                    width={canvasSize.width}
                    height={canvasSize.height}
                    className="w-full h-[500px] cursor-pointer border-t border-gray-700"
                    onClick={handleCanvasClick}
                    style={{ background: 'linear-gradient(to bottom, #0a0a1a, #1a0a2e)' }}
                  />
                  {filteredMemories.length === 0 && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-indigo-300">
                        <Stars className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <h3 className="text-lg font-medium mb-2">Your constellation awaits</h3>
                        <p className="text-sm mb-4">Create your first memory to start building your personal universe</p>
                        <Button
                          onClick={() => setShowCreateForm(true)}
                          className="bg-indigo-600 hover:bg-indigo-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Memory
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Legend */}
            <Card className="mt-4 bg-gray-900/50 border-indigo-800">
              <CardContent className="p-4">
                <div className="grid md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <h4 className="font-medium text-white mb-2">Brightness</h4>
                    <p className="text-indigo-300">Emotional intensity (1-10)</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Size</h4>
                    <p className="text-indigo-300">Memory significance (1-5)</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Color</h4>
                    <p className="text-indigo-300">Memory type or mood</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-2">Connections</h4>
                    <p className="text-indigo-300">Related memories linked together</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Companion */}
            <CompanionCharacter size="medium" />

            {/* Memory Details */}
            {selectedMemory && (
              <Card className="bg-gray-900/50 border-indigo-800">
                <CardHeader>
                  <CardTitle className="flex items-center justify-between text-white">
                    <span className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${constellationColors.find(c => c.value === selectedMemory.color)?.class || 'bg-blue-500'}`} />
                      Memory Details
                    </span>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => setSelectedMemory(null)}
                      className="text-gray-400 hover:text-white"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div>
                    <h4 className="font-medium text-white mb-1">{selectedMemory.title}</h4>
                    <p className="text-xs text-indigo-300">
                      {new Date(selectedMemory.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-3 text-xs">
                    <div>
                      <span className="text-indigo-400">Impact:</span>
                      <div className="flex gap-1 mt-1">
                        {[...Array(10)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < selectedMemory.emotionalImpact ? 'bg-yellow-400' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-indigo-400">Size:</span>
                      <div className="flex gap-1 mt-1">
                        {[...Array(5)].map((_, i) => (
                          <div
                            key={i}
                            className={`w-2 h-2 rounded-full ${
                              i < selectedMemory.size ? 'bg-blue-400' : 'bg-gray-600'
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedMemory.journalEntryId && (
                    <Badge variant="outline" className="text-blue-400 border-blue-400">
                      <Brain className="w-3 h-3 mr-1" />
                      Journal Memory
                    </Badge>
                  )}
                  
                  {selectedMemory.moodEntryId && (
                    <Badge variant="outline" className="text-pink-400 border-pink-400">
                      <Heart className="w-3 h-3 mr-1" />
                      Mood Memory
                    </Badge>
                  )}

                  <Button
                    size="sm"
                    variant="destructive"
                    className="w-full"
                    onClick={() => deleteMemoryMutation.mutate(selectedMemory.id)}
                  >
                    Remove from Constellation
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card className="bg-gray-900/50 border-indigo-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  <Sparkles className="w-5 h-5 inline mr-2" />
                  Quick Add
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {Array.isArray(journalEntries) && journalEntries.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-indigo-300 mb-2">From Recent Journals</h4>
                    <div className="space-y-2">
                      {journalEntries.slice(0, 2).map((entry: any) => (
                        <Button
                          key={entry.id}
                          size="sm"
                          variant="outline"
                          className="w-full justify-start text-left h-auto p-2 border-gray-700 text-gray-300 hover:text-white"
                          onClick={() => createFromJournalEntry(entry)}
                        >
                          <Brain className="w-3 h-3 mr-2 flex-shrink-0" />
                          <span className="truncate text-xs">{entry.content.slice(0, 40)}...</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}

                {Array.isArray(moodEntries) && moodEntries.length > 0 && (
                  <div>
                    <h4 className="text-sm font-medium text-indigo-300 mb-2">From Recent Moods</h4>
                    <div className="space-y-2">
                      {moodEntries.slice(0, 2).map((entry: any) => (
                        <Button
                          key={entry.id}
                          size="sm"
                          variant="outline"
                          className="w-full justify-start text-left h-auto p-2 border-gray-700 text-gray-300 hover:text-white"
                          onClick={() => createFromMoodEntry(entry)}
                        >
                          <Heart className="w-3 h-3 mr-2 flex-shrink-0" />
                          <span className="text-xs">Mood {entry.mood}/5 {entry.notes && `- ${entry.notes.slice(0, 20)}...`}</span>
                        </Button>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Constellation Stats */}
            <Card className="bg-gray-900/50 border-indigo-800">
              <CardHeader>
                <CardTitle className="text-white text-lg">
                  <MapPin className="w-5 h-5 inline mr-2" />
                  Universe Stats
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="bg-indigo-900/50 rounded-lg p-2">
                    <div className="text-lg font-bold text-indigo-400">{filteredMemories.length}</div>
                    <div className="text-xs text-indigo-300">Stars</div>
                  </div>
                  <div className="bg-purple-900/50 rounded-lg p-2">
                    <div className="text-lg font-bold text-purple-400">
                      {filteredMemories.reduce((sum: number, memory: any) => sum + (memory.emotionalImpact || 0), 0)}
                    </div>
                    <div className="text-xs text-purple-300">Total Glow</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Create Memory Dialog */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="bg-gray-900 border-indigo-800 text-white">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Plus className="w-5 h-5" />
                Create Memory Star
              </DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-indigo-300">Memory Title</label>
                <Input
                  placeholder="Give your memory a meaningful name..."
                  value={newMemory.title}
                  onChange={(e) => setNewMemory(prev => ({ ...prev, title: e.target.value }))}
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-indigo-300">Emotional Impact: {newMemory.emotionalImpact}/10</label>
                <Slider
                  value={[newMemory.emotionalImpact]}
                  onValueChange={(value) => setNewMemory(prev => ({ ...prev, emotionalImpact: value[0] }))}
                  max={10}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <p className="text-xs text-gray-400 mt-1">How bright should this memory glow?</p>
              </div>

              <div>
                <label className="text-sm font-medium text-indigo-300">Star Size: {newMemory.size}/5</label>
                <Slider
                  value={[newMemory.size]}
                  onValueChange={(value) => setNewMemory(prev => ({ ...prev, size: value[0] }))}
                  max={5}
                  min={1}
                  step={1}
                  className="mt-2"
                />
                <p className="text-xs text-gray-400 mt-1">How significant is this memory?</p>
              </div>

              <div>
                <label className="text-sm font-medium text-indigo-300">Star Color</label>
                <div className="flex gap-2 mt-2 flex-wrap">
                  {constellationColors.map((color) => (
                    <Button
                      key={color.value}
                      size="sm"
                      variant={newMemory.color === color.value ? "default" : "outline"}
                      className={`${color.class} ${newMemory.color === color.value ? '' : 'border-gray-600 text-gray-300'}`}
                      onClick={() => setNewMemory(prev => ({ ...prev, color: color.value }))}
                    >
                      {color.name}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  onClick={handleCreateMemory}
                  disabled={createMemoryMutation.isPending || !newMemory.title.trim()}
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700"
                >
                  {createMemoryMutation.isPending ? (
                    "Creating..."
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Add to Constellation
                    </>
                  )}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateForm(false)}
                  className="border-gray-600 text-gray-300"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}