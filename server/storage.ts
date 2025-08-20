import { 
  type User, 
  type InsertUser,
  type MoodEntry,
  type InsertMoodEntry,
  type JournalEntry,
  type InsertJournalEntry,
  type BreathingSession,
  type InsertBreathingSession,
  type FavoriteAffirmation,
  type InsertFavoriteAffirmation,
  type Hobby,
  type InsertHobby,
  type HobbyEntry,
  type InsertHobbyEntry,
  type VoiceNote,
  type InsertVoiceNote,
  type AiConversation,
  type InsertAiConversation,
  type Companion,
  type InsertCompanion,
  type Quest,
  type InsertQuest,
  type KindnessNote,
  type InsertKindnessNote,
  type SoundscapeSession,
  type InsertSoundscapeSession,
  type MemoryNode,
  type InsertMemoryNode
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Mood tracking methods
  createMoodEntry(userId: string, entry: InsertMoodEntry): Promise<MoodEntry>;
  getMoodEntries(userId: string, limit?: number): Promise<MoodEntry[]>;
  getMoodEntriesForDateRange(userId: string, startDate: Date, endDate: Date): Promise<MoodEntry[]>;

  // Journal methods
  createJournalEntry(userId: string, entry: InsertJournalEntry): Promise<JournalEntry>;
  getJournalEntries(userId: string, limit?: number): Promise<JournalEntry[]>;
  getJournalEntry(id: string): Promise<JournalEntry | undefined>;
  updateJournalEntry(id: string, entry: Partial<InsertJournalEntry>): Promise<JournalEntry | undefined>;
  deleteJournalEntry(id: string): Promise<boolean>;

  // Breathing session methods
  createBreathingSession(userId: string, session: InsertBreathingSession): Promise<BreathingSession>;
  getBreathingSessions(userId: string, limit?: number): Promise<BreathingSession[]>;

  // Affirmation methods
  createFavoriteAffirmation(userId: string, affirmation: InsertFavoriteAffirmation): Promise<FavoriteAffirmation>;
  getFavoriteAffirmations(userId: string): Promise<FavoriteAffirmation[]>;
  deleteFavoriteAffirmation(id: string): Promise<boolean>;

  // Hobby methods
  createHobby(userId: string, hobby: InsertHobby): Promise<Hobby>;
  getHobbies(userId: string): Promise<Hobby[]>;
  updateHobby(id: string, hobby: Partial<InsertHobby>): Promise<Hobby | undefined>;
  deleteHobby(id: string): Promise<boolean>;
  
  // Hobby entry methods
  createHobbyEntry(userId: string, entry: InsertHobbyEntry): Promise<HobbyEntry>;
  getHobbyEntries(userId: string, hobbyId?: string): Promise<HobbyEntry[]>;
  deleteHobbyEntry(id: string): Promise<boolean>;

  // Voice note methods
  createVoiceNote(userId: string, note: InsertVoiceNote): Promise<VoiceNote>;
  getVoiceNotes(userId: string, limit?: number): Promise<VoiceNote[]>;
  updateVoiceNote(id: string, note: Partial<InsertVoiceNote>): Promise<VoiceNote | undefined>;
  deleteVoiceNote(id: string): Promise<boolean>;

  // AI conversation methods
  createAiConversation(userId: string, conversation: InsertAiConversation): Promise<AiConversation>;
  getAiConversations(userId: string, limit?: number): Promise<AiConversation[]>;
  updateAiConversation(id: string, conversation: Partial<InsertAiConversation>): Promise<AiConversation | undefined>;
  deleteAiConversation(id: string): Promise<boolean>;

  // Companion character methods
  getCompanion(userId: string): Promise<Companion | undefined>;
  createCompanion(userId: string, companion: InsertCompanion): Promise<Companion>;
  updateCompanion(userId: string, companion: Partial<InsertCompanion>): Promise<Companion | undefined>;

  // Quest methods
  createQuest(userId: string, quest: InsertQuest): Promise<Quest>;
  getQuests(userId: string, completed?: boolean): Promise<Quest[]>;
  updateQuest(id: string, quest: Partial<InsertQuest>): Promise<Quest | undefined>;
  completeQuest(id: string, questData?: any): Promise<Quest | undefined>;

  // Kindness vault methods
  createKindnessNote(userId: string, note: InsertKindnessNote): Promise<KindnessNote>;
  getKindnessNotes(userId: string): Promise<KindnessNote[]>;
  updateKindnessNote(id: string, note: Partial<InsertKindnessNote>): Promise<KindnessNote | undefined>;
  deleteKindnessNote(id: string): Promise<boolean>;

  // Soundscape session methods
  createSoundscapeSession(userId: string, session: InsertSoundscapeSession): Promise<SoundscapeSession>;
  getSoundscapeSessions(userId: string, limit?: number): Promise<SoundscapeSession[]>;

  // Memory constellation methods
  createMemoryNode(userId: string, node: InsertMemoryNode): Promise<MemoryNode>;
  getMemoryNodes(userId: string): Promise<MemoryNode[]>;
  updateMemoryNode(id: string, node: Partial<InsertMemoryNode>): Promise<MemoryNode | undefined>;
  deleteMemoryNode(id: string): Promise<boolean>;

  // Statistics methods
  getUserStats(userId: string): Promise<{
    currentStreak: number;
    totalSessions: number;
    breathingTotal: number;
    journalTotal: number;
    moodTotal: number;
    hobbyTotal: number;
    voiceNoteTotal: number;
    aiConversationTotal: number;
  }>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private moodEntries: Map<string, MoodEntry>;
  private journalEntries: Map<string, JournalEntry>;
  private breathingSessions: Map<string, BreathingSession>;
  private favoriteAffirmations: Map<string, FavoriteAffirmation>;
  private hobbies: Map<string, Hobby>;
  private hobbyEntries: Map<string, HobbyEntry>;
  private voiceNotes: Map<string, VoiceNote>;
  private aiConversations: Map<string, AiConversation>;
  private companions: Map<string, Companion>;
  private quests: Map<string, Quest>;
  private kindnessNotes: Map<string, KindnessNote>;
  private soundscapeSessions: Map<string, SoundscapeSession>;
  private memoryNodes: Map<string, MemoryNode>;

  constructor() {
    this.users = new Map();
    this.moodEntries = new Map();
    this.journalEntries = new Map();
    this.breathingSessions = new Map();
    this.favoriteAffirmations = new Map();
    this.hobbies = new Map();
    this.hobbyEntries = new Map();
    this.voiceNotes = new Map();
    this.aiConversations = new Map();
    this.companions = new Map();
    this.quests = new Map();
    this.kindnessNotes = new Map();
    this.soundscapeSessions = new Map();
    this.memoryNodes = new Map();

    // Create a default user for the demo
    const defaultUser: User = {
      id: "default-user",
      username: "demo",
      password: "demo",
      name: "Alex"
    };
    this.users.set(defaultUser.id, defaultUser);
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(user => user.username === username);
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async createMoodEntry(userId: string, entry: InsertMoodEntry): Promise<MoodEntry> {
    const id = randomUUID();
    const moodEntry: MoodEntry = {
      ...entry,
      id,
      userId,
      notes: entry.notes || null,
      date: new Date()
    };
    this.moodEntries.set(id, moodEntry);
    return moodEntry;
  }

  async getMoodEntries(userId: string, limit?: number): Promise<MoodEntry[]> {
    const entries = Array.from(this.moodEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? entries.slice(0, limit) : entries;
  }

  async getMoodEntriesForDateRange(userId: string, startDate: Date, endDate: Date): Promise<MoodEntry[]> {
    return Array.from(this.moodEntries.values())
      .filter(entry => 
        entry.userId === userId &&
        new Date(entry.date) >= startDate &&
        new Date(entry.date) <= endDate
      )
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }

  async createJournalEntry(userId: string, entry: InsertJournalEntry): Promise<JournalEntry> {
    const id = randomUUID();
    const journalEntry: JournalEntry = {
      ...entry,
      id,
      userId,
      emotions: entry.emotions || null,
      date: new Date()
    };
    this.journalEntries.set(id, journalEntry);
    return journalEntry;
  }

  async getJournalEntries(userId: string, limit?: number): Promise<JournalEntry[]> {
    const entries = Array.from(this.journalEntries.values())
      .filter(entry => entry.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? entries.slice(0, limit) : entries;
  }

  async getJournalEntry(id: string): Promise<JournalEntry | undefined> {
    return this.journalEntries.get(id);
  }

  async updateJournalEntry(id: string, entry: Partial<InsertJournalEntry>): Promise<JournalEntry | undefined> {
    const existing = this.journalEntries.get(id);
    if (!existing) return undefined;

    const updated: JournalEntry = { ...existing, ...entry };
    this.journalEntries.set(id, updated);
    return updated;
  }

  async deleteJournalEntry(id: string): Promise<boolean> {
    return this.journalEntries.delete(id);
  }

  async createBreathingSession(userId: string, session: InsertBreathingSession): Promise<BreathingSession> {
    const id = randomUUID();
    const breathingSession: BreathingSession = {
      ...session,
      id,
      userId,
      completed: session.completed || false,
      date: new Date()
    };
    this.breathingSessions.set(id, breathingSession);
    return breathingSession;
  }

  async getBreathingSessions(userId: string, limit?: number): Promise<BreathingSession[]> {
    const sessions = Array.from(this.breathingSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? sessions.slice(0, limit) : sessions;
  }

  async createFavoriteAffirmation(userId: string, affirmation: InsertFavoriteAffirmation): Promise<FavoriteAffirmation> {
    const id = randomUUID();
    const favorite: FavoriteAffirmation = {
      ...affirmation,
      id,
      userId,
      date: new Date()
    };
    this.favoriteAffirmations.set(id, favorite);
    return favorite;
  }

  async getFavoriteAffirmations(userId: string): Promise<FavoriteAffirmation[]> {
    return Array.from(this.favoriteAffirmations.values())
      .filter(fav => fav.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async deleteFavoriteAffirmation(id: string): Promise<boolean> {
    return this.favoriteAffirmations.delete(id);
  }

  async getUserStats(userId: string): Promise<{
    currentStreak: number;
    totalSessions: number;
    breathingTotal: number;
    journalTotal: number;
    moodTotal: number;
    hobbyTotal: number;
    voiceNoteTotal: number;
    aiConversationTotal: number;
  }> {
    const moodEntries = await this.getMoodEntries(userId);
    const journalEntries = await this.getJournalEntries(userId);
    const breathingSessions = await this.getBreathingSessions(userId);
    const hobbies = await this.getHobbies(userId);
    const voiceNotes = await this.getVoiceNotes(userId);
    const aiConversations = await this.getAiConversations(userId);

    // Calculate current streak (days with any activity)
    const today = new Date();
    let currentStreak = 0;
    let checkDate = new Date(today);
    
    while (true) {
      const dayStart = new Date(checkDate);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(checkDate);
      dayEnd.setHours(23, 59, 59, 999);

      const hasActivity = moodEntries.some(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= dayStart && entryDate <= dayEnd;
      }) || journalEntries.some(entry => {
        const entryDate = new Date(entry.date);
        return entryDate >= dayStart && entryDate <= dayEnd;
      }) || breathingSessions.some(session => {
        const sessionDate = new Date(session.date);
        return sessionDate >= dayStart && sessionDate <= dayEnd;
      });

      if (hasActivity) {
        currentStreak++;
        checkDate.setDate(checkDate.getDate() - 1);
      } else {
        break;
      }
    }

    return {
      currentStreak,
      totalSessions: breathingSessions.length + journalEntries.length + moodEntries.length,
      breathingTotal: breathingSessions.length,
      journalTotal: journalEntries.length,
      moodTotal: moodEntries.length,
      hobbyTotal: hobbies.length,
      voiceNoteTotal: voiceNotes.length,
      aiConversationTotal: aiConversations.length
    };
  }

  // Hobby methods
  async createHobby(userId: string, hobby: InsertHobby): Promise<Hobby> {
    const id = randomUUID();
    const newHobby: Hobby = {
      id,
      userId,
      name: hobby.name,
      category: hobby.category,
      frequency: hobby.frequency,
      enjoymentLevel: hobby.enjoymentLevel,
      lastPracticed: hobby.lastPracticed || null,
      isActive: hobby.isActive !== undefined ? hobby.isActive : true,
      date: new Date()
    };
    this.hobbies.set(id, newHobby);
    return newHobby;
  }

  async getHobbies(userId: string): Promise<Hobby[]> {
    return Array.from(this.hobbies.values())
      .filter(hobby => hobby.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  async updateHobby(id: string, hobby: Partial<InsertHobby>): Promise<Hobby | undefined> {
    const existing = this.hobbies.get(id);
    if (!existing) return undefined;

    const updated: Hobby = { ...existing, ...hobby };
    this.hobbies.set(id, updated);
    return updated;
  }

  async deleteHobby(id: string): Promise<boolean> {
    return this.hobbies.delete(id);
  }

  async createHobbyEntry(userId: string, entry: InsertHobbyEntry): Promise<HobbyEntry> {
    const id = randomUUID();
    const newEntry: HobbyEntry = {
      id,
      userId,
      hobbyId: entry.hobbyId,
      duration: entry.duration || null,
      notes: entry.notes || null,
      enjoymentLevel: entry.enjoymentLevel,
      date: new Date()
    };
    this.hobbyEntries.set(id, newEntry);
    return newEntry;
  }

  async getHobbyEntries(userId: string, hobbyId?: string): Promise<HobbyEntry[]> {
    const entries = Array.from(this.hobbyEntries.values())
      .filter(entry => entry.userId === userId && (!hobbyId || entry.hobbyId === hobbyId))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    return entries;
  }

  async deleteHobbyEntry(id: string): Promise<boolean> {
    return this.hobbyEntries.delete(id);
  }

  // Voice note methods
  async createVoiceNote(userId: string, note: InsertVoiceNote): Promise<VoiceNote> {
    const id = randomUUID();
    const newNote: VoiceNote = {
      id,
      userId,
      title: note.title || null,
      transcription: note.transcription || null,
      duration: note.duration || null,
      audioUrl: note.audioUrl || null,
      emotions: note.emotions || null,
      aiSummary: note.aiSummary || null,
      aiInsights: note.aiInsights || null,
      isProcessed: note.isProcessed || false,
      date: new Date()
    };
    this.voiceNotes.set(id, newNote);
    return newNote;
  }

  async getVoiceNotes(userId: string, limit?: number): Promise<VoiceNote[]> {
    const notes = Array.from(this.voiceNotes.values())
      .filter(note => note.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? notes.slice(0, limit) : notes;
  }

  async updateVoiceNote(id: string, note: Partial<InsertVoiceNote>): Promise<VoiceNote | undefined> {
    const existing = this.voiceNotes.get(id);
    if (!existing) return undefined;

    const updated: VoiceNote = { ...existing, ...note };
    this.voiceNotes.set(id, updated);
    return updated;
  }

  async deleteVoiceNote(id: string): Promise<boolean> {
    return this.voiceNotes.delete(id);
  }

  // AI conversation methods
  async createAiConversation(userId: string, conversation: InsertAiConversation): Promise<AiConversation> {
    const id = randomUUID();
    const newConversation: AiConversation = {
      id,
      userId,
      title: conversation.title || null,
      messages: conversation.messages,
      type: conversation.type,
      isActive: conversation.isActive !== undefined ? conversation.isActive : true,
      lastMessageAt: conversation.lastMessageAt || new Date(),
      date: new Date()
    };
    this.aiConversations.set(id, newConversation);
    return newConversation;
  }

  async getAiConversations(userId: string, limit?: number): Promise<AiConversation[]> {
    const conversations = Array.from(this.aiConversations.values())
      .filter(conversation => conversation.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? conversations.slice(0, limit) : conversations;
  }

  async updateAiConversation(id: string, conversation: Partial<InsertAiConversation>): Promise<AiConversation | undefined> {
    const existing = this.aiConversations.get(id);
    if (!existing) return undefined;

    const updated: AiConversation = { ...existing, ...conversation };
    this.aiConversations.set(id, updated);
    return updated;
  }

  async deleteAiConversation(id: string): Promise<boolean> {
    return this.aiConversations.delete(id);
  }

  // Companion character methods
  async getCompanion(userId: string): Promise<Companion | undefined> {
    return Array.from(this.companions.values()).find(c => c.userId === userId);
  }

  async createCompanion(userId: string, companion: InsertCompanion): Promise<Companion> {
    const id = randomUUID();
    const newCompanion: Companion = {
      id,
      userId,
      name: companion.name || "Spark",
      stage: companion.stage || "seed",
      color: companion.color || "silver",
      accessories: companion.accessories || [],
      experience: companion.experience || 0,
      level: companion.level || 1,
      personality: companion.personality || null,
      lastInteraction: new Date(),
      createdAt: new Date()
    };
    this.companions.set(id, newCompanion);
    return newCompanion;
  }

  async updateCompanion(userId: string, companion: Partial<InsertCompanion>): Promise<Companion | undefined> {
    const existing = Array.from(this.companions.values()).find(c => c.userId === userId);
    if (!existing) return undefined;

    const updated: Companion = { 
      ...existing, 
      ...companion,
      lastInteraction: new Date()
    };
    this.companions.set(existing.id, updated);
    return updated;
  }

  // Quest methods
  async createQuest(userId: string, quest: InsertQuest): Promise<Quest> {
    const id = randomUUID();
    const newQuest: Quest = {
      id,
      userId,
      questId: quest.questId,
      title: quest.title,
      description: quest.description,
      type: quest.type,
      progress: quest.progress || 0,
      maxProgress: quest.maxProgress || 1,
      completed: quest.completed || false,
      completedAt: quest.completedAt || null,
      reward: quest.reward || null,
      questData: quest.questData || null,
      startedAt: new Date()
    };
    this.quests.set(id, newQuest);
    return newQuest;
  }

  async getQuests(userId: string, completed?: boolean): Promise<Quest[]> {
    const quests = Array.from(this.quests.values())
      .filter(quest => quest.userId === userId)
      .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    
    if (completed !== undefined) {
      return quests.filter(quest => quest.completed === completed);
    }
    return quests;
  }

  async updateQuest(id: string, quest: Partial<InsertQuest>): Promise<Quest | undefined> {
    const existing = this.quests.get(id);
    if (!existing) return undefined;

    const updated: Quest = { ...existing, ...quest };
    this.quests.set(id, updated);
    return updated;
  }

  async completeQuest(id: string, questData?: any): Promise<Quest | undefined> {
    const existing = this.quests.get(id);
    if (!existing) return undefined;

    const updated: Quest = { 
      ...existing, 
      completed: true,
      completedAt: new Date(),
      questData: questData || existing.questData
    };
    this.quests.set(id, updated);
    return updated;
  }

  // Kindness vault methods
  async createKindnessNote(userId: string, note: InsertKindnessNote): Promise<KindnessNote> {
    const id = randomUUID();
    const newNote: KindnessNote = {
      id,
      userId,
      content: note.content,
      type: note.type,
      isPrivate: note.isPrivate || true,
      glowIntensity: note.glowIntensity || 5,
      color: note.color || "gold",
      tags: note.tags || [],
      readCount: 0,
      lastRead: null,
      createdAt: new Date()
    };
    this.kindnessNotes.set(id, newNote);
    return newNote;
  }

  async getKindnessNotes(userId: string): Promise<KindnessNote[]> {
    return Array.from(this.kindnessNotes.values())
      .filter(note => note.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateKindnessNote(id: string, note: Partial<InsertKindnessNote>): Promise<KindnessNote | undefined> {
    const existing = this.kindnessNotes.get(id);
    if (!existing) return undefined;

    const updated: KindnessNote = { ...existing, ...note };
    this.kindnessNotes.set(id, updated);
    return updated;
  }

  async deleteKindnessNote(id: string): Promise<boolean> {
    return this.kindnessNotes.delete(id);
  }

  // Soundscape session methods
  async createSoundscapeSession(userId: string, session: InsertSoundscapeSession): Promise<SoundscapeSession> {
    const id = randomUUID();
    const newSession: SoundscapeSession = {
      id,
      userId,
      soundscape: session.soundscape,
      mood: session.mood || null,
      duration: session.duration || null,
      completedActivity: session.completedActivity || null,
      effectiveness: session.effectiveness || null,
      date: new Date()
    };
    this.soundscapeSessions.set(id, newSession);
    return newSession;
  }

  async getSoundscapeSessions(userId: string, limit?: number): Promise<SoundscapeSession[]> {
    const sessions = Array.from(this.soundscapeSessions.values())
      .filter(session => session.userId === userId)
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    return limit ? sessions.slice(0, limit) : sessions;
  }

  // Memory constellation methods
  async createMemoryNode(userId: string, node: InsertMemoryNode): Promise<MemoryNode> {
    const id = randomUUID();
    const newNode: MemoryNode = {
      id,
      userId,
      journalEntryId: node.journalEntryId || null,
      moodEntryId: node.moodEntryId || null,
      questId: node.questId || null,
      title: node.title,
      emotionalImpact: node.emotionalImpact,
      xPosition: node.xPosition || null,
      yPosition: node.yPosition || null,
      size: node.size || 3,
      color: node.color || "blue",
      connectedTo: node.connectedTo || [],
      createdAt: new Date()
    };
    this.memoryNodes.set(id, newNode);
    return newNode;
  }

  async getMemoryNodes(userId: string): Promise<MemoryNode[]> {
    return Array.from(this.memoryNodes.values())
      .filter(node => node.userId === userId)
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  async updateMemoryNode(id: string, node: Partial<InsertMemoryNode>): Promise<MemoryNode | undefined> {
    const existing = this.memoryNodes.get(id);
    if (!existing) return undefined;

    const updated: MemoryNode = { ...existing, ...node };
    this.memoryNodes.set(id, updated);
    return updated;
  }

  async deleteMemoryNode(id: string): Promise<boolean> {
    return this.memoryNodes.delete(id);
  }
}

export const storage = new MemStorage();
