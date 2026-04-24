import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Users, 
  PlusCircle, 
  Activity, 
  Calendar, 
  TrendingUp,
  Clock,
  Target,
  Award
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

interface DashboardStats {
  totalUsers: number;
  totalWorkouts: number;
  totalSessions: number;
  totalDepartments: number;
}

export function AdminDashboard() {
  const { data: user } = useGetIdentity<User>();
  const Link = useLink();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    totalWorkouts: 0,
    totalSessions: 0,
    totalDepartments: 0,
  });

  useEffect(() => {
    // In a real app, this would fetch from the API
    setStats({
      totalUsers: 150,
      totalWorkouts: 25,
      totalSessions: 45,
      totalDepartments: 5,
    });
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">
            Welcome back, {user?.name}. Manage your fitness center.
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild>
            <Link to="/users/create">
              <PlusCircle className="w-4 h-4 mr-2" />
              Create User
            </Link>
          </Button>
          <Button asChild variant="outline">
            <Link to="/workouts/create">
              <PlusCircle className="w-4 h-4 mr-2" />
              Add Workout
            </Link>
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUsers}</div>
            <p className="text-xs text-muted-foreground">
              +12% from last month
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Workouts</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalWorkouts}</div>
            <p className="text-xs text-muted-foreground">
              +3 new this week
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalSessions}</div>
            <p className="text-xs text-muted-foreground">
              8 scheduled today
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Departments</CardTitle>
            <Award className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDepartments}</div>
            <p className="text-xs text-muted-foreground">
              All active
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>
              Create and manage user accounts
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/users">
                <Users className="w-4 h-4 mr-2" />
                Manage Users
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/users/create">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create New User
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Workout Management</CardTitle>
            <CardDescription>
              Create and manage workout programs
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/workouts">
                <Activity className="w-4 h-4 mr-2" />
                View All Workouts
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full">
              <Link to="/workouts/create">
                <PlusCircle className="w-4 h-4 mr-2" />
                Create Workout
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Schedule Management</CardTitle>
            <CardDescription>
              Manage workout sessions and calendar
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full">
              <Link to="/sessions">
                <Calendar className="w-4 h-4 mr-2" />
                View Sessions
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
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Latest updates in your fitness center
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New user registration: John Doe</p>
                <p className="text-xs text-muted-foreground">2 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">New workout created: HIIT Training</p>
                <p className="text-xs text-muted-foreground">5 hours ago</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm font-medium">Session updated: Yoga Class</p>
                <p className="text-xs text-muted-foreground">1 day ago</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
