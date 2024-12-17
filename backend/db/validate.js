export const checkId = (id) =>{
    if (!id) return False
    if (typeof id !== 'string') return False
    id = id.trim();
    if (id.length === 0)
        return False
    return true;
}

export const checkString = (strVal) => {
    if (!strVal) return false
    if (typeof strVal !== 'string') return false
    strVal = strVal.trim();
    if (strVal.length === 0)
        return false
    if (!isNaN(strVal))
        return false
    return true;
}