class State {
  constructor(value) {
    this.value = value;
    this.subscribers = [];
  }
  addSubscriber(component) {
    this.subscribers.push(component);
  }
  removeSubscriber(component) {
    this.subscribers = this.subscribers.filter(this.subscriber !== component);
  }
  setValue(newValue) {
    this.value = newValue;
    this.subscribers.forEach(component => component.render());
  }
}

class idCounter {
  constructor() {
    this.value = 1;
  }
  getID() {
    let id = this.value
    this.value += 1;
    return id;
  }
}

// Parent class for all components
class Component {
  constructor(args) {
    // Get all arguments passed to constructor
    for (let arg in args) {
      this[arg] = args[arg];
    }
    this.targetElementID = `component-${idCount.getID()}`
    this.childComponents = [];
    this.parentComponent && this.parentComponent.childComponents.push(this);

    this.subscribe();
    this.bindAll();
  }

  // Get all defined class methods and bind all to this object
  // This is needed for "this" inside event handler functions to refer to component object instead of the target element;
  bindAll() {
    const methods = Object.getOwnPropertyNames(Object.getPrototypeOf(this));
    methods.forEach((method) => {
      if (method !== 'constructor') {
        this[method] = this[method].bind(this);
      }
    })
  }

  // Generate random id
  generateID() {
    // Random number 100000 - 999999
    return Math.floor(Math.random() * (900000) + 100000);
  }

  // Method to get date and time
  getTime() {
    let time = new Date();
    return time.toLocaleString('en-GB');
  }

  // Add this component to subscribers of related states
  subscribe() {
    this.subscriptions && this.subscriptions.forEach(state => state.addSubscriber(this));
  }

  // Search parent component to get target element with id
  getTargetElement() {
    this.targetElement = document.querySelector(`#${this.targetElementID}`);
    // If component target no longer exists, remove it from state subscribers
    if (!this.targetElement) this.subscriptions.forEach(removeSubscriber(this));
  }

  // Trigger render of all child components
  renderChildComponents() {
    this.childComponents.forEach(component => component.render());
  }

  // Return target element for this component;
  target() {
    return (`
      <div id=${this.targetElementID} class="${this.constructor.name.toLowerCase()}-component"></div>
    `)
  }

  // Render this components template in target element
  render() {
    // If this is initial render get target element
    !this.targetElement && this.getTargetElement();
    // Set innerHTML of this components target element
    this.targetElement.innerHTML = this.template();
    // Trigger render of all child components
    this.childComponents && this.renderChildComponents();
    // If this component uses event listeners, add event listeners
    this.addListeners && this.addListeners();
    // Run if this component has after render functions
    this.afterRender && this.afterRender();
  }
  // Components must be created as a new class extending Component class with template method
  // Event listeners must be added in addListeners method
}