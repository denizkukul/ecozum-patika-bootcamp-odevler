// Transaction-Panel
class TransactionPanel extends Component {
  template() {
    return (`
    ${new ManageTransaction({ users: this.users, cart: this.cart, currentUser: this.currentUser, products: this.products, history: this.history, subscriptions: [this.users, this.currentUser], parentComponent: this }).target()}
    ${new CartList({ currentUser: this.currentUser, cart: this.cart, products: this.products, subscriptions: [this.cart], parentComponent: this }).target()}
    `)
  }
}

// Component selects user cart and sells items inside
class ManageTransaction extends Component {
  confirmTransaction(e) {
    e.preventDefault();
    let cart = this.cart.value.slice();
    let products = this.products.value.slice();
    let targetIDs = []
    let hasEnoughFunds = true;
    let totalCost = 0;

    // If cart is empty log error
    if (this.cart.value.length === 0) {
      this.history.setValue([...this.history.value, { id: this.generateID(), type: "error", time: this.getTime(), message: "Cart is empty!" }])
      return;
    }

    // Save product ids for iteration in next line
    cart.forEach(item => targetIDs.push(item.product.id));

    // Iterate and modify products until all items in cart are found
    products.some((product, index) => {
      let indexInCart = targetIDs.indexOf(product.id);
      if (indexInCart > -1) {
        products[index] = { ...products[index], stock: (products[index].stock - cart[indexInCart].amount) };
        totalCost += Number(cart[indexInCart].amount) * Number(cart[indexInCart].product.price);
        if (totalCost > this.currentUser.value.balance) { // User has insufficent funts, Transaction can not proceed, stop iterating
          hasEnoughFunds = false;
          return true;
        }
        targetIDs[indexInCart] = null;
      }
      if (targetIDs.some(id => id !== null)) {
        return false;
      }
      return true;
    })

    if (!hasEnoughFunds) {  // Log error and return
      this.history.setValue([...this.history.value, { id: this.generateID(), type: "error", time: this.getTime(), message: "Can not complete transaction, Insufficent funds!" }])
      return;
    }

    let users = this.users.value.slice();
    let userIndex, userData;
    users.find((user, index) => {
      if (user.id === this.currentUser.value.id) {
        userIndex = index;
        userData = user;
        return true;
      }
      return false;
    })
    users.splice(userIndex, 1, { ...userData, balance: (userData.balance - totalCost) })

    // Set values to new state
    this.users.setValue(users);
    this.products.setValue(products);
    this.cart.setValue([]);
    this.currentUser.setValue(null)
    this.history.setValue([...this.history.value, { id: this.generateID(), type: "transaction", time: this.getTime(), cart, totalCost, buyerName: userData.name, buyerID: userData.id, reverted: false }])
  }
  setCurrentUser(e) {
    let userIndex = this.users.value.findIndex(user => user.id === Number(e.target.value));
    this.currentUser.setValue(this.users.value[userIndex]);
  }
  createOptions() {
    // If there is a current user selected, keep it selected when users state changes and renders this component
    if (this.currentUser.value && this.users.value.findIndex(user => user.id === this.currentUser.value.id) > -1) {
      return (
        `<option value="${this.currentUser.value.id}" selected>${this.currentUser.value.name}</option>
      ${this.users.value.map(user => {
          if (this.currentUser.value.id === user.id) return "";
          else return `<option value="${user.id}">${user.name}</option>`;
        }).join("")}
      `)
    }
    else {
      return (`
        <option value="" disabled selected>Select User</option>
        ${this.users.value.map(user => `<option value="${user.id}">${user.name}</option>`).join("")}
        `)
    }
  }

  template() {
    return (`
      <div class="title"> Manage Transaction </div>
        <form class="confirmtransaction-form">
          <select class="selectuser-input" required>
            ${this.createOptions()}
          </select>
          <button class="confirmtransaction-button ${this.currentUser.value && this.cart.value.length > 0 ? "active" : ""}"> Confirm Transaction </button>
        </div>
      </form>
    `)
  }
  addListeners() {
    this.targetElement.querySelector(".confirmtransaction-form").addEventListener("submit", this.confirmTransaction);
    this.targetElement.querySelector(".selectuser-input").addEventListener("change", this.setCurrentUser);
  }
}

// Component lists products in current users cart
class CartList extends Component {
  template() {
    return (`
      <div class="title"><p class="productname">Product</p><p class="price">Price</p><p class="stock">Amount</p><p class="total">Total</p><p>Remove</p></div>
      <ul class="productlist">
        ${this.cart.value.map(cartItem => `<li>${new CartListItem({ cartItem, cart: this.cart, parentComponent: this }).target()}</li>`).join("")}
      </ul>
    `)
  }
}

// Component CartList-item
class CartListItem extends Component {
  removeItem() {
    let cartState = this.cart.value.slice();
    let itemIndex = cartState.findIndex(item => item.product.id === this.cartItem.product.id);
    cartState.splice(itemIndex, 1);
    this.cart.setValue(cartState);
  }
  template() {
    return (`
      <p class="productname" > ${this.cartItem.product.name}</p>
      <p class="price">${this.cartItem.product.price.toLocaleString()} ₺</p>
      <p class="amount">${this.cartItem.amount.toLocaleString()}</p>
      <p class="totalcost">${(this.cartItem.amount * this.cartItem.product.price).toLocaleString()}₺</p>
      <div class="button-container">
      <button class="removeitem-button"><svg xmlns="http://www.w3.org/2000/svg" height="26px" viewBox="0 0 24 24" width="26px"><path d="M0 0h24v24H0V0z" fill="none"/><path d="M14.59 8L12 10.59 9.41 8 8 9.41 10.59 12 8 14.59 9.41 16 12 13.41 14.59 16 16 14.59 13.41 12 16 9.41 14.59 8zM12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/></svg></button></div>
    `)
  }
  addListeners() {
    this.targetElement.querySelector(".removeitem-button").addEventListener("click", this.removeItem)
  }
}