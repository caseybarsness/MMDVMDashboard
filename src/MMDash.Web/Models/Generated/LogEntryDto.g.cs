
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
    public partial class LogEntryDtoGen : GeneratedDto<MMDash.Data.Models.LogEntry>
    {
        public LogEntryDtoGen() { }

        public int? LogEntryId { get; set; }
        public int? CallSignId { get; set; }
        public MMDash.Web.Models.CallSignDtoGen CallSign { get; set; }
        public System.DateTime? EntryDateTime { get; set; }
        public string Entry { get; set; }
        public int? ServerId { get; set; }
        public MMDash.Web.Models.ServerDtoGen Server { get; set; }
        public MMDash.Data.Models.LogEntryType? LogEntryType { get; set; }

        /// <summary>
        /// Map from the domain object to the properties of the current DTO instance.
        /// </summary>
        public override void MapFrom(MMDash.Data.Models.LogEntry obj, IMappingContext context, IncludeTree tree = null)
        {
            if (obj == null) return;
            var includes = context.Includes;

            // Fill the properties of the object.

            this.LogEntryId = obj.LogEntryId;
            this.CallSignId = obj.CallSignId;
            this.EntryDateTime = obj.EntryDateTime;
            this.Entry = obj.Entry;
            this.ServerId = obj.ServerId;
            this.LogEntryType = obj.LogEntryType;
            if (tree == null || tree[nameof(this.CallSign)] != null)
                this.CallSign = obj.CallSign.MapToDto<MMDash.Data.Models.CallSign, CallSignDtoGen>(context, tree?[nameof(this.CallSign)]);

            if (tree == null || tree[nameof(this.Server)] != null)
                this.Server = obj.Server.MapToDto<MMDash.Data.Models.Server, ServerDtoGen>(context, tree?[nameof(this.Server)]);

        }

        /// <summary>
        /// Map from the current DTO instance to the domain object.
        /// </summary>
        public override void MapTo(MMDash.Data.Models.LogEntry entity, IMappingContext context)
        {
            var includes = context.Includes;

            if (OnUpdate(entity, context)) return;

            entity.CallSignId = (CallSignId ?? 0);
            entity.EntryDateTime = (EntryDateTime ?? DateTime.Today);
            entity.Entry = Entry;
            entity.ServerId = (ServerId ?? 0);
            entity.LogEntryType = (LogEntryType ?? 0);
        }

    }
}
