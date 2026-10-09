// All resume content lives here. Edit this file to update the site.
// Text wrapped in **double asterisks** is highlighted on the page.

window.RESUME = {
  name: "José Pedro Azevedo",
  shortName: "José Pedro",
  title: "Senior Cyber Security Professional",
  roles: [
    "Governance, Risk & Compliance",
    "Security Architecture",
    "Cyber Security Programs",
    "Cross-functional Delivery",
  ],
  location: "Lisbon, Portugal",
  email: "silvaze.jp@gmail.com",
  linkedin: "https://www.linkedin.com/in/jos%C3%A9-pedro-azevedo/",
  cvFile: "assets/Jose_Pedro_Azevedo_CV.pdf",
  careerStart: "2012-05",

  summary: [
    "Senior Cyber Security Professional with strong experience in **Governance, Risk & Compliance**, **Security Architecture** and **cross-functional project delivery**.",
    "Proven track record in coordinating multi-stakeholder initiatives, translating regulatory and security requirements into actionable objectives, and supporting complex environments within large enterprises.",
    "Recognized for combining deep technical expertise with strategic thinking, communication, and execution focus across security programs, operations and transformation initiatives.",
  ],

  pillars: [
    {
      icon: "shield",
      title: "Governance, Risk & Compliance",
      text: "Aligning group entities with DORA, NIST and ISO 27001, from risk registers and control effectiveness to audit readiness.",
    },
    {
      icon: "layers",
      title: "Security Architecture",
      text: "Secure-by-design reviews, SIEM evolution, cloud security across AWS and Azure, and DevSecOps in the delivery pipeline.",
    },
    {
      icon: "nodes",
      title: "Cross-functional Delivery",
      text: "Turning regulatory and technical requirements into clear goals that business, engineering and vendors can act on.",
    },
  ],

  // Career phases drive the colored trajectory bar and the timeline filters.
  phases: [
    { id: "telecom", label: "Telecom Engineering", color: "var(--phase-telecom)" },
    { id: "secops", label: "Security Operations", color: "var(--phase-secops)" },
    { id: "arch", label: "Security Architecture", color: "var(--phase-arch)" },
    { id: "grc", label: "GRC", color: "var(--phase-grc)" },
  ],

  experience: [
    {
      id: "bnp",
      title: "Senior Cyber Security Analyst",
      company: "BNP Paribas",
      location: "Lisbon, Portugal",
      start: "2025-06",
      end: null,
      phase: "grc",
      bullets: [
        "Actively contribute to the **Cyber Security Program (GRC)**, supporting alignment of group entities with regulatory and security frameworks (DORA, NIST, ISO).",
        "Act as a **coordination and communication point between group-level objectives and operational teams**, ensuring clarity of scope, priorities and expectations.",
        "Support the **definition, refinement and continuous improvement of security and compliance objectives**, providing structured feedback and recommendations.",
        "Participate in **cross-functional initiatives and side projects** aimed at accelerating compliance maturity, improving processes and mitigating risk.",
        "Facilitate **stakeholder alignment and decision-making** by translating regulatory and security requirements into clear, actionable goals.",
      ],
    },
    {
      id: "tls",
      title: "Cyber Security Architect",
      company: "TLScontact",
      location: "Lisbon, Portugal",
      start: "2022-01",
      end: "2025-05",
      phase: "arch",
      bullets: [
        "Led and supported **security assessments across multiple projects**, identifying risks, defining mitigation actions and supporting secure-by-design decisions.",
        "Performed **vendor and solution assessments**, aligning technical requirements with compliance frameworks (NIST, ISO) and business risk appetite.",
        "Maintained and reviewed **risk registers**, ensuring proper risk classification, ownership and follow-up.",
        "Contributed to the **evolution of SIEM solutions**, including architecture reviews, CI/CD integration and evaluation of alternative platforms.",
        "Performed **cloud security reviews** (AWS, Azure, country-specific solutions), supporting governance consistency across environments.",
        "Coordinated with software development teams to **prioritize, track and remediate vulnerabilities** identified through SAST, DAST, dependency and secret scanning tools (GitLab).",
      ],
    },
    {
      id: "nokia-ops",
      title: "Operations Manager / Subject Matter Expert",
      company: "Nokia",
      location: "Alfragide, Portugal",
      start: "2017-09",
      end: "2021-12",
      phase: "secops",
      bullets: [
        "Acted as **Operations Manager and Subject Matter Expert**, supporting implementation of security controls in non-IT managed environments.",
        "Supervised and coordinated an **L1 support team (3 people)**, organizing tasks, setting priorities and improving operational efficiency.",
        "Led **knowledge transfer initiatives**, documentation standardization and onboarding support.",
        "Held responsibility for several operational security services, including **Anti-virus, Log Monitoring, Vulnerability Management and Patch Management**.",
        "Coordinated tool implementations, upgrades and operational improvements, ensuring alignment with internal stakeholders and service requirements.",
      ],
    },
    {
      id: "ericsson",
      title: "Consultant for MTN Group in Africa",
      company: "Ericsson",
      location: "Bucharest, Romania",
      start: "2015-10",
      end: "2016-06",
      phase: "telecom",
      bullets: [
        "Coordinated a **team of 10 engineers**, managing task distribution, schedules and delivery according to client requirements.",
        "Acted as the **main interface with the client (MTN)**, providing status updates, reporting progress and managing expectations.",
        "Planned maintenance activities to meet **operational timelines and service requirements**.",
        "Created and maintained job aids and procedures to **standardize workflows and improve delivery efficiency**.",
      ],
    },
    {
      id: "nokia-radio",
      title: "Radio Streaming – Network Implementations Engineer",
      company: "Nokia",
      location: "Alfragide, Portugal",
      start: "2014-05",
      end: "2015-10",
      phase: "telecom",
      focus: "Multi-site & cross-country coordination",
      bullets: [
        "Supported and coordinated **multiple simultaneous network installations** across international environments.",
        "Acted as a **central coordination point between field engineers and remote teams**, ensuring alignment and issue resolution.",
        "Worked in multicultural, multilingual environments, managing priorities and escalations effectively.",
      ],
    },
    {
      id: "nokia-sup",
      title: "Supervisor / Mobile Transmission Technician",
      company: "Nokia",
      location: "Alfragide, Portugal",
      start: "2012-05",
      end: "2014-05",
      phase: "telecom",
      focus: "Operational supervision",
      bullets: [
        "Supervised operational activities related to mobile network maintenance.",
        "Managed the **incident lifecycle** (opening, follow-up and closure), ensuring timely resolution.",
        "Supported **knowledge transfer and onboarding** of new team members.",
        "Participated in on-call rotations, contributing to operational resilience.",
      ],
    },
  ],

  // `used` lists the experience ids where the skill was applied (drives the
  // "where I used it" highlighting). Leave it empty for general skills.
  skills: [
    {
      category: "Governance, Risk & Compliance",
      items: [
        { name: "Cyber Security Governance", used: ["bnp", "tls"] },
        { name: "NIST", used: ["bnp", "tls"] },
        { name: "ISO 27001", used: ["bnp", "tls"] },
        { name: "DORA", used: ["bnp"] },
        { name: "Risk Assessment & Risk Treatment", used: ["tls", "bnp"] },
        { name: "Control Design & Control Effectiveness", used: ["bnp", "tls", "nokia-ops"] },
        { name: "Regulatory Compliance", used: ["bnp", "tls"] },
        { name: "Risk Appetite Framework", used: ["tls"] },
        { name: "Policy & Standards Management", used: ["bnp"] },
        { name: "Audit & Regulatory Readiness", used: ["bnp"] },
        { name: "Third-Party / Vendor Risk Management", used: ["tls"] },
        { name: "Project Security Governance", used: ["tls"] },
      ],
    },
    {
      category: "Security Architecture",
      items: [
        { name: "SIEM Architecture & Integration", used: ["tls", "nokia-ops"] },
        { name: "Cloud Security Architecture", used: ["tls"] },
        { name: "Threat & Risk Analysis", used: ["tls"] },
        { name: "Defense in Depth", used: ["tls", "nokia-ops"] },
        { name: "Secure-by-Design", used: ["tls"] },
        { name: "Security Architecture Review", used: ["tls"] },
        { name: "Identity & Access Management", used: [] },
      ],
    },
    {
      category: "AppSec & DevSecOps",
      items: [
        { name: "DevSecOps", used: ["tls"] },
        { name: "Secure SDLC", used: ["tls"] },
        { name: "Application Security", used: ["tls"] },
        { name: "Vulnerability Lifecycle Management", used: ["tls", "nokia-ops"] },
        { name: "SAST / DAST / SCA", used: ["tls"] },
        { name: "Secrets Management", used: ["tls"] },
        { name: "CI/CD Security Controls", used: ["tls"] },
      ],
    },
    {
      category: "Program & Delivery",
      items: [
        { name: "Cross-functional Coordination", used: ["bnp", "tls", "nokia-ops", "nokia-radio"] },
        { name: "Stakeholder Management", used: ["bnp", "tls", "nokia-ops", "ericsson"] },
        { name: "Security Program Support", used: ["bnp"] },
        { name: "Requirements Translation (Business ↔ Technical)", used: ["bnp", "tls", "ericsson"] },
        { name: "Prioritization & Roadmapping", used: ["bnp", "nokia-ops"] },
        { name: "Delivery Tracking", used: ["tls", "ericsson"] },
        { name: "Operational Planning", used: ["nokia-ops", "ericsson", "nokia-sup"] },
        { name: "Scrum", used: [] },
        { name: "Agile", used: [] },
      ],
    },
    {
      category: "Tools & Platforms",
      items: [
        { name: "ServiceNow", used: [] },
        { name: "Jira", used: [] },
        { name: "Trello", used: [] },
        { name: "AWS Security Hub", used: [] },
        { name: "Azure Sentinel", used: [] },
        { name: "ELK Stack", used: [] },
        { name: "Qualys", used: [] },
        { name: "Git / GitHub / GitLab", used: ["tls"] },
      ],
    },
    {
      category: "Technical Foundation",
      items: [
        { name: "Linux", used: [] },
        { name: "Windows", used: [] },
        { name: "Java", used: [] },
        { name: "C", used: [] },
        { name: "JavaScript", used: [] },
        { name: "HTML / CSS", used: [] },
        { name: "SQL", used: [] },
        { name: "Shell Scripting", used: [] },
        { name: "Object-Oriented Programming", used: [] },
      ],
    },
  ],

  education: {
    degree: "Bachelor's Degree in Telecommunications and Computer Engineering",
    school: "ISCTE – Instituto Superior de Ciências do Trabalho e da Empresa",
    period: "2016 – 2017",
    location: "Lisbon, Portugal",
    field: "Information and Communication Technologies",
    modules: [
      { name: "Networking", detail: "Basic architecture, transmission protocols" },
      { name: "Programming", detail: "Software fundamentals" },
      { name: "Guided Telecommunication Systems", detail: "Optical networks, fiber optics" },
      { name: "Radio Telecommunication Systems", detail: "Radio links, electromagnetic waves" },
      { name: "Information Security", detail: "Confidentiality, Integrity, Availability" },
      { name: "IoT with Open Source Tools", detail: "OpenHAB" },
    ],
  },

  // CEFR levels: listening, reading, spoken production, spoken interaction, writing
  languages: [
    { name: "Portuguese", native: true },
    { name: "English", levels: ["C1", "C1", "C1", "C1", "C1"] },
    { name: "Spanish", levels: ["B1", "B1", "B1", "B1", "B1"] },
  ],

  softSkills: [
    {
      title: "Communication",
      items: [
        "Strong ability to translate complex technical and regulatory topics into clear, actionable communication",
        "Experience working with diverse stakeholders, from technical teams to business and service providers",
      ],
    },
    {
      title: "Organisation",
      items: [
        "Coordination of multi-disciplinary teams and stakeholders",
        "Task prioritization and workload distribution",
        "Support to project delivery and operational planning",
        "Continuous improvement of processes and documentation",
      ],
    },
  ],
};
