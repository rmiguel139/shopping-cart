const carrinho = '.cart__items';

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function loadingPage() {
  const load = document.createElement('span');
  load.innerText = 'loading...';
  load.className = 'loading';
  document.body.appendChild(load);
}
function removeLoading() {
  const load = document.querySelector('.loading');
  load.remove();
}

function salvarLocalStorage() {
  localStorage.setItem('produto', document.querySelector(carrinho).innerHTML);
}

function sumPrices() {
  const lista = document.querySelectorAll('.cart__item');
  const price = document.querySelector('.total-price');
  let total = 0;
  lista.forEach((li) => {
    const priceItem = parseFloat(li.innerHTML.match(/([0-9.]){1,}$/)[0]);
    total += priceItem;
  });
  price.innerHTML = total;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function cartItemListener(event) {
  document.querySelector(carrinho).removeChild(event.target);
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemListener);
  return li;
}

const selecionar = (event) => {
  loadingPage();
  fetch(`https://api.mercadolibre.com/items/${getSkuFromProductItem(event.target.parentNode)}`)
    .then((response) => response.json())
    .then((object) => {
      const objeto = document.querySelector('.cart__items');
      const data = {
        sku: object.id,
        name: object.title,
        salePrice: object.price,
      };

      objeto.appendChild(createCartItemElement(data));
      sumPrices();
      salvarLocalStorage();
      removeLoading();
    })
    .catch((error) => console.log(error));
};

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  e.addEventListener('click', selecionar);
  return e;
}

function removerItem(event) {
  document.querySelector(carrinho).removeChild(event.target);
  sumPrices();
  salvarLocalStorage();
}

const f5LocalStorage = () => {
  document.querySelector(carrinho).innerHTML = localStorage.getItem('produto');
  const cartItems = document.querySelectorAll('.cart__item');
  cartItems.forEach((item) => item.addEventListener('click', removerItem));
};

function createProductItemElement({ id: sku, title: name, thumbnail: image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

const importação = (item) => {
  loadingPage();
  fetch(`https://api.mercadolibre.com/sites/MLB/search?q=$${item}`)
    .then((response) => response.json())
    .then((object) => {
      const resultado = object.results;
      const elemento = document.querySelector('.items');
      resultado.forEach((result) =>
        elemento.appendChild(createProductItemElement(result)));
      removeLoading();
    });
};
function deletarItens() {
  const deleteItens = document.querySelector('.empty-cart');
  deleteItens.addEventListener('click', () => {
    const listaUL = document.querySelector(carrinho);
    while (listaUL.hasChildNodes()) {
      listaUL.removeChild(listaUL.firstChild);
    }
  });
}

function removerFilhos(event) {
  document.querySelector(carrinho).removeChild(event.target);
  salvarLocalStorage();
  sumPrices();
}

window.onload = () => {
  importação('computador');
  f5LocalStorage();
  deletarItens();
};
