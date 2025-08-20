import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import CompanionCharacter from "@/components/companion-character";
import { 
  Heart, 
  Users, 
  MessageCircle, 
  Sparkles, 
  Gift,
  Share,
  Star,
  Crown,
  Gem,
  Globe,
  Mail,
  ThumbsUp,
  Eye,
  Trash2,
  Plus
} from "lucide-react";

const kindnessCategories = [
  {
    id: "self-kindness",
    name: "Self-Kindness",
    description: "Gentle words for yourself",
    color: "from-pink-400 to-rose-500",
    icon: Heart,
    prompts: [
      "What would you tell a good friend going through your situation?",
      "What are three things you appreciate about yourself today?",
      "How have you grown stronger through recent challenges?",
      "What self-care do you need right now?"
    ]
  },
  {
    id: "future-self",
    name: "Future Self",
    description: "Messages of hope and encouragement",
    color: "from-purple-400 to-indigo-500",
    icon: Star,
    prompts: [
      "What do you want your future self to remember about this moment?",
      "What hopes and dreams are worth holding onto?",
      "How do you want to feel one year from today?",
      "What wisdom would you share with your future self?"
    ]
  },
  {
    id: "affirmation",
    name: "Affirmations",
    description: "Powerful statements of self-worth",
    color: "from-yellow-400 to-orange-500",
    icon: Crown,
    prompts: [
      "I am worthy of love and kindness because...",
      "My unique qualities that make me special are...",
      "I have the strength to handle challenges because...",
      "I deserve happiness and peace because..."
    ]
  },
  {
    id: "gratitude",
    name: "Gratitude",
    description: "Appreciation for life's gifts",
    color: "from-green-400 to-emerald-500",
    icon: Gem,
    prompts: [
      "What small moments brought you joy today?",
      "Who in your life are you most grateful for?",
      "What abilities or opportunities do you appreciate?",
      "What lessons have difficult times taught you?"
    ]
  }
];

const glowColors = [
  { name: "Golden", value: "gold", class: "from-yellow-300 to-yellow-500" },
  { name: "Rose", value: "rose", class: "from-pink-300 to-rose-500" },
  { name: "Sapphire", value: "sapphire", class: "from-blue-300 to-blue-500" },
  { name: "Emerald", value: "emerald", class: "from-green-300 to-emerald-500" },
  { name: "Amethyst", value: "amethyst", class: "from-purple-300 to-violet-500" },
  { name: "Silver", value: "silver", class: "from-gray-300 to-gray-500" }
];

export default function RealmConnection() {
  const [selectedCategory, setSelectedCategory] = useState<any>(null);
  const [kindnessContent, setKindnessContent] = useState("");
  const [selectedColor, setSelectedColor] = useState("gold");
  const [glowIntensity, setGlowIntensity] = useState(5);
  const [isPrivate, setIsPrivate] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: kindnessNotes = [], isLoading } = useQuery({
    queryKey: ["/api/kindness"],
  });

  const createNoteMutation = useMutation({
    mutationFn: async (noteData: any) => {
      return apiRequest("/api/kindness", "POST", noteData);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kindness"] });
      queryClient.invalidateQueries({ queryKey: ["/api/companion"] });
      setKindnessContent("");
      setShowCreateForm(false);
      setSelectedCategory(null);
      toast({
        title: "Kindness note created!",
        description: "Your message of love has been added to the vault",
      });
    },
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (noteId: string) => {
      return apiRequest(`/api/kindness/${noteId}/read`, "POST", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kindness"] });
    },
  });

  const deleteNoteMutation = useMutation({
    mutationFn: async (noteId: string) => {
      return apiRequest(`/api/kindness/${noteId}`, "DELETE", {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/kindness"] });
      toast({
        title: "Note removed",
        description: "The kindness note has been deleted",
      });
    },
  });

  const handleCreateNote = () => {
    if (!kindnessContent.trim()) {
      toast({
        title: "Please write your kindness note",
        description: "Add some gentle words before creating",
        variant: "destructive"
      });
      return;
    }

    createNoteMutation.mutate({
      content: kindnessContent,
      type: selectedCategory?.id || "self-kindness",
      color: selectedColor,
      glowIntensity,
      isPrivate,
      tags: []
    });
  };

  const generateAIKindness = async () => {
    if (!selectedCategory) return;
    
    // Simulate AI-generated kindness message
    const examples = {
      "self-kindness": [
        "You are doing the best you can with the resources you have, and that is more than enough.",
        "Your feelings are valid, and it's okay to take things one moment at a time.",
        "You have overcome challenges before, and you carry that same resilience within you now.",
        "You deserve the same compassion you would give to a dear friend."
      ],
      "future-self": [
        "The seeds of growth you're planting today will bloom into beautiful possibilities tomorrow.",
        "Every step you take, no matter how small, is leading you toward the person you're becoming.",
        "Trust that your future self will look back with gratitude for the courage you're showing now.",
        "The challenges you face today are building the wisdom and strength your future self will treasure."
      ],
      "affirmation": [
        "I am worthy of love, respect, and all the good things life has to offer.",
        "My unique perspective and experiences make me valuable and irreplaceable.",
        "I have the inner strength to navigate any challenge that comes my way.",
        "I choose to treat myself with the same kindness I would show a beloved friend."
      ],
      "gratitude": [
        "I am grateful for my body that carries me through each day and all it does for me.",
        "I appreciate the small moments of beauty that remind me life is full of wonder.",
        "I'm thankful for the people who have touched my life and made it richer.",
        "I'm grateful for my ability to learn, grow, and become more compassionate each day."
      ]
    };

    const messages = examples[selectedCategory.id as keyof typeof examples] || examples["self-kindness"];
    const randomMessage = messages[Math.floor(Math.random() * messages.length)];
    
    setKindnessContent(randomMessage);
    toast({
      title: "AI kindness generated!",
      description: "Feel free to edit this message to make it your own",
    });
  };

  const getGlowClass = (color: string, intensity: number) => {
    const colorClass = glowColors.find(c => c.value === color)?.class || glowColors[0].class;
    const glowIntensityClass = intensity > 7 ? "shadow-2xl" : intensity > 4 ? "shadow-lg" : "shadow-md";
    return `bg-gradient-to-br ${colorClass} ${glowIntensityClass}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50 dark:from-rose-950 dark:via-pink-950 dark:to-purple-950">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Realm Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Heart className="w-8 h-8 text-rose-600" />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-rose-600 to-purple-600 bg-clip-text text-transparent">
              Realm of Connection
            </h1>
            <Users className="w-8 h-8 text-purple-600" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A sanctuary for self-compassion, kindness vault, and AI-guided emotional connection
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Tabs defaultValue="vault" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="vault" className="flex items-center gap-2">
                  <Gem className="w-4 h-4" />
                  Kindness Vault
                </TabsTrigger>
                <TabsTrigger value="create" className="flex items-center gap-2">
                  <Plus className="w-4 h-4" />
                  Create Note
                </TabsTrigger>
              </TabsList>

              <TabsContent value="vault" className="space-y-6">
                {/* Kindness Vault Display */}
                <div className="relative">
                  <div className="min-h-[400px] bg-gradient-to-br from-purple-900/20 to-pink-900/20 rounded-2xl p-8 border-2 border-purple-200 dark:border-purple-800">
                    <h3 className="text-xl font-semibold mb-6 text-center flex items-center justify-center gap-2">
                      <Sparkles className="w-5 h-5" />
                      Your Kindness Collection
                    </h3>
                    
                    {isLoading ? (
                      <div className="grid gap-4">
                        {[1, 2, 3].map(i => (
                          <div key={i} className="animate-pulse bg-muted/50 rounded-lg h-24" />
                        ))}
                      </div>
                    ) : Array.isArray(kindnessNotes) && kindnessNotes.length > 0 ? (
                      <div className="grid md:grid-cols-2 gap-4">
                        {kindnessNotes.map((note: any) => {
                          const category = kindnessCategories.find(c => c.id === note.type) || kindnessCategories[0];
                          const IconComponent = category.icon;
                          
                          return (
                            <Card 
                              key={note.id} 
                              className={`
                                ${getGlowClass(note.color, note.glowIntensity)} 
                                border-2 border-white/50 hover:scale-105 transition-all duration-300 cursor-pointer
                                ${note.readCount > 0 ? 'opacity-80' : 'animate-pulse'}
                              `}
                              onClick={() => markAsReadMutation.mutate(note.id)}
                            >
                              <CardHeader className="pb-3">
                                <CardTitle className="flex items-center justify-between text-white">
                                  <div className="flex items-center gap-2">
                                    <IconComponent className="w-5 h-5" />
                                    {category.name}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    {note.readCount > 0 && (
                                      <Badge variant="secondary" className="text-xs">
                                        <Eye className="w-3 h-3 mr-1" />
                                        {note.readCount}
                                      </Badge>
                                    )}
                                    <Button
                                      size="sm"
                                      variant="ghost"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        deleteNoteMutation.mutate(note.id);
                                      }}
                                      className="text-white hover:bg-white/20 h-6 w-6 p-0"
                                    >
                                      <Trash2 className="w-3 h-3" />
                                    </Button>
                                  </div>
                                </CardTitle>
                              </CardHeader>
                              <CardContent className="text-white/95 leading-relaxed">
                                <p className="text-sm font-medium mb-2">"{note.content}"</p>
                                <div className="flex items-center justify-between text-xs text-white/70">
                                  <span>{new Date(note.createdAt).toLocaleDateString()}</span>
                                  <div className="flex items-center gap-2">
                                    <span className="flex items-center gap-1">
                                      <Sparkles className="w-3 h-3" />
                                      Glow {note.glowIntensity}/10
                                    </span>
                                    {!note.isPrivate && (
                                      <Globe className="w-3 h-3" />
                                    )}
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="text-center py-12">
                        <div className="mb-6">
                          <Heart className="w-16 h-16 mx-auto text-purple-300 mb-4" />
                          <h4 className="text-lg font-medium text-muted-foreground mb-2">
                            Your kindness vault awaits
                          </h4>
                          <p className="text-muted-foreground">
                            Create your first note of self-compassion
                          </p>
                        </div>
                        <Button 
                          onClick={() => setShowCreateForm(true)}
                          className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Create First Note
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="create" className="space-y-6">
                {/* Create Kindness Note */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MessageCircle className="w-5 h-5 text-pink-600" />
                      Create Kindness Note
                    </CardTitle>
                    <p className="text-muted-foreground">
                      Write yourself a gentle message or let AI help you craft words of compassion
                    </p>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    {/* Category Selection */}
                    {!selectedCategory && (
                      <div className="space-y-4">
                        <h3 className="font-medium">Choose a kindness theme:</h3>
                        <div className="grid md:grid-cols-2 gap-3">
                          {kindnessCategories.map((category) => {
                            const IconComponent = category.icon;
                            return (
                              <Button
                                key={category.id}
                                variant="outline"
                                className="p-4 h-auto justify-start"
                                onClick={() => setSelectedCategory(category)}
                              >
                                <div className={`p-2 rounded-lg bg-gradient-to-br ${category.color} text-white mr-3`}>
                                  <IconComponent className="w-4 h-4" />
                                </div>
                                <div className="text-left">
                                  <div className="font-medium">{category.name}</div>
                                  <div className="text-xs text-muted-foreground">{category.description}</div>
                                </div>
                              </Button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Note Creation Form */}
                    {selectedCategory && (
                      <div className="space-y-4">
                        <div className={`bg-gradient-to-r ${selectedCategory.color} text-white p-4 rounded-lg`}>
                          <h3 className="font-medium mb-2 flex items-center gap-2">
                            <selectedCategory.icon className="w-5 h-5" />
                            {selectedCategory.name}
                          </h3>
                          <p className="text-white/90 text-sm">{selectedCategory.description}</p>
                        </div>

                        {/* AI Prompt Suggestions */}
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium">AI Prompt Suggestions:</h4>
                          <div className="grid gap-2">
                            {selectedCategory.prompts.slice(0, 2).map((prompt: string, index: number) => (
                              <Button
                                key={index}
                                variant="outline"
                                size="sm"
                                className="justify-start text-left h-auto p-3"
                                onClick={() => setKindnessContent(prompt)}
                              >
                                <Star className="w-3 h-3 mr-2 flex-shrink-0" />
                                {prompt}
                              </Button>
                            ))}
                          </div>
                        </div>

                        {/* Content Input */}
                        <div className="space-y-2">
                          <div className="flex justify-between items-center">
                            <label className="text-sm font-medium">Your kindness message:</label>
                            <Button
                              onClick={generateAIKindness}
                              size="sm"
                              variant="outline"
                            >
                              <Sparkles className="w-4 h-4 mr-2" />
                              AI Inspire
                            </Button>
                          </div>
                          <Textarea
                            placeholder="Write yourself a gentle, loving message..."
                            value={kindnessContent}
                            onChange={(e) => setKindnessContent(e.target.value)}
                            className="min-h-[120px]"
                          />
                        </div>

                        {/* Customization Options */}
                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Glow Color:</label>
                            <div className="flex gap-2 flex-wrap">
                              {glowColors.map((color) => (
                                <Button
                                  key={color.value}
                                  size="sm"
                                  variant={selectedColor === color.value ? "default" : "outline"}
                                  className={`${selectedColor === color.value ? `bg-gradient-to-r ${color.class} text-white` : ''}`}
                                  onClick={() => setSelectedColor(color.value)}
                                >
                                  {color.name}
                                </Button>
                              ))}
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <label className="text-sm font-medium">Glow Intensity: {glowIntensity}/10</label>
                            <div className="flex gap-1">
                              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((intensity) => (
                                <Button
                                  key={intensity}
                                  size="sm"
                                  variant={glowIntensity >= intensity ? "default" : "outline"}
                                  className="w-8 h-8 p-0"
                                  onClick={() => setGlowIntensity(intensity)}
                                >
                                  ⭐
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Privacy Toggle */}
                        <div className="flex items-center justify-between">
                          <div>
                            <label className="text-sm font-medium">Privacy Setting</label>
                            <p className="text-xs text-muted-foreground">
                              {isPrivate ? "Only you can see this note" : "This note could be shared anonymously with others who need kindness"}
                            </p>
                          </div>
                          <Button
                            variant={isPrivate ? "outline" : "default"}
                            size="sm"
                            onClick={() => setIsPrivate(!isPrivate)}
                          >
                            {isPrivate ? <Eye className="w-4 h-4 mr-2" /> : <Globe className="w-4 h-4 mr-2" />}
                            {isPrivate ? "Private" : "Shareable"}
                          </Button>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2">
                          <Button
                            onClick={handleCreateNote}
                            disabled={createNoteMutation.isPending || !kindnessContent.trim()}
                            className="flex-1"
                          >
                            {createNoteMutation.isPending ? (
                              "Creating..."
                            ) : (
                              <>
                                <Gift className="w-4 h-4 mr-2" />
                                Add to Vault
                              </>
                            )}
                          </Button>
                          <Button 
                            variant="outline" 
                            onClick={() => {
                              setSelectedCategory(null);
                              setKindnessContent("");
                            }}
                          >
                            Change Theme
                          </Button>
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Companion */}
            <CompanionCharacter size="large" />

            {/* Connection Stats */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Heart className="w-5 h-5" />
                  Connection Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-pink-600">
                      {Array.isArray(kindnessNotes) ? kindnessNotes.length : 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Notes</div>
                  </div>
                  <div className="bg-muted/50 rounded-lg p-3">
                    <div className="text-2xl font-bold text-purple-600">
                      {Array.isArray(kindnessNotes) ? kindnessNotes.reduce((total: number, note: any) => total + (note.readCount || 0), 0) : 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Reads</div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Self-Compassion Level</span>
                    <span>Growing</span>
                  </div>
                  <div className="bg-muted rounded-full h-2">
                    <div className="bg-gradient-to-r from-pink-500 to-purple-500 h-2 rounded-full w-[40%]"></div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Daily Kindness */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Sparkles className="w-5 h-5" />
                  Daily Kindness
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center p-4">
                  <div className="text-lg mb-2">"Be kind to yourself. You're doing better than you think."</div>
                  <div className="text-sm text-muted-foreground">Today's gentle reminder</div>
                </div>
                <Button variant="outline" size="sm" className="w-full">
                  <Heart className="w-4 h-4 mr-2" />
                  Add to vault
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}