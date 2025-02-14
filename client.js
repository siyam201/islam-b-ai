
let recognition;
let isListening = false;

if ('webkitSpeechRecognition' in window) {
    recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'bn-BD';
    
    recognition.onresult = (event) => {
        const text = event.results[0][0].transcript;
        document.getElementById('userInput').value = text;
        sendMessage();
    };
}

function toggleVoiceInput() {
    const micButton = document.getElementById('micButton');
    
    if (!recognition) {
        alert('Voice input is not supported in your browser');
        return;
    }
    
    if (isListening) {
        recognition.stop();
        micButton.classList.remove('active');
    } else {
        recognition.start();
        micButton.classList.add('active');
    }
    
    isListening = !isListening;
}

function speakText(text) {
    window.speechSynthesis.cancel();
    
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD';
    utterance.rate = 0.8;  // Slower rate for better Bangla pronunciation
    utterance.pitch = 1.1; // Slightly higher pitch for clearer Bangla
    utterance.volume = 1;
    
    // Get available voices and try to find Bangla voice
    const voices = window.speechSynthesis.getVoices();
    const banglaVoice = voices.find(voice => 
        voice.lang.includes('bn') || 
        voice.name.includes('Bengali') || 
        voice.name.includes('Bangla')
    );
    
    if (banglaVoice) {
        utterance.voice = banglaVoice;
    }
    
    utterance.onerror = (event) => {
        console.error('Speech synthesis error:', event.error);
    };
    
    setTimeout(() => {
        window.speechSynthesis.speak(utterance);
    }, 100);
}

function addMessage(text, isUser) {
    const messagesDiv = document.getElementById('chatMessages');
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    messageDiv.textContent = text;
    messagesDiv.appendChild(messageDiv);
    messagesDiv.scrollTop = messagesDiv.scrollHeight;
}

async function sendMessage() {
    const input = document.getElementById('userInput');
    const message = input.value.trim();
    
    if (message) {
        addMessage(message, true);
        input.value = '';
        
        try {
            const response = await fetch('/chat', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ message })
            });
            
            const data = await response.json();
            addMessage(data.response, false);
            // Voice output disabled
        } catch (error) {
            addMessage('ত্রুটি: কোনো উত্তর পাওয়া যায়নি', false);
        }
    }
}

document.getElementById('userInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
