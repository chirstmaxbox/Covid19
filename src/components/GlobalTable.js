import React, {useEffect, useState} from "react";
import { MDBDataTable } from 'mdbreact';
import {overwrite, getCode} from "country-list";
import Flag from 'react-world-flags';

function GlobalTable(props) {
    const columns = [
        {label: [<p className="text-left">Country</p>], field: 'country'},
        {label: [<p className="text-center">Total Cases</p>], field: 'total_case'},
        {label: [<p className="text-center">New Cases</p>], field: 'new_cases'},
        {label: [<p className="text-center">Total Deaths</p>], field: 'total_deaths'},
        {label: [<p className="text-center">New Deaths</p>], field: 'new_deaths'},
        {label: [<p className="text-center">Total Recovered</p>], field: 'total_recovered'},
        {label: [<p className="text-center">Active Cases</p>], field: 'active_cases'}
    ]
    const [countries, setCountries] = useState([]);
    const data = {
        columns: columns,
        rows: countries
    }

    useEffect(() => {
        let temp = Object.entries(props.countryDetails).map(([key, value]) => ({key, value}));
        temp.sort((a, b) => {
            if(a.value.confirmed > b.value.confirmed) {
                return -1;
            }
            if(a.value.confirmed < b.value.confirmed) {
                return 1;
            }
            return 0;
        });

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

        let countries = [];
        temp.map((element) => {
            countries.push({
                country: [element.key, getCode(element.key) && <Flag code={getCode(element.key)} callback={<span>unknown</span>} style={{paddingLeft: "5px", width:"30px", height:"30px"}}/>],
                total_case: [<p className="text-center font-weight-bold">{element.value.confirmed.toLocaleString()}</p>],
                new_cases: [<p className="text-orange font-weight-bold text-center">{element.value.new_cases.toLocaleString()}</p>],
                total_deaths: [<p className="text-center">{element.value.deaths.toLocaleString()}</p>],
                new_deaths: [<p className="text-danger font-weight-bold text-center">{element.value.new_deaths.toLocaleString()}</p>],
                total_recovered: [<p className="text-center">{element.value.recovered.toLocaleString()}</p>],
                active_cases:  [<p className="text-center">{element.value.active.toLocaleString()}</p>],
                clickEvent: () => props.rowClick(element.key)
            })
        });

        setCountries(countries);
    }, [props.countryDetails])

    /*
    useEffect(() => {
        let temp = Object.entries(props.countryDetails).map(([key, value]) => ({key,value}));
        temp.sort((a, b) => {
            if(a.value.confirmed > b.value.confirmed) {
                return -1;
            }
            if(a.value.confirmed < b.value.confirmed) {
                return 1;
            }
            return 0;
        });
        setCountries(temp);
    }, [props.countryDetails])
     */

    return (
        <div className="container-fluid padding-top-50 padding-left-100 padding-right-100">
            <MDBDataTable
                small
                hover
                sortable={false}
                entries={10}
                data={data}
            />
        </div>
        /*
        <div className="container-fluid padding-top-80 padding-left-150 padding-right-150">
            <table id="example" className="table table-striped text-center table-bordered">
                <thead className="thead-dark">
                <tr>
                    <th scope="col">Country</th>
                    <th scope="col">Total Cases</th>
                    <th scope="col">New Cases</th>
                    <th scope="col">Total Deaths</th>
                    <th scope="col">New Deaths</th>
                    <th scope="col">Total Recovered</th>
                    <th scope="col">Active Cases</th>
                </tr>
                </thead>
                <tbody>
                {
                    countries.map((element) => <tr>
                        <th><a href="#">{element.key.toString()}</a></th>
                        <td>{element.value.confirmed.toLocaleString()}</td>
                        <td className="text-orange font-weight-bold">{element.value.new_cases.toLocaleString()}</td>
                        <td>{element.value.deaths.toLocaleString()}</td>
                        <td className={element.value.new_deaths > 0 ? "text-danger font-weight-bold" : ""}>{element.value.new_deaths.toLocaleString()}</td>
                        <td>{element.value.recovered.toLocaleString()}</td>
                        <td>{element.value.active.toLocaleString()}</td>
                    </tr>)
                }
                </tbody>
                <tfoot>
                <tr>
                    <th>Country</th>
                    <th>Total Cases</th>
                    <th>New Cases</th>
                    <th>Total Deaths</th>
                    <th>New Deaths</th>
                    <th>Total Recovered</th>
                    <th>Active Cases</th>
                </tr>
                </tfoot>
            </table>
        </div>

         */

    )
}


export default GlobalTable;