import { CreateButton } from "@/components/refine-ui/buttons/create"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { ListView } from "@/components/refine-ui/views/list-view"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { User as UserType } from "@/types"
import { useTable } from "@refinedev/react-table"
import { ColumnDef } from "@tanstack/react-table"
import { Search, User as UserIcon, Edit, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"

interface User {
  id: string
  name: string
  email: string
  role: 'member' | 'trainer' | 'admin'
  emailVerified: boolean
  image?: string
  createdAt: string
  updatedAt: string
}

const UsersList = () => {
    const [searchQuery, setSearchQuery] = useState('')
    const [selectedRole, setSelectedRole] = useState('all')

    const roleFilters = selectedRole === 'all' ? [] : [
        {
            field: 'role',
            operator: 'eq' as const,
            value: selectedRole
        }
    ]

    const searchFilters = searchQuery ? [
        {
            field: 'name',
            operator: 'contains' as const,
            value: searchQuery
        }
    ] : []

    const usersTable = useTable<UserType>({
        columns: useMemo<ColumnDef<UserType>[]>(() => [
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className="column-title ml-2">Name</p>,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        {row.original.image ? (
                            <img 
                                src={row.original.image} 
                                alt={row.original.name}
                                className="w-8 h-8 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center">
                                <UserIcon className="w-4 h-4 text-gray-500" />
                            </div>
                        )}
                        <span className="font-medium">{row.original.name}</span>
                    </div>
                ),
                filterFn: 'includesString'
            },
            {
                id: 'email',
                accessorKey: 'email',
                size: 250,
                header: () => <p className="column-title ml-2">Email</p>,
                cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
            },
            {
                id: 'role',
                accessorKey: 'role',
                size: 120,
                header: () => <p className="column-title ml-2">Role</p>,
                cell: ({ getValue }) => {
                    const role = getValue<string>()
                    const roleColors = {
                        admin: 'bg-red-100 text-red-800',
                        trainer: 'bg-blue-100 text-blue-800',
                        member: 'bg-green-100 text-green-800',
                    }
                    return (
                        <Badge className={roleColors[role as keyof typeof roleColors]}>
                            {role}
                        </Badge>
                    )
                },
            },
            {
                id: 'emailVerified',
                accessorKey: 'emailVerified',
                size: 120,
                header: () => <p className="column-title ml-2">Status</p>,
                cell: ({ getValue }) => {
                    const verified = getValue<boolean>()
                    return (
                        <Badge variant={verified ? "default" : "secondary"}>
                            {verified ? 'Verified' : 'Pending'}
                        </Badge>
                    )
                },
            },
            {
                id: 'actions',
                header: () => <p className="column-title ml-2">Actions</p>,
                size: 120,
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.location.href = `/users/edit/${row.original.id}`}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this user?')) {
                                    // Delete logic here
                                }
                            }}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <Trash2 className="w-4 h-4" />
                        </button>
                    </div>
                ),
            },
        ], []),
        refineCoreProps: {
            resource: 'users',
            pagination: {
                pageSize: 10,
                mode: 'server'
            },
            filters: {
                permanent: [...roleFilters, ...searchFilters]
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

            <h1 className="page-title">Users Management</h1>

            <div className="intro-row">
                <p>Manage users, roles, and permissions</p>

                <div className="search-field">
                    <Search className='search-icon' />

                    <Input
                        type="text"
                        placeholder="Search users..."
                        className="pl-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <div className="flex gap-2 w-full sm:w-auto">
                    <Select
                        value={selectedRole}
                        onValueChange={setSelectedRole}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder='Filter by role' />
                        </SelectTrigger>

                        <SelectContent>
                            <SelectItem value="all">
                                All Roles
                            </SelectItem>
                            <SelectItem value="admin">
                                Admin
                            </SelectItem>
                            <SelectItem value="trainer">
                                Trainer
                            </SelectItem>
                            <SelectItem value="member">
                                Member
                            </SelectItem>
                        </SelectContent>
                    </Select>

                    <CreateButton />
                </div>
            </div>

            <DataTable
                table={usersTable}
            />
        </ListView>
    )
}

export default UsersList
