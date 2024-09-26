import { BaseValidReturn } from "../base_valid_return.js"
import { isEmailValid } from "../../utils/app_utils.js"

class ReqUser {
    constructor(username, email, fullName, password,
        currentPassword, newPassword
    ) {
        this.email = email;
        this.fullName = fullName;
        this.password = password;
        this.username = username;
        this.currentPassword = currentPassword;
        this.newPassword = newPassword
    }

    isValidForRegister() {
        if (
            [this.username, this.email, this.fullName, this.password].some((field) => field?.trim() === ""
            )) {
            return new BaseValidReturn(false, "All fields are required")
        }
        if (!isEmailValid(this.email)) {
            return new BaseValidReturn(false, "Email is not valid")
        }

        if (!this.fullName.trim().includes(" ")) {
            return new BaseValidReturn(false, "Fullname is not valid")
        }

        return new BaseValidReturn(true, "")

    }

    isValidForLogin() {
        if (!this.username && !this.email) {
            return new BaseValidReturn(false, "Username or password required")
        }

        return new BaseValidReturn(true, "")

    }

    isValidForChangePassword() {
        if (!this.currentPassword || !this.newPassword) {
            return new BaseValidReturn(false, "All fields are required")
        }

        return new BaseValidReturn(true, "")
    }

    isValidForUpdateDetails() {
        if (!this.fullName) {
            return new BaseValidReturn(false, "All fields are required")
        }

        if (!this.fullName.trim().includes(" ")) {
            return new BaseValidReturn(false, "Fullname is not valid")
        }

        return new BaseValidReturn(true, "")
    }

}

export { ReqUser }