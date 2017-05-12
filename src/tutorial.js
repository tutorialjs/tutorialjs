/* @flow */

(function (window, document, undefined) {
    class Tutorial {
        constructor(
            {
                selector = "tut-action",
                debug = false
            } = {}) {
                this.elems = Array.from(document.getElementsByClassName(selector));

                if (this.elems.length === 0) {
                    throw new Error("No activities point defined");
                }
                else if (!this.elems.every(el => el.getAttribute("t-step"))) {
                    throw new Error("Not all steps defined");
                }
                else {
                    this.selector = selector;
                    this.debug = debug;
                    this.step = 0;
                    this.running = false;

                    this._body = document.getElementsByTagName("body")[0];
                    this._blurElement = this._createBlurElement();
                    this._highlightBackground = this._createHighlightBackground();

                    this.elems.sort((a, b) => {
                        return parseInt(a.getAttribute("t-step")) - parseInt(b.getAttribute("t-step"));
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
                this._body.appendChild(this._highlightBackground);

                this._moveHighlightBackground();
                this.running = true;
            }
        }

        close() {
            if(!this.running) {
                console.warn("Tutorial is not running");
                return;
            }

            this.elems[this.step].classList.remove("tutorial-highlight");

            this._body.removeChild(this._blurElement);
            this._body.removeChild(this._highlightBackground);

            this.running = false;
            this.step = 0;
        }

        prev() {
            if(!this.running) {
                console.warn("Tutorial is not running");
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

                this._moveHighlightBackground();
            }
        }

        next() {
            if(!this.running) {
                console.warn("Tutorial is not running");
                return;
            }

            if(debug)
                console.log(`Going to next element: #${this.step}`);

            //last step?
            if(this.step === this.elems.length - 1) {
                //or throw error;
                this.close();
            }
            else {
                this.elems[this.step].classList.remove("tutorial-highlight");
                this.elems[++this.step].classList.add("tutorial-highlight");

                this._moveHighlightBackground();
            }
        }

        //even if is not running?
        goToStep(step) {
            if(!this.running) {
                console.warn("Tutorial is not running.");
                return;
            }
            else if(step === this.step) {
                return;
            }
            else if(!this._stepInBounds(step)) {
                throw new Error("Step out of bounds.");
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
            return el;
        }
        _createHighlightBackground() {
            let el = document.createElement("div");
            let index = document.createElement("i");

            index.classList.add("tutorial-index");

            el.classList.add("tutorial-wrapper");
            el.appendChild(index);

            return el;
        }

        _moveHighlightBackground() {
            let bounds = this.elems[this.step].getBoundingClientRect();

            this._highlightBackground.style.top = bounds.top - 12;
            this._highlightBackground.style.left = bounds.left - 12;
            this._highlightBackground.style.height = bounds.bottom - bounds.top + 24;
            this._highlightBackground.style.width  = bounds.width + 24;

            this._highlightBackground.childNodes[0].innerText = this.step + 1;
        }
    }

    if (!window.Tutorial) {
        window.Tutorial = Tutorial;
    }
})(window, document)