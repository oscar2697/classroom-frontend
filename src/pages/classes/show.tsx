import { ShowView, ShowViewHeader } from "@/components/refine-ui/views/show-view"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { WorkoutSession } from "@/types"
import { useShow } from "@refinedev/core"
import { AdvancedImage } from "@cloudinary/react"
import { bannerPhoto } from "@/lib/cloudinary"

const Show = () => {
    const { query } = useShow<WorkoutSession>({ resource: 'workouts-sessions' })
    const workoutsDetails = query.data?.data
    const { isLoading, isError } = query

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
                        <Badge variant='outline'>{capacity} spots</Badge>
                        <Badge
                            variant={status === 'active' ? 'default' : 'secondary'}
                            data-status={status}
                        >
                            {status.toUpperCase()}
                        </Badge>
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

                <div className="join">
                    <h2>Join Class</h2>

                    <ol>
                        <li>Ask your trainer for the class code</li>
                        <li>Click on "Join Class" button</li>
                        <li>Paste the code and click "join"</li>
                    </ol>
                </div>

                <Button
                    size='lg'
                    className="w-full"
                >
                    Join Class
                </Button>
            </Card>
        </ShowView>
    )
}

export default Show
