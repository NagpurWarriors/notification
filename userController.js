const axios = require('axios');

const handleDeleteUser = async (req, res) => {
  const { email, deviceToken } = req.body;
  const admin = req.app.locals.admin;

  if (!email || !deviceToken) {
    return res.status(400).json({ message: "Email and deviceToken are required" });
  }

  try {
    // Simulate user deletion (replace with actual logic)
    console.log(`Deleting user with email: ${email}`);

    // Example:
    // await axios.delete(`http://your-user-service/api/deleteUser`, { data: { email } });

    // Send FCM Notification
    const message = {
      token: deviceToken,
      notification: {
        title: "Account Deleted",
        body: "Your account has been successfully deleted."
      },
      data: {
        event: "account_deleted",
        email
      }
    };

    await admin.messaging().send(message);

    return res.status(200).json({ message: "User deleted and notification sent successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error deleting user or sending notification" });
  }
};

module.exports = { handleDeleteUser };
