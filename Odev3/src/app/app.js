// Main component renders body element
class App extends Component {
  constructor(args) {
    const users = new State([]);
    const cart = new State([]);
    const history = new State([]);
    const products = new State([]);
    const currentUser = new State(null);

    // Calling parent constructor this way calls initial render after childComponents and states are set
    // This only creates the states, if this component needs to subscribe, they should also be added to argummets as subscriptions array
    // super({...args, users, history, subscriptions:[...args.subscriptions,users,history]})
    super({ ...args, users, history, products, currentUser, cart });
  }
  template() {
    return (`
      <div id="${this.targetElementID}" class="app">
        <div class="row">
          ${new UsersPanel({ users: this.users, history: this.history, parentComponent: this }).target()}
          ${new TransfersPanel({ users: this.users, history: this.history, products: this.products, parentComponent: this }).target()}
        </div>
        <div class="row">
          ${new ProductsPanel({ currentUser: this.currentUser, cart: this.cart, products: this.products, parentComponent: this }).target()}
          ${new TransactionPanel({ currentUser: this.currentUser, cart: this.cart, products: this.products, users: this.users, history: this.history, parentComponent: this }).target()}
        </div>
      </div>
    `)
  }
}