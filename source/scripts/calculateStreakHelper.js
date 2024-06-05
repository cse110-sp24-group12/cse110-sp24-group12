function calculateConsecutiveDayStreak(entries) {
    if (entries.length === 0) return 0;

    // Normalize entry dates to the start of the day, increase by one day,
    // and convert to Set for O(1) lookups
    const entryDates = new Set(entries.map((entry) => {
        const date = new Date(entry.date);
        date.setDate(date.getDate() + 1); // Increase the date by one day
        date.setHours(0, 0, 0, 0);
        return date.toISOString().split('T')[0];
    }));

    let currentStreak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the start of the day

    console.log('Entry dates:', [...entryDates]); // Debugging statement

    // Loop backwards from today
    while (true) {
        const todayStr = today.toISOString().split('T')[0];
        console.log(`Checking date: ${todayStr}`); // Debugging statement
        if (entryDates.has(todayStr)) {
            currentStreak += 1;
            console.log(`Streak incremented to: ${currentStreak}`); // Debugging statement
        } else {
            console.log('No entry found. Breaking the loop.'); // Debugging statement
            break; // Break the loop if there is a day without an entry
        }
        // Move to the previous day
        today.setDate(today.getDate() - 1);
    }

    return currentStreak;
}