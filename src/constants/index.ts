import { Dumbbell, Shield, User } from "lucide-react"

export const USER_ROLES = {
    MEMBER: "member",
    TRAINER: "trainer",
    ADMIN: "admin",
}

export const ROLE_OPTIONS = [
    {
        value: USER_ROLES.MEMBER,
        label: "Member",
        icon: User,
    },
    {
        value: USER_ROLES.TRAINER,
        label: "Trainer",
        icon: Dumbbell,
    },
]

export const DEPARTMENTS = [
    "Kung Fu",
    "Karate",
    "Mixed Martial Arts",
    "Boxing",
    "Kickboxing",
    "Brazilian Jiu-Jitsu",
    "Strength Training",
    "Cross Training",
    "Yoga",
    "Functional Training",
    "Cardio & Conditioning",
] as const

export const DEPARTMENT_OPTIONS = DEPARTMENTS.map((dept) => ({
    value: dept,
    label: dept,
}))

export const MAX_FILE_SIZE = 3 * 1024 * 1024; 
export const ALLOWED_TYPES = [
    "image/png",
    "image/jpeg",
    "image/jpg",
    "image/webp",
]

const getEnvVar = (key: string): string => {
    const value = import.meta.env[key];
    if (!value) {
        throw new Error(`Missing environment variable: ${key}`);
    }
    return value;
};

//export const CLOUDINARY_UPLOAD_URL = getEnvVar("VITE_CLOUDINARY_UPLOAD_URL");
//export const CLOUDINARY_CLOUD_NAME = getEnvVar("VITE_CLOUDINARY_CLOUD_NAME");
export const BACKEND_BASE_URL = getEnvVar("VITE_BACKEND_BASE_URL");

export const BASE_URL =  import.meta.env.VITE_API_URL;
export const ACCESS_TOKEN_KEY = import.meta.env.VITE_ACCESS_TOKEN_KEY
export const REFRESH_TOKEN_KEY = import.meta.env.VITE_REFRESH_TOKEN_KEY

export const REFRESH_TOKEN_URL = `${BASE_URL}/refresh-token`;

//export const CLOUDINARY_UPLOAD_PRESET = getEnvVar("VITE_CLOUDINARY_UPLOAD_PRESET");

export const trainers = [
    {
        id: "1",
        name: "Carlos Mendoza",
    },
    {
        id: "2",
        name: "Laura Fernández",
    },
    {
        id: "3",
        name: "Miguel Rojas",
    },
]

export const workouts = [
    {
        id: 1,
        name: "Kung Fu Fundamentals",
        code: "KF-BAS-001",
        department: "Kung Fu",
    },
    {
        id: 2,
        name: "Karate Strength Training",
        code: "KK-STR-001",
        department: "Karate",
    },
    {
        id: 3,
        name: "MMA Combat Conditioning",
        code: "MMA-COM-001",
        department: "Mixed Martial Arts",
    },
    {
        id: 4,
        name: "Brazilian Jiu-Jitsu Basics",
        code: "BJJ-BAS-001",
        department: "Brazilian Jiu-Jitsu",
    },
];
