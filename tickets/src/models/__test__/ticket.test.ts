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
