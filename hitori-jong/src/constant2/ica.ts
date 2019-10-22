import { IDOL_LIST_COUNT } from 'constant/idol';
import { createFilledArray } from 'service/UtilityService';

// 各アイドルが何枚づつ存在するかを表す
// (長さ＝IDOL_LIST_COUNT)
export type IdolCountArray = number[];

// ICA型の値でA - Bを計算する
export const minusICA = (
  a: IdolCountArray,
  b: IdolCountArray,
): IdolCountArray => {
  const result = Array<number>(IDOL_LIST_COUNT);
  for (let i = 0; i < IDOL_LIST_COUNT; i += 1) {
    result[i] = a[i] - b[i];
  }

  return result;
};

// ICA型の値でA // Bを計算する
export const divideICA = (a: IdolCountArray, b: IdolCountArray): number => {
  let output = 3;
  for (let i = 0; i < IDOL_LIST_COUNT; i += 1) {
    if (b[i] > 0) {
      if (a[i] === 0) {
        return 0;
      }
      output = Math.min(output, Math.floor(a[i] / b[i]));
    }
  }

  return output;
};

// ICA型の値でA * x + Bを計算する
export const fmaICA = (
  a: IdolCountArray,
  x: number,
  b: IdolCountArray,
): IdolCountArray => {
  const result = Array<number>(IDOL_LIST_COUNT);
  for (let i = 0; i < IDOL_LIST_COUNT; i += 1) {
    result[i] = a[i] * x + b[i];
  }

  return result;
};

// ICA型の値について、そのタイルの枚数を計算する
export const countICA = (a: IdolCountArray): number => {
  let sum = 0;
  for (let i = 0; i < IDOL_LIST_COUNT; i += 1) {
    sum += a[i];
  }

  return sum;
};

// a>=bならtrue
export const hasICA = (a: IdolCountArray, b: IdolCountArray): boolean => {
  for (let i = 0; i < IDOL_LIST_COUNT; i += 1) {
    if (a[i] < b[i]) {
      return false;
    }
  }

  return true;
};

// 全ての要素の値が0か？
export const isZero = (a: IdolCountArray) => {
  for (let i = 0; i < IDOL_LIST_COUNT; i += 1) {
    if (a[i] > 0) {
      return false;
    }
  }

  return true;
};

// アイドルIDの配列を、各アイドルの枚数の配列(ICA)に変換する。
// 前者をA、後者をBとした場合、アイドルID=iがA内にj件あると、B[i] = j
export const memberListToICA = (memberList: number[]): IdolCountArray => {
  const idolCountArray = createFilledArray(IDOL_LIST_COUNT, 0);
  for (const member of memberList) {
    idolCountArray[member] += 1;
  }

  return idolCountArray;
};

// ICAをハッシュ化する
export const toHashICA = (a: IdolCountArray): number => {
  let x = 0;
  for (let i = 0; i < IDOL_LIST_COUNT; i += 1) {
    x = (x * 137 + a[i]) % 4294967296;
  }

  return x;
};
