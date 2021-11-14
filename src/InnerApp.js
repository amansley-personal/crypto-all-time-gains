import React from 'react';
import AppHeader from './Components/AppHeader';
import AppMainBody from "./Components/AppMainBody";

class InnerApp extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <>
                <section className="application-wrapper">
                    <AppHeader data={this.props.state.application} />
                    <AppMainBody />
                </section>

            </>
        )
    }
}

export default InnerApp
