const formData = new FormData();
formData.append("name", "Quantumchem");
formData.append("email", "quantumchem25@gmail.com");
formData.append("subject", "AI Chat Escalation: Support Request");
formData.append("message", "Auto-escalated from AI Chat.");
formData.append("category", "technical");
formData.append("priority", "medium");

fetch("https://api.classgrid.in/api/support/public/tickets", {
  method: "POST",
  body: formData,
})
  .then(async (res) => {
    console.log("Status:", res.status);
    console.log("Text:", await res.text());
  })
  .catch((err) => console.error(err));
