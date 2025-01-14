using Microsoft.AspNetCore.Diagnostics;
using StarterKit.Services;
using StarterKit.Utils;

namespace StarterKit
{
    class Program
    {
        static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args)
                .ConfigureDatabase()
                .ConfigureAuthentication();

            builder.Services.AddControllersWithViews();
            builder.Services.AddDistributedMemoryCache();
            builder.Services.AddSession(options =>
            {
                options.IdleTimeout = TimeSpan.FromSeconds(10);
                options.Cookie.HttpOnly = true;
                options.Cookie.IsEssential = true;
            });
            builder.Services.AddScoped<IAuthService, AuthService>();
            builder.Services.AddScoped<IEventService, EventService>();

            var app = builder.Build();
            app.EnsureDefaultAccountExistsAsync().Wait();

            if (!app.Environment.IsDevelopment())
            {
                app.UseExceptionHandler("/Home/Error");
                app.UseHsts();
            }

            app.UseHttpsRedirection();
            app.UseStaticFiles();

            app.UseRouting();

            app.UseAuthentication();
            app.UseAuthorization();

            app.UseExceptionHandler("/Home/Error");

            app.Use(async (context, next) => {
                await next.Invoke();
                
                var StatusCode = context.Response.StatusCode;
                var RequestPath = context.Request.Path;
                Console.WriteLine($"{DateTime.Now} '{RequestPath}' responded with statuscode '{StatusCode}'");
                
                if (context.Response.StatusCode == 500){
                    var errorLogPath = Path.Combine("ErrorLogs", "errorlog.txt");
                    var stackTracePath = Path.Combine("ErrorLogs", $"{DateTime.Now:yyyyMMddHHmmss}_stacktrace.txt");

                    Directory.CreateDirectory("ErrorLogs");

                    var exceptionHandlerPathFeature = context.Features.Get<IExceptionHandlerPathFeature>();
                    if (exceptionHandlerPathFeature?.Error != null)
                    {
                        var errorMessage = $"{DateTime.Now} - {exceptionHandlerPathFeature.Error.Message}";
                        await File.AppendAllTextAsync(errorLogPath, errorMessage + Environment.NewLine);

                        var stackTrace = exceptionHandlerPathFeature.Error.ToString();
                        await File.WriteAllTextAsync(stackTracePath, stackTrace);
                    }
                }
            });

            // Remove these duplicate lines
            // app.UseAuthentication();
            // app.UseAuthorization();

            app.UseSession();

            app.MapControllerRoute(
                name: "default",
                pattern: "{controller=Home}/{action=Index}/{id?}");

            app.Run();
        }
    }
}