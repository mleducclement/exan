//#region GLOBALS

// PAGES
const login_page = document.querySelector("#login");
const home_page = document.querySelector("#home");
const store_page = document.querySelector("#store");
const cart_page = document.querySelector("#cart");
const createItem_form = document.querySelector("#create-item-form");
const products_page = document.querySelector("#products");
const categories_page = document.querySelector("#categories");
const employees_page = document.querySelector("#employees");
const customers_page = document.querySelector("#customers");

// PAGE LINKS
const home_buttons = [...document.querySelectorAll(".quickmenu-btn")];
const store_buttons = [...document.querySelectorAll(".store-btn")];
const cart_buttons = [...document.querySelectorAll(".cart-btn")];
const createItemForm_buttons = [
  ...document.querySelectorAll(".create-item-button"),
];
const products_buttons = [...document.querySelectorAll(".products-btn")];
const categories_buttons = [...document.querySelectorAll(".categories-btn")];
const employees_buttons = [...document.querySelectorAll(".employees-btn")];
const customers_buttons = [...document.querySelectorAll(".customers-btn")];
const logout_buttons = [...document.querySelectorAll(".logout-btn")];

// LOGIN COMPONENTS
const login_error_message = document.querySelector(".login-form-error");
const username_input = document.querySelector("#email-input");
const password_input = document.querySelector("#password-input");
const login_button = document.querySelector("#login-button");

// TABLES
const cart_table = document.querySelector("#cart-table");
const categories_table = document.querySelector("#categories-table");
const employees_table = document.querySelector("#employees-table");
const products_table = document.querySelector("#products-table");
const customers_table = document.querySelector("#customers-table");

const page_title = document.querySelector("#page-title");
const item_counter = document.querySelector(".item-counter");
const store_card_container = document.querySelector("#store .card-container");

const update_cart_btn = document.querySelector(".update-cart-button");
const total_text_div = document.querySelector(".total-text");
const total_text = document.querySelector(".total-amount");
const purchase_btn = document.querySelector(".purchase-button");

let isLoggedIn = false;
let loggedUser;
let loginTime;
let currentPage;
let currentTable;
let previousPage;

const pages = [
  {
    id: 1,
    name: "login",
    element: login_page,
    table: null,
  },
  {
    id: 2,
    name: "home",
    element: home_page,
    table: null,
  },
  {
    id: 3,
    name: "cart",
    element: cart_page,
    table: cart_table,
  },
  {
    id: 4,
    name: "Add / Modify Item",
    element: createItem_form,
    table: null,
  },
  {
    id: 5,
    name: "products",
    element: products_page,
    table: products_table,
  },
  {
    id: 6,
    name: "categories",
    element: categories_page,
    table: categories_table,
  },
  {
    id: 7,
    name: "employees",
    element: employees_page,
    table: employees_table,
  },
  {
    id: 8,
    name: "customers",
    element: customers_page,
    table: customers_table,
  },
  {
    id: 9,
    name: "store",
    element: store_page,
    table: null,
  },
];

const forms = [
  {
    form_name: "categories",
    name: { type: "input", subtype: "text", label: "Category Name" },
  },
  {
    form_name: "products",
    sku: { type: "input", subtype: "text", label: "SKU" },
    name: { type: "input", subtype: "text", label: "Product Name" },
    stock: { type: "input", subtype: "text", label: "Current Inventory" },
    price: { type: "input", subtype: "text", label: "Price" },
    category: { type: "select", subtype: "none", label: "Product Category" },
  },
  {
    form_name: "employees",
    "first name": { type: "input", subtype: "text", label: "First Name" },
    "last name": { type: "input", subtype: "text", label: "Last Name" },
    email: { type: "input", subtype: "email", label: "Email" },
    password: { type: "input", subtype: "password", label: "Password" },
    telephone: { type: "input", subtype: "tel", label: "Phone Number" },
    "hire date": { type: "input", subtype: "date", label: "Hire Date" },
  },
  {
    form_name: "customers",
    "first name": { type: "input", subtype: "text", label: "First Name" },
    "last name": { type: "input", subtype: "text", label: "Last Name" },
    email: { type: "input", subtype: "email", label: "Email" },
    telephone: { type: "input", subtype: "tel", label: "Phone Number" },
    rating: { type: "input", subtype: "number", label: "Rating" },
  },
];

let lists = [
  {
    name: "products",
    content: [],
  },
  {
    name: "categories",
    content: [],
  },
  {
    name: "employees",
    content: [],
  },
  {
    name: "customers",
    content: [],
  },
];

let cartContent = [];

// INPUT GROUPS

const login_input_group = [username_input, password_input];

let counterGroup = [];

//#endregion

//#region EVENT ADDERS

home_buttons.map((el) => {
  el.addEventListener("click", (e) => {
    showPage(2);
  });
});

cart_buttons.map((el) => {
  el.addEventListener("click", (e) => {
    rebuildCart();
    showPage(3);
  });
});

store_buttons.map((el) => {
  el.addEventListener("click", (e) => {
    buildStore();
    showPage(9);
  });
});

createItemForm_buttons.map((el) => {
  el.addEventListener("click", (e) => {
    destroyForm();
    createForm(
      // Get form with same name as current page name
      forms.find((el) => el.form_name === currentPage.name),
      createItem_form,
      false
    );
    previousPage = currentPage;
    showPage(4);
    let focusedInput = document.querySelectorAll("input")[2];
    focusedInput.focus();
  });
});

products_buttons.map((el) => {
  el.addEventListener("click", (e) => {
    createTable(products_table);
    showPage(5);
  });
});

categories_buttons.map((el) => {
  el.addEventListener("click", (e) => {
    createTable(categories_table);
    showPage(6);
  });
});

employees_buttons.map((el) => {
  el.addEventListener("click", (e) => {
    createTable(employees_table);
    showPage(7);
  });
});

customers_buttons.map((el) => {
  el.addEventListener("click", (e) => {
    createTable(customers_table);
    showPage(8);
  });
});

logout_buttons.map((el) => {
  el.addEventListener("click", (e) => {
    isLoggedIn = false;
    document.querySelector(".username-container").classList.add("hidden");
    showPage(1);
  });
});

login_button.addEventListener("click", (e) => {
  e.preventDefault();
  if (!validateForm(login_input_group)) {
    loginError({ content: "All fields must be filled" });
    return;
  }

  console.log("passed validation!");

  if (!authentify()) {
    loginError({ content: "The username or password does not match" });
  } else {
    login_error_message.classList.add("hidden");
    isLoggedIn = true;
    loginTime = new Date();
    showGreeting();
    showPage(2);
  }
});

update_cart_btn.addEventListener("click", () => {
  counterGroup.map((counter) => {
    let found = cartContent.find(
      (item) => parseInt(counter.getAttribute("data-item-id")) === item.id
    );

    found.count = counter.value;

    calculateTotal();
  });

  updateCartBadge();
});

purchase_btn.addEventListener("click", () => {
  updateStock();
  cartContent = [];
  rebuildCart();
  updateCartBadge();
});

//#endregion

//#region FUNCTIONS

const createTable = (table) => {
  let page = pages.find((el) => el.table === table);
  let list = lists.find((el) => el.name === page.name);
  let headingsList = forms.find((el) => el.form_name === page.name);
  let headings = Object.keys(headingsList);

  let thead = table.tHead;
  let tbody = table.tBodies[0];

  thead.innerHTML = "";
  tbody.innerHTML = "";

  let row = thead.insertRow();

  for (let i = 1; i < headings.length; i++) {
    let th = document.createElement("th");
    thText = document.createTextNode(headings[i]);
    th.appendChild(thText);
    row.appendChild(th);
  }

  let th = document.createElement("th");
  row.appendChild(th);

  if (list.content.length === 0) {
    document
      .querySelector(`#${list.name} .no-data-text`)
      .classList.remove("hidden");
    table.classList.add("hidden");
    return;
  }

  list.content.map((elem) => {
    let row = tbody.insertRow(-1);
    let values = Object.values(elem);
    let id = elem.id;

    let cell;

    for (let i = 0; i < values.length - 1; i++) {
      cell = row.insertCell(-1);
      cellText = document.createTextNode(values[i + 1]);
      cell.appendChild(cellText);
    }

    cell = row.insertCell(-1);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.addEventListener("click", (e) => {
      deleteRow(e.currentTarget);
      deleteListEntry(list, id);
    });

    cell.appendChild(deleteBtn);

    const updateBtn = document.createElement("button");
    updateBtn.classList.add("update-btn");
    updateBtn.innerHTML = '<i class="fa-solid fa-pencil"></i>';
    updateBtn.addEventListener("click", (e) => {
      destroyForm();
      createForm(
        // Get form with same name as current page name
        forms.find((el) => el.form_name === currentPage.name),
        createItem_form,
        true,
        elem,
        e.currentTarget
      );
      previousPage = currentPage;
      showPage(4);
      let focusedInput = document.querySelectorAll("input")[2];
      focusedInput.focus();
    });

    cell.appendChild(updateBtn);
  });
};

const addRow = (inputGroup) => {
  let newItem = {};
  // Retrieve form template
  let form = forms.find((el) => el.form_name === previousPage.name);
  // Retrieve item list
  let list = lists.find((el) => el.name === previousPage.name);
  // Get keys from the retrieved form
  let keys = Object.keys(form);
  // let tbody = previousPage.table.tBodies[0];

  let id = Math.floor(Math.random() * 1000000);
  newItem = { id };

  // Dynamically build a list entry with values from list
  keys.map((el, idx) => {
    if (idx === 0) return;

    newItem = { ...newItem, [el]: inputGroup[idx - 1].value };
  });

  previousPage.table.classList.remove("hidden");
  document
    .querySelector(`#${previousPage.name} .no-data-text`)
    .classList.add("hidden");
  list.content.push(newItem);
  updateLocalStorage();
};

const createForm = (formInputList, parent, isUpdate, entry = null, target) => {
  let inputs = Object.values(formInputList);
  let keys = Object.keys(formInputList);
  let values = entry ? Object.values(entry) : null;
  let inputGroup = [];

  inputs.map((el, idx) => {
    if (el.type === undefined) return;

    let form_control = document.createElement("div");

    form_control.classList.add("form-control");
    parent.appendChild(form_control);

    createLabel(form_control, el, keys[idx]);

    if (values !== null) {
      createInput(form_control, el, keys[idx], inputGroup, values[idx]);
    } else {
      createInput(form_control, el, keys[idx], inputGroup);
    }
  });

  let form_control = document.createElement("div");
  form_control.classList.add("form-control");
  parent.appendChild(form_control);

  let text = "";
  let submit_btn = document.createElement("button");
  submit_btn.classList.add("submit-btn");
  submit_btn.addEventListener("click", (e) => {
    e.preventDefault();
    handleSubmit(inputGroup, isUpdate, entry, target);
  });
  text = document.createTextNode("Submit");
  submit_btn.appendChild(text);

  let cancel_btn = document.createElement("button");
  cancel_btn.classList.add("cancel-btn");
  cancel_btn.addEventListener("click", (e) => {
    e.preventDefault();
    handleCancel();
  });
  text = document.createTextNode("Cancel");
  cancel_btn.appendChild(text);

  form_control.appendChild(submit_btn);
  form_control.appendChild(cancel_btn);
};

const createLabel = (parent, el, key) => {
  let label = document.createElement("label");
  label.setAttribute("for", key);
  label.appendChild(document.createTextNode(el.label));
  parent.appendChild(label);
};

const createInput = (parent, el, key, inputGroup, entryValue = null) => {
  let input = document.createElement(el.type);

  if (el.subtype !== "none") {
    input.setAttribute("type", el.subtype);
    input.setAttribute("Placeholder", key);
  }

  input.setAttribute("id", key);
  input.value = entryValue ?? "";

  inputGroup.push(input);
  parent.appendChild(input);

  if (el.type === "select") {
    createOptions(input);
  }
};

const createOptions = (parent) => {
  let categories = lists.find((el) => el.name === "categories").content;

  categories.map((el) => {
    let optionName = el.name.charAt(0).toLocaleUpperCase() + el.name.slice(1);
    let option = document.createElement("option");
    let textNode = document.createTextNode(optionName);
    option.appendChild(textNode);
    option.setAttribute("value", optionName);
    parent.appendChild(option);
  });
};

const destroyForm = () => {
  createItem_form.innerHTML = "";
};

const showPage = (id) => {
  if (isLoggedIn) {
    pages.map((page) => {
      if (page.id === id) {
        currentPage = page;

        if (page.table == cart_table) {
          rebuildCart();
        } else if (page.table) {
          createTable(page.table);
        }

        page_title.innerHTML = currentPage.name;
        page.element.classList.remove("hidden");
      } else {
        page.element.classList.add("hidden");
      }
    });
  } else {
    pages.map((page) => {
      if (page.id === 1) {
        currentPage = page;
        page_title.innerHTML = currentPage.name;
        page.element.classList.remove("hidden");
      } else {
        page.element.classList.add("hidden");
      }
    });
  }
};

const loginError = (msgObj) => {
  login_error_message.innerHTML = msgObj.content;
  login_error_message.classList.remove("hidden");
};

const validateForm = (inputGroup) => {
  return inputGroup.every((el) => {
    return el.value.trim().length > 0;
  });
};

const authentify = () => {
  let list = lists.find((el) => el.name === "employees");

  let employee = list.content.find((el) => {
    return el.email == login_input_group[0].value.trim();
  });

  if (employee && employee.password === login_input_group[1].value.trim()) {
    loggedUser = employee;
    document.querySelector(".username-container").classList.remove("hidden");
    document.querySelector(
      ".username-container p"
    ).innerHTML = `${loggedUser["first name"]} ${loggedUser["last name"]}`;
    return true;
  }
  return false;
};

const handleSubmit = (inputGroup, isUpdate, entry, target) => {
  if (validateForm(inputGroup)) {
    if (isUpdate) {
      updateRow(inputGroup, entry, target);
    } else {
      addRow(inputGroup);
    }

    showPage(previousPage.id);
  }
};

const handleCancel = () => {
  showPage(previousPage.id);
};

const updateRow = (inputGroup, entry) => {
  let updatedItem = {};
  // Retrieve form template
  let form = forms.find((el) => el.form_name === previousPage.name);
  // Retrieve item list
  let list = lists.find((el) => el.name === previousPage.name);
  // Get keys from the retrieved form
  let keys = Object.keys(form);
  let tbody = previousPage.table.tBodies[0];

  updatedItem = { id: entry.id };

  // Dynamically build a table row with values from list
  keys.map((el, idx) => {
    if (idx === 0) return;

    updatedItem = { ...updatedItem, [el]: inputGroup[idx - 1].value };
  });

  previousPage.table.classList.remove("hidden");
  let index = list.content.indexOf(entry);

  list.content[index] = updatedItem;
  updateLocalStorage();
};

const deleteRow = (target) => {
  // Get table traversing : button => td => tr => tbody => table
  let table = target.parentNode.parentNode.parentNode.parentNode;
  let nodataText = table.previousElementSibling;
  let rowIndex = target.parentNode.parentNode.rowIndex;

  table.deleteRow(rowIndex);

  if (table.rows.length === 1) {
    table.classList.add("hidden");
    nodataText.classList.remove("hidden");
  }
};

const deleteListEntry = (list, id) => {
  // Delete current entry from list
  list.content = list.content.filter((el) => el.id !== id);
  updateLocalStorage();
};

const buildStore = () => {
  list = lists.find((el) => el.name === "products");

  store_card_container.innerHTML = "";

  list.content.map((el) => {
    card = document.createElement("div");
    card.classList.add("card");
    card.innerHTML = `
      <p>${el.sku}</p>
      <i class="fa-solid fa-computer"></i>
      <p>${el.name}</p>
      <p>${el.price}</p>`;
    card.addEventListener("click", (e) => {
      addToCart(el.id);
    });
    store_card_container.appendChild(card);
  });
};

const addToCart = (id) => {
  let list = lists.find((el) => el.name === "products");
  let item = list.content.find((el) => el.id === id);

  let existingItem = cartContent.find((el) => el.id === item.id);

  if (existingItem) {
    existingItem.count++;
  } else {
    cartContent.push({
      id: item.id,
      name: item.name,
      sku: item.sku,
      price: item.price,
      count: 1,
    });
  }

  updateCartBadge();
};

const updateCartBadge = () => {
  let item_count = 0;

  cartContent.map((el) => {
    item_count += +el.count;
  });

  if (cartContent.length === 0) {
    item_counter.classList.add("hidden");
  } else {
    item_counter.classList.remove("hidden");
    item_counter.innerHTML = item_count;
  }
};

const rebuildCart = () => {
  counterGroup = [];

  tbody = cart_table.tBodies[0];

  tbody.innerHTML = "";

  if (cartContent.length === 0) {
    document.querySelector("#cart .no-data-text").classList.remove("hidden");
    total_text_div.classList.add("hidden");
    purchase_btn.classList.add("hidden");
    cart_table.classList.add("hidden");
    update_cart_btn.classList.add("hidden");
    return;
  } else {
    document.querySelector("#cart .no-data-text").classList.add("hidden");
    total_text_div.classList.remove("hidden");
    purchase_btn.classList.remove("hidden");
    cart_table.classList.remove("hidden");
    update_cart_btn.classList.remove("hidden");
  }

  cartContent.map((el) => {
    let row = tbody.insertRow(-1);
    let values = Object.values(el);
    let keys = Object.keys(el);

    values.map((val, idx) => {
      if (idx === 0) return;

      let cell = row.insertCell(-1);
      cellText = document.createTextNode(val);

      if (keys[idx] === "count") {
        let counter = document.createElement("input");
        counter.type = "text";
        counter.className = "cart-counter";
        counter.setAttribute("value", val);
        counter.setAttribute("data-item-id", el.id);
        counterGroup.push(counter);
        cell.appendChild(counter);
      } else {
        cell.appendChild(cellText);
      }
    });

    cell = row.insertCell(-1);

    const deleteBtn = document.createElement("button");
    deleteBtn.classList.add("delete-btn");
    deleteBtn.innerHTML = '<i class="fa-solid fa-trash-can"></i>';
    deleteBtn.addEventListener("click", (e) => {
      deleteCartEntry(el.id);
      calculateTotal();
      updateCartBadge();
      deleteRow(e.currentTarget);

      counterGroup = counterGroup.filter(
        (counter) => parseInt(counter.getAttribute("data-item-id")) !== el.id
      );

      if (cartContent.length === 0) {
        total_text_div.classList.add("hidden");
        purchase_btn.classList.add("hidden");
        return;
      }
    });

    cell.appendChild(deleteBtn);

    calculateTotal();
  });
};

const calculateTotal = () => {
  let total = 0;

  cartContent.map((item) => {
    total += item.count * item.price;
  });

  total_text.innerHTML = parseFloat(total).toFixed(2);
};

const deleteCartEntry = (id) => {
  cartContent = cartContent.filter((el) => el.id !== id);
};

const updateLocalStorage = () => {
  window.localStorage.setItem("lists", JSON.stringify(lists));
};

const readLocalStorage = () => {
  let newObject = window.localStorage.getItem("lists");
  lists = newObject ? JSON.parse(newObject) : lists;
};

const updateStock = () => {
  let productList = lists.find((list) => list.name === "products");
  console.log(productList);

  cartContent.map((item) => {
    let product = productList.content.find((product) => item.id === product.id);

    product.stock -= item.count;
  });
};

const showGreeting = () => {
  let text = document.querySelector(".greetings");
  text.innerHTML = `<h3>Hello, ${
    loggedUser["first name"]
  }</h3><p>Your login time is -- ${loginTime.toLocaleString("en-CA")}</p>`;
};

//#endregion

const setup = () => {
  readLocalStorage();
  isLoggedIn = true;
  showPage(5);
};

setup();
