using IntelliTect.Coalesce.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Text;

namespace MMDash.Data.Models
{
    [Read(PermissionLevel = SecurityPermissionLevels.AllowAll)]
    [Edit(Roles = "Admin")]
    public class VoiceTransmission
    {
        public int VoiceTransmissionId { get; set; }
        public DateTime TransmissionDateTimeStart { get; set; }
        public DateTime TransmissionDateTimeEnd { get; set; }
        public int CallSignId { get; set; }
        public CallSign CallSign { get; set; }
        public int ServerId { get; set; }
        public Server Server { get; set; }
        [Search]
        public string TalkGroup { get; set; }
        [Search]
        public double LossRate { get; set; }
    }
}
