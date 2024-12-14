import '../shared/styles/profile.css';
import { useNavigate } from 'react-router-dom';

function Account() {
  const navigate = useNavigate();

  const handleCustomizeProfile = () => {
    navigate('/customize-profile');
  };

  const handleChangePassword = () => {
    navigate('/change-password');
  }

  return (
    <div className='card'>
      <h2>Account Page</h2>
      <div>
        <button className='button' type='button' onClick={handleCustomizeProfile}>
          Customize Your Profile
        </button>
        <button className='button' type='button' onClick={handleChangePassword}>
          Change Password
        </button>
      </div>
    </div>
  );
}

export default Account;