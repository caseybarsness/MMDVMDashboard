using IntelliTect.Coalesce;
using IntelliTect.Coalesce.DataAnnotations;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace MMDash.Data.Models
{

    public enum LogEntryType
    {
        RepeaterConfigStart = 1,
        ClientClosingDown  = 2,
        AMBEStream = 3,
        VoiceTransmissionStart = 4,
        VoiceTransmissionEnd = 5
    }


    [Read(PermissionLevel = SecurityPermissionLevels.AllowAll)]
    [Edit(Roles = "Admin")]
    public class LogEntry
    {
        public int LogEntryId { get; set; }
        public int CallSignId { get; set; }
        public CallSign CallSign { get; set; }
        public DateTime EntryDateTime { get; set; }
        [Search]
        public string Entry { get; set; }
        public int ServerId { get; set; }
        public Server Server { get; set; }
        public LogEntryType LogEntryType { get; set; }

        [Coalesce]
        //public object Summary(AppDbContext Db)
        //        => Db.LogEntries
        //        .OrderByDescending(x => x.EntryDateTime)
        //        .GroupBy(x => x.CallSign);

        public class OnlineLogs : StandardDataSource<LogEntry, AppDbContext>
        {
            public OnlineLogs(CrudContext<AppDbContext> context) : base(context)
            {
                
            }
            public override IQueryable<LogEntry> GetQuery(IDataSourceParameters parameters)
                => Db.LogEntries
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
                });

        }

        public class OfflineLogs : StandardDataSource<LogEntry, AppDbContext>
        {
            public OfflineLogs(CrudContext<AppDbContext> context) : base(context)
            {

            }
            public override IQueryable<LogEntry> GetQuery(IDataSourceParameters parameters)
                => Db.LogEntries
                .IncludedSeparately(x => x.Server)
                .IncludedSeparately(x => x.CallSign)
                .OrderByDescending(x => x.EntryDateTime)
                .GroupBy(x => x.CallSign)
                .Where( x => x.OrderByDescending(y => y.EntryDateTime).First().LogEntryType == LogEntryType.ClientClosingDown)
                .Select(log => new LogEntry()
                {
                    LogEntryId = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().LogEntryId,
                    CallSign = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().CallSign,
                    EntryDateTime = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().EntryDateTime,
                    Entry = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().Entry,
                    Server = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().Server,
                    ServerId = log.OrderByDescending(x => x.EntryDateTime).FirstOrDefault().ServerId
                });

        }

    }
}
