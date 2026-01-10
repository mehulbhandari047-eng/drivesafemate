
import { EmailNotification, Booking } from '../types';

class EmailService {
  private notifications: EmailNotification[] = [];
  private listeners: ((notification: EmailNotification) => void)[] = [];

  subscribe(listener: (notification: EmailNotification) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify(notification: EmailNotification) {
    this.notifications.push(notification);
    this.listeners.forEach(l => l(notification));
  }

  sendConfirmationEmail(to: string, booking: Booking) {
    const notification: EmailNotification = {
      id: Math.random().toString(36).substr(2, 9),
      to,
      subject: `Booking Confirmed: Lesson with ${booking.instructorName}`,
      body: `
        <div style="font-family: sans-serif; color: #1e293b;">
          <h2 style="color: #2563eb;">G'day! Your lesson is booked.</h2>
          <p>Hi there, your driving lesson with <strong>${booking.instructorName}</strong> has been successfully confirmed.</p>
          <div style="background: #f8fafc; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 5px 0;"><strong>Date/Time:</strong> ${booking.dateTime}</p>
            <p style="margin: 5px 0;"><strong>Location:</strong> ${booking.location}</p>
            <p style="margin: 5px 0;"><strong>Price:</strong> $${booking.price}.00 AUD</p>
          </div>
          <p>Need to change something? You can cancel or reschedule via your dashboard up to 24 hours before the lesson starts.</p>
          <p>Safe driving,<br>The DriveSafeMate Team</p>
        </div>
      `,
      timestamp: new Date().toLocaleTimeString(),
      type: 'CONFIRMATION'
    };
    this.notify(notification);
  }

  sendCancellationEmail(to: string, booking: Booking) {
    const notification: EmailNotification = {
      id: Math.random().toString(36).substr(2, 9),
      to,
      subject: `Booking Cancelled: Lesson with ${booking.instructorName}`,
      body: `
        <div style="font-family: sans-serif; color: #1e293b;">
          <h2 style="color: #ef4444;">Lesson Cancelled</h2>
          <p>Your lesson scheduled for <strong>${booking.dateTime}</strong> with <strong>${booking.instructorName}</strong> has been cancelled.</p>
          <p>If you were eligible for a refund, it will appear in your account within 3-5 business days. We hope to see you back on the road soon!</p>
          <p>Best regards,<br>The DriveSafeMate Team</p>
        </div>
      `,
      timestamp: new Date().toLocaleTimeString(),
      type: 'CANCELLATION'
    };
    this.notify(notification);
  }

  sendReminderEmail(to: string, booking: Booking) {
    const notification: EmailNotification = {
      id: Math.random().toString(36).substr(2, 9),
      to,
      subject: `Reminder: Driving Lesson Tomorrow!`,
      body: `
        <div style="font-family: sans-serif; color: #1e293b;">
          <h2 style="color: #2563eb;">Ready for your lesson?</h2>
          <p>Don't forget your lesson with <strong>${booking.instructorName}</strong> is coming up tomorrow.</p>
          <p style="padding: 10px; border-left: 4px solid #2563eb; background: #eff6ff;">
            <strong>When:</strong> ${booking.dateTime}<br>
            <strong>Where:</strong> ${booking.location}
          </p>
          <p>Please ensure you have your learner's licence and logbook ready.</p>
          <p>See you there!</p>
        </div>
      `,
      timestamp: new Date().toLocaleTimeString(),
      type: 'REMINDER'
    };
    this.notify(notification);
  }
}

export const emailService = new EmailService();
