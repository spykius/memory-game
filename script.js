const SPRITE_PATH = './assets/svg/sprite.svg';
const TIMER_DELAY = 1100;
const LOCAL_STORAGE_KEY = 'leaderboard';
const cardsData = [
  { id: 'bash', name: 'Bash' },
  { id: 'nodejs', name: 'Node.js' },
  { id: 'figma', name: 'Figma' },
  { id: 'javascript', name: 'JavaScript' },
  { id: 'react', name: 'React' },
  { id: 'vscode', name: 'VS Code' },
  { id: 'css3', name: 'CSS3' },
  { id: 'html5', name: 'HTML5' },
];

function createCustomElement(tagName, { text = '', classes = [], attrs = {} } = {}) {
  const element = document.createElement(tagName);
  element.textContent = text;
  element.classList.add(...classes);
  for (const [attr, val] of Object.entries(attrs)) {
    element.setAttribute(attr, val);
  }
  return element;
}

function createLogoSVG() {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('viewBox', '0 0 32 32');
  svg.setAttribute('aria-hidden', 'true');

  const path = document.createElementNS(svgNS, 'path');
  path.setAttribute('d', 'M5 22.5 12.5 8 16 15l3.5-7L27 22.5h-5L19.5 17 16 24l-3.5-7L10 22.5H5Z');

  svg.append(path);

  return svg;
}

function createHeaderButton(text, dataAction) {
  const button = createCustomElement('button', {
    text: text,
    classes: ['header__button'],
    attrs: {
      type: 'button',
      'data-action': dataAction,
    },
  });

  return button;
}

function createHeader() {
  const header = createCustomElement('header', { classes: ['page__header'] });
  const headerContainer = createCustomElement('div', {
    classes: ['header__container', 'container'],
  });

  const heading = createCustomElement('h1', { classes: ['logo'] });
  const logoIcon = createCustomElement('span', { classes: ['logo__icon'] });
  const svg = createLogoSVG();
  const logoTitle = createCustomElement('span', { text: 'Memory', classes: ['logo__title'] });
  logoIcon.append(svg);
  heading.append(logoIcon, logoTitle);

  const headerButtons = createCustomElement('div', { classes: ['header__buttons'] });
  const newGameButton = createHeaderButton('New game', 'new-game');
  const leaderboardButton = createHeaderButton('Leaderboard', 'leaderboard');
  headerButtons.append(newGameButton, leaderboardButton);

  headerContainer.append(heading, headerButtons);
  header.append(headerContainer);

  return header;
}

function createStats() {
  const statsSection = createCustomElement('section', {
    classes: ['stats'],
    attrs: {
      'aria-label': 'game statistics',
    },
  });
  const statsContainer = createCustomElement('div', {
    classes: ['stats__container', 'container'],
  });
  const statsList = createCustomElement('dl', {
    classes: ['stats__list'],
  });

  const statsData = [
    { title: 'Moves', value: '00' },
    { title: 'Time', value: '00:00' },
    { title: 'Best', value: '—' },
  ];

  const statsValues = [];

  statsList.append(
    ...statsData.map(({ title, value }) => {
      const statsItem = createCustomElement('div', {
        classes: ['stats__inner'],
      });

      const statsTitle = createCustomElement('dt', {
        text: title,
        classes: ['stats__title'],
      });

      const statsValue = createCustomElement('dd', {
        text: value,
        classes: ['stats__value'],
      });

      statsValues.push(statsValue);

      statsItem.append(statsTitle, statsValue);

      return statsItem;
    }),
  );

  const [moves, time, best] = statsValues;

  statsContainer.append(statsList);
  statsSection.append(statsContainer);

  return { element: statsSection, values: { moves, time, best } };
}

function createCardSVG(iconId) {
  const svgNS = 'http://www.w3.org/2000/svg';
  const svg = document.createElementNS(svgNS, 'svg');
  svg.setAttribute('aria-hidden', 'true');
  svg.classList.add('card__icon');

  const use = document.createElementNS(svgNS, 'use');
  use.setAttribute('href', `${SPRITE_PATH}#${iconId}`);

  svg.append(use);

  return svg;
}

function createCard(data, index) {
  const cardButton = createCustomElement('button', {
    classes: ['board__card', 'card'],
    attrs: {
      type: 'button',
      'data-card-id': data.id,
      'data-card-index': index,
      'aria-label': `Hidden card ${index + 1}`,
    },
  });

  const cardInner = createCustomElement('span', {
    classes: ['card__inner'],
  });

  const svg = createCardSVG(data.id);

  cardInner.append(svg);
  cardButton.append(cardInner);

  return cardButton;
}

function createBoard() {
  const boardSection = createCustomElement('section', {
    classes: ['board'],
    attrs: {
      'aria-label': 'memory card board',
    },
  });
  const boardContainer = createCustomElement('div', {
    classes: ['board__container', 'container'],
  });
  const boardBox = createCustomElement('div', {
    classes: ['board__box'],
  });

  boardContainer.append(boardBox);
  boardSection.append(boardContainer);

  return { element: boardSection, values: { boardBox } };
}

function createMain() {
  const main = createCustomElement('main', { classes: ['page__main'] });
  const stats = createStats();
  const board = createBoard();
  main.append(stats.element, board.element);
  return { element: main, values: { ...stats.values, ...board.values } };
}

function generatePage() {
  const page = createCustomElement('div', { classes: ['page'] });
  const main = createMain();
  page.append(createHeader(), main.element);

  const modalsRoot = createCustomElement('div', { attrs: { id: 'modals-root' } });
  document.body.append(page, modalsRoot);

  return { ...main.values, modalsRoot };
}

function createCardsForBoard() {
  return cardsData.flatMap((item) => [{ ...item }, { ...item }]);
}

function shuffle(array) {
  const copy = [...array];
  for (let currentIndex = copy.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));

    [copy[currentIndex], copy[randomIndex]] = [copy[randomIndex], copy[currentIndex]];
  }

  return copy;
}

function renderBoard(boardElement, deck) {
  const cardElements = deck.map((item, index) => createCard(item, index));
  boardElement.replaceChildren(...cardElements);
}

function startGame() {
  const deck = shuffle(createCardsForBoard());
  clearTimeout(gameState.timerId);
  gameState = createInitialState();
  app.moves.textContent = '00';
  renderBoard(app.boardBox, deck);
}

function createInitialState() {
  return {
    firstCard: null,
    secondCard: null,
    isBoardLocked: false,
    pairsFound: 0,
    movesMade: 0,
    timerId: null,
  };
}

function openCard(card) {
  card.classList.add('card--open');
  card.setAttribute('aria-label', cardsData.find((item) => item.id === card.dataset.cardId).name);
}

function closeCard(card) {
  card.classList.remove('card--open');
  card.setAttribute('aria-label', `Hidden card ${Number(card.dataset.cardIndex) + 1}`);
}

function handleMatch() {
  gameState.firstCard.classList.add('card--matched');
  gameState.secondCard.classList.add('card--matched');
  gameState.firstCard = null;
  gameState.secondCard = null;
  gameState.pairsFound++;
  if (gameState.pairsFound === cardsData.length) handleWin();
}

function handleMismatch() {
  gameState.isBoardLocked = true;
  gameState.timerId = setTimeout(() => {
    closeCard(gameState.firstCard);
    closeCard(gameState.secondCard);
    gameState.firstCard = null;
    gameState.secondCard = null;
    gameState.isBoardLocked = false;
    gameState.timerId = null;
  }, TIMER_DELAY);
}

function loadResults() {
  try {
    const data = JSON.parse(localStorage.getItem(LOCAL_STORAGE_KEY));
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.warn(`Can't read results:`, error);
    return [];
  }
}

function addResult(moves) {
  const results = loadResults();
  results.push({ moves, time: Date.now() });

  results.sort((a, b) => a.moves - b.moves || a.time - b.time);
  const top = results.slice(0, 10);

  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(top));
}

function handleWin() {
  addResult(gameState.movesMade);
  showWinModal(gameState.movesMade);
}

function handleBoardClick(e) {
  const card = e.target.closest('.card');
  if (!card) return;
  if (card.classList.contains('card--open') || gameState.isBoardLocked) return;
  openCard(card);

  if (!gameState.firstCard) {
    gameState.firstCard = card;
    return;
  }

  gameState.secondCard = card;
  gameState.movesMade++;
  app.moves.textContent = gameState.movesMade.toString().padStart(2, '0');

  if (gameState.firstCard.dataset.cardId === gameState.secondCard.dataset.cardId) {
    handleMatch();
  } else {
    handleMismatch();
  }
}

function handleButtonClick(e) {
  const actionButton = e.target.closest('[data-action]');
  if (!actionButton) return;
  const action = buttonActions[actionButton.dataset.action];
  if (!action) return;
  action();
}

function createModal({ title, content, actions = [] }) {
  const dialog = createCustomElement('dialog', { classes: ['modal'] });

  if (title) {
    dialog.append(createCustomElement('h2', { text: title, classes: ['modal__title'] }));
  }

  if (content) {
    if (typeof content === 'string') {
      dialog.append(createCustomElement('p', { text: content, classes: ['modal__message'] }));
    } else {
      dialog.append(content);
    }
  }

  if (actions.length) {
    const actionsBox = createCustomElement('div', { classes: ['modal__actions'] });
    actionsBox.append(...actions);
    dialog.append(actionsBox);
  }

  return dialog;
}

function openModal(dialog) {
  if (!dialog.isConnected) app.modalsRoot.append(dialog);
  dialog.showModal();
  updateBodyScrollLock();
}

function closeModal(dialog) {
  if (dialog.open) dialog.close();
}

function attachModalAutoClose(dialog) {
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) closeModal(dialog);
  });

  dialog.addEventListener(
    'close',
    () => {
      dialog.remove();
      updateBodyScrollLock();
    },
    { once: true },
  );
}

function updateBodyScrollLock() {
  const hasOpenDialog = document.querySelector('dialog[open]') !== null;
  document.body.classList.toggle('modal-open', hasOpenDialog);
}

function createModalButton(text, { primary = false, onClick } = {}) {
  const button = createCustomElement('button', {
    text,
    classes: ['modal__button', ...(primary ? ['modal__button--primary'] : [])],
    attrs: { type: 'button' },
  });
  if (onClick) button.addEventListener('click', onClick);
  return button;
}

function showWinModal(moves) {
  const movesDisplay = createCustomElement('strong', {
    text: moves.toString().padStart(2, '0'),
    classes: ['modal__moves'],
  });

  const dialog = createModal({
    title: 'You win!',
    content: movesDisplay,
    actions: [
      createModalButton('New game', {
        primary: true,
        onClick: () => {
          closeModal(dialog);
          startGame();
        },
      }),
      createModalButton('Close', {
        onClick: () => closeModal(dialog),
      }),
    ],
  });

  attachModalAutoClose(dialog);
  openModal(dialog);
}

function formatDate(timestamp) {
  const d = new Date(timestamp);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  return `${day}.${month}.${year}`;
}

function createLeaderboardTable(results) {
  if (!results.length) {
    return createCustomElement('p', {
      text: 'No results',
      classes: ['leaderboard__empty'],
    });
  }

  const table = createCustomElement('table', { classes: ['leaderboard'] });

  const thead = createCustomElement('thead');
  const headRow = createCustomElement('tr');
  ['#', 'Moves', 'Date'].forEach((label) => {
    headRow.append(createCustomElement('th', { text: label }));
  });
  thead.append(headRow);

  const tbody = createCustomElement('tbody');
  results.forEach((result, index) => {
    const row = createCustomElement('tr');

    row.append(
      createCustomElement('td', {
        text: String(index + 1),
        classes: ['leaderboard__place'],
      }),
      createCustomElement('td', {
        text: String(result.moves).padStart(2, '0'),
        classes: ['leaderboard__moves'],
      }),
      createCustomElement('td', {
        text: formatDate(result.time),
        classes: ['leaderboard__date'],
      }),
    );

    tbody.append(row);
  });

  table.append(thead, tbody);
  return table;
}

function showLeaderboardModal() {
  const table = createLeaderboardTable(loadResults());

  const dialog = createModal({
    title: 'Leaderboard',
    content: table,
    actions: [
      createModalButton('Close', {
        primary: true,
        onClick: () => closeModal(dialog),
      }),
    ],
  });

  attachModalAutoClose(dialog);
  openModal(dialog);
}

const app = generatePage();

let gameState = createInitialState();

app.boardBox.addEventListener('click', handleBoardClick);

const buttonActions = {
  'new-game': startGame,
  leaderboard: showLeaderboardModal,
};

document.body.addEventListener('click', handleButtonClick);

startGame();
