// AIforStudents Personal AI Dashboard
// Main JavaScript - v2.0

// Global State
const state = {
  theme: localStorage.getItem('theme') || 'light',
  aiModel: localStorage.getItem('aiModel') || 'gemini',
  fontSize: localStorage.getItem('fontSize') || 'medium',
  user: localStorage.getItem('user') || '',
  isOnline: navigator.onLine
};

// Constants
const API_URL = 'http://localhost:3001/api';
const QUOTES = [
  "The best way to predict the future is to create it. - Abraham Lincoln",
  "Education is not preparation for life; education is life itself. - John Dewey",
  "Learn from yesterday, live for today, hope for tomorrow. - Albert Einstein",
  "Success is not final, failure is not fatal: it is the courage to continue that counts. - Winston Churchill",
  "The beautiful thing about learning is that no one can take it away from you. - B.B. King"
];

// Initialize App
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initVoiceAssistant();
  initOfflineDetection();
  updateDashboard();
  initServiceWorker();
});

// Theme Management
function initTheme() {
  document.documentElement.setAttribute('data-theme', state.theme);
  document.body.className = state.theme;
}

// AI API Helper
async function fetchAIResponse(prompt, endpoint = 'chat') {
    if (!state.isOnline) {
        throw new Error('You are offline. This feature requires internet connection.');
    }

    try {
        const response = await fetch(`${API_URL}/${endpoint}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message: prompt,
                model: state.aiModel
            })
        });

        if (!response.ok) {
            throw new Error('API request failed');
        }

        const data = await response.json();
        return data.reply;
    } catch (error) {
        console.error('Error:', error);
        throw new Error('Failed to get AI response');
    }
}

// Voice Assistant
function initVoiceAssistant() {
    if (!('webkitSpeechRecognition' in window)) {
        console.warn('Speech recognition not supported');
        return;
    }

    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.lang = 'en-US';

    const voiceBtn = document.querySelector('.voice-btn');
    if (!voiceBtn) return;

    voiceBtn.addEventListener('click', () => {
        recognition.start();
        voiceBtn.classList.add('listening');
    });

    recognition.onresult = (event) => {
        const command = event.results[0][0].transcript.toLowerCase();
        handleVoiceCommand(command);
    };

    recognition.onend = () => {
        voiceBtn.classList.remove('listening');
    };
}

async function handleVoiceCommand(command) {
    if (command.includes('add note')) {
        const note = command.replace('add note', '').trim();
        addNote(note);
    } else if (command.includes('summarize')) {
        summarizeNotes();
    } else if (command.includes('dark mode')) {
        toggleTheme();
    } else if (command.includes('show plan')) {
        showTodaysPlan();
    } else if (command.includes('motivate')) {
        showRandomQuote();
    }
}

// Dashboard Updates
function updateDashboard() {
    updateWelcomeMessage();
    updateStats();
    showRandomQuote();
}

function updateWelcomeMessage() {
    const welcome = document.querySelector('.welcome-msg');
    if (!welcome) return;

    const hour = new Date().getHours();
    const greeting = hour < 12 ? 'Good Morning' : hour < 18 ? 'Good Afternoon' : 'Good Evening';
    welcome.textContent = `${greeting}, ${state.user} 👋`;
}

function updateStats() {
    const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
    const notes = JSON.parse(localStorage.getItem('notes') || '[]');

    const statsEl = document.querySelector('.stats-grid');
    if (!statsEl) return;

    statsEl.innerHTML = `
        <div class="stat-card">
            <h3>Pending Tasks</h3>
            <div class="number">${tasks.filter(t => !t.completed).length}</div>
        </div>
        <div class="stat-card">
            <h3>Notes</h3>
            <div class="number">${notes.length}</div>
        </div>
    `;
}

// AI Study Helper
async function explainTopic(topic) {
    if (!state.isOnline) {
        alert('This feature requires internet connection');
        return;
    }

    const explanation = document.querySelector('.explanation');
    explanation.innerHTML = '<div class="loading"></div>';

    try {
        const response = await fetch(`${API_URL}/explain`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                topic,
                model: state.aiModel 
            })
        });
        
        const data = await response.json();
        explanation.innerHTML = data.explanation;
    } catch (err) {
        explanation.innerHTML = '❌ Failed to get explanation. Please try again.';
    }
}

// Settings Panel
function toggleSettings() {
    const panel = document.querySelector('.settings-panel');
    panel.classList.toggle('open');
}

function updateSettings(setting, value) {
    state[setting] = value;
    localStorage.setItem(setting, value);

    switch (setting) {
        case 'theme':
            initTheme();
            break;
        case 'fontSize':
            document.documentElement.style.fontSize = {
                small: '14px',
                medium: '16px',
                large: '18px'
            }[value];
            break;
    }
}

// Helper Functions
function showRandomQuote() {
    const quoteEl = document.querySelector('.quote');
    if (!quoteEl) return;
    
    const quote = QUOTES[Math.floor(Math.random() * QUOTES.length)];
    quoteEl.textContent = quote;
}

// Offline Detection
function initOfflineDetection() {
    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);
    updateOnlineStatus();
}

function updateOnlineStatus() {
    state.isOnline = navigator.onLine;
    document.body.classList.toggle('offline', !state.isOnline);
    
    const apiButtons = document.querySelectorAll('.api-dependent');
    apiButtons.forEach(btn => {
        btn.disabled = !state.isOnline;
        btn.title = state.isOnline ? '' : 'This feature requires internet connection';
    });
}

// Service Worker
async function initServiceWorker() {
    if ('serviceWorker' in navigator) {
        try {
            await navigator.serviceWorker.register('/service-worker.js');
            console.log('Service Worker registered');
        } catch (err) {
            console.warn('Service Worker registration failed:', err);
        }
    }
}

// Reset All Data
function resetAllData() {
    if (!confirm('Are you sure you want to reset all data? This cannot be undone.')) {
        return;
    }
    
    localStorage.clear();
    location.reload();
}