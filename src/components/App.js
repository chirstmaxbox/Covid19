import React from 'react';
import Navigation from "./Navigation";
import axios from "axios";
import LineChart from "./LineChart";
import CardChart from "./CardChart";
import GlobalTable from "./GlobalTable";
import Geography from "./Geography";

window.baseURL = "https://pomber.github.io/covid19/timeseries.json";
class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: true,
            v_new_case_dates: [],
            v_countries: [],
            v_countryDetail: [],
            v_worldStats: {},
            v_lastUpdate: "",
            v_country_name: "",
            v_num_Of_Countries: 0
        }
        this.loadData = this.loadData.bind(this);
    }

    componentDidMount() {
        this.loadData();
    }

    selectCountry = (e) => {
        this.calculateData(e.target.value, this.state.v_countries);
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

    loadData() {
        axios.get(`${window.baseURL}`)
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

    render() {
        return (
            <>
                <div>
                    <Navigation countries={this.state.v_countries} onChange={this.selectCountry} countryName={this.state.v_country_name}/>
                </div>
                <div>
                    <div>
                        <p className="text-right padding-top-120 padding-right-70">Last update: {this.state.v_lastUpdate.toString()}</p>
                        <h1 className="font-size-275em text-center padding-bottom-50">{this.state.v_country_name}</h1>
                    </div>
                    <div>
                        <CardChart worldStats={this.state.v_worldStats} loading={this.state.loading}/>
                    </div>
                    {this.state.v_num_Of_Countries > 1 && <div><GlobalTable countryDetails={this.state.v_countryDetail} rowClick={this.rowClick}/></div>}
                    <div className="padding-bottom-50">
                        <LineChart newCasesDates={this.state.v_new_case_dates} loading={this.state.loading}/>
                    </div>
                    <div className="padding-bottom-20">
                        <Geography countryDetails={this.state.v_countryDetail} loading={this.state.loading}/>
                    </div>
                </div>

            </>
        );
    }

}

export default App;
