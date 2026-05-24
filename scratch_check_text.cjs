const { createClient } = require('@supabase/supabase-js');
// I'll fetch the post via Sanity's API using standard fetch
async function fetchPost() {
  const query = encodeURIComponent(`*[_type == "post" && slug.current == "maharashtra-education-digital-infrastructure-2025"][0]`);
  const url = `https://a4wk6kp5.api.sanity.io/v2021-10-21/data/query/production?query=${query}`;
  const res = await fetch(url);
  const data = await res.json();
  const post = data.result;
  
  if (post.body && post.body.en) {
    console.log("BODY EN contains 'Paper Registers':", JSON.stringify(post.body.en).includes("Paper Registers"));
  }
  if (post.contentSections) {
    console.log("CONTENT SECTIONS contains 'Paper Registers':", JSON.stringify(post.contentSections).includes("Paper Registers"));
  }
}
fetchPost();
