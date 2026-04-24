import { useGetIdentity } from "@refinedev/core";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export function usePermissions() {
  const { data: user } = useGetIdentity<User>();

  const hasRole = (role: string | string[]) => {
    if (!user?.role) return false;
    
    if (Array.isArray(role)) {
      return role.includes(user.role);
    }
    
    return user.role === role;
  };

  const isAdmin = () => hasRole('admin');
  const isTrainer = () => hasRole('trainer');
  const isMember = () => hasRole('member');

  const canManageUsers = () => isAdmin();
  const canManageDepartments = () => isAdmin();
  const canManageWorkouts = () => isAdmin() || isTrainer();
  const canManageSessions = () => isAdmin() || isTrainer();
  const canViewAllWorkouts = () => isAdmin() || isTrainer();
  const canViewAllSessions = () => isAdmin() || isTrainer();
  const canBookSessions = () => isMember();
  const canViewProgress = () => true; // All users can view their own progress

  const canEditUser = (targetUserId: string) => {
    if (!user?.role) return false;
    
    // Admins can edit everyone except themselves (to prevent accidental lockout)
    if (user.role === 'admin' && user.id !== targetUserId) {
      return true;
    }
    
    // Users can edit their own profile
    if (user.id === targetUserId) {
      return true;
    }
    
    return false;
  };

  const canDeleteUser = (targetUserId: string, targetUserRole: string) => {
    if (!user?.role) return false;
    
    // Admins can delete non-admin users, but not themselves
    if (user.role === 'admin' && targetUserRole !== 'admin' && user.id !== targetUserId) {
      return true;
    }
    
    return false;
  };

  const canEditWorkout = (workoutCreatorId?: string) => {
    if (!user?.role) return false;
    
    // Admins can edit all workouts
    if (user.role === 'admin') return true;
    
    // Trainers can edit their own workouts
    if (user.role === 'trainer' && workoutCreatorId === user.id) return true;
    
    return false;
  };

  const canDeleteWorkout = (workoutCreatorId?: string) => {
    // Same logic as editing for now
    return canEditWorkout(workoutCreatorId);
  };

  const canEditSession = (sessionTrainerId?: string) => {
    if (!user?.role) return false;
    
    // Admins can edit all sessions
    if (user.role === 'admin') return true;
    
    // Trainers can edit their own sessions
    if (user.role === 'trainer' && sessionTrainerId === user.id) return true;
    
    return false;
  };

  const canDeleteSession = (sessionTrainerId?: string) => {
    // Same logic as editing for now
    return canEditSession(sessionTrainerId);
  };

  const canEditDepartment = () => {
    return isAdmin();
  };

  const canDeleteDepartment = () => {
    return isAdmin();
  };

  return {
    user,
    hasRole,
    isAdmin,
    isTrainer,
    isMember,
    canManageUsers,
    canManageDepartments,
    canManageWorkouts,
    canManageSessions,
    canViewAllWorkouts,
    canViewAllSessions,
    canBookSessions,
    canViewProgress,
    canEditUser,
    canDeleteUser,
    canEditWorkout,
    canDeleteWorkout,
    canEditSession,
    canDeleteSession,
    canEditDepartment,
    canDeleteDepartment,
  };
}
