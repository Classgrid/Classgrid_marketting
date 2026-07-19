const { createClient } = require('next-sanity');

const client = createClient({
  projectId: "a4wk6kp5",
  dataset: "production",
  apiVersion: "2023-01-01",
  token: "skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M",
  useCdn: false
});

async function main() {
  const query = `*[_type == "homePage"]`;
  const homePages = await client.fetch(query);
  
  if (homePages.length > 0) {
    const home = homePages[0];
    console.log("Current Sanity Social Links:", JSON.stringify(home.footerSocialLinks, null, 2));
  } else {
    console.log("No homepage found in Sanity");
  }
}

main().catch(console.error);
