using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;
namespace StarterKit.Services;

public interface IStatusService
{
    public Task<string> GetEmployeeStatusAsync(int employeeId);
    public Task<bool> UpdateEmployeeStatusAsync(int employeeId, string status);
    public Task<IEnumerable<string>> GetAllStatusesAsync();
}
