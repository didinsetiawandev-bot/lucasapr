    // GOOGLE SHEET INITIAL DATA (FALLBACK)
    const DEFAULT_DATA = {
      identity: {
        name: "Lucah Sabrina Puspa Ratih",
        nickname: "Sabrina",
        university: "Universitas Diponegoro",
        faculty: "Fakultas Ekonomika dan Bisnis",
        major: "S1 Akuntansi",
        semester: "Semester 2",
        location: "Semarang, Jawa Tengah",
        email: "lucahsabrina@students.undip.ac.id",
        bio: "Saya Sabrina, mahasiswi Akuntansi semester 2 di Universitas Diponegoro. Saya percaya bahwa angka adalah bahasa universal, dan saya belajar membacanya setiap hari — dengan presisi, dengan rasa penasaran, dan dengan semangat yang tidak padam.",
        cv_url: "#"
      },
      skills: [
        { name: "Akuntansi Dasar & Jurnal", category: "hard" },
        { name: "Microsoft Excel", category: "hard" },
        { name: "Penyusunan Laporan Keuangan", category: "hard" },
        { name: "MYOB / Software Akuntansi", category: "hard" },
        { name: "Analisis Data Keuangan", category: "hard" },
        { name: "Perpajakan Dasar", category: "hard" },
        { name: "Teliti & Detail-Oriented", category: "soft" },
        { name: "Pemikiran Analitis", category: "soft" },
        { name: "Manajemen Waktu", category: "soft" },
        { name: "Kerja Tim", category: "soft" },
        { name: "Komunikasi Efektif", category: "soft" },
        { name: "Problem Solving", category: "soft" },
        { name: "Etika Profesional", category: "soft" },
        { name: "Adaptif & Growth Mindset", category: "soft" }
      ],
      achievements: [
        { title: "Nilai A Pengantar Akuntansi I", issuer: "FEB Universitas Diponegoro", year: "2024", description: "Meraih nilai tertinggi pada mata kuliah inti akuntansi di semester pertama.", type: "prestasi" },
        { title: "Peserta Aktif HIMAKSI UNDIP", issuer: "Himpunan Mahasiswa Akuntansi UNDIP", year: "2024", description: "Bergabung sebagai anggota aktif divisi akademik organisasi mahasiswa akuntansi.", type: "prestasi" },
        { title: "Workshop Microsoft Excel untuk Akuntansi", issuer: "Lembaga Pengembangan Kompetensi UNDIP", year: "2024", description: "Menyelesaikan pelatihan intensif Excel tingkat lanjut untuk analisis keuangan.", type: "sertifikat" },
        { title: "Sertifikat Literasi Keuangan Dasar", issuer: "OJK — Otoritas Jasa Keuangan", year: "2024", description: "Lulus program literasi keuangan dasar yang diselenggarakan oleh OJK.", type: "sertifikat" },
        { title: "Volunteer Tutor Akuntansi", issuer: "Program Mandiri FEB UNDIP", year: "2025", description: "Diakui sebagai tutor sukarela untuk mahasiswa baru yang membutuhkan pendampingan belajar.", type: "prestasi" }
      ],
      experience: [
        { year: "2024", title: "MPKMB FEB UNDIP", role: "Peserta Orientasi Mahasiswa Baru", description: "Menjalani masa pengenalan kampus dan membangun jaringan awal bersama 200+ mahasiswa angkatan 2024." },
        { year: "2024", title: "Himpunan Mahasiswa Akuntansi (HIMAKSI) UNDIP", role: "Anggota Divisi Akademik", description: "Aktif menyelenggarakan seminar, sesi tutoring, dan publikasi materi belajar akuntansi untuk mahasiswa." },
        { year: "2025", title: "Tutor Sukarela Pengantar Akuntansi", role: "Asisten Belajar Mandiri", description: "Mendampingi rekan mahasiswa dalam memahami siklus akuntansi dasar hingga penyusunan laporan keuangan." }
      ],
      social: [
        { platform: "linkedin", url: "https://www.linkedin.com/in/lspusparatih/", label: "LinkedIn" },
        { platform: "github", url: "https://github.com/lspusparatih", label: "GitHub" },
        { platform: "email", url: "mailto:lucahsabrina@students.undip.ac.id", label: "Email" }
      ]
    };

    // LIGHTWEIGHT CUSTOM CSV PARSER
    function parseCSV(text) {
      const result = [];
      let row = [];
      let col = "";
      let insideQuote = false;
      
      for (let i = 0; i < text.length; i++) {
        const char = text[i];
        const nextChar = text[i + 1];
        
        if (insideQuote) {
          if (char === '"') {
            if (nextChar === '"') {
              col += '"';
              i++; // Skip double quote inside quotes
            } else {
              insideQuote = false;
            }
          } else {
            col += char;
          }
        } else {
          if (char === '"') {
            insideQuote = true;
          } else if (char === ',') {
            row.push(col.trim());
            col = "";
          } else if (char === '\r' || char === '\n') {
            row.push(col.trim());
            col = "";
            if (row.length > 0 && row.some(cell => cell !== "")) {
              result.push(row);
            }
            row = [];
            if (char === '\r' && nextChar === '\n') {
              i++; // Skip \n
            }
          } else {
            col += char;
          }
        }
      }
      
      if (col || row.length > 0) {
        row.push(col.trim());
        if (row.some(cell => cell !== "")) {
          result.push(row);
        }
      }
      
      return result;
    }

    // Convert CSV matrix representation to Array of Objects
    function csvToObjects(csvText) {
      const rows = parseCSV(csvText);
      if (rows.length < 2) return [];
      
      // Clean and normalize header names
      const headers = rows[0].map(h => h.toLowerCase().trim().replace(/^["']|["']$/g, ''));
      
      return rows.slice(1).map(row => {
        const obj = {};
        headers.forEach((header, index) => {
          let val = row[index] || "";
          // Strip any residual quotes
          val = val.trim().replace(/^["']|["']$/g, '');
          obj[header] = val;
        });
        return obj;
      });
    }

    // Dynamic UI Rendering
    function renderWebsite(data) {
      const iden = data.identity;

      // Render Document Title (Tab Title) & Nav Logo dynamically based on identity
      const nickname = iden.nickname || iden.name || 'Sabrina';
      const major = iden.major || 'Akuntansi';
      const university = iden.university || 'UNDIP';
      document.title = `Portofolio ${nickname} - Mahasiswi ${major} ${university}`;

      const navLogo = document.getElementById('nav-logo');
      if (navLogo) {
        navLogo.innerText = iden.nickname || 'LSPR';
      }

      // Render Stat Chips
      const statSem = document.getElementById('stat-semester');
      if (statSem) {
        statSem.innerText = iden.semester ? iden.semester.replace(/\D/g, '') || iden.semester : '3';
      }
      const statSkills = document.getElementById('stat-skills');
      if (statSkills) {
        statSkills.innerText = `${data.skills.length}+`;
      }
      const statAch = document.getElementById('stat-achievements');
      if (statAch) {
        statAch.innerText = `${data.achievements.length}+`;
      }

      // 1. Identity Render
      document.getElementById('hero-identity-label').innerText = `${iden.major || 'Akuntansi'} · ${iden.university || 'UNDIP'} · ${iden.semester || 'Semester 2'}`;
      document.getElementById('hero-name').innerText = iden.name || '';
      document.getElementById('hero-bio').innerText = iden.bio || '';
      document.getElementById('tentang-bio').innerText = iden.bio || '';
      
      document.getElementById('identitas-univ').innerText = iden.university || '';
      document.getElementById('identitas-fakultas').innerText = iden.faculty || '';
      document.getElementById('identitas-major').innerText = iden.major || '';
      document.getElementById('identitas-semester').innerText = iden.semester || '';
      
      document.getElementById('identitas-email').innerText = iden.email || '';
      document.getElementById('kontak-email').innerText = iden.email || '';
      document.getElementById('kontak-univ').innerText = iden.university || '';
      document.getElementById('kontak-location').innerText = iden.location || '';
      
      document.getElementById('footer-name').innerText = iden.name || '';
      document.getElementById('footer-sub').innerText = `${iden.major || ''} · ${iden.university || ''} · ${iden.location ? iden.location.split(',')[0] : ''}`;

      // 2. Social Links Render
      const linkedinObj = data.social.find(s => s && s.platform && s.platform.toLowerCase() === 'linkedin');
      const linkedinUrl = linkedinObj ? linkedinObj.url : '#';
      document.getElementById('nav-linkedin-link').setAttribute('href', linkedinUrl);
      document.getElementById('hero-linkedin-btn').setAttribute('href', linkedinUrl);
      document.getElementById('kontak-linkedin-btn').setAttribute('href', linkedinUrl);

      const githubObj = data.social.find(s => s && s.platform && s.platform.toLowerCase() === 'github');
      if (githubObj) {
        document.getElementById('kontak-github-link').setAttribute('href', githubObj.url);
      } else {
        document.getElementById('kontak-github-link').style.display = 'none';
      }

      // 3. Skills Rendering
      const hardSkillsCont = document.getElementById('hard-skills-container');
      const softSkillsCont = document.getElementById('soft-skills-container');
      hardSkillsCont.innerHTML = '';
      softSkillsCont.innerHTML = '';

      const chartIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="chip-icon"><line x1="18" y1="20" x2="18" y2="10"></line><line x1="12" y1="20" x2="12" y2="4"></line><line x1="6" y1="20" x2="6" y2="14"></line></svg>`;
      const sparkleIcon = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" class="chip-icon"><path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m0-12.728l.707.707m11.314 11.314l.707-.707M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"/></svg>`;

      data.skills.forEach(skill => {
        const chip = document.createElement('span');
        const isHard = skill && (skill.category || '').toLowerCase() === 'hard';
        chip.className = isHard ? 'chip-hard' : 'chip-soft';
        
        const icon = isHard ? chartIcon : sparkleIcon;
        chip.innerHTML = `${icon}${skill.name || ''}`;

        if (isHard) {
          hardSkillsCont.appendChild(chip);
        } else {
          softSkillsCont.appendChild(chip);
        }
      });

      // 4. Achievements & Certificates Render
      const prestasiCont = document.getElementById('prestasi-list');
      const sertifikatCont = document.getElementById('sertifikat-list');
      prestasiCont.innerHTML = '';
      sertifikatCont.innerHTML = '';

      data.achievements.forEach(ach => {
        const card = document.createElement('article');
        const isPrestasi = ach && (ach.type || '').toLowerCase() === 'prestasi';
        
        if (isPrestasi) {
          card.className = `card-achievement reveal`;
          card.innerHTML = `
            <span class="year">${ach.year}</span>
            <h4 class="title">${ach.title}</h4>
            <p class="issuer">${ach.issuer}</p>
            <p class="desc">${ach.description || ''}</p>
          `;
          prestasiCont.appendChild(card);
        } else {
          card.className = `card-cert reveal`;
          card.innerHTML = `
            <span class="year">${ach.year}</span>
            <h4 class="title">${ach.title}</h4>
            <p class="issuer">${ach.issuer}</p>
            <p class="desc">${ach.description || ''}</p>
          `;
          sertifikatCont.appendChild(card);
        }
      });

      // 5. Experience Render
      const expCont = document.getElementById('experience-container');
      expCont.innerHTML = '';

      data.experience.forEach(exp => {
        const card = document.createElement('article');
        card.className = `card-experience reveal`;
        
        card.innerHTML = `
          <div class="year-col">${exp.year}</div>
          <div class="divider"></div>
          <div class="content-col">
            <h4 class="title">${exp.title}</h4>
            <div class="role">${exp.role}</div>
            <p class="desc">${exp.description || ''}</p>
          </div>
        `;
        expCont.appendChild(card);
      });

      // Bind Observer Scroll Animation (fade & slide-up)
      initScrollAnimations();
    }

    // Clipboard Email Copy Feedback
    function copyEmail() {
      const emailText = document.getElementById('identitas-email').innerText;
      navigator.clipboard.writeText(emailText).then(() => {
        const tooltip = document.getElementById('copy-tooltip');
        tooltip.innerText = "Email Disalin! ✅";
        tooltip.classList.add('visible');
        setTimeout(() => {
          tooltip.classList.remove('visible');
          tooltip.innerText = "Salin Email";
        }, 2500);
      }).catch(err => {
        console.error('Failed to copy: ', err);
      });
    }

    // Scroll Animations (staggered & viewport checks)
    function initScrollAnimations() {
      const revealElements = document.querySelectorAll('.reveal, .card-achievement, .card-cert, .card-experience');
      
      const observerOptions = {
        root: null,
        rootMargin: '0px 0px -40px 0px',
        threshold: 0.1
      };

      const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // Apply delay to experience cards if visible together
            if (entry.target.classList.contains('experience-card')) {
              const childrenArray = Array.from(entry.target.parentNode.children);
              const index = childrenArray.indexOf(entry.target);
              entry.target.style.transitionDelay = `${index * 100}ms`;
            }
            entry.target.classList.add('active');
            observer.unobserve(entry.target);
          }
        });
      }, observerOptions);

      revealElements.forEach(el => {
        el.classList.add('reveal');
        observer.observe(el);
      });
    }

    // Toast Notification controller
    function showOfflineToast() {
      const toast = document.getElementById('toast');
      toast.classList.add('show');
      setTimeout(() => {
        toast.classList.remove('show');
      }, 4000);
    }

    // ─── JSONP LOADER ──────────────────────────────────────────────────────────
    // Menggunakan <script> tag bukan fetch() sehingga CORS tidak berlaku.
    // Google gviz/tq mendukung JSONP native melalui parameter responseHandler.
    // ────────────────────────────────────────────────────────────────────────────
    function fetchSheetTab(sheetId, tabName) {
      return new Promise((resolve, reject) => {
        // Nama callback unik per tab agar parallel load tidak bentrok
        const cbName = `_gs_${tabName.replace(/\W/g,'_')}_${Date.now()}`;
        const url = `https://docs.google.com/spreadsheets/d/${sheetId}/gviz/tq`
                  + `?tqx=out:json;reqId:0;responseHandler:${cbName}`
                  + `&headers=1`
                  + `&sheet=${encodeURIComponent(tabName)}`;

        // Timeout 15 detik
        const timer = setTimeout(() => {
          cleanup();
          reject(new Error(`[Sheet] Timeout tab "${tabName}" — sheet tidak merespons`));
        }, 15000);

        function cleanup() {
          clearTimeout(timer);
          delete window[cbName];
          const s = document.getElementById(cbName);
          if (s && s.parentNode) s.parentNode.removeChild(s);
        }

        // Google akan memanggil fungsi ini dengan data JSON
        window[cbName] = function(response) {
          cleanup();
          console.log(`[Sheet] ✅ Tab "${tabName}" diterima via JSONP`);
          if (response && response.status === 'ok' && response.table) {
            resolve(response.table);
          } else {
            const errMsg = response && response.errors
              ? response.errors.map(e => e.detailed_message || e.message).join('; ')
              : JSON.stringify(response);
            reject(new Error(`[Sheet] Error pada tab "${tabName}": ${errMsg}`));
          }
        };

        const script = document.createElement('script');
        script.id  = cbName;
        script.src = url;
        script.onerror = () => {
          cleanup();
          reject(new Error(`[Sheet] Gagal load script tab "${tabName}" — sheet belum di-share publik?`));
        };

        console.log(`[Sheet] Loading tab "${tabName}" via JSONP...`);
        document.head.appendChild(script);
      });
    }

    // Konversi format tabel gviz → array of plain objects
    function gvizToObjects(table) {
      if (!table || !table.cols || !table.rows) return [];
      
      // 1. Tentukan header awal dari table.cols
      let headers = table.cols.map(col => (col.label || col.id || '').toLowerCase().trim());
      let rows = table.rows;

      // Deteksi apakah header bawaan gviz adalah default (kosong atau cuma huruf A, B, C, dst.)
      const isDefaultHeaders = headers.every(h => !h || /^[a-z]$/i.test(h));

      // Jika header default, coba ambil dari baris pertama data sebagai header
      if (isDefaultHeaders && rows.length > 0) {
        const firstRow = rows[0];
        if (firstRow && firstRow.c) {
          const firstRowHeaders = firstRow.c.map(cell =>
            (cell && cell.v !== null && cell.v !== undefined) ? String(cell.v).toLowerCase().trim() : ''
          );
          // Jika ada minimal satu header yang valid
          if (firstRowHeaders.some(h => h !== '')) {
            headers = firstRowHeaders;
            rows = rows.slice(1); // Baris pertama adalah header, jadi sisanya adalah data
          }
        }
      }

      return rows
        .filter(row => row && row.c && row.c.some(cell => cell && cell.v !== null && cell.v !== undefined && cell.v !== ''))
        .map(row => {
          const obj = {};
          headers.forEach((h, i) => {
            if (!h) return;
            const cell = row.c ? row.c[i] : null;
            obj[h] = (cell && cell.v !== null && cell.v !== undefined) ? String(cell.v).trim() : '';
          });
          return obj;
        });
    }

    // Main controller
    async function init() {
      const loader = document.getElementById('loader');
      const isPlaceholder = typeof SHEET_ID === 'undefined'
        || SHEET_ID === "TEMPEL_ID_SHEET_KAMU_DI_SINI"
        || SHEET_ID.trim() === "";

      if (isPlaceholder) {
        console.log("[Sheet] SHEET_ID masih placeholder — menampilkan data offline.");
        renderWebsite(DEFAULT_DATA);
        showOfflineToast();
        loader.classList.add('fade-out');
        return;
      }

      console.log(`[Sheet] Memulai load via JSONP, SHEET_ID: ${SHEET_ID}`);
      const tabs = ['identity', 'skills', 'achievements', 'experience', 'social'];

      try {
        const tables = await Promise.all(tabs.map(tab => fetchSheetTab(SHEET_ID, tab)));
        console.log("[Sheet] ✅ Semua tab berhasil diterima. Parsing...");

        const identityRaw  = gvizToObjects(tables[0]);
        const skills       = gvizToObjects(tables[1]);
        const achievements = gvizToObjects(tables[2]);
        const experience   = gvizToObjects(tables[3]);
        const social       = gvizToObjects(tables[4]);

        console.log("[Sheet] Identity rows:", identityRaw.length, "| Skills:", skills.length,
                    "| Achievements:", achievements.length);

        // Konversi format key-value tab identity
        const identity = {};
        identityRaw.forEach(row => {
          const key = (row.key || '').toLowerCase().trim();
          if (key) identity[key] = row.value || '';
        });

        const finalData = {
          identity:     { ...DEFAULT_DATA.identity,     ...identity },
          skills:       skills.length       > 0 ? skills       : DEFAULT_DATA.skills,
          achievements: achievements.length > 0 ? achievements : DEFAULT_DATA.achievements,
          experience:   experience.length   > 0 ? experience   : DEFAULT_DATA.experience,
          social:       social.length       > 0 ? social       : DEFAULT_DATA.social
        };

        renderWebsite(finalData);
        loader.classList.add('fade-out');
        console.log("[Sheet] ✅ Website berhasil dirender dari Google Sheets!");

      } catch (err) {
        console.warn("[Sheet] ❌ Gagal load dari Google Sheets:", err.message);
        console.warn("[Sheet] Pastikan sheet sudah di-share 'Anyone with the link can view'");
        renderWebsite(DEFAULT_DATA);
        showOfflineToast();
        loader.classList.add('fade-out');
      }
    }

    // Navbar Scrolled Effect Listener
    window.addEventListener('scroll', () => {
      const navbar = document.querySelector('header.navbar');
      if (window.scrollY > 80) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    });

    // Mobile Hamburger Menu toggle triggers
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMenu() {
      menuBtn.classList.toggle('open');
      mobileMenu.classList.toggle('open');
      document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
    }

    menuBtn.addEventListener('click', toggleMenu);
    
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        if (mobileMenu.classList.contains('open')) {
          toggleMenu();
        }
      });
    });

    // Start App
    window.addEventListener('DOMContentLoaded', init);
