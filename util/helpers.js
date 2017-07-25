function tryParseJSON(str) {
    try {
        return JSON.parse(str);
    } catch (error) {
        return null;
    }
}

module.exports = {
    tryParseJSON
};