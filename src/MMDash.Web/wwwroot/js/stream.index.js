/// <reference path="viewmodels.generated.d.ts" />
var MMDash;
/// <reference path="viewmodels.generated.d.ts" />
(function (MMDash) {
    var StreamModule = (function () {
        function StreamModule() {
            this.calls = new ListViewModels.CallSignList();
            var self = this;
        }
        StreamModule.prototype.load = function () {
            this.calls.load();
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

//# sourceMappingURL=stream.index.js.map
