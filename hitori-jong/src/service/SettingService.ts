export const saveSettingForString = (key: string, value: string) => {
  window.localStorage.setItem(key, value);
};

export const saveSettingForObject = <T>(key: string, value: T) => {
  window.localStorage.setItem(key, JSON.stringify(value));
};

export const loadSettingAsString = (key: string, defaultValue: string) => {
  const value = window.localStorage.getItem(key);

  return value !== null ? value : defaultValue;
};

export const loadSettingAsInteger = (key: string, defaultValue: number) => {
  const value = window.localStorage.getItem(key);

  return value !== null ? parseInt(value, 10) : defaultValue;
};

export const loadSettingAsObject = <T>(key: string, defaultValue: T): T => {
  const value = window.localStorage.getItem(key);

  return value !== null ? JSON.parse(value) : defaultValue;
};
