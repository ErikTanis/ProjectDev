using StarterKit.Services;
using StarterKit.Models;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

public class Feedback_RatingService : IFeedback_RatingService
{
    private readonly DatabaseContext _context;

    public Feedback_RatingService(DatabaseContext context)
    {
        _context = context;
    }

    public async Task AddFeedbackAsync(StarterKit.Models.Event_Attendance eventAttendance)
    {
        _context.Event_Attendance.Add(eventAttendance);
        await _context.SaveChangesAsync();
    }

    public async Task AddRatingbackAsync(StarterKit.Models.Event_Attendance eventAttendance)
    {
        _context.Event_Attendance.Add(eventAttendance);
        await _context.SaveChangesAsync();
    }

    public async Task DeleteFeedbackAsync(int eventAttendanceId)
    {
        var eventAttendance = await _context.Event_Attendance.FindAsync(eventAttendanceId);
        if (eventAttendance != null)
        {
            _context.Event_Attendance.Remove(eventAttendance);
            await _context.SaveChangesAsync();
        }
    }

    public async Task DeleteRatingbackAsync(int eventAttendanceId)
    {
        var eventAttendance = await _context.Event_Attendance.FindAsync(eventAttendanceId);
        if (eventAttendance != null)
        {
            _context.Event_Attendance.Remove(eventAttendance);
            await _context.SaveChangesAsync();
        }
    }

    public async Task<StarterKit.Models.Event_Attendance> GetFeedbackAsync(int eventAttendanceId)
    {
        return await _context.Event_Attendance.FindAsync(eventAttendanceId);
    }

    public async Task<StarterKit.Models.Event_Attendance> GetRatingbackAsync(int eventAttendanceId)
    {
        return await _context.Event_Attendance.FindAsync(eventAttendanceId);
    }

    public async Task UpdateFeedbackAsync(StarterKit.Models.Event_Attendance eventAttendance)
    {
        _context.Event_Attendance.Update(eventAttendance);
        await _context.SaveChangesAsync();
    }

    public async Task UpdateRatingbackAsync(StarterKit.Models.Event_Attendance eventAttendance)
    {
        _context.Event_Attendance.Update(eventAttendance);
        await _context.SaveChangesAsync();
    }
}