using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;
namespace StarterKit.Services;
public class StatusService : IStatusService
{
    private readonly DatabaseContext _context;

    public StatusService(DatabaseContext context)
    {
        _context = context;
    }

    public async Task<string> GetEmployeeStatusAsync(int employeeId)
    {
        var user = await _context.User.FindAsync(employeeId);
        return user.Status.ToString();
    }

    public async Task<bool> UpdateEmployeeStatusAsync(int employeeId, string status)
    {
        var user = await _context.User.FindAsync(employeeId);
        user.Status = (User.WorkingStatus)Enum.Parse(typeof(User.WorkingStatus), status);
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<IEnumerable<string>> GetAllStatusesAsync()
    {
        return Enum.GetNames(typeof(User.WorkingStatus));
    }
}

