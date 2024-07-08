import { createNamespace } from "cls-hooked";
import { NextFunction } from "express";

export const session = createNamespace(__filename);

export function initSession(user: IWebSession, next: NextFunction) {
  session.run(() => {
    forEachEntrie(user, (key, value) => {
      session.set(key, value);
    });

    next();
  });
}

const webSession: unknown = new Proxy(session, {
  get(session, key: string) {
    return session.get(key);
  },

  set(session, key: string, value) {
    session.set(key, value);
    return true;
  },
});

function forEachEntrie(
  target: object,
  cb: (key: string, value: unknown) => void
) {
  Object.entries(target).forEach(([key, value]) => cb(key, value));
}

export default webSession as IWebSession;

/**
 * Types
 */

export interface IWebSession {
  id: number;
  fullName: string;
}

export type IUserSession = Omit<IWebSession, "setUser">;
