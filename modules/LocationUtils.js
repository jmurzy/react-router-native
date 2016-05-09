export const DEFAULT_KEY_LENGTH = 8;
export const createRandomKey = (len: number): string => Math.random().toString(36).substr(2, len);
