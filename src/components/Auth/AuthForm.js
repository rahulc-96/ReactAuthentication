import { useState, useRef, useContext, useCallback, useEffect} from "react";
import AuthContext from "../../context/AuthContext";
import classes from "./AuthForm.module.css";
import useHttp from "../../hooks/useHttp";
import { useHistory } from "react-router-dom";

const AuthForm = () => {
  console.log("Rendering Auth Form");
  const [isLogin, setIsLogin] = useState(true);
  const emailRef = useRef();
  const passRef = useRef();
  const authContext = useContext(AuthContext);
  const switchAuthModeHandler = () => {
    setIsLogin((prevState) => !prevState);
  };
  const history = useHistory();
  const {data, isLoading, error, sendRequest } = useHttp();

  const submitHandler = (event) => {
    event.preventDefault();
    if (!isLogin) {
      signUpHandler();
    } else {
      signInHandler();
    }
  };


  const signUpHandler = () => {
    sendRequest(
      "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyDMvHkUhie_92rBxzg3OdEJZxleOlRk5rc",
      {
        method: "POST",
        body: {
          email: emailRef.current.value,
          password: passRef.current.value,
          returnSecureToken: false,
        },
      },
    );
  };

  const loginHandler = useCallback((response) => {
    let expirationTime = new Date(
      new Date().getTime() + +response.expiresIn * 1000
    );
    authContext.login(response.idToken, expirationTime.toISOString());
  }, [authContext]);

  useEffect(() => {
    if(data != null && data.idToken != null){
      loginHandler(data);
    }
    !error && !isLoading && data && history.replace("/")
  }, [history, loginHandler, error, isLoading, data])

  const signInHandler = () => {
    sendRequest(
      "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyDMvHkUhie_92rBxzg3OdEJZxleOlRk5rc",
      {
        method: "POST",
        body: {
          email: emailRef.current.value,
          password: passRef.current.value,
          returnSecureToken: true,
        },
      },
    );

  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? "Login" : "Sign Up"}</h1>
      <form>
        <div className={classes.control}>
          <label htmlFor="email">Your Email</label>
          <input type="email" id="email" ref={emailRef} required />
        </div>
        <div className={classes.control}>
          <label htmlFor="password">Your Password</label>
          <input type="password" id="password" ref={passRef} required />
        </div>
        <div className={classes.actions}>
          <button onClick={submitHandler}>
            {isLogin ? "Login" : "Create Account"}
          </button>
          <button
            type="button"
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin && !isLoading
              ? "Create new account"
              : "Login with existing account"}
          </button>
          {isLoading && <p>Loading...</p>}
          {error && <p>{error}</p>}
        </div>
      </form>
    </section>
  );
};

export default AuthForm;
