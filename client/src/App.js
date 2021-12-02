import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "" };
    }

    callAPI() {
        fetch("http://localhost:9001/testAPI")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: res }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src="washroom.png" /><img src="whistle.png" />
                    <h1 className="App-title">Washroom Whistle</h1>
                    <div class="content">
                    <div class="washroom">
                    Kitchen Washroom 
                    <img class="icon" src="dooropen.png"></img>
                    <img class="icon" src="bath.png"></img>
                   <img class="icon" src="shower.png"></img>
                   <img class="icon" src="sink.png"></img>
                   <img class="icon" src="toilet.png"></img>
                   <img class="icon" src="bidet.png"></img>
                   <img class="icon" src="stink.png"></img>
                   <div>Last used at 12:42 pm</div>
                   </div>
                   <div class="washroom">
                    Bedrooms 
                   <img class="icon" src="doorclosed.png"></img>
                   <img class="icon" src="sink.png"></img>
                   <img class="icon" src="toilet.png"></img>
                   <div>In use since 12:57 pm</div>
                   </div>
                   </div>
                </header>
                <p className="App-intro">{this.state.apiResponse}</p>
            </div>
        );
    }
}

export default App;
