import React, { Component, Fragment } from "react";
import logo from "./logo.svg";
import "./App.css";


class App extends Component {
    constructor(props) {
        super(props);
        this.state = { logs: [], occupied: true };
    }

    async componentDidMount() {
        setInterval(async () => {
            const statusRes = await fetch('http://localhost:9001/api/status/3428254740f5201991ea');
            const logRes = await fetch('http://localhost:9001/api/logs/3428254740f5201991ea/0/3');

            const status = await statusRes.json();
            const logs = await logRes.json();

            this.setState({
                occupied: status.occupied,
                logs: logs.events
            });
        }, 500);
    }

    render() {
        return (
            <div className="App">
                <header className="App-header">
                    <img src="washroom.png" /><img src="whistle.png" />
                    <h1 className="App-title">Washroom Whistle</h1>
                    <div className="content">
                        <div className="washroom">
                            <img className="icon" src="bath.png"></img>
                            <img className="icon" src="shower.png"></img>
                            <img className="icon" src="sink.png"></img>
                            <img className="icon" src="toilet.png"></img>
                            <img className="icon" src="bidet.png"></img>
                            <img className="icon" src="stink.png"></img>

                            <br />

                            <h3>Kitchen Washroom</h3>
                            <p><strong>Status:</strong> {this.state.occupied ? 'Occupied' : 'Available'}</p>
                            
                            <img className="icon" src={this.state.occupied ? "doorclosed.png" : "dooropen.png"}></img>

                            <br />

                            <h3>Recent Events</h3>
                            <table>
                                <thead>
                                <tr>
                                    <th>Time</th>
                                    <th>Washroom Status</th>
                                </tr>
                                </thead>
                                <tbody>
                                {this.state.logs.map((log, i) => {
                                    return (
                                        <tr key={i}>
                                            <td>{log.timestamp}</td>
                                            <td>{log.occupied ? 'Occupied' : 'Available'}</td>
                                        </tr>
                                    );
                                })}
                                </tbody>
                            </table>
                        </div>
                        {/* <div className="washroom">
                            Bedroom Washroom
                            <img className="icon" src="doorclosed.png"></img>
                            <img className="icon" src="sink.png"></img>
                            <img className="icon" src="toilet.png"></img>
                            <div>Log - Log</div>
                        </div> */}
                    </div>
                </header>
            </div>
        );
    }
}

export default App;
