import React, {useEffect, useState} from 'react';

function Navigation(props) {
    const [countryArray, setCountryArray] = useState([]);
    useEffect(() => {
        setCountryArray(Object.keys(props.countries).map(i => i));
    }, [props.countries] );

    return (
            <div>
                <nav className="navbar navbar-expand-lg bg-secondary text-uppercase fixed-top" id="mainNav">
                    <div className="container">
                        <a className="navbar-brand js-scroll-trigger">Covid-19 Statistics</a>
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