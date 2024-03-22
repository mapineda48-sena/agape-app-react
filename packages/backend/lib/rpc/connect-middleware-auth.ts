import { Router, Request, Response, NextFunction } from "express";
import { parseFormData } from "./connect-middleware";
import * as jwt from "jsonwebtoken";
import { AuthModuluName } from "./connect-config";

const JWT_SECRET = "tu_secreto"; // Mantén esto seguro y fuera del código en producción
const AuthTokenCookie = "auth_token"
const UserAgape = "__user_agape__";

const pattern = {
  login: "/service/auth/login",
  isAuth: "/service/auth/isAuth",
};

export default function defineAuth(router: Router, rpc: any) {
  router.post(pattern.login, login);
  router.post(pattern.isAuth);

  rpc[AuthModuluName] = pattern;
}

export async function login(req: Request, res: Response, next: NextFunction) {
  const [username, password] = (await parseFormData(req)) as [string, string];

  // Aquí deberías validar las credenciales del usuario
  const user = { id: 1, username }; // Ejemplo de usuario

  const token = await generateToken({ id: user.id });

  res.cookie(AuthTokenCookie, token, { httpOnly: true }); // Establecer la cookie
  res.status(200).json({ message: "Login exitoso" });
}

export async function isAuth(req: Request, res: Response, next: NextFunction) {
  const refreshToken = req.cookies[AuthTokenCookie];

  if (!refreshToken) {
    return false;
  }

  try {
    const payload = await verifyToken(refreshToken);
    const token = await generateToken(payload);

    res.cookie(AuthTokenCookie, token, { httpOnly: true }); // Establecer la cookie

    res.json(true);
  } catch (error) {
    res.json(false);
  }
}

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies[AuthTokenCookie];
  if (!token) {
    return res.status(401).send("Acceso denegado");
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    setUserRequest(req, verified);

    next();
  } catch (error) {
    res.status(401).send("Acceso denegado");
  }
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

function generateToken(userData: any) {
  return new Promise<string>((res, rej) => {
    jwt.sign(userData, JWT_SECRET, { expiresIn: "1h" }, (error, token) => {
      if (error) return rej(error);

      if (token) return res(token);

      throw new Error("unknown error");
    });
  });
}

function verifyToken(token: string) {
  return new Promise<string | jwt.JwtPayload>((res, rej) => {
    jwt.verify(token, JWT_SECRET, (error, payload) => {
      if (error) return rej(error);

      if (payload) return res(payload);

      throw new Error("unknown error");
    });
  });
}
