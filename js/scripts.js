const appData = {
  scriptUrl: "",
  orders: [
    {
      id: "d98er748",
      code: "251101HAN-L1",
      name: "1 bộ mẫu dương 2 huy hiệu - Lần 2",
      employeeId: "NV00008",
      date: "2023-11-26",
      subtotal: 4400000,
      taxPercent: 8,
      note: "",
    },
    {
      id: "88cty102",
      code: "241215-HCM",
      name: "Bộ quà tặng cuối năm",
      employeeId: "NV00003",
      date: "2024-12-18",
      subtotal: 12500000,
      taxPercent: 10,
      note: "Giao trong ngày",
    },
  ],
  products: [
    {
      id: "0417d63",
      orderId: "d98er748",
      name: "Hộp đựng 2 huy hiệu",
      quantity: 2,
      unitPrice: 1200000,
      taxPercent: 8,
      note: "",
    },
    {
      id: "98dchy79",
      orderId: "d98er748",
      name: "Tờ rơi",
      quantity: 1000,
      unitPrice: 1200,
      taxPercent: 8,
      note: "",
    },
    {
      id: "aa13421",
      orderId: "88cty102",
      name: "Hộp quà Tết",
      quantity: 35,
      unitPrice: 215000,
      taxPercent: 10,
      note: "",
    },
  ],
};

const currencyFormat = new Intl.NumberFormat("vi-VN", {
  style: "currency",
  currency: "VND",
});

function computeOrderTotal(order) {
  const tax = (order.subtotal || 0) * ((order.taxPercent || 0) / 100);
  return Math.round((order.subtotal || 0) + tax);
}

function computeProductSubtotal(product) {
  return Math.round((product.quantity || 0) * (product.unitPrice || 0));
}

function computeProductTotal(product) {
  const subtotal = computeProductSubtotal(product);
  const tax = subtotal * ((product.taxPercent || 0) / 100);
  return Math.round(subtotal + tax);
}

function updateSummaries() {
  const orderCount = appData.orders.length;
  const orderValue = appData.orders.reduce((sum, order) => sum + computeOrderTotal(order), 0);
  const inventoryValue = appData.products.reduce((sum, product) => sum + computeProductTotal(product), 0);

  document.getElementById("orderCount").textContent = orderCount;
  document.getElementById("orderValue").textContent = currencyFormat.format(orderValue);
  document.getElementById("inventoryValue").textContent = currencyFormat.format(inventoryValue);
}

function renderOrders(filterTerm = "") {
  const tbody = document.querySelector("#ordersTable tbody");
  tbody.innerHTML = "";
  const keyword = filterTerm.trim().toLowerCase();

  appData.orders
    .filter((order) => {
      if (!keyword) return true;
      return (
        order.id.toLowerCase().includes(keyword) ||
        order.code.toLowerCase().includes(keyword) ||
        order.name.toLowerCase().includes(keyword) ||
        (order.employeeId || "").toLowerCase().includes(keyword)
      );
    })
    .forEach((order) => {
      const tr = document.createElement("tr");
      const total = computeOrderTotal(order);
      tr.innerHTML = `
        <td>${order.id}</td>
        <td>${order.code}</td>
        <td>${order.name}</td>
        <td>${order.employeeId || ""}</td>
        <td>${order.date || ""}</td>
        <td class="text-right">${currencyFormat.format(order.subtotal || 0)}</td>
        <td class="text-right">${order.taxPercent || 0}%</td>
        <td class="text-right">${currencyFormat.format(total)}</td>
        <td>${order.note || ""}</td>
      `;
      tbody.appendChild(tr);
    });
}

function renderProducts(filterTerm = "") {
  const tbody = document.querySelector("#productsTable tbody");
  tbody.innerHTML = "";
  const keyword = filterTerm.trim().toLowerCase();

  appData.products
    .filter((product) => {
      if (!keyword) return true;
      return (
        product.id.toLowerCase().includes(keyword) ||
        product.orderId.toLowerCase().includes(keyword) ||
        product.name.toLowerCase().includes(keyword)
      );
    })
    .forEach((product) => {
      const subtotal = computeProductSubtotal(product);
      const total = computeProductTotal(product);
      const tr = document.createElement("tr");
      tr.innerHTML = `
        <td>${product.id}</td>
        <td>${product.orderId}</td>
        <td>${product.name}</td>
        <td class="text-right">${product.quantity || 0}</td>
        <td class="text-right">${currencyFormat.format(product.unitPrice || 0)}</td>
        <td class="text-right">${currencyFormat.format(subtotal)}</td>
        <td class="text-right">${product.taxPercent || 0}%</td>
        <td class="text-right">${currencyFormat.format(total)}</td>
        <td>${product.note || ""}</td>
      `;
      tbody.appendChild(tr);
    });
}

function toggleForm(formId, shouldShow) {
  const form = document.getElementById(formId);
  if (shouldShow) {
    form.classList.remove("hidden");
  } else {
    form.classList.add("hidden");
  }
}

function clearOrderForm() {
  document.getElementById("orderId").value = "";
  document.getElementById("orderCode").value = "";
  document.getElementById("orderName").value = "";
  document.getElementById("employeeId").value = "";
  document.getElementById("orderDate").value = new Date().toISOString().split("T")[0];
  document.getElementById("orderSubtotal").value = "";
  document.getElementById("orderTax").value = "8";
  document.getElementById("orderNote").value = "";
}

function clearProductForm() {
  document.getElementById("itemId").value = "";
  document.getElementById("itemOrderId").value = "";
  document.getElementById("itemName").value = "";
  document.getElementById("itemQuantity").value = "";
  document.getElementById("itemPrice").value = "";
  document.getElementById("itemTax").value = "8";
  document.getElementById("itemNote").value = "";
}

function initForms() {
  document.getElementById("openOrderForm").addEventListener("click", () => {
    toggleForm("orderForm", true);
    document.getElementById("orderId").focus();
  });
  document.getElementById("cancelOrder").addEventListener("click", () => {
    toggleForm("orderForm", false);
    clearOrderForm();
  });
  document.getElementById("saveOrder").addEventListener("click", () => {
    const newOrder = {
      id: document.getElementById("orderId").value.trim(),
      code: document.getElementById("orderCode").value.trim(),
      name: document.getElementById("orderName").value.trim(),
      employeeId: document.getElementById("employeeId").value.trim(),
      date: document.getElementById("orderDate").value,
      subtotal: Number(document.getElementById("orderSubtotal").value) || 0,
      taxPercent: Number(document.getElementById("orderTax").value) || 0,
      note: document.getElementById("orderNote").value.trim(),
    };

    if (!newOrder.id || !newOrder.code || !newOrder.name) {
      alert("Vui lòng nhập đủ ID, mã đơn hàng và tên đơn hàng.");
      return;
    }

    appData.orders.unshift(newOrder);
    renderOrders(document.getElementById("orderSearch").value);
    updateSummaries();
    toggleForm("orderForm", false);
    clearOrderForm();
  });

  document.getElementById("openProductForm").addEventListener("click", () => {
    toggleForm("productForm", true);
    document.getElementById("itemId").focus();
  });
  document.getElementById("cancelProduct").addEventListener("click", () => {
    toggleForm("productForm", false);
    clearProductForm();
  });
  document.getElementById("saveProduct").addEventListener("click", () => {
    const newProduct = {
      id: document.getElementById("itemId").value.trim(),
      orderId: document.getElementById("itemOrderId").value.trim(),
      name: document.getElementById("itemName").value.trim(),
      quantity: Number(document.getElementById("itemQuantity").value) || 0,
      unitPrice: Number(document.getElementById("itemPrice").value) || 0,
      taxPercent: Number(document.getElementById("itemTax").value) || 0,
      note: document.getElementById("itemNote").value.trim(),
    };

    if (!newProduct.id || !newProduct.name) {
      alert("Vui lòng nhập ID hàng hóa và tên hàng hóa.");
      return;
    }

    appData.products.unshift(newProduct);
    renderProducts(document.getElementById("productSearch").value);
    updateSummaries();
    toggleForm("productForm", false);
    clearProductForm();
  });
}

function initSearch() {
  document.getElementById("orderSearch").addEventListener("input", (event) => {
    renderOrders(event.target.value);
  });

  document.getElementById("productSearch").addEventListener("input", (event) => {
    renderProducts(event.target.value);
  });
}

function initScriptUrl() {
  const input = document.getElementById("scriptUrl");
  input.addEventListener("input", (event) => {
    appData.scriptUrl = event.target.value.trim();
  });
}

function bootstrap() {
  clearOrderForm();
  clearProductForm();
  initForms();
  initSearch();
  initScriptUrl();
  renderOrders();
  renderProducts();
  updateSummaries();
}

document.addEventListener("DOMContentLoaded", bootstrap);
