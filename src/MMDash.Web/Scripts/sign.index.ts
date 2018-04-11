
/// <reference path="viewmodels.generated.d.ts" />
/// <reference types="datatables.net" />
/// <reference path="../node_modules/datatables.responsive.typings/index.d.ts" />
/// <reference types="google-maps" />



module MMDash {
    export class SignModule {
        private strCallSign = Coalesce.Utilities.GetUrlParameter("call");
        public servers = new ListViewModels.ServerList();
        public sign = new ViewModels.CallSign();
        public personName = ko.observable();
        public expDate = ko.observable();
        public fccUrl = ko.observable();
        public opClass = ko.observable();
        public grantDate = ko.observable();
        public lat = ko.observable();
        public long = ko.observable();
        public isLoadingTransmissions = ko.observable(true);
        public isLoadingStreams = ko.observable(true);


      

        public ajax = function (uri) {
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

        loadFccInf(callback?: (self: this) => void) {
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
                if (typeof (callback) == "function") callback(this);
            });
        }
        loadMap() {
            var self = this;
            //console.trace(self.long());
            //console.trace(self.lat());
            var numLat = parseFloat(self.lat().toString());
            var numLong = parseFloat(self.long().toString())
            var opts: google.maps.MapOptions = {
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
        }


        load() {
            var self = this;
            var lstCallSigns = new ListViewModels.CallSignList();
            lstCallSigns.filter = {
                text: self.strCallSign
            }
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

        }

        public LogsForServer(serverId, signId) {
            var self = this;
            var streamList = new ListViewModels.StreamList();
            var transmissionList = new ListViewModels.VoiceTransmissionList();
            streamList.filter = {
                serverId: serverId,
                callSignId: signId
            }
            transmissionList.filter = {
                serverId: serverId,
                callSignId: signId
            }

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
                                var mDate: moment.Moment = data()
                                return mDate.utc().add(-8, 'hours').format("YYYY-MM-DD HH:mm:ss");
                            },
                            "targets": 0
                        },
                    ],
                    order: [[0, "desc"]]
                });
            });

            transmissionList.orderByDescending("transmissionDateTimeStart")
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
                                var mDate: moment.Moment = data()
                                return mDate.utc().add(-8, 'hours').format("YYYY-MM-DD HH:mm:ss");
                            },
                            "targets": 0
                        },
                        {
                            "render": function (data, type, row) {
                                var mDate: moment.Moment = data()
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
            })
        }

        constructor() {
            var self = this;

            //this.loadFccInfo();
        }

    }

    $(function () {
        var vm = new SignModule();
        ko.applyBindings(vm);
        vm.load();
    })

}