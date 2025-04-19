const hodEmail = {
  "Unit Head Office": "hod@example.com",
  "Operation & Maintenance": "naveenrathi556@gmail.com",
  "Operations, Chemistry": "hod@example.com",
  "Coal Quality Management": "hod@example.com",
  "Boiler Maintenance": "hod@example.com",
  "Turbine & Auxiliaries": "hod@example.com",
  "CHP, AHP, Bio Mass, Ash Management": "hod@example.com",
  "Electrical": "hod@example.com",
  "Control & Instrumentation": "hod@example.com",
  "Technical Services": "hod@example.com",
  "Coal Management Group": "hod@example.com",
  "Ash management": "hod@example.com",
  "LAQ": "hod@example.com",
  "Finance & Accounts": "hod@example.com",
  "HR ES CSR Medical, Town Maint": "hod@example.com",
  "Admin": "hod@example.com",
  "HR": "hod@example.com",
  "Medical": "hod@example.com",
  "Corporate HR": "hod@example.com",
  "CSR": "hod@example.com",
  "Information Technology": "hod@example.com",
  "MM&C": "hod@example.com",
  "EHS": "hod@example.com",
  " Solar, Mechanical Project, Civil, Plant Horticulture": "hod@example.com",
  "Electrical Project, TL": "hod@example.com",
  "Mines and CPP": "hod@example.com",
  "JIPT": "hod@example.com",
  "IV/1": "hod@example.com",
  "Sector 1 E": "hod@example.com",
  "IV/2-3": "hod@example.com",
  "Security": "hod@example.com",
};

// Auto-fill HOD email
document.getElementById('department').addEventListener('change', function () {
  const selectedDept = this.value;
  const hodEmailInput = document.getElementById('hodEmail');
  hodEmailInput.value = hodEmail[selectedDept] || '';
});

// Form submit
document.getElementById('requestForm').addEventListener('submit', async function (e) {
  e.preventDefault();

  const form = e.target;

  const formData = {
    name: form.name.value,
    employeeCode: form.employeeCode.value,
    designation: form.designation.value,
    email: form.email.value,
    department: form.department.value,
    item: form.item.value,
    reason: form.reason.value,
    hodEmail: form.hodEmail.value
  };

  console.log('Sending to backend:', formData);

  try {
    const res = await fetch('https://api.render.com/deploy/srv-d01i6c3uibrs73ar7s00?key=YWzF1qzh7g0', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    const result = await res.json();
    console.log('Response from backend:', result);

    document.getElementById('responseMessage').textContent = result.message || 'Request submitted successfully!';
    document.getElementById('responseMessage').style.color = 'green';
    form.reset();
    document.getElementById('hodEmail').value = ''; // Clear HOD email after reset
  } catch (err) {
    console.error('Error:', err);
    document.getElementById('responseMessage').textContent = 'Submission failed.';
    document.getElementById('responseMessage').style.color = 'red';
  }
});
