// @flow

export function checkHttpStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    if (response.status >= 400 && response.status < 500) {
      var error = new Error("InvalidCredentials")
      throw error
    } else {
      var error = new Error("ServerError")
      error.response = response
      throw error
    }
  }
}

export function parseJSON(response) {
  return response.json()
}

export function createReducer(initialState, reducerMap) {
  return (state = initialState, action) => {
    const reducer = reducerMap[action.type];

    return reducer
      ? reducer(state, action.payload)
      : state;
  };
}
