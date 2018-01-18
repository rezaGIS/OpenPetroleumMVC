function findEvents() {
    require([
    /*--ESRI--*/
    "esri/map",
    "esri/config",
    "esri/tasks/query",
    "esri/tasks/QueryTask",
    "esri/dijit/Search",
    "esri/geometry/Circle",
    "esri/geometry/Point",   
    "esri/symbols/SimpleMarkerSymbol",
    "esri/symbols/SimpleFillSymbol",
    "esri/symbols/SimpleLineSymbol",
    "esri/Color",
    "esri/graphic",
    "esri/tasks/locator",
    /*--Dojo--*/
    "dojo/store/Memory",
    "dojo/_base/array",
    "dojo/dom-construct",
    "dojo/promise/all"
    ], function (
     /*--ESRI--*/
     Map,
     esriConfig,
     Query,
     QueryTask,
     Search,
     Circle,
     Point,
     SimpleMarkerSymbol,
     SimpleFillSymbol,
     SimpleLineSymbol,
     Color,
     Graphic,
     Locator,
     /*--Dojo--*/
     Memory,
     array,
     domConstruct,
     all
     ) {
        /*--Common Resources--*/      
        var queryOps = new Query();
        var circleSymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_NULL, new SimpleLineSymbol(SimpleLineSymbol.STYLE_SHORTDASHDOTDOT, new Color([105, 105, 105]), 2), new Color([255, 255, 0, 0.25]));
        queryOps.outFields = outFields;
        queryOps.returnGeometry = true;
        
        var center;
        /*--Geocoder--*/
        
        var searchGeocoder = new Search({ map: map, sources: [] }, "search");
        searchGeocoder.on("load", function () {
            var sources = searchGeocoder.sources;
            sources.push({
                locator: new Locator("https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"),
                placeholder: "601 E 18th Ave Denver, CO 80015",
                enableSuggestions: true,
                maxResults: 3,
                maxSuggestions: 3,
                minCharacters: 3,
                searchExtent: coloradoExtent
            })
            searchGeocoder.set("sources", sources)
        });     
        searchGeocoder.startup();
        searchGeocoder.on("select-result", showLocation);
        /*--Query Grid Selection--*/
        grid.on(".dgrid-row:click", function selectGrid(g) {
            /*--Dgrid Highlight styling--*/
            map.graphics.clear();
            var lineHighlight = new SimpleLineSymbol();
            lineHighlight.setColor(new Color([0, 197, 255, 1]));
            lineHighlight.setWidth(2);
            var markerHighlight = new SimpleMarkerSymbol();
            markerHighlight.setOutline(lineHighlight);
            markerHighlight.setColor(new Color([0, 197, 255, 0]));
            markerHighlight.setSize(6);
            /*--Find ID of clicked row--*/
            var row = grid.row(g);
            var queryGrid = new Query();
            /*--Query Grid--*/
            queryGrid.outFields = ["*"]; 
            queryGrid.returnGeometry = true;
            queryGrid.where = "ID = '" + row.data.id + "'";
            DEBUG && console.log('Searching for ID: ' + row.data.id)
            opsQueryDictionary.map(function (results) {             
                DEBUG && console.log("Searching for '" + results.name + "', URL:'" + results.url + "'");
                var queryClickTask = new QueryTask(results.url);
                queryClickTask.execute(queryGrid).then(function (gridSearch) {                   
                    if (gridSearch.features.length > 0) {
                        var highlight = new Graphic(gridSearch.features[0].geometry, markerHighlight);
                        map.graphics.add(highlight);
                        map.centerAndZoom(highlight.geometry, 17);                                                                    
                    }
                }, function (e) {
                    console.log(e);
                });
            });
        });
        /*--Query features--*/
        function findFeatures() {
            DEBUG && console.log("Find features beginning.")
            var taskPromise = [];
            var tempStore = [];
            opsQueryDictionary.map(function (results) {
                DEBUG && console.log("Searching for '" + results.name + "', URL:'" + results.url + "'");
                var queryClickTask = new QueryTask(results.url);
                taskPromise = queryClickTask.execute(queryOps).then(function (ops) {
                    for (var i = 0; i < ops.features.length; i++) {
                        tempStore.push(ops.features[i]); // store to array
                        DEBUG && console.log(tempStore);
                    }
                }, function (e) {
                    console.log(e);
                });               
            });         
            var newPromise = new all([tempStore, taskPromise]); // tempStore and taskPromise complete b4 continuing
            /*--Store and populate dgrid--*/
            newPromise.then(function () {
                DEBUG && console.log(tempStore.length);                
                var data = tempStore.map(function (feature) {                   
                    return {
                        "id": feature.attributes.ID,
                        "facility": feature.attributes.Facility_ID,
                        "eventID": feature.attributes.Event_ID,
                        "siteName": feature.attributes.Site_Name,
                        "street": feature.attributes.Address,
                        "cityStateZip": feature.attributes.City_State_Zip,
                        "date": feature.attributes.Date_of_Release,
                        "status": feature.attributes.Status,
                        "contact": feature.attributes.OPS_Contact_Name,
                        "phone": feature.attributes.Phone,
                        "email": feature.attributes.Email
                    };
                });
                DEBUG && console.log("Data kept: " + (data.length == tempStore.length))
                var memStore = new Memory({ data: data }); // set dgrid memory
                window.grid.set("store", memStore); // populate dgrid
                window.grid.set("sort", [{ attribute: "eventID", descending: false }]);// workaround for dgrid not populating until grid was sorted}
                opsMap.setVisibleLayers([0, 1, 2, 3, 4, 5, 6]);
            })
        }
        function createCircle() {
            /*--Create circle graphic for visual--*/
            var buffDist = document.getElementById('bufferDist').value;
            map.graphics.clear();
            console.log(buffDist);
            circle = new Circle({
                center: center,
                geodesic: true,
                radius: buffDist,
                radiusUnit: "esriMiles"
            });
            circleExtent = circle.getExtent();
            var graphic = new Graphic(circle, circleSymbol);
            map.graphics.add(graphic);
            queryOps.geometry = circleExtent;
            DEBUG && console.log(circleExtent);
            map.setExtent((circleExtent).expand(1.3));
            findFeatures();
        }
        function activateMapClick() {
              mapClickEvent = map.on("click", function mapSearch(evt) {
                /*-- Collects and stores pointer xy for use --*/
                var promises;
                var xPointer = evt.mapPoint.getLatitude();
                var yPointer = evt.mapPoint.getLongitude();
                center = ([yPointer, xPointer]);
                DEBUG && console.log("Cursor coordinates= x:" + xPointer + "; y:" + yPointer)
                createCircle();
              });
        }
        function showLocation(geo) {           
            center = geo.result.feature.geometry;
            createCircle();
        };
        /*--Button functions--*/
        document.getElementById("findBtn").onclick = function attributeSerach() {
            var queryEntry = document.getElementById('qryBox').value;
            var queryField = document.getElementById('qryField').value;
            DEBUG && console.log("queryEntry: " + queryEntry + " queryField: " + queryField);
            queryOps.where = queryField + " LIKE '%" + queryEntry + "%'";        
            DEBUG && console.log(queryOps.where);
            findFeatures();
        };
        document.getElementById("clearBtn").onclick = function clearResults() {
            map.graphics.clear();
            var memStore = new Memory({ data: data });
            window.grid.set("store", memStore);
            map.setZoom(11);
        }
        document.getElementById("radio").addEventListener("change", function toolListen() {
            if (document.getElementById("useMap").checked == true) {
                DEBUG && console.log("Use map click.")
                identifyEvent.remove();
                document.getElementById("clickDesc").style.display = "block";
                document.getElementById("search").style.display = "none";
                activateMapClick();              
            }
            if (document.getElementById("useGeocode").checked == true) {
                DEBUG && console.log("Use Geocode.");
                document.getElementById("search").style.display = "block";
                document.getElementById("clickDesc").style.display = "none";
                mapClickEvent.remove(); // disable map click search
                readyIdent();
            }
        });
    });      
    };
