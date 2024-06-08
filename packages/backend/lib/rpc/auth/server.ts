import express, {
  Request,
  Response,
  NextFunction,
  CookieOptions,
} from "express";
import parseFormData from "../form/server";
import Jwt from "../../jwt";

const AuthTokenCookie = "auth_token";

const UserAgape = "__user_agape__";

export const pattern = {
  login: "/service/auth/login",
  isAuthenticated: "/service/auth/isAuthenticated",
  logout: "/service/auth/logout",
};

export default function defineAuth(secret: string) {
  const router = express.Router();
  const jwt = new Jwt(secret);

  const cookieOptions: CookieOptions = {
    httpOnly: true,
    maxAge: jwt.maxAge,
    priority: "high",
    sameSite: true,
    secure: true,
  };

  router.post(pattern.login, async (req, res) => {
    const [{ username, password }] = (await parseFormData(req)) as [{ username: string, password: string }];

    const isAdmin = username === "admin";
    const isPassword = password === "admin";

    if (!isAdmin || !isPassword) {
      res.status(401).send("Acceso denegado");
      return;
    }

    // Aquí deberías validar las credenciales del usuario
    const user = { id: 1, username }; // Ejemplo de usuario

    const token = await jwt.generateToken({ id: user.id });

    res.cookie(AuthTokenCookie, token, cookieOptions); // Establecer la cookie
    res.status(200).json(success({ message: "Login exitoso" }));
  });

  router.post(pattern.isAuthenticated, async (req, res) => {
    const refreshToken = getCookie(req.headers.cookie);

    if (!refreshToken) {
      res.status(401).json(false);
      return;
    }

    try {
      const payload = await jwt.verifyToken(refreshToken);

      delete payload.exp;
      delete payload.iat;

      const token = await jwt.generateToken(payload);

      res.cookie(AuthTokenCookie, token, cookieOptions); // Establecer la cookie

      res.json(success(true));
    } catch (error) {
      res.clearCookie(AuthTokenCookie);

      res.status(401).json(false);
    }
  });

  router.post(pattern.logout, async (req, res) => {
    res.clearCookie(AuthTokenCookie);
    res.status(200).json(success({ message: "Sesión terminada" }));
  });

  const authenticate = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    const token = getCookie(req.headers.cookie);

    if (!token) {
      res.status(401).send("Acceso denegado");
      return;
    }

    try {
      const verified = await jwt.verifyToken(token);
      setUserRequest(req, verified);

      next();
    } catch (error) {
      res.status(401).send("Acceso denegado");
    }
  };

  return { router, authenticate };
}

function setUserRequest(req: Request, payload: unknown) {
  Object.defineProperty(req, UserAgape, {
    value: payload,
    writable: false,
    configurable: false,
    enumerable: false,
  });
}

export function getUserRequest(req: Request) {
  if (UserAgape in req) {
    return req[UserAgape];
  }
}

export function getCookie(header?: string) {
  if (!header) {
    return;
  }

  const [, token] = header.match(/auth_token=([^;]+)/) ?? [];

  return token;
}


function success(payload: unknown) {
  return [payload, []]
}