import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import store from "../redux/store";
import { getUsers, initialState } from "../redux/users";

function Input() {
	// const [users, setUsers] = useState(initialState);
	const [inputValue, setInputValue] = useState("");
	const [autoComplete, setAutoComplete] = useState([]);
	const users = useSelector((state) => state.users);

	useEffect(() => {
		store.dispatch(getUsers());
	}, []);

	useEffect(() => {
		if (users.error) console.log(users.error);
		if (!users.data || !inputValue) return setAutoComplete([]);
		setAutoComplete(
			users.data.filter(({ name }) => {
				return (
					name.toLowerCase().includes(inputValue.toLowerCase()) &&
					name !== inputValue
				);
			})
		);
	}, [inputValue]);

	return (
		<form onSubmit={(e) => e.preventDefault()} autoComplete="off">
			<div>
				<input
					value={inputValue}
					onChange={(e) => setInputValue(e.target.value)}
					type="text"
					placeholder="User"
				/>
			</div>
			<ul>
				{autoComplete
					? autoComplete.map(({ name }) => {
							return (
								<li
									onClick={() => {
										setInputValue(name);
									}}
									key={name}
								>
									{name}
								</li>
							);
					  })
					: ""}
			</ul>
			<input type="submit" value={"Submit"} />
		</form>
	);
}

export default Input;
