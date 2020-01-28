import React from "react";
import Greetee from "./greetee";
import Changer from "./changer";

export default class Hello extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "Kitty"
        };
    }
    render() {
        const name = this.state.name;
        const style = {
            color: "darkslategray",
            fontFamily: "impact",
            fontSize: "40px"
        };
        return (
            <div style={style} >
                <p>
                    Hello,
                    {name ? <Greetee name={name} age={2 * 50} /> : "Nobody"}!
                </p>
                <div>
                    <img src="/images/welcome-to_2.svg" alt="welcome to"></img>
                    <img src="/images/thePond.svg" alt="thePond"></img>
                </div>
                <div>
                    <Changer change={name => this.setState({ name })} />
                </div>
            </div>
        );
    }
}
