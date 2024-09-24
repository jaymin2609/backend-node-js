import { BaseValidReturn } from "../base_valid_return.js"
import { isEmailValid } from "../../utils/app_utils.js"

class ReqUser {
    constructor(username, email, fullName, password) {
        this.email = email;
        this.fullName = fullName;
        this.password = password;
        this.username = username;
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

}

export { ReqUser }