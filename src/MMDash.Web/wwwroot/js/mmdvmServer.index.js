/// <reference path="viewmodels.generated.d.ts" />
var MMDash;
/// <reference path="viewmodels.generated.d.ts" />
(function (MMDash) {
    var MMDVMServerModule = (function () {
        function MMDVMServerModule() {
            this.strServerSearchText = Coalesce.Utilities.GetUrlParameter("server");
            this.server = new ViewModels.Server();
            this.noDataOffline = ko.observable(false);
            this.noDataOnline = ko.observable(false);
            this.servers = new ListViewModels.ServerList();
            this.onlineUsers = new ListViewModels.LogEntryList();
            this.offlineUsers = new ListViewModels.LogEntryList();
            this.isLoadingOnline = ko.observable(true);
            this.isLoadingOffline = ko.observable(true);
            this.isLoadingServer = ko.observable(true);
            var self = this;
        }
        MMDVMServerModule.prototype.load = function (callback) {
            var self = this;
            self.servers.dataSource = new self.servers.dataSources.ServersWithoutChildren();
            self.servers.filter = {
                serverSearchString: self.strServerSearchText
            };
            self.servers.load(function () {
                if (self.servers.items().length > 0) {
                    var id = self.servers.items()[0].serverId();
                    self.server.dataSource = new self.server.dataSources.ServersWithoutChildren();
                    self.server.load(id, function () {
                        self.isLoadingServer(false);
                    });
                    self.onlineUsers.filter = {
                        serverId: id.toString()
                    };
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
                    };
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
        };
        return MMDVMServerModule;
    }());
    MMDash.MMDVMServerModule = MMDVMServerModule;
    $(function () {
        var vm = new MMDVMServerModule();
        ko.applyBindings(vm);
        vm.load();
    });
})(MMDash || (MMDash = {}));

//# sourceMappingURL=mmdvmServer.index.js.map
