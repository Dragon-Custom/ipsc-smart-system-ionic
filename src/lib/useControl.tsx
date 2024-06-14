import { useState } from "react";

export function useControl<T>(defaultValue: T, elements: (value: T, onChange: (value: T) => void) => React.ReactElement) {
	const [value, setValue] = useState(defaultValue);
	const onChange = (newValue: T) => {
		setValue(newValue);
	}
	
	const element: React.ReactElement = <>{elements(value, onChange)}</>;

	return [
		value,
		element
	]
};