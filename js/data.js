/* exported data */
var favoriteDrinks = [];

const previousDrinksJSON = window.localStorage.getItem('drinks-local-storage');
if (previousDrinksJSON !== null) favoriteDrinks = JSON.parse(previousDrinksJSON);

window.addEventListener('beforeunload', function () {
  const todosJSON = JSON.stringify(favoriteDrinks);
  window.localStorage.setItem('drinks-local-storage', todosJSON);
});
