import { useGetIdentity } from "@refinedev/core";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function DebugAuth() {
  const { data: user, isLoading, error } = useGetIdentity<User>();

  return (
    <Card className="m-4">
      <CardHeader>
        <CardTitle>Authentication Debug</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <strong>Loading:</strong> {isLoading ? "Yes" : "No"}
          </div>
          <div>
            <strong>Error:</strong> {error ? JSON.stringify(error) : "None"}
          </div>
          <div>
            <strong>User Data:</strong>
            <pre className="bg-gray-100 p-2 rounded text-sm overflow-auto">
              {user ? JSON.stringify(user, null, 2) : "No user data"}
            </pre>
          </div>
          <div>
            <strong>Role:</strong> {user?.role || "No role found"}
          </div>
          <div>
            <strong>Name:</strong> {user?.name || "No name found"}
          </div>
          <div>
            <strong>Email:</strong> {user?.email || "No email found"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
