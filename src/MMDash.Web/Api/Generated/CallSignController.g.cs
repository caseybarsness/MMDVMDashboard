
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
    [Route("api/CallSign")]
    [Authorize]
    [ServiceFilter(typeof(IApiActionFilter))]
    public partial class CallSignController
        : BaseApiController<MMDash.Data.Models.CallSign, CallSignDtoGen, MMDash.Data.AppDbContext>
    {
        public CallSignController(MMDash.Data.AppDbContext db) : base(db)
        {
            GeneratedForClassViewModel = ReflectionRepository.Global.GetClassViewModel<MMDash.Data.Models.CallSign>();
        }


        [HttpGet("get/{id}")]
        [AllowAnonymous]
        public virtual Task<ItemResult<CallSignDtoGen>> Get(
            int id,
            DataSourceParameters parameters,
            IDataSource<MMDash.Data.Models.CallSign> dataSource)
            => GetImplementation(id, parameters, dataSource);

        [HttpGet("list")]
        [AllowAnonymous]
        public virtual Task<ListResult<CallSignDtoGen>> List(
            ListParameters parameters,
            IDataSource<MMDash.Data.Models.CallSign> dataSource)
            => ListImplementation(parameters, dataSource);

        [HttpGet("count")]
        [AllowAnonymous]
        public virtual Task<int> Count(
            FilterParameters parameters,
            IDataSource<MMDash.Data.Models.CallSign> dataSource)
            => CountImplementation(parameters, dataSource);


        [HttpPost("delete/{id}")]
        [Authorize]
        public virtual Task<ItemResult> Delete(
            int id,
            IBehaviors<MMDash.Data.Models.CallSign> behaviors,
            IDataSource<MMDash.Data.Models.CallSign> dataSource)
            => DeleteImplementation(id, new DataSourceParameters(), dataSource, behaviors);


        [HttpPost("save")]
        [Authorize]
        public virtual Task<ItemResult<CallSignDtoGen>> Save(
            CallSignDtoGen dto,
            [FromQuery] DataSourceParameters parameters,
            IDataSource<MMDash.Data.Models.CallSign> dataSource,
            IBehaviors<MMDash.Data.Models.CallSign> behaviors)
            => SaveImplementation(dto, parameters, dataSource, behaviors);

        /// <summary>
        /// Downloads CSV of CallSignDtoGen
        /// </summary>
        [HttpGet("csvDownload")]
        [AllowAnonymous]
        public virtual Task<FileResult> CsvDownload(
            ListParameters parameters,
            IDataSource<MMDash.Data.Models.CallSign> dataSource)
            => CsvDownloadImplementation(parameters, dataSource);

        /// <summary>
        /// Returns CSV text of CallSignDtoGen
        /// </summary>
        [HttpGet("csvText")]
        [AllowAnonymous]
        public virtual Task<string> CsvText(
            ListParameters parameters,
            IDataSource<MMDash.Data.Models.CallSign> dataSource)
            => CsvTextImplementation(parameters, dataSource);


        /// <summary>
        /// Saves CSV data as an uploaded file
        /// </summary>
        [HttpPost("csvUpload")]
        [Authorize]
        public virtual Task<IEnumerable<ItemResult>> CsvUpload(
            IFormFile file,
            IDataSource<MMDash.Data.Models.CallSign> dataSource,
            IBehaviors<MMDash.Data.Models.CallSign> behaviors,
            bool hasHeader = true)
            => CsvUploadImplementation(file, dataSource, behaviors, hasHeader);

        /// <summary>
        /// Saves CSV data as a posted string
        /// </summary>
        [HttpPost("csvSave")]
        [Authorize]
        public virtual Task<IEnumerable<ItemResult>> CsvSave(
            string csv,
            IDataSource<MMDash.Data.Models.CallSign> dataSource,
            IBehaviors<MMDash.Data.Models.CallSign> behaviors,
            bool hasHeader = true)
            => CsvSaveImplementation(csv, dataSource, behaviors, hasHeader);

        // Methods from data class exposed through API Controller.
    }
}
