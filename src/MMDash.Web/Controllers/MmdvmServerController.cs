using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MMDash.Web.Controllers
{
    public class MmdvmServerController : Controller
    {
        public IActionResult Index() => View();

    }
}
