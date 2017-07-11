//v0.1.2

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
        constructor(ctx, node, callback) {
            this.node = node;

            if (!Object.keys(callback).length && typeof callback !== "function") {
                this.callback = () => {};
            } else if (callback.once) {
                this.callback = function () {
                    if (this.run) {
                        return;
                    }

                    callback.fn.call(this, ctx);
                    this.run = true;
                }
            } else {
                this.callback = (callback.fn || callback).bind(this, ctx);
            }
        }
    }

    class NormalStep extends Step{
        constructor(ctx, node, text, {title = "", callback = {}} ={}) {
            super(ctx, node, callback);

            this.type = "normal";
            this.text = text;
            this.title = title;
        }
    }

    class ActionStep extends Step{
        constructor(ctx, node, htmlId, {callback = {}} = {}) {
            super(ctx, node, callback);

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
                        animate = true,
                        progressbar = false
                    }) {
            this.elems = [];

            if (steps.length > 0) {
                for (let step of steps) {
                    let node = document.querySelector(step.highlight);

                    if (!node) {
                        throw new Error(`Selector ${step.highlight} not found.`);
                    }

                    if (step.hasOwnProperty("action")) {
                        let action = new ActionStep(this, node, step.action.template);

                        action.template = this._parseAdvancedStep(action);
                        action.template.classList.add("custom-box");

                        this.elems.push(action);
                    } else {
                        this.elems.push(new NormalStep(this, node, step.text, {
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
                    this.elems = elems.map(item => new NormalStep(this, item, item.getAttribute("t-text"), {
                        title: item.getAttribute("t-title")
                    }));
                }
            }

            if (this.elems.length === 0) {
                throw new Error("No activities point defined");
            } else {
                this.name = name;
                this.buttonText = {};

                this.options = {
                    selector: selector,
                    persistent: persistent,
                    advancedStorage: Util.checkStorageSupport(),
                    scrolling: {
                        speed: scrollSpeed,
                        timer: null,
                        position: 0
                    },
                    padding: {
                        top: padding.top === undefined ? 12 : buttons.close,
                        left: padding.left === undefined ? 12 : buttons.close
                    },
                    buttons: {
                        previous: buttons.previous === undefined ? 'Back' : buttons.previous,
                        next: buttons.next === undefined ? 'Next' : buttons.next
                    },
                    animate: animate,
                    debug: debug
                };

                const curPosition = this._getCurrentPosition() || 0;

                this.state = {
                    running: false,
                    completed: curPosition === -1,
                    animation: false,
                    transform: {
                        translateY: 0,
                        translateX: 0
                    },
                    type: this.elems[0].type,
                    _firstStep: parseInt(this.options.persistent ? curPosition : 0)
                };

                this.components = {
                    _step: parseInt(this.options.persistent ? curPosition : 0),
                    _eventHandler: {
                        load: this.__load(),
                        resize: this.__resize()
                    },
                    _elements: {
                        progressBar: progressbar ? this._createProgressbar() : false,
                        blur: this._createBlurElement(),
                        ...this._createTutorialBox()
                    }
                };
                this.components._elements.highlightBox = this._createHighlightBox(this.components._elements.tutorialBox);

                Object.defineProperty(this, "step", {
                    get: () => this.components._step,
                    set: x => {
                        if (!this.state.running) {
                            console.warn("Tutorial is not running");
                            return;
                        }

                        if (this.animating) {
                            console.warn("Animation is already running");
                            return;
                        }

                        if(x < 0) {
                            this.close();
                        }
                        if(x === this.elems.length) {
                            this.close();

                            this.components._step = -1;
                        } else {
                            this.elems[this.components._step].node.classList.remove("tutorial-highlight");
                            this.components._step = x;
                            this.elems[x].node.classList.add("tutorial-highlight");

                            this._updateTutorialBox();
                            this._updateProgressBar();
                            this._moveHighlightBox();
                        }

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
            } else if (this.step === -1) {
                console.warn("Tutoral already completed. Please reset steps.");
            } else {
                this.elems[this.step].node.classList.add("tutorial-highlight");

                document.body.appendChild(this.components._elements.blur);
                document.body.appendChild(this.components._elements.highlightBox);

                if(this.components._elements.progressBar)
                    document.body.appendChild(this.components._elements.progressBar);

                this._moveHighlightBox();
                this._updateTutorialBox();
                this._updateProgressBar();

                this.state.running = true;

                window.addEventListener("resize", this.components._eventHandler.resize);
            }
        }

        close() {
            if (!this.state.running) {
                console.warn("Tutorial is not running");
                return;
            }

            this.state.running = false;

            this.elems[this.step].node.classList.remove("tutorial-highlight");

            this.components._elements.highlightBox.style.transform = "";
            this.components._elements.highlightBox.firstChild.style.transform = "";

            document.body.removeChild(this.components._elements.blur);
            document.body.removeChild(this.components._elements.highlightBox);

            if(this.components._elements.progressBar)
                document.body.removeChild(this.components._elements.progressBar);

            window.removeEventListener("resize", this.components._eventHandler.resize);
        }

        prev() {
            this.step--;

            if (this.options.debug)
                console.log(`Going to previous element: #${this.step}`);
        }

        next() {
            this.elems[this.step].callback();

            this.step++;

            if (this.options.debug)
                console.log(`Going to next element: #${this.step === -1 ? 'Finished' : this.step}`);

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

            this.step = step;
        }

        reset() {
            this.components._step = 0;
            this.state._firstStep = 0;
            this.state.transform.translateX = 0;
            this.state.transform.translateY = 0;
        }

        _parseAdvancedStep(step) {
            const wrapper = document.createElement("div");
            const attr = Tutorial.actions.baseAttributes;
            const custom = Tutorial.actions.custom;

            wrapper.insertAdjacentHTML("afterbegin", step.template);

            for (let elem of wrapper.getElementsByTagName("*")) {
                for (let mod of Object.entries(attr)) {

                    if (Array.from(elem.attributes).some(item => item.name.includes(mod[0]))) {
                        elem.addEventListener("click", () => {
                            mod[1].call(this);
                        });
                    }
                }

                for (let evt of custom) {

                    for(let cattr of Array.from(elem.attributes)) {
                        if (cattr.name.includes(evt.key)) {
                            elem.addEventListener(evt.event, () => {
                                window[cattr.value]();
                            });
                        }
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

            Object.defineProperties(this.buttonText, {
                "next": {
                    get: () => this.options.buttons.next,
                    set: x => {
                        this.options.buttons.next = x;
                        next.textContent = x;
                    }
                },
                "prev": {
                    get: () => this.options.buttons.previous,
                    set: x => {
                        this.options.buttons.previous = x;
                        back.textContent = x;
                    }
                }
            });

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
                tutorialPosition: position,
                tutorialButtonNext: next,
                tutorialButtonPrev: back
            };
        }

        _createProgressbar() {
            const progressBarWrapper = document.createElement("div");
            const stepList = document.createElement("ul");
            const progressTrack = document.createElement("div");
            const currentProgressTrack = document.createElement("span");

            progressBarWrapper.classList.add("progressbar-wrapper");
            progressTrack.classList.add("progressbar-track");

            let progressSteps = [];
            for (let step = 0; step <= this.elems.length-1; step++) {
                let currentStep = document.createElement("li");
                let currentStepText = document.createElement("span");
                currentStepText.textContent = step+1;
                currentStep.appendChild(currentStepText);
                currentStep.style.left = (100/(this.elems.length-1) * step) + '%';
                stepList.appendChild(currentStep);
                progressSteps.push(currentStep);

                currentStep.addEventListener("click", e => {
                    this.goToStep(e.target.textContent-1);
                }, false);
            }



            progressTrack.appendChild(currentProgressTrack);
            progressBarWrapper.appendChild(progressTrack);
            progressBarWrapper.appendChild(stepList);

            return progressBarWrapper;
        }

        _updateProgressBar() {
            if(!this.components._elements.progressBar) {
                return;
            }

            let progressSteps = Array.from(this.components._elements.progressBar.getElementsByTagName("li"));
            let progressTrack = this.components._elements.progressBar.childNodes[0].childNodes[0];
            progressTrack.style.width = (100/(this.elems.length-1)*this.step) + '%';

            for (var i = 0; i <= this.elems.length-1; i++) {
                progressSteps[i].classList.remove("active", "finished");
            }

            for (let j of progressSteps.slice(0, this.step)) {
                j.classList.add("finished");
            }

            progressSteps[this.step].classList.add("active");
        }

        _moveHighlightBox() {
            if (this.state.running && this.options.animate) {
                this.state.animating = true;

                window.requestAnimationFrame(this._animateHighlightBox.bind(this));
            } else {
                const bounds = Util.getElementBounds(this.elems[this.step].node);
                const leftRightBorder = bounds.left - this.options.padding.left;

                this.components._elements.highlightBox.style.top = bounds.top - this.options.padding.top;
                this.components._elements.highlightBox.style.left = leftRightBorder;
                this.components._elements.highlightBox.style.right = leftRightBorder;
                this.components._elements.highlightBox.firstChild.style.height = bounds.bottom - bounds.top + (2 * this.options.padding.top);
                this.components._elements.highlightBox.firstChild.style.width = bounds.width + (2 * this.options.padding.left);

                this.components._elements.tutorialBox.style.top = bounds.height + (2 * this.options.padding.top) + 6 + "px";

                window.requestAnimationFrame(() => {
                    window.scrollTo(0, bounds.top - ((window.innerHeight - (this.components._elements.tutorialBox.offsetHeight + this.components._elements.highlightBox.firstChild.offsetHeight)) /2 ));
                });
            }

            this.components._elements.highlightBox.childNodes[1].textContent = this.step + 1;
        }

        _animateHighlightBox() {
            //https://aerotwist.com/blog/flip-your-animations/
            let first = this.elems[this.state._firstStep].node;
            let last = this.elems[this.step].node;

            this.state.transform.translateY = last.offsetTop - first.offsetTop;
            this.state.transform.translateX = last.offsetLeft - first.offsetLeft;

            this.components._elements.tutorialBox.style.top = last.offsetHeight + (2 * this.options.padding.top) + 6 + "px";

            this.components._elements.highlightBox.style.transform = `translateX(${this.state.transform.translateX}px) translateY(${this.state.transform.translateY}px)`;

            this.components._elements.highlightBox.firstChild.style.width = last.offsetWidth + (2 * this.options.padding.top);
            this.components._elements.highlightBox.firstChild.style.height = last.offsetHeight + (2 * this.options.padding.top);

            this._scroll();

            this.components._elements.highlightBox.addEventListener("transitionend", () => {
                this.state.animating = false;
            })
        }

        _updateTutorialBox() {
            if(this.elems[this.step].type === "normal") {
                if(this.state.type === "advanced") {
                    this.components._elements.tutorialBox.firstChild.remove();
                    this.components._elements.tutorialBox.appendChild(this.components._elements.tutorialWrapper)
                }
                this.components._elements.tutorialText.textContent = this.elems[this.step].text;
                this.components._elements.tutorialTitle.textContent = this.elems[this.step].title;

            } else {
                this.components._elements.tutorialBox.firstChild.remove();
                this.components._elements.tutorialBox.appendChild(this.elems[this.step].template)
            }

            this.state.type = this.elems[this.step].type;
        }

        _saveCurrentPosition() {
            if (this.options.advancedStorage) {
                window.localStorage.setItem(`tutorial-${this.name}`, this.components._step);
            } else {
                //wrong - has to replace too
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
            let center = this.elems[this.step].node.offsetTop - ((window.innerHeight - (this.components._elements.tutorialBox.offsetHeight + this.components._elements.highlightBox.firstChild.offsetHeight)) /2 )

            window.requestAnimationFrame(stamp => {
                this.options.scrolling.timer = stamp;

                this.__scrollMovement(stamp, center);
            });
        }

        __load() {
            return function handler() {
                window.removeEventListener("load", this.components._eventHandler.load);
                this.start();
            }.bind(this)
        }

        __resize() {
            return function handler() {
                const leftRightBorder = this.elems[this.state._firstStep].node.offsetLeft - this.options.padding.left;
                this.components._elements.highlightBox.classList.add("skip-animation");

                this.components._elements.highlightBox.style.left = leftRightBorder;
                this.components._elements.highlightBox.style.right = leftRightBorder;
                this.components._elements.highlightBox.style.top = this.elems[this.state._firstStep].node.offsetTop - this.options.padding.top;

                this._animateHighlightBox();

                //debounce to remove after 200ms
                this.components._elements.highlightBox.classList.remove("skip-animation");
            }.bind(this);
        }

        __scrollMovement(timeStamp, center) {
            let timeDiff = timeStamp - this.options.scrolling.timer;
            let next = Math.ceil(Util.easeOutQuad(timeDiff, this.options.scrolling.position, center - this.options.scrolling.position, this.options.scrolling.speed));

            window.scrollTo(0, next);

            if (timeDiff < this.options.scrolling.speed) {
                window.requestAnimationFrame(stamp => {
                    this.__scrollMovement(stamp, center);
                });
            } else {
                this.options.scrolling.timer = null;
                this.options.scrolling.position = Math.min(center, document.documentElement.offsetHeight - window.innerHeight);
            }
        }

        static installCustomAction({key = Util.mandatory("Identifier"),event = Util.mandatory("Event")} = {}) {
            Tutorial.actions.custom.push({
                key,
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