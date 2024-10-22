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

    //Add a id of an employee and return the status of the employee
    public async Task<string> GetEmployeeStatusAsync(int employeeId)
    {
        var user = await _context.User.FindAsync(employeeId);
        return user.Status.ToString();
    }

    //Add a id of an employee and a status and update the status of the employee
    public async Task<bool> UpdateEmployeeStatusAsync(int employeeId, string status)
    {
        var user = await _context.User.FindAsync(employeeId);
        user.Status = (User.WorkingStatus)Enum.Parse(typeof(User.WorkingStatus), status);
        await _context.SaveChangesAsync();
        return true;
    }

    //Return all the statuses
    public async Task<IEnumerable<string>> GetAllStatusesAsync()
    {
        return Enum.GetNames(typeof(User.WorkingStatus));
    }
}


