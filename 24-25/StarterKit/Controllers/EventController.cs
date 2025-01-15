
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;
using StarterKit.Services;

namespace StarterKit.Controllers;

[Route("api/event")]
[ApiController]
public class EventController: Controller
{

    private readonly ILogger<EventController> _logger;
    private readonly IEventService _eventService;

    public EventController(ILogger<EventController> logger, IEventService eventService){
        _logger = logger;
        _eventService = eventService;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllEvents(){
        IEnumerable<Event>? events = await _eventService.GetAllEventsAsync();
        return Ok( events );
    }

    [HttpGet("{ID}")]
    public async Task<IActionResult> GetEvent(int ID){
        Event? e = await _eventService.GetEventAsync(ID);
        if(e == null){
            return NotFound("Event has not been found!");
        }
        return Ok( e );
    }

    [HttpGet("{ID}/attendance")]
    public async Task<IActionResult> GetEventAttendance(int ID){
        IEnumerable<string>? attendance = await _eventService.GetEventAttendanceAsync(ID);
        return Ok( attendance );
    }

    [HttpPost]
    public async Task<IActionResult> AddEvent([FromBody] Event e){
        try{
            await _eventService.AddEventAsync(e);
            return Ok("Event has been added!");
        }catch(Exception ex){
            return BadRequest(ex.Message);
        }
    }

    [HttpPut]
    public async Task<IActionResult> EditEvent([FromBody] Event e){
        try{
            await _eventService.EditEventAsync(e);
            return Ok("Event has been edited!");
        }catch(Exception ex){
            return BadRequest(ex.Message);
        }
    }

    [HttpDelete("{ID}"), Authorize(Roles = "admin")]
    public async Task<IActionResult> DeleteEvent(int ID){
        try{
            await _eventService.DeleteEventAsync(ID);
            return Ok("Event has been deleted!");
        }catch(Exception ex){
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("test")]
    public IActionResult Test(){
        var hehe = "test";
        Convert.ToInt32(hehe);
        return Ok();
    }


}