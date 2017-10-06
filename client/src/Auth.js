class Auth {
  static authenticateUser(token, username, access) {
    localStorage.setItem('token', token);
    localStorage.setItem('username', username);
    localStorage.setItem('access', access);
  }

  static isUserAuthenticated() {
    return localStorage.getItem('token') !== null;
  }
    
  static deauthenticateUser() {
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    localStorage.removeItem('access')
  }

  static getToken() {
    return localStorage.getItem('token') 
  }

  static getUsername() {
    return localStorage.getItem('username')
  }

  static getAccess() {
    return localStorage.getItem('access')
  }

  static getHeader() {
    return { headers: { Authorization: `bearer ${localStorage.getItem('token')}`} }
  }
}

export default Auth;