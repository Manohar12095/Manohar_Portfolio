// Helper: convert Drive file ID to a reliable thumbnail URL
const driveImg = (id, sz = 800) => `https://drive.google.com/thumbnail?id=${id}&sz=w${sz}`;

export const PROFILE = {
  name: "Manohar_S",
  role: "CSE Student | Developer | NCC Cadet | Entrepreneur | Athlete | Leader",
  image: driveImg("1Djnu4_SxmH5S1lU0WD8OfywpjnV8hzr8", 400),
  intro: "I don't just study Computer Science — I live it. With 30+ ML projects, a company I founded, IIT Bombay recognition, and an NCC 'A' Grade certificate, I bring both technical depth and real-world discipline to every challenge I take on."
};

export const SECTIONS = [
  {
    key: "extra-curricular",
    title: "Extra Curricular Activities",
    theme: "dark",
    image: driveImg("106QKGk17l1f3LWWNEdTpu6Yy5U9AvimH"),
    items: [
      "1st Prize in Solo Dance (2025)",
      "1st Prize in MOC (Master of Ceremony) (2025)",
      "Part of Record in \"One History, One Thousand+ Voices about Kamaraj\" Event (2025)",
      "Pongal Event \"Tug of War\" 1st Prize (2025)",
      "Pongal Event \"80kg Rock Lifting\" (2025)",
      "Pongal Event \"Tug of War\" 1st Prize (2026)",
      "Participated in MINE Programme (2023)",
      "1st Prize in Leadership Program (2025)",
      "1st Prize in Leadership Programme – RYLA (2025)",
      "Team Guidance Event participation – RYLA (2025)"
    ]
  },
  {
    key: "internship",
    title: "Internship",
    theme: "dark",
    image: driveImg("1UGzl-z3gqkMNU8-vAerjPPbCxJkG-Lgk"),
    items: [
      "Panith Innovations (15 days)",
      "Learned: Git, Web Deployment, Machine Learning"
    ]
  },
  {
    key: "academy",
    title: "Academy",
    theme: "purple",
    image: driveImg("1j_sR6b0Q-jYbeqEc--nHKUkbzg6s5Tru"),
    items: [
      "Python Programming Fundamentals – Infosys (2025)",
      "Python Basic (2025)",
      "Programming Using Java (2025)",
      "Distinct Class in Web Design – CSUITS (2020)",
      "Distinct Class in Programming Techniques – CSUITS (2019)"
    ]
  },
  {
    key: "workshops",
    title: "Workshops",
    theme: "teal",
    image: driveImg("1pTPW47iebX7lhuk3XTecdqauKR4kXaC4"),
    items: [
      "GitHub Workshop (2026)",
      "IIT Chennai Data Science (2025)",
      "IIT Chennai Artificial Intelligence (2025)",
      "Block Chain Technology (2025)",
      "Web Creation Workshop (2025)"
    ]
  },
  {
    key: "ncc",
    title: "NCC",
    theme: "dark",
    image: driveImg("1yarpLzehf4i6LvQuXxvR_8XlHOUq1mRG"),
    items: [
      "NCC – IGC RDC Camp (2025)",
      "NCC – RDC Launch Camp (2025)",
      "IUC RDC Camp (2025)",
      "RDC Training 1 Camp (2025)",
      "ATC Camp Virudhunagar (2025)",
      "B-Certificate 'A' Grade Holder (2026)"
    ]
  },
  {
    key: "sports",
    title: "Sports",
    theme: "teal",
    image: driveImg("1rW8qHXQi3hr8yKPMTVS6Fk06YYHkXwsY"),
    items: [
      "Placed 14th in Sattur Marathon (2025)",
      "Zho-Kho Inter SBOA Competition (2023)",
      "2nd Prize in 4×100m Relay (2023)",
      "2nd Prize in Handball (2018)",
      "1st Prize in Skating (2019)",
      "1st Prize in Skating (2020)",
      "5km Running Race 2nd Prize (2026)",
      "2nd Prize in 4×400 Relay (2026)",
      "2nd Prize in 400m Running Race (2026)",
      "1st Prize in 4×100m Relay (2026)",
      "1st Prize in 1500m Running Race (2026)",
      "1500m NCC Running Race 1st Prize (2026)"
    ]
  },
  {
    key: "social-activities",
    title: "Social Activities",
    theme: "dark",
    image: driveImg("18TsrwSp1WL6sK2IMupMr9OrjAKZl_04b"),
    items: [
      "Active Anti Ragging Club Member (From 2025)",
      "Pledge Against Drug Abuse (2025)",
      "Achiever of the Year (2025)",
      "Spoken About Anti Ragging Awareness (2025)",
      "Virudhunagar Temple Traffic/Crowd Control (2025)",
      "Helped for Kaadai Mutai Company for Survey Around Land (2026)",
      "Republic Day NCC Drill (2025)",
      "Independence Day NCC Performance (2025)",
      "Republic Day NCC Drill Performance (2026)",
      "MOC About Anti Ragging Event (2025)",
      "Virudhunagar Crowd Control (2026)"
    ]
  },
  {
    key: "projects",
    title: "Projects",
    theme: "teal",
    image: driveImg("1Nz3ppn3Yup0OmwImgbzPZKASIyXhwvMG"),
    items: [
      "Created My First App – Got 1st Prize (2023)",
      "1st Prize in Video Editing (2025)",
      "Participated in Smart India Hackathon (2025)",
      "Participated in National Level Hackathon (2025)",
      "1st Prize in Entrepreneurship by IIT Bombay (2025)",
      "Having More Than 30+ Projects in ML (2026)",
      "Human Trust Fact Checker Website Designer (2026)",
      "Daily Activity Tracker Website (2026)",
      "Initiative AI Assistant Application (2026)"
    ]
  },
  {
    key: "technical-activities",
    title: "Technical Activities",
    theme: "dark",
    image: driveImg("150neOoXH1SswZW1FvWgOOD0H2hjK-JUU"),
    items: [
      "Thiagarajar College – Symposium (2025)",
      "NPR College – Symposium (2025)",
      "Kalasalingam University – Symposium (2026)",
      "SBM College – Symposium (2026)",
      "Linux User (2026) — Using: Linux Mint, Kali Linux"
    ]
  },
  {
    key: "entrepreneurship",
    title: "Entrepreneurship",
    theme: "purple",
    image: driveImg("1CgdccfmZf5RMzuDFGR86uW2MhrL3fgWP"),
    items: [
      "CEO of \"RAHONAM\" Company",
      "Website Providing",
      "Video Editing",
      "Product Promotion",
      "Account Maintenance"
    ]
  }
];

export const VIDEOS = [
  { title: "Achievements Reel", url: "https://drive.google.com/file/d/1Zjn74IJ0xOZzmxVWHhAH2gUn7KTl8mMx/preview" },
  { title: "Showcase Reel", url: "https://drive.google.com/file/d/1tsnY8Pq1D3pssmfvMpH_eEaIV-djSkfd/preview" }
];

export const CONTACT = {
  phone: "6369036210",
  whatsapp: "6369036210",
  email: "manoharorignal@outlook.com",
  linkedin: "https://www.linkedin.com/in/manohar-sudhakar-916a69353/",
  github: "https://github.com/Manohar12095",
  location: "Madurai, Tamil Nadu"
};

export const ADMIN = { name: "Manohar", password: "2026" };
