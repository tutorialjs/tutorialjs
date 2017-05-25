"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//v0.0.3

(function (window, document, undefined) {
    "use strict";

    var Util = function () {
        function Util() {
            _classCallCheck(this, Util);
        }

        _createClass(Util, null, [{
            key: "mandatory",
            value: function mandatory(param) {
                throw new Error(param + " is required.");
            }

            //https://github.com/jaxgeller/ez.js

        }, {
            key: "easeOutQuad",
            value: function easeOutQuad(t, b, c, d) {
                return -c * (t /= d) * (t - 2) + b;
            }
        }]);

        return Util;
    }();

    var Tutorial = function () {
        function Tutorial(_ref) {
            var _this = this;

            var _ref$selector = _ref.selector,
                selector = _ref$selector === undefined ? "tut-action" : _ref$selector,
                _ref$steps = _ref.steps,
                steps = _ref$steps === undefined ? [] : _ref$steps,
                _ref$name = _ref.name,
                name = _ref$name === undefined ? Util.mandatory("Name") : _ref$name,
                _ref$persistent = _ref.persistent,
                persistent = _ref$persistent === undefined ? false : _ref$persistent,
                _ref$buttons = _ref.buttons,
                buttons = _ref$buttons === undefined ? {} : _ref$buttons,
                _ref$padding = _ref.padding,
                padding = _ref$padding === undefined ? {} : _ref$padding,
                _ref$debug = _ref.debug,
                debug = _ref$debug === undefined ? false : _ref$debug,
                _ref$autoplay = _ref.autoplay,
                autoplay = _ref$autoplay === undefined ? false : _ref$autoplay,
                _ref$scrollSpeed = _ref.scrollSpeed,
                scrollSpeed = _ref$scrollSpeed === undefined ? 500 : _ref$scrollSpeed;

            _classCallCheck(this, Tutorial);

            if (steps.length > 0) {
                this.elems = this._queryElementList(steps);
                this.title = steps.map(function (item) {
                    return item.title;
                });
                this.text = steps.map(function (item) {
                    return item.text;
                });
            } else {
                this.elems = Array.from(document.getElementsByClassName(selector));

                if (!this.elems.every(function (el) {
                    return el.getAttribute("t-step");
                }) || !this.elems.every(function (el) {
                    return el.getAttribute("t-text");
                })) {
                    throw new Error("Not all steps defined");
                } else {
                    this.elems.sort(function (a, b) {
                        return parseInt(a.getAttribute("t-step")) - parseInt(b.getAttribute("t-step"));
                    });
                    this.text = this.elems.map(function (item) {
                        return item.getAttribute("t-text");
                    });
                }
            }

            if (this.elems.length === 0) {
                throw new Error("No activities point defined");
            } else {
                this._reset();

                this._name = name;
                this._persistent = persistent;
                this._advancedStorage = this._checkStorageSupport();
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
                //this._basePosition = this.elems[0].getBoundingClientRect();

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

                var _createTutorialBox2 = this._createTutorialBox();

                var _createTutorialBox3 = _slicedToArray(_createTutorialBox2, 4);

                this._tutorialBox = _createTutorialBox3[0];
                this._tutorialTitle = _createTutorialBox3[1];
                this._tutorialText = _createTutorialBox3[2];
                this._tutorialPosition = _createTutorialBox3[3];

                this._highlightBox = this._createHighlightBox(this._tutorialBox);

                Object.defineProperty(this, "step", {
                    get: function get() {
                        return _this._step;
                    },
                    set: function set(x) {
                        _this._step = x;

                        if (_this._persistent) {
                            _this._saveCurrentPosition();
                        }
                    }
                });

                if (autoplay) {
                    window.addEventListener("load", this._eventHandler.load);
                }
            }
        }

        _createClass(Tutorial, [{
            key: "start",
            value: function start() {
                if (this.debug) console.log("Tutorial started...");

                if (this.running) {
                    console.warn("Tutorial instance already running");
                } else {
                    this.elems[this.step].classList.add("tutorial-highlight");

                    this._body.appendChild(this._blurElement);
                    this._body.appendChild(this._highlightBox);

                    this._moveHighlightBox();
                    this._updateTitle();
                    this._updateText();

                    this.running = true;

                    window.addEventListener("resize", this._eventHandler.resize);
                }
            }
        }, {
            key: "close",
            value: function close() {
                if (!this.running) {
                    console.warn("Tutorial is not running");
                    return;
                }

                this.elems[this.step].classList.remove("tutorial-highlight");

                this._highlightBox.style.transform = "";
                this._highlightBox.childNodes[0].style.transform = "";

                this._body.removeChild(this._blurElement);
                this._body.removeChild(this._highlightBox);

                window.removeEventListener("resize", this._eventHandler.resize);
                this._reset();
            }
        }, {
            key: "prev",
            value: function prev() {
                if (!this.running) {
                    console.warn("Tutorial is not running");
                    return;
                } else if (this.animating) {
                    console.warn("Animation is already running");
                    return;
                }

                if (this.debug) console.log("Going to previous element: #" + this.step);

                //at first step
                if (this.step === 0) {
                    //or throw error;
                    this.close();
                } else {
                    this.elems[this.step].classList.remove("tutorial-highlight");
                    this.elems[--this.step].classList.add("tutorial-highlight");

                    this._moveHighlightBox();
                }

                this._updateTitle();
                this._updateText();
                this._saveCurrentPosition();
            }
        }, {
            key: "next",
            value: function next() {
                if (!this.running) {
                    console.warn("Tutorial is not running");
                    return;
                } else if (this.animating) {
                    console.warn("Animation is already running");
                    return;
                }

                if (this.debug) console.log("Going to next element: #" + this.step);

                //last step?
                if (this.step === this.elems.length - 1) {
                    //or throw error;
                    this.close();
                } else {
                    this.elems[this.step].classList.remove("tutorial-highlight");
                    this.elems[++this.step].classList.add("tutorial-highlight");

                    this._moveHighlightBox();
                }

                this._updateTitle();
                this._updateText();
                this._saveCurrentPosition();
            }

            //even if is not running?

        }, {
            key: "goToStep",
            value: function goToStep(step) {
                if (!this.running) {
                    console.warn("Tutorial is not running.");
                    return;
                } else if (!this._stepInBounds(step)) {
                    throw new Error("Step out of bounds.");
                } else if (step === this.step) {
                    return;
                }

                this.elems[this.step].classList.remove("tutorial-highlight");
                this.step = step;
                this.elems[this.step].classList.add("tutorial-highlight");
            }
        }, {
            key: "_stepInBounds",
            value: function _stepInBounds(step) {
                return step >= 0 && step < this.elems.length;
            }
        }, {
            key: "_createBlurElement",
            value: function _createBlurElement() {
                var _this2 = this;

                var el = document.createElement("div");
                el.classList.add("tutorial-blur");

                el.onclick = function () {
                    _this2.close();
                };

                return el;
            }
        }, {
            key: "_createHighlightBox",
            value: function _createHighlightBox(tutorialBox) {
                var el = document.createElement("div");
                var background = document.createElement("div");
                var index = document.createElement("i");

                el.classList.add("tutorial-wrapper");
                background.classList.add("tutorial-background");
                index.classList.add("tutorial-index");

                el.onlick = function (e) {
                    e.preventPropagation();
                };

                el.appendChild(background);
                el.appendChild(index);
                el.appendChild(tutorialBox);

                return el;
            }
        }, {
            key: "_createTutorialBox",
            value: function _createTutorialBox() {
                var _this3 = this;

                var wrapper = document.createElement("div");
                var content_wrapper = wrapper.cloneNode(false);
                var title = document.createElement("p");
                var text = document.createElement("p");
                var position = text.cloneNode();
                var buttonbox = wrapper.cloneNode(false);
                var buttonbox_wrapper = wrapper.cloneNode(false);
                var back = document.createElement("a");
                back.href = "#";
                var next = back.cloneNode(false);
                var close = back.cloneNode(false);

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

                close.onclick = function (e) {
                    e.preventDefault();

                    _this3.close();
                };
                back.onclick = function (e) {
                    e.preventDefault();

                    _this3.prev();
                };

                next.onclick = function (e) {
                    e.preventDefault();

                    _this3.next();
                };

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
        }, {
            key: "_moveHighlightBox",
            value: function _moveHighlightBox() {
                if (this.running && this.animate) {
                    this.animating = true;
                    this._animateHighlightBox();
                } else {
                    //remove dup
                    var bounds = this.elems[this.step].getBoundingClientRect();

                    this._highlightBox.style.top = bounds.top - this._padding.top + window.scrollY;
                    this._highlightBox.style.left = bounds.left - this._padding.left + window.scrollX;
                    this._highlightBox.childNodes[0].style.height = bounds.bottom - bounds.top + 2 * this._padding.top;
                    this._highlightBox.childNodes[0].style.width = bounds.width + 2 * this._padding.left;

                    this._tutorialBox.style.top = bounds.height + 2 * this._padding.top + 6 + "px";
                }

                this._highlightBox.childNodes[1].textContent = this.step + 1;
                //this._tutorialPosition.textContent = `${this.step + 1}/${this.elems.length}`;
            }
        }, {
            key: "_animateHighlightBox",
            value: function _animateHighlightBox() {
                var _this4 = this;

                //flip technique
                //https://aerotwist.com/blog/flip-your-animations/
                var first = this.elems[0]; //.getBoundingClientRect();//_util.baseBoundings;//Util.getElementDimensions(this.elems[0]); //.getBoundingClientRect();
                var last = this.elems[this.step]; //.getBoundingClientRect();
                //let cur   = this._highlightBox.getBoundingClientRect();

                this._transform.translateY = last.offsetTop - first.offsetTop;
                this._transform.translateX = last.offsetLeft - first.offsetLeft;
                //this._transform.scaleY = ((last.height + 24)/(first.height + 24));
                //this._transform.scaleX = ((last.width + 24)/(first.width + 24));

                //use transform or not ?
                this._tutorialBox.style.top = last.offsetHeight + 2 * this._padding.top + 6 + "px";

                this._highlightBox.style.transform = "translateX(" + this._transform.translateX + "px) translateY(" + this._transform.translateY + "px)";
                //this._highlightBox.childNodes[0].style.transform = `scaleX(${this._transform.scaleX}) scaleY(${this._transform.scaleY})`;
                this._highlightBox.childNodes[0].style.width = last.offsetWidth + 2 * this._padding.top;
                this._highlightBox.childNodes[0].style.height = last.offsetHeight + 2 * this._padding.top;

                window.requestAnimationFrame(function (nextTime) {
                    _this4._scroll(nextTime);
                });

                this._highlightBox.addEventListener("transitionend", function () {
                    _this4.animating = false;
                });
            }
        }, {
            key: "_updateText",
            value: function _updateText() {
                this._tutorialText.textContent = this.text[this.step];
            }
        }, {
            key: "_updateTitle",
            value: function _updateTitle() {
                this._tutorialTitle.textContent = this.title[this.step];
            }
        }, {
            key: "_queryElementList",
            value: function _queryElementList(list) {
                var nodes = [];
                var node = null;

                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = list[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var elem = _step.value;

                        //get if getElement gets more than 1 elem
                        switch (elem.highlight.charAt(0)) {
                            case ".":
                                node = document.getElementsByClassName(elem.highlight.substr(1, this.length))[0];
                                break;
                            case "#":
                                node = document.getElementById(elem.highlight.substr(1, this.length));
                                break;
                            default:
                                throw new Error("Unknown selector. Please only use id or class.");
                                break;
                        }

                        nodes.push(node);
                    }
                } catch (err) {
                    _didIteratorError = true;
                    _iteratorError = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion && _iterator.return) {
                            _iterator.return();
                        }
                    } finally {
                        if (_didIteratorError) {
                            throw _iteratorError;
                        }
                    }
                }

                return nodes;
            }
        }, {
            key: "_checkStorageSupport",
            value: function _checkStorageSupport() {
                try {
                    localStorage.setItem("a", 1);
                    localStorage.removeItem("a");
                    return true;
                } catch (e) {
                    return false;
                }
            }
        }, {
            key: "_saveCurrentPosition",
            value: function _saveCurrentPosition() {
                if (this._advancedStorage) {
                    window.localStorage.setItem("tutorial-" + this._name, this.step);
                } else {
                    document.cookie += "tutorial-" + this._name + "=" + this.step + ";";
                }
            }
        }, {
            key: "_getCurrentPosition",
            value: function _getCurrentPosition() {
                var _this5 = this;

                if (this._advancedStorage) {
                    return window.localStorage.getItem("tutorial-" + this._name);
                } else {
                    return document.cookie.split(",").filter(function (item) {
                        return item.includes("tutorial-" + _this5._name);
                    }).map(function (item) {
                        return parseInt(item.replace("tutorial-" + _this5._name + "=", ""));
                    });
                }
            }
        }, {
            key: "_scroll",
            value: function _scroll(timeStamp) {
                var _this6 = this;

                var boxBounds = {
                    top: this._tutorialBox.offsetTop,
                    height: this._tutorialBox.offsetHeight
                };
                var curElement = {
                    top: this.elems[this.step].offsetTop,
                    height: this.elems[this.step].offsetHeight
                };

                if (!this._scrolling.timer) {
                    this._scrolling.timer = timeStamp;
                    this._scrolling.position = window.scrollY;
                }

                var timeDiff = timeStamp - this._scrolling.timer;
                var bottom = curElement.top + curElement.height + boxBounds.height + this._padding.top * 2;

                var next = Math.ceil(Util.easeOutQuad(timeDiff, this._scrolling.position, bottom - window.innerHeight - this._scrolling.position, this._scrolling.speed));

                if (next < 0) {
                    this._scrolling.timer = null;
                    return;
                }

                if (bottom !== window.innerHeight + window.scrollY) {
                    window.scrollTo(0, next);
                }

                if (timeDiff < this._scrolling.speed) {
                    window.requestAnimationFrame(function (nextTime) {
                        _this6._scroll(nextTime);
                    });
                } else {
                    this._scrolling.timer = null;
                }
            }
        }, {
            key: "_reset",
            value: function _reset() {
                this.step = 0;
                this.running = false;

                this._transform = {
                    translateY: 0,
                    translateX: 0 //,
                    //scaleX: 0,
                    //scaleY: 0
                };
            }
        }, {
            key: "__load",
            value: function __load() {
                return function handler() {
                    window.removeEventListener("load", this._eventHandler.load);
                    this.start();
                }.bind(this);
            }
        }, {
            key: "__resize",
            value: function __resize() {
                return function handler() {
                    this._highlightBox.classList.add("skip-animation");

                    this._highlightBox.style.left = this.elems[0].offsetLeft - this._padding.left;
                    this._highlightBox.style.top = this.elems[0].offsetTop - this._padding.top;

                    this._animateHighlightBox();

                    //debounce to remove after 200ms
                    this._highlightBox.classList.remove("skip-animation");
                }.bind(this);
            }
        }]);

        return Tutorial;
    }();

    if (!window.Tutorial) {
        window.Tutorial = Tutorial;
    }
})(window, document);