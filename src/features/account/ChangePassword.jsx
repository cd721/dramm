import  {useContext, useState} from 'react';
import {AuthContext} from '../../context/AuthContext';
import {doChangePassword} from '../../firebase/FirebaseFunctions';

function ChangePassword() {
  const {currentUser} = useContext(AuthContext);
  const [pwMatch, setPwMatch] = useState('');
  console.log(currentUser);

  const submitForm = async (event) => {
    event.preventDefault();
    const {currentPassword, newPasswordOne, newPasswordTwo} =
      event.target.elements;

    if (newPasswordOne.value !== newPasswordTwo.value) {
      setPwMatch('New Passwords do not match, please try again');
      return false;
    }

    try {
      await doChangePassword(
        currentUser.email,
        currentPassword.value,
        newPasswordOne.value
      );
      alert('Password has been changed, you will now be logged out');
    } catch (error) {
      alert(error);
    }
  };

  if (currentUser.providerData[0].providerId === 'password') {

    return (
      <div className='form-container'>
        
        <form onSubmit={submitForm}>
          <h2>Hi {currentUser.displayName}, Change Your Password Below</h2>
          {pwMatch && <p className='form-error'>{pwMatch}</p>}

          <div className='form-field'>
            <label>Current Password</label>
            <input
              name='currentPassword'
              id='currentPassword'
              type='password'
              placeholder='Current Password'
              autoComplete='off'
              required
            />
          </div>

          <div className='form-field'>
            <label>New Password:</label>
            <input
              name='newPasswordOne'
              id='newPasswordOne'
              type='password'
              placeholder='Password'
              autoComplete='off'
              required
            />
          </div>

          <div className='form-field'>
            <label>Confirm New Password:</label>
            <input
              name='newPasswordTwo'
              id='newPasswordTwo'
              type='password'
              placeholder='Confirm Password'
              autoComplete='off'
              required
            />
          </div>
          <div className="form-buttons">
            <button className='button' type='submit'>
              Change Password
            </button>
          </div>
        </form>
      </div>
    );

  } else {
    return (
      <div>
        <h2>
          {currentUser.displayName}, You are signed in using a Social Media
          Provider, You cannot change your password
        </h2>
      </div>
    );
  }
}

export default ChangePassword;