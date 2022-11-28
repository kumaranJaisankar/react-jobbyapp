import {Component} from 'react'
import Cookies from 'js-cookie'
import {Redirect} from 'react-router-dom'

import './index.css'

class LoginRoute extends Component {
  state = {username: '', password: '', errorMsg: '', isError: false}

  usernameInput = event => {
    this.setState({username: event.target.value})
  }

  userPasswordInput = event => {
    this.setState({password: event.target.value})
  }

  successLogin = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    history.replace('/')
  }

  onSubmitForm = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const url = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(url, options)
    const data = await response.json()
    if (response.ok === true) {
      this.successLogin(data.jwt_token)
    } else {
      this.setState({isError: true, errorMsg: data.error_msg})
    }
  }

  render() {
    const {username, password, errorMsg, isError} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }
    return (
      <div className="login-container">
        <form className="form-container" onSubmit={this.onSubmitForm}>
          <img
            src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
            alt="website logo"
            className="logo-size"
          />
          <div className="input-container">
            <label htmlFor="username">USERNAME</label>
            <input
              value={username}
              placeholder="Username"
              id="username"
              type="text"
              className="input-style"
              onChange={this.usernameInput}
            />
          </div>
          <div className="input-container">
            <label htmlFor="password">PASSWORD</label>
            <input
              value={password}
              placeholder="Password"
              id="password"
              type="password"
              className="input-style"
              onChange={this.userPasswordInput}
            />
          </div>
          <button type="submit" className="login-btn">
            Login
          </button>
          {isError && <p className="error-msg">*{errorMsg}</p>}
        </form>
      </div>
    )
  }
}
export default LoginRoute
