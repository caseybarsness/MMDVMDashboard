
/// <reference path="viewmodels.generated.d.ts" />


module MMDash {
    export class HomeModule {
        public servers = new ListViewModels.ServerList();
        public isLoading = ko.observable(true);
        load() {
            var self = this;
            this.servers.dataSource = new ListViewModels.ServerDataSources.ServersWithoutChildren();
            this.servers.load(function () {
                self.isLoading(false);
            });
        }

        constructor() {
            var self = this;
        }

    }

    $(function () {
        var vm = new HomeModule();
        ko.applyBindings(vm);
        vm.load();
    })

}