class DataUtil {
    static generateId(length = 32) {
        return new Array(length).fill(1).map(
            () => Math.round(Math.random() * 16).toString(16),
        ).join('').toUpperCase();
    }
}

export default DataUtil;
