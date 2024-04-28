import Form from 'Form';
import Submit from 'Form/Submit';
import Input from 'Form//Input';
import { login } from 'backend/service/auth';
import { useRouter } from "App";

console.log(login);

export default function Login() {
  const app = useRouter();


  return <div className="d-flex align-items-center py-4 bg-body-tertiary">
    <div style={{ maxWidth: 300 }} className="form-signin m-auto">
      <Form onSubmit={app.auth(login)} >
        <h1 className="h3 mb-3 fw-normal">Please sign in</h1>
        <div className="form-floating">
          <Input.Text
            className="form-control"
            id="floatingInput"
            placeholder="username"
            name='username'
          />
          <label htmlFor="floatingInput">Username</label>
        </div>
        <div className="form-floating">
          <Input.Text
            password
            className="form-control"
            id="floatingPassword"
            placeholder="Password"
            name='password'
          />
          <label htmlFor="floatingPassword">Password</label>
        </div>
        <div className="form-check text-start my-3">
          <input
            className="form-check-input"
            type="checkbox"
            defaultValue="remember-me"
            id="flexCheckDefault"
          />
          <label className="form-check-label" htmlFor="flexCheckDefault">
            Remember me
          </label>
        </div>
        <Submit className="btn btn-primary w-100 py-2">
          Sign in
        </Submit>
        <p className="mt-5 mb-3 text-body-secondary">© 2017–2024</p>
      </Form>
    </div>
  </div>;
}
