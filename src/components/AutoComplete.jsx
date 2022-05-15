import React from "react";

function AutoComplete({ name }, setInputValue) {
	return (
		<li
			onClick={() => {
				setInputValue(name);
			}}
			className="autocomplete"
		>
			{name}
		</li>
	);
}

export default AutoComplete;
