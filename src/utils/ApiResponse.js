class ApiResponse {
    constructor(
        statusCode, data, message = "Success"
    ) {
        this.statusCode = statusCode
        this.apiMessage = message
        this.data = data
        this.success = statusCode < 400
    }
}

export { ApiResponse }