const exportedMethods = {
    isValidSearchTerm(strVal) {
        if (!strVal) { return false };
        if (typeof strVal !== 'string') {
            return false;
        };

        strVal = strVal.trim();

        if (strVal.length === 0) {
            return false;
        }


        const onlySpecials = /^[^a-zA-Z0-9\s]+$/;

        if (onlySpecials.test(strVal)) {
            return false;
        }

        if (!isNaN(strVal)) { 
           return false;
            
        }
        return true;
    },
}
export default exportedMethods;