
/// <reference path="../coalesce.dependencies.d.ts" />

// Knockout View Model for: RadioIdLog
// Generated by IntelliTect.Coalesce

module ViewModels {

	export class RadioIdLog extends Coalesce.BaseViewModel
    {
        public readonly modelName = "RadioIdLog";
        public readonly primaryKeyName: keyof this = "radioIdLogId";
        public readonly modelDisplayName = "Radio Id Log";
        public readonly apiController = "/RadioIdLog";
        public readonly viewController = "/RadioIdLog";

        /** Behavioral configuration for all instances of RadioIdLog. Can be overidden on each instance via instance.coalesceConfig. */
        public static coalesceConfig: Coalesce.ViewModelConfiguration<RadioIdLog>
            = new Coalesce.ViewModelConfiguration<RadioIdLog>(Coalesce.GlobalConfiguration.viewModel);

        /** Behavioral configuration for the current RadioIdLog instance. */
        public coalesceConfig: Coalesce.ViewModelConfiguration<this>
            = new Coalesce.ViewModelConfiguration<RadioIdLog>(RadioIdLog.coalesceConfig);
    
        /** 
            The namespace containing all possible values of this.dataSource.
        */
        public dataSources: typeof ListViewModels.RadioIdLogDataSources = ListViewModels.RadioIdLogDataSources;
    

        public radioIdLogId: KnockoutObservable<number> = ko.observable(null);
        public callSignId: KnockoutObservable<number> = ko.observable(null);
        public callSign: KnockoutObservable<ViewModels.CallSign> = ko.observable(null);
        public serverId: KnockoutObservable<number> = ko.observable(null);
        public server: KnockoutObservable<ViewModels.Server> = ko.observable(null);
        public radioId: KnockoutObservable<string> = ko.observable(null);

       
        /** Display text for CallSign */
        public callSignText: KnockoutComputed<string>;
        /** Display text for Server */
        public serverText: KnockoutComputed<string>;
        


        /** Pops up a stock editor for object callSign */
        public showCallSignEditor: (callback?: any) => void;
        /** Pops up a stock editor for object server */
        public showServerEditor: (callback?: any) => void;




        /** 
            Load the ViewModel object from the DTO. 
            @param force: Will override the check against isLoading that is done to prevent recursion. False is default.
            @param allowCollectionDeletes: Set true when entire collections are loaded. True is the default. In some cases only a partial collection is returned, set to false to only add/update collections.
        */
        public loadFromDto = (data: any, force: boolean = false, allowCollectionDeletes: boolean = true): void => {
            if (!data || (!force && this.isLoading())) return;
            this.isLoading(true);
            // Set the ID 
            this.myId = data.radioIdLogId;
            this.radioIdLogId(data.radioIdLogId);
            // Load the lists of other objects
            // Objects are loaded first so that they are available when the IDs get loaded.
            // This handles the issue with populating select lists with correct data because we now have the object.
            if (!data.callSign) { 
                if (data.callSignId != this.callSignId()) {
                    this.callSign(null);
                }
            } else {
                if (!this.callSign()){
                    this.callSign(new CallSign(data.callSign, this));
                } else {
                    this.callSign().loadFromDto(data.callSign);
                }
                if (this.parent instanceof CallSign && this.parent !== this.callSign() && this.parent.callSignId() == this.callSign().callSignId())
                {
                    this.parent.loadFromDto(data.callSign, null, false);
                }
            }
            if (!data.server) { 
                if (data.serverId != this.serverId()) {
                    this.server(null);
                }
            } else {
                if (!this.server()){
                    this.server(new Server(data.server, this));
                } else {
                    this.server().loadFromDto(data.server);
                }
                if (this.parent instanceof Server && this.parent !== this.server() && this.parent.serverId() == this.server().serverId())
                {
                    this.parent.loadFromDto(data.server, null, false);
                }
            }

            // The rest of the objects are loaded now.
            this.callSignId(data.callSignId);
            this.serverId(data.serverId);
            this.radioId(data.radioId);
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
            dto.radioIdLogId = this.radioIdLogId();
            
            dto.callSignId = this.callSignId();
            if (!dto.callSignId && this.callSign()) {
                dto.callSignId = this.callSign().callSignId();
            }
            dto.serverId = this.serverId();
            if (!dto.serverId && this.server()) {
                dto.serverId = this.server().serverId();
            }
            dto.radioId = this.radioId();
            
            return dto;
        }

        /**
            Loads any child objects that have an ID set, but not the full object.
            This is useful when creating an object that has a parent object and the ID is set on the new child.
        */
        public loadChildren = (callback?: () => void): void => {
            var loadingCount = 0;
            // See if this.callSign needs to be loaded.
            if (this.callSign() == null && this.callSignId() != null){
                loadingCount++;
                var callSignObj = new CallSign();
                callSignObj.load(this.callSignId(), () => {
                    loadingCount--;
                    this.callSign(callSignObj);
                    if (loadingCount == 0 && typeof(callback) == "function"){
                        callback();
                    }
                });
            }
            // See if this.server needs to be loaded.
            if (this.server() == null && this.serverId() != null){
                loadingCount++;
                var serverObj = new Server();
                serverObj.load(this.serverId(), () => {
                    loadingCount--;
                    this.server(serverObj);
                    if (loadingCount == 0 && typeof(callback) == "function"){
                        callback();
                    }
                });
            }
            if (loadingCount == 0 && typeof(callback) == "function"){
                callback();
            }
        };
        
        public setupValidation = (): void => {
            if (this.errors !== null) return;
            this.errors = ko.validation.group([
                this.callSignId.extend({ required: {params: true, message: "Call Sign is required."} }),
                this.serverId.extend({ required: {params: true, message: "Server is required."} }),
            ]);
            this.warnings = ko.validation.group([
            ]);
        }
    
        // Computed Observable for edit URL
        public editUrl: KnockoutComputed<string> = ko.pureComputed(() => {
            return this.coalesceConfig.baseViewUrl() + this.viewController + "/CreateEdit?id=" + this.radioIdLogId();
        });

        constructor(newItem?: object, parent?: Coalesce.BaseViewModel | ListViewModels.RadioIdLogList){
            super(parent);
            this.baseInitialize();
            var self = this;
            self.myId;

            // Create computeds for display for objects
			self.callSignText = ko.pureComputed(function()
			{   // If the object exists, use the text value. Otherwise show 'None'
				if (self.callSign() && self.callSign().text()) {
					return self.callSign().text().toString();
				} else {
					return "None";
				}
			});
			self.serverText = ko.pureComputed(function()
			{   // If the object exists, use the text value. Otherwise show 'None'
				if (self.server() && self.server().displayName()) {
					return self.server().displayName().toString();
				} else {
					return "None";
				}
			});

    


            self.showCallSignEditor = function(callback: any) {
                if (!self.callSign()) {
                    self.callSign(new CallSign());
                }
                self.callSign().showEditor(callback)
            };
            self.showServerEditor = function(callback: any) {
                if (!self.server()) {
                    self.server(new Server());
                }
                self.server().showEditor(callback)
            };

            // This stuff needs to be done after everything else is set up.
            self.callSignId.subscribe(self.autoSave);
            self.callSign.subscribe(self.autoSave);
            self.serverId.subscribe(self.autoSave);
            self.server.subscribe(self.autoSave);
            self.radioId.subscribe(self.autoSave);
        
            if (newItem) {
                self.loadFromDto(newItem, true);
            }
        }
    }





    export namespace RadioIdLog {
    }
}