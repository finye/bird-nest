export const isWithinTheLastTenMinutes = (snapShotTimestamp: string) => {
    // get the last 10 minutes
    const lastTenMinutes = new Date().getTime() - 10 * 60 * 1000;

    // checks if snapShotTimestamp is within the last 10 minutes
    return new Date(snapShotTimestamp).getTime() > lastTenMinutes;
}