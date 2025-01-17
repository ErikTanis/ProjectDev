import { useEffect, useState } from "react"
import { getAllEvents, Event } from "~services/eventService";
import EditEvent from "./EditEvent";

export default function AdminEvents() {
    const [events, setEvents] = useState<Event[]>([])
    const [error, setError] = useState<string | null>(null)
    const [isEditing, setIsEditing] = useState<boolean>(false);
    const [editingEvent, setEditingEvent] = useState<Event | null>(null);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const fetchedEvents = await getAllEvents();
                setEvents(fetchedEvents);
                setError(null);
            } catch (error) {
                setError(error instanceof Error ? error.message : 'An unexpected error occurred');
                setEvents([]);
            }
        };

        fetchEvents();
    }, [isEditing]);

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                        Manage Events
                    </h1>
                    <a
                        href="#"
                        className="bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                    >
                        Create New Event
                    </a>
                </div>

                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {isEditing && editingEvent && (
                    <EditEvent 
                        {...editingEvent} 
                        onClose={() => {
                            setIsEditing(false);
                            setEditingEvent(null);
                        }}
                    />
                )}

                <div className="grid grid-cols-1 gap-4">
                    {events.map((event) => (
                        <div
                            key={event.eventId}
                            className="bg-grey dark:bg-gray-800 rounded-lg shadow-md p-6 transition duration-300 ease-in-out"
                        >
                            <div className="flex justify-between items-start">
                                <div>
                                    <a
                                        href="#"
                                        className="text-xl font-semibold text-gray-900 dark:text-white hover:text-primary-600 dark:hover:text-primary-500"
                                    >
                                        {event.title}
                                    </a>
                                    <p className="text-gray-600 dark:text-gray-300 mt-2">
                                        {event.description}
                                    </p>
                                    <div className="flex gap-4 text-sm text-gray-500 dark:text-gray-400 mt-4">
                                        <span>{event.eventDate.split("-")[2]}-{event.eventDate.split("-")[1]}-{event.eventDate.split("-")[0]}</span>
                                        <span>{event.startTime.slice(0, 5)}-{event.endTime.slice(0, 5)}</span>
                                        <span>{event.location}</span>
                                    </div>
                                </div>
                                <a
                                    onClick={() => {
                                        setIsEditing(true);
                                        setEditingEvent(event);
                                    }}
                                    href="#"
                                    className="text-primary-600 hover:text-primary-700 dark:text-primary-500 dark:hover:text-primary-400 font-medium text-sm"
                                >
                                    Edit
                                </a>
                            </div>
                        </div>
                    ))}
                </div>

                {events.length === 0 && !error && (
                    <p className="text-center text-gray-600 dark:text-gray-400 mt-8">
                        No events found.
                    </p>
                )}
            </div>
        </div>
    );
}