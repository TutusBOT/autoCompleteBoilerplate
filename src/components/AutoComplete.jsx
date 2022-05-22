import React from "react";
import styles from "../css/autocomplete.module.css";

function AutoComplete({ name, setInputValue, isHighlighted }) {
	return (
		<li
			onClick={() => {
				setInputValue(name);
			}}
			className={`${styles.autocomplete__option} ${
				isHighlighted ? styles["autocomplete__option--active"] : ""
			}`}
		>
			{name}
		</li>
	);
}

export default AutoComplete;
