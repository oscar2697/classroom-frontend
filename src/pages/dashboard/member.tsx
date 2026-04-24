import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  Activity, 
  Calendar, 
  Target, 
  TrendingUp,
  Clock,
  Award,
  Users,
  Dumbbell,
  Lock
} from "lucide-react";
import { useLink } from "@refinedev/core";
import { useNavigate } from "react-router";
import { useGetIdentity } from "@refinedev/core";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface MemberStats {
  completedWorkouts: number;
  upcomingSessions: number;
  totalHours: number;
  achievements: number;
}

export function MemberDashboard() {
  const { data: user } = useGetIdentity<User>();
  const Link = useLink();
  const [stats, setStats] = useState<MemberStats>({
    completedWorkouts: 0,
    upcomingSessions: 0,
    totalHours: 0,
    achievements: 0,
  });

  useEffect(() => {
    // In a real app, this would fetch from the API
    setStats({
      completedWorkouts: 24,
      upcomingSessions: 3,
      totalHours: 36,
      achievements: 8,
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Member Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Track your fitness journey.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/workouts">
              <Activity className="w-4 h-4 mr-2" />
              Browse Workouts
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/calendar">
              <Calendar className="w-4 h-4 mr-2" />
              View Schedule
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed Workouts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.completedWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              +4 this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">
              Next 7 days
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Hours</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalHours}</div>
            <p className="text-xs text-muted-foreground">
              This month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Achievements</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.achievements}</div>
            <p className="text-xs text-muted-foreground">
              2 new this month
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Workout Programs</CardTitle>
            <CardDescription>
              Explore available workout programs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/workouts">
                <Activity className="w-4 h-4 mr-2" />
                Browse Workouts
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/my-workouts">
                <Target className="w-4 h-4 mr-2" />
                My Workouts
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/auth/change-password">
                <Lock className="w-4 h-4 mr-2" />
                Change Password
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class Schedule</CardTitle>
            <CardDescription>
              View and book workout sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/calendar">
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/sessions">
                <Clock className="w-4 h-4 mr-2" />
                My Sessions
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Progress Tracking</CardTitle>
            <CardDescription>
              Monitor your fitness progress
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/progress">
                <TrendingUp className="w-4 h-4 mr-2" />
                View Progress
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/achievements">
                <Award className="w-4 h-4 mr-2" />
                Achievements
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Upcoming Sessions */}
      <Card>
        <CardHeader>
          <CardTitle>Your Upcoming Sessions</CardTitle>
          <CardDescription>
            Your scheduled workout sessions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">HIIT Training</p>
                  <p className="text-xs text-muted-foreground">Tomorrow, 9:00 AM</p>
                  <p className="text-xs text-muted-foreground">with John Trainer</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Yoga Class</p>
                  <p className="text-xs text-muted-foreground">Friday, 2:00 PM</p>
                  <p className="text-xs text-muted-foreground">with Sarah Instructor</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Strength Training</p>
                  <p className="text-xs text-muted-foreground">Saturday, 4:00 PM</p>
                  <p className="text-xs text-muted-foreground">with Mike Coach</p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Achievements */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Achievements</CardTitle>
          <CardDescription>
            Your latest fitness accomplishments
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg">
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <Award className="w-6 h-6 text-yellow-600" />
              </div>
              <p className="text-sm font-medium text-center">First Workout</p>
              <p className="text-xs text-muted-foreground">Completed</p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <p className="text-sm font-medium text-center">10 Workouts</p>
              <p className="text-xs text-muted-foreground">Achieved</p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <p className="text-sm font-medium text-center">Consistency</p>
              <p className="text-xs text-muted-foreground">2 weeks</p>
            </div>
            <div className="flex flex-col items-center space-y-2 p-4 border rounded-lg">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Activity className="w-6 h-6 text-purple-600" />
              </div>
              <p className="text-sm font-medium text-center">Strength</p>
              <p className="text-xs text-muted-foreground">Level 2</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
