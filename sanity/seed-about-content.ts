import { createClient } from "@sanity/client";

async function seed() {
  const { getCliClient } = require('sanity/cli');
  const client = getCliClient();

  const whatIsClassgrid = [
    {
      _type: 'block',
      _key: 'b1',
      style: 'normal',
      children: [{ _type: 'span', _key: 's1', text: 'ClassGrid is a complete management software (ERP) for schools, junior colleges, and coaching centers. Instead of using paper, ClassGrid puts your entire institution on one easy website and mobile app. We offer many powerful modules to handle everything from student attendance and fees to exams, parent messages, and managing staff hierarchy across different branches.' }]
    }
  ];

  const whatWeDo = [
    {
      _type: 'block',
      _key: 'b2',
      style: 'normal',
      children: [{ _type: 'span', _key: 's2', text: 'We make running a school, coaching center, or junior college very easy. Our software and mobile apps automatically do the hard work for you. We collect fees online, track who came to class, send instant messages to parents, and create beautiful report cards. If you have multiple branches, our smart hierarchy system lets you manage them all from a single dashboard.' }]
    }
  ];

  const whyChooseClassgrid = [
    {
      _type: 'block',
      _key: 'b3',
      style: 'normal',
      children: [{ _type: 'span', _key: 's3', text: 'Most educational software is old, slow, and hard to use. ClassGrid is different. It is super fast, has dedicated mobile apps for parents and teachers, and is as easy to use as your favorite social media app. Whether you run a single coaching center, a junior college, or a massive network of 25 branches, ClassGrid works perfectly for you and keeps all your data safe.' }]
    }
  ];

  console.log("Updating About Page document in Sanity...");
  try {
    const res = await client.patch('aboutPage')
      .set({
        whatIsClassgrid,
        whatWeDo,
        whyChooseClassgrid
      })
      .commit();
    console.log("Successfully updated About Page content!");
  } catch (error) {
    console.error("Failed to update document:", error);
  }
}

seed().catch(console.error);
