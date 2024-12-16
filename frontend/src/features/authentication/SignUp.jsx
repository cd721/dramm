import  {useContext, useState} from 'react';
import {Link, Navigate} from 'react-router-dom';
import {doCreateUserWithEmailAndPassword} from '../../firebase/FirebaseFunctions';
import {AuthContext} from '../../context/AuthContext';
import SocialSignIn from './SocialSignIn';

function SignUp() {
  const {currentUser} = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');
  const [formError, setFormError] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const {displayName, email, passwordOne, passwordTwo} = e.target.elements;
    if (passwordOne.value !== passwordTwo.value) {
      setPwMatch('Password does not match');
      return false;
    }

    try {
      await doCreateUserWithEmailAndPassword(
        email.value,
        passwordOne.value,
        displayName.value
      );
    } catch (error) {
      setFormError(error.message);
    }
  };

  if (currentUser) {
    return <Navigate to='/home' />;
  }

  return (
    <article className='form-page'>
      <div className='form-container'>
        <form id='signup-form' onSubmit={handleSignUp}>
          <h2>Sign up for DRAMM</h2>
          <p className={formError ? 'form-overall-error' : ''}>{formError}</p>
        
          <div className='form-field'>
            <label>Name</label>
              <input
                required
                name='displayName'
                type='text'
                placeholder='Enter name'
                autoFocus={true}
              />
          </div>

          <div className='form-field'>
            <label>Email</label>
            <input
              required
              name='email'
              type='email'
              placeholder='Enter email'
            />
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
                required
              />
            </div>

            <div className='form-field'>
              <label>Confirm Password</label>
              <input
                name='passwordTwo'
                type='password'
                placeholder='Repeat password'
                autoComplete='off'
                required
              />
              {pwMatch && <p className='form-error'>{pwMatch}</p>}
            </div>
          </div>


          <div className="form-buttons">
            <button className='button' type='submit'>
              Sign in
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