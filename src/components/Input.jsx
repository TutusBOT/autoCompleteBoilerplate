import React, { useEffect, useState } from "react";
import store from "../redux/store";
import { getUsers, initialState } from "../redux/users";

function Input() {
	const [users, setUsers] = useState(initialState);
	const [inputValue, setInputValue] = useState("");
	const [autoComplete, setAutoComplete] = useState([]);

	useEffect(() => {
		store.dispatch(getUsers());
		store.subscribe(() => {
			setUsers(store.getState().users);
		});
	}, []);

	useEffect(() => {
		if (users !== initialState) {
			if (!inputValue) return setAutoComplete([]);
			setAutoComplete(
				users.data.filter(({ name }) => {
					if (name === inputValue) return;
					return name.toLowerCase().includes(inputValue.toLowerCase());
				})
			);
		}
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
