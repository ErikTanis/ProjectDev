import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Event, getEvent, getEventAttendance } from '../services/eventService';
import { useAuth } from '~hooks/useAuth';

export default function EventComponent() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [event, setEvent] = useState<Event | null>(null);
    const [attendees, setAttendees] = useState<string[]>([]);
    const [error, setError] = useState<string | null>(null);
    const { token, isAuthenticated } = useAuth();

    useEffect(() => {
        if(!isAuthenticated) return navigate("/login", { replace: true });
        const fetchEventData = async () => {
            try {
                if (!id) return;
                const eventId = parseInt(id);
                const fetchedEvent = await getEvent(eventId, token!);
                const fetchedAttendees = await getEventAttendance(eventId, token!);
                
                if (fetchedEvent) {
                    setEvent(fetchedEvent);
                    setAttendees(fetchedAttendees || []);
                    setError(null);
                } else {
                    setError('Event not found');
                }
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An unexpected error occurred');
            }
        };

        fetchEventData();
    }, [id]);

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
                <div className="max-w-3xl mx-auto bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            </div>
        );
    }

    if (!event) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
                <div className="max-w-3xl mx-auto">
                    <p className="text-center text-gray-600 dark:text-gray-400">Loading...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
            <div className="max-w-3xl mx-auto bg-grey dark:bg-gray-800 rounded-lg shadow-md p-8">
                <button
                    onClick={() => navigate('/')}
                    className="mb-6 text-primary-600 hover:text-primary-700 dark:text-primary-400"
                >
                    ← Back to Events
                </button>

                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
                    {event.title}
                </h1>

                <div className="space-y-6">
                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                            Description
                        </h2>
                        <p className="text-gray-600 dark:text-gray-300">
                            {event.description}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Date & Time
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                {event.eventDate.split("-")[2]}-{event.eventDate.split("-")[1]}-{event.eventDate.split("-")[0]}
                                <br />
                                {event.startTime.slice(0, 5)} - {event.endTime.slice(0, 5)}
                            </p>
                        </div>

                        <div>
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                                Location
                            </h2>
                            <p className="text-gray-600 dark:text-gray-300">
                                {event.location}
                            </p>
                        </div>
                    </div>

                    <div>
                        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                            Attendees ({attendees.length})
                        </h2>
                        {attendees.length > 0 ? (
                            <ul className="grid grid-cols-2 gap-2">
                                {attendees.map((attendee, index) => (
                                    <li 
                                        key={index}
                                        className="text-gray-600 dark:text-gray-300 p-2 rounded-lg bg-gray-100 dark:bg-gray-700"
                                    >
                                        {attendee}
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <p className="text-gray-600 dark:text-gray-300">
                                No attendees yet
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}