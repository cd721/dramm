const exportedMethods = {



    convertUnixTimestampToTime(unixTimestamp) {
        try {
            return new Date(unixTimestamp * 1000).toLocaleString().split(", ")[1].trim();
        } catch {
            return "";
        }
    }
};
export default exportedMethods;