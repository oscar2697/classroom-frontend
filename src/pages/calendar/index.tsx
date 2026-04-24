import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarIcon, Clock, Users, ChevronLeft, ChevronRight } from "lucide-react";
import { useGetIdentity } from "@refinedev/core";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface WorkoutSession {
  id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  trainer: string;
  participants: number;
  maxParticipants: number;
  type: string;
  description: string;
  recurring?: {
    pattern: 'daily' | 'weekly' | 'monthly';
    days?: string[]; // For weekly: ['monday', 'tuesday', etc.]
    endDate?: string;
  };
  workoutId?: string;
}

// Mock data for demonstration
const mockSessions: WorkoutSession[] = [
  {
    id: "1",
    title: "Kung Fu Fundamentals",
    date: "2024-01-15",
    time: "15:00",
    duration: "60 min",
    trainer: "John Smith",
    participants: 8,
    maxParticipants: 15,
    type: "Martial Arts",
    description: "Learn the basics of Kung Fu with traditional techniques",
    recurring: {
      pattern: 'weekly',
      days: ['tuesday', 'thursday'],
      endDate: '2024-12-31'
    },
    workoutId: "workout-1"
  },
  {
    id: "2",
    title: "Self Defense with Karate",
    date: "2024-01-15",
    time: "17:00",
    duration: "60 min",
    trainer: "John Smith",
    participants: 12,
    maxParticipants: 20,
    type: "Martial Arts",
    description: "Daily self-defense techniques using Karate principles",
    recurring: {
      pattern: 'daily',
      endDate: '2024-12-31'
    },
    workoutId: "workout-2"
  },
  {
    id: "3",
    title: "HIIT Training",
    date: "2024-01-16",
    time: "09:00",
    duration: "45 min",
    trainer: "John Trainer",
    participants: 12,
    maxParticipants: 15,
    type: "cardio",
    description: "High-intensity interval training"
  },
  {
    id: "4",
    title: "Yoga Class",
    date: "2024-01-16",
    time: "14:00",
    duration: "90 min",
    trainer: "Sarah Instructor",
    participants: 8,
    maxParticipants: 20,
    type: "flexibility",
    description: "Relaxing yoga session"
  },
  {
    id: "5",
    title: "Strength Training",
    date: "2024-01-16",
    time: "16:00",
    duration: "45 min",
    trainer: "Mike Coach",
    participants: 6,
    maxParticipants: 10,
    type: "strength",
    description: "Full body strength workout"
  }
];

const getDaysInMonth = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = firstDay.getDay();

  const days = [];
  
  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    days.push(null);
  }
  
  // Add all days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }
  
  return days;
};

const getSessionTypeColor = (type: string) => {
  switch (type) {
    case "cardio":
      return "bg-red-100 text-red-800 border-red-200";
    case "strength":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "flexibility":
      return "bg-green-100 text-green-800 border-green-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

// Generate recurring events
const generateRecurringEvents = (sessions: WorkoutSession[], currentDate: Date): WorkoutSession[] => {
  const events: WorkoutSession[] = [];
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  sessions.forEach(session => {
    if (session.recurring) {
      // Generate recurring events for the month
      for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(currentYear, currentMonth, day);
        const dayName = date.toLocaleDateString('en-US', { weekday: 'long' }).toLowerCase();
        
        // Check if this day matches the recurring pattern
        let shouldAdd = false;
        
        if (session.recurring.pattern === 'daily') {
          shouldAdd = true;
        } else if (session.recurring.pattern === 'weekly' && session.recurring.days) {
          shouldAdd = session.recurring.days.includes(dayName);
        }
        
        // Check end date
        if (shouldAdd && session.recurring.endDate) {
          const endDate = new Date(session.recurring.endDate);
          if (date > endDate) {
            shouldAdd = false;
          }
        }
        
        if (shouldAdd) {
          events.push({
            ...session,
            id: `${session.id}-${day}`,
            date: date.toISOString().split('T')[0],
          });
        }
      }
    } else {
      // Add non-recurring events as-is
      events.push(session);
    }
  });
  
  return events;
};

export function CalendarPage() {
  const { data: user } = useGetIdentity<User>();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const days = getDaysInMonth(currentDate);
  const monthYear = currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const allSessions = generateRecurringEvents(mockSessions, currentDate);

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  const handleDateClick = (day: number | null) => {
    if (day) {
      const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      setSelectedDate(newDate);
    }
  };

  const getSessionsForDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0];
    return allSessions.filter(session => session.date === dateStr);
  };

  const selectedDateSessions = selectedDate ? getSessionsForDate(selectedDate) : [];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Workout Calendar</h1>
          <p className="text-muted-foreground">
            View and manage workout sessions
          </p>
        </div>
        {(user?.role === 'admin' || user?.role === 'trainer') && (
          <Button>
            <CalendarIcon className="w-4 h-4 mr-2" />
            Schedule Session
          </Button>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Calendar */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>{monthYear}</CardTitle>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={() => navigateMonth('prev')}>
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => navigateMonth('next')}>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-1">
              {/* Weekday headers */}
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                <div key={day} className="text-center text-sm font-medium text-muted-foreground p-2">
                  {day}
                </div>
              ))}
              
              {/* Calendar days */}
              {days.map((day, index) => {
                const isToday = day === new Date().getDate() && 
                               currentDate.getMonth() === new Date().getMonth() && 
                               currentDate.getFullYear() === new Date().getFullYear();
                const isSelected = selectedDate && day === selectedDate.getDate();
                const dateSessions = day ? getSessionsForDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day)) : [];

                return (
                  <div
                    key={index}
                    onClick={() => handleDateClick(day)}
                    className={`
                      min-h-[80px] p-2 border rounded-lg cursor-pointer transition-colors
                      ${!day ? 'bg-gray-50 cursor-default' : 'hover:bg-gray-50'}
                      ${isToday ? 'bg-blue-50 border-blue-200' : 'border-gray-200'}
                      ${isSelected ? 'bg-blue-100 border-blue-300' : ''}
                    `}
                  >
                    {day && (
                      <>
                        <div className={`
                          text-sm font-medium
                          ${isToday ? 'text-blue-600' : ''}
                          ${isSelected ? 'text-blue-700' : ''}
                        `}>
                          {day}
                        </div>
                        {dateSessions.length > 0 && (
                          <div className="mt-1 space-y-1">
                            {dateSessions.slice(0, 2).map((session, idx) => (
                              <div
                                key={idx}
                                className={`
                                  text-xs p-1 rounded truncate
                                  ${getSessionTypeColor(session.type)}
                                `}
                              >
                                <div className="flex items-center gap-1">
                                  {session.recurring && (
                                    <span className="text-blue-600 font-bold">🔄</span>
                                  )}
                                  <span>{session.time} {session.title}</span>
                                </div>
                              </div>
                            ))}
                            {dateSessions.length > 2 && (
                              <div className="text-xs text-gray-500">
                                +{dateSessions.length - 2} more
                              </div>
                            )}
                          </div>
                        )}
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Selected Date Details */}
        <Card>
          <CardHeader>
            <CardTitle>
              {selectedDate ? selectedDate.toLocaleDateString() : 'Select a date'}
            </CardTitle>
            <CardDescription>
              {selectedDate ? 'Sessions scheduled for this date' : 'Click on a date to view sessions'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {selectedDateSessions.length > 0 ? (
              <div className="space-y-4">
                {selectedDateSessions.map(session => (
                  <div key={session.id} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{session.title}</h4>
                        {session.recurring && (
                          <Badge variant="outline" className="text-blue-600 border-blue-300">
                            🔄 {session.recurring.pattern === 'daily' ? 'Daily' : 'Weekly'}
                          </Badge>
                        )}
                      </div>
                      <Badge className={getSessionTypeColor(session.type)}>
                        {session.type}
                      </Badge>
                    </div>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4" />
                        {session.time} ({session.duration})
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        {session.participants}/{session.maxParticipants} participants
                      </div>
                      <div>
                        Trainer: {session.trainer}
                      </div>
                    </div>
                    <p className="text-sm mt-2">{session.description}</p>
                    {user?.role === 'member' && session.participants < session.maxParticipants && (
                      <Button className="mt-3 w-full" size="sm">
                        Book Session
                      </Button>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <CalendarIcon className="w-12 h-12 mx-auto text-gray-400 mb-4" />
                <p className="text-muted-foreground">
                  {selectedDate ? 'No sessions scheduled' : 'Select a date to view sessions'}
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
