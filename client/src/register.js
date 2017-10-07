import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import Snackbar from 'material-ui/Snackbar';
import axios from 'axios';
import validator from 'validator';

import './register.css'

class Register extends React.Component{
  constructor(props){
    super(props)
    this.state = {
      email: '',
      password: '',
      password2: '',
      sb_open: false,
      sb_msg: '',
    }
  }

  tryRegister(ev) {
    let _this = this;
    let payload = {
      email: this.state.email.trim(),
      password: this.state.password.trim()
    }
    console.log(_this.state)

    if (!validator.isEmail(this.state.email)) {
      _this.setState({sb_open: true, sb_msg: 'Email validation failed!'})
      return;
    }

    if (validator.isEmpty(this.state.password)) {
      _this.setState({sb_open: true, sb_msg: 'password is empty!'})
      return;
    }
    if (this.state.password !== this.state.password2) {
      _this.setState({sb_open: true, sb_msg: 'Both passwords are not same string!'})
      return;
    }

    axios.post('/auth/register', payload)
    .then(res => {
      if (res.status === 200) {
        _this.setState({sb_open: true})
      } else {
        _this.setState({sb_open: true, sb_msg: res.data.message+'('+res.status+')'})
      }
    })
    .catch(err => {
      _this.setState({sb_open: true, err_msg: err.response.data.message})
    })
  }

  render() {
    return (
      <div className='register'>
        <br/>
        <h3>회원가입</h3>
        <TextField
          hintText='Enter your Email'
          type="email"
          floatingLabelText="Email"
          onChange={(ev, val) => { this.setState({email: val})}}
        />
        <br/>
        <TextField
          hintText='Enter your password'
          type="password"
          floatingLabelText="Password"
          onChange={(ev, val) => { this.setState({password: val})}}
        />
        <br/>
        <TextField
          hintText='Check your password'
          type="password"
          floatingLabelText="Check Password"
          onChange={(ev, val) => { this.setState({password2: val})}}
        />
        <br/>
        <RaisedButton label="Submit" primary={true} onClick={(ev) => { this.tryRegister(ev)}}/>
        <Snackbar
          open={this.state.sb_open}
          message={this.state.sb_msg}
          autoHideDuration={4000}
          onRequestClose={() => {this.setState({sb_open: false})}}/>
      </div>
    )
  }
}

export default Register;