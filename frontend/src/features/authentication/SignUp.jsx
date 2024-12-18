import { useContext, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { doCreateUserWithEmailAndPassword } from '../../firebase/FirebaseFunctions';
import { AuthContext } from '../../context/AuthContext';
import {Link, useNavigate} from 'react-router-dom';

import SocialSignIn from './SocialSignIn';
import axios from "axios"

function SignUp() {
  const { currentUser } = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');
  const [formError, setFormError] = useState('');
  const [redirect, setRedirect] = useState(false); 
  const [formErrors, setFormErrors] = useState({});

  const validateForm = ({ displayName, email, passwordOne, passwordTwo }) => {
    const errors = {};

    if (!displayName.trim()) {
      errors.displayName = 'Name is required';
    }
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/^\S+@\S+\.\S+$/.test(email)) {
      errors.email = 'Enter a valid email address';
    }

    if (!passwordOne.trim()) {
      errors.passwordOne = 'Password is required';
    } else if (passwordOne.length < 6) {
      errors.passwordOne = 'Password must be at least 6 characters';
    }
    if (passwordTwo !== passwordOne) {
      errors.passwordTwo = 'Passwords do not match';
    }

    return errors;
  };

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { displayName, email, passwordOne, passwordTwo } = e.target.elements;

    const errors = validateForm({
      displayName: displayName.value,
      email: email.value,
      passwordOne: passwordOne.value,
      passwordTwo: passwordTwo.value,
    });

    setFormErrors(errors);

    // don't submit if >= 1 errors
    if (Object.keys(errors).length > 0) {
      return;
    }

    try {
      const response = await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName.value
      );

      const x = await axios.post(`http://localhost:3001/users/${response.user.uid}`);
      setRedirect(true);
    } catch (error) {
      setFormErrors({ form: error.message });
    }
  };

  if (currentUser && redirect) {
    const navigate = useNavigate();
    navigate('/home')

  }

  return (
    <article className='form-page'>
      <div className='form-container'>
        <form id='signup-form' onSubmit={handleSignUp}>
          <h2>Sign up for DRAMM</h2>
          {formErrors.form && <p className='form-overall-error'>{formErrors.form}</p>}
        
          <div className='form-field'>
            <label>Display Name</label>
              <input
                name='displayName'
                type='text'
                placeholder='Enter name'
                autoFocus={true}
              />
              {formErrors.displayName && <p className='form-error'>{formErrors.displayName}</p>}
          </div>

          <div className='form-field'>
            <label>Email</label>
            <input
              name='email'
              type='email'
              placeholder='Enter email'
            />
            {formErrors.email && <p className='form-error'>{formErrors.email}</p>}
          </div>

          <div className='form-row'>
            <div className='form-field'>
              <label>Password</label>
              <input
                id='passwordOne'
                name='passwordOne'
                type='password'
                placeholder='Enter password'
                autoComplete='off'
              />
              {formErrors.passwordOne && <p className='form-error'>{formErrors.passwordOne}</p>}
            </div>

            <div className='form-field'>
              <label>Confirm Password</label>
              <input
                name='passwordTwo'
                type='password'
                placeholder='Repeat password'
                autoComplete='off'
              />
              {formErrors.passwordTwo && <p className='form-error'>{formErrors.passwordTwo}</p>}
            </div>
          </div>

          <div className="form-buttons">
            <button className='button' type='submit'>
              Sign Up
            </button>
          </div>
        </form>

        <SocialSignIn />
      </div>

      <div className='form-switch'>
        <p>Already have an account? <Link to='/signin'>Sign in</Link>.</p>
      </div>
    </article>
  );
}

export default SignUp;