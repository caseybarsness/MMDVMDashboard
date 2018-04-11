/// <reference path="viewmodels.generated.d.ts" />
var MMDash;
/// <reference path="viewmodels.generated.d.ts" />
(function (MMDash) {
    var StreamModule = (function () {
        function StreamModule() {
            var self = this;
        }
        StreamModule.prototype.load = function () {
            //var callSignList = new ListViewModels.CallSignList();
            //callSignList.dataSource = new ListViewModels.CallSignDataSources.CallSignsWithoutChildren();
        };
        return StreamModule;
    }());
    MMDash.StreamModule = StreamModule;
    $(function () {
        var vm = new StreamModule();
        ko.applyBindings(vm);
        vm.load();
    });
})(MMDash || (MMDash = {}));

//# sourceMappingURL=streams.index.js.map
