import { createClient } from "next-sanity";
const c = createClient({ projectId: "a4wk6kp5", dataset: "production", apiVersion: "2026-04-20", useCdn: false });
const data = await c.fetch('*[_type == "helpArticle"][0...3]{title, "slug": slug.current}');
console.log(JSON.stringify(data, null, 2));
