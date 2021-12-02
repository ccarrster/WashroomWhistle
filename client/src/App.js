import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = { apiResponse: "", apiStateResponse: "" };
    }

    callAPI() {
        fetch("http://localhost:9001/api/logs/3428254740f5201991ea/0/3")
            .then(res => res.text())
            .then(res => this.setState({ apiResponse: JSON.parse(res).events[0].occupied + " " + JSON.parse(res).events[0].timestamp }))
            .catch(err => err);
    }

    callAPI2() {
        fetch("http://localhost:9001/api/status/3428254740f5201991ea")
            .then(res => res.text())
            .then(res => this.setState({ apiStateResponse: JSON.parse(res).occupied }))
            .catch(err => err);
    }

    componentDidMount() {
        this.callAPI();
        this.callAPI2();
        setInterval(this.callAPI2, 3000);
        setInterval(this.callAPI, 3000);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src="washroom.png" /><img src="whistle.png" />
                    <h1 className="App-title">Washroom Whistle</h1>
                    <div className="content">
                    <div className="washroom">
                    Kitchen Washroom 
                    <img className="icon" src={this.state.apiStateResponse?"doorclosed.png":"dooropen.png"}></img>
                    <img className="icon" src="bath.png"></img>
                   <img className="icon" src="shower.png"></img>
                   <img className="icon" src="sink.png"></img>
                   <img className="icon" src="toilet.png"></img>
                   <img className="icon" src="bidet.png"></img>
                   <img className="icon" src="stink.png"></img>
                   <div>Log - Log</div>
                   <div>{this.state.apiResponse}</div>
                   </div>
                   <div className="washroom">
                    Bedroom Washroom
                   <img className="icon" src="doorclosed.png"></img>
                   <img className="icon" src="sink.png"></img>
                   <img className="icon" src="toilet.png"></img>
                   <div>Log - Log</div>
                   </div>
                   </div>
                </header>
            </div>
        );
    }
}

export default App;
