
import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useList, useCustom } from '@refinedev/core'
import { Users, Building, Dumbbell, Calendar, TrendingUp, Activity } from 'lucide-react'
import { useMemo, useState } from 'react'

interface DashboardStats {
  totalUsers: number
  totalDepartments: number
  totalWorkouts: number
  totalSessions: number
  activeSessions: number
  totalEnrollments: number
}

interface User {
  id: string
  role: 'member' | 'trainer' | 'admin'
}

interface WorkoutSession {
  id: number
  status: 'active' | 'inactive' | 'archived'
  capacity: number
}

interface MemberWorkout {
  id: number
}

const Dashboard = () => {
    const [timeRange, setTimeRange] = useState('7d')

    // Fetch basic counts
    const { data: usersData } = useList<User>({
        resource: 'users',
        pagination: { pageSize: 1 }
    })

    const { data: departmentsData } = useList({
        resource: 'departments',
        pagination: { pageSize: 1 }
    })

    const { data: workoutsData } = useList({
        resource: 'workouts',
        pagination: { pageSize: 1 }
    })

    const { data: sessionsData } = useList<WorkoutSession>({
        resource: 'workouts-sessions',
        pagination: { pageSize: 100 }
    })

    const { data: enrollmentsData } = useList<MemberWorkout>({
        resource: 'member-workouts',
        pagination: { pageSize: 1 }
    })

    // Calculate stats
    const stats = useMemo<DashboardStats>(() => {
        const users = usersData?.data || []
        const departments = departmentsData?.data || []
        const workouts = workoutsData?.data || []
        const sessions = sessionsData?.data || []
        const enrollments = enrollmentsData?.data || []

        return {
            totalUsers: users.length,
            totalDepartments: departments.length,
            totalWorkouts: workouts.length,
            totalSessions: sessions.length,
            activeSessions: sessions.filter(s => s.status === 'active').length,
            totalEnrollments: enrollments.length,
        }
    }, [usersData, departmentsData, workoutsData, sessionsData, enrollmentsData])

    // Calculate role distribution
    const roleDistribution = useMemo(() => {
        const users = usersData?.data || []
        return {
            admin: users.filter(u => u.role === 'admin').length,
            trainer: users.filter(u => u.role === 'trainer').length,
            member: users.filter(u => u.role === 'member').length,
        }
    }, [usersData])

    // Calculate capacity utilization
    const capacityStats = useMemo(() => {
        const sessions = sessionsData?.data || []
        const totalCapacity = sessions.reduce((sum, s) => sum + s.capacity, 0)
        const activeCapacity = sessions
            .filter(s => s.status === 'active')
            .reduce((sum, s) => sum + s.capacity, 0)
        
        return {
            totalCapacity,
            activeCapacity,
            utilization: totalCapacity > 0 ? Math.round((activeCapacity / totalCapacity) * 100) : 0
        }
    }, [sessionsData])

    const statCards = [
        {
            title: 'Total Users',
            value: stats.totalUsers,
            icon: Users,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            title: 'Departments',
            value: stats.totalDepartments,
            icon: Building,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            title: 'Workouts',
            value: stats.totalWorkouts,
            icon: Dumbbell,
            color: 'text-purple-600',
            bgColor: 'bg-purple-50'
        },
        {
            title: 'Active Sessions',
            value: stats.activeSessions,
            icon: Calendar,
            color: 'text-orange-600',
            bgColor: 'bg-orange-50'
        },
    ]

    return (
        <div className="space-y-6">
            <Breadcrumb />

            <div>
                <h1 className="text-3xl font-bold">Dashboard</h1>
                <p className="text-gray-600 mt-2">Overview of your workout management system</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {statCards.map((stat, index) => (
                    <Card key={index}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                                    <p className="text-2xl font-bold">{stat.value}</p>
                                </div>
                                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* User Role Distribution */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            User Distribution
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Admins</span>
                                <span className="text-sm text-gray-600">{roleDistribution.admin}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-red-600 h-2 rounded-full" 
                                    style={{ width: `${stats.totalUsers > 0 ? (roleDistribution.admin / stats.totalUsers) * 100 : 0}%` }}
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Trainers</span>
                                <span className="text-sm text-gray-600">{roleDistribution.trainer}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-blue-600 h-2 rounded-full" 
                                    style={{ width: `${stats.totalUsers > 0 ? (roleDistribution.trainer / stats.totalUsers) * 100 : 0}%` }}
                                />
                            </div>

                            <div className="flex justify-between items-center">
                                <span className="text-sm font-medium">Members</span>
                                <span className="text-sm text-gray-600">{roleDistribution.member}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                                <div 
                                    className="bg-green-600 h-2 rounded-full" 
                                    style={{ width: `${stats.totalUsers > 0 ? (roleDistribution.member / stats.totalUsers) * 100 : 0}%` }}
                                />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                {/* Session Capacity */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <Activity className="w-5 h-5" />
                            Session Capacity
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-blue-600">{capacityStats.utilization}%</p>
                                <p className="text-sm text-gray-600">Capacity Utilization</p>
                            </div>
                            <Separator />
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600">Total Capacity</p>
                                    <p className="text-lg font-semibold">{capacityStats.totalCapacity}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600">Active Capacity</p>
                                    <p className="text-lg font-semibold">{capacityStats.activeCapacity}</p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Activity Feed */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        System Overview
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="text-center">
                            <p className="text-2xl font-bold text-green-600">{stats.totalSessions}</p>
                            <p className="text-sm text-gray-600">Total Sessions</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-blue-600">{stats.activeSessions}</p>
                            <p className="text-sm text-gray-600">Active Sessions</p>
                        </div>
                        <div className="text-center">
                            <p className="text-2xl font-bold text-purple-600">{stats.totalEnrollments}</p>
                            <p className="text-sm text-gray-600">Total Enrollments</p>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}

export default Dashboard
