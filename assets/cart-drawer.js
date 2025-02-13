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


open(triggeredBy) {
    const cartDrawer = document.getElementById('CartDrawer'); // Ensure we target the correct element

    if (!cartDrawer) {
        console.error('Cart drawer not found!');
        return;
    }

    // Prevent default navigation
    if (triggeredBy) {
        triggeredBy.blur(); // Remove focus from cart icon to avoid issues
        this.setActiveElement(triggeredBy);
    }

    // Ensure accessibility role is properly set
    const cartDrawerNote = cartDrawer.querySelector('[id^="Details-"] summary');
    if (cartDrawerNote && !cartDrawerNote.hasAttribute('role')) {
        this.setSummaryAccessibility(cartDrawerNote);
    }

    // Close the mobile menu first to avoid conflicts
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu && mobileMenu.classList.contains('active')) {
        mobileMenu.classList.remove('active');
    }

    // Timeout ensures animation runs properly
    setTimeout(() => {
        cartDrawer.classList.add('animate', 'active');
    }, 10);

    // Ensure focus trapping works properly for accessibility
    cartDrawer.addEventListener(
        'transitionend',
        () => {
            const containerToTrapFocusOn = cartDrawer.classList.contains('is-empty')
                ? cartDrawer.querySelector('.drawer__inner-empty')
                : cartDrawer;

            const focusElement = cartDrawer.querySelector('.drawer__inner') || cartDrawer.querySelector('.drawer__close');
            trapFocus(containerToTrapFocusOn, focusElement);
        },
        { once: true }
    );

    document.body.classList.add('overflow-hidden');
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
