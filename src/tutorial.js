//v0.0.1

(function (window, document, undefined) {
    "use strict";

    class Tutorial {
        constructor(
            {
                selector = "tut-action",
                selectorList = [],
                debug = false
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
                    this.selector = selector;
                    this.debug = debug;
                    this.step = 0;
                    this.animate = true;
                    this.running = false;

                    this.animation = {
                        running: false,
                        id: null
                    };

                    this._body = document.getElementsByTagName("body")[0];
                    this._blurElement = this._createBlurElement();
                    this._highlightBox = this._createHighlightBox();
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

            this._body.removeChild(this._blurElement);
            this._body.removeChild(this._highlightBox);

            this.running = false;
            this.step = 0;
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
        _createHighlightBox() {
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

            return el;
        }
        _createTutorialBox() {
            let box = document.createElement("div");
        }

        _moveHighlightBox() {
            if(this.running && this.animate) {
                this._animateHighlightBox()
            }
            else {
                //remove dup
                let bounds  = this.elems[this.step].getBoundingClientRect();

                this._highlightBox.style.top = bounds.top - 12;
                this._highlightBox.style.left = bounds.left - 12;
                this._highlightBox.childNodes[0].style.height = bounds.bottom - bounds.top + 24;
                this._highlightBox.childNodes[0].style.width  = bounds.width + 24;
            }

            this._highlightBox.childNodes[1].innerText = this.step + 1;
        }
        _animateHighlightBox() {
            //flip technique
            //https://aerotwist.com/blog/flip-your-animations/
            let first = this._highlightBox.getBoundingClientRect();
            let background = this._highlightBox.childNodes[0].getBoundingClientRect();

            let last  = this.elems[this.step].getBoundingClientRect();

            let transform = this._getTransformValues(this._highlightBox.style.transform, this._highlightBox.childNodes[0].style.transform);

            let invertY = (last.top - 12) - (first.top) + transform.translateY;
            let invertX = (last.left - 12) - (first.left) + transform.translateX;
            let scaleY = ((last.height + 24)/(background.height)) + transform.scaleY;
            let scaleX = ((last.width + 24)/(background.width)) + transform.scaleX;

            this._highlightBox.style.transform = `translateX(${invertX}px) translateY(${invertY}px)`;
            this._highlightBox.childNodes[0].style.transform = `scaleX(${scaleX}) scaleY(${scaleY})`;

            this._highlightBox.addEventListener("transitioned", () => {
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
        _getTransformValues(transform, childTransform) {
            let extracted = {};

            if(transform === "") {
                extracted = {
                    translateY: 0,
                    translateX: 0,
                    scaleX: 0,
                    scaleY: 0
                }
            }
            else {
                let parent = transform.split(" ");
                let child  = childTransform.split(" ");

                extracted = {
                    translateX: parseFloat(parent[0].substr(11, this.length).replace("px)", "")),
                    translateY: parseFloat(parent[1].substr(11, this.length).replace("px)", "")),
                    scaleX: parseFloat(child[0].substr(7, this.length).replace("px)", "")) - 1,
                    scaleY: parseFloat(child[1].substr(7, this.length).replace("px)", "")) - 1
                }
            }

            return extracted;
        }
    }

    if (!window.Tutorial) {
        window.Tutorial = Tutorial;
    }
})(window, document)