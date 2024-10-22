using StarterKit.Models;

public interface IFeedback_RatingService
{
    Task AddFeedbackAsync(Event_Attendance eventAttendance);
    Task<Event_Attendance> GetFeedbackAsync(int eventAttendanceId);
    Task UpdateFeedbackAsync(Event_Attendance eventAttendance);
    Task DeleteFeedbackAsync(int eventAttendanceId);

    Task AddRatingbackAsync(Event_Attendance eventAttendance);
    Task<Event_Attendance> GetRatingbackAsync(int eventAttendanceId);
    Task UpdateRatingbackAsync(Event_Attendance eventAttendance);
    Task DeleteRatingbackAsync(int eventAttendanceId);
    Task<List<Event_Attendance>> GetAllFeedbackAndRatingsAsync();
}