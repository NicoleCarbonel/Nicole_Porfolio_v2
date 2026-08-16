// ---- mobile menu toggle ----
  const menubar = document.getElementById('menubar');
  document.getElementById('navToggle').addEventListener('click', () => menubar.classList.toggle('open'));
  document.querySelectorAll('.menu-links a').forEach(a => a.addEventListener('click', () => menubar.classList.remove('open')));

  // ---- live clock + date (menu bar + hero widget) ----
  function pad(n){ return n.toString().padStart(2,'0'); }
  function updateClock(){
    const now = new Date();
    const hh = pad(now.getHours()), mm = pad(now.getMinutes());
    const dateStr = now.toLocaleDateString(undefined, { weekday:'short', month:'short', day:'numeric' });
    document.getElementById('bigClock').textContent = `${hh}:${mm}`;
    document.getElementById('bigDate').textContent = dateStr;
    document.getElementById('menuClock').textContent = `${dateStr} · ${hh}:${mm}`;
  }
  updateClock();
  setInterval(updateClock, 15000);

  // ---- live calendar widget ----
  function buildCalendar(){
    const now = new Date();
    const year = now.getFullYear(), month = now.getMonth();
    const monthName = now.toLocaleDateString(undefined, { month:'long', year:'numeric' });
    document.getElementById('calMonth').textContent = monthName;

    const firstDay = new Date(year, month, 1);
    const startOffset = (firstDay.getDay() + 6) % 7; // Monday-first
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const grid = document.getElementById('calGrid');
    grid.innerHTML = '';

    ['M','T','W','T','F','S','S'].forEach(d => {
      const el = document.createElement('div');
      el.className = 'dow'; el.textContent = d;
      grid.appendChild(el);
    });
    for(let i=0;i<startOffset;i++){ grid.appendChild(document.createElement('div')); }
    for(let d=1; d<=daysInMonth; d++){
      const el = document.createElement('div');
      el.className = 'day' + (d === now.getDate() ? ' today' : '');
      el.textContent = d;
      grid.appendChild(el);
    }
  }
  buildCalendar();

  // ---- scroll reveal ----
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('in'); io.unobserve(entry.target); } });
  }, { threshold:.15 });
  document.querySelectorAll('.reveal').forEach(el => io.observe(el));

  // ---- skill folder modal ----
  const folderData = {
    network: {
      icon: '🗂️',
      title: 'Network Infrastructure',
      groups: [
        { label: 'Protocols & Routing', items: ['OSPF','VLANs','Trunking','EtherChannel','Subnetting','IPv4/IPv6'] },
        { label: 'Hardware & Simulation', items: ['Cisco Packet Tracer','Switches','Routers'] },
        { label: 'Key Strengths', items: ['Topology Design','Traffic Management','Network Troubleshooting'] }
      ]
    },
    security: {
      icon: '🗂️',
      title: 'Cybersecurity & Defense',
      groups: [
        { label: 'Concepts', items: ['Firewalls','Access Control Lists (ACLs)','Threat Analysis','Network Security'] },
        { label: 'Tools & Environment', items: ['Wireshark','Linux','Network Hardening'] },
        { label: 'Key Strengths', items: ['Traffic Analysis','Defensive Architecture','Security Best Practices'] }
      ]
    },
    web: {
      icon: '🗂️',
      title: 'Embedded / Web / Technical Skills',
      groups: [
        { label: 'Languages & Web', items: ['HTML5','CSS3','JavaScript / React','Python','C/C++'] },
        { label: 'Hardware / Microcontrollers', items: ['ESP32','Sensors','Digital Logic Circuits'] },
        { label: 'Databases & Tools', items: ['MySQL','Git','VS Code','LaTeX'] }
      ]
    }
  };

  const folderOverlay = document.getElementById('folderModalOverlay');
  const folderTitleEl = document.getElementById('folderModalTitle');
  const folderIconEl = document.getElementById('folderModalIcon');
  const folderBodyEl = document.getElementById('folderModalBody');
  const folderCloseBtn = document.getElementById('folderModalClose');
  let lastFocusedFolder = null;

  function renderFolder(key){
    const data = folderData[key];
    if(!data) return;
    folderTitleEl.textContent = data.title;
    folderIconEl.textContent = data.icon;
    folderBodyEl.innerHTML = data.groups.map(group => `
      <div class="folder-group">
        <h4>${group.label}</h4>
        <div class="chip-row">
          ${group.items.map(item => `<span class="chip">${item}</span>`).join('')}
        </div>
      </div>
    `).join('');
  }

  window.openFolder = function(key){
    lastFocusedFolder = document.activeElement;
    renderFolder(key);
    folderOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    folderCloseBtn.focus();
  };

  function closeFolder(){
    folderOverlay.classList.remove('open');
    document.body.style.overflow = '';
    if(lastFocusedFolder) lastFocusedFolder.focus();
  }

  folderCloseBtn.addEventListener('click', closeFolder);
  folderOverlay.addEventListener('click', (e) => { if(e.target === folderOverlay) closeFolder(); });
  document.addEventListener('keydown', (e) => { if(e.key === 'Escape' && folderOverlay.classList.contains('open')) closeFolder(); });

  // ---- contact form (Formspree) ----
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    status.textContent = 'Sending…';
    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });
      if (response.ok) {
        status.textContent = '✓ Message sent — thanks for reaching out!';
        form.reset();
      } else {
        const data = await response.json().catch(() => null);
        status.textContent = (data && data.errors)
          ? '✗ ' + data.errors.map(err => err.message).join(', ')
          : '✗ Something went wrong. Please try again or email me directly.';
      }
    } catch (err) {
      status.textContent = '✗ Network error — please try again or email me directly.';
    } finally {
      submitBtn.disabled = false;
    }
  });