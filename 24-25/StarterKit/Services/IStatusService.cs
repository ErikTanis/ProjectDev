using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;
namespace StarterKit.Services;

public interface IStatusService
{
    public Task<string> GetEmployeeStatusAsync(string employeeId);
    public Task<bool> UpdateEmployeeStatusAsync(string employeeId, string status);
    public Task<IEnumerable<string>> GetAllStatusesAsync();
}
