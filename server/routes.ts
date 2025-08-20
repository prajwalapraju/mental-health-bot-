import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertMoodEntrySchema,
  insertJournalEntrySchema,
  insertBreathingSessionSchema,
  insertFavoriteAffirmationSchema,
  insertHobbySchema,
  insertCompanionSchema,
  insertQuestSchema,
  insertKindnessNoteSchema,
  insertSoundscapeSessionSchema,
  insertMemoryNodeSchema
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  const defaultUserId = "default-user"; // For demo purposes

  // Mood entries
  app.post("/api/mood", async (req, res) => {
    try {
      const validatedData = insertMoodEntrySchema.parse(req.body);
      const entry = await storage.createMoodEntry(defaultUserId, validatedData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid mood entry data" });
    }
  });

  app.get("/api/mood", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const entries = await storage.getMoodEntries(defaultUserId, limit);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood entries" });
    }
  });

  app.get("/api/mood/range", async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      if (!startDate || !endDate) {
        return res.status(400).json({ message: "Start date and end date are required" });
      }
      
      const entries = await storage.getMoodEntriesForDateRange(
        defaultUserId,
        new Date(startDate as string),
        new Date(endDate as string)
      );
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch mood entries for date range" });
    }
  });

  // Journal entries
  app.post("/api/journal", async (req, res) => {
    try {
      const validatedData = insertJournalEntrySchema.parse(req.body);
      const entry = await storage.createJournalEntry(defaultUserId, validatedData);
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid journal entry data" });
    }
  });

  app.get("/api/journal", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const entries = await storage.getJournalEntries(defaultUserId, limit);
      res.json(entries);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journal entries" });
    }
  });

  app.get("/api/journal/:id", async (req, res) => {
    try {
      const entry = await storage.getJournalEntry(req.params.id);
      if (!entry) {
        return res.status(404).json({ message: "Journal entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch journal entry" });
    }
  });

  app.put("/api/journal/:id", async (req, res) => {
    try {
      const validatedData = insertJournalEntrySchema.partial().parse(req.body);
      const entry = await storage.updateJournalEntry(req.params.id, validatedData);
      if (!entry) {
        return res.status(404).json({ message: "Journal entry not found" });
      }
      res.json(entry);
    } catch (error) {
      res.status(400).json({ message: "Invalid journal entry data" });
    }
  });

  app.delete("/api/journal/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteJournalEntry(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Journal entry not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete journal entry" });
    }
  });

  // Breathing sessions
  app.post("/api/breathing", async (req, res) => {
    try {
      const validatedData = insertBreathingSessionSchema.parse(req.body);
      const session = await storage.createBreathingSession(defaultUserId, validatedData);
      res.json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid breathing session data" });
    }
  });

  app.get("/api/breathing", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const sessions = await storage.getBreathingSessions(defaultUserId, limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch breathing sessions" });
    }
  });

  // Favorite affirmations
  app.post("/api/affirmations/favorites", async (req, res) => {
    try {
      const validatedData = insertFavoriteAffirmationSchema.parse(req.body);
      const favorite = await storage.createFavoriteAffirmation(defaultUserId, validatedData);
      res.json(favorite);
    } catch (error) {
      res.status(400).json({ message: "Invalid affirmation data" });
    }
  });

  app.get("/api/affirmations/favorites", async (req, res) => {
    try {
      const favorites = await storage.getFavoriteAffirmations(defaultUserId);
      res.json(favorites);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch favorite affirmations" });
    }
  });

  app.delete("/api/affirmations/favorites/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteFavoriteAffirmation(req.params.id);
      if (!deleted) {
        return res.status(404).json({ message: "Favorite affirmation not found" });
      }
      res.json({ success: true });
    } catch (error) {
      res.status(500).json({ message: "Failed to delete favorite affirmation" });
    }
  });

  // User stats
  app.get("/api/stats", async (req, res) => {
    try {
      const stats = await storage.getUserStats(defaultUserId);
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user stats" });
    }
  });

  // Get user info
  app.get("/api/user", async (req, res) => {
    try {
      const user = await storage.getUser(defaultUserId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json({ id: user.id, username: user.username, name: user.name });
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch user info" });
    }
  });

  // Hobby tracking and suggestions
  app.get("/api/hobbies", async (req, res) => {
    try {
      const hobbies = await storage.getHobbies(defaultUserId);
      res.json(hobbies);
    } catch (error) {
      console.error("Error fetching hobbies:", error);
      res.status(500).json({ error: "Failed to fetch hobbies" });
    }
  });

  app.post("/api/hobbies", async (req, res) => {
    try {
      const validatedData = insertHobbySchema.parse(req.body);
      const hobby = await storage.createHobby(defaultUserId, validatedData);
      res.status(201).json(hobby);
    } catch (error) {
      console.error("Error creating hobby:", error);
      res.status(500).json({ error: "Failed to create hobby" });
    }
  });

  // Intelligent hobby suggestions based on mental health patterns
  app.get("/api/hobbies/suggestions", async (req, res) => {
    try {
      // Get user's recent mood and journal patterns
      const moodEntries = await storage.getMoodEntries(defaultUserId);
      const journalEntries = await storage.getJournalEntries(defaultUserId);
      const currentHobbies = await storage.getHobbies(defaultUserId);
      
      const recentMoods = moodEntries.slice(-14); // Last 14 entries for better pattern analysis
      const recentJournals = journalEntries.slice(-10); // Last 10 journal entries
      const currentHobbyNames = currentHobbies.map((h: any) => h.name.toLowerCase());
      
      // Calculate mental health indicators
      const avgMood = recentMoods.length > 0 
        ? recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length
        : 3;
      
      // Analyze emotional patterns from journal entries
      const emotionalPatterns = recentJournals.reduce((patterns, entry) => {
        if (entry.emotions) {
          entry.emotions.forEach(emotion => {
            patterns[emotion] = (patterns[emotion] || 0) + 1;
          });
        }
        return patterns;
      }, {} as Record<string, number>);
      
      // Determine mental state and stress level
      const lowMoodCount = recentMoods.filter(m => m.mood <= 2).length;
      const highStressEmotions = ['anxious', 'stressed', 'overwhelmed'].reduce(
        (count, emotion) => count + (emotionalPatterns[emotion] || 0), 0
      );
      
      const isInCrisis = avgMood < 2 || lowMoodCount > 5;
      const isHighStress = highStressEmotions > 3 || avgMood < 2.5;
      const needsConnection = emotionalPatterns['sad'] > 2 || emotionalPatterns['lonely'] > 1;
      
      // Comprehensive hobby suggestions with therapeutic benefits
      const allSuggestions = [
        // Crisis & Emergency Coping Activities
        { 
          name: "Breathing Focus", 
          category: "Crisis Support", 
          description: "5-minute breathing exercises to regain control in moments of distress", 
          moodBoost: 5, 
          difficulty: "Easy", 
          timeCommitment: "5-10 minutes",
          therapeuticBenefit: "Immediate anxiety relief",
          crisisSupport: true,
          stressLevel: "emergency"
        },
        { 
          name: "Grounding Techniques", 
          category: "Crisis Support", 
          description: "5-4-3-2-1 sensory grounding and mindfulness exercises", 
          moodBoost: 5, 
          difficulty: "Easy", 
          timeCommitment: "10-15 minutes",
          therapeuticBenefit: "Panic attack management",
          crisisSupport: true,
          stressLevel: "emergency"
        },
        { 
          name: "Gentle Movement", 
          category: "Crisis Support", 
          description: "Slow stretching or walking to release physical tension", 
          moodBoost: 4, 
          difficulty: "Easy", 
          timeCommitment: "10-20 minutes",
          therapeuticBenefit: "Trauma release and grounding",
          crisisSupport: true,
          stressLevel: "high"
        },
        
        // High Stress Relief Activities
        { 
          name: "Art Therapy", 
          category: "Creative Healing", 
          description: "Express emotions through colors, shapes, and textures without judgment", 
          moodBoost: 4, 
          difficulty: "Easy", 
          timeCommitment: "20-60 minutes",
          therapeuticBenefit: "Emotional processing and release",
          stressLevel: "high"
        },
        { 
          name: "Nature Immersion", 
          category: "Restorative", 
          description: "Spend time outdoors, even just sitting by a window with plants", 
          moodBoost: 4, 
          difficulty: "Easy", 
          timeCommitment: "15-30 minutes",
          therapeuticBenefit: "Reduced cortisol levels",
          stressLevel: "moderate"
        },
        { 
          name: "Comfort Crafting", 
          category: "Mindful Creation", 
          description: "Simple, repetitive crafts like knitting or origami for soothing focus", 
          moodBoost: 3, 
          difficulty: "Easy", 
          timeCommitment: "30-90 minutes",
          therapeuticBenefit: "Meditative mindfulness",
          stressLevel: "moderate"
        },
        
        // Social Connection & Support
        { 
          name: "Video Call Check-in", 
          category: "Connection", 
          description: "Schedule a 15-minute call with a trusted friend or family member", 
          moodBoost: 4, 
          difficulty: "Easy", 
          timeCommitment: "15-30 minutes",
          therapeuticBenefit: "Combat isolation",
          socialSupport: true
        },
        { 
          name: "Community Volunteering", 
          category: "Purpose", 
          description: "Help others through local food banks, animal shelters, or online mentoring", 
          moodBoost: 5, 
          difficulty: "Medium", 
          timeCommitment: "1-3 hours",
          therapeuticBenefit: "Sense of purpose and connection",
          socialSupport: true
        },
        { 
          name: "Support Group Participation", 
          category: "Healing Community", 
          description: "Join online or local mental health support groups", 
          moodBoost: 4, 
          difficulty: "Medium", 
          timeCommitment: "60-90 minutes",
          therapeuticBenefit: "Shared experience and validation",
          socialSupport: true
        },
        
        // Physical Wellness for Mental Health
        { 
          name: "Trauma-Informed Yoga", 
          category: "Body-Mind Healing", 
          description: "Gentle yoga focused on body awareness and emotional release", 
          moodBoost: 5, 
          difficulty: "Easy", 
          timeCommitment: "20-45 minutes",
          therapeuticBenefit: "Nervous system regulation"
        },
        { 
          name: "Walking Meditation", 
          category: "Moving Mindfulness", 
          description: "Slow, intentional walking while focusing on each step and breath", 
          moodBoost: 4, 
          difficulty: "Easy", 
          timeCommitment: "15-30 minutes",
          therapeuticBenefit: "Integration of movement and mindfulness"
        },
        { 
          name: "Dance Therapy", 
          category: "Expressive Movement", 
          description: "Free movement to music for emotional expression and joy", 
          moodBoost: 5, 
          difficulty: "Easy", 
          timeCommitment: "20-40 minutes",
          therapeuticBenefit: "Endorphin release and emotional expression"
        },
        
        // Cognitive and Learning Activities
        { 
          name: "Mindfulness Journaling", 
          category: "Reflective Practice", 
          description: "Guided prompts for processing emotions and thoughts", 
          moodBoost: 4, 
          difficulty: "Easy", 
          timeCommitment: "15-30 minutes",
          therapeuticBenefit: "Emotional regulation and self-awareness"
        },
        { 
          name: "Learning for Joy", 
          category: "Mental Stimulation", 
          description: "Learn something purely for pleasure - languages, music, or skills", 
          moodBoost: 3, 
          difficulty: "Medium", 
          timeCommitment: "30-60 minutes",
          therapeuticBenefit: "Cognitive flexibility and achievement"
        },
        { 
          name: "Puzzle Meditation", 
          category: "Focused Calm", 
          description: "Jigsaw puzzles, sudoku, or crosswords for present-moment focus", 
          moodBoost: 3, 
          difficulty: "Easy", 
          timeCommitment: "30-90 minutes",
          therapeuticBenefit: "Anxiety reduction through focus"
        },
        
        // Creative Expression for Healing
        { 
          name: "Music Therapy", 
          category: "Sound Healing", 
          description: "Listen to, create, or play music for emotional processing", 
          moodBoost: 5, 
          difficulty: "Easy", 
          timeCommitment: "20-60 minutes",
          therapeuticBenefit: "Mood regulation and emotional release"
        },
        { 
          name: "Storytelling & Writing", 
          category: "Narrative Therapy", 
          description: "Write your story, poetry, or fictional narratives for perspective", 
          moodBoost: 4, 
          difficulty: "Easy", 
          timeCommitment: "20-45 minutes",
          therapeuticBenefit: "Meaning-making and self-understanding"
        },
        { 
          name: "Photography Mindfulness", 
          category: "Visual Awareness", 
          description: "Capture moments of beauty and meaning in everyday life", 
          moodBoost: 3, 
          difficulty: "Easy", 
          timeCommitment: "15-60 minutes",
          therapeuticBenefit: "Present-moment awareness and gratitude"
        }
      ];
      
      // Filter out existing hobbies
      const availableSuggestions = allSuggestions.filter(
        suggestion => !currentHobbyNames.includes(suggestion.name.toLowerCase())
      );
      
      // Personalize suggestions based on mental health state
      let personalizedSuggestions;
      let recommendations = [];
      
      if (isInCrisis) {
        // Crisis mode - immediate support activities only
        personalizedSuggestions = availableSuggestions.filter(s => s.crisisSupport === true);
        recommendations.push("You seem to be going through a difficult time. These activities can provide immediate support.");
        recommendations.push("Remember: You're not alone. Consider reaching out to a mental health professional.");
      } else if (isHighStress) {
        // High stress - focus on stress relief and coping
        personalizedSuggestions = availableSuggestions.filter(s => 
          s.stressLevel === "high" || s.stressLevel === "moderate" || s.crisisSupport
        );
        recommendations.push("These activities are designed to help reduce stress and promote calm.");
        recommendations.push("Start with shorter sessions and gradually increase time as you feel more comfortable.");
      } else if (needsConnection) {
        // Need social support
        personalizedSuggestions = availableSuggestions.filter(s => 
          s.socialSupport === true || s.category === "Connection" || s.moodBoost >= 4
        );
        recommendations.push("Connection with others can be healing. Try these social and mood-boosting activities.");
      } else if (avgMood < 3.5) {
        // Moderate mood - engaging activities for improvement
        personalizedSuggestions = availableSuggestions.filter(s => 
          s.moodBoost >= 3 && s.difficulty !== "Hard"
        );
        recommendations.push("These activities can help lift your spirits and build positive momentum.");
      } else {
        // Good mood - variety of growth activities
        personalizedSuggestions = availableSuggestions.filter(s => s.moodBoost >= 3);
        recommendations.push("You're in a good space! These activities can help maintain and enhance your wellbeing.");
      }
      
      // Sort by therapeutic benefit for mental health, then mood boost
      const topSuggestions = personalizedSuggestions
        .sort((a, b) => {
          // Prioritize crisis support if needed
          if (isInCrisis && a.crisisSupport !== b.crisisSupport) {
            return a.crisisSupport ? -1 : 1;
          }
          return b.moodBoost - a.moodBoost;
        })
        .slice(0, 6);
      
      res.json({
        suggestions: topSuggestions,
        averageMood: avgMood,
        moodContext: isInCrisis ? "crisis" : isHighStress ? "high-stress" : avgMood < 3.5 ? "moderate" : "good",
        recommendations,
        emotionalPatterns,
        supportResources: isInCrisis || isHighStress ? [
          { name: "Crisis Text Line", contact: "Text HOME to 741741", description: "24/7 crisis support" },
          { name: "National Suicide Prevention Lifeline", contact: "988", description: "24/7 emotional support" },
          { name: "SAMHSA Helpline", contact: "1-800-662-4357", description: "Mental health and substance use support" }
        ] : []
      });
    } catch (error) {
      console.error("Error generating hobby suggestions:", error);
      res.status(500).json({ error: "Failed to generate hobby suggestions" });
    }
  });

  // Companion Character API - Evolving emotional companion
  app.get("/api/companion", async (req, res) => {
    try {
      const companion = await storage.getCompanion(defaultUserId);
      if (!companion) {
        // Create default companion if none exists
        const defaultCompanion = await storage.createCompanion(defaultUserId, {
          name: "Spark",
          stage: "seed",
          color: "silver",
          accessories: [],
          experience: 0,
          level: 1,
          personality: { traits: ["curious", "supportive"] }
        });
        return res.json(defaultCompanion);
      }
      res.json(companion);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch companion" });
    }
  });

  app.patch("/api/companion", async (req, res) => {
    try {
      const validatedData = insertCompanionSchema.partial().parse(req.body);
      const companion = await storage.updateCompanion(defaultUserId, validatedData);
      if (!companion) {
        return res.status(404).json({ error: "Companion not found" });
      }
      res.json(companion);
    } catch (error) {
      res.status(400).json({ error: "Invalid companion data" });
    }
  });

  // Quests API - Themed emotional growth challenges
  app.get("/api/quests", async (req, res) => {
    try {
      const completed = req.query.completed === 'true' ? true : req.query.completed === 'false' ? false : undefined;
      const quests = await storage.getQuests(defaultUserId, completed);
      res.json(quests);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch quests" });
    }
  });

  app.post("/api/quests", async (req, res) => {
    try {
      const validatedData = insertQuestSchema.parse(req.body);
      const quest = await storage.createQuest(defaultUserId, validatedData);
      res.status(201).json(quest);
    } catch (error) {
      res.status(400).json({ error: "Invalid quest data" });
    }
  });

  app.patch("/api/quests/:id", async (req, res) => {
    try {
      const validatedData = insertQuestSchema.partial().parse(req.body);
      const quest = await storage.updateQuest(req.params.id, validatedData);
      if (!quest) {
        return res.status(404).json({ error: "Quest not found" });
      }
      res.json(quest);
    } catch (error) {
      res.status(400).json({ error: "Invalid quest data" });
    }
  });

  app.post("/api/quests/:id/complete", async (req, res) => {
    try {
      const quest = await storage.completeQuest(req.params.id, req.body.questData);
      if (!quest) {
        return res.status(404).json({ error: "Quest not found" });
      }
      
      // Award experience to companion
      const companion = await storage.getCompanion(defaultUserId);
      if (companion) {
        const experienceGained = 25;
        const newLevel = Math.floor((companion.experience + experienceGained) / 100) + 1;
        await storage.updateCompanion(defaultUserId, {
          experience: companion.experience + experienceGained,
          level: Math.max(companion.level, newLevel)
        });
      }
      
      res.json(quest);
    } catch (error) {
      res.status(500).json({ error: "Failed to complete quest" });
    }
  });

  // Kindness Vault API - Self-compassion and positive messages
  app.get("/api/kindness", async (req, res) => {
    try {
      const notes = await storage.getKindnessNotes(defaultUserId);
      res.json(notes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch kindness notes" });
    }
  });

  app.post("/api/kindness", async (req, res) => {
    try {
      const validatedData = insertKindnessNoteSchema.parse(req.body);
      const note = await storage.createKindnessNote(defaultUserId, validatedData);
      res.status(201).json(note);
    } catch (error) {
      res.status(400).json({ error: "Invalid kindness note data" });
    }
  });

  app.patch("/api/kindness/:id", async (req, res) => {
    try {
      const validatedData = insertKindnessNoteSchema.partial().parse(req.body);
      const note = await storage.updateKindnessNote(req.params.id, validatedData);
      if (!note) {
        return res.status(404).json({ error: "Kindness note not found" });
      }
      res.json(note);
    } catch (error) {
      res.status(400).json({ error: "Invalid kindness note data" });
    }
  });

  app.post("/api/kindness/:id/read", async (req, res) => {
    try {
      // This will be a custom method to increment read count
      const existingNotes = await storage.getKindnessNotes(defaultUserId);
      const note = existingNotes.find(n => n.id === req.params.id);
      if (!note) {
        return res.status(404).json({ error: "Kindness note not found" });
      }
      
      const updatedNote = await storage.updateKindnessNote(req.params.id, {
        ...note,
        readCount: (note.readCount || 0) + 1,
        lastRead: new Date()
      } as any);
      
      res.json(updatedNote);
    } catch (error) {
      res.status(500).json({ error: "Failed to mark note as read" });
    }
  });

  app.delete("/api/kindness/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteKindnessNote(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Kindness note not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete kindness note" });
    }
  });

  // Soundscape API - Mood-based ambient audio sessions
  app.get("/api/soundscapes", async (req, res) => {
    try {
      const limit = req.query.limit ? parseInt(req.query.limit as string) : undefined;
      const sessions = await storage.getSoundscapeSessions(defaultUserId, limit);
      res.json(sessions);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch soundscape sessions" });
    }
  });

  app.post("/api/soundscapes", async (req, res) => {
    try {
      const validatedData = insertSoundscapeSessionSchema.parse(req.body);
      const session = await storage.createSoundscapeSession(defaultUserId, validatedData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ error: "Invalid soundscape session data" });
    }
  });

  // Memory Constellation API - Visual journal timeline
  app.get("/api/memories", async (req, res) => {
    try {
      const nodes = await storage.getMemoryNodes(defaultUserId);
      res.json(nodes);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch memory nodes" });
    }
  });

  app.post("/api/memories", async (req, res) => {
    try {
      const validatedData = insertMemoryNodeSchema.parse(req.body);
      const node = await storage.createMemoryNode(defaultUserId, validatedData);
      res.status(201).json(node);
    } catch (error) {
      res.status(400).json({ error: "Invalid memory node data" });
    }
  });

  app.patch("/api/memories/:id", async (req, res) => {
    try {
      const validatedData = insertMemoryNodeSchema.partial().parse(req.body);
      const node = await storage.updateMemoryNode(req.params.id, validatedData);
      if (!node) {
        return res.status(404).json({ error: "Memory node not found" });
      }
      res.json(node);
    } catch (error) {
      res.status(400).json({ error: "Invalid memory node data" });
    }
  });

  app.delete("/api/memories/:id", async (req, res) => {
    try {
      const deleted = await storage.deleteMemoryNode(req.params.id);
      if (!deleted) {
        return res.status(404).json({ error: "Memory node not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ error: "Failed to delete memory node" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
