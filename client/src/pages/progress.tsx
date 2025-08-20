import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, Heart, Brain, Calendar } from "lucide-react";

export default function ProgressPage() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  const { data: moodEntries } = useQuery({
    queryKey: ["/api/mood"],
  });

  const { data: journalEntries } = useQuery({
    queryKey: ["/api/journal"],
  });

  const { data: breathingSessions } = useQuery({
    queryKey: ["/api/breathing"],
  });

  // Calculate progress percentages (out of 30 for monthly goals)
  const monthlyGoal = 30;
  const breathingProgress = ((stats?.breathingTotal || 0) / monthlyGoal) * 100;
  const journalProgress = ((stats?.journalTotal || 0) / monthlyGoal) * 100;
  const moodProgress = ((stats?.moodTotal || 0) / monthlyGoal) * 100;

  // Calculate achievements
  const achievements = [
    {
      id: 1,
      title: "First Steps",
      description: "Created your first journal entry",
      icon: "📝",
      unlocked: (stats?.journalTotal || 0) >= 1,
    },
    {
      id: 2,
      title: "Mindful Moment",
      description: "Completed your first breathing exercise",
      icon: "🧘‍♀️",
      unlocked: (stats?.breathingTotal || 0) >= 1,
    },
    {
      id: 3,
      title: "Mood Tracker",
      description: "Tracked your mood for the first time",
      icon: "😊",
      unlocked: (stats?.moodTotal || 0) >= 1,
    },
    {
      id: 4,
      title: "Consistent Care",
      description: "Maintained a 7-day streak",
      icon: "🔥",
      unlocked: (stats?.currentStreak || 0) >= 7,
    },
    {
      id: 5,
      title: "Two Week Warrior",
      description: "Maintained a 14-day streak",
      icon: "🏆",
      unlocked: (stats?.currentStreak || 0) >= 14,
    },
    {
      id: 6,
      title: "Journal Master",
      description: "Created 10 journal entries",
      icon: "📚",
      unlocked: (stats?.journalTotal || 0) >= 10,
    },
    {
      id: 7,
      title: "Breathing Expert",
      description: "Completed 15 breathing sessions",
      icon: "💨",
      unlocked: (stats?.breathingTotal || 0) >= 15,
    },
    {
      id: 8,
      title: "Monthly Champion",
      description: "Completed 30 activities this month",
      icon: "👑",
      unlocked: (stats?.totalSessions || 0) >= 30,
    },
  ];

  const unlockedAchievements = achievements.filter(achievement => achievement.unlocked);
  const recentlyUnlocked = unlockedAchievements.slice(-1)[0];

  return (
    <div className="container mx-auto px-4 py-6 max-w-6xl">
      <header className="mb-8 animate-fade-in">
        <h1 className="text-3xl font-display font-bold text-gray-800 mb-2">
          Your Progress
        </h1>
        <p className="text-gray-600">Track your mental health journey and celebrate your achievements</p>
      </header>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Stats Overview */}
        <div className="space-y-6">
          {/* Current Streak */}
          <Card className="animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-primary-600" />
                Current Streak
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-600 mb-2">
                  {stats?.currentStreak || 0}
                </div>
                <div className="text-gray-600">Days in a row</div>
                <div className="mt-4 text-sm text-gray-500">
                  Keep going! Consistency is key to building healthy habits.
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Monthly Progress */}
          <Card className="animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5 text-sage-600" />
                Monthly Goals
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Breathing Exercises</span>
                  <span>{stats?.breathingTotal || 0}/{monthlyGoal}</span>
                </div>
                <Progress value={breathingProgress} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Journal Entries</span>
                  <span>{stats?.journalTotal || 0}/{monthlyGoal}</span>
                </div>
                <Progress value={journalProgress} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between text-sm text-gray-600 mb-2">
                  <span>Mood Check-ins</span>
                  <span>{stats?.moodTotal || 0}/{monthlyGoal}</span>
                </div>
                <Progress value={moodProgress} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Recent Achievement */}
          {recentlyUnlocked && (
            <Card className="animate-fade-in bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-yellow-600" />
                  Recent Achievement
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="text-3xl">{recentlyUnlocked.icon}</div>
                  <div>
                    <div className="font-medium text-gray-800">
                      {recentlyUnlocked.title}
                    </div>
                    <div className="text-sm text-gray-600">
                      {recentlyUnlocked.description}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Achievements Grid */}
        <div className="space-y-6">
          <Card className="animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle className="flex items-center gap-2">
                <Heart className="w-5 h-5 text-coral-600" />
                All Achievements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-3">
                {achievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      achievement.unlocked
                        ? "bg-gradient-to-br from-primary-50 to-primary-100 border-primary-200 shadow-sm"
                        : "bg-gray-50 border-gray-200 opacity-60"
                    }`}
                  >
                    <div className="text-center">
                      <div className="text-2xl mb-2">{achievement.icon}</div>
                      <div className={`font-medium text-sm ${
                        achievement.unlocked ? "text-gray-800" : "text-gray-500"
                      }`}>
                        {achievement.title}
                      </div>
                      <div className={`text-xs mt-1 ${
                        achievement.unlocked ? "text-gray-600" : "text-gray-400"
                      }`}>
                        {achievement.description}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center text-sm text-gray-600">
                {unlockedAchievements.length} of {achievements.length} achievements unlocked
              </div>
            </CardContent>
          </Card>

          {/* Activity Summary */}
          <Card className="animate-fade-in">
            <CardHeader className="pb-4">
              <CardTitle>Activity Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-4 bg-primary-50 rounded-lg">
                  <div className="text-2xl font-bold text-primary-600">
                    {stats?.totalSessions || 0}
                  </div>
                  <div className="text-sm text-gray-600">Total Activities</div>
                </div>
                <div className="text-center p-4 bg-sage-50 rounded-lg">
                  <div className="text-2xl font-bold text-sage-600">
                    {Math.round(((stats?.totalSessions || 0) / 30) * 100)}%
                  </div>
                  <div className="text-sm text-gray-600">Monthly Goal</div>
                </div>
              </div>
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                Activities include mood tracking, journaling, and breathing exercises
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
