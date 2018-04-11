using IntelliTect.Coalesce.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Text;

namespace MMDash.Data.Models
{
    [Read(PermissionLevel = SecurityPermissionLevels.AllowAll)]
    [Edit(Roles = "Admin")]
    public class TalkGroup
    {
        public int TalkGroupId { get; set; }
        [Search]
        public string Ts1Id { get; set; }
        [Search]
        public string Ts2Id { get; set; }
        public string Name { get; set; }

    }
}
