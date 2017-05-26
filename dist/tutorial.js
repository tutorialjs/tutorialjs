"use strict";

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//v0.1.0

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
        }, {
            key: "checkStorageSupport",
            value: function checkStorageSupport() {
                try {
                    localStorage.setItem("a", 1);
                    localStorage.removeItem("a");
                    return true;
                } catch (e) {
                    return false;
                }
            }
        }, {
            key: "getElementBounds",
            value: function getElementBounds(el) {
                return {
                    top: el.offsetTop,
                    left: el.offsetLeft,
                    bottom: el.offsetTop + el.offsetHeight,
                    width: el.offsetWidth,
                    height: el.offsetHeight
                };
            }
        }]);

        return Util;
    }();

    var Step = function Step(node, text, _ref) {
        var _ref$title = _ref.title,
            title = _ref$title === undefined ? "" : _ref$title,
            _ref$callback = _ref.callback,
            callback = _ref$callback === undefined ? {} : _ref$callback;

        _classCallCheck(this, Step);

        this.type = "normal";
        this.node = node;
        this.text = text;
        this.title = title;

        if (!Object.keys(callback).length && typeof callback !== "function") {
            this.callback = function () {};
        } else if (callback.once) {
            this.callback = function () {
                if (this.run) {
                    return;
                }

                callback.fn();
                this.run = true;
            };
        } else {
            this.callback = callback.fn || callback;
        }
    };

    var ActionStep = function ActionStep(htmlId) {
        _classCallCheck(this, ActionStep);

        this.type = "advanced";
        this.html = document.getElementById(htmlId.substr(1)).childNodes;
    };

    var Tutorial = function () {
        function Tutorial() {
            var _this = this;

            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Util.mandatory("Name");
            var _ref2 = arguments[1];
            var _ref2$selector = _ref2.selector,
                selector = _ref2$selector === undefined ? "tut-action" : _ref2$selector,
                _ref2$steps = _ref2.steps,
                steps = _ref2$steps === undefined ? [] : _ref2$steps,
                _ref2$persistent = _ref2.persistent,
                persistent = _ref2$persistent === undefined ? false : _ref2$persistent,
                _ref2$buttons = _ref2.buttons,
                buttons = _ref2$buttons === undefined ? {} : _ref2$buttons,
                _ref2$padding = _ref2.padding,
                padding = _ref2$padding === undefined ? {} : _ref2$padding,
                _ref2$debug = _ref2.debug,
                debug = _ref2$debug === undefined ? false : _ref2$debug,
                _ref2$autoplay = _ref2.autoplay,
                autoplay = _ref2$autoplay === undefined ? false : _ref2$autoplay,
                _ref2$scrollSpeed = _ref2.scrollSpeed,
                scrollSpeed = _ref2$scrollSpeed === undefined ? 500 : _ref2$scrollSpeed;

            _classCallCheck(this, Tutorial);

            this.elems = [];

            if (steps.length > 0) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = steps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var step = _step.value;

                        if (step.hasOwnProperty("action")) {
                            //create advanced tutorial
                            new ActionStep(step.highlight);
                        } else {
                            this.elems.push(this._createTutorialSteps(step));
                        }
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
            } else {
                var elems = Array.from(document.getElementsByClassName(selector));

                if (!elems.every(function (el) {
                    return el.getAttribute("t-step");
                }) || !elems.every(function (el) {
                    return el.getAttribute("t-text");
                })) {
                    throw new Error("Not all steps or texts defined");
                } else {
                    elems.sort(function (a, b) {
                        return parseInt(a.getAttribute("t-step")) - parseInt(b.getAttribute("t-step"));
                    });
                    this.elems = elems.map(function (item) {
                        return new Step(item, item.getAttribute("t-text"), {
                            title: item.getAttribute("t-title")
                        });
                    });
                }
            }

            if (this.elems.length === 0) {
                throw new Error("No activities point defined");
            } else {
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
                    this.elems[this.step].node.classList.add("tutorial-highlight");

                    this._body.appendChild(this._blurElement);
                    this._body.appendChild(this._highlightBox);

                    this._moveHighlightBox();
                    this._updateTutorialBox();

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

                this.elems[this.step].node.classList.remove("tutorial-highlight");

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
                    this.close();
                    return;
                } else {
                    this.elems[this.step].node.classList.remove("tutorial-highlight");
                    this.elems[--this.step].node.classList.add("tutorial-highlight");

                    this._moveHighlightBox();
                }

                this._updateTutorialBox();
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

                this.elems[this.step].node.classList.remove("tutorial-highlight");
                this.step = step;
                this.elems[this.step].node.classList.add("tutorial-highlight");
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
                    var bounds = Util.getElementBounds(this.elems[this.step].node);

                    this._highlightBox.style.top = bounds.top - this._padding.top;
                    this._highlightBox.style.left = bounds.left - this._padding.left;
                    this._highlightBox.childNodes[0].style.height = bounds.bottom - bounds.top + 2 * this._padding.top;
                    this._highlightBox.childNodes[0].style.width = bounds.width + 2 * this._padding.left;

                    this._tutorialBox.style.top = bounds.height + 2 * this._padding.top + 6 + "px";
                }

                this._highlightBox.childNodes[1].textContent = this.step + 1;
            }
        }, {
            key: "_animateHighlightBox",
            value: function _animateHighlightBox() {
                var _this4 = this;

                //flip technique
                //https://aerotwist.com/blog/flip-your-animations/
                var first = this.elems[0].node;
                var last = this.elems[this.step].node;

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
            key: "_updateTutorialBox",
            value: function _updateTutorialBox() {
                this._tutorialText.textContent = this.elems[this.step].text;
                this._tutorialTitle.textContent = this.elems[this.step].title;
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

                var boxBounds = Util.getElementBounds(this._tutorialBox);
                var curElement = Util.getElementBounds(this.elems[this.step].node);

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
            key: "_createTutorialSteps",
            value: function _createTutorialSteps(elem) {
                var node = null;

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

                if (!node) {
                    throw new Error("Selector " + elem.highlight + " not found.");
                }

                return new Step(node, elem.text, {
                    title: elem.title,
                    callback: elem.callback
                });
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

                    this._highlightBox.style.left = this.elems[0].node.offsetLeft - this._padding.left;
                    this._highlightBox.style.top = this.elems[0].node.offsetTop - this._padding.top;

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