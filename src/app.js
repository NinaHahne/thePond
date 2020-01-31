import React from 'react';
import axios from './axios';
import ProfilePic from './profilepic';
import Uploader from './uploader';

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
    componentDidMount() {
        axios.get('/user').then(
            ({data}) => {
                console.log('data from get /user: ', data);
                this.setState(data);
            }
        );
    }
    render() {
        if (!this.state.userId) {
            // return null;
            // return 'loading...';
            return (
                <div>
                    <img src="/images/thePond_2.svg" alt="thePond"/>
                    <img src="/images/loading_fish.gif" alt="Loading..." />;
                </div>
            );
        }
        return (
            <header>
                <div className="logo-small">
                    <img src="/images/thePond_3.svg" alt="thePond"/>
                    <p><a href="/logout">hop out</a></p>
                </div>
                <ProfilePic
                    clickHandler={() => this.setState({uploaderIsVisible: true})}
                    imageUrl={this.state.imageUrl}
                    first={this.state.first}
                    last={this.state.last}
                />
                {this.state.uploaderIsVisible && <Uploader
                    // setImageUrl={imageUrl => this.setState({imageUrl})}
                    setImageUrl={imageUrl => this.setState({
                        imageUrl: imageUrl,
                        uploaderIsVisible: false
                    })}
                />}
            </header>
        );
    }
}
