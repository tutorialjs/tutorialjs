//v0.0.2

(function (window, document, undefined) {
    "use strict";

    class Util {
        static mandatory(param) {
            throw new Error(`${param} is required.`);
        }
    }

    class Tutorial {
        constructor(
            {
                selector     = "tut-action",
                selectorList = [],
                name         = Util.mandatory("Name"),
                persistent   = false,
                debug        = false
            } = {}) {
                if(selectorList.length > 0) {
                    this.elems = this._queryElementList(selectorList);
                }
                else {
                    this.elems = Array.from(document.getElementsByClassName(selector));

                    if (!this.elems.every(el => el.getAttribute("t-step"))) {
                        throw new Error("Not all steps defined");
                    }
                    else {
                        this.elems.sort((a, b) => {
                            return parseInt(a.getAttribute("t-step")) - parseInt(b.getAttribute("t-step"));
                        });
                    }
                }

                if (this.elems.length === 0) {
                    throw new Error("No activities point defined");
                }
                else {
                    this._reset();

                    this._name = name;
                    this._persistent = persistent;
                    this._advancedStorage = this._checkStorageSupport();
                    this._step = parseInt(this._persistent ? this._getCurrentPosition() || 0 : 0);

                    this.selector = selector;
                    this.debug = debug;
                    this.animate = true;

                    this.animation = {
                        running: false,
                        id: null
                    };

                    this._body = document.getElementsByTagName("body")[0];
                    this._blurElement = this._createBlurElement();
                    [this._tutorialBox, this._tutorialText, this._tutorialPosition] = this._createTutorialBox();
                    this._highlightBox = this._createHighlightBox(this._tutorialBox);

                    Object.defineProperty(this, "step", {
                        get: () => this._step,
                        set: x => {
                            this._step = x;

                            if(this._persistent) {
                                this._saveCurrentPosition();
                            }
                        }
                    });

                    window.addEventListener("resize", () => {
                        this._highlightBox.classList.add("skip-animation");
                        this._animateHighlightBox();

                        clearTimeout(this._resizeTimer);
                        this._resizeTimer = setTimeout(() => {

                            this._highlightBox.classList.remove("skip-animation");

                        }, 200);
                    });
                }
        }

        start() {
            if(this.debug)
                console.log("Tutorial started...");

            if(this.running) {
                console.warn("Tutorial instance already running");
            }
            else {
                this.elems[this.step].classList.add("tutorial-highlight");

                this._body.appendChild(this._blurElement);
                this._body.appendChild(this._highlightBox);

                this._moveHighlightBox();
                this.running = true;
            }
        }

        close() {
            if(!this.running) {
                console.warn("Tutorial is not running");
                return;
            }

            this.elems[this.step].classList.remove("tutorial-highlight");

            this._highlightBox.style.transform = "";
            this._highlightBox.childNodes[0].style.transform = "";

            this._body.removeChild(this._blurElement);
            this._body.removeChild(this._highlightBox);

            this._reset();
        }

        prev() {
            if(!this.running) {
                console.warn("Tutorial is not running");
                return;
            }
            else if(this.animation.running) {
                console.warn("Animation is already running");
                return;
            }

            if(this.debug)
                console.log(`Going to previous element: #${this.step}`);

            //at first step
            if(this.step === 0) {
                //or throw error;
                this.close();
            }
            else {
                this.elems[this.step].classList.remove("tutorial-highlight");
                this.elems[--this.step].classList.add("tutorial-highlight");

                this._moveHighlightBox();
            }

            this._saveCurrentPosition();
        }

        next() {
            if(!this.running) {
                console.warn("Tutorial is not running");
                return;
            }
            else if(this.animation.running) {
                console.warn("Animation is already running");
                return;
            }

            if(this.debug)
                console.log(`Going to next element: #${this.step}`);

            //last step?
            if(this.step === this.elems.length - 1) {
                //or throw error;
                this.close();
            }
            else {
                this.elems[this.step].classList.remove("tutorial-highlight");
                this.elems[++this.step].classList.add("tutorial-highlight");

                this._moveHighlightBox();
            }

            this._saveCurrentPosition();
        }

        //even if is not running?
        goToStep(step) {
            if(!this.running) {
                console.warn("Tutorial is not running.");
                return;
            }
            else if(!this._stepInBounds(step)) {
                throw new Error("Step out of bounds.");
            }
            else if(step === this.step) {
                return;
            }

            this.elems[this.step].classList.remove("tutorial-highlight");
            this.step = step;
            this.elems[this.step].classList.add("tutorial-highlight");
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
            let wrapper   = document.createElement("div");
            let edge      = wrapper.cloneNode(false);
            let content_wrapper = wrapper.cloneNode(false);
            let text      = document.createElement("p");
            let position  = text.cloneNode();
            let buttonbox = wrapper.cloneNode(false);
            let close     = document.createElement("button");
            let back      = document.createElement("a");
            back.href     = "#";
            let next      = back.cloneNode(false);

            wrapper.classList.add("tutorial-box");
            edge.classList.add("tutorial-box-edge");
            content_wrapper.classList.add("tutorial-box-wrapper");
            text.classList.add("tutorial-description");
            position.classList.add("tutorial-step-position");
            buttonbox.classList.add("tutorial-buttons");

            close.textContent = "Close";
            back.textContent = "Back";
            next.textContent = "Next";

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

            buttonbox.appendChild(close);
            buttonbox.appendChild(back);
            buttonbox.appendChild(next);

            content_wrapper.appendChild(text);
            content_wrapper.appendChild(position);
            content_wrapper.appendChild(buttonbox);

            wrapper.appendChild(edge);
            wrapper.appendChild(content_wrapper);

            return [wrapper, text, position];
        }

        _moveHighlightBox() {
            if(this.running && this.animate) {
                this._animateHighlightBox();
            }
            else {
                //remove dup
                let bounds  = this.elems[this.step].getBoundingClientRect();

                this._highlightBox.style.top = bounds.top - 12;
                this._highlightBox.style.left = bounds.left - 12;
                this._highlightBox.childNodes[0].style.height = bounds.bottom - bounds.top + 24;
                this._highlightBox.childNodes[0].style.width  = bounds.width + 24;

                this._tutorialBox.style.top = bounds.height + 30 + "px";
            }

            this._highlightBox.childNodes[1].innerText = this.step + 1;
            this._tutorialPosition.textContent = `${this.step + 1}/${this.elems.length}`;
        }
        _animateHighlightBox() {
            //flip technique
            //https://aerotwist.com/blog/flip-your-animations/
            let first = this._highlightBox.getBoundingClientRect();
            let background = this._highlightBox.childNodes[0].getBoundingClientRect();

            let last  = this.elems[this.step].getBoundingClientRect();

            //let transform = this._getTransformValues(this._highlightBox.style.transform, this._highlightBox.childNodes[0].style.transform);
            this._transform.translateY = (last.top - 12) - (first.top) + this._transform.translateY;
            this._transform.translateX = (last.left - 12) - (first.left) + this._transform.translateX;
            this._transform.scaleY = ((last.height + 24)/(background.height)) + this._transform.scaleY;
            this._transform.scaleX = ((last.width + 24)/(background.width)) + this._transform.scaleX;

            //use transform or not ?
            this._tutorialBox.style.top = last.height + 30 + "px";

            this._highlightBox.style.transform = `translateX(${this._transform.translateX}px) translateY(${this._transform.translateY}px)`;
            this._highlightBox.childNodes[0].style.transform = `scaleX(${this._transform.scaleX}) scaleY(${this._transform.scaleY})`;

            this._transform.scaleY -= 1;
            this._transform.scaleX -= 1;

            this._highlightBox.addEventListener("transitionend", () => {
                this.animation.running = false;
            })
        }

        _queryElementList(list) {
            let nodes = [];
            let node  = null;

            for(let elem of list) {
                //get if getElement gets more than 1 elem
                switch(elem.charAt(0)) {
                    case ".":
                        node = document.getElementsByClassName(elem.substr(1, this.length))[0];
                        break;
                    case "#":
                        node = document.getElementById(elem.substr(1, this.length));
                        break;
                    default:
                        throw new Error("Unknown selector. Please only use id or class.");
                        break;
                }

                nodes.push(node);
            }

            return nodes;
        }

        _checkStorageSupport() {
            try {
                localStorage.setItem("a", 1);
                localStorage.removeItem("a");
                return true;
            } catch(e) {
                return false;
            }
        }

        _saveCurrentPosition() {
            if(this._advancedStorage) {
                window.localStorage.setItem(`tutorial-${this._name}`, this.step);
            }
            else {
                document.cookie += `tutorial-${this._name}=${this.step};`;
            }
        }
        _getCurrentPosition() {
            if(this._advancedStorage) {
                return window.localStorage.getItem(`tutorial-${this._name}`);
            }
            else {
                return document.cookie.split(",")
                    .filter(item => item.includes(`tutorial-${this._name}`))
                    .map(item => parseInt(item.replace(`tutorial-${this._name}=`, "")));
            }
        }
        _reset() {
            this.step = 0;
            this.running = false;

            this._transform = {
                translateY: 0,
                translateX: 0,
                scaleX: 0,
                scaleY: 0
            };
        }
    }

    if (!window.Tutorial) {
        window.Tutorial = Tutorial;
    }
})(window, document);