import { createReadStream } from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createClient } from '@sanity/client'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const rootDir = path.resolve(__dirname, '..')
const assetDir = path.join(__dirname, 'generated-case-study-assets')

const client = createClient({
  projectId: 'a4wk6kp5',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-05-30',
  token: 'skl5fXWCsJGBUGFDt0UAafjCrBHRvIBcvKu8AE3e9oE54n2Cvkm9uhb7qwQLCZc4xyMhNaUVY60LoGjS9Jx5Xti2vP6DhIpeRXDvn0g8MRenQB4dboyWPSZsPIhuOEekG0qHAhXfcCt1ZBjSRqNXJE0S7R2ksWpi4whznisrNhvJlg4Ajk7M',
})

const sourceUrls = {
  aishe: 'https://www.pib.gov.in/PressReleasePage.aspx?PRID=1999713',
  indiaSkills: 'https://wheebox.com/assets/pdf/ISR_Report_2026.pdf',
  shl: 'https://www.shl.com/wp-content/uploads/2020/10/national-employability-report-engineers-2019.pdf',
  azimPremji: 'https://azimpremjiuniversity.edu.in/news/2026/40-percent-of-young-graduates-in-india-unemployed-as-jobs-fail-to-keep-pace',
  microsoft: 'https://www.microsoft.com/en-us/worklab/work-trend-index/ai-at-work-is-here-now-comes-the-hard-part',
  github: 'https://github.blog/news-insights/research/research-quantifying-github-copilots-impact-on-developer-productivity-and-happiness/',
  wef: 'https://www.weforum.org/press/2025/01/future-of-jobs-report-2025-78-million-new-job-opportunities-by-2030-but-urgent-upskilling-needed-to-prepare-workforces/',
  unesco: 'https://www.unesco.org/en/articles/guidance-generative-ai-education-and-research',
  vmware: 'https://industrywired.com/digital-transformation-and-integration-of-new-technologiesa-priority-for-higher-education-institutions-vmware-education-research-reveals/',
  nep: 'https://www.education.gov.in/sites/upload_files/mhrd/files/NEP_Final_English_0.pdf',
  lmsResearch: 'https://journals.sagepub.com/doi/10.1177/23328584211069527',
}

const imageFiles = {
  hero: '01-hero-future-education.png',
  employability: '02-employability-gap.png',
  digitalMaturity: '03-digital-maturity.png',
  aiCurve: '04-ai-learning-curve.png',
  fragmentedUnified: '05-fragmented-vs-unified.png',
  statCards: '06-strategic-stat-cards.png',
  funnel: '07-student-journey-funnel.png',
  architecture: '08-unified-platform-architecture.png',
  workflows: '09-before-after-workflows.png',
  ecosystem: '10-education-ecosystem-map.png',
  timeline: '11-edtech-evolution-timeline.png',
  nepThemes: '12-nep-digital-themes.png',
  aiClassroom: '13-ai-transforming-classrooms.png',
  collaboration: '14-digital-campus-collaboration.png',
  dashboard: '15-campus-intelligence-dashboard.png',
  globalTrends: '16-global-trends-indian-scale.png',
  campus2030: '17-campus-2030-vision.png',
  nikhilAvatar: '18-founder-avatar-placeholder.png',
  swaroopAvatar: '19-backend-architect-avatar-placeholder.png',
  krushnaAvatar: '20-platform-engineer-avatar-placeholder.png',
}

let keyCounter = 0
const key = (prefix = 'k') => `${prefix}-${++keyCounter}`

function imageField(asset, alt) {
  return {
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    alt,
  }
}

function span(text, marks = []) {
  return {
    _key: key('span'),
    _type: 'span',
    text,
    marks,
  }
}

function block(style, parts) {
  const markDefs = []
  const children = parts.map((part) => {
    if (typeof part === 'string') {
      return span(part)
    }

    const markKey = key('link')
    markDefs.push({
      _key: markKey,
      _type: 'link',
      href: part.href,
    })
    return span(part.text, [markKey])
  })

  return {
    _key: key('block'),
    _type: 'block',
    style,
    markDefs,
    children,
  }
}

const p = (parts) => block('normal', parts)
const h2 = (text) => block('h2', [text])
const h3 = (text) => block('h3', [text])
const link = (text, href) => ({ text, href })

function table(rows) {
  return {
    _key: key('table'),
    _type: 'table',
    rows: rows.map((cells) => ({
      _key: key('row'),
      _type: 'tableRow',
      cells,
    })),
  }
}

function divider(style = 'Faded') {
  return {
    _key: key('divider'),
    _type: 'divider',
    style,
  }
}

function bodyImage(asset, caption, layout = 'left') {
  return {
    _key: key('image'),
    _type: 'image',
    asset: { _type: 'reference', _ref: asset._id },
    caption,
    layout,
  }
}

async function uploadImages() {
  const uploaded = {}

  for (const [name, fileName] of Object.entries(imageFiles)) {
    const filePath = path.join(assetDir, fileName)
    const existingAsset = await client.fetch(
      `*[_type == "sanity.imageAsset" && originalFilename == $fileName] | order(_createdAt desc)[0]`,
      { fileName }
    )

    if (existingAsset?._id) {
      console.log(`Reusing image: ${fileName}`)
      uploaded[name] = existingAsset
      continue
    }

    console.log(`Uploading image: ${fileName}`)
    uploaded[name] = await client.assets.upload('image', createReadStream(filePath), {
      filename: fileName,
      title: fileName.replace(/^\d+-/, '').replace(/-/g, ' ').replace(/\.png$/, ''),
    })
  }

  return uploaded
}

function buildBody(assets) {
  return [
    h2('The Scale Problem Has Become an Infrastructure Problem'),
    p([
      'As of May 31, 2026, India\'s higher-education challenge is not merely that more students need access to college. It is that institutions must coordinate learning, attendance, fees, examinations, admissions, compliance, parent communication, student support, and placement preparation at a level of volume and speed that legacy administration was never designed to carry. According to the Ministry of Education\'s ',
      link('All India Survey on Higher Education 2021-22', sourceUrls.aishe),
      ', total higher-education enrolment rose to nearly 4.33 crore, while the system included 1,168 university-level institutions, 45,473 colleges, and 12,002 standalone institutions. The same release reported 1.07 crore pass-outs in 2021-22. At that scale, the unit of reform is no longer the classroom alone; it is the institutional workflow that determines whether a student is visible, supported, assessed, and guided before it is too late.',
    ]),
    bodyImage(
      assets.digitalMaturity,
      'Digital maturity in higher education is moving from paper and spreadsheets toward unified institutional infrastructure.',
      'right'
    ),
    p([
      'For many colleges, the practical reality is still a patchwork: one team manages admissions, another manages fees, faculty track attendance separately, departments circulate notices through messaging groups, and placement preparation often begins late because student performance data is scattered. This does not mean administrators are careless. It means the operating model asks human teams to reconcile too many moving parts without a shared source of truth. The result is delay, duplication, weak visibility, and poor continuity between academic progress and employability preparation.',
    ]),

    h2('The Placement Crisis Is a Signal Failure'),
    p([
      'The employability crisis is often discussed as a student problem, but it is also an institutional intelligence problem. The ',
      link('India Skills Report 2026', sourceUrls.indiaSkills),
      ', prepared by ETS with CII, AICTE, AIU, and Taggd, placed India\'s overall employability at 56.35 percent. Engineering looked stronger than the national average, with B.E./B.Tech employability reported at 70.15 percent, but the headline still conceals a deeper issue: employers are no longer hiring degrees alone; they are hiring evidence of applied capability, communication, adaptability, and technical currency.',
    ]),
    p([
      'Older but still widely cited evidence shows why the problem became so persistent. The SHL/Aspiring Minds ',
      link('National Employability Report Engineers 2019', sourceUrls.shl),
      ' found that a large share of Indian engineers were not ready for knowledge-economy roles and that only a small fraction possessed industry-ready AI skills. In 2026, Azim Premji University\'s ',
      link('State of Working India 2026', sourceUrls.azimPremji),
      ' sharpened the warning from the labour-market side: the transition from education to employment remains difficult even as higher education expands, and young graduate unemployment remains a structural concern. These reports differ in methodology, but they point in the same direction: the gap is not just between syllabus and industry; it is between institutional visibility and student readiness.',
    ]),
    table([
      ['Signal', 'What the evidence shows', 'Institutional implication'],
      ['Scale', 'AISHE reports 4.33 crore higher-education enrolments and 1.07 crore pass-outs in 2021-22', 'Manual tracking cannot reliably identify risk, readiness, or missed support at national or institutional scale'],
      ['Employability', 'India Skills Report 2026 reports 56.35 percent overall employability', 'Colleges need continuous readiness data, not only end-semester marks'],
      ['Graduate transition', 'State of Working India 2026 highlights the difficult pathway from learning to earning', 'Placement preparation must start earlier and connect academic, skill, and communication signals'],
      ['AI disruption', 'WEF and Microsoft data show rapid shifts in workplace skill demand and AI use', 'Institutions must teach students how to work with AI, not merely warn them about it'],
    ]),

    h2('AI Has Changed What Prepared Means'),
    p([
      'AI has compressed the distance between classroom learning and workplace expectation. The Microsoft and LinkedIn ',
      link('2024 Work Trend Index', sourceUrls.microsoft),
      ' reported that 75 percent of global knowledge workers were already using AI at work, while 66 percent of leaders said they would not hire someone without AI skills. GitHub\'s controlled study on Copilot found that developers using the tool completed a programming task ',
      link('55 percent faster', sourceUrls.github),
      ' than those who did not. The World Economic Forum\'s ',
      link('Future of Jobs Report 2025', sourceUrls.wef),
      ' added that nearly 40 percent of skills required on the job are expected to change by 2030, with the skills gap already cited by 63 percent of employers as a major barrier to transformation.',
    ]),
    p([
      'For education, this does not mean every institution must become a software company. It means rote learning, isolated coding assignments, and end-of-term marks are no longer enough evidence of readiness. Students need project work, problem-solving, AI literacy, communication practice, and feedback loops that help them understand where they stand before placement season. Faculty need tools that surface learning gaps early. Administrators need dashboards that translate academic activity into readiness signals. UNESCO\'s ',
      link('guidance on generative AI in education and research', sourceUrls.unesco),
      ' is useful here because it frames AI adoption as a human-centred governance challenge, not a race to automate everything.',
    ]),

    h2('The ERP/LMS Gap Is More Than a Software Gap'),
    p([
      'Indian institutions have already begun investing in digital transformation, but adoption is uneven. VMware\'s India-focused ',
      link('Future of Education Survey', sourceUrls.vmware),
      ' reported that 71 percent of surveyed higher-education institutions were looking to invest in digital workspaces or remote capabilities, and 84 percent had an institution-wide strategic plan for digital adoption, while only 68 percent had allocated budget to support it. Academic research on ',
      link('digital competence in Indian higher education', sourceUrls.lmsResearch),
      ' also shows that online learning and LMS use expanded during the pandemic, but issues such as device dependence, socio-economic access, and digital capability continued to shape participation.',
    ]),
    p([
      'The deeper issue is that many products digitize one department without redesigning the institution. A fee tool may not understand attendance. An LMS may not connect to admissions. A messaging group may reach students but leave no auditable institutional memory. A spreadsheet may solve one clerk\'s immediate problem while creating a blind spot for the principal, HOD, or placement coordinator. This is why existing ERPs often fail in the Indian context: they can be expensive, complex, slow to configure, and too removed from the lived workflows of colleges that need affordability, local compliance, multilingual communication, mobile access, and rapid adoption.',
    ]),

    h2('NEP 2020 Points Toward Interoperable Digital Infrastructure'),
    p([
      'The National Education Policy 2020 anticipated this shift. It states that technology will play an important role in improving educational processes and outcomes and calls for the National Educational Technology Forum to support technology use in learning, assessment, planning, administration, and related education functions. In its chapter on online and digital education, NEP 2020 specifically argues for ',
      link('open, interoperable, evolvable public digital infrastructure', sourceUrls.nep),
      ' that can work across multiple platforms and point solutions while solving for India\'s scale, diversity, complexity, and device penetration.',
    ]),
    p([
      'That sentence matters because it moves the conversation beyond buying software. The future institution needs a connected layer where student data, academic data, financial data, attendance records, communication history, learning progress, compliance evidence, and career signals can travel responsibly across departments. The goal is not surveillance; it is continuity. A student should not become invisible because one department\'s sheet was not shared with another. A parent should not receive five conflicting messages. A principal should not wait weeks for a report that already exists in fragments across the institution.',
    ]),

    h2('The Rise of Unified Platforms'),
    p([
      'Globally, platforms such as Canvas and Blackboard helped normalize the idea that learning needs a digital environment. Enterprise ERPs normalized structured administration. Communication tools normalized real-time coordination. The next stage combines these previously separate categories into a unified campus platform: ERP for administration, LMS for learning, communication for engagement, analytics for decision-making, compliance for accountability, and AI for guided support.',
    ]),
    bodyImage(
      assets.architecture,
      'A unified platform connects departments as one operating layer rather than a chain of disconnected tools.',
      'right'
    ),
    p([
      'India needs this model, but it cannot simply import it. Indian institutions face high student volumes, fee workflows that must fit local payment habits, attendance and compliance rules that vary by board or regulator, a strong mobile-first student base, and operating teams that cannot spend years on implementation. The winning model will be practical, local, and institution-aware. It will reduce administrative load while helping students move from admission to learning, assessment, mentoring, and placement readiness with fewer invisible gaps.',
    ]),

    h2('Where Classgrid Fits'),
    p([
      'Classgrid\'s relevance comes from the fact that it was built from firsthand institutional pain points, not from a distant software brief. The student team behind the platform, including Nikhil Shinde, Swaroop Ghorpade, Krushna Gore, and other contributors, experienced the friction of disconnected campus systems directly. They did not begin with a narrow module thesis; they began with the daily reality of students, faculty, departments, and administrators trying to coordinate college life through fragmented tools.',
    ]),
    p([
      'That origin matters. A unified education platform for India must understand admissions, fees, attendance, classroom collaboration, assessments, communication, reports, compliance, AI assistance, mobile notifications, and institutional analytics as parts of one operating model. It must be powerful enough for administrators, simple enough for faculty, visible enough for students, and flexible enough for schools, colleges, engineering institutions, coaching centres, and junior colleges. Classgrid\'s mission is therefore not to add another dashboard to an already crowded ecosystem. It is to help institutions replace operational fragmentation with a coherent digital foundation.',
    ]),

    h2('What the 2030 Campus Operating Model Looks Like'),
    p([
      'The 2030-ready institution will treat every major workflow as part of one student journey. Admission will not end when a form is submitted; it will become the first record in a living academic profile. Attendance will not be an isolated compliance ritual; it will become an early-warning signal. Fees will not be a separate ledger; they will connect to communication, student services, and institutional planning. Learning will not stop inside the LMS; it will connect to assessment, mentoring, project evidence, and placement readiness. Communication will not disappear into private chats; it will become accountable, searchable, and role-aware.',
    ]),
    table([
      ['Legacy workflow', 'Unified-platform workflow'],
      ['Admission records sit in one department', 'Student profiles begin at admission and follow the learner across the institution'],
      ['Attendance is collected for compliance', 'Attendance becomes an early indicator for support, mentoring, and parent communication'],
      ['Learning activity stays inside classroom notes', 'LMS activity connects to progress, assessments, and skill-readiness evidence'],
      ['Fee reminders happen manually', 'Payment status, reminders, receipts, and escalation operate from a shared institutional record'],
      ['Placement starts late', 'Readiness signals are built from projects, attendance, assessments, communication, and mentoring history'],
      ['Reports are compiled at the end', 'Leadership sees live operational intelligence across departments'],
    ]),
    divider('Faded'),
    h3('Closing Perspective'),
    p([
      'The future of education technology in India is not a question of whether institutions will digitize. They already are. The real question is whether digitization will remain fragmented or become institutional infrastructure. The evidence is clear: scale is rising, employability expectations are changing, AI is rewriting workplace readiness, and national policy is pushing toward interoperable digital capacity. Institutions that unify ERP, LMS, communication, analytics, and student-readiness workflows will be better positioned to serve students with speed, clarity, and accountability.',
    ]),
  ]
}

async function run() {
  const assets = await uploadImages()
  const slug = 'future-education-infrastructure-india-unified-platforms'

  const doc = {
    _id: `caseStudy-${slug}`,
    _type: 'caseStudy',
    title: 'The Future of Education Infrastructure: Why Indian Institutions Need Unified Digital Platforms',
    slug: { _type: 'slug', current: slug },
    clientName: 'Indian Higher Education Sector',
    year: 'May 31, 2026',
    institutionType: 'engineering',
    category: 'automation',
    modules: ['reports', 'communication', 'compliance'],
    summary:
      'A research-backed case study on why Indian institutions need unified ERP, LMS, communication, analytics, and AI-ready digital infrastructure to improve visibility, readiness, and institutional continuity.',
    heroImage: imageField(assets.hero, 'Unified future education infrastructure across a connected Indian campus'),
    metrics: [
      { _key: 'metric-aishe-enrolment', value: '4.33', suffix: 'cr', label: 'HE Enrolment' },
      { _key: 'metric-employability', value: '56.35', suffix: '%', label: 'Employable' },
      { _key: 'metric-skills-change', value: '39', suffix: '%', label: 'Skills Shift' },
    ],
    championName: 'Nikhil Shinde',
    championRole: 'Founder & Lead Developer',
    championHeadshot: imageField(assets.nikhilAvatar, 'Non-identifying founder avatar placeholder'),
    championQuote:
      'The institutions we know do not lack intent; they lack one connected operating layer. Classgrid was built to turn scattered campus work into visible, timely, student-centred action.',
    championSocialLink: 'https://www.linkedin.com/search/results/people/?keywords=Nikhil%20Shinde%20Classgrid',
    overview:
      'India now educates at a scale where disconnected administrative tools create strategic risk. This case study connects employability data, AI disruption, NEP 2020, and the ERP/LMS gap to show why the future belongs to unified education infrastructure built for Indian institutions.',
    overviewDivider: true,
    conclusion:
      'The future of education technology in India is not a question of whether institutions will digitize; it is whether digitization will become unified infrastructure. Classgrid is positioned for that shift because it was born from the lived operating pain of Indian institutions and built to connect the workflows that shape student outcomes.',
    champions: [
      {
        _key: 'champion-nikhil-shinde',
        name: 'Nikhil Shinde',
        role: 'Founder & Lead Developer',
        headshot: imageField(assets.nikhilAvatar, 'Non-identifying founder avatar placeholder'),
        socialLink: 'https://www.linkedin.com/search/results/people/?keywords=Nikhil%20Shinde%20Classgrid',
      },
      {
        _key: 'champion-swaroop-ghorpade',
        name: 'Swaroop Ghorpade',
        role: 'Co-Founder & Backend Architect',
        headshot: imageField(assets.swaroopAvatar, 'Non-identifying backend architect avatar placeholder'),
        socialLink: 'https://www.linkedin.com/search/results/people/?keywords=Swaroop%20Ghorpade%20Classgrid',
      },
      {
        _key: 'champion-krushna-gore',
        name: 'Krushna Gore',
        role: 'Co-Founder & Platform Engineer',
        headshot: imageField(assets.krushnaAvatar, 'Non-identifying platform engineer avatar placeholder'),
        socialLink: 'https://www.linkedin.com/search/results/people/?keywords=Krushna%20Gore%20Classgrid',
      },
    ],
    body: buildBody(assets),
    galleryImages: [
      imageField(assets.hero, 'Future education infrastructure hero visual'),
      imageField(assets.employability, 'Graduate employability gap infographic'),
      imageField(assets.digitalMaturity, 'Digital maturity infographic'),
      imageField(assets.aiCurve, 'AI in learning curve visual'),
      imageField(assets.fragmentedUnified, 'Fragmented versus unified platform comparison'),
      imageField(assets.statCards, 'Strategic education transformation stat cards'),
      imageField(assets.funnel, 'Student journey funnel visual'),
      imageField(assets.architecture, 'Unified campus platform architecture'),
      imageField(assets.workflows, 'Manual versus automated workflows visual'),
      imageField(assets.ecosystem, 'Education ecosystem map'),
      imageField(assets.nepThemes, 'NEP 2020 digital themes visual'),
      imageField(assets.aiClassroom, 'AI transforming classroom visual'),
      imageField(assets.dashboard, 'Campus intelligence dashboard visual'),
      imageField(assets.globalTrends, 'Global trends Indian scale visual'),
      imageField(assets.campus2030, '2030 campus operations vision'),
    ],
  }

  console.log(`Publishing case study: ${doc.title}`)
  const result = await client.createOrReplace(doc)
  console.log(`Published case study: ${result._id}`)
  console.log(`Slug: ${slug}`)
}

run().catch((error) => {
  console.error(error)
  process.exit(1)
})
