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

import ReserveRoom from './reserveRoom';

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
  

	handleMenu = (pathname) => { window.location.pathname = pathname; }

  render() {
    let title = '회의실 예약 SPA'
    if(matchPath(window.location.pathname, {path: '/list'})) { title += ' - 회의실 리스트 보기'}
    else if(matchPath(window.location.pathname, {path: '/reserve'})) { title += ' - 회의실 예약 하기'}

    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <div>
            <AppBar
              title={title}
              onLeftIconButtonTouchTap={this.leftTapButton.bind(this)}
            >
              <Drawer
                docked={false}
                width={200}
                open={this.state.drawerOpen}
                onRequestChange={(open) => this.setState({drawerOpen: open})}
              >
                <MenuItem onClick={() => this.handleMenu('/list')}>회의실 리스트</MenuItem>
                <MenuItem onClick={() => this.handleMenu('/reserve')}>회의실 예약</MenuItem>
              </Drawer>
            </AppBar>
            <Switch>
							<Route exact path="/reserve" component={ReserveRoom} />
              <Route exact path="/" render={() => <div>SELECT MENU!<br/>CLICK LEFT-TOP HAMBUGER MENU!</div>}/>
            </Switch>
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;
