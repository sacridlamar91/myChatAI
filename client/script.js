/* For Front-end of project Vite is used with node installed(To check:node -v)
Terminal:npm create vite@latest client --template vanilla (This creates a vanilla js repository
  Terminal:TYPE y then ENTER
          :HIT Vanilla To select framework asVanilla
          :HIT JavaScript as Project
          :cd .\client\
          :npm install
Imports are for importing icons from folder assets
npm run dev runs code in browser therefore click ctrl and the local link provided

  )  
*/
import bot from './assets/bot.svg' ;
import user from './assets/user.svg' ;

//Targets html elements manually using .querySelector
//Form got by tag name since its the only element with name form
const form = document.querySelector('form');
//Element got by id (see '#' in the beginning)
const chatContainer = document.querySelector('#chat_container');

//var 
let loadInterval;

//fn loader for loading messages that takes elements and returns smth('...') in this case
function loader(element) {
  //empty element at strt
  element.textContent = '';
//setInterval is an fn that allows another call back fn
  loadInterval = setInterval (() => {   
     element.textContent += '.';

    if (element.textContent === '....') {
    element.textContent = '';
    }
  }, 300)
}

//Ai's typing fn for improving UX instead of providing the entire response all at once i.e 20/letter 
//
function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    //if still typing...
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    }else {//end of text
      clearInterval(interval);
    }
  },20)
}
//Uses the respective const to generate unique ID's for the msgs using time/date,randomNumber,hexadecimal for 16char
function generateUniqueId() {
  const timestamp = Date.now();
  const randomNumber = Math.random();
  const hexadecimalString = randomNumber.toString(16);

  return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe (isAi, value, uniqueId) {
  return (
    `
     <div class = "wrapper ${isAi && 'ai'}">
       <div class="chat">
         <div class="profile">
           <img
             src = "${isAi ? bot : user}"  
             alt ="${isAi ? 'bot' : 'user'}" 
           />
        </div>
        <div class="message" id=${uniqueId}>${value}</div>
       </div>
    </div>
    `

  )
}

//Prevents the default behaviour of browser reloading age on submits
const handleSubmit = async (e) => {
  e.preventDefault();

//Getting the element data
const data = new FormData(form);


//Gen User's chat stripe
chatContainer.innerHTML += chatStripe(false, data.get('prompt'));

//Clear text area input
form.reset();

//bot's chatstripe
const uniqueId = generateUniqueId();
chatContainer.innerHTML += chatStripe(true, " ", uniqueId );


chatContainer.scrollTop = chatContainer.scrollHeight; // puts new msg in view

const messageDiv = document.getElementById(uniqueId);   //fetches newly created div

loader(messageDiv);
// fetch data from the server

const response = await fetch('http://localhost:5000', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    prompt: data.get('prompt')
  })
})

clearInterval(loadInterval);
messageDiv.innerHTML = '';
  if(response.ok) {
    const data = await response.json();  //gives response coming from backend
    const parsedData = data.bot.trim();   //parses data

    typeText(messageDiv, parsedData);   //parses to type text fn made b4
   }else {
    const err = await response.text();

    messageDiv.innerHTML = "something went wrong";

    alert(err);
   }
}

//To See changes in handle submit
form.addEventListener('submit', handleSubmit);
form.addEventListener('keyup', (e) => {
  if (e.keyCode === 13) {
    handleSubmit(e);
  }
})
