// Write chatr code here!

//====FETCH API======>

//GET /messages -> a JSON ARRAY OF MESSAGES
//POST /messages -> A confirmation (creates a message)
//PATCH /messages/:id -> A confirmation (edit message)
//DELETE /messages/:id -> A confirmation (deletes a message)

//GET request
//Calling "fetch" with a URL as its only argument, it will makes
//a GET request to that URL.  It is Asynchronous and returns a promise

fetch("http://localhost:3434/messages")
//fetch returns an object that represents the HTTP response
//you can use the async methods .text() or .json() on the response
//to parse its body.  Make sure to return it from the callback
.then(response => response.json())
// .then(data => console.table(data))
.then(console.table)

//list of messages
// const loadMessages = () => {
//     fetch("/messages")
//     .then(res => res.json())
//     .then(messages => {
//         const messagesContainer = document.querySelector("#messages");
//         let messagesHTML = "";
//         messages.forEach(message => {
//             messagesHTML += `
//             <li>
//                 ${message.body}
//                 <i data-id={message.id} class="delete-link">x</i>
//             </li>
//             `;
//         })
//         messagesContainer.innerHTML = messagesHTML
//     })
// }

// //refresh list intermittently
// const refreshIntervalMsg = 3000;
// document.addEventListener("DOMContentLoaded", () => {
//     loadMessages();
//     setInterval(loadMessages, refreshIntervalMsg)
// })

//POST AJAJ req ro create hard code messages
// const fd = new FormData();
// fd.set("body", "Hello World")
// fetch("/messages", {
//     method: "POST",
//     body: fd
// })

// fetch("/messages", {
//     method: "POST",
//     headers: { "Content-type": "application/json"},
//     body: JSON.stringify({ body: "Goodbye World"})
// })

const Message = {
    index(){
        return fetch("http://localhost:3434/messages")
        .then(response => response.json())
    },
    create(params){
        return fetch('/messages', {
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify(params)
        })
    },
    delete(id){
        return fetch(`/messages/${id}`, {
            method: "DELETE"
        })
    }
}

document.addEventListener("DOMContentLoaded", () => {
    const messagesUL = document.querySelector("#messages")
    const messageForm = document.querySelector("#new-message")
    
    const refreshMessages = () => {
        Message.index()
        .then(messages => {
            messagesUL.innerHTML = messages.map( message => {
                return `
                <li>
                    <strong>${message.id}</strong>
                    ${message.body}
                    </br>
                    <button data-id=${message.id} class="delete-button">Delete</button>
                </li>
                `;
            }).join('')
        })
    }

    setInterval(refreshMessages, 3000)

    messageForm.addEventListener('submit', event => {
        event.preventDefault();

        const { currentTarget } = event; //the form element

        //Use FormData to create an object representation
        //of key value pairs of the form that we pass as an argument
        //to the constructor
        const formData = new FormData(currentTarget)

        //formData.get returns the value associated with the given key
        //from within the FormData objetc">

        Message.create({ body: formData.get("body")})
        .then(() => {
            console.log("Message created!")
            refreshMessages()
            currentTarget.reset() //reset empties the form inputs
        })
    })

    messagesUL.addEventListener('click', event => {
        const { target } = event //the element that triggered the event

        if (target.matches('.delete-button')){
            Message.delete(target.dataset.id)
        .then(() => {
            refreshMessages()
            console.log(`Deleted message with id: ${target.dataset.id}`)
        })
        }
    })

})
