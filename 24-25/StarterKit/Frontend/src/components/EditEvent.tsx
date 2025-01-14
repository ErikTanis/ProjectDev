import { Event, updateEvent } from "~services/eventService"
import { useState } from "react"

interface EditEventProps extends Event {
    onClose: () => void;
}

export default function EditEvent({ onClose, ...event }: EditEventProps) {
    const [editingField, setEditingField] = useState<string | null>(null);
    const [formData, setFormData] = useState<Event>(event);

    const handleInputChange = (field: string, value: string | boolean) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

		const handleSubmit = async () => {
			const success = await updateEvent(formData);
			if(success) onClose();
			// TODO: display error
		}

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 backdrop-blur-sm overflow-y-auto h-full w-full">
            <div className="relative top-20 mx-auto p-8 w-full max-w-2xl">
                <div className="bg-grey dark:bg-gray-800 rounded-lg shadow-xl p-6">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                        Edit Event
                    </h2>

                    <div className="space-y-4">
                        {/* Title */}
                        <div className="flex items-center justify-between">
                            <div className="flex-grow">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Title
                                </label>
                                {editingField === 'title' ? (
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => handleInputChange('title', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                ) : (
                                    <p className="text-gray-900 dark:text-white">{formData.title}</p>
                                )}
                            </div>
                            <button
                                onClick={() => setEditingField(editingField === 'title' ? null : 'title')}
                                className="ml-4 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500"
                            >
                                ✎
                            </button>
                        </div>

                        {/* Description */}
                        <div className="flex items-start justify-between">
                            <div className="flex-grow">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                {editingField === 'description' ? (
                                    <textarea
                                        value={formData.description}
                                        onChange={(e) => handleInputChange('description', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        rows={3}
                                    />
                                ) : (
                                    <p className="text-gray-900 dark:text-white">{formData.description}</p>
                                )}
                            </div>
                            <button
                                onClick={() => setEditingField(editingField === 'description' ? null : 'description')}
                                className="ml-4 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500"
                            >
                                ✎
                            </button>
                        </div>

                        {/* Date */}
                        <div className="flex items-center justify-between">
                            <div className="flex-grow">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Date
                                </label>
                                {editingField === 'eventDate' ? (
                                    <input
                                        type="date"
                                        value={formData.eventDate}
                                        onChange={(e) => handleInputChange('eventDate', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                ) : (
                                    <p className="text-gray-900 dark:text-white">{formData.eventDate}</p>
                                )}
                            </div>
                            <button
                                onClick={() => setEditingField(editingField === 'eventDate' ? null : 'eventDate')}
                                className="ml-4 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500"
                            >
                                ✎
                            </button>
                        </div>

                        {/* Time */}
                        <div className="flex items-center justify-between">
                            <div className="flex-grow">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Time
                                </label>
                                {editingField === 'time' ? (
                                    <div className="flex gap-4">
                                        <input
                                            type="time"
                                            value={formData.startTime}
                                            onChange={(e) => handleInputChange('startTime', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                        <input
                                            type="time"
                                            value={formData.endTime}
                                            onChange={(e) => handleInputChange('endTime', e.target.value)}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        />
                                    </div>
                                ) : (
                                    <p className="text-gray-900 dark:text-white">
                                        {formData.startTime} - {formData.endTime}
                                    </p>
                                )}
                            </div>
                            <button
                                onClick={() => setEditingField(editingField === 'time' ? null : 'time')}
                                className="ml-4 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500"
                            >
                                ✎
                            </button>
                        </div>

                        {/* Location */}
                        <div className="flex items-center justify-between">
                            <div className="flex-grow">
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Location
                                </label>
                                {editingField === 'location' ? (
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                    />
                                ) : (
                                    <p className="text-gray-900 dark:text-white">{formData.location}</p>
                                )}
                            </div>
                            <button
                                onClick={() => setEditingField(editingField === 'location' ? null : 'location')}
                                className="ml-4 text-gray-500 hover:text-primary-600 dark:text-gray-400 dark:hover:text-primary-500"
                            >
                                ✎
                            </button>
                        </div>
                    </div>

                    <div className="mt-6 flex justify-end space-x-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-grey border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 dark:bg-gray-700 dark:text-white dark:border-gray-600 dark:hover:bg-gray-600"
                        >
                            Cancel
                        </button>
                        <button
                            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md shadow-sm hover:bg-primary-700 dark:hover:bg-primary-500"
														onClick={handleSubmit}
												>
                            Save Changes
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}