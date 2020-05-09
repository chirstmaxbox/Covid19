import React, {useEffect, useState} from 'react';

const logo = require("../svg/logo.png");
function Navigation(props) {
    const [countryArray, setCountryArray] = useState([]);
    useEffect(() => {
        setCountryArray(Object.keys(props.countries).map(i => i));
    }, [props.countries] );

    return (
            <div>
                <nav className="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top" id="mainNav">
                    <div className="container-fluid">
                        <div>
                            <span className="navbar-brand"><img src={logo} onClick={props.moveToStop} style={{width: "48px", height:"48px"}} alt=""></img>Covid-19 Statistics</span>
                        </div>
                        <div className="font-weight500">
                            <a className="navbar-brand font-size-150em" onClick={props.onChange}>Canada</a>
                            <a className="navbar-brand font-size-150em" onClick={props.onChange}>Global</a>
                        </div>
                        <div className="col-4 align-self-center">
                            <form>
                                <div>
                                    <select className="form-control" id="exampleFormControlSelect1" onChange={props.onChange}>
                                        <option value="Global" key="Global">Global</option>}
                                        {
                                            countryArray.map(
                                                (country) => props.countryName === country ? <option value={country} key={country} selected>{country}</option> : <option value={country} key={country}>{country}</option>
                                            )
                                        }
                                    </select>
                                </div>
                            </form>
                        </div>
                    </div>
                </nav>
            </div>
        )
}

export default Navigation;