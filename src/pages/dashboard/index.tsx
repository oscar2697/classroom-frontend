import { useGetIdentity } from "@refinedev/core";
import { AdminDashboard } from "./admin";
import { TrainerDashboard } from "./trainer";
import { MemberDashboard } from "./member";
import { DebugAuth } from "../../components/debug-auth";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function Dashboard() {
  const { data: user, isLoading } = useGetIdentity<User>();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-2">User not found</h2>
          <p className="text-muted-foreground">Please log in to view your dashboard.</p>
        </div>
      </div>
    );
  }

  // Render dashboard based on user role
  if (!user?.role) {
    return (
      <div className="space-y-6">
        <DebugAuth />
        <div className="flex items-center justify-center h-96">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">User role not found</h2>
            <p className="text-muted-foreground">User data is loading or incomplete.</p>
          </div>
        </div>
      </div>
    );
  }

  switch (user.role) {
    case "admin":
      return (
        <div className="space-y-6">
          <DebugAuth />
          <AdminDashboard />
        </div>
      );
    case "trainer":
      return (
        <div className="space-y-6">
          <DebugAuth />
          <TrainerDashboard />
        </div>
      );
    case "member":
      return (
        <div className="space-y-6">
          <DebugAuth />
          <MemberDashboard />
        </div>
      );
    default:
      return (
        <div className="space-y-6">
          <DebugAuth />
          <div className="flex items-center justify-center h-96">
            <div className="text-center">
              <h2 className="text-2xl font-bold mb-2">Role not recognized</h2>
              <p className="text-muted-foreground">Your role ({user.role}) is not configured for dashboard access.</p>
            </div>
          </div>
        </div>
      );
  }
}
