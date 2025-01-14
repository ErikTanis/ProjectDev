import { useEffect, useState } from "react"
import { getAllEvents, Event } from "~services/eventService";

export default function AdminEvents() {
    const [events, setEvents] = useState<Event[]>([])
    const [error, setError] = useState<string | null>(null)

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
      }, []);

    return (
        <></>
    )

}