
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
    public partial class ApplicationUserDtoGen : GeneratedDto<MMDash.Data.Models.ApplicationUser>
    {
        public ApplicationUserDtoGen() { }

        public int? ApplicationUserId { get; set; }
        public string Name { get; set; }
        public string Id { get; set; }
        public string UserName { get; set; }
        public string NormalizedUserName { get; set; }
        public string Email { get; set; }
        public string NormalizedEmail { get; set; }
        public bool? EmailConfirmed { get; set; }
        public string PasswordHash { get; set; }
        public string SecurityStamp { get; set; }
        public string ConcurrencyStamp { get; set; }
        public string PhoneNumber { get; set; }
        public bool? PhoneNumberConfirmed { get; set; }
        public bool? TwoFactorEnabled { get; set; }
        public System.DateTimeOffset? LockoutEnd { get; set; }
        public bool? LockoutEnabled { get; set; }
        public int? AccessFailedCount { get; set; }

        /// <summary>
        /// Map from the domain object to the properties of the current DTO instance.
        /// </summary>
        public override void MapFrom(MMDash.Data.Models.ApplicationUser obj, IMappingContext context, IncludeTree tree = null)
        {
            if (obj == null) return;
            var includes = context.Includes;

            // Fill the properties of the object.

            this.ApplicationUserId = obj.ApplicationUserId;
            this.Name = obj.Name;
            this.Id = obj.Id;
            this.UserName = obj.UserName;
            this.NormalizedUserName = obj.NormalizedUserName;
            this.Email = obj.Email;
            this.NormalizedEmail = obj.NormalizedEmail;
            this.EmailConfirmed = obj.EmailConfirmed;
            this.PasswordHash = obj.PasswordHash;
            this.SecurityStamp = obj.SecurityStamp;
            this.ConcurrencyStamp = obj.ConcurrencyStamp;
            this.PhoneNumber = obj.PhoneNumber;
            this.PhoneNumberConfirmed = obj.PhoneNumberConfirmed;
            this.TwoFactorEnabled = obj.TwoFactorEnabled;
            this.LockoutEnd = obj.LockoutEnd;
            this.LockoutEnabled = obj.LockoutEnabled;
            this.AccessFailedCount = obj.AccessFailedCount;
        }

        /// <summary>
        /// Map from the current DTO instance to the domain object.
        /// </summary>
        public override void MapTo(MMDash.Data.Models.ApplicationUser entity, IMappingContext context)
        {
            var includes = context.Includes;

            if (OnUpdate(entity, context)) return;

            entity.Name = Name;
            entity.UserName = UserName;
            entity.NormalizedUserName = NormalizedUserName;
            entity.Email = Email;
            entity.NormalizedEmail = NormalizedEmail;
            entity.EmailConfirmed = (EmailConfirmed ?? false);
            entity.PasswordHash = PasswordHash;
            entity.SecurityStamp = SecurityStamp;
            entity.ConcurrencyStamp = ConcurrencyStamp;
            entity.PhoneNumber = PhoneNumber;
            entity.PhoneNumberConfirmed = (PhoneNumberConfirmed ?? false);
            entity.TwoFactorEnabled = (TwoFactorEnabled ?? false);
            entity.LockoutEnd = LockoutEnd;
            entity.LockoutEnabled = (LockoutEnabled ?? false);
            entity.AccessFailedCount = (AccessFailedCount ?? 0);
        }

    }
}
