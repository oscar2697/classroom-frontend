import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  TrendingUp, 
  Activity, 
  Target, 
  Calendar, 
  Award, 
  Clock,
  Users,
  BarChart3,
  PieChart,
  LineChart
} from "lucide-react";
import { useGetIdentity } from "@refinedev/core";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface ProgressData {
  week: string;
  workouts: number;
  hours: number;
  calories: number;
}

interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  date?: string;
}

// Mock data for demonstration
const mockProgressData: ProgressData[] = [
  { week: "Week 1", workouts: 3, hours: 4.5, calories: 1200 },
  { week: "Week 2", workouts: 4, hours: 6, calories: 1600 },
  { week: "Week 3", workouts: 3, hours: 5, calories: 1400 },
  { week: "Week 4", workouts: 5, hours: 7.5, calories: 2000 },
];

const mockAchievements: Achievement[] = [
  {
    id: "1",
    title: "First Workout",
    description: "Complete your first workout session",
    icon: "🏃",
    unlocked: true,
    date: "2024-01-01"
  },
  {
    id: "2",
    title: "Consistency King",
    description: "Work out 3 times in one week",
    icon: "👑",
    unlocked: true,
    date: "2024-01-08"
  },
  {
    id: "3",
    title: "Calorie Crusher",
    description: "Burn 1000 calories in a single session",
    icon: "🔥",
    unlocked: true,
    date: "2024-01-15"
  },
  {
    id: "4",
    title: "Month Master",
    description: "Complete 20 workouts in a month",
    icon: "📅",
    unlocked: false
  },
  {
    id: "5",
    title: "Strength Hero",
    description: "Lift total of 10,000 lbs",
    icon: "💪",
    unlocked: false
  }
];

const workoutTypes = [
  { name: "Cardio", value: 45, color: "bg-red-500" },
  { name: "Strength", value: 30, color: "bg-blue-500" },
  { name: "Flexibility", value: 15, color: "bg-green-500" },
  { name: "HIIT", value: 10, color: "bg-purple-500" }
];

export function ProgressPage() {
  const { data: user } = useGetIdentity<User>();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const totalWorkouts = mockProgressData.reduce((sum, week) => sum + week.workouts, 0);
  const totalHours = mockProgressData.reduce((sum, week) => sum + week.hours, 0);
  const totalCalories = mockProgressData.reduce((sum, week) => sum + week.calories, 0);
  const unlockedAchievements = mockAchievements.filter(a => a.unlocked).length;

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Progress Tracking</h1>
          <p className="text-muted-foreground">
            Monitor your fitness journey and achievements
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant={selectedPeriod === 'week' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('week')}
          >
            Week
          </Button>
          <Button
            variant={selectedPeriod === 'month' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('month')}
          >
            Month
          </Button>
          <Button
            variant={selectedPeriod === 'year' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedPeriod('year')}
          >
            Year
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Workouts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              +20% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours}</div>
            <p className="text-xs text-muted-foreground">
              +15% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Calories Burned</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCalories.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              +25% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unlockedAchievements}/{mockAchievements.length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((unlockedAchievements / mockAchievements.length) * 100)}% unlocked
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Weekly Progress Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Weekly Progress
            </CardTitle>
            <CardDescription>
              Your workout activity over the past 4 weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockProgressData.map((week, index) => (
                <div key={week.week} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{week.week}</span>
                    <span className="text-muted-foreground">
                      {week.workouts} workouts • {week.hours}h • {week.calories} cal
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Workouts</div>
                      <Progress value={getProgressPercentage(week.workouts, 5)} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Hours</div>
                      <Progress value={getProgressPercentage(week.hours, 8)} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-muted-foreground">Calories</div>
                      <Progress value={getProgressPercentage(week.calories, 2000)} className="h-2" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Workout Types Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Workout Types
            </CardTitle>
            <CardDescription>
              Distribution of your workout types this month
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {workoutTypes.map((type) => (
                <div key={type.name} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{type.name}</span>
                    <span className="text-muted-foreground">{type.value}%</span>
                  </div>
                  <Progress value={type.value} className="h-2" />
                </div>
              ))}
              <div className="pt-4 border-t">
                <div className="text-sm text-muted-foreground">
                  Total workouts: {totalWorkouts}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Goals Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Monthly Goals
          </CardTitle>
          <CardDescription>
            Track your progress towards your fitness goals
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Workout Sessions</span>
                  <span className="text-muted-foreground">15/20</span>
                </div>
                <Progress value={75} className="h-3" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Training Hours</span>
                  <span className="text-muted-foreground">23/30</span>
                </div>
                <Progress value={77} className="h-3" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Calories Burned</span>
                  <span className="text-muted-foreground">6,200/8,000</span>
                </div>
                <Progress value={78} className="h-3" />
              </div>
            </div>
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Strength Training</span>
                  <span className="text-muted-foreground">8/10</span>
                </div>
                <Progress value={80} className="h-3" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Cardio Sessions</span>
                  <span className="text-muted-foreground">12/15</span>
                </div>
                <Progress value={80} className="h-3" />
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">Flexibility Training</span>
                  <span className="text-muted-foreground">4/5</span>
                </div>
                <Progress value={80} className="h-3" />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </CardTitle>
          <CardDescription>
            Your fitness achievements and milestones
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockAchievements.map((achievement) => (
              <div
                key={achievement.id}
                className={`
                  border rounded-lg p-4 text-center
                  ${achievement.unlocked 
                    ? 'bg-linear-to-r from-blue-50 to-purple-50 border-blue-200' 
                    : 'bg-gray-50 border-gray-200 opacity-60'
                  }
                `}
              >
                <div className="text-3xl mb-2">{achievement.icon}</div>
                <h3 className="font-medium mb-1">{achievement.title}</h3>
                <p className="text-sm text-muted-foreground mb-2">{achievement.description}</p>
                {achievement.unlocked ? (
                  <Badge variant="secondary" className="text-xs">
                    <Award className="w-3 h-3 mr-1" />
                    Unlocked {achievement.date}
                  </Badge>
                ) : (
                  <Badge variant="outline" className="text-xs">
                    Locked
                  </Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
