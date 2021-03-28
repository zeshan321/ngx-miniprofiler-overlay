using demo.Contexts;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using StackExchange.Profiling;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace demo.Controllers
{
    [ApiController]
    [Route("[controller]")]
    [EnableCors]
    public class WeatherForecastController : ControllerBase
    {
        private static readonly string[] Summaries = new[]
        {
            "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
        };

        private readonly ILogger<WeatherForecastController> _logger;
        private readonly BloggingContext bloggingContext;

        public WeatherForecastController(ILogger<WeatherForecastController> logger, BloggingContext bloggingContext)
        {
            _logger = logger;
            this.bloggingContext = bloggingContext;
        }

        [HttpGet]
        public async Task<IEnumerable<WeatherForecast>> GetAsync()
        {
            await bloggingContext.AddAsync(new Blog()
            {
                Url = "http://blogs.msdn.com/adonet"
            });
            await bloggingContext.SaveChangesAsync();
            await bloggingContext.Blogs.ToListAsync();

            return getData().ToArray();
        }

        private IEnumerable<WeatherForecast> getData()
        {
            var rng = new Random();
            return MiniProfiler.Current.Inline(() => Enumerable.Range(1, 5).Select(index => new WeatherForecast
            {
                Date = DateTime.Now.AddDays(index),
                TemperatureC = rng.Next(-20, 55),
                Summary = Summaries[rng.Next(Summaries.Length)]
            }), "Get Enum Data");
        }
    }
}
