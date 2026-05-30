const { createClient } = require('@sanity/client');
const client = createClient({ projectId: 'a4wk6kp5', dataset: 'production', useCdn: false, apiVersion: '2024-05-30' });
client.fetch('*[_type == "websiteFeedback"][0...1]').then(res => console.log(JSON.stringify(res, null, 2)));
