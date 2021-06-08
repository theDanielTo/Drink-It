const homePage = document.querySelector('.page-home');
const ingredBtn = document.querySelector('#ingred-btn');
const drinksBtn = document.querySelector('#drinks-btn');

const ingredPage = document.querySelector('.page-ingredients');
const homeBtn = document.querySelector('.home-icon');
const ingredList = document.querySelector('.ingredients-list');

const navBottom = document.querySelector('.nav-bottom');
const navIcons = document.querySelectorAll('.nav-icon');

ingredBtn.addEventListener('click', openIngredients);

homeBtn.addEventListener('click', function () {
  ingredPage.classList.add('hidden');
  homePage.classList.remove('hidden');
  homeBtn.classList.add('hidden');
  ingredBtn.classList.remove('btn-selected');
  navIcons[0].classList.remove('nav-selected');
});

navBottom.addEventListener('click', function (event) {
  if (navIcons[0]) openIngredients();
});

function openIngredients() {
  ingredPage.classList.remove('hidden');
  homePage.classList.add('hidden');
  homeBtn.classList.remove('hidden');
  ingredBtn.classList.add('btn-selected');
  navIcons[0].classList.add('nav-selected');
  renderIngredients();
}

function renderIngredients() {
  var xhrIngredients = new XMLHttpRequest();
  xhrIngredients.open('GET', 'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
  xhrIngredients.responseType = 'json';
  xhrIngredients.addEventListener('load', function (event) {
    for (const item of xhrIngredients.response.drinks) {
      const ingredient = document.createElement('p');
      ingredient.textContent = item.strIngredient1;
      ingredient.className = 'ingred-li';
      ingredList.appendChild(ingredient);
    }
  });
  xhrIngredients.send();
}
