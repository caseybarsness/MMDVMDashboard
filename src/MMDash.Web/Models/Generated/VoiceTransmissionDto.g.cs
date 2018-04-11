
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
    public partial class VoiceTransmissionDtoGen : GeneratedDto<MMDash.Data.Models.VoiceTransmission>
    {
        public VoiceTransmissionDtoGen() { }

        public int? VoiceTransmissionId { get; set; }
        public System.DateTime? TransmissionDateTimeStart { get; set; }
        public System.DateTime? TransmissionDateTimeEnd { get; set; }
        public int? CallSignId { get; set; }
        public MMDash.Web.Models.CallSignDtoGen CallSign { get; set; }
        public int? ServerId { get; set; }
        public MMDash.Web.Models.ServerDtoGen Server { get; set; }
        public string TalkGroup { get; set; }
        public double? LossRate { get; set; }

        /// <summary>
        /// Map from the domain object to the properties of the current DTO instance.
        /// </summary>
        public override void MapFrom(MMDash.Data.Models.VoiceTransmission obj, IMappingContext context, IncludeTree tree = null)
        {
            if (obj == null) return;
            var includes = context.Includes;

            // Fill the properties of the object.

            this.VoiceTransmissionId = obj.VoiceTransmissionId;
            this.TransmissionDateTimeStart = obj.TransmissionDateTimeStart;
            this.TransmissionDateTimeEnd = obj.TransmissionDateTimeEnd;
            this.CallSignId = obj.CallSignId;
            this.ServerId = obj.ServerId;
            this.TalkGroup = obj.TalkGroup;
            this.LossRate = obj.LossRate;
            if (tree == null || tree[nameof(this.CallSign)] != null)
                this.CallSign = obj.CallSign.MapToDto<MMDash.Data.Models.CallSign, CallSignDtoGen>(context, tree?[nameof(this.CallSign)]);

            if (tree == null || tree[nameof(this.Server)] != null)
                this.Server = obj.Server.MapToDto<MMDash.Data.Models.Server, ServerDtoGen>(context, tree?[nameof(this.Server)]);

        }

        /// <summary>
        /// Map from the current DTO instance to the domain object.
        /// </summary>
        public override void MapTo(MMDash.Data.Models.VoiceTransmission entity, IMappingContext context)
        {
            var includes = context.Includes;

            if (OnUpdate(entity, context)) return;

            entity.TransmissionDateTimeStart = (TransmissionDateTimeStart ?? DateTime.Today);
            entity.TransmissionDateTimeEnd = (TransmissionDateTimeEnd ?? DateTime.Today);
            entity.CallSignId = (CallSignId ?? 0);
            entity.ServerId = (ServerId ?? 0);
            entity.TalkGroup = TalkGroup;
            entity.LossRate = (LossRate ?? 0);
        }

    }
}
