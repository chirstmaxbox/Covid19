import React, {useEffect} from "react";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4geodata_worldLow from "@amcharts/amcharts4-geodata/worldLow";
import * as am4maps from "@amcharts/amcharts4/maps";
import * as am4core from "@amcharts/amcharts4/core";
import {overwrite, getCode} from "country-list";
import {Spinner} from "react-bootstrap";

function Geography(props) {
    useEffect(() => {
        // Create map instance
        let chart = am4core.create("chartdiv", am4maps.MapChart);
        // Set map definition
        chart.geodata = am4geodata_worldLow;
        // Set projection
        chart.projection = new am4maps.projections.Miller();
        // Create map polygon series
        let polygonSeries = chart.series.push(new am4maps.MapPolygonSeries());
        // Make map load polygon (like country names) data from GeoJSON
        polygonSeries.useGeodata = true;

        overwrite([
            {code: 'RU', name: 'Russia'},
            {code: 'US', name: 'US'},
            {code: "VN", name: "Vietnam"},
            {code: "IR", name: "Iran"},
            {code: "SY", name: "Syria"},
            {code: "LA", name: "Laos"},
            {code: "KR", name: "Korea, South"},
            {code: "VE", name: "Venezuela"},
            {code: "GB", name: "United Kingdom"},
            {code: "BO", name: "Bolivia"}
        ])

        let temp = Object.entries(props.countryDetails).map(([key, value]) => ({key, value}));
        let countries = [];
        temp.map((element) => {
            countries.push({
                id: getCode(element.key),
                color: am4core.color("#ff8000"),
                description: "Total cases: " + element.value.confirmed.toLocaleString()
            })
        });

        // Add some custom data
        /*
        polygonSeries.data = [{
            id: "US",
            name: "Canada",
            color: am4core.color("#ff8000"),
            "description": "The U.S. is a country of 50 states covering a vast swath of North America, with Alaska in the northwest and Hawaii extending the nation’s presence into the Pacific Ocean. Major Atlantic Coast cities are New York, a global finance and culture center, and capital Washington, DC. Midwestern metropolis Chicago is known for influential architecture and on the west coast, Los Angeles' Hollywood is famed for filmmaking."
        }]
         */

        polygonSeries.data = countries;


        // Configure series
        let polygonTemplate = polygonSeries.mapPolygons.template;
        polygonTemplate.tooltipText = "{name} - {description}";
        polygonTemplate.fill = am4core.color("#5CAB7D");
        polygonTemplate.propertyFields.fill = "color";
        /*
        polygonTemplate.events.on("hit", function(ev) {
            let data = ev.target.dataItem.dataContext;
            let info = document.getElementById("info");
            info.innerHTML = "<h3>" + data.name + " (" + data.id  + ")</h3>";
            if (data.description) {
                info.innerHTML += data.description;
            }
            else {
                info.innerHTML += "<i>No description provided.</i>"
            }
        });
         */

        // Create hover state and set alternative fill color
        let hs = polygonTemplate.states.create("hover");
        hs.properties.fill = am4core.color("#5A9367");

        // Remove Antarctica
        polygonSeries.exclude = ["AQ"];

        // Add zoom control
        chart.zoomControl = new am4maps.ZoomControl();
    });

    return (
        <>
            {props.loading && <Spinner animation="border" role="status"></Spinner>}
            <div id="chartdiv" style={{height: "600px"}}></div>
            <div id="info"></div>
        </>
    )
}


export default Geography;