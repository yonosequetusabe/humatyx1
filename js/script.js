// ===== SMOOTH SCROLL =====
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const targetId = this.getAttribute("href");
    if (targetId !== "#") {
      e.preventDefault();
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        window.scrollTo({
          top: targetElement.offsetTop - 80,
          behavior: "smooth"
        });
      }
    }
  });
});

// ===== BOTÓN "SOLICITAR REUNIÓN" =====
document.getElementById("solicitarBtn")?.addEventListener("click", (e) => {
  e.preventDefault();
  alert("Esta opción estará disponible próximamente. 😊");
});

// ===== MENÚ RESPONSIVE (Cierra el menú al hacer clic en un enlace) =====
const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
const navbarCollapse = document.querySelector(".navbar-collapse");

navLinks.forEach(link => {
  link.addEventListener("click", () => {
    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {
      toggle: false
    });
    bsCollapse.hide();
  });
});

// ===== FORMULARIO SOLICITUD: Empresa vs Candidato =====
(() => {
  const btnEmpresa = document.getElementById("btnEmpresa");
  const btnCandidato = document.getElementById("btnCandidato");
  const labelEmpresaCargo = document.getElementById("labelEmpresaCargo");
  const inputEmpresaCargo = document.getElementById("inputEmpresaCargo");
  const ayudaSelect = document.getElementById("ayudaSelect");
  const tipoField = document.getElementById("tipoSolicitante");

  if (!btnEmpresa || !btnCandidato || !labelEmpresaCargo || !inputEmpresaCargo || !ayudaSelect) return;

  const empresaOptions = [
    "Reclutamiento y Selección",
    "Consultoría en RR.HH.",
    "Capacitación",
    "Otro"
  ];

  const candidatoOptions = [
    "Enviar CV",
    "Estoy interesado",
    "No pude entrar a la reunión"
  ];

  const populateSelect = (options) => {
    ayudaSelect.innerHTML = "";
    const def = document.createElement("option");
    def.selected = true;
    def.textContent = "Selecciona una opción";
    ayudaSelect.appendChild(def);
    options.forEach(opt => {
      const o = document.createElement("option");
      o.textContent = opt;
      ayudaSelect.appendChild(o);
    });
  };

  const setTipo = (tipo) => {
    if (tipo === "empresa") {
      btnEmpresa.classList.add("active");
      btnCandidato.classList.remove("active");
      labelEmpresaCargo.textContent = "Empresa";
      inputEmpresaCargo.placeholder = "Nombre de tu empresa";
      populateSelect(empresaOptions);
      if (tipoField) tipoField.value = "Empresa";
    } else {
      btnCandidato.classList.add("active");
      btnEmpresa.classList.remove("active");
      labelEmpresaCargo.textContent = "Cargo";
      inputEmpresaCargo.placeholder = "Tu cargo o puesto";
      populateSelect(candidatoOptions);
      if (tipoField) tipoField.value = "Candidato";
    }
  };

  btnEmpresa.addEventListener("click", () => setTipo("empresa"));
  btnCandidato.addEventListener("click", () => setTipo("candidato"));

  // Estado inicial: Empresa
  setTipo("empresa");
})();

// ===== ENVÍO DE FORMULARIO POR EMAILJS =====
(() => {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const submitBtn = form.querySelector('button[type="submit"]');
  const responseBox = document.createElement("div");
  responseBox.className = "mt-3 form-response";
  form.appendChild(responseBox);

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    if (!window.emailjs || typeof emailjs.send !== "function") {
      showMessage("❌ No se pudo cargar el servicio de correo. Intenta nuevamente más tarde.", "danger");
      return;
    }

    try {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `<span class="spinner-border spinner-border-sm me-2"></span> Enviando...`;

      // 🧩 Parámetros para todos
      const params = {
        title: `Contacto: ${form.tipo?.value || "Sin tipo"}`,
        name: `${form.nombre?.value || ""} ${form.apellido?.value || ""}`.trim(),
        tipo: form.tipo?.value || "",
        nombre: form.nombre?.value || "",
        apellido: form.apellido?.value || "",
        email: form.email?.value || "",
        telefono: form.telefono?.value || "",
        empresa_cargo: form.empresa_cargo?.value || "",
        ayuda: form.ayuda?.value || "",
        mensaje: form.mensaje?.value || "",
        // Agregar campo para múltiples destinatarios
        to_emails: "carloschihua4@gmail.com, servicios.peru@humantyx.com"
      };

      const PUBLIC_KEY = "-uL-biHRp5GSP9cf4";

      // ✅ SOLO UN ENVÍO que llega a todos
      await emailjs.send("service_nov3vv4", "template_n42yk67", params, PUBLIC_KEY);

      showMessage("✅ ¡Gracias! Tu solicitud fue enviada correctamente.", "success");
      form.reset();
      document.getElementById("btnEmpresa")?.click();

    } catch (err) {
      console.error("⚠️ Error EmailJS:", err);
      showMessage("⚠️ Ocurrió un problema al enviar tu solicitud. Intenta nuevamente.", "warning");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Solicitar Reunión o Consulta";
    }
  });

  function showMessage(msg, type) {
    responseBox.innerHTML = `
      <div class="alert alert-${type} fade show" role="alert" style="transition: all .3s;">
        ${msg}
      </div>
    `;
    setTimeout(() => (responseBox.innerHTML = ""), 6000);
  }
})();