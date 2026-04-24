import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar, TrendingUp, PlusCircle, Activity, Users, Clock, Lock } from "lucide-react";
import { useLink } from "@refinedev/core";
import { useGetIdentity } from "@refinedev/core";
import { useState, useEffect } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface TrainerStats {
  myWorkouts: number;
  mySessions: number;
  totalMembers: number;
  upcomingSessions: number;
}

export function TrainerDashboard() {
  const { data: user } = useGetIdentity<User>();
  const Link = useLink();
  const [stats, setStats] = useState<TrainerStats>({
    myWorkouts: 0,
    mySessions: 0,
    totalMembers: 0,
    upcomingSessions: 0,
  });

  useEffect(() => {
    // In a real app, this would fetch from the API
    setStats({
      myWorkouts: 8,
      mySessions: 15,
      totalMembers: 45,
      upcomingSessions: 3,
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Trainer Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Manage your workouts and sessions.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/workouts/create">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create Workout
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/sessions/create">
              <Calendar className="w-4 h-4 mr-2" />
              Schedule Session
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Workouts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.myWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              +2 new this month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">My Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.mySessions}</div>
            <p className="text-xs text-muted-foreground">
              3 scheduled today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalMembers}</div>
            <p className="text-xs text-muted-foreground">
              In your programs
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.upcomingSessions}</div>
            <p className="text-xs text-muted-foreground">
              Next 24 hours
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Workout Management</CardTitle>
            <CardDescription>
              Create and manage your workout programs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/workouts">
                <Activity className="w-4 h-4 mr-2" />
                My Workouts
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/workouts/create">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Workout
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
            <CardTitle>Session Schedule</CardTitle>
            <CardDescription>
              Manage your training sessions
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/sessions">
                <Calendar className="w-4 h-4 mr-2" />
                My Sessions
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/calendar">
                <Calendar className="w-4 h-4 mr-2" />
                View Calendar
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>My Performance</CardTitle>
            <CardDescription>
              Track your training statistics and achievements
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/progress">
                <TrendingUp className="w-4 h-4 mr-2" />
                View My Progress
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/calendar">
                <Calendar className="w-4 h-4 mr-2" />
                View Schedule
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Today's Schedule */}
      <Card>
        <CardHeader>
          <CardTitle>Today's Schedule</CardTitle>
          <CardDescription>
            Your upcoming sessions for today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">HIIT Training</p>
                  <p className="text-xs text-muted-foreground">9:00 AM - 10:00 AM</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                12 members
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Yoga Class</p>
                  <p className="text-xs text-muted-foreground">2:00 PM - 3:30 PM</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                8 members
              </div>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center space-x-4">
                <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-medium">Strength Training</p>
                  <p className="text-xs text-muted-foreground">4:00 PM - 5:00 PM</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                6 members
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
