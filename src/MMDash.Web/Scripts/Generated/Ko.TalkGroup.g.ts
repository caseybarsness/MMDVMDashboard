
/// <reference path="../coalesce.dependencies.d.ts" />

// Knockout View Model for: TalkGroup
// Generated by IntelliTect.Coalesce

module ViewModels {

	export class TalkGroup extends Coalesce.BaseViewModel
    {
        public readonly modelName = "TalkGroup";
        public readonly primaryKeyName: keyof this = "talkGroupId";
        public readonly modelDisplayName = "Talk Group";
        public readonly apiController = "/TalkGroup";
        public readonly viewController = "/TalkGroup";

        /** Behavioral configuration for all instances of TalkGroup. Can be overidden on each instance via instance.coalesceConfig. */
        public static coalesceConfig: Coalesce.ViewModelConfiguration<TalkGroup>
            = new Coalesce.ViewModelConfiguration<TalkGroup>(Coalesce.GlobalConfiguration.viewModel);

        /** Behavioral configuration for the current TalkGroup instance. */
        public coalesceConfig: Coalesce.ViewModelConfiguration<this>
            = new Coalesce.ViewModelConfiguration<TalkGroup>(TalkGroup.coalesceConfig);
    
        /** 
            The namespace containing all possible values of this.dataSource.
        */
        public dataSources: typeof ListViewModels.TalkGroupDataSources = ListViewModels.TalkGroupDataSources;
    

        public talkGroupId: KnockoutObservable<number> = ko.observable(null);
        public ts1Id: KnockoutObservable<string> = ko.observable(null);
        public ts2Id: KnockoutObservable<string> = ko.observable(null);
        public name: KnockoutObservable<string> = ko.observable(null);

       
        






        /** 
            Load the ViewModel object from the DTO. 
            @param force: Will override the check against isLoading that is done to prevent recursion. False is default.
            @param allowCollectionDeletes: Set true when entire collections are loaded. True is the default. In some cases only a partial collection is returned, set to false to only add/update collections.
        */
        public loadFromDto = (data: any, force: boolean = false, allowCollectionDeletes: boolean = true): void => {
            if (!data || (!force && this.isLoading())) return;
            this.isLoading(true);
            // Set the ID 
            this.myId = data.talkGroupId;
            this.talkGroupId(data.talkGroupId);
            // Load the lists of other objects
            // Objects are loaded first so that they are available when the IDs get loaded.
            // This handles the issue with populating select lists with correct data because we now have the object.

            // The rest of the objects are loaded now.
            this.ts1Id(data.ts1Id);
            this.ts2Id(data.ts2Id);
            this.name(data.name);
            if (this.coalesceConfig.onLoadFromDto()){
                this.coalesceConfig.onLoadFromDto()(this as any);
            }
            this.isLoading(false);
            this.isDirty(false);
    
            if (this.coalesceConfig.validateOnLoadFromDto()) this.validate();
        };
    
        /** Saves this object into a data transfer object to send to the server. */
        public saveToDto = (): any => {
            var dto: any = {};
            dto.talkGroupId = this.talkGroupId();
            
            dto.ts1Id = this.ts1Id();
            dto.ts2Id = this.ts2Id();
            dto.name = this.name();
            
            return dto;
        }

        /**
            Loads any child objects that have an ID set, but not the full object.
            This is useful when creating an object that has a parent object and the ID is set on the new child.
        */
        public loadChildren = (callback?: () => void): void => {
            var loadingCount = 0;
            if (loadingCount == 0 && typeof(callback) == "function"){
                callback();
            }
        };
        
        public setupValidation = (): void => {
            if (this.errors !== null) return;
            this.errors = ko.validation.group([
            ]);
            this.warnings = ko.validation.group([
            ]);
        }
    
        // Computed Observable for edit URL
        public editUrl: KnockoutComputed<string> = ko.pureComputed(() => {
            return this.coalesceConfig.baseViewUrl() + this.viewController + "/CreateEdit?id=" + this.talkGroupId();
        });

        constructor(newItem?: object, parent?: Coalesce.BaseViewModel | ListViewModels.TalkGroupList){
            super(parent);
            this.baseInitialize();
            var self = this;
            self.myId;

            // Create computeds for display for objects

    



            // This stuff needs to be done after everything else is set up.
            self.ts1Id.subscribe(self.autoSave);
            self.ts2Id.subscribe(self.autoSave);
            self.name.subscribe(self.autoSave);
        
            if (newItem) {
                self.loadFromDto(newItem, true);
            }
        }
    }





    export namespace TalkGroup {
    }
}