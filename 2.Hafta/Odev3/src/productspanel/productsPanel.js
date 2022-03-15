// Products-Panel
class ProductsPanel extends Component {
  template() {
    return (`
    ${new NewProduct({ products: this.products, parentComponent: this }).target()}
    ${new ProductList({ cart: this.cart, products: this.products, currentUser: this.currentUser, subscriptions: [this.products, this.currentUser], parentComponent: this }).target()}
    `)
  }
}
// Component adds new product
class NewProduct extends Component {
  addProduct(e) {
    e.preventDefault();
    const productNameInput = this.targetElement.querySelector(".productname-input");
    const priceInput = this.targetElement.querySelector(".price-input");
    const stockInput = this.targetElement.querySelector(".stock-input");

    // Add product
    this.products.setValue([...this.products.value, { name: productNameInput.value, price: Number(priceInput.value), stock: Number(stockInput.value), id: this.generateID() }])

    // Clear input fields
    productNameInput.value = "";
    priceInput.value = "";
    stockInput.value = "";
  }
  template() {
    return (`
      <div class="title"> Add new product </div>
      <form class="addproduct-form">
        <div class="column">
          <input class="productname-input" placeholder="Name" required pattern="([a-zA-Z0-9]+[a-zA-Z0-9 ]+)" maxlength="20"/>
          <input class="price-input" type="number" placeholder="Price" required min="0" max="999999999"/>
        </div >
        <div class="column">
          <input class="stock-input" type="number" placeholder="Stock" required min="0" max="999999999"/>
          <button class="addproduct-button"> Add </button>
        </div>
      </form>
    `)
  }
  addListeners() {
    this.targetElement.querySelector(".addproduct-form").addEventListener("submit", this.addProduct);
  }
}

// Component lists products
class ProductList extends Component {
  template() {
    return (`
      <div class="title"><p class="productname">Product</p><p class="price">Price</p><p class="stock">Stock</p><p class="add">Add</p></div>
      <ul class="productlist">
      ${this.products.value.map(product => `<li>${new ProductListItem({ product, cart: this.cart, currentUser: this.currentUser, subscriptions: [this.cart], parentComponent: this }).target()}</li>`).join("")}
      </ul>
    `)
  }
}

// Component ProductList-item
class ProductListItem extends Component {
  // Check inCart amount, prevent adding to cart more than stock
  stockLeft() {
    let inCart = this.cart.value.find(item => item.product.id === this.product.id);
    let inCartAmount = inCart ? inCart.amount : 0;
    return (this.product.stock - inCartAmount) > 0;
  }
  addToCart() {
    let cartState = this.cart.value.slice();

    // If item exists in cart add to its amount
    let itemInCart, indexInCart;
    cartState.find((item, index) => {
      if (item.product.id === this.product.id) {
        itemInCart = item;
        indexInCart = index;
        return true;
      }
      return false;
    })
    if (indexInCart > -1) {
      let newItem = { ...itemInCart, amount: (itemInCart.amount + 1) }
      cartState.splice(indexInCart, 1, newItem);
      this.cart.setValue(cartState);
      return
    }
    this.cart.setValue([...this.cart.value, { product: this.product, amount: 1 }]);
  }
  template() {
    return (`
      <p class="productname">${this.product.name}</p>
      <p class="price">${this.product.price.toLocaleString()} ₺</p>
      <p class="stock">${this.product.stock.toLocaleString()}</p>
      <div class="button-container">
      <button class="addtocart-button ${this.stockLeft() ? "active" : ""}"><svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 0 24 24" width="26px" ><path d="M0 0h24v24H0V0z" fill="none"/><path d="M11 9h2V6h3V4h-3V1h-2v3H8v2h3v3zm-4 9c-1.1 0-1.99.9-1.99 2S5.9 22 7 22s2-.9 2-2-.9-2-2-2zm10 0c-1.1 0-1.99.9-1.99 2s.89 2 1.99 2 2-.9 2-2-.9-2-2-2zm-8.9-5h7.45c.75 0 1.41-.41 1.75-1.03l3.86-7.01L19.42 4l-3.87 7H8.53L4.27 2H1v2h2l3.6 7.59-1.35 2.44C4.52 15.37 5.48 17 7 17h12v-2H7l1.1-2z"/></svg></button></div>
    `)
  }
  addListeners() {
    if (this.stockLeft()) {
      this.targetElement.querySelector(".addtocart-button").addEventListener("click", this.addToCart);
    }
  }
}