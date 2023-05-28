class Carousel {
  constructor(opts = {}) {
    this.bind();

    this.opts = {
      target: opts.target || "carousel",
    };

    // Select the carousel, its items, and the control buttons
    this.carousel = document.getElementById(this.opts.target);
    this.items = this.carousel.getElementsByClassName("item");
    this.prevBtn = document.getElementById("prev");
    this.nextBtn = document.getElementById("next");

    // Prepare to limit the direction in which the carousel can slide,
    // and to control how much the carousel slides on each interaction.
    // To slide the carousel by a single slide, we need to know the
    // carousel width, and the margin between each item.
    this.carouselWidth = this.carousel.offsetWidth;
    this.itemWidth = Math.round(
      this.items[1].getBoundingClientRect().left -
        this.items[0].getBoundingClientRect().left
    );
    this.itemMarginRight = Math.round(
      this.items[1].getBoundingClientRect().left -
        this.items[0].getBoundingClientRect().right
    );

    // Define x-axis offset properties to calculate the slide distance,
    // and a maximum width for an upper bound.
    // These offsets work with mouse or touch.
    this.offset = 0;
    this.touchOffset = 0;
    this.maxX = -(
      this.itemWidth * this.items.length -
      this.itemMarginRight -
      this.carouselWidth
    );

    // Start/end positions calculated when a user begins dragging slides,
    // during the drag, and at the end of dragging.
    // The threshold represents how much a user drags before advancing
    // the slide.
    this.posX1 = 0;
    this.posX2 = 0;
    this.posInitial = this.offset;
    this.posFinal = this.offset;
    this.threshold = 80;

    // Next/prev control button click events
    this.prevBtn.addEventListener("click", this.prev);
    this.nextBtn.addEventListener("click", this.next);

    // Mouse event for dragging slides
    this.carousel.addEventListener("mousedown", this.dragStart);

    // Touch events
    this.carousel.addEventListener("touchstart", this.dragStart);
    this.carousel.addEventListener("touchmove", this.dragAction, {
      passive: true,
    });
    this.carousel.addEventListener("touchend", this.dragEnd);
  }

  bind() {
    [
      "toggleControlDisplay",
      "prev",
      "next",
      "dragStart",
      "dragAction",
      "dragEnd",
    ].forEach((fn) => (this[fn] = this[fn].bind(this)));
  }

  toggleControlDisplay() {
    if (this.offset === 0) {
      this.prevBtn.style.display = "none";
    } else if (this.offset === this.maxX) {
      this.nextBtn.style.display = "none";
    } else {
      this.prevBtn.style.display = "block";
      this.nextBtn.style.display = "block";
    }
  }

  prev() {
    if (this.offset !== 0) {
      this.offset += this.itemWidth;
      this.carousel.style.transform = `translate3d(${this.offset}px, 0, 0)`;
      this.touchOffset = this.offset;
    }
    this.toggleControlDisplay();
  }

  next() {
    if (this.offset !== this.maxX) {
      this.offset -= this.itemWidth;
      this.carousel.style.transform = `translate3d(${this.offset}px, 0, 0)`;
      this.touchOffset = this.offset;
    }
    this.toggleControlDisplay();
  }

  dragStart(e) {
    e = e || window.event;
    e.preventDefault();

    this.posInitial = this.offset;

    if (e.type === "touchstart") {
      this.posX1 = e.touches[0].clientX;
    } else {
      this.posX1 = e.clientX;
      document.onmouseup = this.dragEnd;
      document.onmousemove = this.dragAction;
    }
  }

  dragAction(e) {
    e = e || window.event;

    if (e.type === "touchmove") {
      this.posX2 = this.posX1 - e.touches[0].clientX;
      this.posX1 = e.touches[0].clientX;
    } else {
      this.posX2 = this.posX1 - e.clientX;
      this.posX1 = e.clientX;
    }
    if (this.touchOffset >= 0 || this.touchOffset <= this.maxX) {
      this.touchOffset = this.offset;
    }

    this.touchOffset -= this.posX2;
    this.carousel.style.transform = `translate3d(${this.touchOffset}px, 0, 0)`;
  }

  dragEnd() {
    this.posFinal = this.touchOffset;
    if (this.posFinal - this.posInitial < -this.threshold) {
      this.next();
    } else if (this.posFinal - this.posInitial > this.threshold) {
      this.prev();
    } else {
      this.carousel.style.transform = `translate3d(${this.posInitial}px, 0, 0)`;
      this.touchOffset = this.offset;
    }

    document.onmouseup = null;
    document.onmousemove = null;
  }
}

new Carousel();

//Seleccionar una imagen e incluirla como imagen avatar del usuario;

function cambiarAvatar(nombreImagen) {
  var avatar = document.getElementById("avatarUser");
  avatar.style.backgroundImage =
    "url('assets/images/avatars/" + nombreImagen + "')";
  avatar.style.backgroundSize = "cover";
}
