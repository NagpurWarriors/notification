const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(bodyParser.json());

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

// Endpoint to send notification
app.post('/sendNotification', async (req, res) => {
  const { fcmToken, title, body } = req.body;

  if (!fcmToken || !title || !body) {
    return res.status(400).json({ error: 'Missing fields in request' });
  }

  try {
    const message = {
      token: fcmToken,
      notification: {
        title: title,
        body: body,
      },
      data: {
        click_action: 'FLUTTER_NOTIFICATION_CLICK',
      },
    };

    const response = await admin.messaging().send(message);
    res.status(200).json({ message: 'Notification sent', response });
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).json({ error: error.message });
  }
});

// Server listen
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
