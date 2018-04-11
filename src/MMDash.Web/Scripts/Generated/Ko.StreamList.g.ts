
/// <reference path="../coalesce.dependencies.d.ts" />

// Knockout List View Model for: Stream
// Generated by IntelliTect.Coalesce

module ListViewModels {

    export namespace StreamDataSources {
        export class Default extends Coalesce.DataSource<ViewModels.Stream> { }
            }

    export class StreamList extends Coalesce.BaseListViewModel<ViewModels.Stream> {
        public readonly modelName: string = "Stream";
        public readonly apiController: string = "/Stream";
        public modelKeyName: string = "streamId";
        public itemClass: new () => ViewModels.Stream = ViewModels.Stream;

        public filter: {
            streamId?:string;
            serverId?:string;
            callSignId?:string;
            streamDateTime?:string;
            streamNumber?:string;
            repeaterId?:string;
            talkGroup?:string;
            timeSlot?:string;
        } = null;
    
        /** 
            The namespace containing all possible values of this.dataSource.
        */
        public dataSources: typeof StreamDataSources = StreamDataSources;

        /**
            The data source on the server to use when retrieving objects.
            Valid values are in this.dataSources.
        */
        public dataSource: Coalesce.DataSource<ViewModels.Stream> = new this.dataSources.Default();

        public static coalesceConfig = new Coalesce.ListViewModelConfiguration<StreamList, ViewModels.Stream>(Coalesce.GlobalConfiguration.listViewModel);
        public coalesceConfig: Coalesce.ListViewModelConfiguration<StreamList, ViewModels.Stream>
            = new Coalesce.ListViewModelConfiguration<StreamList, ViewModels.Stream>(StreamList.coalesceConfig);


        protected createItem = (newItem?: any, parent?: any) => new ViewModels.Stream(newItem, parent);

        constructor() {
            super();
        }
    }
}