import React, {useEffect} from "react";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import * as am4themes_animated from "@amcharts/amcharts4/themes/animated"

function CanadaProvinceChart(props) {

    useEffect(() => {
        drawBarGraph(props.provinces, 1);
        drawBarGraph(props.provinces, 2);

    }, [props.provinces])

    function getCode(code) {
        switch (code) {
            case "NL":
                return "Newfoundland & Lab";
                break;
            case "PE":
                return "Prince Edward Island";
                break;
            case "NS":
                return "Nova Scotia";
                break;
            case "NB":
                return "New Brunswick";
                break;
            case "QC":
                return "Quebec";
                break;
            case "ON":
                return "Ontario";
                break;
            case "MB":
                return "Manitoba";
                break;
            case "SK":
                return "Saskatchewan";
                break;
            case "AB":
                return "Alberta";
                break;
            case "BC":
                return "British Columbia";
                break;
            case "YT":
                return "Yukon";
                break;
            case "NT":
                return "Northwest Territories";
                break;
            case "NU":
                return "Nunavut";
                break;
            default:
                return code;
                break;
        }
    }

    function drawBarGraph(provinces, type) {
        let chart;
        if(type === 1) {
            chart = am4core.create("bar_chart_total_cases", am4charts.XYChart);
        }
        else {
            chart = am4core.create("bar_chart_new_cases", am4charts.XYChart);
        }
        chart.scrollbarX = new am4core.Scrollbar();
        let title = chart.titles.create();
        title.fontSize = 25;
        title.fontWeight = "bold";

        let data = [];
        let temp = props.provinces;
        let updated = "";
        temp.forEach(({province, last_updated, change_cases, total_cases, total_recoveries}) => {
            if(type === 1) {
                data.push({province: getCode(province), total_cases: total_cases});
            }
            else {
                data.push({province: getCode(province), total_cases: change_cases});
            }
            updated = last_updated;
        })

        if(data.length > 0) {
            if(type == 1) {
                title.text = "Total Cases per Province - Up to: " + updated;
            }
            else {
                title.text = "New Cases per Province - Up to: " + updated;
            }
        }

        chart.data = data;

// Create axes
        let categoryAxis = chart.xAxes.push(new am4charts.CategoryAxis());
        categoryAxis.dataFields.category = "province";
        categoryAxis.renderer.grid.template.location = 0;
        categoryAxis.renderer.minGridDistance = 30;
        categoryAxis.renderer.labels.template.horizontalCenter = "right";
        categoryAxis.renderer.labels.template.verticalCenter = "middle";
        categoryAxis.renderer.labels.template.rotation = 270;
        categoryAxis.tooltip.disabled = true;
        categoryAxis.renderer.minHeight = 110;

        let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
        valueAxis.renderer.minWidth = 50;

// Create series
        let series = chart.series.push(new am4charts.ColumnSeries());
        series.sequencedInterpolation = true;
        series.dataFields.valueY = "total_cases";
        series.dataFields.categoryX = "province";
        series.tooltipText = "[{categoryX}: bold]{valueY}[/]";
        series.columns.template.strokeWidth = 0;

        series.tooltip.pointerOrientation = "vertical";

        series.columns.template.column.cornerRadiusTopLeft = 10;
        series.columns.template.column.cornerRadiusTopRight = 10;
        series.columns.template.column.fillOpacity = 0.8;

// on hover, make corner radiuses bigger
        let hoverState = series.columns.template.column.states.create("hover");
        hoverState.properties.cornerRadiusTopLeft = 0;
        hoverState.properties.cornerRadiusTopRight = 0;
        hoverState.properties.fillOpacity = 1;

        series.columns.template.adapter.add("fill", function(fill, target) {
            return chart.colors.getIndex(target.dataItem.index);
        });

// Cursor
        chart.cursor = new am4charts.XYCursor();
    }

    return (
        <>
            <div id="bar_chart_total_cases"  style={{height: "500px"}}></div>
            <div id="bar_chart_new_cases"  style={{height: "500px"}}></div>
        </>
    )

}

export default CanadaProvinceChart;