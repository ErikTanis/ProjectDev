using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

using StarterKit.Models;
namespace StarterKit.Services;
public class StatusService : IStatusService
{
    private readonly DatabaseContext _context;
    private readonly UserManager<ApplicationUser> _userManager;

    public StatusService(DatabaseContext context, UserManager<ApplicationUser> userManager)
    {
        _context = context;
        _userManager = userManager;
    }

    //Add a id of an employee and return the status of the employee
    public async Task<string> GetEmployeeStatusAsync(string employeeId)
    {
        var user = await _userManager.FindByIdAsync(employeeId);
        return user.Status.ToString();
    }

    //Add a id of an employee and a status and update the status of the employee
    public async Task<bool> UpdateEmployeeStatusAsync(string employeeId, string status)
    {
        var user = await _userManager.FindByIdAsync(employeeId);
        user.Status = (WorkingStatus)Enum.Parse(typeof(WorkingStatus), status);
        await _context.SaveChangesAsync();
        return true;
    }

    //Return all the statuses
    public async Task<IEnumerable<string>> GetAllStatusesAsync()
    {
        return Enum.GetNames(typeof(WorkingStatus));
    }
}
