// --- SCROLLTRIGGER AKTİVASYONU ---
gsap.registerPlugin(ScrollTrigger);

// ==========================================================================
// 1. SECTION: UZAY VE GİRİŞ (THREE.JS)
// ==========================================================================
let scene, camera, renderer, stars, starGeo;
const starCount = 6000;

function init() {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    1,
    3000,
  );
  camera.position.set(0, 0, 500);

  renderer = new THREE.WebGLRenderer({
    canvas: document.getElementById("starfield"),
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  starGeo = new THREE.BufferGeometry();
  const starPositions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount; i++) {
    starPositions[i * 3] = (Math.random() - 0.5) * 2500;
    starPositions[i * 3 + 1] = (Math.random() - 0.5) * 2500;
    starPositions[i * 3 + 2] = Math.random() * 3000 - 2000;
  }

  starGeo.setAttribute("position", new THREE.BufferAttribute(starPositions, 3));

  const starMaterial = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 1.2,
    transparent: true,
    opacity: 0.9,
    blending: THREE.AdditiveBlending,
  });

  stars = new THREE.Points(starGeo, starMaterial);
  scene.add(stars);

  gsap.set(".hero-text", { xPercent: -50, yPercent: -50 });

  setupScrollAnimation();
  animate();
}

function setupScrollAnimation() {
  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#hero",
      start: "top top",
      end: "+=4000",
      scrub: 1.5,
      pin: true,
      invalidateOnRefresh: true,
    },
  });

  tl.to(camera.position, { z: -1400, ease: "none" }, 0);
  tl.to(
    ".text-1",
    { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.2 },
    0,
  );
  tl.to(
    ".text-1",
    { opacity: 0, scale: 1.6, filter: "blur(15px)", duration: 0.8 },
    0.4,
  );
  tl.fromTo(
    ".text-2",
    { opacity: 0, scale: 0.5, filter: "blur(15px)" },
    { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8 },
    1.2,
  );
  tl.to(
    ".text-2",
    { opacity: 0, scale: 1.6, filter: "blur(15px)", duration: 0.8 },
    2.2,
  );
  tl.fromTo(
    ".text-3",
    { opacity: 0, scale: 0.5, filter: "blur(15px)" },
    { opacity: 1, scale: 1, filter: "blur(0px)", duration: 0.8 },
    3.2,
  );
}

function animate() {
  requestAnimationFrame(animate);
  if (stars) {
    stars.rotation.z += 0.0002;
  }
  renderer.render(scene, camera);
}

window.addEventListener("resize", () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// ==========================================================================
// 2. SECTION: ZAMAN SAYAÇ MOTORU VE KALP ÇİZİMİ
// ==========================================================================
const iliskiBaslangic = new Date(2024, 1, 13, 17, 20, 0);

function askSayaciniGuncelle() {
  const simdi = new Date();
  const zamanFarki = simdi - iliskiBaslangic;

  if (zamanFarki < 0) return;

  const saniyeMs = 1000;
  const dakikaMs = saniyeMs * 60;
  const saatMs = dakikaMs * 60;
  const gunMs = saatMs * 24;

  const gun = Math.floor(zamanFarki / gunMs);
  const saat = Math.floor((zamanFarki % gunMs) / saatMs);
  const dakika = Math.floor((zamanFarki % saatMs) / dakikaMs);
  const saniye = Math.floor((zamanFarki % dakikaMs) / saniyeMs);

  document.getElementById("days").innerText = String(gun).padStart(2, "0");
  document.getElementById("hours").innerText = String(saat).padStart(2, "0");
  document.getElementById("minutes").innerText = String(dakika).padStart(
    2,
    "0",
  );
  document.getElementById("seconds").innerText = String(saniye).padStart(
    2,
    "0",
  );
}

function kalpCiziminiBaslat() {
  const heartSvg = document.querySelector(".bg-heart");
  const counterSection = document.getElementById("counter-section");
  if (!heartSvg || !counterSection) return;

  const secOptions = { root: null, threshold: 0.5 };
  const sectionObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        heartSvg.classList.add("draw");
        observer.unobserve(entry.target);
      }
    });
  }, secOptions);

  sectionObserver.observe(counterSection);
}

// ==========================================================================
// 3. SECTION: ZARFLAR VE TIMELINE ANİMASYONU
// ==========================================================================
function zarfAnimasyonlariniKur() {
  gsap.to("#counter-section", {
    scrollTrigger: {
      trigger: "#timeline-section",
      start: "top bottom",
      end: "top top",
      scrub: true,
    },
    scale: 0.85,
    opacity: 0,
    y: -50,
    ease: "none",
  });

  gsap.to(".timeline-line-progress", {
    scrollTrigger: {
      trigger: ".envelopes-wrapper",
      start: "top center",
      end: "bottom center",
      scrub: 0.5,
    },
    height: "100%",
    ease: "none",
  });

  const zarflar = document.querySelectorAll(".envelope-item");
  zarflar.forEach((zarf) => {
    ScrollTrigger.create({
      trigger: zarf,
      start: "top center+=50",
      onEnter: () => zarf.classList.add("is-open"),
      onLeaveBack: () => zarf.classList.remove("is-open"),
    });
  });
}

// ==========================================================================
// 4. & 5. SECTION: ZARİF GALERİ VE DEV KALP GEÇİŞİ
// ==========================================================================
function yeniGaleriAnimasyonlariniKur() {
  gsap.utils.toArray(".gallery-card").forEach((card) => {
    gsap.from(card, {
      scrollTrigger: {
        trigger: card,
        start: "top 85%",
        toggleActions: "play none none reverse",
      },
      y: 80,
      opacity: 0,
      duration: 1.2,
      ease: "power3.out",
    });
  });

  const heartTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: "#heart-transition-section",
      start: "center center",
      end: "+=2500",
      scrub: 1.5,
      pin: true,
    },
  });

  heartTimeline
    .to(
      "#photo-5 .photo-frame, #photo-5 .final-caption",
      { opacity: 0, scale: 0.8, duration: 0.5 },
      0,
    )
    .to("#the-heart", { scale: 150, duration: 3, ease: "power2.inOut" }, 0)
    .to(".heart-final-text", { opacity: 1, y: -20, duration: 1 }, 2.2);
}

// ==========================================================================
// 6. SECTION: BLUEPRINT (GELECEĞİN MİMARI)
// ==========================================================================
function blueprintAnimasyonunuKur() {
  gsap.set(".blueprint-text h2, .blueprint-text p", { opacity: 0, y: 30 });

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#blueprint-section",
      start: "top 60%",
      toggleActions: "play none none reverse",
    },
  });

  tl.to(".infinity-path", {
    strokeDashoffset: 0,
    duration: 2.5,
    ease: "power2.inOut",
  })
    .to(
      ".blueprint-text h2",
      { opacity: 1, y: 0, duration: 0.8, ease: "back.out(1.7)" },
      "-=1",
    )
    .to(
      ".blueprint-text p",
      { opacity: 1, y: 0, duration: 0.8, stagger: 0.3, ease: "power2.out" },
      "-=0.4",
    );
}

// ==========================================================================
// 7. SECTION: YOLCULUK HARİTASI (JOURNEY MAP)
// ==========================================================================
function haritaAnimasyonlariniKur() {
  const pathSvg = document.querySelector(".journey-path-svg");
  if (pathSvg) {
    const glowLine = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "path",
    );
    const originalPath = document
      .querySelector(".journey-path-line")
      .getAttribute("d");
    glowLine.setAttribute("d", originalPath);
    glowLine.setAttribute("class", "journey-path-line glow-line");
    pathSvg.appendChild(glowLine);

    const pathLength = glowLine.getTotalLength();
    gsap.set(glowLine, {
      strokeDasharray: pathLength,
      strokeDashoffset: pathLength,
    });

    gsap.to(glowLine, {
      strokeDashoffset: 0,
      ease: "none",
      scrollTrigger: {
        trigger: ".journey-container",
        start: "top center",
        end: "bottom center",
        scrub: 1,
      },
    });
  }

  gsap.utils.toArray(".journey-node").forEach((node, i) => {
    gsap.to(node, {
      scrollTrigger: {
        trigger: node,
        start: "top 80%",
        toggleActions: "play none none reverse",
      },
      opacity: 1,
      y: 0,
      duration: 1,
      ease: "power3.out",
      delay: i * 0.1,
    });
  });
}

// ==========================================================================
// 8. SECTION: İKİLİ PLAK ÇALAR
// ==========================================================================
const players = {
  1: { defaultColor: "#ff2e63", defaultShadow: "rgba(255, 46, 99, 0.4)" },
  2: { defaultColor: "#ffaa00", defaultShadow: "rgba(255, 170, 0, 0.4)" },
};

window.toggleMusic = function (playerId) {
  const audio = document.getElementById(`audio-${playerId}`);
  const turntable = document.getElementById(`turntable-${playerId}`);
  const record = document.getElementById(`record-${playerId}`);
  const btn = document.getElementById(`btn-${playerId}`);
  const icon = document.getElementById(`icon-${playerId}`);

  const otherPlayerId = playerId === 1 ? 2 : 1;
  const otherAudio = document.getElementById(`audio-${otherPlayerId}`);

  audio.volume = 0.5;

  if (audio.paused) {
    if (!otherAudio.paused) {
      otherAudio.pause();
      document
        .getElementById(`turntable-${otherPlayerId}`)
        .classList.remove("playing");
      document
        .getElementById(`record-${otherPlayerId}`)
        .classList.remove("spinning");

      const otherBtn = document.getElementById(`btn-${otherPlayerId}`);
      document.getElementById(`icon-${otherPlayerId}`).innerText = "▶ Başlat";
      otherBtn.style.background = players[otherPlayerId].defaultColor;
      otherBtn.style.boxShadow = `0 10px 25px ${players[otherPlayerId].defaultShadow}`;
    }

    audio.play();
    turntable.classList.add("playing");
    record.classList.add("spinning");
    icon.innerText = "⏸ Duraklat";
    btn.style.background = "#4ade80";
    btn.style.boxShadow = "0 10px 25px rgba(74, 222, 128, 0.4)";
  } else {
    audio.pause();
    turntable.classList.remove("playing");
    record.classList.remove("spinning");
    icon.innerText = "▶ Başlat";
    btn.style.background = players[playerId].defaultColor;
    btn.style.boxShadow = `0 10px 25px ${players[playerId].defaultShadow}`;
  }
};

function ikiliPlakAnimasyonunuKur() {
  gsap.from(".record-player-card", {
    scrollTrigger: {
      trigger: "#music-section",
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
    y: 80,
    opacity: 0,
    duration: 1,
    stagger: 0.3,
    ease: "power3.out",
  });
}

// ==========================================================================
// 9. SECTION: TURBO DOĞUM GÜNÜ PASTASI (DÜZELTİLDİ: PÜRÜZSÜZ GİRİŞ)
// ==========================================================================
function pastaAnimasyonunuKur() {
  const candles = document.querySelectorAll(".candle");
  const note = document.getElementById("cake-note");
  const instruction = document.getElementById("birthday-instruction");

  let blownOutCount = 0;

  candles.forEach((candle) => {
    candle.addEventListener("click", function () {
      if (!this.classList.contains("is-blown")) {
        this.classList.add("is-blown");

        const flame = this.querySelector(".flame");
        const smoke = this.querySelector(".smoke");

        // Alevi anında yok et
        gsap.to(flame, {
          scaleX: 0.1,
          scaleY: 1.5,
          y: -15,
          opacity: 0,
          duration: 0.15,
          ease: "power4.in",
          onComplete: () => {
            flame.style.display = "none";
          },
        });

        // Dumanı tüttür
        gsap.fromTo(
          smoke,
          { opacity: 0.8, scale: 0.5, y: 0 },
          { opacity: 0, scale: 4, y: -60, duration: 1.2, ease: "power2.out" },
        );

        blownOutCount++;

        // Tüm mumlar sönünce not fırlasın
        if (blownOutCount === 3) {
          instruction.innerText = "Dileğin kabul oldu! 🎉";
          instruction.style.color = "#ff2e63";

          gsap.to(note, {
            y: -220,
            opacity: 1,
            scale: 1,
            zIndex: 20,
            duration: 1.5,
            ease: "elastic.out(1, 0.7)",
            delay: 0.4,
          });
        }
      }
    });
  });

  // HATA BURADAYDI ÇÖZÜLDÜ: Elemanlar sırayla (stagger) ve erkenden (top 95%) geliyor
  gsap.from(".birthday-title, .birthday-instruction, .cake-wrapper", {
    scrollTrigger: {
      trigger: "#birthday-section",
      start: "top 95%", // Section ekrana girdiği an animasyon başlar
      toggleActions: "play none none reverse",
    },
    y: 80,
    opacity: 0,
    duration: 1.2,
    stagger: 0.25, // Önce başlık, sonra yazı, sonra pasta süzülür
    ease: "power3.out",
  });
}

// ==========================================================================
// 10. SECTION: HIZLANDIRILMIŞ DİLEK FENERİ MOTORU
// ==========================================================================
function dilekFeneriSisteminiKur() {
  const button = document.getElementById("wish-button");
  const container = document.getElementById("lantern-container");

  if (!button || !container) return;

  button.addEventListener("click", () => {
    const lantern = document.createElement("div");
    lantern.classList.add("sky-lantern");

    lantern.innerHTML = `
      <svg viewBox="0 0 100 130" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 20 Q50 -15 80 20 L90 90 Q50 120 10 90 Z" fill="url(#lantern-grad)" stroke="rgba(255, 100, 0, 0.8)" stroke-width="1.5"/>
        <ellipse cx="50" cy="95" rx="35" ry="12" fill="#3a1c0d"/>
        <circle cx="50" cy="90" r="10" fill="#ffffff" filter="blur(3px)"/>
        <circle cx="50" cy="90" r="20" fill="#ffaa00" opacity="0.8" filter="blur(6px)"/>
        <defs>
          <radialGradient id="lantern-grad" cx="50%" cy="80%" r="80%" fx="50%" fy="80%">
            <stop offset="0%" stop-color="#ffcc00" stop-opacity="0.95"/>
            <stop offset="60%" stop-color="#ff6600" stop-opacity="0.85"/>
            <stop offset="100%" stop-color="#cc2200" stop-opacity="0.9"/>
          </radialGradient>
        </defs>
      </svg>
    `;

    container.appendChild(lantern);

    const startX = gsap.utils.random(20, window.innerWidth - 80);
    const flightDuration = gsap.utils.random(3, 5.5);
    const sway = gsap.utils.random(-150, 150);
    const scaleRandom = gsap.utils.random(0.7, 1.2);

    gsap.set(lantern, {
      x: startX,
      y: 50,
      scale: scaleRandom,
      opacity: 0,
      rotation: gsap.utils.random(-15, 15),
    });

    const tl = gsap.timeline({
      onComplete: () => {
        lantern.remove();
      },
    });

    tl.to(lantern, { opacity: 1, duration: 0.2 })
      .to(
        lantern,
        {
          y: -window.innerHeight - 150,
          x: startX + sway,
          rotation: gsap.utils.random(-20, 20),
          duration: flightDuration,
          ease: "power1.out",
        },
        "<",
      )
      .to(lantern, { opacity: 0, duration: 0.8 }, "-=0.8");
  });
}

// ==========================================================================
// 11. SECTION: YILDIZLARIN BİRLEŞMESİ (BÜYÜK FİNAL)
// ==========================================================================
function yildizlariOlustur(pathId, groupId, starClass, bosluk) {
  const path = document.getElementById(pathId);
  const group = document.getElementById(groupId);
  if (!path || !group) return [];

  const length = path.getTotalLength();
  const stars = [];

  for (let i = 0; i <= length; i += bosluk) {
    const point = path.getPointAtLength(i);
    const circle = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "circle",
    );

    circle.setAttribute("cx", point.x);
    circle.setAttribute("cy", point.y);
    circle.setAttribute("r", gsap.utils.random(1, 2.5));
    circle.setAttribute("class", `constellation-star ${starClass}`);
    circle.style.animationDelay = `${gsap.utils.random(0, 2)}s`;

    group.appendChild(circle);
    stars.push(circle);
  }
  return stars;
}

function finalAnimasyonunuKur() {
  const starsC = yildizlariOlustur("path-C", "stars-C", "star-white", 6);
  const starsInf = yildizlariOlustur(
    "path-infinity",
    "stars-infinity",
    "star-pink",
    5,
  );
  const starsE = yildizlariOlustur("path-E", "stars-E", "star-white", 6);

  const allStars = [...starsC, ...starsInf, ...starsE];

  const tl = gsap.timeline({
    scrollTrigger: {
      trigger: "#final-section",
      start: "top 35%",
      toggleActions: "play none none reverse",
    },
  });

  tl.from(allStars, {
    x: () => gsap.utils.random(-1500, 1500),
    y: () => gsap.utils.random(-1000, 1000),
    opacity: 0,
    scale: 0,
    duration: 3,
    stagger: {
      amount: 2,
      from: "random",
    },
    ease: "power4.out",
  })
    .to(
      ".final-line1",
      { opacity: 1, y: 0, duration: 1.2, ease: "power2.out" },
      "-=1",
    )
    .to(
      ".final-line2",
      { opacity: 1, y: 0, duration: 1.8, ease: "power2.out" },
      "+=0.3",
    );
}

// ==========================================================================
// ANA YÜKLEME (LOAD) MERKEZİ - BÜTÜN SİSTEM BURADAN ÇALIŞIR
// ==========================================================================
window.addEventListener("load", () => {
  // Bütün fonksiyonları tek bir yerden güvenle çağırıyoruz
  init();
  askSayaciniGuncelle();
  setInterval(askSayaciniGuncelle, 1000);
  kalpCiziminiBaslat();
  zarfAnimasyonlariniKur();
  yeniGaleriAnimasyonlariniKur();
  blueprintAnimasyonunuKur();
  haritaAnimasyonlariniKur();
  ikiliPlakAnimasyonunuKur();
  pastaAnimasyonunuKur();
  dilekFeneriSisteminiKur();
  finalAnimasyonunuKur();

  // Tüm DOM ve resimler yüklendikten sonra GSAP hiza hesaplamalarını tazeler
  setTimeout(() => {
    ScrollTrigger.refresh();
  }, 500);
});
// ==========================================================================
// 0. ŞİFRE EKRANI MOTORU
// ==========================================================================
function sifreSisteminiKur() {
  // Sayfa açılır açılmaz scroll'u kilitle
  document.body.classList.add("locked");

  const pwdScreen = document.getElementById("password-screen");
  const pwdInput = document.getElementById("magic-password");
  const unlockBtn = document.getElementById("unlock-btn");
  const errorMsg = document.getElementById("error-msg");

  // Doğru Şifre
  const thePassword = "Samsun055.";

  function kilitAcmayiDene() {
    if (pwdInput.value === thePassword) {
      // ŞİFRE DOĞRU! Kilit ekranını zarifçe kaldır
      gsap.to(pwdScreen, {
        opacity: 0,
        y: -100, // Yukarı doğru süzülerek gitsin
        duration: 1,
        ease: "power3.inOut",
        onComplete: () => {
          pwdScreen.style.display = "none"; // DOM'dan gizle
          document.body.classList.remove("locked"); // Scroll kilidini aç

          // Şifre ekranı kalktıktan sonra tüm GSAP hizalamalarını tazele ki kayma olmasın
          ScrollTrigger.refresh();
        },
      });
    } else {
      // ŞİFRE YANLIŞ! Ekranı titreterek hata ver
      errorMsg.style.display = "block";

      // GSAP Titreme Efekti (Hata hissi)
      gsap.fromTo(
        ".password-card",
        { x: -10 },
        { x: 10, yoyo: true, repeat: 5, duration: 0.08, ease: "linear" },
      );

      // Input içini temizle
      pwdInput.value = "";
    }
  }

  // Butona tıklandığında kontrol et
  unlockBtn.addEventListener("click", kilitAcmayiDene);

  // Enter tuşuna basıldığında da kontrol et
  pwdInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      kilitAcmayiDene();
    }
  });
}

// Bunu da window load event'ine ekliyoruz (Eğer en alttaki load merkezini kullanıyorsan onun içine sifreSisteminiKur(); yazman yeterli)
window.addEventListener("load", () => {
  sifreSisteminiKur();
});
