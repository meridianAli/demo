const input = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const conversation = document.getElementById('conversation');
const toast = document.getElementById('toast');
let toastTimer;
const paletteButtons = [...document.querySelectorAll('.palette-option')];

function setPalette(theme) {
  if (!paletteButtons.some(button => button.dataset.theme === theme)) return;
  document.body.dataset.theme = theme;
  paletteButtons.forEach(button => {
    const selected = button.dataset.theme === theme;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  try { localStorage.setItem('proof-palette-v2', theme); } catch {}
}

paletteButtons.forEach(button => button.addEventListener('click', () => {
  setPalette(button.dataset.theme);
  showToast(`${button.querySelector('span:last-child').textContent} palette selected.`);
}));
try { setPalette(localStorage.getItem('proof-palette-v2') || 'plum'); } catch { setPalette('plum'); }

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('visible'), 2200);
}

function fitInput() {
  input.style.height = 'auto';
  input.style.height = `${Math.min(input.scrollHeight, 130)}px`;
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
  showToast('This is a design preview — chat responses aren’t connected yet.');
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
  catch { showToast('Clipboard access isn’t available here.'); }
}));

document.getElementById('newChat').addEventListener('click', () => {
  input.value = '';
  fitInput();
  input.focus();
  showToast('Ready for a new question.');
});
document.getElementById('shareButton').addEventListener('click', async () => {
  try { await navigator.clipboard.writeText(location.href); showToast('Page link copied.'); }
  catch { showToast('This preview link is ready to share once hosted.'); }
});

const sidebar = document.getElementById('sidebar');
const scrim = document.getElementById('mobileScrim');
function closeSidebar() { sidebar.classList.remove('open'); scrim.classList.remove('visible'); }
document.getElementById('mobileMenu').addEventListener('click', () => { sidebar.classList.add('open'); scrim.classList.add('visible'); });
document.getElementById('sidebarClose').addEventListener('click', closeSidebar);
scrim.addEventListener('click', closeSidebar);

document.addEventListener('keydown', event => {
  if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === 'k') {
    event.preventDefault();
    input.focus();
  }
  if (event.key === 'Escape') closeSidebar();
});
