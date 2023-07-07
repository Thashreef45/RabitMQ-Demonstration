import express, { Application, Request, Response } from 'express';
import * as amqp from 'amqplib';

const app: Application = express()
app.use(express.json());


// RabitMQ Consuming part
const rabbitUrl = 'amqp://localhost:5672';
let recivedMessage:string
async function consumeMessages() {
  try {
    const connection = await amqp.connect(rabbitUrl);
    const channel = await connection.createChannel();

    const queue = 'hey-queue';
    await channel.assertQueue(queue);
    channel.consume(queue, (message: any) => {
      recivedMessage = message.content.toString()
      channel.ack(message);
    });
  } catch (error) {
    console.log('error--at consumeMessages', error);
  }
}



// Routes 
app.get('/', (req: Request, res: Response) => {
  res.json({ ___: "This is Consumer" });
});

app.get('/consumer', (req: Request, res: Response) => {
  consumeMessages()
    .then(() => {
      res.json({ status: recivedMessage });
    })
    .catch((error) => {
      console.log('error--at /consumer', error);
      res.status(500).json({ error: 'Internal Server Error' });
    });
});




//Listen
app.listen(3001, () => {
  console.log('Consumer server is connected at 3001');
  consumeMessages();
});
