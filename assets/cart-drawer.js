class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    // this.setHeaderCartIconAccessibility();

    this.setHeaderCartIconAccessibility();  // Existing desktop setup
    this.setMobileCartIconAccessibility();  // Add this for mobile setup
  }

  setCartIconAccessibility() {
  const desktopCartLink = document.querySelector('#cart-icon-bubble.desktop');
  const mobileCartLink = document.querySelector('#cart-icon-bubble.mobile');

  if (desktopCartLink) {
    desktopCartLink.setAttribute('role', 'button');
    desktopCartLink.setAttribute('aria-haspopup', 'dialog');
    desktopCartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.openCartDrawer(desktopCartLink);
    });
  }

  if (mobileCartLink) {
    mobileCartLink.setAttribute('role', 'button');
    mobileCartLink.setAttribute('aria-haspopup', 'dialog');
    mobileCartLink.addEventListener('click', (event) => {
      event.preventDefault();
      this.openMobileCartDrawer(mobileCartLink);
    });
  }
},

openCartDrawer(triggeredBy) {
  const cartDrawer = document.getElementById('CartDrawer');
  if (!cartDrawer) return;

  if (triggeredBy) this.setActiveElement(triggeredBy);

  setTimeout(() => {
    cartDrawer.classList.add('animate', 'active');
  }, 10);

  document.body.classList.add('overflow-hidden');
},

openMobileCartDrawer(triggeredBy) {
  const cartDrawer = document.getElementById('CartDrawer');
  if (!cartDrawer) return;

  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenu && mobileMenu.classList.contains('active')) {
    mobileMenu.classList.remove('active');
  }

  if (triggeredBy) this.setActiveElement(triggeredBy);

  setTimeout(() => {
    cartDrawer.classList.add('animate', 'active');
  }, 10);

  document.body.classList.add('overflow-hidden');
}


  // setHeaderCartIconAccessibility() {
  //   const cartLink = document.querySelector('#cart-icon-bubble');
  //   if (!cartLink) return;

  //   cartLink.setAttribute('role', 'button');
  //   cartLink.setAttribute('aria-haspopup', 'dialog');
  //   cartLink.addEventListener('click', (event) => {
  //     event.preventDefault();
  //     this.open(cartLink);
  //   });
  //   cartLink.addEventListener('keydown', (event) => {
  //     if (event.code.toUpperCase() === 'SPACE') {
  //       event.preventDefault();
  //       this.open(cartLink);
  //     }
  //   });
  // }

//   setMobileCartIconAccessibility() {
//   const mobileCartLink = document.querySelector('.mobile-menu #cart-icon-bubble');
//   if (!mobileCartLink) return;

//   mobileCartLink.setAttribute('role', 'button');
//   mobileCartLink.setAttribute('aria-haspopup', 'dialog');
//   mobileCartLink.addEventListener('click', (event) => {
//     event.preventDefault();
//     this.openMobileCart(mobileCartLink);
//   });
// },

// openMobileCart(triggeredBy) {
//   const cartDrawer = document.getElementById('CartDrawer');
//   if (!cartDrawer) {
//     console.error('Cart drawer not found!');
//     return;
//   }

//   // Close mobile menu
//   const mobileMenu = document.getElementById('mobile-menu');
//   if (mobileMenu && mobileMenu.classList.contains('active')) {
//     mobileMenu.classList.remove('active');
//   }

//   if (triggeredBy) this.setActiveElement(triggeredBy);

//   const cartDrawerNote = cartDrawer.querySelector('[id^="Details-"] summary');
//   if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);

//   setTimeout(() => {
//     cartDrawer.classList.add('animate', 'active');
//   }, 10);

//   document.body.classList.add('overflow-hidden');
// }

  // open(triggeredBy) {
  //   if (triggeredBy) this.setActiveElement(triggeredBy);
  //   const cartDrawerNote = this.querySelector('[id^="Details-"] summary');
  //   if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) this.setSummaryAccessibility(cartDrawerNote);
  //   // here the animation doesn't seem to always get triggered. A timeout seem to help
  //   setTimeout(() => {
  //     this.classList.add('animate', 'active');
  //   });

  //   this.addEventListener(
  //     'transitionend',
  //     () => {
  //       const containerToTrapFocusOn = this.classList.contains('is-empty')
  //         ? this.querySelector('.drawer__inner-empty')
  //         : document.getElementById('CartDrawer');
  //       const focusElement = this.querySelector('.drawer__inner') || this.querySelector('.drawer__close');
  //       trapFocus(containerToTrapFocusOn, focusElement);
  //     },
  //     { once: true }
  //   );

  //   document.body.classList.add('overflow-hidden');
  // }

  close() {
    this.classList.remove('active');
    removeTrapFocus(this.activeElement);
    document.body.classList.remove('overflow-hidden');
  }

  setSummaryAccessibility(cartDrawerNote) {
    cartDrawerNote.setAttribute('role', 'button');
    cartDrawerNote.setAttribute('aria-expanded', 'false');

    if (cartDrawerNote.nextElementSibling.getAttribute('id')) {
      cartDrawerNote.setAttribute('aria-controls', cartDrawerNote.nextElementSibling.id);
    }

    cartDrawerNote.addEventListener('click', (event) => {
      event.currentTarget.setAttribute('aria-expanded', !event.currentTarget.closest('details').hasAttribute('open'));
    });

    cartDrawerNote.parentElement.addEventListener('keyup', onKeyUpEscape);
  }

  renderContents(parsedState) {
    this.querySelector('.drawer__inner').classList.contains('is-empty') &&
      this.querySelector('.drawer__inner').classList.remove('is-empty');
    this.productId = parsedState.id;
    this.getSectionsToRender().forEach((section) => {
      const sectionElement = section.selector
        ? document.querySelector(section.selector)
        : document.getElementById(section.id);

      if (!sectionElement) return;
      sectionElement.innerHTML = this.getSectionInnerHTML(parsedState.sections[section.id], section.selector);
    });

    setTimeout(() => {
      this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
      this.open();
    });
  }

  getSectionInnerHTML(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector).innerHTML;
  }

  getSectionsToRender() {
    return [
      {
        id: 'cart-drawer',
        selector: '#CartDrawer',
      },
      {
        id: 'cart-icon-bubble',
      },
    ];
  }

  getSectionDOM(html, selector = '.shopify-section') {
    return new DOMParser().parseFromString(html, 'text/html').querySelector(selector);
  }

  setActiveElement(element) {
    this.activeElement = element;
  }
}

customElements.define('cart-drawer', CartDrawer);

class CartDrawerItems extends CartItems {
  getSectionsToRender() {
    return [
      {
        id: 'CartDrawer',
        section: 'cart-drawer',
        selector: '.drawer__inner',
      },
      {
        id: 'cart-icon-bubble',
        section: 'cart-icon-bubble',
        selector: '.shopify-section',
      },
    ];
  }
}

customElements.define('cart-drawer-items', CartDrawerItems);
