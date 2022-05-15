import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import store from "../redux/store";
import { getUsers } from "../redux/users";

function Input() {
	// const [users, setUsers] = useState(initialState);
	const [inputValue, setInputValue] = useState("");
	const [autoComplete, setAutoComplete] = useState([]);
	const [autoCompleteHighlight, setAutoCompleteHighlight] = useState(-1);
	const users = useSelector((state) => state.users);

	const autoCompleteList = useRef();

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

	const handleKeyboard = useCallback(
		(e) => {
			if (!users.data || !inputValue) return;
			if (e.key === "ArrowDown") {
				if (autoCompleteHighlight === autoComplete.length - 1) {
					return setAutoCompleteHighlight(0);
				}
				return setAutoCompleteHighlight((prev) => prev + 1);

				// return onArrowDown();
			}
			if (e.key === "ArrowUp") {
				if (autoCompleteHighlight === 0 || autoCompleteHighlight === -1) {
					return setAutoCompleteHighlight(autoComplete.length - 1);
				}
				return setAutoCompleteHighlight((prev) => prev - 1);

				// return onArrowup();
			}
			if (e.key === "Enter") {
				if (autoCompleteHighlight !== -1) {
					setInputValue(
						autoCompleteList.current.children[autoCompleteHighlight].innerText
					);
					setAutoCompleteHighlight(-1);
				}
			}
		},
		[autoComplete, autoCompleteHighlight]
	);
	useEffect(() => {
		document.addEventListener("keydown", handleKeyboard);
		return () => {
			document.removeEventListener("keydown", handleKeyboard);
		};
	}, [handleKeyboard]);

	useEffect(() => {
		if (!autoCompleteList.current.children.length) return;
		console.log(autoCompleteHighlight, autoComplete.length);
		console.log(autoCompleteList.current.children);

		for (const li of autoCompleteList.current.children) {
			li.classList.remove("autocomplete-active");
		}

		autoCompleteList.current.children[autoCompleteHighlight].classList.add(
			"autocomplete-active"
		);
	}, [autoCompleteHighlight]);

	return (
		<form
			className="form"
			onSubmit={(e) => e.preventDefault()}
			autoComplete="off"
		>
			<input
				className="input"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				type="text"
				placeholder="User"
			/>

			<ul className="autocomplete" ref={autoCompleteList}>
				{autoComplete
					? autoComplete.map(({ name }) => {
							return (
								<li
									className={"autocomplete"}
									onClick={() => {
										setInputValue(name);
										setAutoCompleteHighlight(-1);
									}}
									key={name}
								>
									{name}
								</li>
								// <AutoComplete
								// 	name={name}
								// 	setInputValue={setInputValue}
								// 	key={name}
								// />
							);
					  })
					: ""}
			</ul>
		</form>
	);
}

export default Input;
