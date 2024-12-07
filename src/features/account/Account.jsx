import { useNavigate } from 'react-router-dom';
import SignOutButton from '../authentication/SignOut';
import ChangePassword from './ChangePassword';

function Account() {
  const navigate = useNavigate();

  const handleCustomizeProfile = () => {
    navigate('/customize-profile');
  };

  return (
    <div className='card'>
      <h2>Account Page</h2>
      <button className='button' type='button' onClick={handleCustomizeProfile}>
        Customize Your Profile
      </button>
      <ChangePassword />
      <SignOutButton />
    </div>
  );
}

export default Account;