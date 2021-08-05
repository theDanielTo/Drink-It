/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
const $homePage = document.querySelector('.page-home');
const $homeBtn = document.querySelector('.home-icon');
const $backBtn = document.querySelector('.back-btn');
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

const apiUrl = 'https://lfz-cors.herokuapp.com/?url=https://www.thecocktaildb.com/api/json/v1/1/';

$homeBtn.addEventListener('click', event => {
  $homeBtn.classList.add('hidden');
  $backBtn.classList.add('hidden');
  $listPage.classList.add('hidden');
  $searchBox.classList.add('hidden');

  $homePage.classList.remove('hidden');
  $mainHeader.classList.remove('hidden');
  $headerText.classList.remove('hidden');
  $headerText.textContent = 'Drink It!';
  $subHeader.textContent = 'Discover your next favorite drink';

  for (const nav of $navIcons) {
    if (nav.getAttribute('nav-data') === 'favorites') {
      nav.classList.replace('fas', 'far');
    } else nav.classList.remove('nav-selected');
  }

  for (const nav of $navLinks) nav.classList.remove('nav-selected');

  resetDefault();

  gsap.from('.logo', {
    duration: 1,
    y: -600,
    delay: 0.2,
    stagger: 0.2,
    ease: 'bounce',
    force3D: true
  });
  gsap.from('.fa-circle', { duration: 1, y: -600, ease: 'bounce' });
  gsap.from('#home-text', { duration: 2, opacity: 0 });
});

$backBtn.addEventListener('click', event => {
  $backBtn.classList.add('hidden');
  $listPage.classList.remove('hidden');
  $headerText.textContent = backBtnData.headerMain;
  $subHeader.textContent = backBtnData.headerSub;

  if ($listPage.nextElementSibling.classList.contains('drink-detailed')) {
    $listPage.nextElementSibling.remove();
  }
});

$navBottom.addEventListener('click', event => {
  if (event.target.hasAttribute('nav-data')) {
    $mainHeader.classList.remove('hidden');
    $headerText.classList.remove('hidden');
    handleNavClick($navIcons, event.target, event.target.getAttribute('nav-data'));
    navAnimation('.nav-icon');
  }
});

$navSide.addEventListener('click', event => {
  if (event.target.hasAttribute('nav-data')) {
    handleNavClick($navLinks, event.target, event.target.getAttribute('nav-data'));
    navAnimation('.nav-link');
  }
});

$searchBox.addEventListener('keydown', event => {
  if (event.key === 'Enter') {
    event.preventDefault();
    $searchBox.classList.add('hidden');
    $listPage.classList.remove('hidden');
    handleSearch();
  }
});

$mainLogo.addEventListener('click', handleRandom);

$randomBtn.addEventListener('click', handleRandom);

$modalYes.addEventListener('click', handleDelete);

$modalCancel.addEventListener('click', event => {
  $modalBg.classList.add('hidden');
});

function handleNavClick(navType, targetEl, navData) {
  resetDefault();
  openListPage();
  $backBtn.classList.add('hidden');

  for (const nav of navType) {
    const clickedNav = nav.getAttribute('nav-data');
    if (clickedNav === navData) {
      if (clickedNav === 'favorites' && navType === $navIcons) {
        nav.classList.replace('far', 'fas');
      } else nav.classList.add('nav-selected');
    } else {
      if (clickedNav === 'favorites' && navType === $navIcons) {
        nav.classList.replace('fas', 'far');
      } else nav.classList.remove('nav-selected');
    }
  }

  if (navData !== 's') $searchBox.classList.add('hidden');
  else $searchBox.classList.remove('hidden');

  if (navData === 'i' || navData === 'c') {
    $listPage.appendChild(renderList(event));
    if (navData === 'i') {
      $headerText.textContent = 'Ingredients';
      $subHeader.textContent = 'Click on an ingredient to filter drinks';
    } else if (navData === 'c') {
      $headerText.textContent = 'Categories';
      $subHeader.textContent = 'Click on a category to filter drinks';
    }
  } else if (navData === 's') {
    $listPage.classList.add('hidden');
    $horizontalRule.classList.add('hidden');
    $searchInput.value = '';
    $searchInput.placeholder = 'Click here to search for a drink';
    $headerText.textContent = '';
    $subHeader.textContent = '';
  } else if (navData === 'favorites') {
    $headerText.textContent = 'Favorites';
    $subHeader.textContent = 'Click on a drink for its recipe';
    $listPage.appendChild(renderFavoritesList());
    backBtnData.headerMain = $headerText.textContent;
    backBtnData.headerSub = $subHeader.textContent;
  }
}

function handleListItemClick(event) {
  clearPage();
  $headerText.classList.remove('hidden');
  $headerText.textContent = event.target.textContent;
  $subHeader.textContent = 'Click on a drink for its recipe';
  backBtnData.headerMain = $headerText.textContent;
  backBtnData.headerSub = $subHeader.textContent;

  const $list = renderListPage();
  const $loader = document.createElement('div');
  $loader.className = 'loader';
  $list.appendChild($loader);

  const urlEnd = 'filter.php?' +
                  event.target.getAttribute('list-type') +
                  '=' +
                  event.target.textContent;
  getHttpRequest(urlEnd, function (response) {
    $loader.classList.add('hidden');
    for (const item of response.drinks) {
      $list.appendChild(renderDrinkRow(item, false));
    }
  });
  $listPage.appendChild($list);
}

function handleSearch() {
  $headerText.textContent = $searchInput.value.toUpperCase();
  $subHeader.textContent = 'Click on a picture of a drink for its recipe!';
  backBtnData.headerMain = $headerText.textContent;
  backBtnData.headerSub = $subHeader.textContent;
  $horizontalRule.classList.remove('hidden');

  const $list = renderListPage();
  const $loader = document.createElement('div');
  $loader.className = 'loader';
  $list.appendChild($loader);

  getHttpRequest('search.php?s=' + $searchInput.value, function (response) {
    $loader.classList.add('hidden');
    if (response.drinks === null) {
      $headerText.textContent = 'No drinks were found.';
      $subHeader.textContent = '';
    } else {
      for (const item of response.drinks) {
        $list.appendChild(renderDrinkRow(item, false));
      }
    }
  });
  $listPage.appendChild($list);
}

function handleRandom(event) {
  $homePage.classList.add('hidden');
  $listPage.classList.add('hidden');
  $homeBtn.classList.remove('hidden');
  $randomBtn.classList.remove('hidden');
  $mainHeader.classList.remove('hidden');
  $subHeader.textContent = 'Click on the heart to add it to your favorites';

  getHttpRequest('random.php', function (response) {
    if ($listPage.nextElementSibling.classList.contains('drink-detailed')) {
      $listPage.nextElementSibling.remove();
    }
    $listPage.insertAdjacentElement('afterend',
      renderDetailedDrink(response.drinks[0]));
  });
}

function handleDelete(idToDel) {
  if (idToDel === event) {
    idToDel = parseInt($modalYes.getAttribute('drink-id'));
  }

  const $textList = document.querySelector('.text-list');
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
}

function renderListPage() {
  const $list = document.createElement('ul');
  $list.className = 'text-list border-round';
  return $list;
}

function renderList(event) {
  const $list = renderListPage();

  const $loader = document.createElement('div');
  $loader.className = 'loader';
  $list.appendChild($loader);

  const listType = event.target.getAttribute('nav-data');
  const urlEnd = 'list.php?' + listType + '=list';
  getHttpRequest(urlEnd, response => {
    $loader.classList.add('hidden');
    for (const item of response.drinks) {
      const listItem = document.createElement('p');
      listItem.textContent = (listType === 'i') ? item.strIngredient1 : item.strCategory;
      listItem.className = 'list-item';
      listItem.setAttribute('list-type', listType);
      listItem.addEventListener('click', handleListItemClick);
      $list.appendChild(listItem);
    }
  });
  return $list;
}

function renderFavoritesList() {
  const $list = renderListPage();
  for (const drink of favoriteDrinks) {
    $list.appendChild(renderDrinkRow(drink, true));
  }
  return $list;
}

function handleCardClick(event) {
  $homePage.classList.add('hidden');
  $listPage.classList.add('hidden');
  $randomBtn.classList.add('hidden');

  $homeBtn.classList.remove('hidden');
  $backBtn.classList.remove('hidden');
  $mainHeader.classList.remove('hidden');
  $subHeader.textContent = 'Click on the heart to add it to your favorites';

  getHttpRequest('lookup.php?i=' + event.target.getAttribute('drink-id'), response => {
    if ($listPage.nextElementSibling.classList.contains('drink-detailed')) {
      $listPage.nextElementSibling.remove();
    }
    $listPage.insertAdjacentElement('afterend',
      renderDetailedDrink(response.drinks[0]));
  });
}

function renderDrinkRow(item, isFav) {
  const drink = document.createElement('div');
  drink.className = 'drink-row';
  drink.setAttribute('drink-id', item.idDrink);

  const drinkImg = document.createElement('img');
  drinkImg.src = item.strDrinkThumb;
  drinkImg.alt = item.strDrink;
  drinkImg.className = 'drink-img';
  drinkImg.setAttribute('drink-id', item.idDrink);
  drinkImg.addEventListener('click', handleCardClick);
  drink.appendChild(drinkImg);

  const rightCol = document.createElement('div');
  rightCol.className = 'drink-right-col col-12';
  rightCol.setAttribute('drink-id', item.idDrink);
  rightCol.addEventListener('click', handleCardClick);
  drink.appendChild(rightCol);

  const drinkName = document.createElement('p');
  drinkName.textContent = item.strDrink;
  rightCol.appendChild(drinkName);
  if (isFav) {
    const trash = document.createElement('i');
    trash.className = 'far fa-trash-alt';
    trash.addEventListener('click', event => {
      $modalYes.setAttribute('drink-id', item.idDrink);
      gsap.from('.modal-box', {
        duration: 0.5,
        x: 3000,
        ease: 'ease'
      }, false);
      $modalBg.classList.remove('hidden');
    });
    drink.appendChild(trash);
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
  drinkImg.className = 'detailed-img border-round';
  drinkImg.src = drink.strDrinkThumb;
  drinkImg.alt = 'Random Drink';

  const drinkName = document.createElement('h2');
  drinkName.className = 'col-5 drink-name';
  drinkName.textContent = drink.strDrink;

  const heart = document.createElement('i');
  heart.className = 'far fa-heart detailed-heart';

  const drinkInFav = favoriteDrinks.find(obj => {
    return obj.idDrink === drink.idDrink;
  });
  if (drinkInFav !== undefined) {
    heart.classList.replace('far', 'fas');
  }

  heart.addEventListener('click', event => {
    const drinkInFav = favoriteDrinks.find(obj => {
      return obj.idDrink === drink.idDrink;
    });
    if (drinkInFav === undefined) {
      heart.classList.replace('far', 'fas');
      favoriteDrinks.push(drink);
    } else {
      heart.classList.replace('fas', 'far');
      handleDelete(parseInt(drink.idDrink));
    }
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

function getHttpRequest(urlEnd, callback) {
  const request = new XMLHttpRequest();
  request.open('GET', apiUrl + urlEnd);
  request.responseType = 'json';
  request.addEventListener('load', event => {
    callback(request.response);
  });
  request.send();
}

function navAnimation(navClass) {
  gsap.from(navClass, {
    duration: 0.5,
    scale: 0.5,
    opacity: 0,
    delay: 0.1,
    stagger: 0.1,
    ease: 'elastic',
    force3D: true
  });
  gsap.from('.main-header', { duration: 0.5, opacity: 0, scale: 0.5, ease: 'slow' });
}

function openListPage() {
  $listPage.classList.remove('hidden');
  $homePage.classList.add('hidden');
  $homeBtn.classList.remove('hidden');
}

function resetDefault() {
  clearPage();
  $randomBtn.classList.add('hidden');
  $horizontalRule.classList.remove('hidden');
  $subHeader.classList.remove('hidden');
}

function clearPage() {
  if ($listPage.hasChildNodes()) {
    while ($listPage.firstChild) {
      $listPage.removeChild($listPage.firstChild);
    }
  }
  if ($listPage.nextElementSibling.classList.contains('drink-detailed')) {
    $listPage.nextElementSibling.remove();
  }
}
