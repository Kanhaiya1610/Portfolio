const projects = [
  {
    title: "LogiVoice",
    description: "AI-powered logistics document and voice assistant.",
    src: "assets/img/portfolio/logivoice-preview.jpg",
    ctaText: "View GitHub",
    ctaLink: "https://github.com/Kanhaiya1610/LogiVoice",
    content: "<p>LogiVoice is a comprehensive AI solution designed to streamline logistics operations. It features intelligent document parsing to automate data entry from invoices and bills of lading, alongside a voice assistant capable of handling natural language queries about shipment statuses and inventory.</p><br><p>Built with robust backend technologies to ensure scalability and reliability in fast-paced environments, reducing manual workload and improving tracking accuracy.</p>"
  },
  {
    title: "Space Weather Alert System",
    description: "Reactive REST API aggregating NASA space weather data.",
    src: "assets/img/portfolio/helio_teams_bkgrd_5_3.webp",
    ctaText: "View GitHub",
    ctaLink: "https://github.com/Kanhaiya1610/Space-Weather-WebApp",
    content: "<p>A high-performance Reactive REST API designed to aggregate and process real-time space weather data from NASA APIs. It provides crucial alerts and monitoring for solar flares, geomagnetic storms, and other space weather phenomena.</p><br><p>Developed using Java and Spring WebFlux, this system ensures non-blocking, asynchronous data streams, making it highly efficient for handling large volumes of incoming satellite data and serving multiple client applications simultaneously without latency bottlenecks.</p>"
  },
  {
    title: "Stock Price Predictor",
    description: "Generates LLM-based Analyst Commentary from technical indicators.",
    src: "assets/img/portfolio/stock-predictor-preview.png",
    ctaText: "View Live App",
    ctaLink: "https://kanhaiya1610.github.io/Stock-Price-Predictor/",
    content: "<p>An intelligent financial tool that combines traditional technical analysis with modern Large Language Models (LLMs). It processes historical stock data, calculates key technical indicators, and feeds them into an LLM to generate human-readable 'Analyst Commentary'.</p><br><p>This bridges the gap between raw financial data and actionable insights, helping retail investors understand complex market trends through clear, AI-generated narratives.</p>"
  },
  {
    title: "Finance AI Assistant",
    description: "Budget tracking and bill management with a secure Firebase backend.",
    src: "assets/img/portfolio/finance-ai-preview.jpg",
    ctaText: "View GitHub",
    ctaLink: "https://github.com/Kanhaiya1610/Finance-Ai-Assistant",
    content: "<p>A comprehensive personal finance management application that acts as a smart budget tracker and bill organizer. It securely stores user financial data using a Firebase backend, ensuring real-time syncing and robust security.</p><br><p>The integrated AI assistant analyzes spending habits, categorizes expenses automatically, and provides personalized recommendations to help users achieve their savings goals efficiently.</p>"
  },
  {
    title: "Mental Health Support Chatbot",
    description: "A RAG-based chatbot using Gemini 1.5, LangChain & Streamlit.",
    src: "assets/img/portfolio/mental-health-chatbot-preview.jpg",
    ctaText: "View GitHub",
    ctaLink: "https://github.com/Kanhaiya1610/Mental-Health-Chatbot",
    content: "<p>A specialized conversational agent designed to provide empathetic and informative mental health support. Built using Retrieval-Augmented Generation (RAG) architecture, it leverages the Gemini 1.5 model and LangChain to provide contextually accurate and safe responses.</p><br><p>The interface is built with Streamlit for a clean, accessible user experience. The chatbot accesses a curated database of psychological resources to offer coping strategies, mindfulness exercises, and general mental wellness advice.</p>"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  const container = document.getElementById('expandable-cards-list');
  const modal = document.getElementById('ec-modal-backdrop');
  const modalClose = document.getElementById('ec-modal-close');
  
  if (!container || !modal) return;

  // DOM Elements for Modal
  const mImage = document.getElementById('ec-modal-image');
  const mTitle = document.getElementById('ec-modal-title');
  const mDesc = document.getElementById('ec-modal-description');
  const mCta = document.getElementById('ec-modal-cta');
  const mContent = document.getElementById('ec-modal-content-details');
  const mContentBox = document.querySelector('.ec-modal-content');

  // Render List
  projects.forEach((project, index) => {
    const card = document.createElement('div');
    card.className = 'ec-card';
    card.innerHTML = `
      <div class="ec-card-left">
        <img src="${project.src}" alt="${project.title}" class="ec-card-img">
        <div class="ec-card-info">
          <h3>${project.title}</h3>
          <p>${project.description}</p>
        </div>
      </div>
      <button class="ec-card-btn">${project.ctaText}</button>
    `;

    card.addEventListener('click', () => openModal(project));
    container.appendChild(card);
  });

  // Modal Functions
  function openModal(project) {
    mImage.src = project.src;
    mImage.alt = project.title;
    mTitle.textContent = project.title;
    mDesc.textContent = project.description;
    mCta.textContent = project.ctaText;
    mCta.href = project.ctaLink;
    mContent.innerHTML = project.content;

    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
    
    // Slight delay to trigger animation
    setTimeout(() => {
      mContentBox.classList.add('active');
    }, 10);
  }

  function closeModal() {
    mContentBox.classList.remove('active');
    
    // Wait for transition before hiding backdrop
    setTimeout(() => {
      modal.classList.remove('active');
      document.body.style.overflow = 'auto';
    }, 300);
  }

  // Event Listeners for Closing
  modalClose.addEventListener('click', closeModal);

  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
});
