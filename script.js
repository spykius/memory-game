let newGameButton;

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

function createMain() {
  const main = createCustomElement('main', { classes: ['page__main'] });
  const stats = createStats();
  main.append(stats.element);
  return { element: main, values: stats.values };
}

function generatePage() {
  const page = createCustomElement('div', { classes: ['page'] });
  const main = createMain();
  page.append(createHeader(), main.element);
  document.body.append(page);

  return { ...main.values };
}

const app = generatePage();
