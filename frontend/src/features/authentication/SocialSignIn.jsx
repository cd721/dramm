
import {doSocialSignIn} from '../../firebase/FirebaseFunctions';

const SocialSignIn = () => {
  const socialSignOn = async () => {
    try {
      await doSocialSignIn();
    } catch (error) {
      alert(error);
    }
  };
  return (
    <ul className='socials-logins'>
      <h4>or</h4>

      <li onClick={() => socialSignOn()}>
        {/* <a target="_blank" href="https://icons8.com/icon/V5cGWnc9R4xj/google">Google</a> icon by <a target="_blank" href="https://icons8.com">Icons8</a> */}
        <img
          alt='google signin'
          src='./socials/google-48x48.png'
        />
        <p>Connect with Google</p>
      </li>
    </ul>
  );
};

export default SocialSignIn;