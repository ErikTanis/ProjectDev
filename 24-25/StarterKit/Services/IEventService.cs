using StarterKit.Models;

public interface IEventService
{

    public Task<IEnumerable<Event>?> GetAllEventsAsync();
    public Task<Event?> GetEventAsync(int ID);
    public Task<IEnumerable<string>?> GetEventAttendanceAsync(int ID);
    public Task AddEventAsync(Event e);
    public Task EditEventAsync(Event e);
    public Task DeleteEventAsync(string ID);

}