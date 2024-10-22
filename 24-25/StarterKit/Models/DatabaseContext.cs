using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace StarterKit.Models;

public class DatabaseContext(DbContextOptions<DatabaseContext> options)
    : IdentityDbContext<ApplicationUser, ApplicationRole, string>(options)
{
    public DbSet<Attendance> Attendance { get; set; }
    public DbSet<Event_Attendance> Event_Attendance { get; set; }
    public DbSet<Event> Event { get; set; }


    protected override void OnModelCreating(ModelBuilder modelBuilder) =>
        base.OnModelCreating(modelBuilder);
}