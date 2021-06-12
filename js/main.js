/* eslint-disable no-undef */
const $homePage = document.querySelector('.page-home');
const $homeBtn = document.querySelector('.home-icon');
const $listPage = document.querySelector('.page-list');
const $mainLogo = document.querySelector('.main-logo');
const $randomBtn = document.querySelector('.random-btn');

const $mainHeader = document.querySelector('.main-header');
const $headerText = document.querySelector('#main-header-text');
const $subHeader = document.querySelector('#sub-header-text');
const $horizontalRule = document.querySelector('#horizontal-rule');

const $searchBox = document.querySelector('.search-box');
const $searchInput = document.querySelector('#search-input');

const $modalBg = document.querySelector('.modal-bg');
const $modalYes = document.querySelector('#modal-yes');
const $modalCancel = document.querySelector('#modal-cancel');

const $navBottom = document.querySelector('.nav-bottom');
const $navSide = document.querySelector('.nav-links');
const $navIcons = document.querySelectorAll('.nav-icon');
const $navLinks = document.querySelectorAll('.nav-link');

$homeBtn.addEventListener('click', function () {
  $homeBtn.classList.add('hidden');
  $listPage.classList.add('hidden');
  $searchBox.classList.add('hidden');
  $randomBtn.classList.add('hidden');
  $homePage.classList.remove('hidden');
  $mainHeader.classList.remove('hidden');
  $headerText.classList.remove('hidden');
  $subHeader.classList.remove('hidden');
  $horizontalRule.classList.remove('hidden');
  $headerText.textContent = 'Drink It!';
  $subHeader.textContent = 'Discover your next favorite drink';
  removeSelectedColors();
  gsap.from('.logo', {
    duration: 1,
    y: -600,
    delay: 0.2,
    stagger: 0.2,
    ease: 'bounce',
    force3D: true
  });
  gsap.from('.fa-circle', { duration: 1, y: -600, ease: 'bounce' });
});

$navBottom.addEventListener('click', function (event) {
  $randomBtn.classList.add('hidden');
  $mainHeader.classList.remove('hidden');
  $headerText.classList.remove('hidden');
  $horizontalRule.classList.remove('hidden');
  $subHeader.classList.remove('hidden');
  removeSelectedColors();
  openListPage();
  if ($listPage.hasChildNodes()) clearList($listPage);
  if ($listPage.nextElementSibling.classList.contains('drink-detailed')) {
    $listPage.nextElementSibling.remove();
  }
  if (event.target === $navIcons[0]) {
    $listPage.appendChild(renderIngredientsList());
    $searchBox.classList.add('hidden');
    $navIcons[0].classList.add('nav-selected');
    $headerText.textContent = 'Ingredients';
    $subHeader.textContent = 'Click on an ingredient to filter drinks by ingredient!';
  } else if (event.target === $navIcons[1]) {
    $listPage.appendChild(renderCategoriesList());
    $searchBox.classList.add('hidden');
    $navIcons[1].classList.add('nav-selected');
    $headerText.textContent = 'Categories';
    $subHeader.textContent = 'Click on a category to filter drinks by category!';
  } else if (event.target === $navIcons[2]) {
    $searchBox.classList.remove('hidden');
    $listPage.classList.add('hidden');
    $searchInput.value = '';
    $navIcons[2].classList.add('nav-selected');
    $headerText.textContent = '';
    $horizontalRule.classList.add('hidden');
    $subHeader.textContent = '';
  } else if (event.target === $navIcons[3]) {
    $listPage.appendChild(renderFavoritesList());
    $searchBox.classList.add('hidden');
    $navIcons[3].classList.replace('far', 'fas');
    $headerText.textContent = 'Favorites';
    $subHeader.textContent = 'Click on a picture of a drink for its recipe!';
  }
  gsap.from('.main-header', { duration: 0.5, opacity: 0, scale: 2, ease: 'slow' });
  gsap.from('.nav-icon', {
    duration: 0.5,
    scale: 0.5,
    opacity: 0,
    delay: 0.2,
    stagger: 0.2,
    ease: 'elastic',
    force3D: true
  });
});

$navSide.addEventListener('click', function (event) {
  $randomBtn.classList.add('hidden');
  $horizontalRule.classList.remove('hidden');
  $subHeader.classList.remove('hidden');
  removeSelectedColors();
  openListPage();
  if ($listPage.hasChildNodes()) clearList($listPage);
  if ($listPage.nextElementSibling.classList.contains('drink-detailed')) {
    $listPage.nextElementSibling.remove();
  }
  if (event.target === $navLinks[0]) {
    $listPage.appendChild(renderIngredientsList());
    $searchBox.classList.add('hidden');
    $navLinks[0].classList.add('text-selected');
    $headerText.textContent = 'Ingredients';
    $subHeader.textContent = 'Click on an ingredient to filter drinks by ingredient!';
  } else if (event.target === $navLinks[1]) {
    $listPage.appendChild(renderCategoriesList());
    $searchBox.classList.add('hidden');
    $navLinks[1].classList.add('text-selected');
    $headerText.textContent = 'Categories';
    $subHeader.textContent = 'Click on a category to filter drinks by category!';
  } else if (event.target === $navLinks[2]) {
    $listPage.classList.add('hidden');
    $searchInput.value = '';
    $headerText.textContent = '';
    $horizontalRule.classList.add('hidden');
    $subHeader.textContent = '';
    $searchBox.classList.remove('hidden');
    $navLinks[2].classList.add('text-selected');
  } else if (event.target === $navLinks[3]) {
    $listPage.appendChild(renderFavoritesList());
    $searchBox.classList.add('hidden');
    $navLinks[3].classList.add('text-selected');
    $headerText.textContent = 'Favorites';
    $subHeader.textContent = 'Click on a picture of a drink for its recipe!';
  }
  gsap.from('.main-header', { duration: 1.5, opacity: 0, scale: 0.5, ease: 'elastic' });
  gsap.from('.nav-link', {
    duration: 0.5,
    scale: 0.5,
    opacity: 0,
    delay: 0.1,
    stagger: 0.2,
    ease: 'elastic',
    force3D: true
  });
});

$searchBox.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    $searchBox.classList.add('hidden');
    $listPage.classList.remove('hidden');
    handleSearch();
  }
});

$mainLogo.addEventListener('click', handleRandom);

$randomBtn.addEventListener('click', handleRandom);

$modalYes.addEventListener('click', function (event) {
  const idToDel = parseInt($modalYes.getAttribute('drink-id'));
  for (const li of $textList.childNodes) {
    const liDrinkId = parseInt(li.getAttribute('drink-id'));
    if (idToDel === liDrinkId) {
      $textList.removeChild(li);
      for (let i = 0; i < favoriteDrinks.length; i++) {
        if (favoriteDrinks[i].idDrink === idToDel.toString()) {
          favoriteDrinks.splice(i, 1);
          break;
        }
      }
      break;
    }
  }
  $modalBg.classList.add('hidden');
});

$modalCancel.addEventListener('click', function (event) {
  $modalBg.classList.add('hidden');
});

function openListPage() {
  $listPage.classList.remove('hidden');
  $homePage.classList.add('hidden');
  $homeBtn.classList.remove('hidden');
}

function handleIngredientClick(event) {
  openListPage();
  if ($listPage.hasChildNodes()) clearList($listPage);
  $headerText.classList.remove('hidden');
  $headerText.textContent = event.target.textContent;
  $subHeader.textContent = 'Click on a picture of a drink for its recipe!';
  const $list = renderListPage();
  const xhrFilterByC = new XMLHttpRequest();
  xhrFilterByC.open('GET',
    'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/filter.php?i=' + event.target.textContent);
  xhrFilterByC.responseType = 'json';
  xhrFilterByC.addEventListener('load', function (event) {
    for (const item of xhrFilterByC.response.drinks) {
      $list.appendChild(renderDrinkRow(item, false));
    }
  });
  xhrFilterByC.send();
  $listPage.appendChild($list);
}

function handleCategoryClick(event) {
  if ($listPage.hasChildNodes()) clearList($listPage);
  $headerText.classList.remove('hidden');
  $headerText.textContent = event.target.textContent;
  $subHeader.textContent = 'Click on a picture of a drink for its recipe!';
  const $list = renderListPage();
  const xhrFilterByC = new XMLHttpRequest();
  xhrFilterByC.open('GET',
    'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/filter.php?c=' + event.target.textContent);
  xhrFilterByC.responseType = 'json';
  xhrFilterByC.addEventListener('load', function (event) {
    for (const item of xhrFilterByC.response.drinks) {
      $list.appendChild(renderDrinkRow(item, false));
    }
  });
  xhrFilterByC.send();
  $listPage.appendChild($list);
}

function handleSearch() {
  $headerText.textContent = $searchInput.value.toUpperCase();
  $subHeader.textContent = 'Click on a picture of a drink for its recipe!';
  const $list = renderListPage();
  const xhrSearch = new XMLHttpRequest();
  xhrSearch.open('GET',
    'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/search.php?s=' + $searchInput.value);
  xhrSearch.responseType = 'json';
  xhrSearch.addEventListener('load', function (event) {
    if (xhrSearch.response.drinks === null) {
      $headerText.textContent = 'No drinks were found.';
    } else {
      for (const item of xhrSearch.response.drinks) {
        $list.appendChild(renderDrinkRow(item, false));
      }
    }
  });
  xhrSearch.send();
  $listPage.appendChild($list);
}

function handleRandom(event) {
  $homePage.classList.add('hidden');
  $listPage.classList.add('hidden');
  $horizontalRule.classList.add('hidden');
  $subHeader.classList.add('hidden');
  $homeBtn.classList.remove('hidden');
  $randomBtn.classList.remove('hidden');
  $mainHeader.classList.remove('hidden');
  const xhrRandom = new XMLHttpRequest();
  xhrRandom.open('GET',
    'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/random.php');
  xhrRandom.responseType = 'json';
  xhrRandom.addEventListener('load', function (event) {
    if ($listPage.nextElementSibling.classList.contains('drink-detailed')) {
      $listPage.nextElementSibling.remove();
    }
    $listPage.insertAdjacentElement('afterend',
      renderDetailedDrink(xhrRandom.response.drinks[0]));
  });
  xhrRandom.send();
}

function handleDelete() {
  $modalBg.classList.remove('hidden');
}

function renderListPage() {
  const $list = document.createElement('ul');
  $list.className = 'text-list border-round';
  return $list;
}

function renderIngredientsList() {
  const $list = document.createElement('ul');
  $list.className = 'text-list border-round';
  const xhrIngredients = new XMLHttpRequest();
  xhrIngredients.open('GET',
    'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/list.php?i=list');
  xhrIngredients.responseType = 'json';
  xhrIngredients.addEventListener('load', function (event) {
    for (const item of xhrIngredients.response.drinks) {
      const ingredient = document.createElement('p');
      ingredient.textContent = item.strIngredient1;
      ingredient.className = 'list-item';
      ingredient.addEventListener('click', handleIngredientClick);
      $list.appendChild(ingredient);
    }
  });
  xhrIngredients.send();
  return $list;
}

function renderCategoriesList() {
  const $list = document.createElement('ul');
  $list.className = 'text-list border-round';
  const xhrCategories = new XMLHttpRequest();
  xhrCategories.open('GET',
    'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/list.php?c=list');
  xhrCategories.responseType = 'json';
  xhrCategories.addEventListener('load', function (event) {
    for (const item of xhrCategories.response.drinks) {
      const category = document.createElement('p');
      category.textContent = item.strCategory;
      category.className = 'list-item';
      category.addEventListener('click', handleCategoryClick);
      $list.appendChild(category);
    }
  });
  xhrCategories.send();
  return $list;
}

function renderFavoritesList() {
  const $list = document.createElement('ul');
  $list.className = 'text-list border-round';
  for (const drink of favoriteDrinks) {
    $list.appendChild(renderDrinkRow(drink, true));
  }
  return $list;
}

function renderDrinkRow(item, isFav) {
  const drink = document.createElement('div');
  drink.className = 'drink-row';
  drink.setAttribute('drink-id', item.idDrink);
  const drinkImg = document.createElement('img');
  drinkImg.src = item.strDrinkThumb;
  drinkImg.alt = item.strDrink;
  drinkImg.className = 'drink-img border-round';
  drinkImg.addEventListener('click', function (event) {
    $homePage.classList.add('hidden');
    $listPage.classList.add('hidden');
    $randomBtn.classList.add('hidden');
    $horizontalRule.classList.add('hidden');
    $subHeader.classList.add('hidden');
    $homeBtn.classList.remove('hidden');
    $mainHeader.classList.remove('hidden');
    const xhrById = new XMLHttpRequest();
    xhrById.open('GET',
      'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=' + drink.getAttribute('drink-id'));
    xhrById.responseType = 'json';
    xhrById.addEventListener('load', function (event) {
      renderDetailedDrink(xhrById.response.drinks[0]);
      if ($listPage.nextElementSibling.classList.contains('drink-detailed')) {
        $listPage.nextElementSibling.remove();
      }
      $listPage.insertAdjacentElement('afterend',
        renderDetailedDrink(xhrById.response.drinks[0]));
    });
    xhrById.send();
  });
  drink.appendChild(drinkImg);
  const rightCol = document.createElement('div');
  rightCol.className = 'drink-right-col col-8 border-round';
  drink.appendChild(rightCol);
  const drinkName = document.createElement('p');
  drinkName.textContent = item.strDrink;
  rightCol.appendChild(drinkName);
  if (isFav) {
    const trash = document.createElement('i');
    trash.className = 'far fa-trash-alt';
    trash.addEventListener('click', function (event) {
      $modalYes.setAttribute('drink-id', item.idDrink);
      gsap.from('.modal-box', {
        duration: 0.5,
        x: 3000,
        ease: 'ease'
      });
      handleDelete();
    });
    rightCol.appendChild(trash);
  } else {
    const heart = document.createElement('i');
    heart.className = 'far fa-heart';
    heart.addEventListener('click', function (event) {
      heart.classList.replace('far', 'fas');
      favoriteDrinks.push(item);
    });
    rightCol.appendChild(heart);
  }
  return drink;
}

function renderDetailedDrink(drink) {
  $headerText.textContent = drink.strDrink;
  const $detailedDrink = document.createElement('div');
  $detailedDrink.className = 'drink-detailed border-round';
  const topRow = document.createElement('div');
  topRow.className = 'detail-top-row';
  const drinkImg = document.createElement('img');
  drinkImg.className = 'detailed-img col-4 border-round';
  drinkImg.src = drink.strDrinkThumb;
  drinkImg.alt = 'Random Drink';
  const drinkName = document.createElement('h2');
  drinkName.className = 'col-5 drink-name';
  drinkName.textContent = drink.strDrink;
  const heart = document.createElement('i');
  heart.className = 'far fa-heart';
  heart.addEventListener('click', function (event) {
    heart.classList.replace('far', 'fas');
    favoriteDrinks.push(drink);
  });
  topRow.appendChild(drinkImg);
  topRow.appendChild(heart);
  const detailsTable = document.createElement('table');
  detailsTable.className = 'details-table col-8';
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
  instructions.className = 'border-round';
  instructions.innerHTML = '<b style="font-size:1rem;">Instructions: </b>' + drink.strInstructions;
  const detailsDiv = document.createElement('div');
  detailsDiv.className = 'details-div border-round';
  detailsDiv.appendChild(detailsTable);
  detailsDiv.appendChild(instructions);
  $detailedDrink.appendChild(topRow);
  $detailedDrink.appendChild(detailsDiv);
  return $detailedDrink;
}

function removeSelectedColors() {
  $navIcons[0].classList.remove('nav-selected');
  $navIcons[1].classList.remove('nav-selected');
  $navIcons[2].classList.remove('nav-selected');
  $navIcons[3].classList.replace('fas', 'far');
  $navLinks[0].classList.remove('text-selected');
  $navLinks[1].classList.remove('text-selected');
  $navLinks[2].classList.remove('text-selected');
  $navLinks[3].classList.remove('text-selected');
}

function clearList(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}
