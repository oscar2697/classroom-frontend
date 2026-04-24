import { useForm } from '@refinedev/core'
import { EditView } from '@/components/refine-ui/views/edit-view'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Label } from '@/components/ui/label'
import { useEffect, useState } from 'react'
import { useParams } from 'react-router'

interface User {
  name: string
  email: string
  role: 'member' | 'trainer' | 'admin'
  image?: string
  imageCldPubId?: string
  emailVerified?: boolean
}

const UsersEdit = () => {
  const { id } = useParams<{ id: string }>()
  const form = useForm({
    refineCoreProps: {
        resource: 'users',
        action: 'edit',
        id: id,
    },
  })

  const {
    refineCore: { onFinish, queryResult },
    formLoading,
    handleSubmit,
  } = form
  const [formData, setFormData] = useState<User>({
    name: '',
    email: '',
    role: 'member',
    image: '',
    imageCldPubId: '',
  })

  useEffect(() => {
    if (queryResult?.data?.data) {
      const userData = queryResult.data.data
      setFormData({
        name: userData.name || '',
        email: userData.email || '',
        role: userData.role || 'member',
        image: userData.image || '',
        imageCldPubId: userData.imageCldPubId || '',
        emailVerified: userData.emailVerified,
      })
    }
  }, [queryResult])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onFinish({
      ...formData,
      image: formData.image || undefined,
      imageCldPubId: formData.imageCldPubId || undefined,
    })
  }

  const handleChange = (field: keyof User, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <EditView>
      <div className="max-w-2xl mx-auto p-6">
        <h1 className="text-2xl font-bold mb-6">Edit User</h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <Label htmlFor="name">
              Name *
            </Label>
            <Input
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              placeholder="Enter user name"
              className="w-full"
              required
            />
          </div>

          <div>
            <Label htmlFor="email">
              Email *
            </Label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              placeholder="Enter email address"
              className="w-full"
              required
            />
          </div>

          <div>
            <Label htmlFor="role">
              Role *
            </Label>
            <Select
              value={formData.role}
              onValueChange={(value) => handleChange('role', value as 'member' | 'trainer' | 'admin')}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Select a role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="trainer">Trainer</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="image">
              Profile Image URL
            </Label>
            <Input
              value={formData.image}
              onChange={(e) => handleChange('image', e.target.value)}
              placeholder="Enter image URL (optional)"
              className="w-full"
            />
          </div>

          <div>
            <Label htmlFor="imageCldPubId">
              Cloudinary Public ID
            </Label>
            <Input
              value={formData.imageCldPubId}
              onChange={(e) => handleChange('imageCldPubId', e.target.value)}
              placeholder="Enter Cloudinary public ID (optional)"
              className="w-full"
            />
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="emailVerified"
                checked={formData.emailVerified || false}
                onChange={(e) => handleChange('emailVerified', e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <Label htmlFor="emailVerified" className="text-sm font-medium text-gray-700">
                Email Verified
              </Label>
            </div>
          </div>

          <div className="flex gap-4">
            <Button
              type="submit"
              disabled={formLoading}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              {formLoading ? 'Updating...' : 'Update User'}
            </Button>
            <button
              type="button"
              onClick={() => window.history.back()}
              className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </EditView>
  )
}

export default UsersEdit
