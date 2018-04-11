
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
    public partial class IpLogDtoGen : GeneratedDto<MMDash.Data.Models.IpLog>
    {
        public IpLogDtoGen() { }

        public int? IpLogId { get; set; }
        public int? RadioIdLogId { get; set; }
        public MMDash.Web.Models.RadioIdLogDtoGen RadioIdLog { get; set; }
        public System.DateTime? LogDateTime { get; set; }
        public string IpAddress { get; set; }
        public string Lat { get; set; }
        public string Long { get; set; }
        public string CallSignString { get; set; }

        /// <summary>
        /// Map from the domain object to the properties of the current DTO instance.
        /// </summary>
        public override void MapFrom(MMDash.Data.Models.IpLog obj, IMappingContext context, IncludeTree tree = null)
        {
            if (obj == null) return;
            var includes = context.Includes;

            // Fill the properties of the object.

            this.IpLogId = obj.IpLogId;
            this.RadioIdLogId = obj.RadioIdLogId;
            this.LogDateTime = obj.LogDateTime;
            this.IpAddress = obj.IpAddress;
            this.Lat = obj.Lat;
            this.Long = obj.Long;
            this.CallSignString = obj.CallSignString;
            if (tree == null || tree[nameof(this.RadioIdLog)] != null)
                this.RadioIdLog = obj.RadioIdLog.MapToDto<MMDash.Data.Models.RadioIdLog, RadioIdLogDtoGen>(context, tree?[nameof(this.RadioIdLog)]);

        }

        /// <summary>
        /// Map from the current DTO instance to the domain object.
        /// </summary>
        public override void MapTo(MMDash.Data.Models.IpLog entity, IMappingContext context)
        {
            var includes = context.Includes;

            if (OnUpdate(entity, context)) return;

            entity.RadioIdLogId = (RadioIdLogId ?? 0);
            entity.LogDateTime = (LogDateTime ?? DateTime.Today);
            entity.IpAddress = IpAddress;
            entity.Lat = Lat;
            entity.Long = Long;
            entity.CallSignString = CallSignString;
        }

    }
}
