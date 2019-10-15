// 長さlengthの、中身が全部valueな配列を生成する
export const createFilledArray = <T>(length: number, value: T) => {
  const temp = Array<T>(length);
  temp.fill(value);

  return temp;
};
