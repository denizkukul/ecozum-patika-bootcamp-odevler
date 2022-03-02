// Transfers-Panel
class TransfersPanel extends Component {
  template() {
    return (`
      ${new NewTransfer({ users: this.users, history: this.history, subscriptions: [this.users], parentComponent: this }).target()}
      ${new HistoryLogs({ users: this.users, history: this.history, products: this.products, parentComponent: this }).target()}
    `)
  }
}

// Component manages transfers
class NewTransfer extends Component {
  transfer(e) {
    e.preventDefault();
    // Get input nodes
    let senderID = Number(this.targetElement.querySelector(".sendfrom-input").value);
    let receiverID = Number(this.targetElement.querySelector(".sendto-input").value);
    let amount = Number(this.targetElement.querySelector(".amount-input").value);
    let receiverName;
    let senderName;

    // If sender and receiver are same log error and return
    if (senderID === receiverID) {
      this.history.setValue([...this.history.value, { id: this.generateID(), type: "error", time: this.getTime(), message: "Sender and reciever can not be same user." }])
      return;
    }

    // Find sender and receiver, check if sender has enough funds
    let hasEnoughFunds = false;
    let senderIndex, receiverIndex;
    let targetIDs = [senderID, receiverID];
    this.users.value.find((user, index) => {
      let indexInTargetIDs = targetIDs.indexOf(user.id);
      if (indexInTargetIDs === 0) { // Sender user is found in this case
        if (user.balance < amount) { // Transfer can not proceed, stop iterating and log error
          return true;
        }
        senderIndex = index;
        senderName = user.name;
        hasEnoughFunds = true;
        targetIDs[0] = null;
        return false
      }
      if (indexInTargetIDs === 1) { // Receiver user is found in this case
        receiverIndex = index;
        receiverName = user.name;
        targetIDs[1] = null;
        return false
      }
      if (targetIDs.some(id => id !== null)) {
        return false;
      }
      // If both users are found stop iterating
      return true;
    })

    // If sender does not have enought funds log error
    if (!hasEnoughFunds) {
      this.history.setValue([...this.history.value, { id: this.generateID(), type: "error", time: this.getTime(), message: "Can not complete transfer, Insufficent funds!" }])
      return;
    }

    // Transfer money
    let usersState = this.users.value.slice();
    usersState.splice(senderIndex, 1, { ...usersState[senderIndex], balance: (this.users.value[senderIndex].balance - amount) });
    usersState.splice(receiverIndex, 1, { ...usersState[receiverIndex], balance: (this.users.value[receiverIndex].balance + amount) });
    this.users.setValue(usersState);

    // Create new transfer log
    this.history.setValue([...this.history.value, { id: this.generateID(), type: "transfer", time: this.getTime(), amount, senderName, senderID, receiverName, receiverID, reverted: false }])
  }

  template() {
    return (`
      <div class="title"> Transfer funds </div>
      <form class="newtransfer-form">
        <div class="column">
          <select class="sendfrom-input" required>
            <option value="" disabled selected>From</option>
            ${this.users.value.map(user => `<option value="${user.id}">${user.name}</option>`).join("")}
          </select>
          <select class="sendto-input" required>
            <option value="" disabled selected>To</option>
            ${this.users.value.map(user => `<option value="${user.id}">${user.name}</option>`).join("")}
          </select>
        </div>
        <div class="column">
          <input class="amount-input" type="number" placeholder="Amount" required min="0" max="999999999" />
          <button class="send-button"> Send </button>
        </div>
      </form>
      `)
  }

  addListeners() {
    this.targetElement.querySelector(".newtransfer-form").addEventListener("submit", this.transfer);
  }
}

// Component lists logs of transfers
class HistoryLogs extends Component {
  constructor(args) {
    const filterType = new State("");
    const filterName = new State("");
    super({ ...args, filterType, filterName });
  }
  template() {
    return (`
      ${new HistoryLogsHead({ filterType: this.filterType, filterName: this.filterName, parentComponent: this }).target()}
      ${new HistoryLogsList({ history: this.history, filterType: this.filterType, filterName: this.filterName, users: this.users, products: this.products, subscriptions: [this.history, this.filterType, this.filterName], parentComponent: this }).target()}
      `)
  }
}

class HistoryLogsHead extends Component {
  setFilterType(e) {
    this.filterType.setValue(e.target.value);
  }
  setFilterName(e) {
    this.filterName.setValue(e.target.value);
  }
  clearFilters() {
    this.filterType.setValue("");
    this.filterName.setValue("");
    this.targetElement.querySelector(".filtertype-input").value = "";
    this.targetElement.querySelector(".filtername-input").value = "";
  }
  template() {
    return (`
    <div class= "title" > History </div>
    <div class="filters">
      <select class="filtertype-input">
        <option value="" selected disabled hidden>Filter By</option>
        <option value="sender">Sender</option>
        <option value="receiver">Receiver</option>
        <option value="buyer">Buyer</option>
        <option value="any">Any</option>
      </select>
      <input class="filtername-input" placeholder="Name" pattern="([a-zA-Z]+[a-zA-Z ]+)" maxlength="20" />
      <button class="clearfilters-button">Clear Filters</button>
    </div>
    `)
  }
  addListeners() {
    this.targetElement.querySelector(".filtertype-input").addEventListener("change", this.setFilterType);
    this.targetElement.querySelector(".filtername-input").addEventListener("input", this.setFilterName);
    this.targetElement.querySelector(".clearfilters-button").addEventListener("click", this.clearFilters);
  }
}

class HistoryLogsList extends Component {
  filterLogs() {
    let filterType = this.filterType.value;
    let filterName = this.filterName.value.toLowerCase();

    if (filterType === "" || filterName === "") return this.history.value;

    let logTypes;
    let filterFunction;
    switch (filterType) {
      case "sender":
        logTypes = ["transfer", "undotransfer"];
        filterFunction = (log) => { return (log.senderName.toLowerCase().includes(filterName)) }
        break;
      case "receiver":
        logTypes = ["transfer", "undotransfer"];
        filterFunction = (log) => { return (log.receiverName.toLowerCase().includes(filterName)) }
        break;
      case "buyer":
        logTypes = ["transaction", "undotransaction"];
        filterFunction = (log) => { return (log.buyerName.toLowerCase().includes(filterName)) }
        break;
      case "any":
        logTypes = null;
        filterFunction = (log) => {
          return (
            (log.senderName && log.senderName.toLowerCase().includes(filterName)) ||
            (log.receiverName && log.receiverName.toLowerCase().includes(filterName)) ||
            (log.buyerName && log.buyerName.toLowerCase().includes(filterName)))
        }
      default: logTypes = null;
    }

    return this.history.value.filter(log => (!logTypes || logTypes.some(type => type === log.type)) && (filterFunction(log)));
  }
  template() {
    return (`
      <ul class= "logs">
      ${this.filterLogs().map((log) => `<li>${new Log({ history: this.history, users: this.users, log, products: this.products, parentComponent: this }).target()}</li>`).join("")}
      </ul>
      `)
  }
  afterRender() {
    // Scroll to bottom of the list
    let height = this.targetElement.scrollHeight;
    this.targetElement.scrollTop = height;
  }
}

class Log extends Component {
  undoTransfer() {
    if (this.log.reverted) return;
    let { senderID, receiverID, amount, receiverName, senderName } = this.log

    // Revert transfer
    let targetIDs = [senderID, receiverID];
    let senderIndex, receiverIndex;
    let usersState = this.users.value.slice();
    let usersExist = false;
    usersState.find((user, index) => {
      let indexInTargetIDs = targetIDs.indexOf(user.id);
      if (indexInTargetIDs === 0) { // Sender user is found in this case
        senderIndex = index;
        targetIDs[0] = null;
      }
      if (indexInTargetIDs === 1) { // Receiver user is found in this case
        receiverIndex = index;
        targetIDs[1] = null;
      }
      if (targetIDs.some(id => id !== null)) {
        return false;
      }
      // If both users are found stop iterating
      usersExist = true;
      return true;
    })

    let logOfRevert;
    // If both users can not be found log error
    if (!usersExist) {
      logOfRevert = { id: this.generateID(), type: "error", time: this.getTime(), message: "Can not revert transfer, user does not exists!" };
    }

    // If both users are found revert transfer
    if (usersExist) {
      usersState.splice(senderIndex, 1, { ...usersState[senderIndex], balance: (usersState[senderIndex].balance + amount) });
      usersState.splice(receiverIndex, 1, { ...usersState[receiverIndex], balance: (usersState[receiverIndex].balance - amount) });
      logOfRevert = { id: this.generateID(), type: "undotransfer", time: this.getTime(), senderID, receiverID, amount, receiverName, senderName };
    }

    // Update this transfers reverted property and add new log to history
    let historyState = this.history.value.slice();
    let logIndex = historyState.findIndex(log => log.id === this.log.id);
    historyState.splice(logIndex, 1, { ...this.log, reverted: true });
    this.users.setValue(usersState);
    this.history.setValue([...historyState, logOfRevert]);
  }

  undoTransaction() {
    if (this.log.reverted) return;
    let { cart, buyerID } = this.log;
    let users = this.users.value.slice();
    let products = this.products.value.slice();
    let totalCost = 0;
    let buyerState, buyerIndex;

    let userExists = false;
    this.users.value.find((user, index) => {
      if (user.id === buyerID) {
        buyerState = user;
        buyerIndex = index;
        userExists = true;
        return true;
      }
      return false;
    })

    let logOfRevert;
    if (!userExists) { // Log error and return
      logOfRevert = { id: this.generateID(), type: "error", time: this.getTime(), message: "Can not revert transaction, user does not exists!" };
    }
    if (userExists) {
      // Save product ids for iteration in next line
      let targetIDs = [];
      cart.forEach(item => targetIDs.push(item.product.id));
      // Iterate and modify products until all items in cart are found
      products.some((product, index) => {
        let indexInCart = targetIDs.indexOf(product.id);
        if (indexInCart > -1) {
          products[index] = { ...products[index], stock: (products[index].stock + cart[indexInCart].amount) };
          totalCost += Number(cart[indexInCart].amount) * Number(cart[indexInCart].product.price);
          targetIDs[indexInCart] = null;
        }
        if (targetIDs.some(id => id !== null)) {
          return false;
        }
        return true;
      })
      users.splice(buyerIndex, 1, { ...buyerState, balance: (buyerState.balance + totalCost) });
      // Log of this revert action
      logOfRevert = { id: this.generateID(), type: "undotransaction", time: this.getTime(), buyerID, totalCost, buyerName: buyerState.name, revertedID: this.log.id };
    }

    // Set values to new state, update this transfers reverted property and add new log to history
    let historyState = this.history.value.slice();
    let logIndex = historyState.findIndex(log => log.id === this.log.id); // Log of transaction to be reverted
    historyState.splice(logIndex, 1, { ...this.log, reverted: true });
    this.history.setValue([...historyState, logOfRevert]);
    this.users.setValue(users);
    this.products.setValue(products);
  }
  template() {
    return (`
      <p class= "time" > ${this.log.time}</p>
      ${this.log.type === "transfer" ?
        `<p class="message"><span class="val">${this.log.amount.toLocaleString()}₺</span> has been transfered from <span class="val">${this.log.senderName} (id:${this.log.senderID})</span> to <span class="val">${this.log.receiverName} (id:${this.log.receiverID})</span></p>
        <button class="undo-button ${!this.log.reverted ? "active" : ""}">${undoIcon}</button>` : ""
      }
      ${this.log.type === "adduser" ?
        `<p class="message">New user <span class="val">${this.log.username} (id:${this.log.id}) </span> has been added with <span class="val">${this.log.balance.toLocaleString()} ₺ </span>balance.</p>` : ""
      }
      ${this.log.type === "removeuser" ?
        `<p class="message">User <span class="val">${this.log.username} (id:${this.log.id}) </span> has been removed.</p>` : ""
      }
      ${this.log.type === "error" ?
        `<p class="message">${this.log.message}</p>` : ""
      }
      ${this.log.type === "undotransfer" ?
        `<p class="message">Transfer of <span class="val">${this.log.amount.toLocaleString()}₺</span> from <span class="val">${this.log.senderName} (id:${this.log.senderID})</span> to <span class="val">${this.log.receiverName} (id:${this.log.receiverID})</span> has been reverted.</p>` : ""
      }
      ${this.log.type === "transaction" ?
        `<p class="message">User <span class="val">${this.log.buyerName} (id:${this.log.buyerID})</span> has made a <span class="val">${this.log.totalCost.toLocaleString()}₺</span> transaction.</p>
        <button class="undo-button ${!this.log.reverted ? "active" : ""}">${undoIcon}</button>` : ""
      }
      ${this.log.type === "undotransaction" ?
        `<p class="message"><span class="val">Transaction (id:${this.log.revertedID})</span><span class="val"> by ${this.log.buyerName} (id:${this.log.buyerID})</span>'s has been reverted and <span class="val">${this.log.totalCost.toLocaleString()}₺</span> is refunded.</p>` : ""
      }
      `)
  }
  addListeners() {
    if (this.log.type === "transfer" && !this.log.reverted) this.targetElement.querySelector(".undo-button").addEventListener("click", this.undoTransfer);
    if (this.log.type === "transaction" && !this.log.reverted) this.targetElement.querySelector(".undo-button").addEventListener("click", this.undoTransaction);
  }
}