using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

[ApiController]
[Route("api/v1/attendance")]
public class AttendanceController : ControllerBase
{

    private readonly IEventService _eventService;

    public AttendanceController(IEventService service)
    {
        _eventService = service;
    }

    [HttpPost("{ID}"), Authorize]
    public async Task<IActionResult> AddAttendance(int ID)
    {
        if (await _eventService.GetEventAsync(ID) is null)
            return NotFound("Event has not been found!");

        var result = await _eventService.AddAttendanceAsync(ID, User.FindFirst(ClaimTypes.NameIdentifier)?.Value);
        return result ? Ok("Attendance has been added!") : BadRequest("Attendance has not been added!");
    }


}