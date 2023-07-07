import express,{Application,Request,Response} from 'express'
import * as amqp from 'amqplib'

const app:Application = express()
app.use(express.json());

app.get('/',(req:Request,res:Response)=>{
    res.json({__:'This is Publisher'})
})

const rabbitUrl = 'amqp://localhost:5672'
app.post('/publisher',async(req : Request , res : Response)=>{
    try {
        const {message} = req.body
        const connection = await amqp.connect(rabbitUrl)
        const channel = await connection.createChannel()

        const queue = 'hey-queue'
        await channel.assertQueue(queue)
        channel.sendToQueue(queue,Buffer.from(message))

        await channel.close()
        await connection.close()
        res.json({status:'message published'})

    } catch (error) {
        console.log('err0r--at catch',error) 
    }
})


app.listen(3000,()=>console.log('Publisher is running at 3000'))

