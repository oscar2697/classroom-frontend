import { Breadcrumb } from '@/components/refine-ui/layout/breadcrumb'
import { CreateView } from '@/components/refine-ui/views/create-view'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { useBack } from '@refinedev/core'
import { useForm } from "@refinedev/react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Loader2 } from 'lucide-react'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['member', 'trainer', 'admin']),
  image: z.string().optional(),
  imageCldPubId: z.string().optional(),
})

type UserFormData = z.infer<typeof userSchema>

const UsersCreate = () => {
    const back = useBack()

    const form = useForm({
        resolver: zodResolver(userSchema),
        refineCoreProps: {
            resource: 'users',
            action: 'create',
        },
    })

    const {
        refineCore: { onFinish },
        handleSubmit,
        formState: { isSubmitting },
        control
    } = form

    const onSubmit = async (values: any) => {
        try {
            await onFinish(values)
        } catch (error) {
            console.log('Error creating user', error)
        }
    }

    return (
        <CreateView>
            <Breadcrumb />

            <h1 className='page-title'>Create New User</h1>

            <div className='intro-row'>
                <p>Add a new user to the system with their role and information.</p>

                <Button onClick={back}>
                    Go Back
                </Button>
            </div>

            <Separator />

            <div className='my-4 flex items-center'>
                <Card className='w-full max-w-2xl mx-auto'>
                    <CardHeader className='relative z-10'>
                        <CardTitle className='text-2xl pb-0 font-bold'>
                            User Information
                        </CardTitle>
                    </CardHeader>

                    <Separator />

                    <CardContent className='mt-7'>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className='space-y-5'
                            >
                                <FormField
                                    control={control}
                                    name='name'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Name <span className='text-orange-600'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter user name'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name='email'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Email <span className='text-orange-600'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='email'
                                                    placeholder='Enter email address'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name='password'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Password <span className='text-orange-600'>*</span>
                                            </FormLabel>
                                            <FormControl>
                                                <Input
                                                    type='password'
                                                    placeholder='Enter password (min 6 characters)'
                                                    defaultValue="ChangeMe123!"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Default password: "ChangeMe123!" - User can change this on first login
                                            </p>
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name='role'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>
                                                Role <span className='text-orange-600'>*</span>
                                            </FormLabel>
                                            <Select
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                defaultValue='member'
                                            >
                                                <FormControl>
                                                    <SelectTrigger className='w-full'>
                                                        <SelectValue placeholder='Select a role' />
                                                    </SelectTrigger>
                                                </FormControl>
                                                <SelectContent>
                                                    <SelectItem value='member'>Member</SelectItem>
                                                    <SelectItem value='trainer'>Trainer</SelectItem>
                                                    <SelectItem value='admin'>Admin</SelectItem>
                                                </SelectContent>
                                            </Select>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name='image'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Profile Image URL</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter image URL (optional)'
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={control}
                                    name='imageCldPubId'
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Cloudinary Public ID</FormLabel>
                                            <FormControl>
                                                <Input
                                                    placeholder='Enter Cloudinary public ID (optional)'
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
                                            <span>Creating User...</span>
                                            <Loader2 className="inline-block ml-2 animate-spin" />
                                        </div>
                                    ) : (
                                        "Create User"
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

export default UsersCreate
