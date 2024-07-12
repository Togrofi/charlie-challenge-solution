// Establish WebSocket connection
var clientID = Math.floor(Date.now());
var ws = new WebSocket(`ws://localhost:8000/ws/${clientID}`);

// Check whether the SpeechRecognition or the webkitSpeechRecognition API is available
const recognitionSvc = window.SpeechRecognition || window.webkitSpeechRecognition;
const statusLabel = document.getElementById('statusLabel');

if (recognitionSvc) {
    // Instantiate it
    const recognition = new recognitionSvc();
    // Set properties
    recognition.continuous = true;
    recognition.lang = 'en-GB';

   // Change background color function
    function changeBackgroundColor(color) {
        document.body.style.backgroundColor = color;
    }

    // Pause recognition function
    function enterThinkingMode() {
        recognition.stop();
        console.log('Generating response.');
        changeBackgroundColor('grey');
        statusLabel.textContent = "…"
    }
    function enterListeningMode() {
        recognition.start();
        console.log('Listening for speech.');
        changeBackgroundColor('red');
        statusLabel.textContent = "●"
    }

   function enterSpeakingMode() {
        console.log('Speaking response.');
        changeBackgroundColor('blue');
        statusLabel.textContent = "🔊"
    } 
    
    function speak(response) {

        console.log(response);
    // Perform Text-to-Speech (TTS) using browser capabilities
        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(response);
            console.log("i made utteance obj");
            // Change background color when speaking
            utterance.onstart = () => {
                enterSpeakingMode();
                console.log("i datrted");
            };

            utterance.onend = () => {
                enterListeningMode();
                console.log("i spoke");
            };
            // Handle errors
            utterance.onerror = (event) => {
                console.error('Utterance error:', event.error);
            };
            window.speechSynthesis.speak(utterance);
        } else {
            console.error('Speech synthesis not supported by the browser.');
        }
    }

    // Event triggered when it gets a match
    recognition.onresult = (event) => {
        enterThinkingMode();
        changeBackgroundColor('grey');
        const latest_result = event.results[event.results.length - 1][0].transcript;
        console.log(`Recognized: ${latest_result}`);
        
        // Send recognized text to server via WebSocket
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(latest_result);
        }
    };

    // Handle messages received over WebSocket
    ws.onmessage = (event) => {
        const response = event.data;
        console.log(`Response from server: ${response}`);
        speak(response);
    };
    
    // Handle errors
    recognition.onerror = (event) => {
        console.error('Speech recognition error detected: ', event.error);
    };

    // Handle WebSocket close event
    ws.onclose = () => {
        console.log('WebSocket connection closed.');
    };

    // Stop recognition
    recognition.onend = () => {
        console.log('Speech recognition stopped.');
    };
    
    // Handle WebSocket errors
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    // Start recognition on first click anywhere
    function startRecognitionOnClick(event) {
        speak("Welcome, I am Charlie's solution to the Neuphonic technical challenge. Ask me anything!");
        // Remove the event listener after it's triggered once
        document.removeEventListener('click', startRecognitionOnClick);
    }
    
    // Add event listener to start recognition on first click
    document.addEventListener('click', startRecognitionOnClick);
} else {
    console.error('Speech recognition not supported by the browser.');
}