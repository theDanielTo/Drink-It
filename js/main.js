const homePage = document.querySelector('.page-home');
const headerText = document.querySelector('#main-header-text');

const listPage = document.querySelector('.page-list');
const homeBtn = document.querySelector('.home-icon');
const textList = document.querySelector('.text-list');

const navBottom = document.querySelector('.nav-bottom');
const navIcons = document.querySelectorAll('.nav-icon');

const navSide = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-link');

homeBtn.addEventListener('click', function () {
  homePage.classList.remove('hidden');
  homeBtn.classList.add('hidden');
  listPage.classList.add('hidden');

  navIcons[0].classList.remove('nav-selected');
  navIcons[1].classList.remove('nav-selected');
  navLinks[1].classList.remove('text-selected');
  navLinks[0].classList.remove('text-selected');

  headerText.textContent = 'Drink It!';
});

navBottom.addEventListener('click', function (event) {
  if (event.target === navIcons[0]) {
    renderIngredients();
    navIcons[0].classList.add('nav-selected');
    navIcons[1].classList.remove('nav-selected');
  } else if (event.target === navIcons[1]) {
    renderCategories();
    navIcons[1].classList.add('nav-selected');
    navIcons[0].classList.remove('nav-selected');
  }
});

navSide.addEventListener('click', function (event) {
  if (event.target === navLinks[0]) {
    renderIngredients();
    navLinks[1].classList.remove('text-selected');
    navLinks[0].classList.add('text-selected');
    headerText.textContent = 'Ingredients';
  } else if (event.target === navLinks[1]) {
    renderCategories();
    navLinks[0].classList.remove('text-selected');
    navLinks[1].classList.add('text-selected');
    headerText.textContent = 'Categories';
  }
});

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
      textList.appendChild(ingredient);
    }
  });
  xhrIngredients.send();
}

function renderCategories() {
  openListPage();
  if (textList.hasChildNodes()) clearList(textList);
  const xhrCategories = new XMLHttpRequest();
  xhrCategories.open('GET', 'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
  xhrCategories.responseType = 'json';
  xhrCategories.addEventListener('load', function (event) {
    for (const item of xhrCategories.response.drinks) {
      const ingredient = document.createElement('p');
      ingredient.textContent = item.strCategory;
      ingredient.className = 'list-item';
      ingredient.addEventListener('click', handleCategoryClick);
      textList.appendChild(ingredient);
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
  });
  xhrFilterByC.send();
}

function clearList(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
