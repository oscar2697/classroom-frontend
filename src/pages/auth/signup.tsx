import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Link, useNavigate } from 'react-router'
import { Dumbbell, Eye, EyeOff, Mail, Lock, User, Users, Shield } from 'lucide-react'
import { useRegister } from '@refinedev/core'

const Signup = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'member' as 'member' | 'trainer' | 'admin'
    })
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [errors, setErrors] = useState<Record<string, string>>({})
    const navigate = useNavigate()

    const { mutate: register } = useRegister()

    const validateForm = () => {
        const newErrors: Record<string, string> = {}

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required'
        }

        if (!formData.email.trim()) {
            newErrors.email = 'Email is required'
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Email is invalid'
        }

        if (!formData.password) {
            newErrors.password = 'Password is required'
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters'
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Please confirm your password'
        } else if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match'
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!validateForm()) {
            return
        }

        setIsLoading(true)

        try {
            await register({
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: formData.role,
            })
            navigate('/')
        } catch (error: any) {
            console.error('Signup error:', error)
            if (error?.message) {
                setErrors({ general: error.message })
            }
        } finally {
            setIsLoading(false)
        }
    }

    const handleInputChange = (field: string, value: string) => {
        setFormData(prev => ({ ...prev, [field]: value }))
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({ ...prev, [field]: '' }))
        }
    }

    const roleOptions = [
        {
            value: 'member',
            label: 'Member',
            description: 'Can join workout sessions',
            icon: Users,
            color: 'text-green-600',
            bgColor: 'bg-green-50'
        },
        {
            value: 'trainer',
            label: 'Trainer',
            description: 'Can create and manage workout sessions',
            icon: Dumbbell,
            color: 'text-blue-600',
            bgColor: 'bg-blue-50'
        },
        {
            value: 'admin',
            label: 'Administrator',
            description: 'Full system access and user management',
            icon: Shield,
            color: 'text-red-600',
            bgColor: 'bg-red-50'
        }
    ]

    const selectedRole = roleOptions.find(option => option.value === formData.role)

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full space-y-8">
                <div className="text-center">
                    <div className="flex justify-center">
                        <div className="flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full">
                            <Dumbbell className="w-8 h-8 text-white" />
                        </div>
                    </div>
                    <h2 className="mt-6 text-3xl font-bold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Or{' '}
                        <Link 
                            to="/auth/login" 
                            className="font-medium text-blue-600 hover:text-blue-500"
                        >
                            sign in to your existing account
                        </Link>
                    </p>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-center">Sign Up</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            {errors.general && (
                                <div className="bg-red-50 border border-red-200 rounded-md p-3">
                                    <p className="text-sm text-red-600">{errors.general}</p>
                                </div>
                            )}

                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="name">Full Name</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="name"
                                            name="name"
                                            type="text"
                                            autoComplete="name"
                                            required
                                            className="pl-10"
                                            placeholder="Enter your full name"
                                            value={formData.name}
                                            onChange={(e) => handleInputChange('name', e.target.value)}
                                        />
                                    </div>
                                    {errors.name && (
                                        <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="email">Email address</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            className="pl-10"
                                            placeholder="Enter your email"
                                            value={formData.email}
                                            onChange={(e) => handleInputChange('email', e.target.value)}
                                        />
                                    </div>
                                    {errors.email && (
                                        <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="role">Account Type</Label>
                                    <Select
                                        value={formData.role}
                                        onValueChange={(value) => handleInputChange('role', value)}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select your role" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {roleOptions.map((role) => (
                                                <SelectItem key={role.value} value={role.value}>
                                                    <div className="flex items-center gap-2">
                                                        <role.icon className={`w-4 h-4 ${role.color}`} />
                                                        <div>
                                                            <div className="font-medium">{role.label}</div>
                                                            <div className="text-sm text-gray-500">{role.description}</div>
                                                        </div>
                                                    </div>
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    {selectedRole && (
                                        <div className={`mt-2 p-3 rounded-lg ${selectedRole.bgColor}`}>
                                            <div className="flex items-center gap-2">
                                                <selectedRole.icon className={`w-4 h-4 ${selectedRole.color}`} />
                                                <span className={`text-sm font-medium ${selectedRole.color}`}>
                                                    {selectedRole.label}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-600 mt-1">{selectedRole.description}</p>
                                        </div>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="password">Password</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            required
                                            className="pl-10 pr-10"
                                            placeholder="Create a password"
                                            value={formData.password}
                                            onChange={(e) => handleInputChange('password', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowPassword(!showPassword)}
                                        >
                                            {showPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.password && (
                                        <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                                    )}
                                </div>

                                <div>
                                    <Label htmlFor="confirmPassword">Confirm Password</Label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400" />
                                        </div>
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? 'text' : 'password'}
                                            autoComplete="new-password"
                                            required
                                            className="pl-10 pr-10"
                                            placeholder="Confirm your password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                                        />
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            {showConfirmPassword ? (
                                                <EyeOff className="h-5 w-5 text-gray-400" />
                                            ) : (
                                                <Eye className="h-5 w-5 text-gray-400" />
                                            )}
                                        </button>
                                    </div>
                                    {errors.confirmPassword && (
                                        <p className="mt-1 text-sm text-red-600">{errors.confirmPassword}</p>
                                    )}
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? 'Creating account...' : 'Create account'}
                            </Button>

                            <Separator />

                            <div className="text-center">
                                <p className="text-sm text-gray-600">
                                    Already have an account?{' '}
                                    <Link 
                                        to="/auth/login" 
                                        className="font-medium text-blue-600 hover:text-blue-500"
                                    >
                                        Sign in
                                    </Link>
                                </p>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default Signup
