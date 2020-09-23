export enum OrderStatus {
  // When the order has been created, but the ticket is trying to order has not been reserved
  Created = "created",

  //The ticket the order is trying to reserver has already
  // been reserved, or when the user has cancelled the order
  // The order expires before payment.
  Canceled = "canceled",

  //The order has successfully the ticket
  AwingPayment = "awaiting:payment",

  //The order has reserved the ticket and the user has provided payment successfully
  Complete = "complete",
}
