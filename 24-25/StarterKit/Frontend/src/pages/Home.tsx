import React, { useState, useEffect } from 'react';
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "~hooks/useAuth";
import { getEvents, Event } from '../services/eventService';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [events, setEvents] = useState<Event[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const fetchedEvents = await getEvents();
        setEvents(fetchedEvents);
        setError(null);
      } catch (error) {
        setError(error instanceof Error ? error.message : 'An unexpected error occurred');
        setEvents([]);
      }
    };

    fetchEvents();
  }, []);

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  const handleEventClick = (eventId: number) => {
    navigate(`/event/${eventId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
          Upcoming Events
        </h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {events.map((event) => (
            <div
              key={event.eventId}
              onClick={() => handleEventClick(event.eventId)}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 cursor-pointer hover:shadow-lg transition duration-300 ease-in-out"
            >
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                {event.title}
              </h2>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                {event.description}
              </p>
              <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400">
                <span>{new Date(`${event.eventDate}T${event.endTime}`).toLocaleDateString()}</span>
                <span>{event.location}</span>
              </div>
            </div>
          ))}
        </div>

        {events.length === 0 && (
          <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
            No upcoming events found.
          </p>
        )}
      </div>
    </div>
  );
}
