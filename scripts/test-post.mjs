fetch('http://127.0.0.1:3000/api/blog/subscribe', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ email: 'nikhilsubsun321@gmail.com', name: 'Nikhil' })
}).then(async res => {
  console.log("Status:", res.status);
  console.log(await res.json());
}).catch(console.error);
