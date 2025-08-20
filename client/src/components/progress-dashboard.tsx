import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Trophy, TrendingUp } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function ProgressDashboard() {
  const { data: stats } = useQuery({
    queryKey: ["/api/stats"],
  });

  // Calculate progress percentages (out of 30 for monthly goals)
  const monthlyGoal = 30;
  const breathingProgress = ((stats?.breathingTotal || 0) / monthlyGoal) * 100;
  const journalProgress = ((stats?.journalTotal || 0) / monthlyGoal) * 100;
  const moodProgress = ((stats?.moodTotal || 0) / monthlyGoal) * 100;

  // Check for recent achievement
  const hasRecentAchievement = (stats?.currentStreak || 0) >= 14;

  return (
    <Card className="animate-fade-in">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-display">Your Progress</CardTitle>
          <Link href="/progress">
            <Button variant="ghost" size="sm" className="text-primary-600 hover:text-primary-700">
              <TrendingUp className="w-4 h-4 mr-1" />
              View All
            </Button>
          </Link>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Current Stats */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-4 bg-primary-50 rounded-lg">
            <div className="text-2xl font-bold text-primary-600">
              {stats?.currentStreak || 0}
            </div>
            <div className="text-sm text-gray-600">Day Streak</div>
          </div>
          <div className="text-center p-4 bg-sage-50 rounded-lg">
            <div className="text-2xl font-bold text-sage-600">
              {stats?.totalSessions || 0}
            </div>
            <div className="text-sm text-gray-600">Total Sessions</div>
          </div>
        </div>

        {/* Progress Bars */}
        <div className="space-y-4">
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
        </div>

        {/* Achievement */}
        {hasRecentAchievement && (
          <div className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg border border-yellow-200">
            <div className="flex items-center">
              <Trophy className="w-5 h-5 text-yellow-600 mr-3" />
              <div>
                <div className="font-medium text-gray-800">Achievement Unlocked!</div>
                <div className="text-sm text-gray-600">Two weeks of consistent check-ins</div>
              </div>
            </div>
          </div>
        )}

        {/* Encouragement */}
        {!hasRecentAchievement && (stats?.currentStreak || 0) > 0 && (
          <div className="p-4 bg-primary-50 rounded-lg border border-primary-200">
            <div className="text-center">
              <div className="font-medium text-gray-800 mb-1">Keep it up!</div>
              <div className="text-sm text-gray-600">
                You're on a {stats?.currentStreak}-day streak. 
                {stats?.currentStreak < 7 && " Reach 7 days for your next achievement!"}
                {stats?.currentStreak >= 7 && stats?.currentStreak < 14 && " Just 7 more days for a major milestone!"}
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
