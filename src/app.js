import React from "react";
import axios from "./axios";
import { BrowserRouter, Route, Link } from "react-router-dom";

import ProfilePic from "./profilepic";
import Uploader from "./uploader";
import Profile from "./profile";
import OtherProfile from "./other-profile";
import FindPeople from "./find-people";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
        // if you don't use arrow functions to pass functions to children, you need to bind this:
        // this.setBio = this.setBio.bind(this);
    }
    componentDidMount() {
        axios.get("/user").then(({ data }) => {
            // console.log('data from get /user: ', data);
            this.setState(data);
            // console.log("state of app: ", this.state);
        });
    }
    setBio(updatedBio) {
        // console.log("in App, new bio text: ", updatedBio);
        this.setState({
            bio: updatedBio
        });
    }
    render() {
        if (!this.state.userId) {
            // return null;
            // return 'loading...';
            return (
                <div>
                    <img src="/images/thePond_2.svg" alt="thePond" />
                    <img src="/images/loading_fish.gif" alt="Loading..." />;
                </div>
            );
        }
        return (
            <BrowserRouter>
                <React.Fragment>
                    <header>
                        <div className="logo-small">
                            <img src="/images/thePond_4.svg" alt="thePond" />
                        </div>
                        <div className="nav">
                            <Link to="/users">Find people</Link>
                            <a href="/logout">hop out</a>
                        </div>
                        {this.state.uploaderIsVisible && (
                            <Uploader
                                // setImageUrl={imageUrl => this.setState({imageUrl})}
                                setImageUrl={imageUrl =>
                                    this.setState({
                                        imageUrl: imageUrl,
                                        uploaderIsVisible: false
                                    })
                                }
                                closeUploader={() =>
                                    this.setState({ uploaderIsVisible: false })
                                }
                            />
                        )}
                        <ProfilePic
                            clickHandler={() =>
                                this.setState({ uploaderIsVisible: true })
                            }
                            imageUrl={this.state.imageUrl}
                            first={this.state.first}
                            last={this.state.last}
                        />
                    </header>
                    {/* <Route exact path="/chat" component={Chat} /> */}
                    <Route
                        exact
                        path="/"
                        render={() => (
                            <Profile
                                userId={this.state.userId}
                                first={this.state.first}
                                last={this.state.last}
                                imageUrl={this.state.imageUrl}
                                clickHandler={() =>
                                    this.setState({ uploaderIsVisible: true })
                                }
                                bio={this.state.bio}
                                // setBio={this.setBio}
                                setBio={updatedBio =>
                                    this.setState({ bio: updatedBio })
                                }
                            />
                        )}
                    />
                    {/* <Route path="/user/:id" userId={this.state.userId} component={OtherProfile}/> */}
                    <Route
                        path="/user/:id"
                        render={props => (
                            <OtherProfile
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                                userId={this.state.userId}
                            />
                        )}
                    />
                    <Route
                        path="/users"
                        render={props => (
                            <FindPeople
                                key={props.match.url}
                                match={props.match}
                                history={props.history}
                                userId={this.state.userId}
                            />
                        )}
                    />
                </React.Fragment>
            </BrowserRouter>
        );
    }
}
