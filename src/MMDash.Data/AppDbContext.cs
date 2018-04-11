using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;
using MMDash.Data.Models;
using IntelliTect.Coalesce;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;

namespace MMDash.Data
{
    [Coalesce]
    public class AppDbContext : IdentityDbContext<ApplicationUser>
    {
        public DbSet<ApplicationUser> ApplicationUsers { get; set; }
        public DbSet<LogEntry> LogEntries { get; set; }
        public DbSet<Server> Servers { get; set; }
        public DbSet<CallSign> CallSigns { get; set; }
        public DbSet<Stream> Streams { get; set; }
        public DbSet<TalkGroup> TalkGroups { get; set; }
        public DbSet<VoiceTransmission> VoiceTransmissions { get; set; }
        public DbSet<IpLog> IpLogs { get; set; }
        public DbSet<RadioIdLog> RadioIdLogs { get; set; }

        public AppDbContext()
        {
        }

        public AppDbContext(DbContextOptions options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Remove cascading deletes.
            foreach (var relationship in builder.Model.GetEntityTypes().SelectMany(e => e.GetForeignKeys()))
            {
                relationship.DeleteBehavior = DeleteBehavior.Restrict;
            }
        }

        /// <summary>
        /// Migrates the database and sets up items that need to be set up from scratch.
        /// </summary>
        public void Initialize()
        {
            try
            {
                this.Database.Migrate();
            }
            catch (InvalidOperationException e) when (e.Message == "No service for type 'Microsoft.EntityFrameworkCore.Migrations.IMigrator' has been registered.")
            {
                // this exception is expected when using an InMemory database
            }
        }
    }
}
