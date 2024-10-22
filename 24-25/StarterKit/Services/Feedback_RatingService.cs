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

    //Add a feedback to the database
    public async Task AddFeedbackAsync(StarterKit.Models.Event_Attendance eventAttendance)
    {
        _context.Event_Attendance.Add(eventAttendance);
        await _context.SaveChangesAsync();
    }

    //Add a rating to the database
    public async Task AddRatingbackAsync(StarterKit.Models.Event_Attendance eventAttendance)
    {
        _context.Event_Attendance.Add(eventAttendance);
        await _context.SaveChangesAsync();
    }

    //Delete a feedback from the database
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

    //Get a feedback from the database
    public async Task<StarterKit.Models.Event_Attendance> GetFeedbackAsync(int eventAttendanceId)
    {
        return await _context.Event_Attendance.FindAsync(eventAttendanceId);
    }

    //Get a rating from the database
    public async Task<StarterKit.Models.Event_Attendance> GetRatingbackAsync(int eventAttendanceId)
    {
        return await _context.Event_Attendance.FindAsync(eventAttendanceId);
    }

    //Update a feedback in the database
    public async Task UpdateFeedbackAsync(StarterKit.Models.Event_Attendance eventAttendance)
    {
        _context.Event_Attendance.Update(eventAttendance);
        await _context.SaveChangesAsync();
    }

    //Update a rating in the database
    public async Task UpdateRatingbackAsync(StarterKit.Models.Event_Attendance eventAttendance)
    {
        _context.Event_Attendance.Update(eventAttendance);
        await _context.SaveChangesAsync();
    }

    //Get all feedback and ratings from the database
    public async Task<List<StarterKit.Models.Event_Attendance>> GetAllFeedbackAndRatingsAsync()
    {
        return await _context.Event_Attendance.ToListAsync();
    }
}