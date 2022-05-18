import Axios from "axios";

export const initialState = {
	data: {},
	error: null,
};

export default function users(state = initialState, action) {
	switch (action.type) {
		case "GET_USERS":
			return state;
		case "GET_USERS_SUCCESS":
			return {
				data: action.users.data,
				error: null,
			};
		case "GET_USERS_FAILURE":
			return {
				data: {},
				error: action.error,
			};
		default:
			return state;
	}
}

export const getUsers = () => {
	return (dispatch) => {
		dispatch({ type: "GET_USERS" });
		return Axios.get("https://jsonplaceholder.typicode.com/users").then(
			(users) => dispatch({ type: "GET_USERS_SUCCESS", users }),
			(error) => dispatch({ type: "GET_USERS_FAILURE", error })
		);
	};
};
