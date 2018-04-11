
/// <reference path="viewmodels.generated.d.ts" />


module MMDash {
    export class MapModule {
        public ipList = new ListViewModels.IpLogList();

        load() {
            var self = this;
            self.ipList.dataSource = new ListViewModels.IpLogDataSources.MappableIps();
            self.ipList.pageSize(1000);
            self.ipList.load();
        }

        constructor() {
            var self = this;
        }

    }

    $(function () {
        var vm = new MapModule();
        ko.applyBindings(vm);
        vm.load();
    })

}