import React, {useState} from 'react';
import axios from 'axios';

function AddPlaceReview(props) {
  const [inputVal, setInputVal] = useState('');
  const [toggle, setToggle] = useState(false);
  const [reviewData, setReviewData] = useState({});

  const handleSubmit = async (e) => {
    e.preventDefault();

    let review = document.getElementById('review').value;

    //validation..


    const {data} = await axios.post(`/${props.place.id}/newReview`,review, {
      headers: {Accept: 'application/json'}
    });

    console.log(data);
    setReviewData(data);
    alert(JSON.stringify(data));
    document.getElementById('title').value = '';
    document.getElementById('review').value = '';
  };

  return (
    <div>
      <form id='simple-form' onSubmit={handleSubmit}>
    
        <label>
          Review:
          <input
            id='review'
            name='review'
            type='text'
            placeholder='This place is cool.'
          />
        </label>

        <input type='submit' value='Submit' />
      </form>

      <br />
      <br />
      <h1>Toggle</h1>
      <button onClick={(e) => setToggle(!toggle)}>
        {toggle === true ? 'On' : 'Off'}
      </button>
      <br />
      <br />
      <h3>{inputVal}</h3>
      <label>
        Change State:
        <input
          id='chngState'
          name='chngState'
          type='text'
          placeholder='Change State by typing'
          onChange={(e) => setInputVal(e.target.value)}
        />
        <dl>
          <dt>{reviewData._id}</dt>
          <dt>{reviewData.review}</dt>
        </dl>
      </label>
    </div>
  );
}

export default AddPlaceReview;