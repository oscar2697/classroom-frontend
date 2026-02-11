import * as z from 'zod'

export const trainerSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters long'),
    emails: z.string().email(),
    role: z.enum(['admin','trainer', 'member'], {
        required_error: 'Role is required'
    }),
    department: z.string(),
    image: z.string().optional(),
    imageCldPubId: z.string().optional()
}) 

export const workoutSchema = z.object({
    name: z.string().min(3, "Workout name must be at least 3 characters"),
    code: z.string().min(5, "Workout code must be at least 5 characters"),
    description: z
        .string()
        .min(5, "Workout description must be at least 5 characters"),
    department: z
        .string()
        .min(2, "Workout department must be at least 2 characters"),
})

const scheduleSchema = z.object({
    day: z.string().min(1, "Day is required"),
    startTime: z.string().min(1, "Start time is required"),
    endTime: z.string().min(1, "End time is required"),
})

export const workoutSessionSchema = z.object({
    name: z
        .string()
        .min(2, "Session name must be at least 2 characters")
        .max(50, "Session name must be at most 50 characters"),

    description: z
        .string({ required_error: "Description is required" })
        .min(5, "Description must be at least 5 characters"),

    workoutId: z.coerce
        .number({
            required_error: "Workout is required",
            invalid_type_error: "Workout is required",
        })
        .min(1, "Workout is required"),

    trainerId: z.string().min(1, "Trainer is required"),

    capacity: z.coerce
        .number({
            required_error: "Capacity is required",
            invalid_type_error: "Capacity is required",
        })
        .min(1, "Capacity must be at least 1"),

    status: z.enum(["active", "inactive"]),

    bannerUrl: z
        .string({ required_error: "Session banner is required" })
        .min(1, "Session banner is required"),

    bannerCldPubId: z
        .string({ required_error: "Banner reference is required" })
        .min(1, "Banner reference is required"),

    inviteCode: z.string().optional(),

    schedules: z.array(scheduleSchema).optional(),
})

export const memberWorkoutSchema = z.object({
    workoutSessionId: z.coerce
        .number({
            required_error: "Session ID is required",
            invalid_type_error: "Session ID is required",
        })
        .min(1, "Session ID is required"),

    memberId: z.string().min(1, "Member ID is required"),
});
