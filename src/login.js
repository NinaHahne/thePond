import React from 'react';
// axios copy including csrf token:
// import axios from './axios';
import { Link } from 'react-router-dom';

// REFACTORING WITH HOOKS **************************************
import {useStatefulFields} from './hooks/useStatefulFields';
import {useAuthSubmit} from './hooks/useAuthSubmit';

export default function Login() {

    const [values, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit('/login', values);

    return (
        <div className="login">
            {error && <div className="error">Oops!</div>}
            <input className="input" name="email" placeholder="email" onChange={e => handleChange(e)}/>
            <input className="input" type="password" name="password" placeholder="password" onChange={e => handleChange(e)}/>
            <button onClick={e => handleSubmit(e)}>hop in</button>

            <p>Not a member yet? <Link className="link" to="/">register</Link> </p>
            <p>Forgot your password? <Link className="link" to="/reset">Reset password</Link> </p>

        </div>
    );

}

// WITHOUT HOOKS: ***********************************************

// export default class Login extends React.Component {
//     constructor(props) {
//         super(props);
//         this.state = {};
//     }
//     handleChange(e) {
//         // this[e.target.name] = e.target.value;
//         this.setState({
//             [e.target.name]: e.target.value
//         });
//     }
//     submit(e) {
//         e.preventDefault();
//         axios.post('/login', {
//             email: this.state.email,
//             password: this.state.password
//         }).then(({data}) => {
//             if (data.success) {
//                 // it worked
//                 location.replace('/');
//             } else {
//                 // failure!
//                 this.setState({
//                     error: true
//                 });
//             }
//         });
//     }
//     render() {
//         return (
//             <div className="login">
//                 {this.state.error && <div className="error">Oops!</div>}
//                 <input className="input" name="email" placeholder="email" onChange={e => this.handleChange(e)}/>
//                 <input className="input" type="password" name="password" placeholder="password" onChange={e => this.handleChange(e)}/>
//                 <button onClick={e => this.submit(e)}>hop in</button>
//
//                 {/*<p>Already a member? <a href="#">Log in</a></p>*/}
//                 <p>Not a member yet? <Link to="/">register</Link> </p>
//                 <p>Forgot your password? <Link to="/reset">Reset password</Link> </p>
//
//             </div>
//         );
//     }
// }
