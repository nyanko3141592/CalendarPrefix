const DEFAULT_BUTTONS = [
  { label: 'Internal', text: '[Internal] ', color: '#e8f0fe', textColor: '#1967d2', insertAtStart: false },
  { label: 'tentative', text: '[tentative] ', color: '#fce8e6', textColor: '#c5221f', insertAtStart: false },
  { label: 'Fixed', text: '[Fixed] ', color: '#fce8e6', textColor: '#c5221f', insertAtStart: false }
];

let buttonConfig = [...DEFAULT_BUTTONS];

const loadConfig = () =>
  new Promise(resolve => {
    if (!chrome?.storage?.sync) {
      resolve(DEFAULT_BUTTONS);
      return;
    }

    chrome.storage.sync.get(['buttonConfig'], ({ buttonConfig: stored }) => {
      if (Array.isArray(stored) && stored.length) {
        buttonConfig = stored;
      }
      resolve(buttonConfig);
    });
  });

const saveCursorAndInsert = (input, text, insertAtStart) => {
  const value = input.value;
  let newValue;
  let cursorPos;

  if (insertAtStart) {
    newValue = text + value;
    cursorPos = text.length;
  } else {
    const start = input.selectionStart || 0;
    const end = input.selectionEnd || 0;
    newValue = value.slice(0, start) + text + value.slice(end);
    cursorPos = start + text.length;
  }

  input.value = newValue;
  input.setSelectionRange(cursorPos, cursorPos);
  input.focus();

  input.dispatchEvent(new Event('input', { bubbles: true }));
  input.dispatchEvent(new Event('change', { bubbles: true }));
};

const createButtons = input => {
  if (input.dataset.hasCustomButtons === 'true') return;

  const wrapper = input.closest('div[jsname="vhZMvf"]');
  if (!wrapper) return;

  if (wrapper.parentNode) {
    const parentStyle = window.getComputedStyle(wrapper.parentNode);
    if (parentStyle.display === 'flex') {
      wrapper.parentNode.style.flexWrap = 'wrap';
    }
  }

  const container = document.createElement('div');
  container.className = 'gcal-custom-title-buttons-container';
  Object.assign(container.style, {
    marginTop: '8px',
    marginBottom: '4px',
    display: 'flex',
    gap: '10px',
    width: '100%',
    boxSizing: 'border-box',
    position: 'relative',
    zIndex: '10'
  });

  buttonConfig.forEach(conf => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = conf.label;
    Object.assign(btn.style, {
      padding: '4px 12px',
      backgroundColor: conf.color || '#e8eaed',
      color: conf.textColor || '#1f1f1f',
      border: 'none',
      borderRadius: '4px',
      cursor: 'pointer',
      fontSize: '12px',
      fontWeight: '500',
      lineHeight: '1.5',
      whiteSpace: 'nowrap'
    });

    btn.addEventListener('mouseover', () => {
      btn.style.opacity = '0.85';
    });
    btn.addEventListener('mouseout', () => {
      btn.style.opacity = '1';
    });

    btn.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      saveCursorAndInsert(input, conf.text, conf.insertAtStart);
    });

    container.appendChild(btn);
  });

  wrapper.parentNode.insertBefore(container, wrapper.nextSibling);
  input.dataset.hasCustomButtons = 'true';
};

const addButtonsToInputs = () => {
  const inputs = document.querySelectorAll('input[id="xTiIn"], div[jsname="Y9wHSb"] input[type="text"]');
  inputs.forEach(createButtons);
};

const startObserving = () => {
  const observer = new MutationObserver(() => {
    addButtonsToInputs();
  });

  observer.observe(document.body, { childList: true, subtree: true });
  addButtonsToInputs();
};

loadConfig().then(() => {
  startObserving();
});

if (chrome?.storage?.onChanged) {
  chrome.storage.onChanged.addListener((changes, area) => {
    if (area === 'sync' && changes.buttonConfig) {
      const next = changes.buttonConfig.newValue;
      if (Array.isArray(next) && next.length) {
        buttonConfig = next;
      } else {
        buttonConfig = [...DEFAULT_BUTTONS];
      }
      addButtonsToInputs();
    }
  });
}
