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

  // ---- contact form (demo only) ----
  const form = document.getElementById('contactForm');
  const status = document.getElementById('formStatus');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    status.textContent = '✓ Demo only — hook this up to Formspree/EmailJS to send for real.';
    form.reset();
  });
