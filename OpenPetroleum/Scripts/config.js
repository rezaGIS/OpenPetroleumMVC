var DEBUG = true;

// Variables
var map;
var mapClickEvent;
var identifyEvent;
var circle;
var grid;
var buffer = {
    value: []
}
var circleExtent;
var data = [];
var outFields = ["*"];
var coloradoExtent;
// Mapservices URL
var opsURL = "https://gis.colorado.gov/oit/rest/services/CDLE/OPs_Events_tiers/MapServer";

var opsQueryDictionary = [
    { name: "Open", url: "https://gis.colorado.gov/oit/rest/services/CDLE/OPs_Events_tiers/MapServer/0" },
    { name: "Tier1", url: "https://gis.colorado.gov/oit/rest/services/CDLE/OPs_Events_tiers/MapServer/2" },
    { name: "Tier2", url: "https://gis.colorado.gov/oit/rest/services/CDLE/OPs_Events_tiers/MapServer/3" },
    { name: "Tier3", url: "https://gis.colorado.gov/oit/rest/services/CDLE/OPs_Events_tiers/MapServer/4" },
    { name: "Tier4", url: "https://gis.colorado.gov/oit/rest/services/CDLE/OPs_Events_tiers/MapServer/5" },
    { name: "Others", url: "https://gis.colorado.gov/oit/rest/services/CDLE/OPs_Events_tiers/MapServer/6" }
];

// Mapservices variables
var opsMap;
// Pop-up
var infoTemplate;
var infoTemplateTitle = "<b>Release Event</b>";
var costisURL = "https://opus.cdle.state.co.us/OIS2000/event.asp?h_id=" + "${Event_ID}";
var pdfURL = "https://gis.colorado.gov/appesri/OpenPetroleum_PDF/Event" + "${Event_ID}" + "_closuresummary.pdf";
var openTemplateData = "<b>Site Name:</b> ${Site_Name}</br>" + "<b>Event ID:</b> ${Event_ID}</br>" + "<b>Facility ID:</b> ${Facility_ID}</br>" +
                "<b>Status:</b> ${Status}</br>" +  "<b>Address:</b> ${Address}</br>" +
                "<b>City/State:</b> ${City_State_Zip}</br>" + "<b>Release Date:</b> ${Date_of_Release:DateFormat(selector: 'date', fullYear: true)}</br>" +
                "<b>Contact:</b> ${OPS_Contact_Name}</br>" + "<b>Phone:</b> ${Phone}</br>" + "<b>Email:</b> ${Email}</br>" +
                "</br><a href=" + costisURL + " target='_blank'>View COSTIS</a> </br>";
var closedTemplateData = "<b>Site Name:</b> ${Site_Name}</br>" + "<b>Event ID:</b> ${Event_ID}</br>" + "<b>Facility ID:</b> ${Facility_ID}</br>" +
                "<b>Status:</b> ${Status}</br>" + "<b>Type:</b> ${Closure_Type}</br>" + "<b>Address:</b> ${Address}</br>" +
                "<b>City/State:</b> ${City_State_Zip}</br>" + "<b>Release Date:</b> ${Date_of_Release:DateFormat(selector: 'date', fullYear: true)}</br>" +
                "<b>Closure Date:</b> ${Closure_Date:DateFormat(selector: 'date', fullYear: true)}</br>" + "<b>Contact:</b> ${OPS_Contact_Name}</br>" + "<b>Phone:</b> ${Phone}</br>" + "<b>Email:</b> ${Email}</br>" +
                "</br><a href=" + costisURL + " target='_blank'>View COSTIS</a> </br>";
var tier4TemplateData = closedTemplateData + "<a href=" + pdfURL + " target='_blank'>View Closure Summary</a> </br>";
/*--Identify Ops--*/
var identifyOps;

