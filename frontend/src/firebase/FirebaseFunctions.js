import {
  getAuth,
  createUserWithEmailAndPassword,
  signOut,
  updateProfile,
  signInWithEmailAndPassword,
  updatePassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
  EmailAuthProvider,
  reauthenticateWithCredential
} from 'firebase/auth';

import axios from 'axios';

async function doCreateUserWithEmailAndPassword(email, password, displayName) {
  const auth = getAuth();
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  console.log("user created")
  console.log(userCredential);
  await updateProfile(auth.currentUser, { displayName: displayName });

  
  await axios.post(`http://localhost:3001/users/${userCredential.user.uid}`);
  return userCredential
}

async function doChangePassword(email, oldPassword, newPassword) {
  const auth = getAuth();
  let credential = EmailAuthProvider.credential(email, oldPassword);
  console.log("password changed")
  console.log(credential);
  await reauthenticateWithCredential(auth.currentUser, credential);

  await updatePassword(auth.currentUser, newPassword);
  await doSignOut();
}

async function doSignInWithEmailAndPassword(email, password) {
  let auth = getAuth();
  const userCredential = await signInWithEmailAndPassword(auth, email, password);
  console.log("user signed in w/ email and pwd")
  console.log("The user's UID is " + userCredential.user.uid);
  await axios.post(`http://localhost:3001/users/${userCredential.user.uid}`);

}

async function doSocialSignIn() {
  let auth = getAuth();
  let socialProvider = new GoogleAuthProvider();
  const userCredential = await signInWithPopup(auth, socialProvider);
  console.log("social signin:")
  console.log(userCredential);
  await axios.post(`http://localhost:3001/users/${userCredential.user.uid}`);
}

async function doPasswordReset(email) {
  let auth = getAuth();
  await sendPasswordResetEmail(auth, email);
}

async function doSignOut() {
  let auth = getAuth();
  await signOut(auth);
}

export {
  doCreateUserWithEmailAndPassword,
  doSocialSignIn,
  doSignInWithEmailAndPassword,
  doPasswordReset,
  doSignOut,
  doChangePassword
};