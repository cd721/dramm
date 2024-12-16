import {doSignOut} from '../../firebase/FirebaseFunctions';

const SignOut = () => {
  return (
    <button onClick={doSignOut}>
      Sign Out
    </button>
  );
};

export default SignOut;