
using IntelliTect.Coalesce;
using IntelliTect.Coalesce.Mapping;
using IntelliTect.Coalesce.Models;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Dynamic.Core;
using System.Security.Claims;

namespace MMDash.Web.Models
{
    public partial class CallSignDtoGen : GeneratedDto<MMDash.Data.Models.CallSign>
    {
        public CallSignDtoGen() { }

        public int? CallSignId { get; set; }
        public string Text { get; set; }
        public System.Collections.Generic.IEnumerable<MMDash.Web.Models.LogEntryDtoGen> LogEntries { get; set; }
        public System.Collections.Generic.IEnumerable<MMDash.Web.Models.VoiceTransmissionDtoGen> VoiceTransmissions { get; set; }
        public System.Collections.Generic.IEnumerable<MMDash.Web.Models.StreamDtoGen> Streams { get; set; }
        public int? LogCount { get; set; }
        public int? StreamCount { get; set; }
        public int? TransmissionCount { get; set; }

        /// <summary>
        /// Map from the domain object to the properties of the current DTO instance.
        /// </summary>
        public override void MapFrom(MMDash.Data.Models.CallSign obj, IMappingContext context, IncludeTree tree = null)
        {
            if (obj == null) return;
            var includes = context.Includes;

            // Fill the properties of the object.

            this.CallSignId = obj.CallSignId;
            this.Text = obj.Text;
            this.LogCount = obj.LogCount;
            this.StreamCount = obj.StreamCount;
            this.TransmissionCount = obj.TransmissionCount;
            var propValLogEntries = obj.LogEntries;
            if (propValLogEntries != null && (tree == null || tree[nameof(this.LogEntries)] != null))
            {
                this.LogEntries = propValLogEntries
                    .AsQueryable().OrderBy("LogEntryId ASC").AsEnumerable<MMDash.Data.Models.LogEntry>()
                    .Select(f => f.MapToDto<MMDash.Data.Models.LogEntry, LogEntryDtoGen>(context, tree?[nameof(this.LogEntries)])).ToList();
            }
            else if (propValLogEntries == null && tree?[nameof(this.LogEntries)] != null)
            {
                this.LogEntries = new LogEntryDtoGen[0];
            }

            var propValVoiceTransmissions = obj.VoiceTransmissions;
            if (propValVoiceTransmissions != null && (tree == null || tree[nameof(this.VoiceTransmissions)] != null))
            {
                this.VoiceTransmissions = propValVoiceTransmissions
                    .AsQueryable().OrderBy("VoiceTransmissionId ASC").AsEnumerable<MMDash.Data.Models.VoiceTransmission>()
                    .Select(f => f.MapToDto<MMDash.Data.Models.VoiceTransmission, VoiceTransmissionDtoGen>(context, tree?[nameof(this.VoiceTransmissions)])).ToList();
            }
            else if (propValVoiceTransmissions == null && tree?[nameof(this.VoiceTransmissions)] != null)
            {
                this.VoiceTransmissions = new VoiceTransmissionDtoGen[0];
            }

            var propValStreams = obj.Streams;
            if (propValStreams != null && (tree == null || tree[nameof(this.Streams)] != null))
            {
                this.Streams = propValStreams
                    .AsQueryable().OrderBy("StreamId ASC").AsEnumerable<MMDash.Data.Models.Stream>()
                    .Select(f => f.MapToDto<MMDash.Data.Models.Stream, StreamDtoGen>(context, tree?[nameof(this.Streams)])).ToList();
            }
            else if (propValStreams == null && tree?[nameof(this.Streams)] != null)
            {
                this.Streams = new StreamDtoGen[0];
            }

        }

        /// <summary>
        /// Map from the current DTO instance to the domain object.
        /// </summary>
        public override void MapTo(MMDash.Data.Models.CallSign entity, IMappingContext context)
        {
            var includes = context.Includes;

            if (OnUpdate(entity, context)) return;

            entity.Text = Text;
            entity.LogCount = (LogCount ?? 0);
            entity.StreamCount = (StreamCount ?? 0);
            entity.TransmissionCount = (TransmissionCount ?? 0);
        }

    }
}
