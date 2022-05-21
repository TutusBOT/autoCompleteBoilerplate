import React from "react";

function AutoComplete({ name, setInputValue, nameToHighlight }) {
	return (
		<li
			onClick={() => {
				setInputValue(name);
			}}
			className={`autocomplete ${
				name === nameToHighlight ? "autocomplete-active" : ""
			}`}
		>
			{name}
		</li>
	);
}

export default AutoComplete;
