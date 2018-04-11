/// <reference path="viewmodels.generated.d.ts" />
var Ham;
/// <reference path="viewmodels.generated.d.ts" />
(function (Ham) {
    var SignModule = (function () {
        function SignModule() {
            this.signId = parseInt(Coalesce.Utilities.GetUrlParameter("id"));
            this.servers = new ListViewModels.ServerList();
            this.sign = new ViewModels.CallSign();
            var self = this;
        }
        SignModule.prototype.LogsForServer = function (serverId) {
            var list = new ListViewModels.LogEntryList();
            list.filter = {
                serverId: serverId,
                callSignId: Coalesce.Utilities.GetUrlParameter("id")
            };
            list.pageSize(50);
            list.load();
            return list;
        };
        SignModule.prototype.load = function () {
            this.sign.load(this.signId);
            this.servers.dataSource = new ListViewModels.ServerDataSources.ServersWithoutChildren();
            this.servers.load();
        };
        return SignModule;
    }());
    Ham.SignModule = SignModule;
    $(function () {
        var vm = new SignModule();
        ko.applyBindings(vm);
        vm.load();
    });
})(Ham || (Ham = {}));

//# sourceMappingURL=sign.index.js.map
