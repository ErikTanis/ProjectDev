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

export const deleteEvent = async (eventId: number, token: string): Promise<boolean> => {
    try {
        const response = await axios.delete(`/api/event/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.status === 200;
    } catch (error) {
        throw new Error('Failed to delete event.');
    }
}

export const createEvent = async(event: Event): Promise<boolean> => {
    try {
        event.startTime += ':00';
        event.endTime += ':00';
        const response = await axios.post('/api/event', event)
        return response.status === 200
    } catch (error) {
        throw new Error('Failed to create event.')
    }
}

export const addAttendance = async (eventId: number, token: string): Promise<boolean> => {
    try {
        const response = await axios.post(`/api/v1/attendance/${eventId}`, null, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.status === 200;
    } catch (error) {
        throw new Error('Failed to add attendance.');
    }
}

export const getEvent = async (eventId: number, token: string): Promise<Event> => {
    try {
        const response = await axios.get(`/api/event/${eventId}`);
        return response.data
    } catch (error) {
        throw new Error('Failed to fetch events. Please try again later.');
    }
}

export const getEventAttendance = async (eventId: number, token: string): Promise<string[]> => {
    try {
        const response = await axios.get(`/api/v1/attendance/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.data;
    } catch (error) {
        throw new Error('Failed to delete event.');
    }
}

export const deleteAttendance = async(eventId: number, token: string) : Promise<boolean> => {
    try {
        const response = await axios.delete(`/api/v1/attendance/${eventId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });
        return response.status === 200;
    } catch (error) {
        throw new Error('Failed to delete event.');
    }
}