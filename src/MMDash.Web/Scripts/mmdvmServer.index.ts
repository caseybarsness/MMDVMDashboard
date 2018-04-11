
/// <reference path="viewmodels.generated.d.ts" />


module MMDash {
    export class MMDVMServerModule {
        private strServerSearchText = Coalesce.Utilities.GetUrlParameter("server");
        public server = new ViewModels.Server();
        public noDataOffline = ko.observable(false);
        public noDataOnline = ko.observable(false);
        private servers = new ListViewModels.ServerList();
        public onlineUsers = new ListViewModels.LogEntryList();
        public offlineUsers = new ListViewModels.LogEntryList();
        public isLoadingOnline = ko.observable(true);
        public isLoadingOffline = ko.observable(true);
        public isLoadingServer = ko.observable(true);

        load(callback?: (self: this) => void) {
            var self = this;
            self.servers.dataSource = new self.servers.dataSources.ServersWithoutChildren();
            self.servers.filter = {
                serverSearchString: self.strServerSearchText
            }
            self.servers.load(function () {
                if (self.servers.items().length > 0) {
                    var id = self.servers.items()[0].serverId()
                    self.server.dataSource = new self.server.dataSources.ServersWithoutChildren();
                    self.server.load(id, function () {
                        self.isLoadingServer(false);
                    });
                    self.onlineUsers.filter = {
                        serverId: id.toString()
                    }
                    self.onlineUsers.dataSource = new self.onlineUsers.dataSources.OnlineLogs();
                    self.onlineUsers.pageSize(50);
                    self.onlineUsers.load(function () {
                        self.isLoadingOnline(false);
                        if (self.onlineUsers.count() == 0) {
                            self.noDataOnline(true);
                        }
                    });

                    self.offlineUsers.filter = {
                        serverId: id.toString()
                    }
                    self.offlineUsers.dataSource = new self.offlineUsers.dataSources.OfflineLogs();
                    self.offlineUsers.pageSize(50);
                    self.offlineUsers.load(function () {
                        self.isLoadingOffline(false);
                        if (self.offlineUsers.count() == 0) {
                            self.noDataOffline(true);
                        }
                    });

                }
            });
        }

        constructor() {
            var self = this;
        }

    }

    $(function () {
        var vm = new MMDVMServerModule();
        ko.applyBindings(vm);
        vm.load();
    })

}