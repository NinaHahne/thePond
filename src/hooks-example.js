import React, { useState, useEffect } from 'react';
import axios from './axios';

function Hello() {
    const [greetee, setGreetee] = useState('World');
    const [countries, setCountries] = useState([]);
    const [country, setCountry] = useState('');
    // runs when component mounts AND when country changes (because of [country] in line 18)
    useEffect(() => {
        let ignore = false;
        (async () => {
            try {
                const { data } = await axios.get('http://flame-egg.glitch.me/q=' + country);
                if (!ignore) {
                    setCountries(data);
                }
            } catch (err) {
                console.log(err);
            }
        })();

        return () => {
            // clean up function (return in useEffect is always a cleanup function)
            // invoked before component is re-rendered
            console.log('country in cleanup: ', country);
            // in this cleanup function, country is always previous input (1 step behind)
            // invalidate responses that don't come back in the right order
            ignore = true;
        };
    }, [country]);

    const onCountryChange = ({target}) => {
        console.log('target.value: ', target.value);
        setCountry(target.value);
    };

    return (
        <div>
            <p>
                Hello, <strong>{greetee}</strong>
            </p>
            {/* <input onChange={e => setGreetee(e.target.value)} defaultValue={greetee} /> */}
            <input onChange={onCountryChange} placeholder='countries to search' />
            <ul>
                { countries.map((country, idx) => {
                    console.log('country: ', country);
                    return <li key={idx}>{ country }</li>;
                }) }
            </ul>
        </div>
    );
}
