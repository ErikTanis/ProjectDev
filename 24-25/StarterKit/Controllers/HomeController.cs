using System.Diagnostics;
using Microsoft.AspNetCore.Mvc;
using StarterKit.Models;

namespace StarterKit.Controllers;

public class HomeController : Controller
{
    private readonly ILogger<AuthController> _logger;

    public HomeController(ILogger<AuthController> logger)
    {
        _logger = logger;
    }

    [HttpGet("/")]
    [HttpGet("/login")]
    [HttpGet("/register")]
    [HttpGet("/terms-and-conditions")]
    [HttpGet("/admin")]
    [HttpGet("/admin/events")]
    public IActionResult Index()
    {
        return View();
    }

    [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
    public IActionResult Error()
    {
        return View(new ErrorViewModel { RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier });
    }
}
