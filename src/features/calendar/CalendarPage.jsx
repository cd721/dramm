import { useState } from "react";
import Calendar from "react-calendar";
import '../shared/styles/calendar.css';

const testPlaces = [
    { name: 'Union Square Greenmarket', url: '/place/ZhCpgCXmOVl6zYPnnipdRw', visited: '2024-12-12' },
    { name: 'The High Line', url: '/place/JION8hhg7q6zyayHYwhxIw', visited: '2024-12-10' },
    { name: 'Sinatra Place', url: '/place/oruHmylOmwEnR3rmXYPf7A', visited: '2024-12-10' }
];

// https://www.npmjs.com/package/react-calendar?activeTab=readme
export const CalendarPage = () => {
    const [currentDate, setCurrentDate] = useState(new Date());

    const renderTileContent = ({ date, view }) => {
        if (view === 'month') {
            const formattedDate = date.toISOString().split('T')[0];
            const places = testPlaces.filter((place) => place.visited === formattedDate);
      
            // renders this block per date with a review on it
            if (places.length > 0) {
                return (
                    <div>
                        {places.map((place, index) => (
                            <div key={index}>
                                <a href={place.url}>{place.name}</a>
                            </div>
                        ))}
                    </div>
                );
            }

        } else {
            return null;
        }
    };

    return (
        <div>
            <Calendar
                value={currentDate}
                minDetail="year"
                maxDate={new Date()}
                showFixedNumberOfWeeks={true}

                tileContent={renderTileContent}

                // for styling days that have a review
                tileClassName={({ date, view }) => {
                    if (view === 'month') {
                        const formattedDate = date.toISOString().split('T')[0];

                        const hasReview = testPlaces.some((place) => place.visited === formattedDate);
                        return hasReview ? 'day-with-review' : null;
                    }

                    return null;
                }}
            />
        </div>
    );
};