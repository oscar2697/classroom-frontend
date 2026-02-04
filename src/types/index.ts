export type Workout = {
    id: number;
    name: string;
    code: string;
    description: string;
    department: string;
    createdAt?: string;
}

export type ListResponse<T = unknown> = {
    data?: T[]
    pagination?: {
        page: number
        limit: number
        total: number
        totalPages: number
    }
}

export type CreateResponse<T = unknown> = {
    data?: T
}

export type GetOneResponse<T = unknown> = {
    data?: T
}

declare global {
    interface CloudinaryUploadWidgetResults {
        event: string
        info: {
            secure_url: string
            public_id: string
            delete_token?: string
            resource_type: string
            original_filename: string
        }
    }

    interface CloudinaryWidget {
        open: () => void
    }

    interface Window {
        cloudinary?: {
            createUploadWidget: (
                options: Record<string, unknown>,
                callback: (
                    error: unknown,
                    result: CloudinaryUploadWidgetResults
                ) => void
            ) => CloudinaryWidget
        }
    }
}

export interface UploadWidgetValue {
    url: string
    publicId: string
}

export interface UploadWidgetProps {
    value?: UploadWidgetValue | null
    onChange?: (value: UploadWidgetValue | null) => void
    disabled?: boolean
}

export enum UserRole {
    MEMBER = "member",
    TRAINER = "trainer",
    ADMIN = "admin",
}

export type User = {
    id: string
    createdAt: string
    updatedAt: string
    email: string
    name: string
    role: UserRole
    image?: string
    imageCldPubId?: string
    department?: string
}

export type Schedule = {
    day: string
    startTime: string
    endTime: string
}

export type Department = {
    id: number
    name: string
    description: string
}

export type WorkoutSession = {
    id: number
    name: string
    description: string
    status: "active" | "inactive"
    capacity: number
    workoutType: string
    workoutCode: string
    bannerUrl?: string
    bannerCldPubId?: string
    workout?: Workout
    trainer?: User
    department?: Department
    schedules: Schedule[]
    inviteCode?: string
}

export type SignUpPayload = {
    email: string
    name: string
    password: string
    image?: string
    imageCldPubId?: string
    role: UserRole
}

export type ProgressEntry = {
    id: number
    memberId: string
    date: string
    weight?: number
    bodyFat?: number
    waistCircumference?: number
    notes?: string
}

export type Challenge = {
    id: number
    name: string
    description: string
    startDate: string
    endDate: string
    goalType: 'calories' | 'workouts' | 'weight'
    goalValue: number
    participants?: number
}

export type MemberStats = {
    caloriesBurned: number
    minutesExercise: number
    kmTraveled: number
    fitnessPoints: number
    workoutsCompleted: number
}