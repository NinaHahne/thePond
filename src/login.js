import React from 'react';
// axios copy including csrf token:
import axios from './axios';
import { Link } from 'react-router-dom';

export default class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    handleChange(e) {
        // this[e.target.name] = e.target.value;
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    submit() {
        axios.post('/login', {
            email: this.state.email,
            password: this.state.password
        }).then(({data}) => {
            if (data.success) {
                // it worked
                location.replace('/');
            } else {
                // failure!
                this.setState({
                    error: true
                });
            }
        });
    }
    render() {
        return (
            <div>
                {this.state.error && <div className="error">Oops!</div>}
                <input name="email" placeholder="email" onChange={e => this.handleChange(e)}/>
                <input type="password" name="password" placeholder="password" onChange={e => this.handleChange(e)}/>
                <button onClick={e => this.submit()}>hop in</button>

                {/*<p>Already a member? <a href="#">Log in</a></p>*/}
                <p>Not a member yet? <Link to="/">register</Link> </p>

            </div>
        );
    }
}
