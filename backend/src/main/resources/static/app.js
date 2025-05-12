let stompClient = null;
let sender = null;
const jummahId = "95f17a16-efec-426e-9153-df9d1b7e957b";
const bearerToken = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJ0ZXN0QGV4YW1wbGUuY29tIiwiaWF0IjoxNzQ3MDEyMDMwLCJleHAiOjE3NDcwOTg0MzB9.nSD4-hGHaz4BK5KYw2owYUi2gWepeZcjNJA7uBN6U54";

async function enterChat() {
    sender = document.getElementById("username").value.trim();

    if (!sender) {
        alert("Please enter your name.");
        return;
    }

    document.getElementById("setup-container").style.display = "none";
    document.getElementById("chat-modal").classList.add("active");
    document.getElementById("roomTitle").textContent = `Jummah Chat`;

    await loadHistory();
    connect();
}

function leaveChat() {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: `/app/jummah/${jummahId}`,
            body: JSON.stringify({
                sender: sender,
                type: "LEAVE"
            })
        });

        stompClient.deactivate();
    }

    document.getElementById("chat-modal").classList.remove("active");
    document.getElementById("setup-container").style.display = "block";

    document.getElementById("chat").innerHTML = "";
    document.getElementById("message").value = "";
}

async function loadHistory() {
    const res = await fetch(`/api/chat/jummah/${jummahId}/history`, {
        headers: {
            Authorization: `Bearer ${bearerToken}`
        }
    });
    const messages = await res.json();
    messages.reverse().forEach(msg => showMessage(JSON.stringify(msg)));
}

function connect() {
    const socket = new SockJS('/ws');
    stompClient = new StompJs.Client({
        webSocketFactory: () => socket,
        reconnectDelay: 5000,
        connectHeaders: {
            Authorization: `Bearer ${bearerToken}`
        }
    });

    stompClient.onConnect = () => {
        stompClient.subscribe(`/topic/jummah/${jummahId}`, (message) => {
            showMessage(message.body);
        });

        stompClient.publish({
            destination: `/app/jummah/${jummahId}`,
            body: JSON.stringify({
                sender: sender,
                type: "JOIN"
            })
        });
    };

    stompClient.activate();
}

function sendMessage() {
    const msg = document.getElementById("message").value;
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: `/app/jummah/${jummahId}`,
            body: JSON.stringify({
                sender: sender,
                message: msg,
                type: "CHAT"
            })
        });
        document.getElementById("message").value = "";
    }
}

function showMessage(msgJson) {
    const msg = JSON.parse(msgJson);
    let content = "";

    switch (msg.type) {
        case "JOIN":
            content = `${msg.sender} joined the chat.`;
            break;
        case "LEAVE":
            content = `${msg.sender} left the chat.`;
            break;
        case "CHAT":
            content = `${msg.sender}: ${msg.message}`;
            break;
        default:
            content = "[Unknown message type]";
    }

    const chat = document.getElementById("chat");
    const div = document.createElement("div");
    div.className = "chat-message";
    div.textContent = content;
    chat.appendChild(div);
}

window.addEventListener("beforeunload", () => {
    if (stompClient && stompClient.connected) {
        stompClient.publish({
            destination: `/app/jummah/${jummahId}`,
            body: JSON.stringify({
                sender: sender,
                type: "LEAVE"
            })
        });
    }
});
