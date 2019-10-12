export const saveSettingForString = (key: string, value: string) => {
	window.localStorage.setItem(key, value);
};

export const saveSettingForObject = (key: string, value: any) => {
    window.localStorage.setItem(key, JSON.stringify(value));
};

export const loadSettingAsString = (key: string, defaultValue: string) => {
	const value = window.localStorage.getItem(key);
	return value !== null ? value : defaultValue;
};

export const loadSettingAsInteger = (key: string, defaultValue: number) => {
	const value = window.localStorage.getItem(key);
	return value !== null ? parseInt(value) : defaultValue;
};

export const loadSettingAsObject = (key: string, defaultValue: any) => {
	const value = window.localStorage.getItem(key);
	return value !== null ? JSON.parse(value) : defaultValue;
}
