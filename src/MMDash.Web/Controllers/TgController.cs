using IntelliTect.Coalesce.Knockout.Controllers;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MMDash.Web.Controllers
{
    public class TgController : BaseViewController<MMDash.Data.Models.TalkGroup>
    {
        public IActionResult Index() =>  IndexImplementation(false, @"~/Views/Tg/Index.cshtml");

    }
}
