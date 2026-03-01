import Database from "better-sqlite3";
const db = new Database("health.db");
const records = db.prepare("SELECT * FROM health_records").all();
console.log("Total records:", records.length);
console.log(JSON.stringify(records, null, 2));
