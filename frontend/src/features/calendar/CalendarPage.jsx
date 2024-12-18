import { useContext, useEffect, useState } from "react";
import Calendar from "react-calendar";
import '../shared/styles/calendar.css';
import '../shared/styles/miscPages.css';
import { useTitle } from "../shared/hooks/commonHooks.js";
import { AuthContext } from "../../context/AuthContext.jsx";
import axios from "axios";
import { Link } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const formatToMMDDYYYY = (date) => {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${month}/${day}/${year}`;
};

// https://www.npmjs.com/package/react-calendar?activeTab=readme
export const CalendarPage = () => {
    useTitle('Calendar');

    const { currentUser } = useContext(AuthContext);
    const [userPosts, setUserPosts] = useState([]);
    const [dayPosts, setDayPosts] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);

    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const fetchUserPosts = async () => {
            if (!currentUser) return;

            try {
                const { data } = await axios.get(`${API_URL}/posts/byUser/${currentUser.uid}`);
                setUserPosts(data);
                
            } catch (error) {
                console.error("Failed to fetch posts:", error.message);
            }
        }
        fetchUserPosts();
    }, [currentUser]);

    const handleDayClick = (date) => {
        const formattedDate = formatToMMDDYYYY(date);
        const postsForDate = userPosts.filter(post => post.date === formattedDate);

        if (postsForDate.length > 0) {
            setDayPosts(postsForDate);
            setIsModalVisible(true);
        }

        setSelectedDate(date);
    };

    const closeModal = () => {
        setIsModalVisible(false);
        setDayPosts([]);
    };

    const renderTileContent = ({ date, view }) => {
        if (view === 'month') {
            const formattedDate = formatToMMDDYYYY(date);
            const todayFormatted = formatToMMDDYYYY(currentDate);

            if (formattedDate === todayFormatted) {
                return (
                    <div>
                        <a href='/places'>Add a review today!</a>
                    </div>
                );
            }

            // renders this block per date with a review on it
            const postsForDate = userPosts.filter(post => post.date === formattedDate);
            if (postsForDate.length > 0) {
                return (
                    <div></div>
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

                onClickDay={handleDayClick}

                tileContent={renderTileContent}
                // for styling days that have a review
                tileClassName={({ date, view }) => {
                    if (date > new Date()) {
                        return "future-date";
                    }

                    if (view === 'month') {
                        const formattedDate = formatToMMDDYYYY(date);
                        const todayFormatted = formatToMMDDYYYY(currentDate);

                        if (formattedDate === todayFormatted) {
                            return 'today'; 
                        }

                        const hasPosts = userPosts.some(post => post.date === formattedDate);
                        return hasPosts ? 'has-post' : null;
                    }

                    return null;
                }}

                prevLabel="< PREV"
                nextLabel="NEXT >"

                prev2Label={null}
                next2Label={null}
            />

            {isModalVisible && (
                <div className="modal-overlay" onClick={closeModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>

                        <button className="modal-close" onClick={closeModal}>x</button>
                        <h2>Reviews for {selectedDate.toDateString()}</h2>

                        <ul className="review-list">
                            {dayPosts.map((post, index) => (
                                <li key={index}>
                                    <div>
                                        <h4><Link to={`/place/${post.locationId}`}>{post.location}</Link></h4>
                                        <p>Rating: {post.rating}</p>
                                    </div>
                                    <p>{post.caption}</p>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            )}
        </div>
    );
};