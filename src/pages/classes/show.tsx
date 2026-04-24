import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { WorkoutSession, User } from "@/types"
import { useShow, useList, useCustom } from "@refinedev/core"
import { AdvancedImage } from "@cloudinary/react"
import { bannerPhoto } from "@/lib/cloudinary"
import { Users, UserPlus, UserMinus, Search, AlertTriangle } from "lucide-react"
import { useState } from "react"

const Show = () => {
    const { query } = useShow<WorkoutSession>({ resource: 'workouts-sessions' })
    const workoutsDetails = query.data?.data
    const { isLoading, isError } = query
    const [searchQuery, setSearchQuery] = useState('')
    const [inviteCode, setInviteCode] = useState('')

    // Fetch enrolled members for this session
    const enrolledMembersQuery = useList({
        resource: 'member-workouts',
        filters: [{
            field: 'workoutSessionId',
            operator: 'eq',
            value: workoutsDetails?.id
        }],
        pagination: { pageSize: 100 }
    })

    // Fetch available members (not enrolled)
    const availableMembersQuery = useList({
        resource: 'users',
        filters: [{
            field: 'role',
            operator: 'eq',
            value: 'member'
        }],
        pagination: { pageSize: 100 }
    })

    const enrolledMembers = enrolledMembersQuery.query.data?.data || []
    const availableMembers = availableMembersQuery.query.data?.data || []

    // Filter available members to exclude already enrolled ones
    const filteredAvailableMembers = availableMembers.filter((member: any) => 
        !enrolledMembers.some((enrolled: any) => enrolled.memberId === member.id) &&
        (searchQuery === '' || member.name.toLowerCase().includes(searchQuery.toLowerCase()))
    )

    const enrolledCount = enrolledMembers.length
    const sessionCapacity = workoutsDetails?.capacity || 0
    const isAtCapacity = enrolledCount >= sessionCapacity
    const capacityUtilization = sessionCapacity > 0 ? Math.round((enrolledCount / sessionCapacity) * 100) : 0

    if (isLoading || isError || !workoutsDetails) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader
                    resource="workout"
                    title="Workout Details"
                />

                <p className="state-message">
                    {isLoading ? 'Loading...' : isError ? 'Error loading class' : 'No class found'}
                </p>
            </ShowView>
        )
    }

    const trainerName = workoutsDetails.trainer?.name ?? 'Unknown Trainer'
    const trainerInitials = trainerName
        .split(' ')
        .filter(Boolean)
        .slice(0, 2)
        .map((part) => part[0].toUpperCase())
        .join('')
    const placeHolderUrl = `https://placehold.co/600x400?text=${encodeURIComponent(trainerInitials || 'NA')}`
    const { name, description, status, capacity, bannerUrl, bannerCldPubId, workout, trainer, department } = workoutsDetails

    return (
        <ShowView className="class-view class-show">
            <ShowViewHeader
                resource="workout"
                title="Workout Details"
            />

            <div className="banner">
                {bannerUrl ? (
                    <AdvancedImage
                        alt='ClassBanner'
                        cldImg={bannerPhoto(bannerCldPubId ?? '', name)}
                    />
                ) : (
                    <div className="placeholder" />
                )}
            </div>

            <Card className="details-card">
                <div className="details-header">
                    <div>
                        <h1>{name}</h1>
                        <p>{description}</p>
                    </div>

                    <div>
                        <Badge variant='outline'>{enrolledCount}/{sessionCapacity} enrolled</Badge>
                        <Badge
                            variant={status === 'active' ? 'default' : 'secondary'}
                            data-status={status}
                        >
                            {status.toUpperCase()}
                        </Badge>
                        {isAtCapacity && (
                            <Badge variant="destructive" className="ml-2">
                                <AlertTriangle className="w-3 h-3 mr-1" />
                                Full Capacity
                            </Badge>
                        )}
                    </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                        <span>Capacity Utilization</span>
                        <span className={isAtCapacity ? "text-red-600 font-medium" : "text-green-600"}>
                            {capacityUtilization}%
                        </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div 
                            className={`h-2 rounded-full transition-colors ${
                                isAtCapacity ? 'bg-red-600' : capacityUtilization > 80 ? 'bg-yellow-600' : 'bg-green-600'
                            }`}
                            style={{ width: `${capacityUtilization}%` }}
                        />
                    </div>
                </div>

                <div className="details-grid">
                    <div className="instructor">
                        <p>Trainer</p>

                        <div>
                            <img
                                src={trainer?.image ?? placeHolderUrl}
                                alt={trainerName}
                            />

                            <div>
                                <p>{trainerName}</p>
                                <p>{trainer?.email}</p>
                            </div>
                        </div>
                    </div>

                    <div className="department">
                        <p>Department</p>

                        <div>
                            <p>{department?.name}</p>
                            <p>{department?.description}</p>
                        </div>
                    </div>
                </div>

                <Separator />

                <div className="subject">
                    <p>Workout</p>

                    <div>
                        <Badge variant='outline'>
                            Code: {workout?.code}
                        </Badge>

                        <p>{workout?.name}</p>
                        <p>{workout?.description}</p>
                    </div>
                </div>

                <Separator />

                {/* Member Enrollment Management */}
                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <h2 className="text-xl font-semibold flex items-center gap-2">
                            <Users className="w-5 h-5" />
                            Member Enrollment
                        </h2>
                        <div className="flex items-center gap-2">
                            <Badge variant="outline">
                                {enrolledCount} enrolled
                            </Badge>
                            <Badge variant={isAtCapacity ? "destructive" : "secondary"}>
                                {sessionCapacity - enrolledCount} spots left
                            </Badge>
                        </div>
                    </div>

                    {/* Enrolled Members */}
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium">Enrolled Members ({enrolledCount})</h3>
                        {enrolledMembers.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {enrolledMembers.map((enrollment: any) => (
                                    <div key={enrollment.id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center">
                                                <Users className="w-4 h-4 text-blue-600" />
                                            </div>
                                            <div>
                                                <p className="font-medium">{enrollment.member?.name || 'Unknown Member'}</p>
                                                <p className="text-sm text-gray-600">{enrollment.member?.email || 'No email'}</p>
                                            </div>
                                        </div>
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            className="text-red-600 hover:text-red-700"
                                            onClick={() => {
                                                // TODO: Implement unenroll functionality
                                                if (confirm(`Remove ${enrollment.member?.name} from this session?`)) {
                                                    console.log('Unenroll member:', enrollment.id)
                                                }
                                            }}
                                        >
                                            <UserMinus className="w-4 h-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No members enrolled yet</p>
                        )}
                    </div>

                    {/* Add Members */}
                    {!isAtCapacity && (
                        <div className="space-y-4">
                            <h3 className="text-lg font-medium">Add Members</h3>
                            
                            {/* Invite Code Section */}
                            <div className="p-4 border rounded-lg bg-gray-50">
                                <h4 className="font-medium mb-2">Invite Code</h4>
                                <div className="flex gap-2">
                                    <Input
                                        placeholder="Enter invite code"
                                        value={inviteCode}
                                        onChange={(e) => setInviteCode(e.target.value)}
                                    />
                                    <Button
                                        onClick={() => {
                                            // TODO: Implement invite code validation
                                            if (inviteCode === workoutsDetails.inviteCode) {
                                                alert('Valid invite code! Member would be enrolled.')
                                                setInviteCode('')
                                            } else {
                                                alert('Invalid invite code')
                                            }
                                        }}
                                    >
                                        Join with Code
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-600 mt-2">
                                    Session code: <code className="bg-gray-200 px-1 rounded">{workoutsDetails.inviteCode}</code>
                                </p>
                            </div>

                            {/* Search and Add Members */}
                            <div className="space-y-3">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                                    <Input
                                        placeholder="Search members to add..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                {filteredAvailableMembers.length > 0 ? (
                                    <div className="max-h-48 overflow-y-auto space-y-2">
                                        {filteredAvailableMembers.slice(0, 10).map((member: any) => (
                                            <div key={member.id} className="flex items-center justify-between p-2 border rounded hover:bg-gray-50">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center">
                                                        <Users className="w-4 h-4 text-green-600" />
                                                    </div>
                                                    <div>
                                                        <p className="font-medium">{member.name}</p>
                                                        <p className="text-sm text-gray-600">{member.email}</p>
                                                    </div>
                                                </div>
                                                <Button
                                                    size="sm"
                                                    onClick={() => {
                                                        // TODO: Implement enroll functionality
                                                        if (confirm(`Enroll ${member.name} in this session?`)) {
                                                            console.log('Enroll member:', member.id)
                                                        }
                                                    }}
                                                >
                                                    <UserPlus className="w-4 h-4" />
                                                </Button>
                                            </div>
                                        ))}
                                    </div>
                                ) : searchQuery ? (
                                    <p className="text-gray-500 text-center py-4">No members found matching "{searchQuery}"</p>
                                ) : (
                                    <p className="text-gray-500 text-center py-4">All available members are already enrolled</p>
                                )}
                            </div>
                        </div>
                    )}

                    {isAtCapacity && (
                        <div className="p-4 border border-red-200 rounded-lg bg-red-50">
                            <div className="flex items-center gap-2 text-red-700">
                                <AlertTriangle className="w-5 h-5" />
                                <span className="font-medium">Session at Full Capacity</span>
                            </div>
                            <p className="text-red-600 text-sm mt-1">
                                This session has reached its maximum capacity of {sessionCapacity} members.
                                Remove some enrolled members to add new ones.
                            </p>
                        </div>
                    )}
                </div>
            </Card>
        </ShowView>
    )
}

export default Show
