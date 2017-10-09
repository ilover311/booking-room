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
import Login from './login'
import Register from './register'
import Mybooking from './mybooking'
import ReserveRoom from './reserveRoom';
import cookie from 'react-cookies'

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
    cookie.remove('token')
    cookie.remove('access')
    cookie.remove('username')
    window.location.pathname = '/login'
  }
  render() {
    return (
      <div>
        <FlatButton {...this.props} label={cookie.load('username')} onClick={this.menuOpen}/>
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

class Main extends Component { 
  render() {
    return (
      <div className="starter-template App">
          <h1>Booking Room Single Web Application</h1>
          <p className="lead">오른쪽 위 상단 회원가입 및 로그인 후에 왼쪽 상단 햄버거 메뉴를 통해서 예약 및 수정이 가능합니다.</p>
      </div>
    );
  }
};

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
    else if(matchPath(window.location.pathname, {path: '/register'})) { title += ' - 회원가입'}
    else if(matchPath(window.location.pathname, {path: '/reserve'})) { title += ' - 회의실 예약 하기'}
    else if(matchPath(window.location.pathname, {path: '/mybooking'})) { title += ' - 내 예약 보기'}

    return (
      <BrowserRouter>
        <MuiThemeProvider>
          <div>
            <AppBar
              title={title}
              onLeftIconButtonTouchTap={this.leftTapButton.bind(this)}
              iconElementRight={cookie.load('token') ? <Logedin/> : <NotLogin/> }
            >
              <Drawer
                docked={false}
                width={200}
                open={this.state.drawerOpen}
                onRequestChange={(open) => this.setState({drawerOpen: open})}
              >
                <MenuItem onClick={() => this.handleMenu('/reserve')}>회의실 예약</MenuItem>
                <MenuItem onClick={() => this.handleMenu('/mybooking')}>내 예약 보기</MenuItem>
              </Drawer>
            </AppBar>
            <div className="container">
              <Switch>
                <Route exact path="/login" component={Login}/>
                <Route exact path="/register" component={Register}/>
                <MatchWhenAuthorized exact path="/reserve" component={ReserveRoom} />
                <MatchWhenAuthorized exact path="/mybooking" component={Mybooking} />
                <Route exact path="/" component={Main}/>
                <Redirect to="/login"/>
              </Switch>
            </div>
          </div>
        </MuiThemeProvider>
      </BrowserRouter>
    );
  }
}

export default App;

const MatchWhenAuthorized = ({component: Component, ...rest}) => (
  <Route {...rest} render={renderProps => (
    cookie.load('token') ? (
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