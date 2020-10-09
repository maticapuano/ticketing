import { Ticket } from "../Ticket";

it("Implements optimist concurrency control", async (done) => {
  const ticket = Ticket.build({
    title: "Concert",
    price: 5,
    userId: "122100",
  });

  //Save a ticket
  await ticket.save();

  //Fetch the ticket twice
  const firstInstance = await Ticket.findById(ticket.id);
  const secondInstance = await Ticket.findById(ticket.id);

  //Make two separate changes to the tickets we fetches
  firstInstance?.set({ price: 10 });
  secondInstance?.set({ price: 15 });

  //Save the first fetched ticket
  await firstInstance?.save();

  //Save the second
  try {
    await secondInstance?.save();
  } catch {
    return done();
  }

  throw new Error("Should not reach this point.");
});

it("Increments the version number on multiple saves.", async () => {
  const ticket = Ticket.build({
    title: "concert",
    price: 20,
    userId: "123",
  });

  //Save ticket
  await ticket.save();

  expect(ticket.version).toEqual(0);

  //Update ticket
  ticket.price = 25;
  await ticket.save();

  expect(ticket.version).toEqual(1);

  //Update two
  ticket.title = "Concert Miami 👌";
  ticket.price = 250.99;

  await ticket.save();

  //Expected the version is two
  expect(ticket.version).toEqual(2);

  expect(ticket.version).not.toEqual(3);
});
