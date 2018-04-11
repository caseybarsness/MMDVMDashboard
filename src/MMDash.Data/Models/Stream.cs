using IntelliTect.Coalesce.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Text;

namespace MMDash.Data.Models
{
    [Read(PermissionLevel = SecurityPermissionLevels.AllowAll)]
    [Edit(Roles = "Admin")]
    public class Stream
    {
        public int StreamId { get; set; }
        public int ServerId { get; set; }
        public Server Server { get; set; }
        public int CallSignId { get; set; }
        public CallSign CallSign { get; set; }
        public DateTime StreamDateTime { get; set; }
        public string StreamNumber { get; set; }
        [Search]
        public string RepeaterId { get; set; }
        [Search]
        public string TalkGroup { get; set; }
        public string TimeSlot { get; set; }
    }
}
