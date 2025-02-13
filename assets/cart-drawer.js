class CartDrawer extends HTMLElement {
  constructor() {
    super();

    this.addEventListener('keyup', (evt) => evt.code === 'Escape' && this.close());
    this.querySelector('#CartDrawer-Overlay').addEventListener('click', this.close.bind(this));
    this.setHeaderCartIconAccessibility();
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
  setHeaderCartIconAccessibility() {
    const updateCartLink = () => {
        const cartLink = document.querySelector('#cart-icon-bubble:not([style*="display: none"])'); // Select only the visible cart link
        if (!cartLink) return;

        cartLink.setAttribute('role', 'button');
        cartLink.setAttribute('aria-haspopup', 'dialog');

        cartLink.addEventListener('click', (event) => {
            event.preventDefault();
            this.open(cartLink);
        });

        cartLink.addEventListener('keydown', (event) => {
            if (event.code.toUpperCase() === 'SPACE') {
                event.preventDefault();
                this.open(cartLink);
            }
        });
    };

    updateCartLink(); // Apply initially
    window.addEventListener('resize', updateCartLink); // Reapply on window resize to ensure it targets the correct link
}


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

  open(triggeredBy) {
    const cartDrawer = document.getElementById('CartDrawer'); // Ensure correct selection

    if (!cartDrawer) {
        console.error('Cart drawer not found!');
        return;
    }

    console.log("Cart drawer function triggered!"); // Debugging line

    if (triggeredBy) {
        triggeredBy.blur(); // Ensure the button loses focus
        this.setActiveElement(triggeredBy);
    }

    // Close mobile menu before opening cart drawer
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }

    // **Force Shopify’s drawer to open properly**
    const cartDetails = document.querySelector('details#CartDrawer');
    if (cartDetails) {
        cartDetails.setAttribute('open', 'true'); // Ensure it's marked as open
        cartDetails.classList.add('is-open'); // Add a class to track state
    }

    // Ensure visibility & animation
    setTimeout(() => {
        cartDrawer.classList.add('animate', 'active');
    }, 10);

    document.body.classList.add('overflow-hidden');

    // Ensure it closes properly when clicking outside
    document.addEventListener('click', function(event) {
        if (!cartDrawer.contains(event.target) && !triggeredBy.contains(event.target)) {
            cartDetails.removeAttribute('open');
            cartDrawer.classList.remove('animate', 'active');
            document.body.classList.remove('overflow-hidden');
        }
    }, { once: true });
}


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
