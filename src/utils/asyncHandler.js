import { ApiError } from "../utils/ApiError.js";

const asyncHandler = (reqHandler) => {
    return (req, res, next) => {
        Promise
            .resolve(reqHandler(req, res, next))
            .catch((err) => {
                if (err instanceof ApiError) {
                    console.log("asyncHandler ERROR : ", err instanceof ApiError);
                    console.log("asyncHandler ERROR : ", err);
                    res.status(err.statusCode).json(new ApiError(err.statusCode,
                        err.message, err.errors, err.stack))
                } else {
                    next(err)
                }
            })
    }
}


export { asyncHandler }

// const asyncHandler = () => {}
// const asyncHandler = (func) => () => {}
// const asyncHandler = (func) => async () => {}

// const asyncHandler = (fn) => async (req, res, next) => {
//     try {
//         await fn(req, res, next)

//     } catch (error) {
//         res.status(error.code || 500).json(
//             {
//                 sucess: false,
//                 message: error.message
//             }
//         )

//     }
// }

