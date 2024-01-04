import * as actionTypes from './actionTypes';

// Action creators
export const setUserData = (data) => ({
  type: actionTypes.SET_USER_DATA,
  payload: data,
});

export const addUser = (user) => ({
  type: actionTypes.ADD_USER,
  payload: user,
});

export const likeMessage = (messageId) => ({
  type: actionTypes.LIKE_MESSAGE,
  payload: messageId,
});

export const setGroupError = (error) => ({
  type: actionTypes.SET_GROUP_ERROR,
  payload: error,
});
// Add other action creators as needed

// Asynchronous action creator (thunk)
export const fetchInitialData = () => async (dispatch) => {
  try {
    // Fetch isAdmin, users, and groups data from the backend
    const isAdminResult = await fetchIsAdmin();
    dispatch(setUserData({ isAdmin: isAdminResult }));

    const usersResult = await fetchUsers();
    dispatch(setUserData({ users: usersResult }));

    const groupsResult = await fetchGroups();
    dispatch(setUserData({ groups: groupsResult }));
  } catch (error) {
    console.error('Error fetching initial data:', error);
  }
};

// Replace the following placeholder functions with your actual backend API calls
const fetchIsAdmin = async () => {
  // Backend API call for isAdmin
};

const fetchUsers = async () => {
  // Backend API call for users
};

const fetchGroups = async () => {
  // Backend API call for groups
};
