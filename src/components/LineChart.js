import React, {useEffect} from "react";
import * as am4charts from "@amcharts/amcharts4/charts";
import * as am4core from "@amcharts/amcharts4/core";
import { Spinner } from 'react-bootstrap';

function LineChart(props) {
    useEffect(() => {
        let chart = am4core.create("chart-div", am4charts.XYChart);
        let title = chart.titles.create();
        title.text = "New Cases";
        title.fontSize = 25;
        title.marginBottom = 10;
        title.fontWeight = "bold";
        chart.paddingRight = 60;
        chart.paddingTop = 60;

        let data = [];
        let dates = Object.entries(props.newCasesDates).map(([key, value]) => ({key,value}));
        dates.forEach((key) => {
            let temp = key.key.split("-");
            data.push({ date: new Date(temp[0], temp[1] - 1, temp[2]), value: key.value });
        })

        /*

        let visits = 10;
        for (let i = 1; i < 366; i++) {
            visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
            data.push({ date: new Date(2018, 0, i), value: visits });
        }
        */
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
        series.strokeWidth = 1.3;
        //series.bullets.push(new am4charts.CircleBullet());

        series.tooltipText = "{valueY.value}";
        chart.cursor = new am4charts.XYCursor();

        let scrollbarX = new am4charts.XYChartScrollbar();
        scrollbarX.series.push(series);
        chart.scrollbarX = scrollbarX;
    });

    return (
        <>
            <div id="chart-div" style={{height: "500px"}}></div>
            {props.loading && <Spinner animation="border" role="status"></Spinner>}
        </>
    )

}

export default LineChart;