const DEFAULT_BUTTONS = [
  { label: 'Internal', text: '[Internal] ', color: '#e8f0fe', textColor: '#1967d2', insertAtStart: false },
  { label: 'tentative', text: '[tentative] ', color: '#fce8e6', textColor: '#c5221f', insertAtStart: false },
  { label: 'Fixed', text: '[Fixed] ', color: '#fce8e6', textColor: '#c5221f', insertAtStart: false }
];

const tbody = document.getElementById('config-body');
const status = document.getElementById('status');

const rowTemplate = btn => `
  <tr>
    <td><input type="text" name="label" value="${btn.label || ''}" required></td>
    <td><input type="text" name="text" value="${btn.text || ''}" required></td>
    <td><input type="text" name="color" value="${btn.color || ''}" placeholder="#e8eaed"></td>
    <td><input type="text" name="textColor" value="${btn.textColor || ''}" placeholder="#1f1f1f"></td>
    <td style="text-align:center"><input type="checkbox" name="insertAtStart" ${btn.insertAtStart ? 'checked' : ''}></td>
    <td style="text-align:center"><button type="button" class="remove">×</button></td>
  </tr>
`;

const renderRows = buttons => {
  tbody.innerHTML = buttons.map(rowTemplate).join('');
};

const readRows = () => {
  return Array.from(tbody.querySelectorAll('tr')).map(tr => {
    const [label, text, color, textColor, insertAtStart] = [
      tr.querySelector('input[name="label"]').value.trim(),
      tr.querySelector('input[name="text"]').value,
      tr.querySelector('input[name="color"]').value.trim(),
      tr.querySelector('input[name="textColor"]').value.trim(),
      tr.querySelector('input[name="insertAtStart"]').checked
    ];
    return { label, text, color, textColor, insertAtStart };
  }).filter(row => row.label && row.text);
};

const load = () => {
  chrome.storage.sync.get(['buttonConfig'], ({ buttonConfig }) => {
    const buttons = Array.isArray(buttonConfig) && buttonConfig.length ? buttonConfig : DEFAULT_BUTTONS;
    renderRows(buttons);
  });
};

document.getElementById('add-row').addEventListener('click', () => {
  const empty = { label: '', text: '', color: '#e8eaed', textColor: '#1f1f1f', insertAtStart: false };
  tbody.insertAdjacentHTML('beforeend', rowTemplate(empty));
});

document.getElementById('reset-defaults').addEventListener('click', () => {
  renderRows(DEFAULT_BUTTONS);
  status.textContent = 'デフォルトに戻しました';
});

document.getElementById('save').addEventListener('click', () => {
  const data = readRows();
  chrome.storage.sync.set({ buttonConfig: data }, () => {
    status.textContent = '保存しました。Googleカレンダーを開き直すか、既存の編集画面を更新すると反映されます。';
    setTimeout(() => { status.textContent = ''; }, 4000);
  });
});

tbody.addEventListener('click', e => {
  if (e.target.classList.contains('remove')) {
    e.target.closest('tr').remove();
  }
});

load();
