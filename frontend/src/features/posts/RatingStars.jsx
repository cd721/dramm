import '../shared/styles/posts.css';

export const RatingStars = ({ rating, maxStars = 5 }) => {
    return (
        <div className="stars-container">
        {Array.from({ length: maxStars }, (_, index) => (
          <div
            key={index}
            className={`star ${index < Math.floor(rating) ? "filled" : ""}`}
          >
            <img src="/icons/places/star.png" alt="star" />
          </div>
        ))}
      </div>
    );
};