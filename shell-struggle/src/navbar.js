import React from "react";
import 'mdb-react-ui-kit/dist/css/mdb.min.css';
import SignOutButton from './sign-out-button';
import { getUIDByUsername } from './database';

function NavbarItem(props) {
  return (
    <li className="nav-item">
      <a className="nav-link" href={props.to}>{props.text}</a>
    </li>
  );
}

function Navbar(props) {
    return (
      <nav className="navbar navbar-expand-lg navbar-light bg-white">
      <div className="container-fluid">
        <div className="collapse navbar-collapse" id="navbar">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <NavbarItem text="Home" to={`/profile/${props.uid}`} />
            {/* <NavbarItem text="Select Screen" to="/select-screen" /> */}
            <NavbarItem text="Bestiary" to="/bestiary" />
            <NavbarItem text="Shop" to="/shop" />
          </ul>
      
          <div className="input-group m-1 w-25">
            <input id="searchBar" type="search" className="form-control rounded col-2" placeholder="Search for User" aria-label="Search for User" aria-describedby="search-addon" onKeyPress={ async e => {
              if (e.key === 'Enter') {
                const query = document.getElementById('searchBar').value;
                if (query === "") return;
                const uid = await getUIDByUsername(query);
                if (!uid) {
                  alert(`User "${query}" not found.`);
                  return;
                }
                window.location.href = `/profile/${uid}`;
              }
            } }/>
            <button type="button" className="btn btn-outline-primary" onClick={ 
              async () => {
                const query = document.getElementById('searchBar').value;
                if (query === "") return;
                const uid = await getUIDByUsername(query);
                if (!uid) {
                  alert(`User "${query}" not found.`);
                  return;
                }
                window.location.href = `/profile/${uid}`;
              }
            }>search</button>
          </div>
          <SignOutButton />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;