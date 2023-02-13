import database from ".";

export default async function ping() {
    const time = performance.now();
    await database.authenticate();
    return performance.now() - time;
}