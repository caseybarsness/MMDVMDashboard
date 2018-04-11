using IntelliTect.Coalesce;
using IntelliTect.Coalesce.DataAnnotations;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.Linq;
using System.Text;

namespace MMDash.Data.Models
{
    [Read(PermissionLevel = SecurityPermissionLevels.AllowAll)]
    [Edit(Roles = "Admin")]
    public class Server
    {
        public int ServerId { get; set; }
        public string LogFileLocation { get; set; }
        [ListText]
        public string DisplayName { get; set; }
        public string ServerSearchString { get; set; }
        public IEnumerable<LogEntry> LogEntries { get; set; }
        [DefaultOrderBy]
        public int OrderBy { get; set; }
        [NotMapped]
        public int LogCount { get; set; }
        [NotMapped]
        public int OnlineLogs { get; set; }
        [NotMapped]
        public int OfflineLogs { get; set; }
        [NotMapped]
        public int TransmissionsAndStreams { get; set; }

        public class ServersWithoutChildren : StandardDataSource<Server, AppDbContext>
        {
            public ServersWithoutChildren(CrudContext<AppDbContext> context) : base(context)
            {

            }
            public override IQueryable<Server> GetQuery(IDataSourceParameters parameters)
                => Db.Servers;

            public override void TransformResults(IReadOnlyList<Server> results, IDataSourceParameters parameters)
            {
                foreach (var result in results)
                {
                    result.LogCount = Db.LogEntries.Where(x => x.ServerId == result.ServerId).Count();
                    result.OnlineLogs = Db.LogEntries
                .IncludedSeparately(x => x.Server)
                .IncludedSeparately(x => x.CallSign)
                .OrderByDescending(x => x.EntryDateTime)
                .GroupBy(x => x.CallSign)
                .Where(x => x.OrderByDescending(y => y.EntryDateTime).First().LogEntryType == LogEntryType.RepeaterConfigStart)
                .Select(log => new LogEntry()
                {
                    LogEntryId = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().LogEntryId,
                    CallSign = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().CallSign,
                    EntryDateTime = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().EntryDateTime,
                    Entry = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().Entry,
                    Server = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().Server,
                    ServerId = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().ServerId
                }).Where(x => x.ServerId == result.ServerId).Count();
                    result.OfflineLogs = Db.LogEntries
                .IncludedSeparately(x => x.Server)
                .IncludedSeparately(x => x.CallSign)
                .OrderByDescending(x => x.EntryDateTime)
                .GroupBy(x => x.CallSign)
                .Where(x => x.OrderByDescending(y => y.EntryDateTime).First().LogEntryType == LogEntryType.ClientClosingDown)
                .Select(log => new LogEntry()
                {
                    LogEntryId = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().LogEntryId,
                    CallSign = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().CallSign,
                    EntryDateTime = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().EntryDateTime,
                    Entry = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().Entry,
                    Server = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().Server,
                    ServerId = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().ServerId
                }).Where(x => x.ServerId == result.ServerId).Count();
                    result.TransmissionsAndStreams = Db.VoiceTransmissions.Count(x => x.ServerId == result.ServerId) + Db.Streams.Count(x => x.ServerId == result.ServerId);

                }
            }
        }

    }
}
