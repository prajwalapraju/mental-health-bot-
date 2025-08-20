import { sql } from "drizzle-orm";
import { pgTable, text, varchar, integer, timestamp, boolean, jsonb, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
});

export const moodEntries = pgTable("mood_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  mood: integer("mood").notNull(), // 1-5 scale
  notes: text("notes"),
  date: timestamp("date").notNull().defaultNow(),
});

export const journalEntries = pgTable("journal_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  emotions: text("emotions").array(), // Array of emotion tags
  date: timestamp("date").notNull().defaultNow(),
});

export const breathingSessions = pgTable("breathing_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  duration: integer("duration").notNull(), // in minutes
  completed: boolean("completed").notNull().default(false),
  date: timestamp("date").notNull().defaultNow(),
});

export const favoriteAffirmations = pgTable("favorite_affirmations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  affirmation: text("affirmation").notNull(),
  date: timestamp("date").notNull().defaultNow(),
});

export const hobbies = pgTable("hobbies", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  category: text("category").notNull(), // e.g., "creative", "physical", "intellectual", "social"
  frequency: text("frequency").notNull(), // e.g., "daily", "weekly", "monthly", "occasional"
  enjoymentLevel: integer("enjoyment_level").notNull(), // 1-5 scale
  lastPracticed: timestamp("last_practiced"),
  isActive: boolean("is_active").notNull().default(true),
  date: timestamp("date").notNull().defaultNow(),
});

export const hobbyEntries = pgTable("hobby_entries", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  hobbyId: varchar("hobby_id").notNull(),
  duration: integer("duration"), // in minutes
  notes: text("notes"),
  enjoymentLevel: integer("enjoyment_level").notNull(), // 1-5 scale for this session
  date: timestamp("date").notNull().defaultNow(),
});

export const voiceNotes = pgTable("voice_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title"),
  transcription: text("transcription"),
  duration: integer("duration"), // in seconds
  audioUrl: text("audio_url"), // Base64 or blob URL for stored audio
  emotions: text("emotions").array(), // Array of detected emotions
  aiSummary: text("ai_summary"), // AI-generated summary
  aiInsights: text("ai_insights"), // AI-generated insights
  isProcessed: boolean("is_processed").notNull().default(false),
  date: timestamp("date").notNull().defaultNow(),
});

export const aiConversations = pgTable("ai_conversations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  title: text("title"),
  messages: jsonb("messages").notNull(), // Array of {role: 'user'|'assistant', content: string, timestamp: string}
  type: text("type").notNull(), // 'wellness_check', 'mood_support', 'anxiety_help', 'general'
  isActive: boolean("is_active").notNull().default(true),
  lastMessageAt: timestamp("last_message_at").notNull().defaultNow(),
  date: timestamp("date").notNull().defaultNow(),
});

// Companion character table - evolving emotional companion
export const companions = pgTable("companions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: varchar("name", { length: 100 }).notNull().default("Spark"),
  stage: varchar("stage", { length: 50 }).notNull().default("seed"), // seed, sprout, bloom, radiant
  color: varchar("color", { length: 20 }).notNull().default("silver"),
  accessories: text("accessories").array().default(sql`ARRAY[]::text[]`), // wings, crown, aura, etc.
  experience: integer("experience").notNull().default(0),
  level: integer("level").notNull().default(1),
  personality: jsonb("personality"), // traits based on user's journey
  lastInteraction: timestamp("last_interaction").defaultNow(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Quests table - themed emotional growth challenges
export const quests = pgTable("quests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  questId: varchar("quest_id").notNull(), // predefined quest identifier
  title: varchar("title", { length: 255 }).notNull(),
  description: text("description").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // creative, reflection, empathy, etc.
  progress: integer("progress").notNull().default(0),
  maxProgress: integer("max_progress").notNull().default(1),
  completed: boolean("completed").notNull().default(false),
  completedAt: timestamp("completed_at"),
  reward: jsonb("reward"), // companion upgrades, new zones, etc.
  questData: jsonb("quest_data"), // user's creative input, drawings, etc.
  startedAt: timestamp("started_at").defaultNow().notNull(),
});

// Kindness vault - positive messages and self-compassion notes
export const kindnessNotes = pgTable("kindness_notes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  content: text("content").notNull(),
  type: varchar("type", { length: 50 }).notNull(), // self-kindness, future-self, affirmation
  isPrivate: boolean("is_private").notNull().default(true),
  glowIntensity: integer("glow_intensity").notNull().default(5), // 1-10 brightness
  color: varchar("color", { length: 20 }).notNull().default("gold"),
  tags: text("tags").array(),
  readCount: integer("read_count").notNull().default(0),
  lastRead: timestamp("last_read"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

// Soundscape preferences and sessions
export const soundscapeSessions = pgTable("soundscape_sessions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  soundscape: varchar("soundscape", { length: 100 }).notNull(), // rainforest, lofi, ocean, etc.
  mood: integer("mood"), // mood when started
  duration: integer("duration"), // in minutes
  completedActivity: varchar("completed_activity", { length: 100 }), // breathing, journaling, etc.
  effectiveness: integer("effectiveness"), // 1-5 rating
  date: timestamp("date").defaultNow().notNull(),
});

// Memory constellation - visual journal timeline
export const memoryNodes = pgTable("memory_nodes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  journalEntryId: varchar("journal_entry_id"),
  moodEntryId: varchar("mood_entry_id"),
  questId: varchar("quest_id"),
  title: varchar("title", { length: 255 }).notNull(),
  emotionalImpact: integer("emotional_impact").notNull(), // 1-10 for glow intensity
  xPosition: real("x_position"), // constellation coordinates
  yPosition: real("y_position"),
  size: integer("size").notNull().default(3), // 1-5 star size
  color: varchar("color", { length: 20 }).notNull().default("blue"),
  connectedTo: text("connected_to").array(), // IDs of connected memories
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
});

export const insertMoodEntrySchema = createInsertSchema(moodEntries).pick({
  mood: true,
  notes: true,
});

export const insertJournalEntrySchema = createInsertSchema(journalEntries).pick({
  content: true,
  emotions: true,
});

export const insertBreathingSessionSchema = createInsertSchema(breathingSessions).pick({
  duration: true,
  completed: true,
});

export const insertFavoriteAffirmationSchema = createInsertSchema(favoriteAffirmations).pick({
  affirmation: true,
});

export const insertHobbySchema = createInsertSchema(hobbies).pick({
  name: true,
  category: true,
  frequency: true,
  enjoymentLevel: true,
  lastPracticed: true,
  isActive: true,
});

export const insertHobbyEntrySchema = createInsertSchema(hobbyEntries).pick({
  hobbyId: true,
  duration: true,
  notes: true,
  enjoymentLevel: true,
});

export const insertVoiceNoteSchema = createInsertSchema(voiceNotes).pick({
  title: true,
  transcription: true,
  duration: true,
  audioUrl: true,
  emotions: true,
  aiSummary: true,
  aiInsights: true,
  isProcessed: true,
});

export const insertAiConversationSchema = createInsertSchema(aiConversations).pick({
  title: true,
  messages: true,
  type: true,
  isActive: true,
  lastMessageAt: true,
});

export const insertCompanionSchema = createInsertSchema(companions).pick({
  name: true,
  stage: true,
  color: true,
  accessories: true,
  experience: true,
  level: true,
  personality: true,
});

export const insertQuestSchema = createInsertSchema(quests).pick({
  questId: true,
  title: true,
  description: true,
  type: true,
  progress: true,
  maxProgress: true,
  completed: true,
  completedAt: true,
  reward: true,
  questData: true,
});

export const insertKindnessNoteSchema = createInsertSchema(kindnessNotes).pick({
  content: true,
  type: true,
  isPrivate: true,
  glowIntensity: true,
  color: true,
  tags: true,
});

export const insertSoundscapeSessionSchema = createInsertSchema(soundscapeSessions).pick({
  soundscape: true,
  mood: true,
  duration: true,
  completedActivity: true,
  effectiveness: true,
});

export const insertMemoryNodeSchema = createInsertSchema(memoryNodes).pick({
  journalEntryId: true,
  moodEntryId: true,
  questId: true,
  title: true,
  emotionalImpact: true,
  xPosition: true,
  yPosition: true,
  size: true,
  color: true,
  connectedTo: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type InsertMoodEntry = z.infer<typeof insertMoodEntrySchema>;
export type MoodEntry = typeof moodEntries.$inferSelect;
export type InsertJournalEntry = z.infer<typeof insertJournalEntrySchema>;
export type JournalEntry = typeof journalEntries.$inferSelect;
export type InsertBreathingSession = z.infer<typeof insertBreathingSessionSchema>;
export type BreathingSession = typeof breathingSessions.$inferSelect;
export type InsertFavoriteAffirmation = z.infer<typeof insertFavoriteAffirmationSchema>;
export type FavoriteAffirmation = typeof favoriteAffirmations.$inferSelect;
export type InsertHobby = z.infer<typeof insertHobbySchema>;
export type Hobby = typeof hobbies.$inferSelect;
export type InsertHobbyEntry = z.infer<typeof insertHobbyEntrySchema>;
export type HobbyEntry = typeof hobbyEntries.$inferSelect;
export type InsertVoiceNote = z.infer<typeof insertVoiceNoteSchema>;
export type VoiceNote = typeof voiceNotes.$inferSelect;
export type InsertAiConversation = z.infer<typeof insertAiConversationSchema>;
export type AiConversation = typeof aiConversations.$inferSelect;
export type InsertCompanion = z.infer<typeof insertCompanionSchema>;
export type Companion = typeof companions.$inferSelect;
export type InsertQuest = z.infer<typeof insertQuestSchema>;
export type Quest = typeof quests.$inferSelect;
export type InsertKindnessNote = z.infer<typeof insertKindnessNoteSchema>;
export type KindnessNote = typeof kindnessNotes.$inferSelect;
export type InsertSoundscapeSession = z.infer<typeof insertSoundscapeSessionSchema>;
export type SoundscapeSession = typeof soundscapeSessions.$inferSelect;
export type InsertMemoryNode = z.infer<typeof insertMemoryNodeSchema>;
export type MemoryNode = typeof memoryNodes.$inferSelect;
