/// <reference path="viewmodels.generated.d.ts" />
var MMDash;
/// <reference path="viewmodels.generated.d.ts" />
(function (MMDash) {
    var HomeModule = (function () {
        function HomeModule() {
            this.servers = new ListViewModels.ServerList();
            this.isLoading = ko.observable(true);
            var self = this;
        }
        HomeModule.prototype.load = function () {
            var self = this;
            this.servers.dataSource = new ListViewModels.ServerDataSources.ServersWithoutChildren();
            this.servers.load(function () {
                self.isLoading(false);
            });
        };
        return HomeModule;
    }());
    MMDash.HomeModule = HomeModule;
    $(function () {
        var vm = new HomeModule();
        ko.applyBindings(vm);
        vm.load();
    });
})(MMDash || (MMDash = {}));

//# sourceMappingURL=home.index.js.map
