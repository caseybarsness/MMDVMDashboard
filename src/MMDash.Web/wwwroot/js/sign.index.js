/// <reference path="viewmodels.generated.d.ts" />
/// <reference types="datatables.net" />
/// <reference path="../node_modules/datatables.responsive.typings/index.d.ts" />
/// <reference types="google-maps" />
var MMDash;
/// <reference path="viewmodels.generated.d.ts" />
/// <reference types="datatables.net" />
/// <reference path="../node_modules/datatables.responsive.typings/index.d.ts" />
/// <reference types="google-maps" />
(function (MMDash) {
    var SignModule = (function () {
        function SignModule() {
            this.strCallSign = Coalesce.Utilities.GetUrlParameter("call");
            this.servers = new ListViewModels.ServerList();
            this.sign = new ViewModels.CallSign();
            this.personName = ko.observable();
            this.expDate = ko.observable();
            this.fccUrl = ko.observable();
            this.opClass = ko.observable();
            this.grantDate = ko.observable();
            this.lat = ko.observable();
            this.long = ko.observable();
            this.isLoadingTransmissions = ko.observable(true);
            this.isLoadingStreams = ko.observable(true);
            this.ajax = function (uri) {
                var request = {
                    url: uri,
                    cache: false,
                    dataType: 'jsonp',
                    error: function (jqXHR) {
                        console.log("ajax error " + jqXHR.status);
                    }
                };
                return $.ajax(request);
            };
            var self = this;
            //this.loadFccInfo();
        }
        SignModule.prototype.loadFccInf = function (callback) {
            var self = this;
            var fccUri = "https://callook.info/" + self.sign.text() + "/json/test_callback";
            self.ajax(fccUri).done(function (data) {
                self.personName(data.name);
                self.expDate(data.otherInfo.expiryDate);
                self.fccUrl(data.otherInfo.ulsUrl);
                self.grantDate(data.otherInfo.grantDate);
                self.opClass(data.current.operClass);
                self.lat(data.location.latitude);
                self.long(data.location.longitude);
                if (typeof (callback) == "function")
                    callback(this);
            });
        };
        SignModule.prototype.loadMap = function () {
            var self = this;
            //console.trace(self.long());
            //console.trace(self.lat());
            var numLat = parseFloat(self.lat().toString());
            var numLong = parseFloat(self.long().toString());
            var opts = {
                center: new google.maps.LatLng(numLat, numLong),
                mapTypeId: google.maps.MapTypeId.TERRAIN,
                zoom: 8
            };
            var map = new google.maps.Map(document.getElementById("map"), opts);
            var marker = new google.maps.Marker({
                position: new google.maps.LatLng(numLat, numLong),
                animation: google.maps.Animation.DROP,
                map: map
            });
        };
        SignModule.prototype.load = function () {
            var self = this;
            var lstCallSigns = new ListViewModels.CallSignList();
            lstCallSigns.filter = {
                text: self.strCallSign
            };
            lstCallSigns.load(function () {
                if (lstCallSigns.items().length > 0) {
                    self.sign = lstCallSigns.items()[0];
                    self.loadFccInf(function () {
                        self.loadMap();
                    });
                    self.servers.dataSource = new ListViewModels.ServerDataSources.ServersWithoutChildren();
                    self.servers.load(function () {
                        for (var i = 0; i < self.servers.items().length; i++) {
                            self.LogsForServer(self.servers.items()[i].serverId(), lstCallSigns.items()[0].callSignId().toString());
                        }
                    });
                }
            });
        };
        SignModule.prototype.LogsForServer = function (serverId, signId) {
            var self = this;
            var streamList = new ListViewModels.StreamList();
            var transmissionList = new ListViewModels.VoiceTransmissionList();
            streamList.filter = {
                serverId: serverId,
                callSignId: signId
            };
            transmissionList.filter = {
                serverId: serverId,
                callSignId: signId
            };
            streamList.orderByDescending("streamDateTime");
            streamList.pageSize(100);
            streamList.load(function () {
                self.isLoadingStreams(false);
                var streamsTables = $("#streams-table-" + serverId).DataTable({
                    "paging": true,
                    "ordering": true,
                    "info": true,
                    data: streamList.items(),
                    columns: [
                        { data: 'streamDateTime', title: 'Date Time' },
                        { data: 'talkGroup', title: 'Talk Group' },
                        { data: 'repeaterId', title: 'Repeater ID' },
                        { data: 'timeSlot', title: 'TS#' }
                    ],
                    columnDefs: [
                        {
                            "render": function (data, type, row) {
                                var mDate = data();
                                return mDate.utc().add(-8, 'hours').format("YYYY-MM-DD HH:mm:ss");
                            },
                            "targets": 0
                        },
                    ],
                    order: [[0, "desc"]]
                });
            });
            transmissionList.orderByDescending("transmissionDateTimeStart");
            transmissionList.pageSize(100);
            transmissionList.load(function () {
                self.isLoadingTransmissions(false);
                var transmissionsTable = $("#transmission-table-" + serverId).DataTable({
                    "paging": true,
                    "ordering": true,
                    "info": true,
                    data: transmissionList.items(),
                    columns: [
                        { data: 'transmissionDateTimeStart', title: 'Start' },
                        { data: 'transmissionDateTimeEnd', title: 'End' },
                        { data: 'talkGroup', title: 'Talk Group' },
                        { data: 'lossRate', title: 'Loss' }
                    ],
                    columnDefs: [
                        {
                            "render": function (data, type, row) {
                                var mDate = data();
                                return mDate.utc().add(-8, 'hours').format("YYYY-MM-DD HH:mm:ss");
                            },
                            "targets": 0
                        },
                        {
                            "render": function (data, type, row) {
                                var mDate = data();
                                return mDate.utc().add(-8, 'hours').format("YYYY-MM-DD HH:mm:ss");
                            },
                            "targets": 1
                        },
                        {
                            "render": function (data, type, row) {
                                return data() + "%";
                            },
                            "targets": 3
                        }
                    ],
                    order: [[0, "desc"]]
                });
            });
        };
        return SignModule;
    }());
    MMDash.SignModule = SignModule;
    $(function () {
        var vm = new SignModule();
        ko.applyBindings(vm);
        vm.load();
    });
})(MMDash || (MMDash = {}));

//# sourceMappingURL=sign.index.js.map
