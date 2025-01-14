using Microsoft.EntityFrameworkCore;
using StarterKit.Models;

namespace StarterKit.Services;

public class EventService : IEventService
{

    private readonly DatabaseContext _context;

    public EventService(DatabaseContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Event>?> GetAllEventsAsync()
    {
        var events = await _context.Event.ToListAsync();
        events.ForEach(e => {
            if(e.Event_Attendances == null) e.Event_Attendances ??= [];
        });
        return events;
    }

    public async Task<Event?> GetEventAsync(int ID){
        return await _context.Event.FindAsync(ID);
    }

    public async Task<IEnumerable<string>?> GetEventAttendanceAsync(int ID){
        var userList = await _context.Event_Attendance.Where(ea => ea.Event.EventId == ID).Select(ea => ea.User).ToListAsync();
        return userList.Select(u => $"{u.FirstName} {u.LastName}");
    }

    public async Task AddEventAsync(Event e)
    {
        await _context.Event.AddAsync(e);
        await _context.SaveChangesAsync();
    }

    public async Task EditEventAsync(Event e)
    {
        var existingEvent = await _context.Event.FindAsync(e.EventId);
        if (existingEvent == null)
        {
            throw new Exception("Event not found!");
        }
        _context.Entry(existingEvent).CurrentValues.SetValues(e);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteEventAsync(string ID)
    {
        var existingEvent = await _context.Event.FindAsync(ID);
        if (existingEvent == null)
        {
            throw new Exception("Event not found!");
        }
        _context.Event.Remove(existingEvent);
    }

}