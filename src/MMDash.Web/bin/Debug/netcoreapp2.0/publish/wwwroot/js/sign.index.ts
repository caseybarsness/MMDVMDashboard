
/// <reference path="viewmodels.generated.d.ts" />


module Ham {
    export class SignModule {
        private signId = parseInt(Coalesce.Utilities.GetUrlParameter("id"));
        public servers = new ListViewModels.ServerList();
        public sign = new ViewModels.CallSign();
        


        load() {
            this.sign.load(this.signId);
            this.servers.dataSource = new ListViewModels.ServerDataSources.ServersWithoutChildren();
            this.servers.load();
        }

        constructor() {
            var self = this;
        }

    }

    $(function () {
        var vm = new SignModule();
        ko.applyBindings(vm);
        vm.load();
    })

}