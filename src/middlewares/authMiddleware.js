import { StatusCodes } from "http-status-codes";
import { env } from "~/config/environment";
import { JwtProvider } from "~/providers/JwtProvider";
import ApiError from "~/utils/ApiError";

const isAuthorized = async (req, res, next) => {
  const clientAccessToken = req.cookies?.accessToken;

  if (!clientAccessToken) {
    next(
      new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized: token not found!")
    );
    return;
  }
  try {
    const accessTokenDecoded = await JwtProvider.verifyToken(
      clientAccessToken,
      env.ACCESS_TOKEN_SECRET_SIGNATURE
    );

    req.jwtDecoded = accessTokenDecoded;

    next();
  } catch (error) {
    // if accessToken expired, send 410 code error (GONE - 410) to FE!
    if (error?.message?.includes("jwt expired")) {
      next(new ApiError(StatusCodes.GONE, "Need to refresh token!"));
      return;
    }

    next(new ApiError(StatusCodes.UNAUTHORIZED, "Unauthorized!"));
    return;
  }
};

export const authMiddleware = {
  isAuthorized,
};
