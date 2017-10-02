import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  matchPath
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React, { Component } from 'react';
import './App.css';

import SearchRoom from './SearchRoom';

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      drawerOpen: false,
    };
  }
  
  leftTapButton() {
    let _this = this;
    _this.setState({
      drawerOpen: true
    })
  }

  render() {
    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <div>
            <AppBar
              title="회의실 예약 SAP"
              onLeftIconButtonTouchTap={this.leftTapButton.bind(this)}
            />
            <Drawer
              docked={false}
              width={200}
              open={this.state.drawerOpen}
              onRequestChange={(open) => this.setState({drawerOpen: open})}
            >
              <MenuItem onClick={() => this.setState({drawerOpen: false})}>Menu Item</MenuItem>
            </Drawer>
            <Switch>
              <Route path="/" component={SearchRoom}/>
            </Switch>
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;

