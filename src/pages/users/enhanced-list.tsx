import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { 
  Search, 
  Plus, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  User,
  Mail,
  Shield,
  Users
} from "lucide-react";
import { useLink } from "@refinedev/core";
import { useGetIdentity } from "@refinedev/core";
import { useTable } from "@refinedev/core";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  createdAt: string;
  lastLogin?: string;
  status: 'active' | 'inactive';
}

// Mock data for demonstration
const mockUsers: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "member",
    createdAt: "2024-01-01",
    lastLogin: "2024-01-15",
    status: "active"
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "trainer",
    createdAt: "2024-01-02",
    lastLogin: "2024-01-14",
    status: "active"
  },
  {
    id: "3",
    name: "Admin User",
    email: "admin@example.com",
    role: "admin",
    createdAt: "2024-01-01",
    lastLogin: "2024-01-15",
    status: "active"
  },
  {
    id: "4",
    name: "Mike Johnson",
    email: "mike@example.com",
    role: "member",
    createdAt: "2024-01-03",
    lastLogin: "2024-01-10",
    status: "inactive"
  }
];

const getRoleBadgeVariant = (role: string) => {
  switch (role) {
    case "admin":
      return "destructive";
    case "trainer":
      return "default";
    case "member":
      return "secondary";
    default:
      return "outline";
  }
};

const getStatusBadgeVariant = (status: string) => {
  return status === "active" ? "default" : "secondary";
};

export function EnhancedUserList() {
  const { data: currentUser } = useGetIdentity<User>();
  const Link = useLink();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState<string>("all");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  // Filter users based on search and role
  const filteredUsers = mockUsers.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = selectedRole === "all" || user.role === selectedRole;
    return matchesSearch && matchesRole;
  });

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    // In a real app, this would call the API
    console.log("Deleting user:", userToDelete?.id);
    setDeleteDialogOpen(false);
    setUserToDelete(null);
  };

  const canEditUser = (user: User) => {
    // Admins can edit everyone, but users can't edit themselves to prevent accidental lockout
    return currentUser?.role === "admin" && currentUser.id !== user.id;
  };

  const canDeleteUser = (user: User) => {
    // Admins can delete non-admin users, but not themselves
    return currentUser?.role === "admin" && 
           user.role !== "admin" && 
           currentUser.id !== user.id;
  };

  const roleCounts = {
    total: mockUsers.length,
    admin: mockUsers.filter(u => u.role === "admin").length,
    trainer: mockUsers.filter(u => u.role === "trainer").length,
    member: mockUsers.filter(u => u.role === "member").length,
    active: mockUsers.filter(u => u.status === "active").length,
    inactive: mockUsers.filter(u => u.status === "inactive").length,
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
          <p className="text-muted-foreground">
            Manage users, roles, and permissions
          </p>
        </div>
        <Button asChild>
          <Link to="/users/create">
            <Plus className="w-4 h-4 mr-2" />
            Create User
          </Link>
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.total}</div>
            <p className="text-xs text-muted-foreground">
              {roleCounts.active} active
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Admins</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.admin}</div>
            <p className="text-xs text-muted-foreground">
              Full access
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Trainers</CardTitle>
            <User className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.trainer}</div>
            <p className="text-xs text-muted-foreground">
              Can manage workouts
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Members</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{roleCounts.member}</div>
            <p className="text-xs text-muted-foreground">
              Regular users
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search users..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                variant={selectedRole === "all" ? "default" : "outline"}
                onClick={() => setSelectedRole("all")}
              >
                All ({roleCounts.total})
              </Button>
              <Button
                variant={selectedRole === "admin" ? "default" : "outline"}
                onClick={() => setSelectedRole("admin")}
              >
                Admins ({roleCounts.admin})
              </Button>
              <Button
                variant={selectedRole === "trainer" ? "default" : "outline"}
                onClick={() => setSelectedRole("trainer")}
              >
                Trainers ({roleCounts.trainer})
              </Button>
              <Button
                variant={selectedRole === "member" ? "default" : "outline"}
                onClick={() => setSelectedRole("member")}
              >
                Members ({roleCounts.member})
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Users ({filteredUsers.length})</CardTitle>
          <CardDescription>
            Manage user accounts and permissions
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead>Last Login</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{user.name}</div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          <Mail className="w-3 h-3 mr-1" />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getRoleBadgeVariant(user.role)}>
                      {user.role}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusBadgeVariant(user.status)}>
                      {user.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-sm">
                    {new Date(user.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-sm">
                    {user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : "Never"}
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem
                          onClick={() => console.log("View user:", user.id)}
                        >
                          View details
                        </DropdownMenuItem>
                        {canEditUser(user) && (
                          <DropdownMenuItem
                            onClick={() => window.location.href = `/users/edit/${user.id}`}
                          >
                            <Edit className="mr-2 h-4 w-4" />
                            Edit user
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuSeparator />
                        {canDeleteUser(user) && (
                          <DropdownMenuItem
                            onClick={() => handleDeleteUser(user)}
                            className="text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete user
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Are you sure?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the user account
              for "{userToDelete?.name}" and remove all their data from the system.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete}>
              Delete User
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
