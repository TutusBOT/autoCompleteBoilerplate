import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../redux/users";
import AutoComplete from "./AutoComplete";
import styles from "../css/input.module.css";
import useDetectOutsideClick from "../hooks/DetectOutsideClick";

function Input() {
	const [inputValue, setInputValue] = useState("");
	const [autoComplete, setAutoComplete] = useState([]);
	const [autoCompleteSelected, setAutoCompleteSelected] = useState({
		index: 0,
		selected: false,
	});
	const [hide, setHide] = useState(false);
	const users = useSelector((state) => state.users);
	const dispatch = useDispatch();
	const autoCompleteRef = useRef();

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

	const defineSelected = (action) => {
		switch (action) {
			case "reset": {
				setInputValue(autoComplete[autoCompleteSelected.index].name);
				return setAutoCompleteSelected({ index: 0, selected: false });
			}
			case "up": {
				return setAutoCompleteSelected(({ index }) => ({
					index:
						autoCompleteSelected.index === 0
							? autoComplete.length - 1
							: index - 1,
					selected: true,
				}));
			}
			case "down": {
				return setAutoCompleteSelected(({ index }) => ({
					index:
						autoCompleteSelected.index === autoComplete.length - 1 ||
						!autoCompleteSelected.selected
							? 0
							: index + 1,
					selected: true,
				}));
			}
			default: {
				return;
			}
		}
	};

	const handleKeyboard = (e) => {
		if (!autoComplete.length || !inputValue) return;
		switch (e.key) {
			case "ArrowDown":
				return defineSelected("down");
			case "ArrowUp":
				return defineSelected("up");
			case "Enter": {
				if (autoCompleteSelected.selected === false) return;
				return defineSelected("reset");
			}
			default:
				return;
		}
	};

	useDetectOutsideClick(autoCompleteRef, () => {
		setHide(true);
	});

	return (
		<form
			className={styles.form}
			onSubmit={(e) => e.preventDefault()}
			autoComplete="off"
			ref={autoCompleteRef}
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
								isHighlighted={
									autoCompleteSelected.selected &&
									autoComplete[autoCompleteSelected.index].name === name
										? true
										: false
								}
								key={name}
							/>
						);
					})}
			</ul>
		</form>
	);
}

export default Input;
