//v0.1.0

(function (window, document, undefined) {
    "use strict";

    class Util {
        static mandatory(param) {
            throw new Error(`${param} is required.`);
        }

        //https://github.com/jaxgeller/ez.js
        static easeOutQuad(t, b, c, d) {
            return -c * (t /= d) * (t - 2) + b;
        }

        static checkStorageSupport() {
            try {
                localStorage.setItem("a", 1);
                localStorage.removeItem("a");
                return true;
            } catch (e) {
                return false;
            }
        }

        static getElementBounds(el) {
            return {
                top: el.offsetTop,
                left: el.offsetLeft,
                bottom: el.offsetTop + el.offsetHeight,
                width: el.offsetWidth,
                height: el.offsetHeight
            };
        }
    }

    class Step {
        constructor(node, text, title) {
            this.type  = "normal";
            this.node  = node;
            this.text  = text;
            this.title = title;
        }
    }
    class ActionStep {
        constructor(htmlId) {
            this.type = "advanced";
            this.html = document.getElementById(htmlId.substr(1)).childNodes;
        }
    }

    class Tutorial {
        constructor(name = Util.mandatory("Name"),
                    {
                        selector = "tut-action",
                        steps = [],
                        persistent = false,
                        buttons = {},
                        padding = {},
                        debug = false,
                        autoplay = false,
                        scrollSpeed = 500
                    }) {
            this.elems = [];

            if (steps.length > 0) {
                for(let step of steps) {
                    if(step.hasOwnProperty("action")) {
                        //create advanced tutorial
                        new ActionStep(step.highlight);
                    } else {
                        this.elems.push(this._createTutorialSteps(step));
                    }
                }
            }
            else {
                let elems = Array.from(document.getElementsByClassName(selector));

                if (!elems.every(el => el.getAttribute("t-step")) || !elems.every(el => el.getAttribute("t-text"))) {
                    throw new Error("Not all steps or texts defined");
                }
                else {
                    elems.sort((a, b) => {
                        return parseInt(a.getAttribute("t-step")) - parseInt(b.getAttribute("t-step"));
                    });
                    this.elems = elems.map(item => new Step(item, item.getAttribute("t-text"), item.getAttribute("t-title")));
                }
            }

            if (this.elems.length === 0) {
                throw new Error("No activities point defined");
            }
            else {
                this._reset();

                this._name = name;
                this._persistent = persistent;
                this._advancedStorage = Util.checkStorageSupport();
                this._step = parseInt(this._persistent ? this._getCurrentPosition() || 0 : 0);
                this._scrolling = {
                    speed: scrollSpeed,
                    timer: null,
                    position: window.scrollY
                };
                this._padding = {
                    top: padding.top === undefined ? 12 : buttons.close,
                    left: padding.left === undefined ? 12 : buttons.close
                };
                this._eventHandler = {
                    load: this.__load(),
                    resize: this.__resize()
                };

                this.selector = selector;
                this.animate = true;
                this.animating = false;
                this.buttons = {
                    //close   : buttons.close === undefined ? 'Close' : buttons.close,
                    previous: buttons.previous === undefined ? 'Back' : buttons.close,
                    next: buttons.next === undefined ? 'Next' : buttons.close
                };
                this.debug = debug;

                this._body = document.body;
                this._blurElement = this._createBlurElement();
                [this._tutorialBox, this._tutorialTitle, this._tutorialText, this._tutorialPosition] = this._createTutorialBox();
                this._highlightBox = this._createHighlightBox(this._tutorialBox);

                Object.defineProperty(this, "step", {
                    get: () => this._step,
                    set: x => {
                        this._step = x;

                        if (this._persistent) {
                            this._saveCurrentPosition();
                        }
                    }
                });

                if (autoplay) {
                    window.addEventListener("load", this._eventHandler.load);
                }
            }
        }

        start() {
            if (this.debug)
                console.log("Tutorial started...");

            if (this.running) {
                console.warn("Tutorial instance already running");
            }
            else {
                this.elems[this.step].node.classList.add("tutorial-highlight");

                this._body.appendChild(this._blurElement);
                this._body.appendChild(this._highlightBox);

                this._moveHighlightBox();
                this._updateTutorialBox();

                this.running = true;

                window.addEventListener("resize", this._eventHandler.resize);
            }
        }

        close() {
            if (!this.running) {
                console.warn("Tutorial is not running");
                return;
            }

            this.elems[this.step].node.classList.remove("tutorial-highlight");

            this._highlightBox.style.transform = "";
            this._highlightBox.childNodes[0].style.transform = "";

            this._body.removeChild(this._blurElement);
            this._body.removeChild(this._highlightBox);

            window.removeEventListener("resize", this._eventHandler.resize);
            this._reset();
        }

        prev() {
            if (!this.running) {
                console.warn("Tutorial is not running");
                return;
            }
            else if (this.animating) {
                console.warn("Animation is already running");
                return;
            }

            if (this.debug)
                console.log(`Going to previous element: #${this.step}`);

            //at first step
            if (this.step === 0) {
                //or throw error;
                this.close();
            }
            else {
                this.elems[this.step].node.classList.remove("tutorial-highlight");
                this.elems[--this.step].node.classList.add("tutorial-highlight");

                this._moveHighlightBox();
            }

            this._updateTutorialBox();
            this._saveCurrentPosition();
        }

        next() {
            if (!this.running) {
                console.warn("Tutorial is not running");
                return;
            }
            else if (this.animating) {
                console.warn("Animation is already running");
                return;
            }

            if (this.debug)
                console.log(`Going to next element: #${this.step}`);

            //last step?
            if (this.step === this.elems.length - 1) {
                //or throw error;
                this.close();
            }
            else {
                this.elems[this.step].node.classList.remove("tutorial-highlight");
                this.elems[++this.step].node.classList.add("tutorial-highlight");

                this._moveHighlightBox();
            }

            this._updateTutorialBox();
            this._saveCurrentPosition();
        }

        //even if is not running?
        goToStep(step) {
            if (!this.running) {
                console.warn("Tutorial is not running.");
                return;
            }
            else if (!this._stepInBounds(step)) {
                throw new Error("Step out of bounds.");
            }
            else if (step === this.step) {
                return;
            }

            this.elems[this.step].node.classList.remove("tutorial-highlight");
            this.step = step;
            this.elems[this.step].node.classList.add("tutorial-highlight");
        }

        _stepInBounds(step) {
            return step >= 0 && step < this.elems.length;
        }

        _createBlurElement() {
            let el = document.createElement("div");
            el.classList.add("tutorial-blur");

            el.onclick = () => {
                this.close();
            }

            return el;
        }

        _createHighlightBox(tutorialBox) {
            let el = document.createElement("div");
            let background = document.createElement("div");
            let index = document.createElement("i");

            el.classList.add("tutorial-wrapper");
            background.classList.add("tutorial-background");
            index.classList.add("tutorial-index");

            el.onlick = e => {
                e.preventPropagation();
            }

            el.appendChild(background);
            el.appendChild(index);
            el.appendChild(tutorialBox);

            return el;
        }

        _createTutorialBox() {
            let wrapper = document.createElement("div");
            let content_wrapper = wrapper.cloneNode(false);
            let title = document.createElement("p");
            let text = document.createElement("p");
            let position = text.cloneNode();
            let buttonbox = wrapper.cloneNode(false);
            let buttonbox_wrapper = wrapper.cloneNode(false);
            let back = document.createElement("a");
            back.href = "#";
            let next = back.cloneNode(false);
            let close = back.cloneNode(false);

            wrapper.classList.add("tutorial-box");
            content_wrapper.classList.add("tutorial-box-wrapper");
            title.classList.add("tutorial-title");
            text.classList.add("tutorial-description");
            position.classList.add("tutorial-step-position");
            buttonbox.classList.add("tutorial-buttons");
            close.classList.add("tutorial-close");

            //close.textContent = this.buttons.close;
            back.textContent = this.buttons.previous;
            next.textContent = this.buttons.next;

            close.onclick = e => {
                e.preventDefault();

                this.close();
            }
            back.onclick = e => {
                e.preventDefault();

                this.prev();
            }

            next.onclick = e => {
                e.preventDefault();

                this.next();
            }

            buttonbox.appendChild(position);
            buttonbox.appendChild(close);
            buttonbox.appendChild(buttonbox_wrapper);
            buttonbox_wrapper.appendChild(back);
            buttonbox_wrapper.appendChild(next);

            content_wrapper.appendChild(title);
            content_wrapper.appendChild(text);
            //content_wrapper.appendChild(position);
            content_wrapper.appendChild(buttonbox);

            wrapper.appendChild(content_wrapper);

            return [wrapper, title, text, position];
        }

        _moveHighlightBox() {
            if (this.running && this.animate) {
                this.animating = true;
                this._animateHighlightBox();
            }
            else {
                let bounds = Util.getElementBounds(this.elems[this.step].node);

                this._highlightBox.style.top = bounds.top - this._padding.top;
                this._highlightBox.style.left = bounds.left - this._padding.left;
                this._highlightBox.childNodes[0].style.height = bounds.bottom - bounds.top + (2 * this._padding.top);
                this._highlightBox.childNodes[0].style.width = bounds.width + (2 * this._padding.left);

                this._tutorialBox.style.top = bounds.height + (2 * this._padding.top) + 6 + "px";
            }

            this._highlightBox.childNodes[1].textContent = this.step + 1;
        }

        _animateHighlightBox() {
            //flip technique
            //https://aerotwist.com/blog/flip-your-animations/
            let first = this.elems[0].node;
            let last = this.elems[this.step].node;

            this._transform.translateY = last.offsetTop - first.offsetTop;
            this._transform.translateX = last.offsetLeft - first.offsetLeft;
            //this._transform.scaleY = ((last.height + 24)/(first.height + 24));
            //this._transform.scaleX = ((last.width + 24)/(first.width + 24));

            //use transform or not ?
            this._tutorialBox.style.top = last.offsetHeight + (2 * this._padding.top) + 6 + "px";

            this._highlightBox.style.transform = `translateX(${this._transform.translateX}px) translateY(${this._transform.translateY}px)`;
            //this._highlightBox.childNodes[0].style.transform = `scaleX(${this._transform.scaleX}) scaleY(${this._transform.scaleY})`;
            this._highlightBox.childNodes[0].style.width = last.offsetWidth + (2 * this._padding.top);
            this._highlightBox.childNodes[0].style.height = last.offsetHeight + (2 * this._padding.top);

            window.requestAnimationFrame(nextTime => {
                this._scroll(nextTime);
            });

            this._highlightBox.addEventListener("transitionend", () => {
                this.animating = false;
            })
        }

        _updateTutorialBox() {
            this._tutorialText.textContent = this.elems[this.step].text;
            this._tutorialTitle.textContent = this.elems[this.step].title;
        }

        _saveCurrentPosition() {
            if (this._advancedStorage) {
                window.localStorage.setItem(`tutorial-${this._name}`, this.step);
            }
            else {
                document.cookie += `tutorial-${this._name}=${this.step};`;
            }
        }

        _getCurrentPosition() {
            if (this._advancedStorage) {
                return window.localStorage.getItem(`tutorial-${this._name}`);
            }
            else {
                return document.cookie.split(",")
                    .filter(item => item.includes(`tutorial-${this._name}`))
                    .map(item => parseInt(item.replace(`tutorial-${this._name}=`, "")));
            }
        }

        _scroll(timeStamp) {
            let boxBounds = Util.getElementBounds(this._tutorialBox);
            let curElement = Util.getElementBounds(this.elems[this.step].node);

            if (!this._scrolling.timer) {
                this._scrolling.timer = timeStamp;
                this._scrolling.position = window.scrollY
            }

            let timeDiff = timeStamp - this._scrolling.timer;
            let bottom = curElement.top + curElement.height + boxBounds.height + this._padding.top * 2;
            let next = Math.ceil(Util.easeOutQuad(timeDiff, this._scrolling.position, (bottom - window.innerHeight) - this._scrolling.position, this._scrolling.speed));

            if (next < 0) {
                this._scrolling.timer = null;
                return;
            }

            if (bottom !== window.innerHeight + window.scrollY) {
                window.scrollTo(0, next)
            }

            if (timeDiff < this._scrolling.speed) {
                window.requestAnimationFrame(nextTime => {
                    this._scroll(nextTime);
                });
            } else {
                this._scrolling.timer = null;
            }

        }

        _createTutorialSteps(elem) {
            let node = null;

            switch (elem.highlight.charAt(0)) {
                case ".":
                    node = document.getElementsByClassName(elem.highlight.substr(1))[0];
                    break;
                case "#":
                    node = document.getElementById(elem.highlight.substr(1));
                    break;
                default:
                    throw new Error("Unknown selector. Please only use id or class.");
                    break;
            }

            if(!node) {
                throw new Error(`Selector ${elem.highlight} not found.`);
            }

            return new Step(node, elem.text, elem.title);
        }

        _reset() {
            this.step = 0;
            this.running = false;

            this._transform = {
                translateY: 0,
                translateX: 0//,
                //scaleX: 0,
                //scaleY: 0
            };
        }

        __load() {
            return function handler() {
                window.removeEventListener("load", this._eventHandler.load);
                this.start();
            }.bind(this)
        }

        __resize() {
            return function handler() {
                this._highlightBox.classList.add("skip-animation");

                this._highlightBox.style.left = this.elems[0].node.offsetLeft - this._padding.left;
                this._highlightBox.style.top = this.elems[0].node.offsetTop - this._padding.top;

                this._animateHighlightBox();

                //debounce to remove after 200ms
                this._highlightBox.classList.remove("skip-animation");
            }.bind(this);
        }
    }

    if (!window.Tutorial) {
        window.Tutorial = Tutorial;
    }
})(window, document);