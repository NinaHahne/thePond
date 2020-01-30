import React from 'react';
// import axios from 'axios';
// axios copy including csrf token:
import axios from './axios';
import { Link } from 'react-router-dom';

export default class Registration extends React.Component {
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
                {this.state.error && <div className="error">Oops!</div>}
                <input name="first" placeholder="first" onChange={e => this.handleChange(e)} />
                <input name="last" placeholder="last" onChange={e => this.handleChange(e)}/>
                <input name="email" placeholder="email" onChange={e => this.handleChange(e)}/>
                <input type="password" name="password" placeholder="password" onChange={e => this.handleChange(e)}/>
                <button onClick={e => this.submit(e)}>register</button>

                {/*<p>Already a member? <a href="#">Log in</a></p>*/}
                <p>Already a member? <Link to="/login">Log in</Link> </p>


            </div>
        );
    }
}
