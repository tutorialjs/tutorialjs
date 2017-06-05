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
        constructor(node, callback) {
            this.node = node;

            if (!Object.keys(callback).length && typeof callback !== "function") {
                this.callback = () => {};
            } else if (callback.once) {
                this.callback = function () {
                    if (this.run) {
                        return;
                    }

                    callback.fn();
                    this.run = true;
                }
            } else {
                this.callback = callback.fn || callback;
            }
        }
    }

    class NormalStep extends Step{
        constructor(node, text, {title = "", callback = {}} ={}) {
            super(node, callback);

            this.type = "normal";
            this.text = text;
            this.title = title;
        }
    }

    class ActionStep extends Step{
        constructor(node, htmlId, {callback = {}} = {}) {
            super(node, callback);

            this.type = "advanced";
            this.template = document.getElementById(htmlId.substr(1)).childNodes[0].data;
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
                        scrollSpeed = 800,
                        animate = true
                    }) {
            this.elems = [];

            if (steps.length > 0) {
                for (let step of steps) {
                    let node = document.querySelector(step.highlight);

                    if (!node) {
                        throw new Error(`Selector ${step.highlight} not found.`);
                    }

                    if (step.hasOwnProperty("action")) {
                        let action = new ActionStep(node, step.action.template);

                        action.template = this._parseAdvancedStep(action);
                        action.template.classList.add("custom-box");

                        this.elems.push(action);
                    } else {
                        this.elems.push(new NormalStep(node, step.text, {
                            title: step.title,
                            callback: step.callback
                        }));
                    }
                }
            } else {
                let elems = Array.from(document.getElementsByClassName(selector));

                if (!elems.every(el => el.getAttribute("t-step")) || !elems.every(el => el.getAttribute("t-text"))) {
                    throw new Error("Not all steps or texts defined");
                } else {
                    elems.sort((a, b) => {
                        return parseInt(a.getAttribute("t-step")) - parseInt(b.getAttribute("t-step"));
                    });
                    this.elems = elems.map(item => new Step(item, item.getAttribute("t-text"), {
                        title: item.getAttribute("t-title")
                    }));
                }
            }

            if (this.elems.length === 0) {
                throw new Error("No activities point defined");
            } else {
                this.name = name;

                this.options = {
                    selector: selector,
                    persistent: persistent,
                    advancedStorage: Util.checkStorageSupport(),
                    scrolling: {
                        speed: scrollSpeed,
                        timer: null,
                        position: window.scrollY
                    },
                    padding: {
                        top: padding.top === undefined ? 12 : buttons.close,
                        left: padding.left === undefined ? 12 : buttons.close
                    },
                    buttons: {
                        previous: buttons.previous === undefined ? 'Back' : buttons.close,
                        next: buttons.next === undefined ? 'Next' : buttons.close
                    },
                    animate: animate,
                    debug: debug
                };

                this.state = {
                    running: false,
                    animation: false,
                    type: this.elems[0].type
                };

                this.components = {
                    _step: parseInt(this.options.persistent ? this._getCurrentPosition() || 0 : 0),
                    _eventHandler: {
                        load: this.__load(),
                        resize: this.__resize()
                    },
                    _elements: {
                        blur: this._createBlurElement(),
                        ...this._createTutorialBox()
                    }
                };
                this.components._elements.highlightBox = this._createHighlightBox(this.components._elements.tutorialBox);

                this._reset();

                Object.defineProperty(this, "step", {
                    get: () => this.components._step,
                    set: x => {
                        this.components._step = x;

                        if (this.options.persistent) {
                            this._saveCurrentPosition();
                        }
                    }
                });

                if (autoplay) {
                    window.addEventListener("load", this.components._eventHandler.load);
                }
            }
        }

        start() {
            if (this.options.debug)
                console.log("Tutorial started...");

            if (this.state.running) {
                console.warn("Tutorial instance already running");
            } else {
                this.elems[this.step].node.classList.add("tutorial-highlight");

                document.body.appendChild(this.components._elements.blur);
                document.body.appendChild(this.components._elements.highlightBox);

                this._moveHighlightBox();
                this._updateTutorialBox();

                this.state.running = true;

                window.addEventListener("resize", this.components._eventHandler.resize);
            }
        }

        close() {
            if (!this.state.running) {
                console.warn("Tutorial is not running");
                return;
            }

            this.elems[this.step].node.classList.remove("tutorial-highlight");

            this.components._elements.highlightBox.style.transform = "";
            this.components._elements.highlightBox.childNodes[0].style.transform = "";

            document.body.removeChild(this.components._elements.blur);
            document.body.removeChild(this.components._elements.highlightBox);

            window.removeEventListener("resize", this.components._eventHandler.resize);
            this._reset();
        }

        prev() {
            if (!this.state.running) {
                console.warn("Tutorial is not running");
                return;
            } else if (this.animating) {
                console.warn("Animation is already running");
                return;
            }

            if (this.options.debug)
                console.log(`Going to previous element: #${this.step}`);

            //at first step
            if (this.step === 0) {
                this.close();
                return;
            } else {
                this.elems[this.step].node.classList.remove("tutorial-highlight");
                this.elems[--this.step].node.classList.add("tutorial-highlight");

                this._moveHighlightBox();
            }

            this._updateTutorialBox();
        }

        next() {
            if (!this.state.running) {
                console.warn("Tutorial is not running");
                return;
            } else if (this.animating) {
                console.warn("Animation is already running");
                return;
            }

            if (this.options.debug)
                console.log(`Going to next element: #${this.step}`);

            //run callback - good call position?
            this.elems[this.step].callback();

            //last step?
            if (this.step === this.elems.length - 1) {
                this.close();
                return;
            } else {
                this.elems[this.step].node.classList.remove("tutorial-highlight");
                this.elems[++this.step].node.classList.add("tutorial-highlight");

                this._moveHighlightBox();
            }

            this._updateTutorialBox();

        }

        goToStep(step) {
            if (!this.state.running) {
                console.warn("Tutorial is not running.");
                return;
            } else if (!this._stepInBounds(step)) {
                throw new Error("Step out of bounds.");
            } else if (step === this.step) {
                return;
            }

            this.elems[this.step].node.classList.remove("tutorial-highlight");
            this.step = step;
            this.elems[this.step].node.classList.add("tutorial-highlight");
        }

        _parseAdvancedStep(step) {
            let wrapper = document.createElement("div");
            let attr = Tutorial.actions.baseAttributes;

            wrapper.insertAdjacentHTML("afterbegin", step.template);

            for (let elem of wrapper.getElementsByTagName("*")) {
                for (let mod of Object.entries(attr)) {

                    if (Array.from(elem.attributes).some(item => item.name.includes(mod[0]))) {
                        elem.addEventListener("click", () => {
                            mod[1].call(this);
                        });
                    }
                }
            }

            return wrapper;
        }

        _stepInBounds(step) {
            return step >= 0 && step < this.elems.length;
        }

        _createBlurElement() {
            let el = document.createElement("div");
            el.classList.add("tutorial-blur");

            el.addEventListener("click", e => {
                this.close();
            });

            return el;
        }

        _createHighlightBox(tutorialBox) {
            let el = document.createElement("div");
            let background = el.cloneNode();
            let index = document.createElement("i");

            el.classList.add("tutorial-wrapper");
            background.classList.add("tutorial-background");
            index.classList.add("tutorial-index");

            el.addEventListener("click", e => {
                e.stopPropagation();
            });

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

            back.textContent = this.options.buttons.previous;
            next.textContent = this.options.buttons.next;

            close.addEventListener("click", e => {
                this.close();
            }, false);
            back.addEventListener("click", e => {
                this.prev();
            }, false);
            next.addEventListener("click", e => {
                this.next();
            }, false);

            buttonbox.appendChild(position);
            buttonbox.appendChild(close);
            buttonbox.appendChild(buttonbox_wrapper);
            buttonbox_wrapper.appendChild(back);
            buttonbox_wrapper.appendChild(next);

            content_wrapper.appendChild(title);
            content_wrapper.appendChild(text);
            content_wrapper.appendChild(buttonbox);

            wrapper.appendChild(content_wrapper);

            return {
                tutorialBox: wrapper,
                tutorialWrapper: content_wrapper,
                tutorialTitle: title,
                tutorialText: text,
                tutorialPosition: position
            };
        }

        _moveHighlightBox() {
            if (this.state.running && this.options.animate) {
                this.state.animating = true;

                window.requestAnimationFrame(this._animateHighlightBox.bind(this));
            } else {
                let bounds = Util.getElementBounds(this.elems[this.step].node);
                let bottom = bounds.top + bounds.height + this.components._elements.tutorialBox.offsetHeight + this.options.padding.top * 2;

                this.components._elements.highlightBox.style.top = bounds.top - this.options.padding.top;
                this.components._elements.highlightBox.style.left = bounds.left - this.options.padding.left;
                this.components._elements.highlightBox.childNodes[0].style.height = bounds.bottom - bounds.top + (2 * this.options.padding.top);
                this.components._elements.highlightBox.childNodes[0].style.width = bounds.width + (2 * this.options.padding.left);

                this.components._elements.tutorialBox.style.top = bounds.height + (2 * this.options.padding.top) + 6 + "px";

                window.requestAnimationFrame(() => {
                    window.scrollTo(0, bottom - (window.scrollY + window.innerHeight + window.scrollY));
                });
            }

            this.components._elements.highlightBox.childNodes[1].textContent = this.step + 1;
        }

        _animateHighlightBox() {
            //https://aerotwist.com/blog/flip-your-animations/
            let first = this.elems[0].node;
            let last = this.elems[this.step].node;

            this.state.transform.translateY = last.offsetTop - first.offsetTop;
            this.state.transform.translateX = last.offsetLeft - first.offsetLeft;

            this.components._elements.tutorialBox.style.top = last.offsetHeight + (2 * this.options.padding.top) + 6 + "px";

            this.components._elements.highlightBox.style.transform = `translateX(${this.state.transform.translateX}px) translateY(${this.state.transform.translateY}px)`;

            this.components._elements.highlightBox.childNodes[0].style.width = last.offsetWidth + (2 * this.options.padding.top);
            this.components._elements.highlightBox.childNodes[0].style.height = last.offsetHeight + (2 * this.options.padding.top);

            this._scroll();

            this.components._elements.highlightBox.addEventListener("transitionend", () => {
                this.state.animating = false;
            })
        }

        _updateTutorialBox() {
            if(this.elems[this.step].type === "normal") {
                if(this.state.type === "custom") {
                    this.components._elements.tutorialBox.firstChild.remove();
                    this.components._elements.tutorialBox.appendChild(this.components._elements.tutorialWrapper)

                    this.state.type = "normal";
                }
                this.components._elements.tutorialText.textContent = this.elems[this.step].text;
                this.components._elements.tutorialTitle.textContent = this.elems[this.step].title;

            } else {
                this.components._elements.tutorialBox.firstChild.remove();
                this.components._elements.tutorialBox.appendChild(this.elems[this.step].template)

                this.state.type = "custom";
            }
        }

        _saveCurrentPosition() {
            if (this.options.advancedStorage) {
                window.localStorage.setItem(`tutorial-${this.name}`, this.step);
            } else {
                document.cookie += `tutorial-${this.name}=${this.step};`;
            }
        }

        _getCurrentPosition() {
            if (this.options.advancedStorage) {
                return window.localStorage.getItem(`tutorial-${this.name}`);
            } else {
                return document.cookie.split(",")
                    .filter(item => item.includes(`tutorial-${this.name}`))
                    .map(item => parseInt(item.replace(`tutorial-${this.name}=`, "")));
            }
        }

        _scroll() {
            let boxBounds = Util.getElementBounds(this.components._elements.tutorialBox);
            let curElement = Util.getElementBounds(this.elems[this.step].node);

            let bottom = curElement.top + curElement.height + boxBounds.height + this.options.padding.top * 2;

            window.requestAnimationFrame(stamp => {
                this.options.scrolling.timer = stamp;

                this.__scrollMovement(stamp, bottom);
            });
        }

        _reset() {
            this.step = 0;
            this.state.running = false;

            this.state.transform = {
                translateY: 0,
                translateX: 0
            };
        }

        __load() {
            return function handler() {
                window.removeEventListener("load", this.components._eventHandler.load);
                this.start();
            }.bind(this)
        }

        __resize() {
            return function handler() {
                this.components._elements.highlightBox.classList.add("skip-animation");

                this.components._elements.highlightBox.style.left = this.elems[0].node.offsetLeft - this.options.padding.left;
                this.components._elements.highlightBox.style.top = this.elems[0].node.offsetTop - this.options.padding.top;

                this._animateHighlightBox();

                //debounce to remove after 200ms
                this.components._elements.highlightBox.classList.remove("skip-animation");
            }.bind(this);
        }

        __scrollMovement(timeStamp, bottom) {
            let timeDiff = timeStamp - this.options.scrolling.timer;
            let next = Math.ceil(Util.easeOutQuad(timeDiff, this.options.scrolling.position, (bottom - window.innerHeight) - this.options.scrolling.position, this.options.scrolling.speed));

            if(next < 0) {
                this.options.scrolling.position = window.scrollY;
                this.options.scrolling.timer = null;

                return
            } else if (bottom !== window.innerHeight + window.scrollY) {
                window.scrollTo(0, next);
            }

            if (timeDiff < this.options.scrolling.speed) {
                window.requestAnimationFrame(stamp => {
                    this.__scrollMovement(stamp, bottom);
                });
            } else {
                this.options.scrolling.position = window.scrollY;
                this.options.scrolling.timer = null;
            }
        }

        static installCustomAction({key = Util.mandatory("Identifier"), action = Util.mandatory("Function"), event = Util.mandatory("Event")} = {}) {
            Tutorial.actions.custom.push({
                key,
                action,
                event
            });
        }
    }

    Tutorial.actions = {
        baseAttributes: {
            next: Tutorial.prototype.next,
            prev: Tutorial.prototype.prev,
            close: Tutorial.prototype.close
        },
        custom: []
    };

    if (!window.Tutorial) {
        window.Tutorial = Tutorial;
    }
})(window, document);