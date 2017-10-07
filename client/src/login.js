import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import axios from 'axios';
import validator from 'validator';
import Auth from './Auth'

import './login.css'

class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state= {
      username: '',
      password: '',
      sb_open: false,
      sb_msg: '',
    }
  }

  tryLogin(ev) {
    let _this = this;
    let payload = {
      username: this.state.username.trim(),
      password: this.state.password.trim()
    }

    if(!validator.isEmail(this.state.username)) {
      _this.setState({sb_open: true, sb_msg: '이메일 형식에 맞지 않습니다.'})
      return;
    }

    if(validator.isEmpty(this.state.password)) {
      _this.setState({sb_open: true, sb_msg: '패스워드가 비었습니다.'})
      return;
    }

    axios.post('/auth/login', payload)
    .then(res => {
      if(res.status === 200) {
        Auth.authenticateUser(res.data.token, res.data.user.username, res.data.user.access);
        window.location.pathname = this.state.from ? this.state.from : '/';
      } else {
        _this.setState({sb_open: true, sb_msg: res.data.message+'('+res.status+')'})
      }
    })
    .catch(err => {
      //_this.setState({sb_open: true, sb_msg: err.response.data.message})
    })
  }

  render() {
    return (
      <div className='login'>
        <br/>
        <h3>로그인</h3>
        <TextField
          hintText="Enter your Email"
          floatingLabelText="Email"
          onChange={(ev, val) => this.setState({username: val})}
        />
        <br/>
        <TextField
          type="password"
          hintText="Enter your password"
          floatingLabelText="Password"
          onChange={(ev, val) => this.setState({password: val})}
        />
        <br/>
        <RaisedButton label="Register" onClick={(ev) => {window.location.pathname = '/register'}}/>
        <span>  </span>
        <RaisedButton label="Login" primary={true} onClick={(ev) => {this.tryLogin(ev)}}/>
      </div>
    );
  }


}

export default Login;