import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { CreateView } from '@/components/refine-ui/views/create-view'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useBack, useList } from '@refinedev/core'
import { useForm } from "@refinedev/react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import { workoutSessionSchema } from '@/lib/schema'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Loader2 } from 'lucide-react'
import UploadWidget from '@/components/upload-widget'
import { User, Workout } from '@/types'

const WorkoutsSessionCreate = () => {
    const back = useBack()

    const form = useForm({
        resolver: zodResolver(workoutSessionSchema),
        refineCoreProps: {
            resource: 'classes',
            action: 'create',
        },
    })

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting, errors },
        control
    } = form

    const onSubmit = async (values: z.infer<typeof workoutSessionSchema>) => {
        try {
            await onFinish(values)
        } catch (error) {
            console.log('Error creating workout session', error)
        }
    }

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

    const workouts = workoutsQuery.data?.data || []
    const workoutsLoading = workoutsQuery.isLoading

    const trainers = trainersQuery.data?.data || []
    const trainersLoading = trainersQuery.isLoading

    const bannerPublicId = form.watch('bannerCldPubId')

    const setBannerImage = (file: any, field: any) => {
        if (file) {
            field.onChange(file.url)
            form.setValue('bannerCldPubId', file.publicId, {
                shouldValidate: true,
                shouldDirty: true
            })
        } else {
            field.onChange('')
            form.setValue('bannerCldPubId', '', {
                shouldValidate: true,
                shouldDirty: true
            })
        }
    }

    return (
        <CreateView className='class-view'>
            <Breadcrumb />

            <h1 className='page-title'>Create Workout Session</h1>

            <div className='intro-row'>
                <p>Provide the details of the workout session you want to create.</p>

                <Button
                    onClick={back}
                >
                    Go Back
                </Button>
            </div>

            <Separator />

            <div className='my-4 flex items-center'>
                <Card className='class-form-card'>
                    <CardHeader className='relative z-10'>
                        <CardTitle className='text-2xl pb-0 font-bold'>
                            Workout Session Details
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className='mt-7' >
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className='space-y-5'
                            >

                                <FormField
                                    control={control}
                                    name='bannerUrl'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Banner Image <span className='text-orange-600'>*</span>
                                            </FormLabel>

                                            <FormControl>
                                                <UploadWidget
                                                    value={field.value ? { url: field.value, publicId: bannerPublicId ?? '' } : null}
                                                    onChange={(file: any) => setBannerImage(file, field)}
                                                />
                                            </FormControl>

                                            <FormMessage />

                                            {errors.bannerCldPubId && !errors.bannerUrl && (
                                                <p className='text-destructive text-sm'>{errors.bannerCldPubId.message?.toString()}</p>
                                            )}
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Workout Session Name <span className='text-orange-600'>*</span>
                                            </FormLabel>

                                            <FormControl>
                                                <Input
                                                    placeholder='Kung Fu Fundamentals'
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <div className='grid sm:grid-cols-2 gap-4'>
                                    <FormField
                                        control={control}
                                        name='workoutId'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Workout <span className='text-orange-600'>*</span>
                                                </FormLabel>

                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field?.value?.toString()}
                                                    disabled={workoutsLoading}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue
                                                                placeholder='Select a Workout'
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>

                                                    <SelectContent>
                                                        {workouts.map((workout) => (
                                                            <SelectItem
                                                                value={workout.id.toString()}
                                                                key={workout.id}
                                                            >
                                                                {workout.name}
                                                                ({workout.code})
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name='trainerId'
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Trainer <span className='text-orange-600'>*</span>
                                                </FormLabel>

                                                <Select
                                                    onValueChange={(value) => field.onChange(Number(value))}
                                                    value={field?.value?.toString()}
                                                    disabled={trainersLoading}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className='w-full'>
                                                            <SelectValue
                                                                placeholder='Select a Trainer'
                                                            />
                                                        </SelectTrigger>
                                                    </FormControl>

                                                    <SelectContent>
                                                        {trainers.map((trainer) => (
                                                            <SelectItem
                                                                value={trainer.id.toString()}
                                                                key={trainer.id}
                                                            >
                                                                {trainer.name}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <div className="grid sm:grid-cols-2 gap-4">
                                    <FormField
                                        control={control}
                                        name="capacity"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Capacity</FormLabel>

                                                <FormControl>
                                                    <Input
                                                        type="number"
                                                        placeholder="30"
                                                        onChange={(e) => {
                                                            const value = e.target.value;
                                                            field.onChange(value ? Number(value) : undefined);
                                                        }}
                                                        value={(field.value as number | undefined) ?? ""}
                                                        name={field.name}
                                                        ref={field.ref}
                                                        onBlur={field.onBlur}
                                                    />
                                                </FormControl>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>
                                                    Status <span className="text-orange-600">*</span>
                                                </FormLabel>

                                                <Select
                                                    onValueChange={field.onChange}
                                                    value={field.value}
                                                >
                                                    <FormControl>
                                                        <SelectTrigger className="w-full">
                                                            <SelectValue placeholder="Select status" />
                                                        </SelectTrigger>
                                                    </FormControl>

                                                    <SelectContent>
                                                        <SelectItem value="active">Active</SelectItem>
                                                        <SelectItem value="inactive">Inactive</SelectItem>
                                                    </SelectContent>
                                                </Select>

                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={control}
                                    name="description"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Description</FormLabel>

                                            <FormControl>
                                                <Textarea
                                                    placeholder="Brief description about the workout session"
                                                    {...field}
                                                />
                                            </FormControl>

                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Separator />

                                <Button type="submit" size="lg" className="w-full">
                                    {isSubmitting ? (
                                        <div className="flex gap-1">
                                            <span>Creating Workout Session...</span>
                                            <Loader2 className="inline-block ml-2 animate-spin" />
                                        </div>
                                    ) : (
                                        "Create Workout Session"
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>
            </div>
        </CreateView>
    )
}

export default WorkoutsSessionCreate
