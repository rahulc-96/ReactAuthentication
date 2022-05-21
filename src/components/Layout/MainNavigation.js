import { Link } from 'react-router-dom';
import AuthContext from '../../context/AuthContext';
import classes from './MainNavigation.module.css';
import {useContext} from 'react'
const MainNavigation = () => {
  const authContext = useContext(AuthContext);
  const isLoggedIn = authContext.isLoggedIn;
  return (
    <header className={classes.header}>
      <Link to='/'>
        <div className={classes.logo}>React Auth</div>
      </Link>
      <nav>
        <ul>
          {!isLoggedIn && <li><Link to='/auth'>Login</Link></li>}
          {isLoggedIn && <li><Link to='/profile'>Profile</Link> </li>}
          {isLoggedIn && <li><button onClick = {authContext.logout}>Logout</button></li>}
        </ul>
      </nav>
    </header>
  );
};

export default MainNavigation;
