import * as actionTypes from './actionTypes';

const initialState = {
  username: '',
  email: '',
  password: '',
  usernameErr: '',
  emailErr: '',
  statusMSG: '',
  isAdmin: null,
  users: [],
  groups: [],
  groupErr: '',
};

const rootReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.SET_USER_DATA:
      return { ...state, ...action.payload };
    case actionTypes.ADD_USER:
      return { ...state, users: [...state.users, action.payload] };
    case actionTypes.LIKE_MESSAGE:
      // Handle updating state for liking a message (you need to implement this based on your message structure)
      return state;
    case actionTypes.SET_GROUP_ERROR:
      return { ...state, groupErr: action.payload };
    // Add other cases as needed
    default:
      return state;
  }
};

export default rootReducer;
