
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
    public partial class TalkGroupDtoGen : GeneratedDto<MMDash.Data.Models.TalkGroup>
    {
        public TalkGroupDtoGen() { }

        public int? TalkGroupId { get; set; }
        public string Ts1Id { get; set; }
        public string Ts2Id { get; set; }
        public string Name { get; set; }

        /// <summary>
        /// Map from the domain object to the properties of the current DTO instance.
        /// </summary>
        public override void MapFrom(MMDash.Data.Models.TalkGroup obj, IMappingContext context, IncludeTree tree = null)
        {
            if (obj == null) return;
            var includes = context.Includes;

            // Fill the properties of the object.

            this.TalkGroupId = obj.TalkGroupId;
            this.Ts1Id = obj.Ts1Id;
            this.Ts2Id = obj.Ts2Id;
            this.Name = obj.Name;
        }

        /// <summary>
        /// Map from the current DTO instance to the domain object.
        /// </summary>
        public override void MapTo(MMDash.Data.Models.TalkGroup entity, IMappingContext context)
        {
            var includes = context.Includes;

            if (OnUpdate(entity, context)) return;

            entity.Ts1Id = Ts1Id;
            entity.Ts2Id = Ts2Id;
            entity.Name = Name;
        }

    }
}
