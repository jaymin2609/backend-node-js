class ApiError extends Error {
    constructor(
        statusCode,
        message = "Something went wrong!",
        errors = [],
        stack = ""
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.apiMessage = message
        this.success = false
        this.errors = errors

        // if (stack) {
        //     this.stack = stack
        // } else {
        //     console.log("ApiError stack else");
        //     Error.captureStackTrace(this, this.constructor)
        // }


    }
}

export { ApiError }