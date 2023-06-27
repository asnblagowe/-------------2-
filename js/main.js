const API = "http://localhost:8013/products";
let cartIcon = document.querySelector("#cart-icon");
let cart = document.querySelector(".cart");
let closeCart = document.querySelector("#close-cart");
const pagList = document.querySelector(".pagination-list");
const next = document.querySelector("#next");
const prev = document.querySelector("#prev");

const filter = document.querySelectorAll('input[type="radio"]');
let category = "";

const deleteSLick = document.querySelector(".bx-trash-alt");

const cartAdminIcon = document.querySelector("#cart-admin");
const modal = document.querySelector(".modal");

const limit = 8;

let currentPage = 1;

let pageTotalCount = 1;

async function getData() {
  const res = await fetch(
    `${API}?_limit=${limit}&_page=${currentPage}&category_like=${category}`
  );
  const data = await res.json();
  const count = res.headers.get("x-total-count");
  pageTotalCount = Math.ceil(count / limit);
  return data;
}

filter.forEach((item) => {
  item.addEventListener("click", (e) => {
    category = e.target.id;
    render();
  });
});

async function deleteProduct(id) {
  await fetch(`${API}/${id}`, {
    method: "DELETE",
  });
  render();
}

document.addEventListener("click", (e) => {
  if (e.target.classList[1] === "bx-trash-alt") {
    deleteProduct(e.target.id);
  }
});

async function render() {
  const data = await getData();
  let cartContent = document.getElementsByClassName("cart-content")[0];

  console.log(cartContent, "fsdfsd");
  const shopContent = document.querySelector(".shop-content");
  shopContent.innerHTML = "";

  data.forEach((item) => {
    const productBox = document.createElement("div");
    productBox.classList.add("product-box");

    productBox.innerHTML += `
      <img src="${item.image}" alt="" class="product-img" />
      <h2 class="product-title">${item.title}</h2>
      <span class="price">$${item.price}</span>
    

      <i class="bx bx-shopping-bag add-cart"></i>
      <i class="bx bx-trash-alt" id=${item.id}></i>
    `;
    shopContent.appendChild(productBox);
  });

  const addCartButtons = document.getElementsByClassName("add-cart");
  for (let i = 0; i < addCartButtons.length; i++) {
    addCartButtons[i].addEventListener("click", addCartClicked);
  }
}

render();

cartIcon.onclick = () => {
  cart.classList.add("active");
};

closeCart.onclick = () => {
  cart.classList.remove("active");
};

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", ready);
} else {
  ready();
}

function ready() {
  let removeCartButtons = document.getElementsByClassName("cart-remove");
  for (let i = 0; i < removeCartButtons.length; i++) {
    removeCartButtons[i].addEventListener("click", removeCartItem);
  }

  let quantityInputs = document.getElementsByClassName("cart-quantity");
  for (let i = 0; i < quantityInputs.length; i++) {
    quantityInputs[i].addEventListener("change", quantityChanged);
  }

  document
    .getElementsByClassName("btn-buy")[0]
    .addEventListener("click", buyButtonClicked);
}

function addCartClicked(event) {
  let button = event.target;
  let shopProduct = button.parentElement;
  let title = shopProduct.getElementsByClassName("product-title")[0].innerText;
  let price = shopProduct.getElementsByClassName("price")[0].innerText;
  let productImg = shopProduct.getElementsByClassName("product-img")[0].src;
  addProductToCart(title, price, productImg);
  updateTotal();
}

function addProductToCart(title, price, productImg) {
  let cartContent = document.getElementsByClassName("cart-content")[0];
  let cartItems = cartContent.getElementsByClassName("cart-box");
  for (let i = 0; i < cartItems.length; i++) {
    let cartItem = cartItems[i];
    let cartItemTitle =
      cartItem.getElementsByClassName("cart-product-title")[0];
    if (cartItemTitle.innerText === title) {
      alert("Вы уже добавили этот товар в корзину");
      return;
    }
  }

  let cartShopBox = document.createElement("div");
  cartShopBox.classList.add("cart-box");
  let cartBoxContent = `
    <img src="${productImg}" alt="" class="cart-img" />
    <div class="detail-box">
      <div class="cart-product-title">${title}</div>
      <div class="cart-price">${price}</div>
      <input type="number" value="1" class="cart-quantity" />
      
    </div>
    
    <i class="bx bxs-trash-alt cart-remove"></i>
  `;
  cartShopBox.innerHTML = cartBoxContent;
  cartContent.appendChild(cartShopBox);

  let removeCartButtons = cartShopBox.getElementsByClassName("cart-remove");
  removeCartButtons[0].addEventListener("click", removeCartItem);

  let quantityInputs = cartShopBox.getElementsByClassName("cart-quantity");
  quantityInputs[0].addEventListener("change", quantityChanged);

  updateTotal();
}

function removeCartItem(event) {
  let buttonClicked = event.target;
  buttonClicked.parentElement.remove();
  updateTotal();
}

function quantityChanged(event) {
  let input = event.target;
  if (isNaN(input.value) || input.value <= 0) {
    input.value = 1;
  }
  updateTotal();
}

function buyButtonClicked() {
  alert("Ваш заказ обрабатывается");
  let cartContent = document.getElementsByClassName("cart-content")[0];
  while (cartContent.hasChildNodes()) {
    cartContent.removeChild(cartContent.firstChild);
  }
  updateTotal();
}

function updateTotal() {
  let cartContent = document.getElementsByClassName("cart-content")[0];
  let cartBoxes = cartContent.getElementsByClassName("cart-box");
  let total = 0;
  for (let i = 0; i < cartBoxes.length; i++) {
    let cartBox = cartBoxes[i];
    let priceElement = cartBox.getElementsByClassName("cart-price")[0];
    let quantityElement = cartBox.getElementsByClassName("cart-quantity")[0];
    let price = parseFloat(priceElement.innerText.replace("$", ""));
    let quantity = quantityElement.value;
    total += price * quantity;
  }

  total = Math.round(total * 100) / 100;
  document.getElementsByClassName("total-price")[0].innerText = "$" + total;
}

const toggleSwitch = document.getElementById("toggleSwitch");

toggleSwitch.addEventListener("change", function () {
  const body = document.body;

  if (toggleSwitch.checked) {
    body.classList.add("dark-mode");
  } else {
    body.classList.remove("dark-mode");
  }
});
// pagination
async function getProducts() {
  const res = await fetch(
    `${API}?title_like=${searchVal}&_limit=${limit}&_page=${currentPage}`
  );
  const data = await res.json();
  const count = res.headers.get("x-total-count");
  pageTotalCount = Math.ceil(count / limit);
  return data; //? возвращаем данные
}

function renderPagination() {
  pagList.innerHTML = "";
  for (let i = 1; i <= pageTotalCount; i++) {
    pagList.innerHTML += `
  <li class="page-item ${
    i === currentPage ? "active" : ""
  }"><button class="page-link page-number">${i}</button></li>
  `;
  }

  if (currentPage <= 1) {
    prev.classList.add("disabled");
  } else {
    prev.classList.remove("disabled");
  }

  if (currentPage >= pageTotalCount) {
    next.classList.add("disabled");
  } else {
    next.classList.remove("disabled");
  }
}

next.addEventListener("click", () => {
  if (currentPage >= pageTotalCount) {
    return;
  }
  currentPage++;
  render();
});

prev.addEventListener("click", () => {
  if (currentPage <= 1) {
    return;
  }
  currentPage--;
  render();
});

document.addEventListener("click", (e) => {
  if (e.target.classList.contains("page-number")) {
    currentPage = +e.target.innerText;
    render();
  }
});

//admin

cartAdminIcon.addEventListener("click", toggleModal);

function toggleModal() {
  modal.classList.toggle("active");
}
// Открытие модального окна при нажатии на иконку
document.getElementById("cart-admin").addEventListener("click", function () {
  document.getElementById("modal").style.display = "block";
});

// Закрытие модального окна при нажатии на крестик
document.querySelector(".close").addEventListener("click", function () {
  document.getElementById("modal").style.display = "none";
});
// Событие клика на кнопку "Add" в модальном окне
document
  .querySelector("#add-form")
  .addEventListener("click", async function () {
    // Получаем значения полей ввода из модального окна
    const title = document.querySelector(
      "#modal input[placeholder='title']"
    ).value;
    const price = document.querySelector(
      "#modal input[placeholder='price']"
    ).value;
    const image = document.querySelector(
      "#modal input[placeholder='image']"
    ).value;

    // Создаем объект с данными для отправки на сервер
    const data = {
      title: title,
      price: price,
      image: image,
    };

    try {
      // Отправляем данные на сервер с помощью POST-запроса
      const response = await fetch(API, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        // Выводим сообщение об успешном сохранении данных
        alert("Данные успешно сохранены!");
        // Скрываем модальное окно
        document.getElementById("modal").style.display = "none";
      } else {
        // Выводим сообщение об ошибке при сохранении данных
        alert("Произошла ошибка при сохранении данных!");
      }
    } catch (error) {
      // Выводим сообщение об ошибке при сохранении данных
      alert("Произошла ошибка при сохранении данных!");
      console.error(error);
    }
  });
// delete
