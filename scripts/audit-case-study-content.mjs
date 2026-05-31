import { createClient } from '@sanity/client';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local', quiet: true });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2026-03-30',
  useCdn: false,
  token: process.env.SANITY_API_WRITE_TOKEN || process.env.SANITY_API_TOKEN,
});

try {
  const caseStudies = await client.fetch(`*[_type == "caseStudy"] | order(_createdAt desc){
    _id,
    title,
    "slug": slug.current,
    clientName,
    year,
    institutionType,
    category,
    summary,
    championName,
    championRole,
    championQuote,
    champions[]{name, role},
    body[]{
      _type,
      _type == "block" => {
        style,
        "text": children[].text
      },
      _type == "inlineImage" => {
        caption,
        layout
      },
      _type == "video" => {
        caption,
        url,
        layout,
        speakerName,
        speakerRole
      },
      _type == "table" => {
        "cells": rows[].cells[]
      }
    }
  }`);

  console.log(JSON.stringify(caseStudies, null, 2));
} catch (error) {
  console.error(`Sanity audit failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  process.exit(1);
}
