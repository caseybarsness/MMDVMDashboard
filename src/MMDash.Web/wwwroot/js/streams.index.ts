
/// <reference path="viewmodels.generated.d.ts" />


module MMDash {
    export class StreamModule {
        public calls = new ListViewModels.CallSignList();

        load() {
            var self = this;
            self.calls.pageSize(300);
            self.calls.load(function () {
                var JQueryDataTables = $("#calls-table").DataTable({
                    "paging": true,
                    "ordering": true,
                    "info": true,
                    data: self.calls.items(),
                    columns: [
                        {
                            data: 'text',
                            title: 'Call Sign'
                        },
                        { data: 'logEntries', title: 'Repeater Control Logs' },
                        { data: 'streams', title: 'AMBE Stream Logs' },
                        { data: 'callSignId'}
                    ],
                    columnDefs: [
                        {
                            "render": function (data, type, row) {
                                var call = data();
                                return "<span class='online fa-signal'></span> <a href='/sign/?call=" + call + "'>" + call + "</a>";
                            },
                            "targets": 0
                        },
                        {
                            "render": function (data, type, row) {
                                return data().length;
                            },
                            "targets": 1
                        },
                        {
                            "render": function (data, type, row) {
                                return data().length;
                            },
                            "targets": 2
                        },
                        {
                            "visible": true,
                            "targets": 3
                        }
                    ],
                    order: [[0, "desc"]]
                });
            });

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