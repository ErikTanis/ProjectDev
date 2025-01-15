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
        var maxId = _context.Event.Any() 
            ? await _context.Event.MaxAsync(e => e.EventId) 
            : 0;
        e.EventId = maxId + 1;
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

    public async Task DeleteEventAsync(int ID)
    {
        var existingEvent = await _context.Event.FindAsync(ID);
        if (existingEvent == null)
        {
            throw new Exception("Event not found!");
        }
        _context.Event.Remove(existingEvent);
        await _context.SaveChangesAsync();
    }

    public async Task<bool> AddAttendanceAsync(int ID, string? userId){
        var existingEvent = await _context.Event.FindAsync(ID);
        if (existingEvent == null)
        {
            return false;
        }
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Id == userId);
        if (user == null)
        {
            return false;
        }
        var existingAttendance = await _context.Event_Attendance.FirstOrDefaultAsync(ea => ea.Event.EventId == ID && ea.User.Id == user.Id);
        if (existingAttendance != null)
        {
            return false;
        }
        await _context.Event_Attendance.AddAsync(new Event_Attendance { Event = existingEvent, User = user, Feedback = "" });
        await _context.SaveChangesAsync();
        return true;
    }

}