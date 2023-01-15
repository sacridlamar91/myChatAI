import  express  from 'express';   //
import * as dotenv from  'dotenv'; //allows to get data from env file
import cors from 'cors';   //allows cors origin requests
import { Configuration, OpenAIApi } from 'openai'; //

dotenv.config();   //Enables use of dotenv var


const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
}); 

//instance of openai
const openai = new OpenAIApi(configuration);

const app = express(); //Init express apk
app.use(cors());   //sets up middlewares for cors origin requests & allow server to be called from the front end
app.use(express.json());  //passes json from front end to backend


/*A dumy route route that's in asynchronous fn 
That accepts requests and response
*/
app.get('/', async (req, res) => {
    res.status(200).send({
        message: 'Hello from Codex',
    })
})

/* app.get()  route doesn't allow you to recieve alot of data from front-end
while app.post() allows a body or payload */
app.post('/', async (req, res) => {
    try {
        const prompt = req.body.prompt;

        //a fn that acepts an obj
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: `${prompt}`,  //Passes sfrom front end
            temperature: 0, // model takes more risks with high temperature set to (0) for ai to answer with what it knows
            max_tokens: 3000,  //It can give pretty long responses
            top_p: 1,
            frequency_penalty: 0.5,   //It can't repeat similar sentences often
            presence_penalty: 0,
        });

        //Once response is got this sends it back to the front-end
        res.status(200).send({
            bot: response.data.choices[0].text
        })
    } catch (error) {
        console.log(error);
        res.status(500).send({ error })  //shows error so we know what happened
    }
})


//Makes sure our server always listens for your requests
app.listen(5000, () => console.log('Server is running on port http://localhost:5000')); // enables clicking from within terminal