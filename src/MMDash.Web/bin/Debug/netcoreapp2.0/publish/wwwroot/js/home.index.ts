
/// <reference path="viewmodels.generated.d.ts" />


module Ham {
    export class HomeModule {
        public servers = new ListViewModels.ServerList();

        public OnlineUsers(id) {
            var list = new ListViewModels.LogEntryList();
            list.filter = {
                serverId: id
            }
            list.dataSource = new list.dataSources.OnlineLogs();
            list.load();
            return list;
        }

        public OfflineUsers(id) {
            var list = new ListViewModels.LogEntryList();
            list.filter = {
                serverId: id
            }
            list.dataSource = new list.dataSources.OfflineLogs();
            list.load();
            return list;
        }


        load() {
            this.servers.load();
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