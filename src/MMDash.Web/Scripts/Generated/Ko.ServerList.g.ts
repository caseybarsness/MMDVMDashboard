
/// <reference path="../coalesce.dependencies.d.ts" />

// Knockout List View Model for: Server
// Generated by IntelliTect.Coalesce

module ListViewModels {

    export namespace ServerDataSources {
        export class Default extends Coalesce.DataSource<ViewModels.Server> { }
                
        export class ServersWithoutChildren extends Coalesce.DataSource<ViewModels.Server> {
        }
    }

    export class ServerList extends Coalesce.BaseListViewModel<ViewModels.Server> {
        public readonly modelName: string = "Server";
        public readonly apiController: string = "/Server";
        public modelKeyName: string = "serverId";
        public itemClass: new () => ViewModels.Server = ViewModels.Server;

        public filter: {
            serverId?:string;
            logFileLocation?:string;
            displayName?:string;
            serverSearchString?:string;
            orderBy?:string;
        } = null;
    
        /** 
            The namespace containing all possible values of this.dataSource.
        */
        public dataSources: typeof ServerDataSources = ServerDataSources;

        /**
            The data source on the server to use when retrieving objects.
            Valid values are in this.dataSources.
        */
        public dataSource: Coalesce.DataSource<ViewModels.Server> = new this.dataSources.Default();

        public static coalesceConfig = new Coalesce.ListViewModelConfiguration<ServerList, ViewModels.Server>(Coalesce.GlobalConfiguration.listViewModel);
        public coalesceConfig: Coalesce.ListViewModelConfiguration<ServerList, ViewModels.Server>
            = new Coalesce.ListViewModelConfiguration<ServerList, ViewModels.Server>(ServerList.coalesceConfig);


        protected createItem = (newItem?: any, parent?: any) => new ViewModels.Server(newItem, parent);

        constructor() {
            super();
        }
    }
}