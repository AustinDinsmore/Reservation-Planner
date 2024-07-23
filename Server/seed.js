const {
    client,
    createTables,
    createCustomer,
    createRestaurant,
    fetchCustomer,
    fetchRestaurant,
    createReservation,
    fetchReservation,
    destroyReservation,
  } = require("./db.js");
  
  //function to create our database table, seed data into the tables
  const init = async () => {
    console.log("connecting to database");
    await client.connect();
    console.log("connected to database");
  
    await createTables();
    console.log("created tables");
  
    const [moe, lucy, larry, ethyl, paris, london, nyc] = await Promise.all([
      createCustomer({ name: "moe" }),
      createCustomer({ name: "lucy" }),
      createCustomer({ name: "larry" }),
      createCustomer({ name: "ethyl" }),
      createRestaurant({ name: "parrys" }),
      createRestaurant({ name: "chilis" }),
      createRestaurant({ name: "machetes" }),
    ]);
    console.log(await fetchCustomer());
    console.log(await fetchRestaurant());
  
    const [reservation, reservation2] = await Promise.all([
      createReservation({
        date: "9/9/2024",
        party_count: "4",
        customer_id: moe.id,
        restaurant_id: parrys.id,
      }),
      createReservation({
        date: "9/10/2024",
        party_count: "2",
        customer_id: lucy.id,
        restaurant_id: chilis.id,
      }),
    ]);
    console.log(await fetchReservation());
  
    await destroyReservation({ id: reservation.id, customer_id: reservation.customer_id });
    console.log(await fetchReservation());
  
    await client.end();
  };
  
  init();