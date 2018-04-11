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
    public class IpLog
    {
        public int IpLogId { get; set; }
        public int RadioIdLogId { get; set; }
        public RadioIdLog RadioIdLog { get; set; }
        public DateTime LogDateTime { get; set; }
        public string IpAddress { get; set; }
        public string Lat { get; set; }
        public string Long { get; set; }
        [NotMapped]
        public string CallSignString { get; set; }

        public class MappableIps : StandardDataSource<IpLog, AppDbContext>
        {
            public MappableIps(CrudContext<AppDbContext> context) : base(context)
            {

            }
            public override IQueryable<IpLog> GetQuery(IDataSourceParameters parameters)
                => Db.IpLogs.Where(x => x.Lat.Length > 0 && x.Long.Length > 0).GroupBy(x => new { x.RadioIdLogId, x.Lat, x.Long }).Select(log => new IpLog() {
                    IpLogId = log.OrderByDescending(x => x.LogDateTime).First().IpLogId,
                    Lat = log.OrderByDescending(x => x.LogDateTime).First().Lat,
                    Long = log.OrderByDescending(x => x.LogDateTime).First().Long,
                    RadioIdLogId = log.OrderByDescending(x => x.LogDateTime).First().RadioIdLogId,
                    IpAddress = log.OrderByDescending(x => x.LogDateTime).First().IpAddress,
                    LogDateTime = log.OrderByDescending(x => x.LogDateTime).First().LogDateTime
                });

            public override void TransformResults(IReadOnlyList<IpLog> results, IDataSourceParameters parameters)
            {
                foreach (var result in results)
                {
                    result.CallSignString = Db.RadioIdLogs.IncludeChildren().Where(x => x.RadioIdLogId == result.RadioIdLogId).FirstOrDefault().CallSign.Text ?? "NULL";
                }
            }

        }
    }
}
