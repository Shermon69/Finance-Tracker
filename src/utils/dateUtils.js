const calculateNextDate = (currentDate, frequency) => {
    const nextDate = new Date(currentDate);

    switch(frequency) { //Setting the logic to calculate the next payment date
        case "daily":
            nextDate.setDate(nextDate.getDate() + 1);
            break;
        case "weekly":
            nextDate.setDate(nextDate.getDate() + 7);
            break;
        case "monthly":
            nextDate.setMonth(nextDate.getMonth() + 1);
            break;
        case "yearly":
            nextDate.setFullYear(nextDate.getFullYear() + 1);
            break;
        default:
            return null;
    }
    return nextDate;
};

module.exports = { calculateNextDate };