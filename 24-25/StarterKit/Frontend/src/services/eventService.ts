import axios from 'axios';

export interface Event {
    id: number;
    name: string;
    description: string;
    date: string;
    location: string;
}

export const getEvents = async (): Promise<Event[]> => {
    try {
        const response = await axios.get('/api/event');
        return response.data.filter((event: Event) => 
            new Date(event.date) > new Date()
        );
    } catch (error) {
        throw new Error('Failed to fetch events. Please try again later.');
    }
};
