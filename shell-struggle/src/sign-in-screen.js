// Import FirebaseAuth and firebase.
import React from 'react';
import { firebase } from "./firebase"
import StyledFirebaseAuth from 'react-firebaseui/StyledFirebaseAuth';
import 'mdb-react-ui-kit/dist/css/mdb.min.css';

// Configure FirebaseUI.
const uiConfig = {
  // Popup signin flow rather than redirect flow.
  signInFlow: 'popup',
  // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
  // signInSuccessUrl: '/select-screen',
  // We will display Google and Facebook as auth providers.
  signInOptions: [
    firebase.auth.GoogleAuthProvider.PROVIDER_ID,
  ],
};

function SignInScreen() {
  return (
    <div>
      <h1 className="text-center">Shell Struggle Extreme</h1>
      <hr />
      <StyledFirebaseAuth uiConfig={uiConfig} firebaseAuth={firebase.auth()} />
    </div>
  );
}

export default SignInScreen