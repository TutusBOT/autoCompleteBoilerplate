import React, { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import store from "../redux/store";
import { getUsers } from "../redux/users";
import AutoComplete from "./AutoComplete";

function Input() {
	const [inputValue, setInputValue] = useState("");
	const [autoComplete, setAutoComplete] = useState([]);
	const [autoCompleteHighlight, setAutoCompleteHighlight] = useState(-1);
	const [autoCompleteSelected, setAutoCompleteSelected] = useState("");
	const [hide, setHide] = useState(false);
	const users = useSelector((state) => state.users);
	const autoCompleteList = useRef();

	useEffect(() => {
		store.dispatch(getUsers());
	}, []);

	useEffect(() => {
		if (users.error) console.log(users.error);
		if (!users.data || !inputValue) return setAutoComplete([]);
		setHide(false);
		const matchingInput = new RegExp(`^${inputValue}`, "i");
		setAutoComplete(
			users.data.filter(({ name }) => {
				return matchingInput.test(name) && name !== inputValue;
			})
		);
	}, [inputValue]);

	const handleKeyboard = (e) => {
		if (!autoComplete.length || !inputValue) return;
		if (e.key === "ArrowDown") {
			if (autoCompleteHighlight === autoComplete.length - 1) {
				return setAutoCompleteHighlight(0);
			}
			return setAutoCompleteHighlight((prev) => prev + 1);
		}
		if (e.key === "ArrowUp") {
			if (autoCompleteHighlight === 0 || autoCompleteHighlight === -1) {
				return setAutoCompleteHighlight(autoComplete.length - 1);
			}
			return setAutoCompleteHighlight((prev) => prev - 1);
		}
		if (e.key === "Enter") {
			if (autoCompleteHighlight !== -1) {
				setInputValue(autoComplete[autoCompleteHighlight].name);
				setAutoCompleteSelected("");
				return setAutoCompleteHighlight(-1);
			}
		}
	};

	const handleClickOutside = (e) => {
		console.log(autoCompleteList, e.target);
		console.log(!autoCompleteList.current.contains(e.target));
		if (
			autoCompleteList.current &&
			!autoCompleteList.current.contains(e.target)
		) {
			setHide(true);
		}
	};

	useEffect(() => {
		if (autoComplete.length) {
			setAutoCompleteSelected(autoComplete[autoCompleteHighlight].name);
		}
	}, [autoCompleteHighlight]);

	useEffect(() => {
		document.addEventListener("keydown", handleKeyboard);
		document.addEventListener("click", handleClickOutside, true);
		return () => {
			document.removeEventListener("keydown", handleKeyboard);
			document.removeEventListener("click", handleClickOutside, true);
		};
	}, [handleKeyboard]);

	return (
		<form
			className={"form"}
			onSubmit={(e) => e.preventDefault()}
			autoComplete="off"
			ref={autoCompleteList}
		>
			<input
				className="input"
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				type="text"
				placeholder="User"
			/>

			<ul className={"autocomplete " + (hide ? "hide" : "")}>
				{autoComplete
					? autoComplete.map(({ name }) => {
							return (
								<AutoComplete
									name={name}
									setInputValue={setInputValue}
									nameToHighlight={autoCompleteSelected}
									key={name}
								/>
							);
					  })
					: null}
			</ul>
		</form>
	);
}

export default Input;
