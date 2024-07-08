import express, {
  Request,
  Response,
  NextFunction,
  CookieOptions,
} from "express";
import parseFormData from "../form/server";
import Jwt from "../../jwt";
import webSession, { initSession } from "../../session";
import { Unauthorized } from "../call/error/app";

const AuthTokenCookie = "auth_token";

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
    const [{ username, password }] = (await parseFormData(req)) as Access;

    const isAdmin = username === "admin";
    const isPassword = password === "admin";

    if (!isAdmin || !isPassword) {
      throw new Unauthorized("Acceso denegado");
    }

    // Aquí deberías validar las credenciales del usuario
    const user = { id: 1, username }; // Ejemplo de usuario

    const token = await jwt.generateToken({ id: user.id });

    res.cookie(AuthTokenCookie, token, cookieOptions); // Establecer la cookie
    res.status(200).json(success(user));
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

      res.json(success(payload));
    } catch (error) {
      res.clearCookie(AuthTokenCookie);

      res.status(401).json(null);
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
      const verified: any = await jwt.verifyToken(token);
      initSession(verified, next);
      
    } catch (error) {
      res.status(401).send("Acceso denegado");
    }
  };

  return { router, authenticate };
}

export function getCookie(header?: string) {
  if (!header) {
    return;
  }

  const [, token] = header.match(/auth_token=([^;]+)/) ?? [];

  return token;
}

function success(payload: unknown) {
  return [payload, []];
}

export const user = webSession;

/**
 * Types
 */
type Access = [{ username: string; password: string }];
