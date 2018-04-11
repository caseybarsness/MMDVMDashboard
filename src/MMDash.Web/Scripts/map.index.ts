
/// <reference path="viewmodels.generated.d.ts" />


module MMDash {
    declare var MarkerClusterer: any;
    export class MapModule {
        public ipList = new ListViewModels.IpLogList();

        load() {
            var self = this;
            self.ipList.dataSource = new ListViewModels.IpLogDataSources.MappableIps();
            self.ipList.pageSize(1000);
            self.ipList.load(function () {
                var numLat = parseFloat("47.079303");
                var numLong = parseFloat(" -117.158865");
                var opts: google.maps.MapOptions = {
                    center: new google.maps.LatLng(numLat, numLong),
                    mapTypeId: google.maps.MapTypeId.TERRAIN,
                    zoom: 5
                };
                var map = new google.maps.Map(document.getElementById("map"), opts);

                var infoWin = new google.maps.InfoWindow();
                var markers = self.ipList.items().map(function (location, i) {
                    var Lat = parseFloat(location.lat());
                    var Long = parseFloat(location.long());
                    var marker = new google.maps.Marker({
                        position: new google.maps.LatLng(Lat, Long),
                        title: location.callSignString(),
                        animation: google.maps.Animation.DROP
                    });
                    
                    google.maps.event.addListener(marker, 'click', function (evt) {
                        var content = "";
                        content += "<a href='/Sign/?call=" + location.callSignString() + "'><b>" + location.callSignString() + "</b></a><br />";
                        content += "" + location.ipAddress() + "<br />";
                        infoWin.setContent(content);
                        infoWin.open(map, marker);
                    })
                    return marker;
                });

                var markerCluster = new MarkerClusterer(map, markers,
                    { imagePath: 'https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m', maxZoom: 9 });
            });
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