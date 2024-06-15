import { useState } from "react";

export function useControl<T>(
	defaultValue: T,
	elements: (value: T, onChange: (value: T) => void) => React.ReactElement,
	onChange?: (newValue: T, previousValue: T, setValue: (value: T) => void) => void,
): [[T, (value: T) => void], React.ReactElement] {
	const [value, setValue] = useState(defaultValue);
	const change = (newValue: T) => {
		onChange?.(newValue, value, setValue);
		setValue(newValue);
	};

	const element: React.ReactElement = <>{elements(value, change)}</>;

	return [[value, setValue], element];
}
