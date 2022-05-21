import classes from "./ProfileForm.module.css";
import useHttp from "../../hooks/useHttp";
import { useRef, useContext, useEffect} from "react";
import AuthContext from "../../context/AuthContext";
import { useHistory } from "react-router-dom";
const ProfileForm = () => {
  const passRef = useRef();
  const authContext = useContext(AuthContext);
  const history = useHistory();
  const { data, isLoading, error, sendRequest } = useHttp();
  const passwordChangeHandler = (event) => {
    event.preventDefault();
    sendRequest(
      "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyDMvHkUhie_92rBxzg3OdEJZxleOlRk5rc",
      {
        method: "POST",
        body: {
          password: passRef.current.value,
          idToken: authContext.token,
          returnSecureToken: false,
        },
      }
    );
  };
  
  useEffect(() => {
    !error && !isLoading && data && authContext.logout();
  }, [history, error, isLoading, data, authContext])

  return (
    <form className={classes.form}>
      <div className={classes.control}>
        <label htmlFor="new-password">New Password</label>
        <input type="password" id="new-password" ref={passRef} />
      </div>
      <div className={classes.action}>
          <button onClick={passwordChangeHandler}>Change Password</button>
        {error && <p>{error}</p>}
      </div>
    </form>
  );
};

export default ProfileForm;
