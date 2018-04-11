
using MMDash.Web.Models;
using IntelliTect.Coalesce;
using IntelliTect.Coalesce.Api;
using IntelliTect.Coalesce.Api.Controllers;
using IntelliTect.Coalesce.Api.DataSources;
using IntelliTect.Coalesce.Mapping;
using IntelliTect.Coalesce.Mapping.IncludeTrees;
using IntelliTect.Coalesce.Models;
using IntelliTect.Coalesce.TypeDefinition;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Net;
using System.Threading.Tasks;

namespace MMDash.Web.Api
{
    [Route("api/RadioIdLog")]
    [Authorize]
    [ServiceFilter(typeof(IApiActionFilter))]
    public partial class RadioIdLogController
        : BaseApiController<MMDash.Data.Models.RadioIdLog, RadioIdLogDtoGen, MMDash.Data.AppDbContext>
    {
        public RadioIdLogController(MMDash.Data.AppDbContext db) : base(db)
        {
            GeneratedForClassViewModel = ReflectionRepository.Global.GetClassViewModel<MMDash.Data.Models.RadioIdLog>();
        }


        [HttpGet("get/{id}")]
        [AllowAnonymous]
        public virtual Task<ItemResult<RadioIdLogDtoGen>> Get(
            int id,
            DataSourceParameters parameters,
            IDataSource<MMDash.Data.Models.RadioIdLog> dataSource)
            => GetImplementation(id, parameters, dataSource);

        [HttpGet("list")]
        [AllowAnonymous]
        public virtual Task<ListResult<RadioIdLogDtoGen>> List(
            ListParameters parameters,
            IDataSource<MMDash.Data.Models.RadioIdLog> dataSource)
            => ListImplementation(parameters, dataSource);

        [HttpGet("count")]
        [AllowAnonymous]
        public virtual Task<int> Count(
            FilterParameters parameters,
            IDataSource<MMDash.Data.Models.RadioIdLog> dataSource)
            => CountImplementation(parameters, dataSource);


        [HttpPost("delete/{id}")]
        [Authorize]
        public virtual Task<ItemResult> Delete(
            int id,
            IBehaviors<MMDash.Data.Models.RadioIdLog> behaviors,
            IDataSource<MMDash.Data.Models.RadioIdLog> dataSource)
            => DeleteImplementation(id, new DataSourceParameters(), dataSource, behaviors);


        [HttpPost("save")]
        [Authorize]
        public virtual Task<ItemResult<RadioIdLogDtoGen>> Save(
            RadioIdLogDtoGen dto,
            [FromQuery] DataSourceParameters parameters,
            IDataSource<MMDash.Data.Models.RadioIdLog> dataSource,
            IBehaviors<MMDash.Data.Models.RadioIdLog> behaviors)
            => SaveImplementation(dto, parameters, dataSource, behaviors);

        /// <summary>
        /// Downloads CSV of RadioIdLogDtoGen
        /// </summary>
        [HttpGet("csvDownload")]
        [AllowAnonymous]
        public virtual Task<FileResult> CsvDownload(
            ListParameters parameters,
            IDataSource<MMDash.Data.Models.RadioIdLog> dataSource)
            => CsvDownloadImplementation(parameters, dataSource);

        /// <summary>
        /// Returns CSV text of RadioIdLogDtoGen
        /// </summary>
        [HttpGet("csvText")]
        [AllowAnonymous]
        public virtual Task<string> CsvText(
            ListParameters parameters,
            IDataSource<MMDash.Data.Models.RadioIdLog> dataSource)
            => CsvTextImplementation(parameters, dataSource);


        /// <summary>
        /// Saves CSV data as an uploaded file
        /// </summary>
        [HttpPost("csvUpload")]
        [Authorize]
        public virtual Task<IEnumerable<ItemResult>> CsvUpload(
            IFormFile file,
            IDataSource<MMDash.Data.Models.RadioIdLog> dataSource,
            IBehaviors<MMDash.Data.Models.RadioIdLog> behaviors,
            bool hasHeader = true)
            => CsvUploadImplementation(file, dataSource, behaviors, hasHeader);

        /// <summary>
        /// Saves CSV data as a posted string
        /// </summary>
        [HttpPost("csvSave")]
        [Authorize]
        public virtual Task<IEnumerable<ItemResult>> CsvSave(
            string csv,
            IDataSource<MMDash.Data.Models.RadioIdLog> dataSource,
            IBehaviors<MMDash.Data.Models.RadioIdLog> behaviors,
            bool hasHeader = true)
            => CsvSaveImplementation(csv, dataSource, behaviors, hasHeader);

        // Methods from data class exposed through API Controller.
    }
}
