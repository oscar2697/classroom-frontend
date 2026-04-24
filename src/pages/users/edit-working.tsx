import { useForm } from "@refinedev/react-hook-form"
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { Loader2 } from 'lucide-react'
import { useBack } from '@refinedev/core'

const userSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email('Invalid email address'),
  role: z.enum(['member', 'trainer', 'admin']),
  image: z.string().optional(),
  imageCldPubId: z.string().optional(),
  emailVerified: z.boolean().optional(),
})

type UserFormData = z.infer<typeof userSchema>

const UsersEditWorking = () => {
    const back = useBack()

    const form = useForm({
        resolver: zodResolver(userSchema),
        refineCoreProps: {
            resource: 'users',
            action: 'edit',
        },
    })

    const {
        refineCore: { onFinish, queryResult },
        handleSubmit,
        formState: { isSubmitting },
        control
    } = form

    const onSubmit = async (values: any) => {
        try {
            await onFinish(values)
        } catch (error) {
            console.log('Error updating user', error)
        }
    }

    return (
        <div className="max-w-2xl mx-auto p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Edit User</h1>
                <Button onClick={back}>
                    Go Back
                </Button>
            </div>

            <Separator />

            <div className="my-4 flex items-center">
                <Card className='w-full'>
                    <CardHeader className='relative z-10'>
                        <CardTitle className='text-2xl pb-0 font-bold'>
                            User Information
                        </CardTitle>
                        <CardDescription>
                            Update user details and permissions
                        </CardDescription>
                    </CardHeader>

                    <Separator />

                    <CardContent className='mt-7'>
                        <form onSubmit={handleSubmit(onSubmit)} className='space-y-5'>
                            <div>
                                <Label htmlFor="name">
                                    Name <span className='text-orange-600'>*</span>
                                </Label>
                                <Input
                                    id="name"
                                    placeholder='Enter user name'
                                    {...form.register('name')}
                                />
                            </div>

                            <div>
                                <Label htmlFor="email">
                                    Email <span className='text-orange-600'>*</span>
                                </Label>
                                <Input
                                    id="email"
                                    type='email'
                                    placeholder='Enter email address'
                                    {...form.register('email')}
                                />
                            </div>

                            <div>
                                <Label htmlFor="role">
                                    Role <span className='text-orange-600'>*</span>
                                </Label>
                                <Select
                                    onValueChange={(value) => form.setValue('role', value as 'member' | 'trainer' | 'admin')}
                                    defaultValue={form.getValues('role')}
                                >
                                    <SelectTrigger className='w-full'>
                                        <SelectValue placeholder='Select a role' />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value='member'>Member</SelectItem>
                                        <SelectItem value='trainer'>Trainer</SelectItem>
                                        <SelectItem value='admin'>Admin</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <div>
                                <Label htmlFor="image">Profile Image URL</Label>
                                <Input
                                    id="image"
                                    placeholder='Enter image URL (optional)'
                                    {...form.register('image')}
                                />
                            </div>

                            <div>
                                <Label htmlFor="imageCldPubId">Cloudinary Public ID</Label>
                                <Input
                                    id="imageCldPubId"
                                    placeholder='Enter Cloudinary public ID (optional)'
                                    {...form.register('imageCldPubId')}
                                />
                            </div>

                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="emailVerified"
                                    {...form.register('emailVerified')}
                                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                                />
                                <Label htmlFor="emailVerified" className="text-sm font-medium text-gray-700">
                                    Email Verified
                                </Label>
                            </div>

                            <Separator />

                            <Button type="submit" size="lg" className="w-full">
                                {isSubmitting ? (
                                    <div className="flex gap-1">
                                        <span>Updating User...</span>
                                        <Loader2 className="inline-block ml-2 animate-spin" />
                                    </div>
                                ) : (
                                    "Update User"
                                )}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default UsersEditWorking
