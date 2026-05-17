import { createClient } from "@sanity/client";
const client = createClient({
  projectId: "a4wk6kp5",
  dataset: "production",
  useCdn: false,
  apiVersion: "2024-03-01",
});
client.fetch('*[_type == "solutionPage" && slug.current == "students"][0]').then(res => console.log(JSON.stringify(res.body.en, null, 2))).catch(console.error);
