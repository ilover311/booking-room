import AppBar from 'material-ui/AppBar'
import Drawer from 'material-ui/Drawer';
import FlatButton from 'material-ui/FlatButton';
import MenuItem from 'material-ui/MenuItem';
import Menu from 'material-ui/Menu';
import Popover from 'material-ui/Popover';
import {
  BrowserRouter,
  Switch,
  Route,
  Redirect,
  matchPath
} from 'react-router-dom';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import React, { Component } from 'react';
import PropTypes from 'prop-types'
import './App.css';
import Auth from './Auth'
import Login from './login'
import Register from './register'
import ReserveRoom from './reserveRoom';

class NotLogin extends React.Component {
  render() {
    return (
      <FlatButton {...this.props} label="Login" onClick={() => {window.location.pathname = '/login'}}/>
    )
  }
}

class Logedin extends React.Component {
  constructor(props) {
    super(props)
    this.state = {open: false}
  }
  menuOpen = (ev) => {
    ev.preventDefault();
    this.setState({open: true, anchorEl: ev.currentTarget})
  }
  logOut = (ev) => {
    Auth.deauthenticateUser();
    window.location.pathname = '/login'
  }
  render() {
    return (
      <div>
        <FlatButton {...this.props} label={Auth.getUsername()} onClick={this.menuOpen}/>
        <Popover
          open={this.state.open}
          anchorEl={this.state.anchorEl}
          anchorOrigin={{horizontal: 'right', vertiacal: 'bottom'}}
          targetOrigin={{horizontal: 'right', vertiacal: 'top'}}
          onRequestClose={() => {this.setState({open: false})}}
          >
          <Menu>
            <MenuItem primaryText="Log out" onClick={this.logOut}/>
          </Menu>
        </Popover>
      </div>
    )
  }
}

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
    if(matchPath(window.location.pathname, {path: '/login'})) { title += ' - 로그인'}
    if(matchPath(window.location.pathname, {path: '/register'})) { title += ' - 회원가입'}
    else if(matchPath(window.location.pathname, {path: '/reserve'})) { title += ' - 회의실 예약 하기'}

    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <div>
            <AppBar
              title={title}
              onLeftIconButtonTouchTap={this.leftTapButton.bind(this)}
              iconElementRight={Auth.isUserAuthenticated() ? <Logedin/> : <NotLogin/> }
            >
              <Drawer
                docked={false}
                width={200}
                open={this.state.drawerOpen}
                onRequestChange={(open) => this.setState({drawerOpen: open})}
              >
                <MenuItem onClick={() => this.handleMenu('/reserve')}>회의실 예약</MenuItem>
              </Drawer>
            </AppBar>
            <Switch>
              <Route exact path="/login" component={Login}/>
              <Route exact path="/register" component={Register}/>
							<MatchWhenAuthorized exact path="/reserve" component={ReserveRoom} />
              <Route exact path="/" render={() => <div>SELECT MENU!<br/>CLICK LEFT-TOP HAMBUGER MENU!</div>}/>
              <Redirect to="/login"/>
            </Switch>
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;

const MatchWhenAuthorized = ({component: Component, ...rest}) => (
  <Route {...rest} render={renderProps => (
    Auth.isUserAuthenticated() ? (
      <Component {...renderProps} />
    ) : (
      <Redirect to={{
        pathname: '/login',
        state: {from: renderProps.location}
      }} />
    )
  )}/>
)

MatchWhenAuthorized.propTypes = {
  component: PropTypes.any
}