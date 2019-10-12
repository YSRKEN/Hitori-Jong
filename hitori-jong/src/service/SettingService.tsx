export const saveSetting = (key: string, value: string) => {
	window.localStorage.setItem(key, value);
};

export const loadSettingAsString = (key: string, defaultValue: string) => {
	const value = window.localStorage.getItem(key);
	return value !== null ? value : defaultValue;
};

export const loadSettingAsInteger = (key: string, defaultValue: number) => {
	const value = window.localStorage.getItem(key);
	return value !== null ? parseInt(value) : defaultValue;
};
