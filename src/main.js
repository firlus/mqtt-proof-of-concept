const chat = document.getElementById("chat");
const button = document.getElementById("button");
const message = document.getElementById("message");

button.onclick = () => {
  client.publish("chat", `${localStorage.nickname}: ${message.value}`);
  message.value = "";
};

// If no no nickname is set, ask user to add one

checkUsername();

// Connect to MQTT
const clientId = "mqttjs_" + Math.random().toString(16).substr(2, 8);

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

const client = mqtt.connect(
  "ws://j0627971.eu-central-1.emqx.cloud:8083/mqtt",
  options
);

client.on("connect", function () {
  console.log("connected");
  client.subscribe("chat", function (err) {
    if (!err) {
      client.publish("presence", "Hello mqtt");
    }
  });
});

client.on("error", (err) => {
  console.log("Connection error: ", err);
  client.end();
});

client.on("message", (topic, message) => {
  console.log(topic);
  chat.innerHTML = `${message}<br>${chat.innerHTML}`;
});

function checkUsername() {
  if (localStorage.getItem("nickname") == null) {
    localStorage.setItem("nickname", prompt("Enter a nickname"));
    checkUsername();
  }
}
