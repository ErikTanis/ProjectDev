using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;
namespace StarterKit.Services;
[ApiController]
[Route("api/[controller]")]
public class StatusController : Controller
{
    private readonly IStatusService _statusService;

    public StatusController(IStatusService statusService)
    {
        _statusService = statusService;
    }

    //Get the status of an employee
    [HttpGet("GetEmployeeStatus/{employeeId}")]
    public async Task<IActionResult> GetEmployeeStatus(int employeeId)
    {
        var status = await _statusService.GetEmployeeStatusAsync(employeeId);
        return Ok(status);
    }

    //Update the status of an employee
    [HttpPost("UpdateEmployeeStatus/{employeeId}/{status}")]
    public async Task<IActionResult> UpdateEmployeeStatus(int employeeId, string status)
    {
        var success = await _statusService.UpdateEmployeeStatusAsync(employeeId, status);
        return Ok(success);
    }

    //Get all the statuses
    [HttpGet("GetAllStatuses")]
    public async Task<IActionResult> GetAllStatuses()
    {
        var statuses = await _statusService.GetAllStatusesAsync();
        return Ok(statuses);
    }
}
