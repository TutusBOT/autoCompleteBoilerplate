import React from "react";
import styles from "../css/autocomplete.module.css";

function AutoComplete({ name, setInputValue, isHighlighted }) {
	return (
		<li
			onClick={() => {
				setInputValue(name);
			}}
			className={`${styles.option} ${isHighlighted ? styles.optionActive : ""}`}
		>
			{name}
		</li>
	);
}

export default AutoComplete;
