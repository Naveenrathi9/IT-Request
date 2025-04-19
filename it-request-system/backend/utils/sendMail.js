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

const sendRequestMail = async (requestData, requestId) => {
  const { name, empCode, designation, department, item, reason, hodEmail } = requestData;

  const links = {
    hrApprove: `${process.env.CLIENT_URL}/api/approve?id=${requestId}&type=hr&status=approved`,
    hrReject: `${process.env.CLIENT_URL}/api/approve?id=${requestId}&type=hr&status=rejected`,
    hodApprove: `${process.env.CLIENT_URL}/api/approve?id=${requestId}&type=hod&status=approved`,
    hodReject: `${process.env.CLIENT_URL}/api/approve?id=${requestId}&type=hod&status=rejected`,
  };

  const generateMailHTML = (approverType, approveLink, rejectLink) => `
  <div style="font-family: 'Segoe UI', sans-serif; background-color: #f5f7fa; padding: 40px;">
    <div style="max-width: 600px; margin: auto; background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #333333; margin-bottom: 20px;">IT Asset Request - Approval Required</h2>

      <p style="font-size: 15px; color: #444;">
        Dear ${approverType.toUpperCase()},
      </p>

      <p style="font-size: 15px; color: #444; line-height: 1.6;">
        An IT equipment request has been submitted by <strong>${requestData.name}</strong> (Employee Code: <strong>${requestData.empCode}</strong>), who is currently working as a <strong>${requestData.designation}</strong> in the <strong>${requestData.department}</strong> department.
      </p>

      <p style="font-size: 15px; color: #444; line-height: 1.6;">
        The requested item is <strong>${requestData.item}</strong>. The reason provided for this request is: <em>"${requestData.reason}"</em>.
      </p>

      <p style="font-size: 15px; color: #444; line-height: 1.6; margin-top: 25px;">
        You are requested to review and respond to this request using the options below:
      </p>

      <div style="margin: 25px 0;">
        <a href="${approveLink}" style="display: inline-block; padding: 12px 22px; background-color: #28a745; color: #ffffff; text-decoration: none; border-radius: 5px; margin-right: 12px;">✅ Approve</a>
        <a href="${rejectLink}" style="display: inline-block; padding: 12px 22px; background-color: #dc3545; color: #ffffff; text-decoration: none; border-radius: 5px;">❌ Reject</a>
      </div>

      <p style="font-size: 13px; color: #777; margin-top: 30px;">
        This is an automated message from the IT Request System. Please do not reply to this email.
      </p>
    </div>
  </div>
`;


  const hrMail = {
    from: `"IT Request System" <${process.env.EMAIL_USER}>`,
    to: 'naveenrathi556@gmail.com', // HR email
    subject: 'Approval Needed – IT Equipment Request',
    html: generateMailHTML('HR', links.hrApprove, links.hrReject),
  };

  const hodMail = {
    from: `"IT Request System" <${process.env.EMAIL_USER}>`,
    to: hodEmail,
    subject: 'Approval Needed – IT Equipment Request',
    html: generateMailHTML('HOD', links.hodApprove, links.hodReject),
  };

  await Promise.all([
    transporter.sendMail(hrMail),
    transporter.sendMail(hodMail),
  ]);
};

module.exports = sendRequestMail;
