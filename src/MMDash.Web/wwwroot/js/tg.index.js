/// <reference path="viewmodels.generated.d.ts" />
var MMDash;
/// <reference path="viewmodels.generated.d.ts" />
(function (MMDash) {
    var TgModule = (function () {
        function TgModule() {
            this.talkGroups = new ListViewModels.TalkGroupList();
            var self = this;
        }
        TgModule.prototype.load = function () {
            var self = this;
            //self.talkGroups.pageSize(300);
            //self.talkGroups.load(function () {
            //    var JQueryDataTables = $("#talkGroups-table").DataTable({
            //        "paging": true,
            //        "ordering": true,
            //        "info": true,
            //        data: self.talkGroups.items(),
            //        columns: [
            //            {
            //                data: 'name',
            //                title: 'Talk Group'
            //            },
            //            {
            //                data: 'ts1Id',
            //                title: 'TS1 ID'
            //            },
            //            {
            //                data: 'ts2Id',
            //                title: 'TS2 ID'
            //            },
            //        ],
            //        columnDefs: [
            //            {
            //                "render": function (data, type, row) {
            //                    if (data() == undefined) {
            //                        data = " ";
            //                    }
            //                    return data;
            //                },
            //                "targets": 1
            //            },
            //            {
            //                "render": function (data, type, row) {
            //                    if (data() == undefined) {
            //                        data = " ";
            //                    }
            //                    return data;
            //                },
            //                "targets": 2
            //            }
            //        ]
            //    });
            //});
        };
        return TgModule;
    }());
    MMDash.TgModule = TgModule;
    //$(function () {
    //    var vm = new TgModule();
    //    ko.applyBindings(vm);
    //    vm.load();
    //})
})(MMDash || (MMDash = {}));

//# sourceMappingURL=tg.index.js.map
