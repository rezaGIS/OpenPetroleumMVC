function readyIdent() {
    require([
        "esri/map",
        "esri/tasks/IdentifyParameters",
        "esri/tasks/IdentifyTask",
        "esri/SpatialReference",
        "esri/InfoTemplate",
        "esri/dijit/Popup",
        "dojo/_base/array",
        "esri/Color",
        "dojo/dom-construct",
        "dojo/domReady!"
    ], function (
        Map,
        IdentifyParameters,
        IdentifyTask,
        SpatialReference,
        InfoTemplate,
        Popup,
        arrayUtils,
        Color,
        domConstruct
        ) {

        identifyEvent = map.on("click", function identify(evt) {
            var identifyIdsTemp = opsMap.visibleLayers;
            identifyOpsParams = new IdentifyParameters();
            identifyOps = new IdentifyTask(opsURL);
            identifyOpsParams.layerIds = [identifyIdsTemp];
            identifyOpsParams.layerOption = IdentifyParameters.LAYER_OPTION_VISIBLE;
            identifyOpsParams.mapExtent = map.extent;
            identifyOpsParams.tolerance = 1;
            identifyOpsParams.geometry = evt.mapPoint;
            identifyOpsParams.returnGeometry = true;
            console.log(identifyOpsParams)
            var deferedIdentify = identifyOps.execute(identifyOpsParams).addCallback(function (response) {
                return arrayUtils.map(response, function (results) {
                    var feature = results.feature;
                    var layerName = results.layerName;
                    console.log(layerName);
                    console.log(feature);
                    feature.attributes.layerName = layerName;
                    if (layerName === "Open Events") {
                        var openEventsTemplate = new InfoTemplate("Open Event", openTemplateData);
                        feature.setInfoTemplate(openEventsTemplate);
                    }
                    if (layerName === "Tier 1" || layerName === "Tier 2" || layerName === "Others/Unknown") {
                        var closedEventsTemplate = new InfoTemplate("Closed Event", closedTemplateData);
                        feature.setInfoTemplate(closedEventsTemplate);
                    }
                    if (layerName === "Tier 4" || layerName === "Tier 3") {
                        var tier4EventsTemplate = new InfoTemplate("Closed Event", tier4TemplateData);
                        feature.setInfoTemplate(tier4EventsTemplate);
                    }
                    return feature;
                });
              
            })
            map.infoWindow.setFeatures([deferedIdentify]);
            map.infoWindow.show(evt.mapPoint);

        });
    });
}