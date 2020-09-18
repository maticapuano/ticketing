import nats, { Stan } from "node-nats-streaming";

class NatsWrapper {
  private client?: Stan;

  get getClient() {
    if (!this.client) {
      throw new Error("Canot access NATS client. before connecting");
    }
    return this.client;
  }

  public connect(clusterId: string, clientId: string, url: string) {
    this.client = nats.connect(clusterId, clientId, { url });

    return new Promise((resolve, reject) => {
      this.client!.on("connect", () => {
        console.log("Connected to Nats.");
        resolve();
      });

      this.client!.on("error", (err) => {
        reject(err);
      });
    });
  }
}

export const natsWrapper = new NatsWrapper();
