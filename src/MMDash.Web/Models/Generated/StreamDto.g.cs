
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
    public partial class StreamDtoGen : GeneratedDto<MMDash.Data.Models.Stream>
    {
        public StreamDtoGen() { }

        public int? StreamId { get; set; }
        public int? ServerId { get; set; }
        public MMDash.Web.Models.ServerDtoGen Server { get; set; }
        public int? CallSignId { get; set; }
        public MMDash.Web.Models.CallSignDtoGen CallSign { get; set; }
        public System.DateTime? StreamDateTime { get; set; }
        public string StreamNumber { get; set; }
        public string RepeaterId { get; set; }
        public string TalkGroup { get; set; }
        public string TimeSlot { get; set; }

        /// <summary>
        /// Map from the domain object to the properties of the current DTO instance.
        /// </summary>
        public override void MapFrom(MMDash.Data.Models.Stream obj, IMappingContext context, IncludeTree tree = null)
        {
            if (obj == null) return;
            var includes = context.Includes;

            // Fill the properties of the object.

            this.StreamId = obj.StreamId;
            this.ServerId = obj.ServerId;
            this.CallSignId = obj.CallSignId;
            this.StreamDateTime = obj.StreamDateTime;
            this.StreamNumber = obj.StreamNumber;
            this.RepeaterId = obj.RepeaterId;
            this.TalkGroup = obj.TalkGroup;
            this.TimeSlot = obj.TimeSlot;
            if (tree == null || tree[nameof(this.Server)] != null)
                this.Server = obj.Server.MapToDto<MMDash.Data.Models.Server, ServerDtoGen>(context, tree?[nameof(this.Server)]);

            if (tree == null || tree[nameof(this.CallSign)] != null)
                this.CallSign = obj.CallSign.MapToDto<MMDash.Data.Models.CallSign, CallSignDtoGen>(context, tree?[nameof(this.CallSign)]);

        }

        /// <summary>
        /// Map from the current DTO instance to the domain object.
        /// </summary>
        public override void MapTo(MMDash.Data.Models.Stream entity, IMappingContext context)
        {
            var includes = context.Includes;

            if (OnUpdate(entity, context)) return;

            entity.ServerId = (ServerId ?? 0);
            entity.CallSignId = (CallSignId ?? 0);
            entity.StreamDateTime = (StreamDateTime ?? DateTime.Today);
            entity.StreamNumber = StreamNumber;
            entity.RepeaterId = RepeaterId;
            entity.TalkGroup = TalkGroup;
            entity.TimeSlot = TimeSlot;
        }

    }
}
