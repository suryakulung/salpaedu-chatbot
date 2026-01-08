(function () {
    // Configuration
    const CONFIG = {
        // apiBaseUrl: 'http://localhost:5000/api', // Local Dev
        apiBaseUrl: 'https://salpaedu-chatbot.onrender.com/api', // Active Render Backend (Confirmed by logs)
        // apiBaseUrl: 'https://chatbot-server-v4cu.onrender.com/api', // Inactive/404
        botName: 'AI Assistant',
        primaryColor: '#007bff'
    };
    let sessionId = null;
    // Create Widget Container
    const createWidget = () => {
        const container = document.createElement('div');
        container.id = 'ai-chatbot-widget';
        // Meta tag for viewport is usually in the host page, but we can't control that easily from here.
        // We rely on the visualViewport API for the resizing logic.

        container.innerHTML = `
            <div id="chatbot-icon">
                <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round" stroke-linejoin="round" class="css-i6dzq1"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
            </div>
            <div id="chatbot-window" class="hidden">
                <div class="chatbot-header">
                    <span>${CONFIG.botName}</span>
                    <button id="chatbot-close">&times;</button>
                </div>
                <div class="chatbot-messages" id="chatbot-messages">
                    <div class="message bot">
                        Hello! How can I help you today?
                    </div>
                </div>
                <div class="chatbot-input">
                    <input type="text" id="chatbot-text-input" placeholder="Type a message...">
                    <button id="chatbot-send-btn">➤</button>
                </div>
            </div>
        `;
        document.body.appendChild(container);

        // Event Listeners
        document.getElementById('chatbot-icon').addEventListener('click', toggleChat);
        document.getElementById('chatbot-close').addEventListener('click', toggleChat);
        document.getElementById('chatbot-send-btn').addEventListener('click', sendMessage);
        document.getElementById('chatbot-text-input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') sendMessage();
        });
    };

    const toggleChat = () => {
        const chatWindow = document.getElementById('chatbot-window');
        const icon = document.getElementById('chatbot-icon');
        chatWindow.classList.toggle('hidden');

        const isMobile = window.matchMedia("(max-width: 768px)").matches;

        if (!chatWindow.classList.contains('hidden')) {
            // Chat Opened
            if (isMobile) {
                // Hide icon
                icon.style.display = 'none';

                // Initialize Visual Viewport handling for mobile
                if (window.visualViewport) {
                    window.visualViewport.addEventListener('resize', handleViewportResize);
                    window.visualViewport.addEventListener('scroll', handleViewportResize);
                    // Trigger once to set initial size
                    handleViewportResize();
                }
                document.body.style.overflow = 'hidden'; // Prevent background scrolling
            }
        } else {
            // Chat Closed
            icon.style.display = 'flex';

            if (isMobile || window.visualViewport) {
                if (window.visualViewport) {
                    window.visualViewport.removeEventListener('resize', handleViewportResize);
                    window.visualViewport.removeEventListener('scroll', handleViewportResize);
                }

                // Reset styles
                chatWindow.style.height = '';
                chatWindow.style.top = '';
                document.body.style.overflow = '';

                // Restore icon position if it was moved
                icon.style.bottom = '20px';
            }
        }
    };

    // Handle Visual Viewport Resize (Core Keyboard Logic)
    const handleViewportResize = () => {
        const chatWindow = document.getElementById('chatbot-window');
        if (!chatWindow || chatWindow.classList.contains('hidden')) return;

        const viewport = window.visualViewport;

        if (viewport) {
            // Set height to the visible visual viewport height
            chatWindow.style.height = `${viewport.height}px`;

            // Set top to offsetTop to ensuring it stays in view even if layout viewport is scrolled
            // This fixes the "gap" or "floating" issues by pinning it to the current visible screen
            chatWindow.style.top = `${viewport.offsetTop}px`;

            // Ensure left/width are also aligned (usually 0 and width)
            chatWindow.style.left = `${viewport.pageLeft}px`;
            chatWindow.style.width = `${viewport.width}px`;
        }

        // Scroll messages to bottom to keep context
        const messagesDiv = document.getElementById('chatbot-messages');
        if (messagesDiv) messagesDiv.scrollTop = messagesDiv.scrollHeight;
    };

    const sendMessage = async () => {
        const input = document.getElementById('chatbot-text-input');
        const message = input.value.trim();
        if (!message) return;

        // Hide keyboard on mobile by blurring input
        if (window.innerWidth <= 768) {
            input.blur();
        }

        addMessage(message, 'user');
        input.value = '';

        // Typing indicator
        const typingId = addMessage('...', 'bot');

        try {
            const response = await fetch(`${CONFIG.apiBaseUrl}/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message })
            });
            const data = await response.json();

            // Remove typing indicator
            const typingElement = document.getElementById(typingId);
            if (typingElement) typingElement.remove();

            addMessage(data.reply || "Sorry, I couldn't understand that.", 'bot');
        } catch (error) {
            console.error('Chat Error:', error);
            // Remove typing indicator
            const typingElement = document.getElementById(typingId);
            if (typingElement) typingElement.remove();

            addMessage(`Error connecting to server: ${error.message}. Ensure server is running on port 5000.`, 'bot');
        }
    };

    const addMessage = (text, sender) => {
        const messagesDiv = document.getElementById('chatbot-messages');
        const msgDiv = document.createElement('div');
        const id = 'msg-' + Date.now();
        msgDiv.id = id;
        msgDiv.className = `message ${sender}`;
        msgDiv.innerText = text;
        messagesDiv.appendChild(msgDiv);
        messagesDiv.scrollTop = messagesDiv.scrollHeight;
        return id;
    };

    // Initialize
    window.addEventListener('load', createWidget);
})();
