// backend/controllers/requestController.js
const Request = require('../models/Request');
const sendRequestMail = require('../utils/sendMail');
const sendFinalMailToIT = require('../utils/sendFinalMail');

const submitRequest = async (req, res) => {
  try {
    const { hodEmail, ...restData } = req.body;

    const newRequest = new Request({ ...restData, hodEmail }); // store HOD email
    await newRequest.save();

    await sendRequestMail({ ...restData, hodEmail }, newRequest._id); // pass to mail function

    res.status(200).json({ message: 'Request submitted ' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Request submission failed' });
  }
};

const handleApproval = async (req, res) => {
  const { id, type, status } = req.query;

  if (!['hr', 'hod', 'it'].includes(type) || !['approved', 'rejected'].includes(status)) {
    return res.status(400).send('Invalid approval parameters');
  }

  try {
    const request = await Request.findById(id);

    if (!request) {
      return res.status(404).send('Request not found');
    }

    request.status[type] = status;
    await request.save();

    // Send final mail to IT if both HR and HOD responded
    if (
      (request.status.hr === 'approved' || request.status.hr === 'rejected') &&
      (request.status.hod === 'approved' || request.status.hod === 'rejected')
    ) {
      await sendFinalMailToIT(request);
    }

    // Styled success page
    res.send(`
      <div style="font-family: 'Segoe UI', sans-serif; background-color: #f4f6f8; min-height: 100vh; display: flex; align-items: center; justify-content: center;">
        <div style="background-color: #ffffff; border: 1px solid #e0e0e0; padding: 40px; border-radius: 12px; text-align: center; max-width: 500px; box-shadow: 0 5px 20px rgba(0,0,0,0.1);">
          <div style="font-size: 50px; margin-bottom: 15px;">
            ${status === 'approved' ? '✅' : '❌'}
          </div>
          <h2 style="color: ${status === 'approved' ? '#28a745' : '#dc3545'}; margin-bottom: 15px; font-size: 24px; font-weight: 600;">
            Request ${status === 'approved' ? 'Approved' : 'Rejected'}
          </h2>
          <p style="font-size: 16px; color: #555;">
            <strong>${type.toUpperCase()}</strong> has 
            ${status === 'approved' ? 'approved' : 'rejected'} the request.
          </p>
          
          <div style="margin-top: 30px;">
            <p style="font-size: 14px; color: #777;">Request ID:</p>
            <p style="font-weight: 500; color: #333; font-size: 18px;">${id}</p>
          </div>
          
          <p style="margin-top: 40px; font-size: 13px; color: #999;">
            This action has been recorded successfully.<br/>
            Thank you for your response.
          </p>
        </div>
      </div>
    `);
  
  } catch (err) {
    console.error(err);
    res.status(500).send('Something went wrong');
  }
};

module.exports = { submitRequest, handleApproval };
