import { Kafka } from "kafkajs";

// export const kafka = new Kafka({
//   clientId: `${process.env.KAFKA_CLIENT_ID}`,
//   brokers: [`${process.env.KAFKA_HOST}`],
// });

export const kafka = new Kafka({
  clientId: "outbox-processor",
  brokers: ["localhost:9092"],
});
