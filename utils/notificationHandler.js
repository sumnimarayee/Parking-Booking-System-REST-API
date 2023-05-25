const FCM = require("fcm-node");

// Create a new FCM instance with your Firebase project's server key
const serverKey =
  "AAAAf-l7OZU:APA91bFbTLSduG5SXZmWmupsBs0hCeCbe-_q964aJR9pALLvc6BOGUQ26TvUdAkvieAyVrF4uTD4q1QoK8xLG55gfVh97jcja47ul__3zwfLk8Ky4P4a1QsMDzVWyamVkxWpdtRkQRL_";
const fcm = new FCM(serverKey);

// Send push notification to a user
const sendNotification = (userId, title, body) => {
  const message = {
    to: `${userId}`,
    notification: {
      title: title,
      body: body,
    },
  };
  fcm.send(message, (err, response) => {
    if (err) {
      // ignore error
    }
  });
};

module.exports = { sendNotification };
