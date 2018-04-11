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
    public class CallSign
    {
        public int CallSignId { get; set; }
        [ListText]
        [Search]
        public string Text { get; set; }
        public IEnumerable<LogEntry> LogEntries { get; set; }
        public IEnumerable<VoiceTransmission> VoiceTransmissions { get; set; }
        public IEnumerable<Stream> Streams { get; set; }
        [NotMapped]
        public int LogCount { get; set; }
        [NotMapped]
        public int StreamCount { get; set; }
        [NotMapped]
        public int TransmissionCount { get; set; }
        public class CallSignsWithoutChildren : StandardDataSource<CallSign, AppDbContext>
        {
            public CallSignsWithoutChildren(CrudContext<AppDbContext> context) : base(context)
            {

            }
            public override IQueryable<CallSign> GetQuery(IDataSourceParameters parameters)
                => Db.CallSigns;

            public override void TransformResults(IReadOnlyList<CallSign> results, IDataSourceParameters parameters)
            {
                foreach (var result in results)
                {
                    result.LogCount = Db.LogEntries.Where(x => x.CallSignId == result.CallSignId).Count();
                    result.StreamCount = Db.Streams.Where(x => x.CallSignId == result.CallSignId).Count();
                    result.TransmissionCount = Db.VoiceTransmissions.Where(x => x.CallSignId == result.CallSignId).Count();
                }
            }
        }

    }
}
