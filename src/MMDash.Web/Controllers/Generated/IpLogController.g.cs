using IntelliTect.Coalesce.Knockout.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;

namespace MMDash.Web.Controllers
{
    [Authorize]
    public partial class IpLogController : BaseViewController<MMDash.Data.Models.IpLog>
    {
        [AllowAnonymous]
        public ActionResult Cards()
        {
            return IndexImplementation(false, @"~/Views/Generated/IpLog/Cards.cshtml");
        }

        [AllowAnonymous]
        public ActionResult Table()
        {
            return IndexImplementation(false, @"~/Views/Generated/IpLog/Table.cshtml");
        }


        [Authorize(Roles = "Admin")]
        public ActionResult TableEdit()
        {
            return IndexImplementation(true, @"~/Views/Generated/IpLog/Table.cshtml");
        }

        [Authorize(Roles = "Admin")]
        public ActionResult CreateEdit()
        {
            return CreateEditImplementation(@"~/Views/Generated/IpLog/CreateEdit.cshtml");
        }

        [Authorize(Roles = "Admin")]
        public ActionResult EditorHtml(bool simple = false)
        {
            return EditorHtmlImplementation(simple);
        }

        [Authorize(Roles = "Admin")]
        public ActionResult Docs([FromServices] IHostingEnvironment hostingEnvironment)
        {
            return DocsImplementation(hostingEnvironment);
        }
    }
}