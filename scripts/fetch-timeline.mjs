const projectId = 'a4wk6kp5';
const dataset = 'production';
const query = encodeURIComponent('*[_type=="aboutPage"][0]{timeline,futureTimelineItem}');
const url = `https://${projectId}.api.sanity.io/v2024-01-01/data/query/${dataset}?query=${query}`;

const res = await fetch(url);
const data = await res.json();
console.log(JSON.stringify(data.result, null, 2));
