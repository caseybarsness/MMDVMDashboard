/// <reference path="viewmodels.generated.d.ts" />
var Ham;
/// <reference path="viewmodels.generated.d.ts" />
(function (Ham) {
    var HomeModule = (function () {
        function HomeModule() {
            this.servers = new ListViewModels.ServerList();
            var self = this;
        }
        HomeModule.prototype.OnlineUsers = function (id) {
            var list = new ListViewModels.LogEntryList();
            list.filter = {
                serverId: id
            };
            list.dataSource = new list.dataSources.OnlineLogs();
            list.load();
            return list;
        };
        HomeModule.prototype.OfflineUsers = function (id) {
            var list = new ListViewModels.LogEntryList();
            list.filter = {
                serverId: id
            };
            list.dataSource = new list.dataSources.OfflineLogs();
            list.load();
            return list;
        };
        HomeModule.prototype.load = function () {
            this.servers.load();
        };
        return HomeModule;
    }());
    Ham.HomeModule = HomeModule;
    $(function () {
        var vm = new HomeModule();
        ko.applyBindings(vm);
        vm.load();
    });
})(Ham || (Ham = {}));

//# sourceMappingURL=home.index.js.map
