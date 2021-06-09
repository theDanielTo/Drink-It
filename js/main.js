const homePage = document.querySelector('.page-home');
const mainHeader = document.querySelector('.main-header');
const headerText = document.querySelector('#main-header-text');

const homeBtn = document.querySelector('.home-icon');
const listPage = document.querySelector('.page-list');
const textList = document.querySelector('.text-list');

const searchBox = document.querySelector('.search-box');
const searchInput = document.querySelector('#search-input');

const largeLogo = document.querySelector('.logo-large');
// const randomBtn = document.querySelector('.random-btn');
const detailedDrink = document.querySelector('.drink-detailed');

const navBottom = document.querySelector('.nav-bottom');
const navIcons = document.querySelectorAll('.nav-icon');
const navSide = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-link');

homeBtn.addEventListener('click', function () {
  homePage.classList.remove('hidden');
  homeBtn.classList.add('hidden');
  listPage.classList.add('hidden');
  searchBox.classList.add('hidden');

  removeSelectedColors();

  mainHeader.classList.add('hidden');
  headerText.classList.add('hidden');
  headerText.textContent = 'Drink It!';
});

navBottom.addEventListener('click', function (event) {
  mainHeader.classList.remove('hidden');
  headerText.classList.remove('hidden');
  if (event.target === navIcons[0]) {
    renderIngredients();
    removeSelectedColors();
    searchBox.classList.add('hidden');
    navIcons[0].classList.add('nav-selected');
    headerText.textContent = 'Ingredients';
  } else if (event.target === navIcons[1]) {
    renderCategories();
    removeSelectedColors();
    searchBox.classList.add('hidden');
    navIcons[1].classList.add('nav-selected');
    headerText.textContent = 'Categories';
  } else if (event.target === navIcons[2]) {
    removeSelectedColors();
    openListPage();
    if (textList.hasChildNodes()) clearList(textList);
    searchBox.classList.remove('hidden');
    searchInput.value = '';
    navIcons[2].classList.add('nav-selected');
    headerText.textContent = '';
  }
});

navSide.addEventListener('click', function (event) {
  if (event.target === navLinks[0]) {
    renderIngredients();
    removeSelectedColors();
    searchBox.classList.add('hidden');
    navLinks[0].classList.add('text-selected');
    headerText.textContent = 'Ingredients';
  } else if (event.target === navLinks[1]) {
    renderCategories();
    removeSelectedColors();
    searchBox.classList.add('hidden');
    navLinks[1].classList.add('text-selected');
    headerText.textContent = 'Categories';
  } else if (event.target === navLinks[2]) {
    removeSelectedColors();
    openListPage();
    if (textList.hasChildNodes()) clearList(textList);
    searchBox.classList.remove('hidden');
    searchInput.value = '';
    headerText.textContent = '';
    navLinks[2].classList.add('text-selected');
  }
});

searchBox.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    searchBox.classList.add('hidden');
    handleSearch();
  }
});

largeLogo.addEventListener('click', handleRandom);

function openListPage() {
  listPage.classList.remove('hidden');
  homePage.classList.add('hidden');
  homeBtn.classList.remove('hidden');
}

function renderIngredients() {
  openListPage();
  if (textList.hasChildNodes()) clearList(textList);
  const xhrIngredients = new XMLHttpRequest();
  xhrIngredients.open('GET', 'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
  xhrIngredients.responseType = 'json';
  xhrIngredients.addEventListener('load', function (event) {
    for (const item of xhrIngredients.response.drinks) {
      const ingredient = document.createElement('p');
      ingredient.textContent = item.strIngredient1;
      ingredient.className = 'list-item';
      ingredient.addEventListener('click', handleIngredientClick);
      textList.appendChild(ingredient);
    }
  });
  xhrIngredients.send();
}

function handleIngredientClick(event) {
  headerText.classList.remove('hidden');
  headerText.textContent = event.target.textContent;
  if (textList.hasChildNodes()) clearList(textList);
  const xhrFilterByC = new XMLHttpRequest();
  xhrFilterByC.open('GET', 'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + event.target.textContent);
  xhrFilterByC.responseType = 'json';
  xhrFilterByC.addEventListener('load', function (event) {
    for (const item of xhrFilterByC.response.drinks) {
      renderDrinkRow(item);
    }
  });
  xhrFilterByC.send();
}

function renderCategories() {
  openListPage();
  if (textList.hasChildNodes()) clearList(textList);
  const xhrCategories = new XMLHttpRequest();
  xhrCategories.open('GET', 'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
  xhrCategories.responseType = 'json';
  xhrCategories.addEventListener('load', function (event) {
    for (const item of xhrCategories.response.drinks) {
      const category = document.createElement('p');
      category.textContent = item.strCategory;
      category.className = 'list-item';
      category.addEventListener('click', handleCategoryClick);
      textList.appendChild(category);
    }
  });
  xhrCategories.send();
}

function handleCategoryClick(event) {
  headerText.classList.remove('hidden');
  headerText.textContent = event.target.textContent;
  if (textList.hasChildNodes()) clearList(textList);
  const xhrFilterByC = new XMLHttpRequest();
  xhrFilterByC.open('GET', 'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=' + event.target.textContent);
  xhrFilterByC.responseType = 'json';
  xhrFilterByC.addEventListener('load', function (event) {
    for (const item of xhrFilterByC.response.drinks) {
      renderDrinkRow(item);
    }
  });
  xhrFilterByC.send();
}

function handleSearch() {
  headerText.textContent = searchInput.value.toUpperCase();
  if (textList.hasChildNodes()) clearList(textList);
  const xhrSearch = new XMLHttpRequest();
  xhrSearch.open('GET', 'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + searchInput.value);
  xhrSearch.responseType = 'json';

  xhrSearch.addEventListener('load', function (event) {
    if (xhrSearch.response.drinks === null) {
      headerText.textContent = 'No drinks were found.';
    } else {
      for (const item of xhrSearch.response.drinks) {
        renderDrinkRow(item);
      }
    }
  });
  xhrSearch.send();
}

function renderDrinkRow(item) {
  const drink = document.createElement('div');
  drink.className = 'drink-row';
  const drinkImg = document.createElement('img');
  drinkImg.src = item.strDrinkThumb;
  drinkImg.alt = item.strDrink;
  drinkImg.className = 'drink-img border-round';
  drink.appendChild(drinkImg);
  const rightCol = document.createElement('div');
  rightCol.className = 'drink-right-col col-8 border-round';
  drink.appendChild(rightCol);
  const drinkName = document.createElement('p');
  drinkName.textContent = item.strDrink;
  rightCol.appendChild(drinkName);
  const heart = document.createElement('i');
  heart.className = 'far fa-heart';
  rightCol.appendChild(heart);
  textList.appendChild(drink);
}

function handleRandom(event) {
  homePage.classList.add('hidden');
  homeBtn.classList.remove('hidden');
  detailedDrink.classList.remove('hidden');
  const xhrRandom = new XMLHttpRequest();
  xhrRandom.open('GET', 'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/random.php');
  xhrRandom.responseType = 'json';
  xhrRandom.addEventListener('load', function (event) {
    renderDetailedDrink(xhrRandom.response.drinks[0]);
  });
  xhrRandom.send();
}

function renderDetailedDrink(drink) {
  headerText.textContent = drink.strDrink;
  clearList(detailedDrink);

  const topRow = document.createElement('div');
  topRow.className = 'detail-top-row row';
  const drinkImg = document.createElement('img');
  drinkImg.className = 'detailed-img col-6 border-round';
  drinkImg.src = drink.strDrinkThumb;
  drinkImg.alt = 'Random Drink';
  const drinkName = document.createElement('h2');
  drinkName.textContent = drink.strDrink;
  topRow.appendChild(drinkImg);
  topRow.appendChild(drinkName);

  const detailsTable = document.createElement('table');
  detailsTable.className = 'details-table border-round col-6';
  const thead = document.createElement('thead');
  detailsTable.appendChild(thead);
  const tbody = document.createElement('tbody');
  detailsTable.appendChild(tbody);
  const trH = document.createElement('tr');
  const th1 = document.createElement('th');
  th1.textContent = 'Measurements';
  trH.appendChild(th1);
  const th2 = document.createElement('th');
  th2.textContent = 'Ingredients';
  trH.appendChild(th2);
  thead.appendChild(trH);

  for (let i = 1; i <= 15; i++) {
    const ingredIndex = 'strIngredient' + i;
    const measureIndex = 'strMeasure' + i;
    if (drink[ingredIndex] !== null) {
      const tr = document.createElement('tr');
      const td1 = document.createElement('td');
      td1.textContent = drink[measureIndex];
      tr.appendChild(td1);
      const td2 = document.createElement('td');
      td2.textContent = drink[ingredIndex];
      tr.appendChild(td2);
      tbody.appendChild(tr);
    }
  }
  const instructions = document.createElement('p');
  instructions.className = 'col-6 instructions border-round';
  instructions.innerHTML = '<b>Instructions: </b>' + drink.strInstructions;

  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'details-div border-round';

  detailsDiv.appendChild(detailsTable);
  detailsDiv.appendChild(instructions);

  detailedDrink.appendChild(topRow);
  detailedDrink.appendChild(detailsDiv);
}

function removeSelectedColors() {
  navIcons[0].classList.remove('nav-selected');
  navIcons[1].classList.remove('nav-selected');
  navIcons[2].classList.remove('nav-selected');
  navLinks[0].classList.remove('text-selected');
  navLinks[1].classList.remove('text-selected');
  navLinks[2].classList.remove('text-selected');
}

function clearList(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
