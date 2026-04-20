import { CreateButton } from "@/components/refine-ui/buttons/create"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { ListView } from "@/components/refine-ui/views/list-view"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useList } from '@refinedev/core'
import { useTable } from "@refinedev/react-table"
import { ColumnDef } from "@tanstack/react-table"
import { Search } from "lucide-react"
import { useMemo, useState } from "react"
import { WorkoutSession, User, Workout } from '@/types'

const WorkoutsSessionList = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedWorkout, setSelectedWorkout] = useState('all')
    const [selectedTrainer, setSelectedTrainer] = useState('all')

    const { query: workoutsQuery } = useList<Workout>({
        resource: 'workouts',
        pagination: {
            pageSize: 100
        }
    })

    const { query: trainersQuery } = useList<User>({
        resource: 'users',
        filters: [
            {
                field: 'role',
                operator: 'eq',
                value: 'trainer'
            }
        ],
        pagination: {
            pageSize: 100
        }
    })

    const workouts = workoutsQuery?.data || []
    const isLoadingWorkouts = workoutsQuery?.isLoading

    const trainers = trainersQuery?.data || []
    const isLoadingTrainers = trainersQuery?.isLoading

    const workoutFilters = selectedWorkout === 'all' ? [] : [
        {
            field: 'workouts' as const,
            operator: 'eq' as const,
            value: selectedWorkout
        }
    ]

    const trainerFilters = selectedTrainer === 'all' ? [] : [
        {
            field: 'trainer' as const,
            operator: 'eq' as const,
            value: selectedTrainer
        }
    ]

    const searchFilters = searchQuery ? [
        {
            field: 'name' as const,
            operator: 'contains' as const,
            value: searchQuery
        }
    ] : []

    const classColumns = useMemo<ColumnDef<WorkoutSession>[]>(() => [
        {
            id: 'bannerUrl',
            accessorKey: 'bannerUrl',
            size: 80,
            header: () => <p className="column-title ml-2">Banner</p>,
            cell: ({ getValue }) => (
                <div className="flex items-center justify-center ml-2">
                    <img
                        src={getValue<string>() || '/placeholder.class.png'}
                        alt="Class Banner"
                        className="w-10 h-10 rounded object-cover"
                    />
                </div>
            )
        },
        {
            id: 'name',
            accessorKey: 'name',
            size: 200,
            header: () => <p className="column-title ml-2">Session Name</p>,
            cell: ({ getValue }) => <span className="text-foreground font-medium">{getValue<string>()}</span>
        },
        {
            id: 'status',
            accessorKey: 'status',
            size: 100,
            header: () => <p className="column-title ml-2">Status</p>,
            cell: ({ getValue }) => {
                const status = getValue<string>()
                return (
                    <Badge variant={status === 'active' ? 'default' : 'secondary'}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                )
            }
        },
        {
            id: 'subject',
            accessorKey: 'workout.name',
            size: 150,
            header: () => <p className="column-title ml-2">Workout</p>,
            cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>
        },
        {
            id: 'teacher',
            accessorKey: 'trainer.name',
            size: 150,
            header: () => <p className="column-title ml-2">Trainer</p>,
            cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>
        },
        {
            id: 'capacity',
            accessorKey: 'capacity',
            size: 100,
            header: () => <p className="column-title ml-2">Capacity</p>,
            cell: ({ getValue }) => <span className="text-foreground">{getValue<number>()}</span>
        },
    ], [])

    const sessionsTable = useTable<WorkoutSession>({
        columns: classColumns,
        refineCoreProps: {
            resource: 'workouts-sessions',
            pagination: {
                pageSize: 10,
                mode: 'server'
            },
            filters: {
                permanent: [...workoutFilters, ...trainerFilters, ...searchFilters]
            },
            sorters: {
                initial: [
                    {
                        field: 'id',
                        order: 'desc'
                    }
                ]
            },
        }
    })

    return (
        <ListView>
            <Breadcrumb />

            <h1 className="page-title">Sessions</h1>

            <div className="intro-row">
                <p>Manage your workout classes and sessions</p>

                <div className="search-field">
                    <Search className='search-icon' />

                    <Input
                        type="text"
                        placeholder="Search classes..."
                        className="pl-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Select
                        value={selectedWorkout}
                        onValueChange={setSelectedWorkout}
                    >
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder='Filter by subject' />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">
                                All Workouts
                            </SelectItem>

                            {!isLoadingWorkouts && workouts.map(workout => (
                                <SelectItem
                                    key={workout.id}
                                    value={workout.name}
                                >
                                    {workout.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Select
                        value={selectedTrainer}
                        onValueChange={setSelectedTrainer}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder='Filter by trainer' />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">
                                All Trainers
                            </SelectItem>

                            {isLoadingTrainers && trainers.map(trainer => (
                                <SelectItem
                                    key={trainer.id}
                                    value={trainer.name}
                                >
                                    {trainer.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <CreateButton resource="workouts-sessions" />
                </div>
            </div>

            <DataTable
                table={sessionsTable}
            />
        </ListView>
    )
}

export default WorkoutsSessionList