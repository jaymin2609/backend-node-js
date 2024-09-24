import { BaseValidReturn } from "../models/base_valid_return.js"
const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

export { isEmailValid }