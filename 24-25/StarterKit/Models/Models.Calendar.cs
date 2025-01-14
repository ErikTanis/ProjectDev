using Microsoft.AspNetCore.Identity;

namespace StarterKit.Models
{
    public class ApplicationUser : IdentityUser
    {
        public required string FirstName { get; set; }

        public required string LastName { get; set; }

        // A comma sepparated string that could look like this: "mo,tu,we,th,fr"
        public string? RecuringDays { get; set; }

        public WorkingStatus Status { get; set; }

        public List<Attendance>? Attendances { get; set; }

        public List<Event_Attendance>? Event_Attendances { get; set; }
    }

    public enum WorkingStatus
    {
        on_premises,
        from_home,
        away
    }

    public class Attendance
    {
        public int AttendanceId { get; set; }

        public DateTime AttendanceDate { get; set; }

        public required ApplicationUser User { get; set; }
    }

    public class Event_Attendance
    {
        public int Event_AttendanceId { get; set; }
        public int Rating { get; set; }
        public required string Feedback { get; set; }
        public required ApplicationUser User { get; set; }
        public required Event Event { get; set; }
    }

    public class Event
    {
        public int EventId { get; set; }

        public required string Title { get; set; }

        public required string Description { get; set; }

        public DateOnly EventDate { get; set; }

        public TimeSpan StartTime { get; set; }

        public TimeSpan EndTime { get; set; }

        public required string Location { get; set; }

        public bool AdminApproval { get; set; }

        public required List<Event_Attendance> Event_Attendances { get; set; } = [];
    }
}