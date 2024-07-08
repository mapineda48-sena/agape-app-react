import Form from "components/Form";
import Submit from "components/Form/Submit";
import Input from "components/Form/Input";
import { user, login, logout } from "backend/service/auth";
import { useRouter } from "app";
import { Fragment, ReactNode, useCallback, useEffect } from "react";
import { useEmitter } from "components/EventEmitter";
import "./Login.css";

export default function Login({ redirectTo }: Props) {
  const app = useRouter();
  const emitter = useEmitter();

  useEffect(() => {
    if (user.id) {
      app.replace(redirectTo ?? "/cms");
      return;
    }

    return emitter.on("LoginComplete", (data: unknown) => {
      app.replace(redirectTo ?? "/cms");
    });
  }, [app, emitter, redirectTo]);

  if (user.id) {
    return null;
  }

  return (
    <div className="d-flex align-items-center py-4 bg-body-tertiary login-cms-agape">
      <div style={{ maxWidth: 300 }} className="form-signin m-auto">
        <Form onSubmit={login} thenEvent="LoginComplete">
          <h1 className="h3 mb-3 fw-normal text-center">AgapeApp</h1>
          <div className="form-floating">
            <Input.Text
              className="form-control"
              id="floatingInput"
              placeholder="username"
              name="username"
            />
            <label htmlFor="floatingInput">Usuario</label>
          </div>
          <div className="form-floating">
            <Input.Text
              password
              className="form-control"
              id="floatingPassword"
              placeholder="Password"
              name="password"
            />
            <label htmlFor="floatingPassword">Contraseña</label>
          </div>
          <div className="form-check text-start my-3">
            <input
              className="form-check-input"
              type="checkbox"
              defaultValue="remember-me"
              id="flexCheckDefault"
            />
            <label className="form-check-label" htmlFor="flexCheckDefault">
              Recordarme
            </label>
          </div>
          <Submit className="btn btn-primary w-100 py-2">Ingresar</Submit>
          <p className="mt-5 mb-3 text-body-secondary text-center">© 2017–2024</p>
        </Form>
      </div>
    </div>
  );
}

export function Protected(props: { children: ReactNode }) {
  const app = useRouter();

  useEffect(() => {
    if (!user.id) {
      app.replace("/login", { redirectTo: app.pathname });
      return;
    }
  }, [app]);

  if (!user.id) {
    return null;
  }

  return <Fragment>{props.children}</Fragment>;
}

const LogOutEvent = Symbol();

export function useLogOut() {
  const app = useRouter();
  const emitter = useEmitter();

  useEffect(() =>
    emitter.on(LogOutEvent, () => {
      app.replace("/login");
    })
  );

  return useCallback(() => {
    logout().then((res) => {
      emitter.emit(LogOutEvent, res);
    });
  }, [emitter]);
}

/**
 * Types
 */
export interface Props {
  redirectTo: string;
}
