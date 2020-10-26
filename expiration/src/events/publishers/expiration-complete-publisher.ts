import {
  Publisher,
  Subjects,
  ExpirationCompleteEvent,
} from "@mcticketing/common";

export class ExpirationCompletePublisher extends Publisher<
  ExpirationCompleteEvent
> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
