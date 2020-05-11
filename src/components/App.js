import React from 'react';
import Navigation from "./Navigation";
import axios from "axios";
import LineChart from "./LineChart";
import CardChart from "./CardChart";
import GlobalTable from "./GlobalTable";
import Geography from "./Geography";
import CanadaProvinceChart from "./CanadaProvinceChart";
import CanadaLoadMoreProvinceChart from "./CanadaLoadMoreProvinceChart";

const baseURL = "https://pomber.github.io/covid19/timeseries.json";
const proxyURL = "https://cors-anywhere.herokuapp.com/";
const canadaURL = "https://api.covid19tracker.ca/summary/split";
const canadaProvinceDetailURL = "https://api.covid19tracker.ca/reports/province";
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            loading_canada: true,
            loading_canada_more: true,
            v_new_case_dates: [],
            v_countries: [],
            v_countryDetail: [],
            v_worldStats: {},
            v_lastUpdate: "",
            v_country_name: "",
            v_canada_provinces: [],
            v_canada_provinceDetail: [],
            v_num_Of_Countries: 0
        }
        this.loadWorldData = this.loadWorldData.bind(this);
        this.loadCanadaProvinceData = this.loadCanadaProvinceData.bind(this);
    }

    componentDidMount() {
        this.loadWorldData();
    }

    moveToTop = () => {
        window.scrollTo(0, 0);
    }

    selectCountry = (e) => {
        let name = e.type === "change" ? e.target.value: e.target.text;
        if(name === this.state.v_country_name) return;
        this.moveToTop();
        if(name === "Canada") {
            this.loadCanadaProvinceData();
        }
        this.calculateData(name, this.state.v_countries);
    }

    rowClick = (name) => {
        //this.calculateData(name, this.state.v_countries);
    }

    calculateData = (country, data) => {
        let countryArr = Object.keys(data).map(i => i);
        let worldStats = {confirmed: 0, recovered: 0, deaths: 0, active: 0}
        let countryDetails = [];
        let countries = [];
        let dates = [];
        let lastUpdate = "";
        let num = 0;
        countryArr.forEach(e => {
            if(country === "Global" || e === country) {
                num++;
                countries[e] = data[e];
                let countryData = countries[e][countries[e].length - 1];
                worldStats.confirmed += countryData.confirmed;
                worldStats.recovered += countryData.recovered;
                worldStats.deaths += countryData.deaths;
                let temp = countryData.date.split("-");
                lastUpdate = new Date(temp[0], temp[1] - 1, temp[2]);
                lastUpdate.setDate(lastUpdate.getDate() + 1);

                let countriesStats = {confirmed: 0, new_cases: 0, deaths: 0, new_deaths: 0, recovered:0, active: 0};
                countriesStats.confirmed = countryData.confirmed;
                countriesStats.deaths = countryData.deaths;
                countriesStats.recovered = countryData.recovered;
                countriesStats.active = countriesStats.confirmed - countriesStats.recovered - countriesStats.deaths;
                countriesStats.new_cases = countries[e][countries[e].length - 1].confirmed - countries[e][countries[e].length - 2].confirmed;
                countriesStats.new_deaths = countries[e][countries[e].length - 1].deaths - countries[e][countries[e].length - 2].deaths;
                countryDetails[e] = countriesStats;

                for (let i = 1; i < countries[e].length; i++) {
                    let item_date = countries[e][i].date;
                    if (item_date in dates) {
                        dates[item_date] = dates[item_date] + (countries[e][i].confirmed - countries[e][i - 1].confirmed);
                    } else {
                        dates[item_date] = countries[e][i].confirmed - countries[e][i - 1].confirmed;
                    }
                }
            }
        });
        worldStats.active = worldStats.confirmed - worldStats.recovered - worldStats.deaths;

        this.setState({
            loading: false,
            v_new_case_dates: dates,
            v_countries: data,
            v_countryDetail: countryDetails,
            v_worldStats: worldStats,
            v_lastUpdate: lastUpdate,
            v_country_name: country,
            v_num_Of_Countries: num
        });
    }

    async loadWorldData() {
        await axios.get(baseURL)
            .then((response => {
                    switch (response.status) {
                        case 200:
                            this.calculateData("Global", response.data);
                            break;
                        default:
                            break;
                    }
                })
            )
    }

    loadCanadaProvinceData() {
        fetch(proxyURL + canadaURL)
            .then(response => response.json())
            .then(data => {
                let provinces = [];
                let last_updated = data.last_updated;
                data.data.forEach(({province, change_cases, total_cases, total_recoveries}) => {
                    provinces.push({province, last_updated, change_cases, total_cases, total_recoveries});
                })

                this.setState({
                    loading_canada: false,
                    v_canada_provinces: provinces
                });
            })
            .catch(error => {

            })
    }

    loadCanadaProvinceDetailData = (name) => {
        this.setState({loading_canada_more: true});
        fetch(proxyURL + canadaProvinceDetailURL + "/" + name)
            .then(response => response.json())
            .then(data => {
                let province_dates = [];
                data.data.forEach(({change_cases, date}) => {
                    province_dates.push({date, change_cases});
                })

                this.setState({
                    loading_canada_more: false,
                    v_canada_provinceDetail: province_dates
                });
            })
            .catch(error => {

            })
    }


    render() {
        return (
            <>
                <div>
                    <Navigation countries={this.state.v_countries} moveToStop={this.moveToTop} onChange={this.selectCountry} countryName={this.state.v_country_name}/>
                </div>
                    <div className="container-fluid">
                        <p className="text-right padding-top-120 padding-right-70">Last update: {this.state.v_lastUpdate.toLocaleString()}</p>
                        <h1 className="font-size-275em text-center padding-bottom-50">{this.state.v_country_name}</h1>
                    </div>
                    <div className="container-fluid">
                        <CardChart worldStats={this.state.v_worldStats} loading={this.state.loading}/>
                    </div>
                    <div className="container-fluid">
                        {this.state.v_num_Of_Countries > 1 && <GlobalTable countryDetails={this.state.v_countryDetail} rowClick={this.rowClick}/>}
                    </div>
                    <div className="container-fluid padding-bottom-50">
                        <LineChart newCasesDates={this.state.v_new_case_dates} loading={this.state.loading}/>
                    </div>

                    {this.state.v_country_name === "Canada" &&
                    <div className="container-fluid padding-bottom-50">
                        <hr />
                        <CanadaProvinceChart provinces={this.state.v_canada_provinces} loading_canada={this.state.loading_canada}/>
                    </div>}

                    {this.state.v_country_name === "Canada" &&
                    <div className="container-fluid padding-bottom-50">
                        <CanadaLoadMoreProvinceChart
                            provinces={this.state.v_canada_provinces}
                            province_detail={this.state.v_canada_provinceDetail}
                            provinceChange={this.loadCanadaProvinceDetailData}
                            loading_canada_more={this.state.loading_canada_more}
                        />
                    </div>
                    }

                    {this.state.v_num_Of_Countries > 1 &&
                    <div className="container-fluid padding-bottom-50">
                        <Geography countryDetails={this.state.v_countryDetail} loading={this.state.loading}/>
                    </div>
                    }

                    <div className="container-fluid bg-secondary">
                        <hr/>
                        <div className="text-center center-block">
                                <a href="https://www.youtube.com/channel/UCOTB75848ANSiqjumoFUFWw"><i
                                    className="fa fa-youtube-square fa-3x margin-right1rem"></i></a>
                                <a href="https://www.linkedin.com/in/anh-tran-53763b39/"><i
                                    className="fa fa-linkedin fa-3x margin-right1rem"></i></a>
                                <a href="mailto:anh.a.tran@rbc.com"><i className="fa fa-envelope-square fa-3x"></i></a>
                        </div>
                        <hr/>
                    </div>

            </>
        );
    }

}

export default App;
