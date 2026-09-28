const input = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const conversation = document.getElementById('conversation');
const toast = document.getElementById('toast');
let toastTimer;

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
}

function fitInput() {
  input.style.height = 'auto';
  input.style.height = Math.min(input.scrollHeight, 120) + 'px';
  sendButton.disabled = !input.value.trim();
}
input.addEventListener('input', fitInput);

function sendMessage() {
  const value = input.value.trim();
  if (!value) return;
  const row = document.createElement('div');
  row.className = 'user-message-row';
  const bubble = document.createElement('div');
  bubble.className = 'user-message';
  bubble.textContent = value;
  row.appendChild(bubble);
  conversation.insertBefore(row, conversation.querySelector('.assistant-heading'));
  input.value = '';
  fitInput();
  showToast('Frontend concept only — no computation engine is connected.');
  input.focus();
}
sendButton.addEventListener('click', sendMessage);
input.addEventListener('keydown', event => {
  if (event.key === 'Enter' && !event.shiftKey) {
    event.preventDefault();
    sendMessage();
  }
});

document.querySelectorAll('[data-toast]').forEach(button => button.addEventListener('click', () => showToast(button.dataset.toast)));
document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => {
  input.value = button.dataset.prompt;
  fitInput();
  input.focus();
}));
document.querySelectorAll('[data-copy]').forEach(button => button.addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(button.dataset.copy); showToast('Copied to clipboard.'); }
  catch { showToast('Clipboard access is not available here.'); }
}));

document.getElementById('newChat').addEventListener('click', () => {
  input.value = '';
  fitInput();
  input.focus();
  showToast('New research session ready.');
});
document.getElementById('shareButton').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href); showToast('Research session link copied.'); }
  catch { showToast('Use the browser address bar to share this preview.'); }
});

const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('mobileScrim');
function closeSidebar() { sidebar.classList.remove('open'); scrim.classList.remove('visible'); }
document.getElementById('mobileMenu').addEventListener('click', () => { sidebar.classList.add('open'); scrim.classList.add('visible'); });
document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
scrim.addEventListener('click', closeSidebar);

document.addEventListener('keydown', event => {
  if (event.ctrlKey && !event.shiftKey && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    input.focus();
  }
  if (event.key === 'Escape') closeSidebar();
});