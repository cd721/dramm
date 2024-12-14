import { useContext, useState } from 'react';
import { AuthContext } from '../../context/AuthContext';
import '../shared/styles/layout.css'
import CreatePostModal from '../posts/CreatePostModal';
import DisplayReviews from '../posts/DisplayReviews.jsx';

function Home() {
  const { currentUser } = useContext(AuthContext);
  const [isModalVisible, setIsModalVisible] = useState(false)

  console.log(currentUser);
  return (
    <div className='home'>
      <h2>
        Welcome {currentUser && currentUser.displayName}!
      </h2>
      {/* <button
        className="create-post"
        onClick={() => {
          setIsModalVisible(true)
        }}>
        Create Post
      </button>
      {isModalVisible && (<CreatePostModal isOpen={isModalVisible} onClose={() => setIsModalVisible(false)} />)} */}
      
      <DisplayReviews/>

    </div>
  );
}

export default Home;