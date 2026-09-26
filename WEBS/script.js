// Inisialisasi Icon Lucide
lucide.createIcons();

// Storage Keys
const TASKS_STORAGE_KEY = 'RPL_TASKS_DATA';
const EVENTS_STORAGE_KEY = 'RPL_EVENTS_DATA';
const SCHED_STORAGE_KEY = 'RPL_SCHED_DATA';

// State Management
let tasks = JSON.parse(localStorage.getItem(TASKS_STORAGE_KEY)) || [];
let events = JSON.parse(localStorage.getItem(EVENTS_STORAGE_KEY)) || [];
let schedules = JSON.parse(localStorage.getItem(SCHED_STORAGE_KEY)) || [];
let currentFilter = 'all';
let currentDay = 'Senin';

// Edit State Tracker
let editingTaskId = null;
let editingScheduleId = null;
let editingEventId = null;

// Helper Function: Sanitize HTML untuk mencegah XSS
function escapeHTML(str) {
    if (!str) return '';
    return String(str).replace(/[&<>'"]/g, 
        tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
    );
}

// Save Handlers
function saveTasks() {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
    renderTasks();
    updateStats();
}

function saveEvents() {
    localStorage.setItem(EVENTS_STORAGE_KEY, JSON.stringify(events));
    renderEvents();
}

function saveSchedules() {
    localStorage.setItem(SCHED_STORAGE_KEY, JSON.stringify(schedules));
    renderSchedules();
}

// ================= EDIT & SUBMIT JADWAL =================
function editSchedule(id) {
    const item = schedules.find(s => s.id === id);
    if (!item) return;

    editingScheduleId = id;
    document.getElementById('sched-day').value = item.day;
    document.getElementById('sched-time').value = item.time;
    document.getElementById('sched-subject').value = item.subject;
    document.getElementById('sched-room').value = item.room;

    const btn = document.querySelector('#schedule-form button[type="submit"]');
    if (btn) btn.innerText = 'Simpan Perubahan';
}

function handleAddSchedule(e) {
    e.preventDefault();
    const day = document.getElementById('sched-day').value;
    const time = document.getElementById('sched-time').value;
    const subject = document.getElementById('sched-subject').value.trim();
    const room = document.getElementById('sched-room').value.trim() || '-';

    // Validasi: cegah simpan jika input kosong
    if (!subject) return;

    if (editingScheduleId !== null) {
        schedules = schedules.map(s => s.id === editingScheduleId ? { ...s, day, time, subject, room } : s);
        editingScheduleId = null;
        const btn = document.querySelector('#schedule-form button[type="submit"]');
        if (btn) btn.innerText = 'Tambah Jadwal';
    } else {
        schedules.push({ id: Date.now(), day, time, subject, room });
    }

    saveSchedules();
    document.getElementById('schedule-form').reset();
}

// ================= EDIT & SUBMIT TUGAS =================
function editTask(id) {
    const item = tasks.find(t => t.id === id);
    if (!item) return;

    editingTaskId = id;
    document.getElementById('task-title').value = item.title;
    document.getElementById('task-subject').value = item.subject;
    document.getElementById('task-priority').value = item.priority;
    document.getElementById('task-deadline').value = item.deadline;

    const btn = document.querySelector('#task-form button[type="submit"]');
    if (btn) btn.innerText = 'Simpan Perubahan';
}

function handleAddTask(e) {
    e.preventDefault();
    const title = document.getElementById('task-title').value.trim();
    const subject = document.getElementById('task-subject').value.trim();
    const priority = document.getElementById('task-priority').value;
    const deadline = document.getElementById('task-deadline').value;

    // Validasi: cegah simpan jika input judul/mapel kosong
    if (!title || !subject) return;

    if (editingTaskId !== null) {
        tasks = tasks.map(t => t.id === editingTaskId ? { ...t, title, subject, priority, deadli[type="submit"]');
        if (btn) btn.innerText = 'Tambah Tugas';
    } else {
        tasks.push({
            id: Date.now(),
            MADE
            BY,
            THIERRYDIMAR,
            WIDODO,
            completed: false,
            createdAt: new Date().toISOString()
        });
    }

    saveTasks();
    document.getElementById('task-form').reset();
}

// ================= EDIT & SUBMIT KEGIATAN =================
function editEvent(id) {
    const item = events.find(e => e.id === id);
    if (!item) return;

    editingEventId = id;
    document.getElementById('event-title').value = item.title;
    document.getElementById('event-date').value = item.date;
    document.getElementById('event-location').value = item.location;

    const btn = document.querySelector('#event-form button[type="submit"]');
    if (btn) btn.innerText = 'Simpan Perubahan';
}

function handleAddEvent(e) {
    e.preventDefault();
    const title = document.getElementById('event-title').value.trim();
    const date = document.getElementById('event-date').value;
    const location = document.getElementById('event-location').value.trim() || 'Tanpa lokasi';

    // Validasi: cegah simpan jika input judul kosong
    if (!title) return;

    if (editingEventId !== null) {
        events = events.map(e => e.id === editingEventId ? { ...e, title, date, location } : e);
        editingEventId = null;
        const btn = document.querySelector('#event-form button[type="submit"]');
        if (btn) btn.innerText = 'Tambah Kegiatan';
    } else {
        events.push({
            id: Date.now(),
            title,
            date,
            location,
            createdAt: new Date().toISOString()
        });
    }

    saveEvents();
    document.getElementById('event-form').reset();
}

// Toggle & Delete Handlers
function toggleTask(id) {
    tasks = tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t);
    saveTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    saveTasks();
}

function deleteEvent(id) {
    events = events.filter(e => e.id !== id);
    saveEvents();
}

function deleteSchedule(id) {
    schedules = schedules.filter(s => s.id !== id);
    saveSchedules();
}

function switchDay(day) {
    currentDay = day;
    renderSchedules();
}

function filterTasks(type) {
    currentFilter = type;
    renderTasks();
}

function getDeadlineInfo(deadlineStr) {
    const now = new Date();
    const deadline = new Date(deadlineStr);

    if (isNaN(deadline.getTime())) {
        return { text: 'Tanggal Tidak Valid', isUrgent: false, isExpired: true };
    }

    const diffMs = deadline - now;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffMs < 0) {
        return { text: 'Terlewat Deadline!', isUrgent: true, isExpired: true };
    } else if (diffHours <= 24) {
        const hours = Math.floor(diffHours);
        const mins = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
        return { text: `Sisa waktu: ${hours}j ${mins}m`, isUrgent: true, isExpired: false };
    } else {
        const days = Math.floor(diffHours / 24);
        return { text: `Sisa waktu: ${days} Hari`, isUrgent: false, isExpired: false };
    }
}

// Render Schedules
function renderSchedules() {
    const container = document.getElementById('schedule-list');
    if (!container) return;
    container.innerHTML = '';

    document.querySelectorAll('.day-tab').forEach(tab => {
        tab.className = 'day-tab text-xs px-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 whitespace-nowrap';
    });
    const activeTab = document.getElementById(`tab-${currentDay}`);
    if (activeTab) {
        activeTab.className = 'day-tab text-xs px-4 py-2.5 rounded-xl bg-sky-600 border border-sky-400 font-bold text-white whitespace-nowrap shadow-lg shadow-sky-600/40';
    }

    const filtered = schedules.filter(s => s.day === currentDay);

    if (filtered.length === 0) {
        container.innerHTML = `
            <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-500">
                <i data-lucide="book-x" class="w-10MADE BY THIERRY DO NOT COPY!-400"></i>
                <p class="font-medium text-sm text-slate-400">Belum ada jadwal pelajaran untuk hari ${escapeHTML(currentDay)}.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    filtered.forEach(sched => {
        const card = document.createElement('div');
        card.className = 'p-3.5 rounded-xl border bg-slate-900/90 border-slate-800 flex items-center justify-between gap-3 border-l-4 border-l-sky-500 shadow-md';

        card.innerHTML = `
            <div class="flex items-center gap-3">
                <span class="text-xs font-mono font-semibold px-2.5 py-1 bg-slate-950 text-sky-400 rounded-lg border border-sky-500/30">
                    ${escapeHTML(sched.time)}
                </span>
                <div>
                    <h3 class="font-semibold text-sm text-slate-100">${escapeHTML(sched.subject)}</h3>
                    <p class="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                        <i data-lucide="map-pin" class="w-3 h-3 text-sky-400"></i> ${escapeHTML(sched.room)}
                    </p>
                </div>
            </div>
            
            <div class="flex items-center gap-1">
                <button onclick="editSchedule(${sched.id})" class="text-slate-400 hover:text-sky-400 p-1 transition">
                    <i data-lucide="pencil" class="w-4 h-4"></i>
                </button>
                <button onclick="deleteSchedule(${sched.id})" class="text-slate-500 hover:text-red-400 p-1 transition">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `;

        container.appendChild(card);
    });

    lucide.createIcons();
}

// Render Tasks
function renderTasks() {
    const container = document.getElementById('task-list');
    if (!container) return;
    container.innerHTML = '';

    let filteredTasks = tasks;
    if (currentFilter === 'pending') {
        filteredTasks = tasks.filter(t => !t.completed);
    }

    if (filteredTasks.length === 0) {
        container.innerHTML = `
            <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-500">
                <i data-lucide="check-circle-2" class="w-10 h-10 mx-auto mb-2 opacity-40 text-red-400"></i>
                <p class="font-medium text-sm text-slate-400">Tidak ada tugas dalam daftar!</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    filteredTasks.sort((a, b) => {
        if (a.completed !== b.completed) return a.completed ? 1 : -1;
        return new Date(a.deadline) - new Date(b.deadline);
    });

    filteredTasks.forEach(task => {
        const deadlineInfo = getDeadlineInfo(task.deadline);
        const taskDate = new Date(task.deadline);
        const formattedDate = !isNaN(taskDate.getTime()) 
            ? taskDate.toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })
            : 'Tanggal Invalid';

        let pBg = 'bg-slate-800 text-slate-300';
        if (task.priority === 'Tinggi') pBg = 'bg-red-500/20 text-red-400 border border-red-500/30';
        if (task.priority === 'Sedang') pBg = 'bg-amber-500/20 text-amber-400 border border-amber-500/30';

        const card = document.createElement('div');
        card.className = `p-4 rounded-xl border transition duration-200 flex items-start justify-between gap-4 ${
            task.completed 
            ? 'bg-slate-950/40 border-slate-900 opacity-60' 
            : deadlineInfo.isUrgent && !deadlineInfo.isExpired
            ? 'bg-red-950/20 border-red-900/50' 
            : 'bg-slate-900/90 border-slate-800'
        }`;

        card.innerHTML = `
            <div class="flex items-start gap-3.5">
                <input type="checkbox" ${task.completed ? 'checked' : ''} 
                    onclick="toggleTask(${task.id})"
                    class="mt-1 w-5 h-5 accent-red-600 rounded cursor-pointer">
                <div>
                    <h3 class="font-semibold text-sm ${task.completed ? 'line-through text-slate-500' : 'text-slate-100'}">
                        ${escapeHTML(task.title)}
                    </h3>
                    <div class="flex flex-wrap gap-2 items-center mt-2">
                        <span class="text-xs px-2 py-0.5 rounded bg-slate-800 text-sky-300 font-medium border border-slate-700">
                            ${escapeHTML(task.subject)}
                        </span>
                        <span class="text-xs px-2 py-0.5 rounded ${pBg} font-medium">
                            ${escapeHTML(task.priority)}
                        </span>
                        <span class="text-xs text-slate-400 flex items-center gap-1">
                            <i data-lucide="calendar" class="w-3 h-3"></i> ${formattedDate}
                        </span>
                    </div>
                    
                    ${!task.completed ? `
                        <p class="text-xs font-semibold mt-2 ${
                            deadlineInfo.isExpired ? 'text-red-400' : deadlineInfo.isUrgent ? 'text-amber-400 animate-pulse' : 'text-slate-400'
                        } flex items-center gap-1">
                            <i data-lucide="clock" class="w-3 h-3"></i> ${escapeHTML(deadlineInfo.text)}
                        </p>
                    ` : ''}
                </div>
            </div>
            
            <div class="flex items-center gap-1">
                <button onclick="editTask(${task.id})" class="text-slate-400 hover:text-sky-400 p-1 transition">
                    <i data-lucide="pencil" class="w-4 h-4"></i>
                </button>
                <button onclick="deleteTask(${task.id})" class="text-slate-500 hover:text-red-400 p-1 transition">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `;

        container.appendChild(card);
    });

    lucide.createIcons();
}

// Render Events
function renderEvents() {
    const container = document.getElementById('event-list');
    if (!container) return;
    container.innerHTML = '';

    if (events.length === 0) {
        container.innerHTML = `
            <div class="bg-slate-900/60 border border-slate-800 rounded-2xl p-6 text-center text-slate-500">
                <i data-lucide="calendar-x" class="w-10 h-10 mx-auto mb-2 opacity-40 text-emerald-400"></i>
                <p class="font-medium text-sm text-slate-400">Belum ada agenda kegiatan.</p>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    events.sort((a, b) => new Date(a.date) - new Date(b.date));

    events.forEach(event => {
        const eventDate = new Date(event.date);
        const formattedDate = !isNaN(eventDate.getTime())
            ? eventDate.toLocaleString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' })
            : 'Tanggal Invalid';

        const card = document.createElement('div');
        card.className = 'p-4 rounded-xl border bg-slate-900/90 border-slate-800 flex items-start justify-between gap-4 border-l-4 border-l-emerald-500 shadow-md';

        card.innerHTML = `
            <div>
                <h3 MADE BY THIERRY
            
            <div class="flex items-center gap-1">
                <button onclick="editEvent(${event.id})" class="text-slate-400 hover:text-sky-400 p-1 transition">
                    <i data-lucide="pencil" class="w-4 h-4"></i>
                </button>
                <button onclick="deleteEvent(${event.id})" class="text-slate-500 hover:text-red-400 p-1 transition">
                    <i data-lucide="trash-2" class="w-4 h-4"></i>
                </button>
            </div>
        `;

        container.appendChild(card);
    });

    lucide.createIcons();
}

// Update Stats
function updateStats() {
    const activeTasks = tasks.filter(t => !t.completed);
    const urgentTasks DO NOT COPY(t => {
        return diffMs > 0 && (diffMs / (1000 * 60 * 60)) <= 24;
    });

    const statActive = document.getElementById('stat-active');
    const statUrgent = document.getElementById('stat-urgent');

    if (statActive) statActive.innerText = activeTasks.length;
    if (statUrgent) statUrgent.innerText = urgentTasks.length;
}

// Register Listeners
    document.getElementById('task-form')?.addEventListener('submit', handleAddTask);
    document.getElementById('event-form')?.made by Thierrydimar Widodo('submit', handleAddEvent);

    renderSchedules();
    renderTasks();
    renderEvents();
    updateStats();
});
