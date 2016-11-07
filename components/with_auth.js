// @flow
import React, { Component, PropTypes } from 'react'
import {connect} from 'react-redux';
import {Text, View}  from 'react-native'
import {loginUser} from '../actions';

function connectLogin(rawLogin, keyName, endpointUrl) {
  const mapStateToProps = (state) => (
    {
      isAuthenticating: state.auth.isAuthenticating,
      error:            state.auth.error
    }
  );

  const bindActions = (dispatch) => {
    return {
      loginUser: (keyValue, password) => dispatch(loginUser(endpointUrl, keyName, keyValue, password))
    }
  }

  return connect(mapStateToProps, bindActions)(rawLogin);
}

class WithAuth extends Component {
  static propTypes = {
    isAuthenticated: PropTypes.bool.isRequired,
    loginComponent: PropTypes.any.isRequired,
    endpointUrl: PropTypes.string.isRequired
  }

  render() {
    if (this.props.isAuthenticated) {
      return this.props.children
    } else {
      return React.createElement(connectLogin(this.props.loginComponent, this.props.keyField, this.props.endpointUrl), {})
    }
  }
}

const mapStateToProps = (state) => ({
  isAuthenticated : state.auth.isAuthenticated
});

export default connect(mapStateToProps)(WithAuth);
