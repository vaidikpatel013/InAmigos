/* ═════════════════════════════════════════════════════════════════
   INAMIGOS FOUNDATION — JavaScript Interactions
   Custom GSAP Animations & Interactive Interfaces
   ═════════════════════════════════════════════════════════════════ */

document.addEventListener("DOMContentLoaded", () => {
  // Initialize Lucide Icons
  if (typeof lucide !== "undefined") {
    lucide.createIcons();
  }

  // Register ScrollTrigger Plugin
  gsap.registerPlugin(ScrollTrigger);

  // Initialize Smooth Scrolling via Lenis
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    gestureOrientation: 'vertical',
    smoothWheel: true,
  });

  // Connect Lenis to GSAP ScrollTrigger
  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => {
    lenis.raf(time * 1000);
  });
  gsap.ticker.lagSmoothing(0);

  // Disable page scroll during loading
  lenis.stop();

  /* ═══════════════ 1. PRELOADER ANIMATION ═══════════════ */
  const preloaderTl = gsap.timeline({
    onComplete: () => {
      const loader = document.getElementById("preloader");
      if (loader) {
        loader.style.display = "none";
      }
      lenis.start(); // Enable scroll
      initPageAnimations();
    }
  });

  // Preloader elements animation
  preloaderTl
    .to("#preloader-logo", {
      opacity: 1,
      scale: 1,
      duration: 0.8,
      ease: "back.out(1.7)",
      delay: 0.2
    })
    .to("#preloader-text-1 span", {
      y: "0%",
      duration: 0.5,
      ease: "power3.out"
    }, "-=0.3")
    .to("#preloader-text-2 span", {
      y: "0%",
      duration: 0.5,
      ease: "power3.out"
    }, "-=0.2")
    .to("#preloader-sub", {
      opacity: 1,
      y: 0,
      duration: 0.4,
      ease: "power2.out"
    }, "-=0.1")
    // Keep visible for a brief moment
    .to({}, { duration: 0.8 })
    // Fade out inner loader content
    .to(".preloader-inner", {
      opacity: 0,
      y: -40,
      duration: 0.5,
      ease: "power3.in"
    })
    // Slide left/right masks out
    .to("#preloader-mask-left", {
      xPercent: -100,
      duration: 0.7,
      ease: "power4.inOut"
    }, "-=0.2")
    .to("#preloader-mask-right", {
      xPercent: 100,
      duration: 0.7,
      ease: "power4.inOut"
    }, "<")
    .to("#preloader", {
      opacity: 0,
      duration: 0.3,
      ease: "power2.out"
    }, "-=0.2");

  /* ═══════════════ 2. MAIN PAGE ANIMATIONS ═══════════════ */
  function initPageAnimations() {
    // Header entry
    gsap.fromTo("#header", 
      { y: -40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 0.8, ease: "power3.out", delay: 0.1 }
    );

    // Hero content entry
    gsap.fromTo("#hero-content", 
      { y: 40, opacity: 0 }, 
      { y: 0, opacity: 1, duration: 1, ease: "power3.out" }
    );

    // Hero Visual Stack entry
    gsap.fromTo("#hero-visual", 
      { scale: 0.95, opacity: 0 }, 
      { scale: 1, opacity: 1, duration: 1, ease: "power3.out" },
      "-=0.7"
    );

    // Scroll Down Indicator entry
    gsap.fromTo("#hero-scroll-down",
      { opacity: 0 },
      { opacity: 1, duration: 0.6 },
      "-=0.4"
    );

    // Parallax background blobs
    gsap.to(".blob-1", {
      yPercent: -30,
      xPercent: 20,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.5
      }
    });

    gsap.to(".blob-2", {
      yPercent: 40,
      xPercent: -15,
      ease: "none",
      scrollTrigger: {
        trigger: "body",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.8
      }
    });

    // Active Section Link Highlight during scrolling
    const sections = document.querySelectorAll("section[id]");
    sections.forEach((section) => {
      ScrollTrigger.create({
        trigger: section,
        start: "top 200px",
        end: "bottom 200px",
        onToggle: (self) => {
          if (self.isActive) {
            const id = section.getAttribute("id");
            document.querySelectorAll(".nav-link").forEach((link) => {
              link.classList.remove("active");
              if (link.getAttribute("href") === `#${id}`) {
                link.classList.add("active");
              }
            });
          }
        }
      });
    });

    // Initializations
    initHeroCardTilt();
    initBentoGlowTracking();
    initStoryTextReveal();
    initInitiativesFilters();
    initInitiativesDrawer();
    initImpactCounters();
    initImpactMomentsSlider();
    initEventsHoverReveal();
    initEventsDetailModal();
    initFAQAccordion();
    initActionHubTabs();
    initMobileNav();
    initQuickLinks();
  }

  /* ─── Hero Visual Card Stack Mouse Interaction ─── */
  function initHeroCardTilt() {
    const heroVisual = document.getElementById("hero-visual");
    const stack = document.getElementById("visual-stack");
    
    if (!heroVisual || !stack) return;

    heroVisual.addEventListener("mousemove", (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = e.clientX - rect.left; // x position within element
      const y = e.clientY - rect.top;  // y position within element
      
      const xPercent = (x / rect.width - 0.5) * 30; // Max 15deg rotation
      const yPercent = (y / rect.height - 0.5) * -30;
      
      gsap.to(stack, {
        rotationY: xPercent,
        rotationX: yPercent,
        transformPerspective: 1000,
        ease: "power2.out",
        duration: 0.5
      });
    });

    heroVisual.addEventListener("mouseleave", () => {
      gsap.to(stack, {
        rotationY: 0,
        rotationX: 0,
        ease: "elastic.out(1, 0.4)",
        duration: 1.2
      });
    });
  }

  /* ─── Bento Card Cursor Glow Tracking ─── */
  function initBentoGlowTracking() {
    const cards = document.querySelectorAll(".bento-card, .impact-card, .action-dashboard");
    cards.forEach((card) => {
      card.addEventListener("mousemove", (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        card.style.setProperty("--mouse-x", `${x}px`);
        card.style.setProperty("--mouse-y", `${y}px`);
      });
    });
  }

  /* ─── Our Story Text Word-by-Word Scroll Reveal ─── */
  function initStoryTextReveal() {
    const paragraph = document.getElementById("about-reveal-text");
    if (!paragraph) return;

    const text = paragraph.textContent.trim();
    paragraph.innerHTML = "";

    // Split text into individual span words
    const words = text.split(/\s+/);
    words.forEach((word, index) => {
      const span = document.createElement("span");
      span.classList.add("word");
      span.textContent = word;
      paragraph.appendChild(span);
      if (index < words.length - 1) {
        paragraph.appendChild(document.createTextNode(" "));
      }
    });

    const wordSpans = paragraph.querySelectorAll(".word");

    ScrollTrigger.create({
      trigger: ".about-reveal-wrap",
      start: "top 75%",
      end: "bottom 40%",
      scrub: true,
      onUpdate: (self) => {
        const progress = self.progress;
        const activeCount = Math.floor(progress * wordSpans.length);
        wordSpans.forEach((w, i) => {
          w.classList.toggle("active", i < activeCount);
        });
      }
    });

    // Staggered entry for credentials bento cards
    gsap.from(".bento-card", {
      scrollTrigger: {
        trigger: ".about-bento",
        start: "top 80%",
      },
      opacity: 0,
      y: 30,
      duration: 0.6,
      stagger: 0.1,
      ease: "power2.out"
    });
  }

  /* ─── Initiatives Filtering Logic ─── */
  function initInitiativesFilters() {
    const filterButtons = document.querySelectorAll(".filter-btn");
    const cards = document.querySelectorAll(".project-card");
    const grid = document.getElementById("initiatives-grid");

    if (!filterButtons.length || !cards.length || !grid) return;

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        // Toggle active class on filters
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");

        const filterValue = btn.dataset.filter;

        // Fade out grid cards
        gsap.to(cards, {
          opacity: 0,
          y: 20,
          scale: 0.95,
          duration: 0.35,
          ease: "power2.in",
          stagger: 0.04,
          onComplete: () => {
            let activeCards = [];
            
            cards.forEach((card) => {
              if (filterValue === "all" || card.dataset.category === filterValue) {
                card.style.display = "block";
                activeCards.push(card);
              } else {
                card.style.display = "none";
              }
            });

            // Fade back in filtered cards
            if (activeCards.length) {
              gsap.fromTo(activeCards,
                { opacity: 0, y: 20, scale: 0.95 },
                { opacity: 1, y: 0, scale: 1, duration: 0.5, stagger: 0.05, ease: "power3.out" }
              );
            }
            
            ScrollTrigger.refresh();
          }
        });
      });
    });
  }

  /* ─── Initiatives Detail Drawer ─── */
  const projectDetails = {
    vikas: {
      num: "01",
      title: "Project Vikas",
      image: "assets/images/vikas.jpg",
      tags: ["Youth Development", "Skills", "Employability"],
      description: "Project Vikas bridges the gap between college education and professional employability. By onboarding over 30,000 interns and students over the last four years, the initiative delivers hands-on project exposure in business operations, content design, finance, marketing, and research. Webinars, career counseling, resume building, and talent support drives are hosted regularly to support future professionals.",
      highlights: [
        "Over 30,000 interns trained and certified nationwide.",
        "Interactive seminars and webinars led by industry experts.",
        "Personalized career counseling, resume audits, and mock interview preparations.",
        "Domains spanning design, finance, marketing, operations, and social welfare."
      ]
    },
    jeev: {
      num: "02",
      title: "Project Jeev",
      image: "assets/images/jeev.png",
      tags: ["Animal Welfare", "Rescue Support", "Community Care"],
      description: "Project Jeev focuses on protecting stray dogs, cats, cows, and other street animals in local communities. Driven by a dedicated volunteer base, the campaign organizes daily feeding drives, coordinate emergency rescue calls, provides temporary shelters, and raises funds for medical care and vaccine support.",
      highlights: [
        "50+ stray animals fed daily by local volunteers.",
        "Coordinating rescue support and medical aid with animal doctors.",
        "Organizing animal welfare awareness drives in schools.",
        "Supporting local stray shelters with feed and infrastructure relief."
      ]
    },
    udaan: {
      num: "03",
      title: "Project Udaan",
      image: "assets/images/udaan.png",
      tags: ["Women Empowerment", "Skills Training", "Health Awareness"],
      description: "Project Udaan empowers rural women by supporting self-help groups, providing small-business skill training, and building leadership. The project also addresses healthcare by organizing menstrual hygiene awareness events, providing sanitary resources, and talking openly about health rights in villages.",
      highlights: [
        "Uplifted 900+ women through skills and small-business training.",
        "Regular menstrual health awareness camps in rural communities.",
        "Financial literacy and micro-enterprise workshops for self-help networks.",
        "Developing self-reliance channels that support local families."
      ]
    },
    prakriti: {
      num: "04",
      title: "Project Prakriti",
      image: "assets/images/project-prakriti.jpg",
      tags: ["Climate Action", "Tree Planting", "Eco Education"],
      description: "Project Prakriti champions environmental conservation and climate-conscious habits. The campaign hosts tree planting drives, promotes organic farming practices, and leads plastic clean-up actions in public spaces. Through community workshops, we inspire practical eco-friendly habits for everyday life.",
      highlights: [
        "Planted and cared for 20,000+ saplings across Chhattisgarh.",
        "Clean-up drives and plastic waste reduction awareness sessions.",
        "Empowering farmers with bio-fertilizer and sustainable farming guidelines.",
        "Collaborative climate-awareness events with schools and universities."
      ]
    },
    bachpanshala: {
      num: "05",
      title: "BachpanShala",
      image: "assets/images/bachpan.png",
      tags: ["Education", "Child Care", "Mentorship"],
      description: "BachpanShala runs educational learning spaces for children from underserved communities. Recognizing that primary education is the building block of life, volunteers run classes focusing on base reading, basic digital literacy, character mentoring, arts, and life skills in safe environments.",
      highlights: [
        "Providing basic school education resources directly to underprivileged children.",
        "Base digital literacy workshops and interactive learning.",
        "Mentorship camps, creative learning, and sports events.",
        "Creating safe, positive hubs for learning, self-expression, and growth."
      ]
    },
    seva: {
      num: "06",
      title: "Project Seva",
      image: "assets/images/sewa.png",
      tags: ["Relief Support", "Food Relief", "Clothing Drives"],
      description: "Project Seva focuses on addressing urgent material needs with care. The initiative organizes direct food relief distribution, winter clothing collection drives, and health kits packaging for homeless individuals and marginalized families, ensuring community support reaches the right doors.",
      highlights: [
        "Distributed over 50,000 hot meals and clothes.",
        "Direct relief drives in response to seasonal hardships (winter blankets).",
        "Direct community outreach matching support to actual families.",
        "Fostering community care through volunteer-powered drives."
      ]
    },
    "mission-life": {
      num: "07",
      title: "Mission Life",
      image: "assets/images/life.png",
      tags: ["Sustainability", "Eco-friendly Habits", "Conservation"],
      description: "Inspired by global climate goals, Mission Life encourages people to adopt clean habits in their daily routines. The project advocates energy conservation, water-saving setups, plastic recycling, and simple lifestyle changes that collectively protect the planet.",
      highlights: [
        "Advocating clean energy usage and carbon footprint reductions.",
        "Developing local waste recycling workshops and resources.",
        "Educational blog posts and webinars discussing green living habits.",
        "Fostering active citizens working for circular, sustainable consumption."
      ]
    },
    "save-water": {
      num: "08",
      title: "Save Water",
      image: "assets/images/water.png",
      tags: ["Water Conservation", "Rainwater Systems", "Outreach"],
      description: "Water is our most critical natural resource. The Save Water project raises awareness about water conservation, rainwater harvesting systems setup, plumbing leak checks, and green practices that replenish groundwater tables in both homes and communities.",
      highlights: [
        "Rainwater harvesting campaigns in rural and urban community hubs.",
        "Workshops outlining easy water recycling and greywater setups.",
        "Working on tree planting that natively helps soil and groundwater tables.",
        "Promoting clean water accessibility guidelines in local communities."
      ]
    },
    "healthy-lifestyle": {
      num: "09",
      title: "Healthy Lifestyle",
      image: "assets/images/healthy.png",
      tags: ["Health", "Well-being", "Nutritional Wellness"],
      description: "This wellness campaign encourages people of all ages to adopt positive health habits. Through webinars, medical checks support, nutrition advice, and physical fitness exercises, the initiative promotes active stress management and mental well-being.",
      highlights: [
        "Nutritional guidance webinars and active lifestyle tips.",
        "Collaborating on local health screening and wellness checkups.",
        "Promoting stress management and positive mental health practices.",
        "Community workshops aimed at reducing harmful habits and substances."
      ]
    },
    "sustainable-living": {
      num: "10",
      title: "Sustainable Living",
      image: "assets/images/sus.png",
      tags: ["Circular Living", "Eco Design", "Zero Waste"],
      description: "Sustainable Living compiles the core green habits developed across InAmigos initiatives: home composting, energy-saving setups, minimal packaging purchases, organic food growing, carpooling, and supporting clean circular local economies.",
      highlights: [
        "Developing zero-waste home composting and organic garden setups.",
        "Supporting energy-efficiency installations and usage reductions.",
        "Educating on recycling, plastic sorting, and compost creation.",
        "Connecting community members to sustainable local organic products."
      ]
    }
  };

  function initInitiativesDrawer() {
    const drawer = document.getElementById("drawer");
    const overlay = document.getElementById("drawer-overlay");
    const closeBtn = document.getElementById("drawer-close");
    const cards = document.querySelectorAll(".project-card");

    if (!drawer || !overlay || !closeBtn) return;

    function openDrawer(projectId) {
      const data = projectDetails[projectId];
      if (!data) return;

      // Populate details
      document.getElementById("drawer-img").src = data.image;
      document.getElementById("drawer-img").alt = data.title;
      document.getElementById("drawer-num").textContent = data.num;
      document.getElementById("drawer-title").textContent = data.title;
      document.getElementById("drawer-desc").textContent = data.description;

      // Tags
      const tagsContainer = document.getElementById("drawer-tags");
      tagsContainer.innerHTML = "";
      data.tags.forEach((tag) => {
        const span = document.createElement("span");
        span.textContent = tag;
        tagsContainer.appendChild(span);
      });

      // Highlights
      const list = document.getElementById("drawer-highlights-list");
      list.innerHTML = "";
      data.highlights.forEach((hl) => {
        const li = document.createElement("li");
        li.textContent = hl;
        list.appendChild(li);
      });

      // Show drawer
      overlay.classList.add("active");
      drawer.classList.add("active");
      lenis.stop(); // Stop page scroll
    }

    function closeDrawer() {
      overlay.classList.remove("active");
      drawer.classList.remove("active");
      lenis.start(); // Resume page scroll
    }

    cards.forEach((card) => {
      card.addEventListener("click", () => {
        const proj = card.dataset.project;
        if (proj) openDrawer(proj);
      });
    });

    closeBtn.addEventListener("click", closeDrawer);
    overlay.addEventListener("click", closeDrawer);

    // Escape Key Close
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && drawer.classList.contains("active")) {
        closeDrawer();
      }
    });

    // Share open function globally for footer triggers
    window.openInAmigosProject = openDrawer;
  }

  /* ─── Impact Statistics Counters & Progress Bars ─── */
  function initImpactCounters() {
    const counters = document.querySelectorAll(".counter");
    const progressFills = document.querySelectorAll(".impact-progress-fill");

    counters.forEach((counter) => {
      ScrollTrigger.create({
        trigger: counter,
        start: "top 85%",
        onEnter: () => {
          const target = +counter.getAttribute("data-target");
          const countObj = { val: 0 };
          gsap.to(countObj, {
            val: target,
            duration: 2,
            ease: "power2.out",
            onUpdate: () => {
              counter.textContent = Math.ceil(countObj.val).toLocaleString();
            }
          });
        },
        once: true
      });
    });

    progressFills.forEach((fill) => {
      ScrollTrigger.create({
        trigger: fill,
        start: "top 85%",
        onEnter: () => {
          const widthVal = fill.getAttribute("data-progress");
          fill.style.width = widthVal;
        },
        once: true
      });
    });
  }

  /* ─── Impact Moments Auto-Sliding Card Stack ─── */
  function initImpactMomentsSlider() {
    const cards = gsap.utils.toArray(".impact-stack-card");
    if (!cards.length) return;

    const total = cards.length;
    let currentIndex = 0;

    // Card offsets layout configuration
    const cardOffset = 24;

    function arrangeStack() {
      for (let i = 0; i < total; i++) {
        const itemIndex = (currentIndex + i) % total;
        const card = cards[itemIndex];
        
        gsap.to(card, {
          duration: 0.8,
          x: cardOffset * i,
          y: -cardOffset * i,
          zIndex: total - i,
          scale: 1 - i * 0.04,
          opacity: 1 - i * 0.12,
          ease: "power2.out"
        });
      }
    }

    arrangeStack();

    // Rotate cards every 2.5 seconds
    window.setInterval(() => {
      currentIndex = (currentIndex + 1) % total;
      arrangeStack();
    }, 2500);
  }

  /* ─── Events Row Mouse Hover Image Follow ─── */
  const eventImages = {
    water: "assets/images/project-prakriti.jpg",
    happiness: "assets/images/volunteer.jpg",
    science: "assets/images/udaan.png"
  };

  function initEventsHoverReveal() {
    const timeline = document.getElementById("events-timeline");
    const preview = document.getElementById("hover-image-preview");
    const previewImg = document.getElementById("hover-image-preview-img");
    const rows = document.querySelectorAll(".event-row");

    if (!timeline || !preview || !previewImg || !rows.length) return;

    // Monitor hover position and follow cursor
    rows.forEach((row) => {
      row.addEventListener("mouseenter", () => {
        const eventId = row.dataset.event;
        const imgPath = eventImages[eventId];
        if (imgPath) {
          previewImg.src = imgPath;
          previewImg.alt = row.querySelector("h3").textContent;
          preview.style.opacity = "1";
          preview.style.transform = "scale(1)";
        }
      });

      row.addEventListener("mousemove", (e) => {
        // Position preview card offset from cursor
        const offset = 20;
        gsap.to(preview, {
          x: e.clientX + offset,
          y: e.clientY + offset,
          duration: 0.2,
          ease: "power2.out",
          overwrite: "auto"
        });
      });

      row.addEventListener("mouseleave", () => {
        preview.style.opacity = "0";
        preview.style.transform = "scale(0.9)";
      });
    });
  }

  /* ─── Events Detail Modal ─── */
  const eventModalData = {
    water: {
      title: "World Water Day 2025",
      category: "Community Collaboration",
      image: "assets/images/project-prakriti.jpg",
      description: "Water is essential for life, yet millions worldwide face severe water scarcity and pollution. World Water Day is a global initiative to raise awareness about water conservation and sustainable water management. InAmigos Foundation is organizing an interactive event to educate and inspire individuals to take meaningful actions towards a water-secure future.",
      highlights: [
        "Awareness sessions on water conservation and clean sustainability.",
        "Expert talks discussing global water challenges and local solutions.",
        "Workshops demonstrating rainwater harvesting and water-efficient practices.",
        "Community engagements and active water-saving pledge campaigns."
      ],
      closing: "Let us come together to protect and preserve our most precious resource: water.",
      start: "22 Mar 2025, 06:00 pm",
      location: "Online Video Webinar",
      email: "inamigosfoundation@gmail.com",
      phone: "+91 626 730 9902"
    },
    happiness: {
      title: "International Day of Happiness 2025",
      category: "Well-being & Compassion",
      image: "assets/images/volunteer.jpg",
      description: "Happiness is not just a feeling; it is a way of life. The International Day of Happiness is dedicated to promoting global well-being, mindfulness, kindness, and positive change. InAmigos Foundation invites you to be part of this community celebration where we explore mindfulness habits and outline how small acts can make a big impact on our lives and society.",
      highlights: [
        "Interactive sessions on mindfulness and emotional well-being.",
        "Fun activities promoting happiness, laughter, and positivity.",
        "Open discussions on mental health awareness and self-care.",
        "Spreading kindness via direct community volunteering drives."
      ],
      closing: "Let us come together to create a happier, more compassionate world, one smile at a time.",
      start: "20 Mar 2025, 06:00 pm",
      location: "Online Virtual Session",
      email: "inamigosfoundation@gmail.com",
      phone: "+91 626 730 9902"
    },
    science: {
      title: "International Day of Women & Girls in Science 2025",
      category: "STEM Education Outreach",
      image: "assets/images/udaan.png",
      description: "The International Day of Women and Girls in Science is a global initiative that highlights the crucial role women play in scientific advancements and innovation. InAmigos Foundation is hosting a special local campaign to honor the achievements of women in STEM fields, encourage young girls to pursue careers in science, and foster an inclusive environment for future innovators.",
      highlights: [
        "Honoring the scientific achievements of women in STEM.",
        "Interactive science experiments and technology guides for girls.",
        "Creating space and mentorship channels for future girls innovators.",
        "Fostering supportive communities that advocate equal STEM education."
      ],
      closing: "Together, let us break barriers and create a future where women and girls thrive in science and technology.",
      start: "11 Feb 2025, 12:30 pm",
      location: "Rohtak, Haryana Hub",
      email: "inamigosfoundation@gmail.com",
      phone: "+91 626 730 9902"
    }
  };

  function initEventsDetailModal() {
    const overlay = document.getElementById("event-modal-overlay");
    const modal = document.getElementById("event-modal");
    const closeBtn = document.getElementById("event-modal-close");
    const rows = document.querySelectorAll(".event-row");

    if (!overlay || !modal || !closeBtn) return;

    function openModal(eventId) {
      const data = eventModalData[eventId];
      if (!data) return;

      // Populate elements
      document.getElementById("event-modal-img").src = data.image;
      document.getElementById("event-modal-img").alt = data.title;
      document.getElementById("event-modal-category").textContent = data.category;
      document.getElementById("event-modal-title").textContent = data.title;
      document.getElementById("event-modal-desc").textContent = data.description;
      document.getElementById("event-modal-closing").textContent = data.closing;
      document.getElementById("event-detail-start").textContent = data.start;
      document.getElementById("event-detail-location").textContent = data.location;

      // Highlights
      const container = document.getElementById("event-modal-section");
      const list = document.getElementById("event-modal-highlights-list");
      list.innerHTML = "";
      
      if (data.highlights.length) {
        container.style.display = "block";
        data.highlights.forEach((hl) => {
          const li = document.createElement("li");
          li.textContent = hl;
          list.appendChild(li);
        });
      } else {
        container.style.display = "none";
      }

      // Show overlay and scale modal in
      overlay.classList.add("active");
      lenis.stop(); // Stop page scrolling
    }

    function closeModal() {
      overlay.classList.remove("active");
      lenis.start(); // Resume page scrolling
    }

    rows.forEach((row) => {
      row.addEventListener("click", () => {
        const evId = row.dataset.event;
        if (evId) openModal(evId);
      });
    });

    closeBtn.addEventListener("click", closeModal);
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) closeModal();
    });

    // Escape Key Close
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && overlay.classList.contains("active")) {
        closeModal();
      }
    });
  }

  /* ─── FAQ Accordion ─── */
  function initFAQAccordion() {
    const faqItems = document.querySelectorAll(".faq-item");
    faqItems.forEach((item) => {
      const trigger = item.querySelector(".faq-trigger");
      const icon = item.querySelector(".faq-icon i");

      trigger.addEventListener("click", () => {
        const isActive = item.classList.contains("active");

        // Close other panels
        faqItems.forEach((other) => {
          if (other !== item) {
            other.classList.remove("active");
            other.querySelector(".faq-trigger").setAttribute("aria-expanded", "false");
            const otherIcon = other.querySelector(".faq-icon i");
            if (otherIcon) {
              otherIcon.setAttribute("data-lucide", "plus");
            }
          }
        });

        // Toggle current panel
        item.classList.toggle("active", !isActive);
        trigger.setAttribute("aria-expanded", String(!isActive));
        
        // Refresh Lucide icons inside accordion
        if (typeof lucide !== "undefined") {
          lucide.createIcons();
        }
      });
    });
  }

  /* ─── Action Hub (CTA Tabs Switching) ─── */
  function initActionHubTabs() {
    const tabs = document.querySelectorAll(".action-tab-btn");
    const panels = document.querySelectorAll(".action-panel");

    if (!tabs.length || !panels.length) return;

    tabs.forEach((tab) => {
      tab.addEventListener("click", () => {
        tabs.forEach((t) => t.classList.remove("active"));
        tab.classList.add("active");

        const targetTab = tab.dataset.tab;

        panels.forEach((panel) => {
          if (panel.id === `panel-${targetTab}`) {
            panel.style.display = "block";
            // Animate transition entry
            gsap.fromTo(panel, 
              { opacity: 0, y: 15 },
              { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }
            );
            panel.classList.add("active");
          } else {
            panel.style.display = "none";
            panel.classList.remove("active");
          }
        });
      });
    });

    // Make tab switching trigger function global
    window.switchActionHubTab = (tabName) => {
      const tabBtn = document.querySelector(`.action-tab-btn[data-tab="${tabName}"]`);
      if (tabBtn) tabBtn.click();
    };
  }

  /* ─── Mobile Navbar Menu Overlay Toggle ─── */
  function initMobileNav() {
    const toggle = document.getElementById("menu-toggle");
    const list = document.getElementById("nav-list");
    const links = document.querySelectorAll(".nav-link");

    if (!toggle || !list) return;

    toggle.addEventListener("click", () => {
      const expanded = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!expanded));
      list.classList.toggle("active");
    });

    // Close mobile menu on click navigation link
    links.forEach((link) => {
      link.addEventListener("click", () => {
        toggle.setAttribute("aria-expanded", "false");
        list.classList.remove("active");
      });
    });
  }

  /* ─── Dynamic Quick Actions Redirects ─── */
  function initQuickLinks() {
    // 1. Footer Project Triggers
    const projTriggers = document.querySelectorAll(".footer-project-trigger");
    projTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const projectId = trigger.dataset.project;
        
        // Scroll to Initiatives section first
        const section = document.getElementById("initiatives");
        if (section) {
          lenis.scrollTo(section, {
            offset: -80,
            onComplete: () => {
              // Automatically open corresponding project drawer
              if (typeof window.openInAmigosProject === "function") {
                window.openInAmigosProject(projectId);
              }
            }
          });
        }
      });
    });

    // 2. Footer CTA Tab Triggers
    const tabTriggers = document.querySelectorAll(".footer-tab-trigger");
    tabTriggers.forEach((trigger) => {
      trigger.addEventListener("click", (e) => {
        e.preventDefault();
        const tabName = trigger.dataset.tab;
        
        // Scroll to action hub first
        const section = document.getElementById("action-hub");
        if (section) {
          lenis.scrollTo(section, {
            offset: -80,
            onComplete: () => {
              // Switch Action Hub to target tab
              if (typeof window.switchActionHubTab === "function") {
                window.switchActionHubTab(tabName);
              }
            }
          });
        }
      });
    });

    // 3. Regular Anchor Scroll intercepts (to use smooth Lenis scrolling)
    const anchorLinks = document.querySelectorAll('a[href^="#"]');
    anchorLinks.forEach((link) => {
      link.addEventListener("click", (e) => {
        const targetId = link.getAttribute("href");
        if (targetId && targetId !== "#" && !link.classList.contains("footer-project-trigger") && !link.classList.contains("footer-tab-trigger")) {
          e.preventDefault();
          const targetEl = document.querySelector(targetId);
          if (targetEl) {
            lenis.scrollTo(targetEl, {
              offset: -80
            });
          }
        }
      });
    });
  }
});

window.addEventListener("load", () => {
  ScrollTrigger.refresh();
});
