const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearReadNotifications,
  clearAllNotifications,
} = require("../controllers/notificationController");

// All routes require authentication
router.use(auth);

// GET /api/notifications - Get all notifications
router.get("/", getNotifications);

// PUT /api/notifications/read-all - Mark all as read (must come before /:id routes)
router.put("/read-all", markAllAsRead);

// DELETE /api/notifications/clear-read - Clear all read notifications (must come before /:id routes)
router.delete("/clear-read", clearReadNotifications);

// DELETE /api/notifications/clear-all - Clear all notifications (must come before /:id routes)
router.delete("/clear-all", clearAllNotifications);

// PUT /api/notifications/:id/read - Mark notification as read
router.put("/:id/read", markAsRead);

// DELETE /api/notifications/:id - Delete a notification
router.delete("/:id", deleteNotification);

module.exports = router;
