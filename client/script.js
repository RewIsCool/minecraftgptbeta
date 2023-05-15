import bot from './assets/minecraft-gpt.png'
import user from './assets/user.svg'

window.onload = function() {
    const key = 'clickCount';
    let clickCount = parseInt(localStorage.getItem(key)) || 0;
    console.log(clickCount)
    if (clickCount >= 20) {
    document.body.innerHTML = "<h1>You have exceeded the limit of 20 Requests per Hour.</h1>";
}
};


const form = document.querySelector('form')
const chatContainer = document.querySelector('#chat_container')

let loadInterval

function loader(element) {
    element.textContent = ''

    loadInterval = setInterval(() => {
        // Update the text content of the loading indicator
        element.textContent += '.';

        // If the loading indicator has reached three dots, reset it
        if (element.textContent === '....') {
            element.textContent = '';
        }
    }, 300);
}

function typeText(element, text) {
    let index = 0

    let interval = setInterval(() => {
        if (index < text.length) {
            element.innerHTML += text.charAt(index)
            index++
        } else {
            clearInterval(interval)
        }
    }, 20)
}

// generate unique ID for each message div of bot
// necessary for typing text effect for that specific reply
// without unique ID, typing text will work on every element
function generateUniqueId() {
    const timestamp = Date.now();
    const randomNumber = Math.random();
    const hexadecimalString = randomNumber.toString(16);

    return `id-${timestamp}-${hexadecimalString}`;
}

function chatStripe(isAi, value, uniqueId) {
    return (
        `
        <div class="wrapper ${isAi && 'ai'}">
            <div class="chat">
                <div class="profile">
                    <img 
                      src=${isAi ? bot : user} 
                      alt="${isAi ? 'bot' : 'user'}" 
                    />
                </div>
                <div class="message" id=${uniqueId}>${value}</div>
            </div>
        </div>
    `
    )
}

const handleSubmit = async (e) => {

    e.preventDefault()
    const textareaS = document.querySelector('textarea');
    if (textareaS.value.trim() === '') {
        // Show an alert
        return
    } else {
        const data = new FormData(form)

    // user's chatstripe
    chatContainer.innerHTML += chatStripe(false, data.get('prompt'))

    // to clear the textarea input 
    form.reset()

    // bot's chatstripe
    const uniqueId = generateUniqueId()
    chatContainer.innerHTML += chatStripe(true, " ", uniqueId)

    // to focus scroll to the bottom 
    chatContainer.scrollTop = chatContainer.scrollHeight;

    // specific message div 
    const messageDiv = document.getElementById(uniqueId)

    // messageDiv.innerHTML = "..."
    loader(messageDiv)

    const response = await fetch('http://localhost:5000', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            prompt: data.get('prompt')
        })
    })

    clearInterval(loadInterval)
    messageDiv.innerHTML = " "

    if (response.ok) {
        const data = await response.json();
        const parsedData = data.bot.trim() // trims any trailing spaces/'\n' 

        typeText(messageDiv, parsedData)
    } else {
        const err = await response.text()
        
        messageDiv.innerHTML = "Something went wrong"
        alert(err)
    }
    }
}

form.addEventListener('submit', handleSubmit)
form.addEventListener('keyup', (e) => {
    if (e.keyCode === 13) {
        handleSubmit(e)
    }
})

const textarea = document.querySelector('textarea');

function adjustHeight() {
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    const buttonrestartss = document.getElementById('getresponse')
    buttonrestartss.addEventListener("click", () => {
        const textarea = document.querySelector('textarea');
            textarea.style.height = '45px';
    })
}

const buttonrestartss = document.getElementById('getresponse')

textarea.addEventListener('input', adjustHeight);


const button = document.getElementById('getresponse');
button.addEventListener('click', handleClick);

function handleClick() {
    const key = 'clickCount';
    const limit = 20;
    const intervalInHours = 1;
  
    let clickCount = parseInt(localStorage.getItem(key)) || 0;
    const currentTime = new Date().getTime();
    const lastClickTime = parseInt(localStorage.getItem('lastClickTime')) || currentTime;
  
    if (currentTime - lastClickTime >= intervalInHours * 60 * 60 * 1000) {
      // Reset click count if the interval has passed
      clickCount = 0;
    }
  
    if (clickCount >= limit) {
    document.body.innerHTML = "<h1>You have exceeded the limit of 20 Requests per Hour.</h1>";
    } else {
      // Increment click count and update local storage
      clickCount++;
      localStorage.setItem(key, clickCount.toString());
      localStorage.setItem('lastClickTime', currentTime.toString());
      
      // Perform the desired action on button click here
      // ...
    }
  }


const restart = document.getElementById('restart');

restart.addEventListener('click', () => {
    location.reload();
})
  