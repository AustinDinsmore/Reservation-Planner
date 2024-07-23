const express = require("express")

const {
    client,
    fetchCustomer,
    fetchRestaurant,
    createReservation,
    fetchReservation,
    destroyReservation,
  } = require("./db.js");
  
  //create the express server
  const server = express();
  //connect to the db client
  client.connect();
  
  //middleware to use before all routes
  server.use(express.json()); //parses the request body so our route can access it
  
  //routes
  //returns an array of customers
  server.get("/api/customer", async (req, res, next) => {
    try {
      res.send(await fetchCustomer());
    } catch (ex) {
      next(ex);
    }
  });
  
  //returns an array of restaurants
  server.get("/api/restaurant", async (req, res, next) => {
    try {
      res.send(await fetchRestaurant());
    } catch (ex) {
      next(ex);
    }
  });
  
  //returns an array of reservations
  server.get("/api/reservation", async (req, res, next) => {
    try {
      res.send(await fetchReservation());
    } catch (ex) {
      next(ex);
    }
  });
  
  //adds a new reservation
  server.post("/api/customer/:customer_id/reservation", async (req, res, next) => {
    try {
      res.status(201).send(
        await createReservation({
          date: req.params.date,
          party_count: req.params.party_count,
          customer_id: req.params.user_id,
          restaurant_id: req.body.place_id,
        })
      );
    } catch (ex) {
      next(ex);
    }
  });
  
  //deletes a reservation for a particular customer based on the customer id and reservation id given and returns nothing with a status code of 204
  server.delete("/api/customer/:customer_id/reservation/:id", async (req, res, next) => {
    try {
      await destroyReservation({ customer_id: req.params.customer_id, id: req.params.id });
      res.sendStatus(204);
    } catch (ex) {
      next(ex);
    }
  });
  
  //error handling route which returns an object with an error property
  server.use((err, req, res, next) => {
    res.status(err.status || 500).send({ error: err.message || err });
  });
  
  const port = process.env.PORT || 3000;
  server.listen(port, () => {
    console.log(`listening on port ${port}`);
    console.log("some curl commands to test");
    console.log(`curl localhost:${port}/api/customer`);
    console.log(`curl localhost:${port}/api/restaurant`);
    console.log(`curl localhost:${port}/api/reservation`);
  });