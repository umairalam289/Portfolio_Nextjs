export const profile = {
  name: "Muhammad Umair Alam",
  title: "AI Developer",
  tagline: "Computer Vision · LLMs · Medical Imaging",
  location: "Islamabad, Pakistan",
  email: "umairalam567@gmail.com",
  phone: "+92 312 5060256",
  linkedin: "https://www.linkedin.com/in/umair-alam-3ba50b217/",
  resume: "/umair-alam-resume.pdf",
  summary:
    "AI Developer specializing in Computer Vision, LLMs, and medical imaging. End-to-end ML development with PyTorch, Docker, Flask and FastAPI — shipping cutting-edge AI into healthcare, particularly dental diagnostics, in close collaboration with cross-functional teams.",
};

export const experience = [
  {
    role: "Junior AI Developer",
    company: "ZIGRON",
    location: "Islamabad",
    period: "Aug 2023 — Present",
    highlights: [
      "Built computer-vision pipelines diagnosing tooth diseases from OPG, bitewing, periapical X-rays and intraoral images.",
      "Trained YOLO v8 segmentation models for dental problems, reaching up to 95% accuracy.",
      "Authored post-processing for bone-loss detection and dental landmarks at up to 90% accuracy.",
      "Designed a scalable Dockerized inference pipeline served via FastAPI for production use.",
      "Collaborated with dentists on CVAT annotation workflows to lift training-data quality.",
      "Built an AI diagnosis pipeline with LangChain and a personalized dental chatbot using LangGraph + RAG.",
    ],
    stack: ["PyTorch", "YOLO v8", "FastAPI", "Docker", "LangChain", "LangGraph", "RAG", "CVAT"],
  },
  {
    role: "Software Engineer Intern",
    company: "Prismware Technologies",
    location: "",
    period: "Jul 2022 — Oct 2022",
    highlights: [
      "Built web-scraping tooling with Scrapy and Selenium across diverse target sites.",
      "Cleaned and processed datasets in pandas to prepare them for analysis and model training.",
      "Implemented CRUD operations on databases through API layers.",
      "Contributed to a chatbot powered by BERT.",
    ],
    stack: ["Python", "Scrapy", "Selenium", "Pandas", "BERT"],
  },
];

export const projects = [
  {
    title: "Dental Diagnosis — Periapical X-Ray Segmentation",
    blurb:
      "Multi-class semantic segmentation of teeth, restorations and tooth structures on periapical X-rays. Live demo below — explore the model output overlaid on a real radiograph.",
    role: "Lead developer",
    tags: ["YOLO v8", "Segmentation", "Healthcare", "FastAPI"],
    accent: "from-cyan-400 to-violet-400",
    href: "#segmentation",
    cta: "Open interactive demo",
  },
  {
    title: "Retinal Vessel Segmentation — U-Net",
    blurb:
      "Semantic segmentation of retinal blood vessels from fundus photographs using a U-Net with a ResNet-34 backbone, producing precise binary vessel maps for ophthalmology screening. Live demo above — drag to compare input against prediction.",
    role: "Solo project",
    tags: ["U-Net", "ResNet-34", "Segmentation", "Ophthalmology"],
    accent: "from-cyan-400 to-violet-400",
    href: "#retina",
    cta: "Open interactive demo",
  },
  {
    title: "Personalized Dental AI Chatbot",
    blurb:
      "Agentic chatbot built on LangGraph with RAG over clinical and patient context, delivering grounded, personalized dental assistance.",
    role: "AI engineer",
    tags: ["LangGraph", "LangChain", "RAG", "LLMs"],
    accent: "from-violet-400 to-fuchsia-400",
  },
  {
    title: "Bone-Loss Detection Algorithm",
    blurb:
      "Post-processing pipeline turning raw segmentation into clinically meaningful CEJ-to-bone measurements for periodontal screening.",
    role: "Algorithm design",
    tags: ["OpenCV", "NumPy", "Geometry"],
    accent: "from-fuchsia-400 to-cyan-400",
  },
  {
    title: "Brain Tumor Detection — CNN",
    blurb:
      "Binary thresholding pre-processing and a CNN classifier on MRI scans, demonstrating end-to-end image preprocessing and deep-learning fundamentals.",
    role: "Solo project",
    tags: ["CNN", "PyTorch", "MRI", "Image Processing"],
    accent: "from-cyan-400 to-mint-400",
  },
];

export const skills = [
  { label: "Computer Vision", weight: 1 },
  { label: "PyTorch", weight: 1 },
  { label: "Deep Learning", weight: 1 },
  { label: "Large Language Models", weight: 1 },
  { label: "Prompt Engineering", weight: 0.85 },
  { label: "Docker", weight: 0.9 },
  { label: "Retrieval-Augmented Generation", weight: 0.85 },
  { label: "Flask", weight: 0.7 },
  { label: "FastAPI", weight: 0.95 },
  { label: "OpenCV", weight: 0.95 },
  { label: "Machine Learning", weight: 1 },
  { label: "CNNs", weight: 1 },
  { label: "NLP", weight: 0.8 },
  { label: "Data Science", weight: 0.85 },
];

export const education = [
  {
    degree: "B.S. Electrical Engineering",
    school: "National University of Science and Technology",
    location: "Islamabad, Pakistan",
    period: "Sep 2019 — May 2023",
    detail: "CGPA: 3.8",
  },
  {
    degree: "Intermediate (Pre-Engineering)",
    school: "Punjab College of Science (Blue Area Campus)",
    location: "Islamabad, Pakistan",
    period: "2017 — 2019",
    detail: "Passed with A*",
  },
];
