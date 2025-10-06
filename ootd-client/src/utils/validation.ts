const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/;
const KOREAN_REGEX = /^[가-힣]+$/;

export const validateEmail = (email: string) => EMAIL_REGEX.test(email);
export const validatePassword = (password: string) => PASSWORD_REGEX.test(password);
export const validateKorean = (str: string) => KOREAN_REGEX.test(str);
