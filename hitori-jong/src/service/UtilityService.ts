// 長さlengthの、中身が全部valueな配列を生成する
export const createFilledArray = <T>(length: number, value: T) => {
  const temp = Array<T>(length);
  temp.fill(value);

  return temp;
};

// 長さlengthの、中身が[0, 1, ..., length-1]な配列を生成する
export const range = (length: number) => {
  const temp = Array<number>(length);
  for (let i = 0; i < length; i += 1) {
    temp[i] = i;
  }

  return temp;
};
