import React, {useEffect, useState} from "react";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";

function CanadaLoadMoreProvinceChart(props) {
    const [provinceName, setProvinceName] = useState("");
    useEffect(() => {
        if (provinceName !== "") {
            // Create chart instance
            let chart = am4core.create("line-chart", am4charts.XYChart);
            let title = chart.titles.create();
            title.fontSize = 25;
            title.marginBottom = 10;
            title.fontWeight = "bold";
            chart.paddingRight = 60;
            chart.paddingTop = 60;

            let data = [];
            props.province_detail.forEach(({date, change_cases}) => {
                let temp = date.split("-");
                data.push({date: new Date(temp[0], temp[1] - 1, temp[2]), value: change_cases});
            })


            if (data.length > 0) {
                title.text = "New Cases in " + provinceName;
            }
            chart.data = data;

            let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
            dateAxis.renderer.grid.template.location = 0;

            let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
            valueAxis.tooltip.disabled = true;
            valueAxis.renderer.minWidth = 35;

            let series = chart.series.push(new am4charts.LineSeries());
            series.dataFields.dateX = "date";
            series.dataFields.valueY = "value";
            series.stroke = am4core.color("#ff0000"); // red
            series.fill =  am4core.color("#ff0000"); // red
            series.fillOpacity = 0.1;
            //series.bullets.push(new am4charts.CircleBullet());

            series.tooltipText = "{valueY.value}";
            chart.cursor = new am4charts.XYCursor();

            let scrollbarX = new am4charts.XYChartScrollbar();
            scrollbarX.series.push(series);
            chart.scrollbarX = scrollbarX;
        }

    }, [props.province_detail])

    function getName(code) {
        let ret = code;
        switch (code) {
            case "NL":
                ret = "Newfoundland";
                break;
            case "PE":
                ret = "Prince Edward";
                break;
            case "NS":
                ret = "Nova Scotia";
                break;
            case "NB":
                ret = "New Brunswick";
                break;
            case "QC":
                ret = "Quebec";
                break;
            case "ON":
                ret = "Ontario";
                break;
            case "MB":
                ret = "Manitoba";
                break;
            case "SK":
                ret = "Saskatchewan";
                break;
            case "AB":
                ret = "Alberta";
                break;
            case "BC":
                ret = "British Columbia";
                break;
            case "YT":
                ret = "Yukon";
                break;
            case "NT":
                ret = "Northwest Territories";
                break;
            case "NU":
                ret = "Nunavut";
                break;
            default:
                break;
        }
        return ret;
    }

    function getCode(name) {
        let ret = name;
        switch (name) {
            case "Newfoundland":
                ret = "NL";
                break;
            case "Prince Edward":
                ret = "PE";
                break;
            case "Nova Scotia":
                ret = "NS";
                break;
            case "New Brunswick":
                ret = "NB";
                break;
            case "Quebec":
                ret = "QC";
                break;
            case "Ontario":
                ret = "ON";
                break;
            case "Manitoba":
                ret = "MB";
                break;
            case "Saskatchewan":
                ret = "SK";
                break;
            case "Alberta":
                ret = "AB";
                break;
            case "British Columbia":
                ret = "BC";
                break;
            case "Yukon":
                ret = "YT";
                break;
            case "Northwest Territories":
                ret = "NT";
                break;
            case "Nunavut":
                ret = "NU";
                break;
            default:
                break;
        }
        return ret;
    }

    function provinceChange(e) {
        setProvinceName(e.target.text);
        props.provinceChange(getCode(e.target.text));
    }

    return (
        <>
            <div>
                <div className="btn-group">
                    <button type="button" className="btn btn-info">Province</button>
                    <button type="button" className="btn btn-info dropdown-toggle dropdown-toggle-split"
                            data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                        <span className="sr-only">Toggle Dropdown</span>
                    </button>
                    <div className="dropdown-menu">
                        {
                            props.provinces.map((row) => <a className="dropdown-item" onClick={provinceChange}>{getName(row.province)}</a> )
                        }
                    </div>
                </div>
            </div>
            {provinceName !== "" && <div id="line-chart" style={{height: "500px"}}></div>}
        </>
    )
}

export default CanadaLoadMoreProvinceChart;