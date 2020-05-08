import React, {Component} from "react"
import { Spinner } from 'react-bootstrap';

function CardChart(props) {
    return (
        <div className="container">
            <div className="row">
                <div className="col">
                    <div className="card text-white bg-info mb-3">
                        <div className="card-header">Confirmed</div>
                        <div className="card-body text-center">
                            <h4>{!!(props.worldStats.confirmed) ? props.worldStats.confirmed.toLocaleString() : "0"}</h4>
                            {props.loading && <Spinner animation="border" role="status"></Spinner>}
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card text-white bg-success mb-3">
                        <div className="card-header">Recovered</div>
                        <div className="card-body text-center">
                            <h4>{!!(props.worldStats.recovered) ? props.worldStats.recovered.toLocaleString() : "0"}</h4>
                            {props.loading && <Spinner animation="border" role="status"></Spinner>}
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card text-white bg-dark mb-3">
                        <div className="card-header">Death</div>
                        <div className="card-body text-center">
                            <h4>{!!(props.worldStats.deaths) ? props.worldStats.deaths.toLocaleString() : "0"}</h4>
                            {props.loading && <Spinner animation="border" role="status"></Spinner>}
                        </div>
                    </div>
                </div>
                <div className="col">
                    <div className="card text-white bg-danger mb-3">
                        <div className="card-header">Active</div>
                        <div className="card-body text-center">
                            <h4>{!!(props.worldStats.active) ? props.worldStats.active.toLocaleString() : "0"}</h4>
                            {props.loading && <Spinner animation="border" role="status"></Spinner>}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}


export default CardChart;