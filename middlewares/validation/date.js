export const parseDate = function(dateString) {
    
    // Try ISO 8601 format (e.g., "2023-12-31")
    let date = new Date(dateString);
  
    // Fallback to custom formats if needed
    if (isNaN(date)) {
        // Try MM/DD/YYYY format (common in US)
        const parts = dateString.split('/');
        if (parts.length === 3) {
        date = new Date(parts[2], parts[0] - 1, parts[1]);
        }
    }
  
    // Validate result
    if (isNaN(date.getTime())) {
        throw new Error(`Invalid date format: ${dateString}`);
    }

    return date;
}

export const isDate = function(dateString) {
     try {
        const date = parseDate(dateString);
        return true;
     } catch (error) {
        return false;
     }
}

export const isDateBefore = function(firstDate, secondDate) {
    const dateA = typeof firstDate === 'string' ? parseDate(firstDate) : firstDate ;
    const dateB = typeof secondDate === 'string' ? parseDate(secondDate) : secondDate;

    return dateA.getTime() < dateB.getTime();
}