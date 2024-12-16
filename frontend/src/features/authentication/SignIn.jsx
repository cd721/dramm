import  {useContext, useState} from 'react';
import SocialSignIn from './SocialSignIn';
import {Link, Navigate} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';
import {
  doSignInWithEmailAndPassword,
  doPasswordReset
} from '../../firebase/FirebaseFunctions';

function SignIn() {
  const {currentUser} = useContext(AuthContext);
  const [formError, setFormError] = useState('');

  const handleLogin = async (event) => {
    event.preventDefault();
    let {email, password} = event.target.elements;

    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      setFormError(error.message);
    }
  };

  const passwordReset = (event) => {
    event.preventDefault();
    let email = document.getElementById('email').value;
    if (email) {
      doPasswordReset(email);
      alert('Password reset email was sent');
    } else {
      alert(
        'Please enter an email address below before you click the forgot password link'
      );
    }
  };
  if (currentUser) {
    return <Navigate to='/home' />;
  }
  return (
    <article className='form-page'>
      <div className='form-container'>
        <form id='signin-form' onSubmit={handleLogin}>
          <h2>Log in to DRAMM</h2>
          <p className={formError ? 'form-overall-error' : ''}>{formError}</p>

          <div className='form-field'>
            <label>Email</label>
            <input
              name='email'
              id='email'
              type='email'
              placeholder='Enter email'
              required
              autoFocus={true}
            />
          </div>

          <div className='form-field'>
            <label>Password</label>
            <input
              name='password'
              type='password'
              placeholder='Enter password'
              autoComplete='off'
              required
            />

            <a className='forgot-password' onClick={passwordReset}>
              Forgot your password?
            </a>
          </div>

          <div className="form-buttons">
            <button className='button' type='submit'>
              Log in
            </button>

          </div>
          
        </form>
        <SocialSignIn />
      </div>

      <div className='form-switch'>
        <p>No account yet? <Link to='/signup'>Sign up</Link>.</p>
      </div>
    </article>
  );
}

export default SignIn;