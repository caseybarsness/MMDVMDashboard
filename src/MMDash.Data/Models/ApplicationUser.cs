using Microsoft.AspNetCore.Identity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace MMDash.Data.Models  
{
    public class ApplicationUser : IdentityUser
    {
        public int ApplicationUserId { get; set; }

        public string Name { get; set; }
    }
}
