
/// <reference path="viewmodels.generated.d.ts" />


module MMDash {
    export class StreamModule {

        load() {
            //var callSignList = new ListViewModels.CallSignList();
            //callSignList.dataSource = new ListViewModels.CallSignDataSources.CallSignsWithoutChildren();

        }

        constructor() {
            var self = this;
        }

    }

    $(function () {
        var vm = new StreamModule();
        ko.applyBindings(vm);
        vm.load();
    })

}