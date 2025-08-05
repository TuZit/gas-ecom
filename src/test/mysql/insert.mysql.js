import mysql from "mysql2";

// create connection to pool server
const pool = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "root",
  database: "test",
  port: 8811,
});

const batchSize = 10000;
const totalSize = 1_000_000;

let currentId = 1;

console.time("::::::::TIMER::::::::");

const insertBatchData = async () => {
  const values = [];
  for (let i = 0; i < batchSize && currentId <= totalSize; i++) {
    const name = `name-${currentId}`;
    const age = currentId;
    const address = `address-${currentId}`;
    values.push([currentId, name, age, address]);
    currentId++;
  }

  if (!values.length) {
    console.timeEnd("::::::::TIMER::::::::");
    pool.end((err) => {
      if (err) {
        console.log("error occurred while running insert batch");
      } else {
        console.log("connection pool closed");
      }
    });
  }

  const sql = `INSERT INTO test_table (id, name, age, address) VALUES ?`;
  pool.query(sql, [values], async function (err, results) {
    if (err) throw err;

    console.log(`Inserted ${results.affectedRows} records`);

    await insertBatchData();
  });
};

insertBatchData().catch((err) => console.error(err));
