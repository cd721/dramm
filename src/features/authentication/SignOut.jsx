import {doSignOut} from '../../firebase/FirebaseFunctions';

const SignOut = () => {
  return (
    <button className='button' type='button' onClick={doSignOut}>
      Sign Out
    </button>
  );
};

export default SignOut;