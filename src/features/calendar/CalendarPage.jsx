import { useState } from "react";
import Calendar from "react-calendar";
import '../shared/styles/calendar.css';
import { useTitle } from "../shared/hooks/commonHooks";

const testPlaces = [
    { name: 'Union Square Greenmarket', url: '/place/ZhCpgCXmOVl6zYPnnipdRw', visited: '2024-12-12' },
    { name: 'The High Line', url: '/place/JION8hhg7q6zyayHYwhxIw', visited: '2024-12-10' },
    { name: 'Sinatra Place', url: '/place/oruHmylOmwEnR3rmXYPf7A', visited: '2024-12-10' }
];

// https://www.npmjs.com/package/react-calendar?activeTab=readme
export const CalendarPage = () => {
    useTitle('Calendar');

    const [currentDate, setCurrentDate] = useState(new Date());

    const renderTileContent = ({ date, view }) => {
        if (view === 'month') {
            const formattedDate = date.toISOString().split('T')[0];
            const todayFormatted = currentDate.toISOString().split('T')[0];

            if (formattedDate === todayFormatted) {
                return (
                    <div>
                        <a href='/places'>Add a review!</a>
                    </div>
                );
            }
            const places = testPlaces.filter((place) => place.visited === formattedDate);
      
            // renders this block per date with a review on it
            if (places.length > 0) {
                return (
                    <ul>
                        {places.map((place, index) => (
                            <li key={index}>
                                <a href={place.url}>{place.name}</a>
                            </li>     
                        ))}
                    </ul>
                );
            }

        } else {
            return null;
        }
    };

    return (
        <div className="calendar-page">
            <Calendar
                value={currentDate}
                minDetail="year"

                minDate={new Date('2024-11-02')}
                maxDate={new Date()}
                showFixedNumberOfWeeks={true}

                tileContent={renderTileContent}

                // for styling days that have a review
                tileClassName={({ date, view }) => {
                    if (date > new Date()) {
                        return "future-date";
                    }

                    if (view === 'month') {
                        const formattedDate = date.toISOString().split('T')[0];

                        const hasReview = testPlaces.some((place) => place.visited === formattedDate);
                        return hasReview ? 'has-review' : null;
                    }

                    return null;
                }}

                prevLabel="< PREV"
                nextLabel="NEXT >"

                prev2Label={null}
                next2Label={null}
            />
        </div>
    );
};