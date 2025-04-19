const nodemailer = require('nodemailer');
require('dotenv').config({ path: './backend/.env' });

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true, // Use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false, // important for Render
  },
});

const sendFinalMailToIT = async (request) => {
  const { name, empCode, designation, department, item, reason, status } = request;

  const isApproved = status.hr === 'approved' && status.hod === 'approved';
  const finalStatus = isApproved ? 'APPROVED ✅' : 'REJECTED ❌';
  const statusColor = isApproved ? '#4CAF50' : '#f44336';

  const mailOptions = {
    from: `"IT Request System" <${process.env.EMAIL_USER}>`,
    to: 'naveenrathi556@gmail.com', // ✅ Replace with actual IT team email
    subject: `🔔 Final Request Status: ${finalStatus} | ${name} (${empCode})`,
    html: `
      <div style="font-family: 'Segoe UI', sans-serif; background: #f4f6f8; padding: 30px;">
        <div style="max-width: 600px; margin: auto; background: #fff; border-radius: 10px; padding: 25px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
          <h2 style="margin-bottom: 10px; border-bottom: 1px solid #ddd; padding-bottom: 8px;">📋 Final IT Request Update</h2>
          <p style="font-size: 16px; color: #444;">
            The request submitted by <strong>${name}</strong> has been 
            <span style="color: ${statusColor}; font-weight: bold;">${finalStatus}</span> by both HR and HOD.
          </p>

          <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
            <tr style="background: #f0f0f0;">
              <th align="left" style="padding: 10px;">👤 Name</th>
              <td style="padding: 10px;">${name}</td>
            </tr>
            <tr>
              <th align="left" style="padding: 10px;">🆔 Employee Code</th>
              <td style="padding: 10px;">${empCode}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <th align="left" style="padding: 10px;">💼 Designation</th>
              <td style="padding: 10px;">${designation}</td>
            </tr>
            <tr>
              <th align="left" style="padding: 10px;">🏢 Department</th>
              <td style="padding: 10px;">${department}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <th align="left" style="padding: 10px;">🖥️ Requested Item</th>
              <td style="padding: 10px;">${item}</td>
            </tr>
            <tr>
              <th align="left" style="padding: 10px;">📝 Reason</th>
              <td style="padding: 10px;">${reason}</td>
            </tr>
            <tr style="background: #f0f0f0;">
              <th align="left" style="padding: 10px;">📌 Final Status</th>
              <td style="padding: 10px; color: ${statusColor}; font-weight: bold;">${finalStatus}</td>
            </tr>
          </table>

          <p style="margin-top: 25px; font-size: 15px; color: #555;">
            👉 Please proceed with the necessary action from the IT department.
          </p>

          <p style="margin-top: 30px; font-size: 13px; color: #888;">— IT Request System</p>
        </div>
      </div>
    `,
  };

  await transporter.sendMail(mailOptions);
};

module.exports = sendFinalMailToIT;
