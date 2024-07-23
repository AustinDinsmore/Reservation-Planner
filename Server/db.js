const pg = require("pg");
const uuid = require("uuid");

const client = new pg.Client(
  process.env.DATABASE_URL || "postgres://localhost/reservation_db"
);

const createRestaurant = async ({name}) => {
    const SQL = `INSERT INTO restaurant(id, name) VALUES($1, $2) RETURNING *;`;
    const dbResponse = await client.query(SQL, [uuid.v4(), name]);
    return dbResponse.rows[0];
  };

const createTables = async () => {
  const SQL = `
    DROP TABLE IF EXISTS reservation; 
    DROP TABLE IF EXISTS restaurant; 
    DROP TABLE IF EXISTS customer;

    CREATE TABLE customer(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    );
    CREATE TABLE restaurant(
        id UUID PRIMARY KEY,
        name VARCHAR(100) NOT NULL UNIQUE
    );
    CREATE TABLE reservation(
        id UUID PRIMARY KEY,
        date TIMESTAMP DEFAULT now(),
        party_count INTEGER NOT NULL DEFAULT 2,
        restaurant_id UUID REFERENCES restaurants(id) NOT NULL, 
        customer_id UUID REFERENCES customers(id) NOT NULL
    );
    `;

  await client.query(SQL);
};

const createCustomer = async ({ name }) => {
  const SQL = `INSERT INTO customer(id, name) VALUES($1, $2) RETURNING *;`;
  const dbResponse = await client.query(SQL, [uuid.v4(), name]);
  return dbResponse.rows[0];
};

const createReservation = async ({ date, party_count, restaurant_id, customer_id }) => {
  const SQL = `INSERT INTO reservation(id, user_id, place_id, travel_date) VALUES($1, $2, $3, $4) RETURNING *;`;
  const dbResponse = await client.query(SQL, [
    uuid.v4(),
    date,
    party_count,
    restaurant_id,
    customer_id,
  ]);
  return dbResponse.rows[0];
};

const destroyReservation = async ({ id, customer_id }) => {
  const SQL = `DELETE FROM reservation WHERE id=$1 AND customer_id=$2`;
  await client.query(SQL, [id, user_id]);
};

const fetchCustomer = async () => {
  const SQL = `SELECT * FROM customer;`;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};

const fetchRestaurant = async () => {
  const SQL = `SELECT * FROM restaurant;`;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};

const fetchReservation = async () => {
  const SQL = `SELECT * FROM reservation;`;
  const dbResponse = await client.query(SQL);
  return dbResponse.rows;
};

module.exports = {
  client,
  createRestaurant,
  createTables,
  createCustomer,
  createReservation,
  destroyReservation,
  fetchCustomer,
  fetchRestaurant,
  fetchReservation,
};