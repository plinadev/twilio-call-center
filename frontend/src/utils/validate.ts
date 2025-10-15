export const isValidPhone = (value: string) => {
  const digits = value.replace(/[^0-9]/g, "");
  return digits.length >= 8 && digits.length <= 15;
};

export const isValidName = (value: string) =>
  /^[a-zA-Zа-яА-ЯїЇєЄёЁіІ\s'-]{2,30}$/.test(value.trim());
export const isValidCode = (value: string) => /^[0-9]{4,8}$/.test(value);
