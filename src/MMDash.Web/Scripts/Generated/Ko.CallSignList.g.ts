
/// <reference path="../coalesce.dependencies.d.ts" />

// Knockout List View Model for: CallSign
// Generated by IntelliTect.Coalesce

module ListViewModels {

    export namespace CallSignDataSources {
        export class Default extends Coalesce.DataSource<ViewModels.CallSign> { }
                
        export class CallSignsWithoutChildren extends Coalesce.DataSource<ViewModels.CallSign> {
        }
    }

    export class CallSignList extends Coalesce.BaseListViewModel<ViewModels.CallSign> {
        public readonly modelName: string = "CallSign";
        public readonly apiController: string = "/CallSign";
        public modelKeyName: string = "callSignId";
        public itemClass: new () => ViewModels.CallSign = ViewModels.CallSign;

        public filter: {
            callSignId?:string;
            text?:string;
        } = null;
    
        /** 
            The namespace containing all possible values of this.dataSource.
        */
        public dataSources: typeof CallSignDataSources = CallSignDataSources;

        /**
            The data source on the server to use when retrieving objects.
            Valid values are in this.dataSources.
        */
        public dataSource: Coalesce.DataSource<ViewModels.CallSign> = new this.dataSources.Default();

        public static coalesceConfig = new Coalesce.ListViewModelConfiguration<CallSignList, ViewModels.CallSign>(Coalesce.GlobalConfiguration.listViewModel);
        public coalesceConfig: Coalesce.ListViewModelConfiguration<CallSignList, ViewModels.CallSign>
            = new Coalesce.ListViewModelConfiguration<CallSignList, ViewModels.CallSign>(CallSignList.coalesceConfig);


        protected createItem = (newItem?: any, parent?: any) => new ViewModels.CallSign(newItem, parent);

        constructor() {
            super();
        }
    }
}