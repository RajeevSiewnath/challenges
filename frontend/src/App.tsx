import React from 'react';
import {Switch, Link, Redirect, Route} from 'react-router-dom';
import Consents from "./Consents";
import GiveConsent from "./GiveConsent";
import {RouteComponentProps} from "react-router";

function App() {
    return (
        <div id="container">
            <Route render={(props: RouteComponentProps<any>) =>
                <div id="menu">
                    <div className={props.location.pathname === '/give-consent' ? 'menu-item active' : 'menu-item'}>
                        <Link to="/give-consent">Give consent</Link>
                    </div>
                    <div className={props.location.pathname === '/consents' ? 'menu-item active' : 'menu-item'}>
                        <Link to="/consents">Collected consents</Link>
                    </div>
                </div>
            }/>
            <div id="content">
                <Switch>
                    <Route exact path="/">
                        <Redirect to="/give-consent"/>
                    </Route>
                    <Route exact path="/give-consent">
                        <GiveConsent/>
                    </Route>
                    <Route exact path="/consents">
                        <Consents/>
                    </Route>
                    <Route>
                        Error: Page not found
                    </Route>
                </Switch>
            </div>
        </div>
    );
}

export default App;
