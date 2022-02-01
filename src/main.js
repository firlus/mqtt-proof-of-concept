// Get HTML elements
const chat = document.getElementById("chat");
const button = document.getElementById("button");
const message = document.getElementById("message");

// If button is pressed, publish message and delete text from input field
button.onclick = () => {
  client.publish("chat", `${localStorage.nickname}: ${message.value}`);
  message.value = "";
};

// Ask user for username
checkUsername();

// Connect to MQTT
const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);

// MQTT options and authentification
const options = {
  keepalive: 60,
  clientId: clientId,
  protocolId: "MQTT",
  protocolVersion: 4,
  clean: true,
  reconnectPeriod: 1000,
  connectTimeout: 30 * 1000,
  username: "user",
  password: "1234",
  will: {
    topic: "WillMsg",
    payload: "Connection Closed abnormally..!",
    qos: 0,
    retain: false,
  },
};

// Connect to broker
const client = mqtt.connect(
  "wss://j0627971.eu-central-1.emqx.cloud:8084/mqtt",
  options
);

// After connection, send join message
client.on("connect", function () {
  client.subscribe("chat", function (err) {
    if (!err) {
      client.publish("chat", `${localStorage.nickname} has joined`);
    }
  });
});

// If an error occurs, log the error and kill the client
client.on("error", (err) => {
  console.log("Connection error: ", err);
  client.end();
});

// If a message arrives, add message to chat
client.on("message", (topic, message) => {
  console.log(topic);
  chat.innerHTML = `${message}<br>${chat.innerHTML}`;
});

// Ask user for username
function checkUsername() {
  if (localStorage.getItem("nickname") == null) {
    localStorage.setItem("nickname", prompt("Enter a nickname"));
    checkUsername();
  }
}
