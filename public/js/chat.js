window.addEventListener('load', () => {
   // your page initialization code here
   // the DOM will be available here
    let socket;
    const $loginForm = document.getElementById('loginForm');
    const $nameInput = document.getElementById('nameInput');
  	const $messageInput = document.getElementById('messageInput');
    const $messageForm = document.getElementById('messageForm')
    const $messagesContainer = document.getElementById('messagesContainer')


    // when user write nickname and submit login 
    $loginForm.addEventListener('submit', (event) => {
      event.preventDefault()
      const name = $nameInput.value
      login(name)
    })

    // Login function 
    function login(name){
      socket = io()
      socket.emit('login', name)

      socket.on('message', (data) => {
        if (data.from != name) {
          say(data.from, data.message)
        } else{
          say('me ', data.message)
        }
      })
      $loginForm.remove()
      $messageForm.classList.remove('hidden');
    }

    $messageForm.addEventListener('submit', (event) => {
    	event.preventDefault()
        let message = $messageInput.value
        $messageInput.value = ""
        // Send
        socket.emit('message', message)

    })

    // Send message
    function say(name, message) {
        $messagesContainer.innerHTML +=
        `<div class="chat-message">
            <span style="color: blue; font-weight: bold;">${name}:</span> ${message}
        </div>`
        // Scroll down to last message
        $messagesContainer.scrollTop = $messagesContainer.scrollHeight
    }

});