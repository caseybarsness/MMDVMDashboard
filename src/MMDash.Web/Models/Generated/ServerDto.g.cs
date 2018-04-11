
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
    public partial class ServerDtoGen : GeneratedDto<MMDash.Data.Models.Server>
    {
        public ServerDtoGen() { }

        public int? ServerId { get; set; }
        public string LogFileLocation { get; set; }
        public string DisplayName { get; set; }
        public string ServerSearchString { get; set; }
        public System.Collections.Generic.IEnumerable<MMDash.Web.Models.LogEntryDtoGen> LogEntries { get; set; }
        public int? OrderBy { get; set; }
        public int? LogCount { get; set; }
        public int? OnlineLogs { get; set; }
        public int? OfflineLogs { get; set; }
        public int? TransmissionsAndStreams { get; set; }

        /// <summary>
        /// Map from the domain object to the properties of the current DTO instance.
        /// </summary>
        public override void MapFrom(MMDash.Data.Models.Server obj, IMappingContext context, IncludeTree tree = null)
        {
            if (obj == null) return;
            var includes = context.Includes;

            // Fill the properties of the object.

            this.ServerId = obj.ServerId;
            this.LogFileLocation = obj.LogFileLocation;
            this.DisplayName = obj.DisplayName;
            this.ServerSearchString = obj.ServerSearchString;
            this.OrderBy = obj.OrderBy;
            this.LogCount = obj.LogCount;
            this.OnlineLogs = obj.OnlineLogs;
            this.OfflineLogs = obj.OfflineLogs;
            this.TransmissionsAndStreams = obj.TransmissionsAndStreams;
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

        }

        /// <summary>
        /// Map from the current DTO instance to the domain object.
        /// </summary>
        public override void MapTo(MMDash.Data.Models.Server entity, IMappingContext context)
        {
            var includes = context.Includes;

            if (OnUpdate(entity, context)) return;

            entity.LogFileLocation = LogFileLocation;
            entity.DisplayName = DisplayName;
            entity.ServerSearchString = ServerSearchString;
            entity.OrderBy = (OrderBy ?? 0);
            entity.LogCount = (LogCount ?? 0);
            entity.OnlineLogs = (OnlineLogs ?? 0);
            entity.OfflineLogs = (OfflineLogs ?? 0);
            entity.TransmissionsAndStreams = (TransmissionsAndStreams ?? 0);
        }

    }
}
