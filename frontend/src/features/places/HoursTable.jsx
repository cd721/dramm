export const HoursTable = ({ hours }) => {
    const daysOfTheWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

    const openHours = hours[0].open || [];
    
    const formatTime = (time) => {
        const hour = parseInt(time.slice(0, 2));
        const minute = time.slice(2);
        const period = hour >= 12 ? 'PM' : 'AM';

        let formattedHour = hour;
        if (hour > 12) {
            formattedHour = hour - 12;
        } else if (hour === 0) {
            formattedHour = 12;
        }

        return `${formattedHour}:${minute} ${period}`;
    }

    const formattedHours = daysOfTheWeek.map((day, index)  => {
        const dayHours = [];
        for (const hour of openHours) {
            if (hour.day === index) {
                dayHours.push(hour);
            }
        }

        return {
            day,
            hours: dayHours.map((hour) => `${formatTime(hour.start)} - ${formatTime(hour.end)}`)
        }
    });

    return (
        <table className="hours-table">
            <tbody>
                {formattedHours.map((entry, index) => (
                    <tr key={index}>
                        <td className="day">{entry.day}</td>
                        <td className="hours">{entry.hours.length > 0 ? entry.hours.join(',') : 'Closed'}</td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}