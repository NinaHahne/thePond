import React from 'react';
// import axios from 'axios';
// axios copy including csrf token:
import axios from './axios';
import { Link } from 'react-router-dom';

export default class Registration extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            soundHopIn: new Audio("/sounds/364700__alegemaate__water-splash.wav")
        };
    }
    handleChange(e) {
        // this[e.target.name] = e.target.value;
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    submit(e) {
        e.preventDefault();
        axios.post('/register', {
            first: this.state.first,
            last: this.state.last,
            email: this.state.email,
            password: this.state.password
        }).then(({data}) => {
            if (data.success) {
                // it worked
                this.state.soundHopIn.play();
                location.replace('/');
            } else {
                // failure!
                this.setState({
                    error: true
                });
            }
        });
        // or:
        // axios.post('/register', this.state);
    }
    render() {
        return (
            <div className="register">
                {this.state.error && <div className="error">Oops! Please try again!</div>}
                <input className="input" name="first" placeholder="first" onChange={e => this.handleChange(e)} />
                <input className="input" name="last" placeholder="last" onChange={e => this.handleChange(e)}/>
                <input className="input" name="email" placeholder="email" onChange={e => this.handleChange(e)}/>
                <input className="input" type="password" name="password" placeholder="password" onChange={e => this.handleChange(e)}/>
                <button onClick={e => this.submit(e)}>register</button>

                {/*<p>Already a member? <a href="#">Log in</a></p>*/}
                <p>Already a member? <Link className="link" to="/login">Hop in</Link> </p>

                <img className="reed" src="/images/jing.fm-pond-clipart-293509.png"></img>
            </div>
        );
    }
}
