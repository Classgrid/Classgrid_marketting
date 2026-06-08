require('dotenv').config({path:'.env.local'});
const {createClient}=require('@sanity/client');
const client=createClient({projectId:process.env.NEXT_PUBLIC_SANITY_PROJECT_ID, dataset:'production', apiVersion:'2023-05-03', useCdn:false});
client.fetch('*[_type=="aboutPage"][0]{timeline, futureTimelineItem}').then(res => console.dir(res, {depth:null}));
