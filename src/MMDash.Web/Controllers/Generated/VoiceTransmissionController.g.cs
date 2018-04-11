using IntelliTect.Coalesce.Knockout.Controllers;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Hosting;

namespace MMDash.Web.Controllers
{
    [Authorize]
    public partial class VoiceTransmissionController : BaseViewController<MMDash.Data.Models.VoiceTransmission>
    {
        [AllowAnonymous]
        public ActionResult Cards()
        {
            return IndexImplementation(false, @"~/Views/Generated/VoiceTransmission/Cards.cshtml");
        }

        [AllowAnonymous]
        public ActionResult Table()
        {
            return IndexImplementation(false, @"~/Views/Generated/VoiceTransmission/Table.cshtml");
        }


        [Authorize(Roles = "Admin")]
        public ActionResult TableEdit()
        {
            return IndexImplementation(true, @"~/Views/Generated/VoiceTransmission/Table.cshtml");
        }

        [Authorize(Roles = "Admin")]
        public ActionResult CreateEdit()
        {
            return CreateEditImplementation(@"~/Views/Generated/VoiceTransmission/CreateEdit.cshtml");
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