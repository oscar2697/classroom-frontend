import { Workout } from '../types'

export const MOCK_WORKOUTS: Workout[] = [
    {
        id: '1',
        code: 'KF-BAS-001',
        name: 'Kung Fu Fundamentals',
        department: 'Kung fu',
        description: 'Introduction to basic Kung Fu techniques, stances, and forms for beginners.',
        createdAt: '2024-01-15T10:00:00Z'
    },
    {
        id: '2',
        code: 'KK-STR-001',
        name: 'Karate Strength Training',
        department: 'Karate',
        description: 'Advanced strength and conditioning exercises specifically designed for Karate practitioners.',
        createdAt: '2024-01-20T14:30:00Z'
    },
    {
        id: '3',
        code: 'MMA-COM-001',
        name: 'MMA Combat Conditioning',
        department: 'MMA',
        description: 'High-intensity workout combining striking, grappling, and cardio for mixed martial arts preparation.',
        createdAt: '2024-02-01T09:15:00Z'
    }
]