import '../shared/styles/miscPages.css';

export const Landing = () => {
  return (
    <div className="landing">

      <div className="landing-hero">
        <div>
          <h1>Nature is calling for you</h1>
          <p>
            Image by <a href="https://pixabay.com/users/wallner-974517/?utm_source=link-attribution&utm_medium=referral&utm_campaign=image&utm_content=983535">Margit Wallner</a>
          </p> 
        </div>
      </div>

      <div className="slogan">
        <h2>DISCOVER, RESEARCH, MAP, MEET.</h2>
      </div>

      <div className="features">
        <div className="feature-item">
          <img src="./icons/nature.png"/>
          <h3>Discover Nature</h3>
          <p>Find the best nature spots near you, from parks and gardens to nature trails and farms.</p>
        </div>
        
        <div className="feature-item">
          <img src="./icons/weather.png"/>
          <h3>Plan Your Perfect Outing</h3>
          <p>Check the forecast for your favorite spots and choose the best time to visit.</p>
        </div>

        <div className="feature-item">
          <img src="./icons/calendar.png"/>
          <h3>Track & Stay Motivated</h3>
          <p>Log your visits, review places, and earn badges to showcase your commitment to exploring nature.</p>
        </div>
      </div>
    </div>
  );
}