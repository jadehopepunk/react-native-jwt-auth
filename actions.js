// @flow
import { checkHttpStatus, parseJSON } from './utils'
import jwtDecode from 'jwt-decode'
import {LOGIN_USER_REQUEST, LOGIN_USER_SUCCESS, LOGIN_USER_FAILURE} from './constants'

// import {replaceRoute} from '../actions/route';

export function loginUserRequest() {
  return {
    type: LOGIN_USER_REQUEST
  }
}

export function loginUserSuccess(token, decodedToken) {
  // localStorage.setItem('token', token);
  return {
    type: LOGIN_USER_SUCCESS,
    payload: {
      token: token
    }
  }
}

export function loginUserFailure(error) {
  // localStorage.removeItem('token');
  return {
    type: LOGIN_USER_FAILURE,
    payload: {
      status: (error.response ? error.response.status : null),
      error: (error.response ? error.response.error : error.message)
    }
  }
}

export function loginUser(endpointUrl, keyName, keyValue, password, redirect="/") {
  return function(dispatch) {
    dispatch(loginUserRequest());

    const params = {password: password}
    params[keyName] = keyValue

    return fetch(endpointUrl, {
      method: 'post',
      credentials: 'include',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
        body: JSON.stringify(params)
      })
      .then(checkHttpStatus)
      .then(parseJSON)
      .then(response => {
        try {
          let decoded = jwtDecode(response.token);
          dispatch(loginUserSuccess(response.token, decoded));
          // dispatch(replaceRoute("home"));
        } catch (e) {
          console.log('e', e)

          dispatch(loginUserFailure({
            response: {
              status: 403,
              error: {type: e.name, message: e.message}
            }
          }));
        }
      })
      .catch(error => {
          console.log('promise error', error)
          console.log('promise error', error.response)
          var errorType = error.name
          if (error.message == "Network request failed") errorType = "NetworkRequestFailed"
          if (error.message == "InvalidCredentials") errorType = "InvalidCredentials"

          dispatch(loginUserFailure({
            response: {
              status: 403,
              error: {type: errorType, message: error.message}
            }
          }));
      })
  }
}
