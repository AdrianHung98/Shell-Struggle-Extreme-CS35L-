import React from "react";
import SignOutButton from './sign-out-button';

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
            <NavbarItem text="Home" to="/select-screen" />
            <NavbarItem text="Profile" to={`/profile/${props.uid}`} />
            <NavbarItem text="Bestiary" to="/bestiary" />
          </ul>
      
          <SignOutButton />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;