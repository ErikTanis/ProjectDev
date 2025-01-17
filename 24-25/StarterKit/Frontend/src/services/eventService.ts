import axios from 'axios';


export interface User {

}

export interface Attendance {
    rating: number;
    feedback: string;
    applicationUser: User;
    event: Event;
}

export interface Event {
    eventId: number;
    title: string;
    description: string;
    eventDate: string;
    startTime: string;
    endTime: string;
    location: string;
    adminApproval: boolean;
    event_Attendances: Attendance[];
}

export const getEvents = async (): Promise<Event[]> => {
    try {
        const response = await axios.get('/api/event');
        return response.data.filter((event: Event) => 
            new Date(`${event.eventDate}T${event.endTime}`) > new Date()
        );
    } catch (error) {
        throw new Error('Failed to fetch events. Please try again later.');
    }
};

export const getAllEvents = async (): Promise<Event[]> => {
    try {
        const response = await axios.get('/api/event');
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch events. Please try again later.');
    }
};

export const updateEvent = async (event: Event): Promise<boolean> => {
    try {
        const response = await axios.put('/api/event', event)
				return response.status === 200
    } catch (error) {
			throw new Error('Failed to update event.')
		}
}
