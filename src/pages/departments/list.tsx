import { CreateButton } from "@/components/refine-ui/buttons/create"
import { DataTable } from "@/components/refine-ui/data-table/data-table"
import { Breadcrumb } from "@/components/refine-ui/layout/breadcrumb"
import { ListView } from "@/components/refine-ui/views/list-view"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { useTable } from "@refinedev/react-table"
import { ColumnDef } from "@tanstack/react-table"
import { Search, Building, Edit, Trash2 } from "lucide-react"
import { useMemo, useState } from "react"

interface Department {
  id: number
  code: string
  name: string
  description?: string
  createdAt: string
  updatedAt: string
}

const DepartmentsList = () => {
    const [searchQuery, setSearchQuery] = useState('')

    const searchFilters = searchQuery ? [
        {
            field: 'name',
            operator: 'contains' as const,
            value: searchQuery
        }
    ] : []

    const departmentsTable = useTable<Department>({
        columns: useMemo<ColumnDef<Department>[]>(() => [
            {
                id: 'code',
                accessorKey: 'code',
                size: 100,
                header: () => <p className="column-title ml-2">Code</p>,
                cell: ({ getValue }) => (
                    <Badge variant="secondary">{getValue<string>()}</Badge>
                ),
            },
            {
                id: 'name',
                accessorKey: 'name',
                size: 200,
                header: () => <p className="column-title ml-2">Name</p>,
                cell: ({ row }) => (
                    <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">{row.original.name}</span>
                    </div>
                ),
                filterFn: 'includesString'
            },
            {
                id: 'description',
                accessorKey: 'description',
                size: 300,
                header: () => <p className="column-title ml-2">Description</p>,
                cell: ({ getValue }) => (
                    <span className="text-gray-600 text-sm line-clamp-2">
                        {getValue<string>() || 'No description'}
                    </span>
                ),
            },
            {
                id: 'actions',
                header: () => <p className="column-title ml-2">Actions</p>,
                size: 120,
                cell: ({ row }) => (
                    <div className="flex gap-2">
                        <button
                            onClick={() => window.location.href = `/departments/edit/${row.original.id}`}
                            className="p-1 hover:bg-gray-100 rounded"
                        >
                            <Edit className="w-4 h-4" />
                        </button>
                        <button
                            onClick={() => {
                                if (confirm('Are you sure you want to delete this department?')) {
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
            resource: 'departments',
            pagination: {
                pageSize: 10,
                mode: 'server'
            },
            filters: {
                permanent: searchFilters
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

            <h1 className="page-title">Departments Management</h1>

            <div className="intro-row">
                <p>Manage departments and their workout programs</p>

                <div className="search-field">
                    <Search className='search-icon' />

                    <Input
                        type="text"
                        placeholder="Search departments..."
                        className="pl-10 w-full"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                <CreateButton />
            </div>

            <DataTable
                table={departmentsTable}
            />
        </ListView>
    )
}

export default DepartmentsList
