const API_URL = "http://localhost:3000/api/booking";
const TOKEN =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjIsInJvbGUiOiJVU0VSIiwiaWF0IjoxNzMzNDc5Njc3LCJleHAiOjE3MzQ3NzU2Nzd9.IYkWH2XSJSvIuSX6666bZzwoQ2m07gaG8B7nZWf8JHg";

const payload = {
  trainId: 2,
};

const sendBookingRequest = async (id) => {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`HTTP Error: ${response.status}`);
    }

    const data = await response.json();
    console.log(`request ${id}:`, data);
  } catch (error) {
    console.error(`request ${id} failed:`, error.message);
  }
};

const sendConcurrentRequests = async () => {
  const requests = [];
  for (let i = 1; i <= 10; i++) {
    requests.push(sendBookingRequest(i));
  }
  await Promise.all(requests);
  console.log("all requests completed");
};

sendConcurrentRequests();
