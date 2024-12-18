import  {useContext, useState} from 'react';
import SocialSignIn from './SocialSignIn';
import {Link, Navigate, useNavigate} from 'react-router-dom';
import {AuthContext} from '../../context/AuthContext';
import {
  doSignInWithEmailAndPassword,
  doPasswordReset
} from '../../firebase/FirebaseFunctions';

function SignIn() {
  const {currentUser} = useContext(AuthContext);
  const [formErrors, setFormErrors] = useState({});

  const validateForm = ({ email, password }) => {
    const errors = {};
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Enter a valid email address';
    }

    if (!password.trim()) {
      errors.password = 'Password is required';
    }
    
    return errors;
  };

  const handleLogin = async (event) => {
    event.preventDefault();
    const { email, password } = event.target.elements;

    const errors = validateForm({
      email: email.value,
      password: password.value,
    });

    setFormErrors(errors);

    // don't submit if >= 1 errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      await doSignInWithEmailAndPassword(email.value, password.value);
    } catch (error) {
      setFormErrors({ form: error.message });
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

  const navigate = useNavigate();
  if (currentUser) {
    navigate('/home')
  }

  return (
    <article className='form-page'>
      <div className='form-container'>
        <form id='signin-form' onSubmit={handleLogin}>
          <h2>Log in to DRAMM</h2>
          {formErrors.form && <p className='form-overall-error'>{formErrors.form}</p>}

          <div className='form-field'>
            <label>Email</label>
            <input
              name='email'
              id='email'
              type='email'
              placeholder='Enter email'
              autoFocus={true}
            />
            {formErrors.email && <p className='form-error'>{formErrors.email}</p>}
          </div>

          <div className='form-field'>
            <label>Password</label>
            <input
              name='password'
              type='password'
              placeholder='Enter password'
              autoComplete='off'
            />
            {formErrors.password && <p className='form-error'>{formErrors.password}</p>}

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