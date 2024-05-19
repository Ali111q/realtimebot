// helper.js

const sqlite3 = require("sqlite3").verbose();

// Open a database connection
let db = new sqlite3.Database("user_country_mapping.db", (err) => {
  if (err) {
    console.error(err.message);
  }
  console.log("Connected to the user_country_mapping database.");
});

// Create user_country_mapping table if it doesn't exist
db.run(`CREATE TABLE IF NOT EXISTS user_country_mapping (
  user_id INTEGER PRIMARY KEY,
  country_id INTEGER NOT NULL
)`);

// Function to store country ID with user ID
function storeCountryId(userId, countryId) {
  return new Promise((resolve, reject) => {
    db.run(
      `INSERT OR REPLACE INTO user_country_mapping (user_id, country_id) VALUES (?, ?)`,
      [userId, countryId],
      function (err) {
        if (err) {
          reject(err);
        } else {
          resolve();
        }
      }
    );
  });
}

// Function to get country ID by user ID
function getCountryId(userId) {
  return new Promise((resolve, reject) => {
    db.get(
      `SELECT country_id FROM user_country_mapping WHERE user_id = ?`,
      [userId],
      (err, row) => {
        if (err) {
          reject(err);
        } else {
          if (row) {
            resolve(row.country_id);
          } else {
            resolve(null); // User ID not found
          }
        }
      }
    );
  });
}

// Close the database connection
function closeConnection() {
  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    console.log("Close the user_country_mapping database connection.");
  });
}

module.exports = {
  storeCountryId,
  getCountryId,
  closeConnection,
};
