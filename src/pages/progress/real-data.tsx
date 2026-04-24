import { useState, useEffect } from "react";
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
import { useList } from "@refinedev/core";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface WorkoutSession {
  id: string;
  workoutId: string;
  workoutTitle: string;
  memberId: string;
  sessionDate: string;
  completed: boolean;
  duration: number;
  caloriesBurned: number;
}

interface Workout {
  id: string;
  title: string;
  type: string;
  duration: number;
  calories: number;
  createdAt: string;
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

export function RealProgressPage() {
  const { data: user } = useGetIdentity<User>();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  
  // Fetch real data from backend
  const { data: sessions, isLoading: sessionsLoading } = useList<WorkoutSession>({
    resource: 'member-workouts',
    filters: [
      {
        field: 'memberId',
        operator: 'eq',
        value: user?.id
      }
    ],
    sort: [
      {
        field: 'sessionDate',
        order: 'desc'
      }
    ]
  });

  const { data: workouts, isLoading: workoutsLoading } = useList<Workout>({
    resource: 'workouts',
    filters: user?.role === 'trainer' ? [
      {
        field: 'createdBy',
        operator: 'eq',
        value: user?.id
      }
    ] : undefined,
    sort: [
      {
        field: 'createdAt',
        order: 'desc'
      }
    ]
  });

  // Process data for charts
  const [progressData, setProgressData] = useState<ProgressData[]>([]);
  const [workoutTypes, setWorkoutTypes] = useState<any[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    if (sessions && workouts) {
      // Calculate weekly progress
      const weeklyData = calculateWeeklyProgress(sessions);
      setProgressData(weeklyData);

      // Calculate workout type distribution
      const typeDistribution = calculateWorkoutTypes(workouts);
      setWorkoutTypes(typeDistribution);

      // Calculate achievements based on completed sessions
      const userAchievements = calculateAchievements(sessions);
      setAchievements(userAchievements);
    }
  }, [sessions, workouts]);

  const calculateWeeklyProgress = (sessionData: WorkoutSession[]): ProgressData[] => {
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];
    return weeks.map((week, index) => {
      const weekSessions = sessionData.filter(session => {
        const sessionDate = new Date(session.sessionDate);
        const weekNumber = Math.floor((sessionDate.getDate() - 1) / 7) + 1;
        return weekNumber === index + 1 && session.completed;
      });
      
      return {
        week,
        workouts: weekSessions.length,
        hours: weekSessions.reduce((sum, session) => sum + (session.duration || 0), 0) / 60,
        calories: weekSessions.reduce((sum, session) => sum + (session.caloriesBurned || 0), 0)
      };
    });
  };

  const calculateWorkoutTypes = (workoutData: Workout[]) => {
    const totalWorkouts = workoutData.length;
    if (totalWorkouts === 0) return [];

    const typeCounts = workoutData.reduce((acc, workout) => {
      acc[workout.type] = (acc[workout.type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return Object.entries(typeCounts).map(([type, count]) => ({
      name: type,
      value: Math.round((count / totalWorkouts) * 100),
      color: getWorkoutTypeColor(type)
    }));
  };

  const calculateAchievements = (sessionData: WorkoutSession[]): Achievement[] => {
    const completedSessions = sessionData.filter(s => s.completed);
    const totalWorkouts = completedSessions.length;
    const totalHours = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0) / 60;
    const totalCalories = completedSessions.reduce((sum, s) => sum + (s.caloriesBurned || 0), 0);

    return [
      {
        id: "1",
        title: "First Workout",
        description: "Complete your first workout session",
        icon: "🏃",
        unlocked: totalWorkouts >= 1,
        date: totalWorkouts >= 1 ? completedSessions[0]?.sessionDate : undefined
      },
      {
        id: "2",
        title: "Consistency King",
        description: "Work out 3 times in one week",
        icon: "👑",
        unlocked: progressData.some(week => week.workouts >= 3),
        date: progressData.find(week => week.workouts >= 3) ? "This week" : undefined
      },
      {
        id: "3",
        title: "Calorie Crusher",
        description: "Burn 1000 calories in a single session",
        icon: "🔥",
        unlocked: completedSessions.some(s => s.caloriesBurned >= 1000),
        date: completedSessions.find(s => s.caloriesBurned >= 1000)?.sessionDate : undefined
      },
      {
        id: "4",
        title: "Month Master",
        description: "Complete 20 workouts in a month",
        icon: "📅",
        unlocked: totalWorkouts >= 20,
        date: totalWorkouts >= 20 ? "This month" : undefined
      },
      {
        id: "5",
        title: "Time Champion",
        description: "Complete 50 hours of workouts",
        icon: "⏰",
        unlocked: totalHours >= 50,
        date: totalHours >= 50 ? "Achieved" : undefined
      }
    ];
  };

  const getWorkoutTypeColor = (type: string) => {
    switch (type) {
      case "cardio":
        return "bg-red-500";
      case "strength":
        return "bg-blue-500";
      case "flexibility":
        return "bg-green-500";
      case "hiit":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const totalWorkouts = sessions?.filter(s => s.completed).length || 0;
  const totalHours = sessions?.filter(s => s.completed).reduce((sum, s) => sum + (s.duration || 0), 0) / 60 || 0;
  const totalCalories = sessions?.filter(s => s.completed).reduce((sum, s) => sum + (s.caloriesBurned || 0), 0) || 0;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const getProgressPercentage = (current: number, goal: number) => {
    return Math.min((current / goal) * 100, 100);
  };

  if (sessionsLoading || workoutsLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Progress Tracking</h1>
          <p className="text-muted-foreground">
            Real data from your workout sessions
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
              From {sessions?.length || 0} total sessions
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalHours.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">
              This month
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
              Total burned
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{unlockedAchievements}/{achievements.length}</div>
            <p className="text-xs text-muted-foreground">
              {Math.round((unlockedAchievements / achievements.length) * 100)}% unlocked
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Progress Charts */}
      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <LineChart className="w-5 h-5" />
              Weekly Progress
            </CardTitle>
            <CardDescription>
              Your workout activity over past 4 weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {progressData.map((week) => (
                <div key={week.week} className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="font-medium">{week.week}</span>
                    <span className="text-muted-foreground">
                      {week.workouts} workouts • {week.hours.toFixed(1)}h • {week.calories} cal
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

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PieChart className="w-5 h-5" />
              Workout Types
            </CardTitle>
            <CardDescription>
              Distribution of your workout types
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
                  Total workouts: {workouts?.length || 0}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5" />
            Achievements
          </CardTitle>
          <CardDescription>
            Your fitness accomplishments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {achievements.map((achievement) => (
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
