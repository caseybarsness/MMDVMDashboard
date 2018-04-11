using IntelliTect.Coalesce.Knockout.Controllers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.IO;
using Microsoft.Extensions.Configuration;

namespace MMDash.Web.Controllers
{
    public class ReleaseNotesController : Controller
    {
        public IActionResult Index()
        {
                var notes = "";
            try
            {
                var configBuilder = new ConfigurationBuilder()
                .SetBasePath(Directory.GetCurrentDirectory())
                .AddJsonFile("appsettings.json");
                var Configuration = configBuilder.Build();
                var notesPath = Configuration["releaseNotesLocation"];
                DirectoryInfo di = new DirectoryInfo(notesPath);
                FileSystemInfo[] files = di.GetFileSystemInfos();
                var orderedFiles = files.OrderByDescending(f => f.CreationTime);
                foreach (var note in orderedFiles)
                {
                    notes += CommonMark.CommonMarkConverter.Convert(System.IO.File.ReadAllText(note.FullName));
                }

            }
            catch (Exception)
            {
              
            }
            ViewBag.ReleaseNotes = notes;
            return View();
        }

    }
}
