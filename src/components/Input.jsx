import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../redux/users";
import AutoComplete from "./AutoComplete";
import styles from "../css/input.module.css";

function Input() {
	const [inputValue, setInputValue] = useState("");
	const [autoComplete, setAutoComplete] = useState([]);
	const [autoCompleteHighlight, setAutoCompleteHighlight] = useState(-1);
	const [autoCompleteSelected, setAutoCompleteSelected] = useState("");
	const [hide, setHide] = useState(false);
	const users = useSelector((state) => state.users);
	const dispatch = useDispatch();

	useEffect(() => {
		dispatch(getUsers());
	}, []);

	useEffect(() => {
		if (users.error) console.log(users.error);
		if (!users.data.length || !inputValue) return setAutoComplete([]);
		setHide(false);
		setAutoComplete(
			users.data.filter(({ name }) => {
				return (
					name.toLowerCase().startsWith(inputValue.toLowerCase()) &&
					name !== inputValue
				);
			})
		);
	}, [inputValue]);

	const defineHighlight = (action) => {
		switch (action) {
			case "reset": {
				setInputValue(autoComplete[autoCompleteHighlight].name);
				setAutoCompleteHighlight(-1);
				setAutoCompleteSelected("");
				break;
			}
			case "up": {
				if (autoCompleteHighlight < 1) {
					setAutoCompleteHighlight(autoComplete.length - 1);
					break;
				}
				setAutoCompleteHighlight((prev) => prev - 1);
				break;
			}
			case "down": {
				if (autoCompleteHighlight === autoComplete.length - 1) {
					setAutoCompleteHighlight(0);
					break;
				}
				setAutoCompleteHighlight((prev) => prev + 1);
				break;
			}
			default: {
				break;
			}
		}
	};

	const handleKeyboard = (e) => {
		if (!autoComplete.length || !inputValue) return;
		switch (e.key) {
			case "ArrowDown":
				return defineHighlight("down");
			case "ArrowUp":
				return defineHighlight("up");
			case "Enter": {
				if (autoCompleteHighlight === -1) return;
				return defineHighlight("reset");
			}
			default:
				return;
		}
		// if (e.key === "ArrowDown") {
		// 	if (autoCompleteHighlight === autoComplete.length - 1) {
		// 		return setAutoCompleteHighlight(0);
		// 	}
		// 	return setAutoCompleteHighlight((prev) => prev + 1);
		// }
		// if (e.key === "ArrowUp") {
		// 	if (autoCompleteHighlight === 0 || autoCompleteHighlight === -1) {
		// 		return setAutoCompleteHighlight(autoComplete.length - 1);
		// 	}
		// 	return setAutoCompleteHighlight((prev) => prev - 1);
		// }
		// if (e.key === "Enter") {
		// 	if (autoCompleteHighlight !== -1) {
		// 		setInputValue(autoComplete[autoCompleteHighlight].name);
		// 		setAutoCompleteSelected("");
		// 		return setAutoCompleteHighlight(-1);
		// 	}
		// }
	};

	useEffect(() => {
		if (autoComplete.length && autoCompleteHighlight !== -1) {
			setAutoCompleteSelected(autoComplete[autoCompleteHighlight].name);
		}
	}, [autoCompleteHighlight]);

	return (
		<form
			className={styles.form}
			onSubmit={(e) => e.preventDefault()}
			autoComplete="off"
			onBlur={(e) => {
				console.log(e.target, e.currentTarget);
				if (!e.currentTarget.contains(e.relatedTarget)) {
					// setTimeout(() => setHide(true), 1000);
					setHide(true);
				}
			}}
		>
			<input
				className={styles.input}
				value={inputValue}
				onChange={(e) => setInputValue(e.target.value)}
				onKeyDown={handleKeyboard}
				type="text"
				placeholder="Username"
			/>

			<ul className={`${styles.autocomplete} ${hide ? styles.hide : ""}`}>
				{autoComplete &&
					autoComplete.map(({ name }) => {
						return (
							<AutoComplete
								name={name}
								setInputValue={setInputValue}
								isHighlighted={autoCompleteSelected === name ? true : false}
								key={name}
							/>
						);
					})}
			</ul>
		</form>
	);
}

export default Input;
