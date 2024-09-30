import { BaseValidReturn } from "../models/base_valid_return.js"
const isEmailValid = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function convertToMMSS(seconds) {
    try {
        // Convert total seconds to an integer to ignore milliseconds
        const totalSeconds = Math.floor(seconds);

        // Calculate minutes and seconds
        const minutes = Math.floor(totalSeconds / 60);
        const remainingSeconds = totalSeconds % 60;

        // Pad minutes and seconds with leading zeros if necessary
        const formattedMinutes = String(minutes).padStart(2, '0');
        const formattedSeconds = String(remainingSeconds).padStart(2, '0');

        return `${formattedMinutes}:${formattedSeconds}`;
    } catch (error) {
        return "00:00"
    }
}

export { isEmailValid, convertToMMSS }