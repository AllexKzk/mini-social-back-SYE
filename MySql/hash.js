function hashString(string) {                               //simple custom hash for password
    let hash = 0;
    for (i = 0; i < string.length; i++) {
        hash = ((hash << 5) - hash) + string.charCodeAt(i);
        hash = hash & hash;
    }
    return hash;
}

module.exports = {hashString};