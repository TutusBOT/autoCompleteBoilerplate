import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { getUsers } from "../redux/users";
import AutoComplete from "./AutoComplete";
import styles from "../css/input.module.css";

function Input() {
	const [inputValue, setInputValue] = useState("");
	const [autoComplete, setAutoComplete] = useState([]);
	const [autoCompleteHighlight, setAutoCompleteHighlight] = useState({
		index: 0,
		selected: false,
	});
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
				setInputValue(autoComplete[autoCompleteHighlight.index].name);
				setAutoCompleteHighlight({ index: 0, selected: false });
				setAutoCompleteSelected("");
				break;
			}
			case "up": {
				if (autoCompleteHighlight.index === 0) {
					setAutoCompleteHighlight({
						index: autoComplete.length - 1,
						selected: true,
					});
					break;
				}
				setAutoCompleteHighlight(({ index }) => {
					return { index: index - 1, selected: true };
				});
				break;
			}
			case "down": {
				if (autoCompleteHighlight.index === autoComplete.length - 1) {
					setAutoCompleteHighlight({ index: 0, selected: true });
					break;
				}
				setAutoCompleteHighlight(({ index }) => {
					return { index: index + 1, selected: true };
				});
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
				if (autoCompleteHighlight.selected === false) return;
				return defineHighlight("reset");
			}
			default:
				return;
		}
	};

	useEffect(() => {
		if (autoComplete.length && autoCompleteHighlight.selected) {
			setAutoCompleteSelected(autoComplete[autoCompleteHighlight.index].name);
		}
	}, [autoCompleteHighlight]);

	return (
		<form
			className={styles.form}
			onSubmit={(e) => e.preventDefault()}
			autoComplete="off"
			onBlur={() => {
				setTimeout(() => setHide(true), 100);
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
