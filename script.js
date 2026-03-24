const reveals = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("on");
        revealObserver.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.1 },
);
reveals.forEach((el) => revealObserver.observe(el));

const navLinks = document.getElementById("navLinks");
const menuToggle = document.getElementById("menuToggle");
if (menuToggle && navLinks) {
  menuToggle.addEventListener("click", () => {
    const isOpen = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });
  navLinks.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const joinPilotBtn = document.getElementById("joinPilotBtn");
if (joinPilotBtn) {
  joinPilotBtn.addEventListener("click", () => {
    document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
  });
}

const sections = document.querySelectorAll("section[id]");
window.addEventListener(
  "scroll",
  () => {
    let current = "";
    sections.forEach((section) => {
      if (window.scrollY >= section.offsetTop - 120) {
        current = section.id;
      }
    });
    document.querySelectorAll(".nav-links a").forEach((link) => {
      link.classList.toggle(
        "active",
        link.getAttribute("href") === `#${current}`,
      );
    });
  },
  { passive: true },
);

function setCluster(index) {
  document.querySelectorAll(".clust[data-cluster]").forEach((cluster) => {
    cluster.classList.toggle(
      "active",
      Number(cluster.dataset.cluster) === index,
    );
  });
  ["dot0", "dot1", "dot2"].forEach((id, i) => {
    const dot = document.getElementById(id);
    if (dot) {
      dot.setAttribute("fill", i === index ? "#687D31" : "#6FA9BB");
    }
  });
}

document.querySelectorAll(".clust[data-cluster]").forEach((clusterEl) => {
  const index = Number(clusterEl.dataset.cluster);
  clusterEl.addEventListener("click", () => setCluster(index));
  clusterEl.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      setCluster(index);
    }
  });
});

document.querySelectorAll(".phase").forEach((phase) => {
  phase.addEventListener("click", () => {
    document
      .querySelectorAll(".phase")
      .forEach((p) => p.classList.remove("is-open"));
    phase.classList.add("is-open");
  });
});

const toast = document.getElementById("toast");
function showToast(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => toast.classList.remove("show"), 2200);
}

const marketSearch = document.getElementById("marketSearch");
const marketCluster = document.getElementById("marketCluster");
const marketCategory = document.getElementById("marketCategory");
const resultCount = document.getElementById("resultCount");
const demoOrders = document.getElementById("demoOrders");
const marketCards = document.querySelectorAll(".mcard");
let demoOrderCount = Number(
  localStorage.getItem("synaphse_demo_orders") || "0",
);
if (demoOrders) demoOrders.textContent = String(demoOrderCount);

function filterMarketplace() {
  if (!marketCards.length) return;
  const query = (marketSearch?.value || "").trim().toLowerCase();
  const cluster = marketCluster?.value || "all";
  const category = marketCategory?.value || "all";
  let count = 0;

  marketCards.forEach((card) => {
    const cardCluster = card.getAttribute("data-cluster");
    const cardCategory = card.getAttribute("data-category");
    const searchable = (card.getAttribute("data-search") || "").toLowerCase();
    const matchesQuery = !query || searchable.includes(query);
    const matchesCluster = cluster === "all" || cluster === cardCluster;
    const matchesCategory = category === "all" || category === cardCategory;
    const isMatch = matchesQuery && matchesCluster && matchesCategory;

    card.classList.toggle("hidden", !isMatch);
    if (isMatch) count += 1;
  });

  if (resultCount) resultCount.textContent = String(count);
}

marketSearch?.addEventListener("input", filterMarketplace);
marketCluster?.addEventListener("change", filterMarketplace);
marketCategory?.addEventListener("change", filterMarketplace);
filterMarketplace();

document.querySelectorAll(".demo-order-btn").forEach((button) => {
  button.addEventListener("click", (event) => {
    const card = event.currentTarget.closest(".mcard");
    const seller = card?.querySelector("h4")?.textContent || "Selected Seller";
    demoOrderCount += 1;
    localStorage.setItem("synaphse_demo_orders", String(demoOrderCount));
    if (demoOrders) demoOrders.textContent = String(demoOrderCount);
    showToast(`Demo order created for ${seller}`);
  });
});

const budgetFills = document.querySelectorAll(".budget-fill");
const budgetSection = document.getElementById("budget");
if (budgetSection && budgetFills.length) {
  const budgetObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          budgetFills.forEach((fill) => {
            const width = fill.getAttribute("data-width");
            fill.style.width = `${width}%`;
          });
          budgetObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.35 },
  );
  budgetObserver.observe(budgetSection);
}

const form = document.getElementById("interestForm");
const submitBtn = document.getElementById("submitBtn");
if (form && submitBtn) {
  const storedName = localStorage.getItem("synaphse_name");
  const storedEmail = localStorage.getItem("synaphse_email");
  if (storedName) {
    const fullName = document.getElementById("fullName");
    if (fullName) fullName.value = storedName;
  }
  if (storedEmail) {
    const emailAddress = document.getElementById("emailAddress");
    if (emailAddress) emailAddress.value = storedEmail;
  }

  form.addEventListener("submit", (event) => {
    event.preventDefault();
    const fullName = document.getElementById("fullName");
    const emailAddress = document.getElementById("emailAddress");
    if (!fullName || !emailAddress) return;

    if (fullName.value.trim().length < 3) {
      fullName.focus();
      showToast("Please enter your full name.");
      return;
    }

    if (!emailAddress.value.includes("@")) {
      emailAddress.focus();
      showToast("Please enter a valid email address.");
      return;
    }

    localStorage.setItem("synaphse_name", fullName.value.trim());
    localStorage.setItem("synaphse_email", emailAddress.value.trim());

    submitBtn.textContent = "Registered Successfully";
    submitBtn.style.background = "#406768";
    submitBtn.disabled = true;
    showToast("Registration submitted successfully.");

    setTimeout(() => {
      submitBtn.textContent = "Submit Registration →";
      submitBtn.style.background = "";
      submitBtn.disabled = false;
      form.reset();
    }, 3500);
  });
}
