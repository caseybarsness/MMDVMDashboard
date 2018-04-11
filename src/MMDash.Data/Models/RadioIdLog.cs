using IntelliTect.Coalesce.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Text;

namespace MMDash.Data.Models
{
    [Read(PermissionLevel = SecurityPermissionLevels.AllowAll)]
    [Edit(Roles = "Admin")]
    public class RadioIdLog
    {
        public int RadioIdLogId { get; set; }
        public int CallSignId { get; set; }
        public CallSign CallSign { get; set; }
        public int ServerId { get; set; }
        public Server Server { get; set; }
        public string RadioId { get; set; }

    }
}
