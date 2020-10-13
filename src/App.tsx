import * as React from 'react';
import './App.css';
import Notifications from 'react-notify-toast';

class App extends React.Component {

    constructor(props: any) {
        super(props);
        this.state = {
            authLoaded: false,
            authenticated: false
        };
    }

    render() {
        return (
            <div className="App">
                <div className="Content">
                    {this.props.children}
                </div>
                <Notifications/>
            </div>
        );
    }

}


export default App;
