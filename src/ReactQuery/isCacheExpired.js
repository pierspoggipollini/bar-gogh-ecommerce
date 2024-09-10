export const isCacheExpired = (cachedData) => {
    const expirationTime = 10 * 60 * 1000; // 10 minuti in millisecondi
    const currentTime = Date.now();

    // Verifica se il timestamp della cache è più vecchio del tempo di scadenza
    return currentTime - cachedData.timestamp > expirationTime;
};
