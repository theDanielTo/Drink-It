const homePage = document.querySelector('.page-home');
const ingredBtn = document.querySelector('#ingred-btn');
const categBtn = document.querySelector('#categ-btn');

const listPage = document.querySelector('.page-list');
const homeBtn = document.querySelector('.home-icon');
const textList = document.querySelector('.text-list');

const navBottom = document.querySelector('.nav-bottom');
const navIcons = document.querySelectorAll('.nav-icon');

const navSide = document.querySelector('.nav-links');
const navLinks = document.querySelectorAll('.nav-link');

ingredBtn.addEventListener('click', function (event) {
  openListPage();
  if (textList.hasChildNodes()) clearList(textList);
  renderIngredients();
  ingredBtn.classList.add('btn-selected');
  navIcons[0].classList.add('nav-selected');
  categBtn.classList.remove('btn-selected');
  navIcons[1].classList.remove('nav-selected');
});

categBtn.addEventListener('click', function (event) {
  openListPage();
  if (textList.hasChildNodes()) clearList(textList);
  renderCategories();
  categBtn.classList.add('btn-selected');
  navIcons[1].classList.add('nav-selected');
  ingredBtn.classList.remove('btn-selected');
  navIcons[0].classList.remove('nav-selected');
});

homeBtn.addEventListener('click', function () {
  listPage.classList.add('hidden');
  homePage.classList.remove('hidden');
  homeBtn.classList.add('hidden');
  ingredBtn.classList.remove('btn-selected');
  categBtn.classList.remove('btn-selected');
  navIcons[0].classList.remove('nav-selected');
  navIcons[1].classList.remove('nav-selected');
  navLinks[1].classList.remove('text-selected');
  navLinks[0].classList.remove('text-selected');
});

navBottom.addEventListener('click', function (event) {
  if (event.target === navIcons[0]) {
    openListPage();
    renderIngredients();
    ingredBtn.classList.add('btn-selected');
    navIcons[0].classList.add('nav-selected');
  } else if (event.target === navIcons[1]) {
    openListPage();
    renderCategories();
    categBtn.classList.add('btn-selected');
    navIcons[1].classList.add('nav-selected');
  }
});

navSide.addEventListener('click', function (event) {
  if (event.target === navLinks[0]) {
    openListPage();
    if (textList.hasChildNodes()) clearList(textList);
    renderIngredients();
    navLinks[1].classList.remove('text-selected');
    navLinks[0].classList.add('text-selected');
  } else if (event.target === navLinks[1]) {
    openListPage();
    if (textList.hasChildNodes()) clearList(textList);
    renderCategories();
    navLinks[0].classList.remove('text-selected');
    navLinks[1].classList.add('text-selected');
  }
});

function openListPage() {
  listPage.classList.remove('hidden');
  homePage.classList.add('hidden');
  homeBtn.classList.remove('hidden');
}

function renderIngredients() {
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
  const xhrCategories = new XMLHttpRequest();
  xhrCategories.open('GET', 'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
  xhrCategories.responseType = 'json';
  xhrCategories.addEventListener('load', function (event) {
    for (const item of xhrCategories.response.drinks) {
      const ingredient = document.createElement('p');
      ingredient.textContent = item.strCategory;
      ingredient.className = 'list-item';
      textList.appendChild(ingredient);
    }
  });
  xhrCategories.send();
}

function clearList(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
