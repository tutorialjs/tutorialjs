"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

    var Step = function Step(node, callback) {
        _classCallCheck(this, Step);

        this.node = node;

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

    var NormalStep = function (_Step) {
        _inherits(NormalStep, _Step);

        function NormalStep(node, text) {
            var _ref = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref$title = _ref.title,
                title = _ref$title === undefined ? "" : _ref$title,
                _ref$callback = _ref.callback,
                callback = _ref$callback === undefined ? {} : _ref$callback;

            _classCallCheck(this, NormalStep);

            var _this = _possibleConstructorReturn(this, (NormalStep.__proto__ || Object.getPrototypeOf(NormalStep)).call(this, node, callback));

            _this.type = "normal";
            _this.text = text;
            _this.title = title;

            if (!Object.keys(callback).length && typeof callback !== "function") {
                _this.callback = function () {};
            } else if (callback.once) {
                _this.callback = function () {
                    if (this.run) {
                        return;
                    }

                    callback.fn();
                    this.run = true;
                };
            } else {
                _this.callback = callback.fn || callback;
            }
            return _this;
        }

        return NormalStep;
    }(Step);

    var ActionStep = function (_Step2) {
        _inherits(ActionStep, _Step2);

        function ActionStep(node, htmlId) {
            var _ref2 = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {},
                _ref2$callback = _ref2.callback,
                callback = _ref2$callback === undefined ? {} : _ref2$callback;

            _classCallCheck(this, ActionStep);

            var _this2 = _possibleConstructorReturn(this, (ActionStep.__proto__ || Object.getPrototypeOf(ActionStep)).call(this, node, callback));

            _this2.type = "advanced";
            _this2.template = document.getElementById(htmlId.substr(1)).childNodes[0].data;
            return _this2;
        }

        return ActionStep;
    }(Step);

    var Tutorial = function () {
        function Tutorial() {
            var _this3 = this;

            var name = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : Util.mandatory("Name");
            var _ref3 = arguments[1];
            var _ref3$selector = _ref3.selector,
                selector = _ref3$selector === undefined ? "tut-action" : _ref3$selector,
                _ref3$steps = _ref3.steps,
                steps = _ref3$steps === undefined ? [] : _ref3$steps,
                _ref3$persistent = _ref3.persistent,
                persistent = _ref3$persistent === undefined ? false : _ref3$persistent,
                _ref3$buttons = _ref3.buttons,
                buttons = _ref3$buttons === undefined ? {} : _ref3$buttons,
                _ref3$padding = _ref3.padding,
                padding = _ref3$padding === undefined ? {} : _ref3$padding,
                _ref3$debug = _ref3.debug,
                debug = _ref3$debug === undefined ? false : _ref3$debug,
                _ref3$autoplay = _ref3.autoplay,
                autoplay = _ref3$autoplay === undefined ? false : _ref3$autoplay,
                _ref3$scrollSpeed = _ref3.scrollSpeed,
                scrollSpeed = _ref3$scrollSpeed === undefined ? 800 : _ref3$scrollSpeed,
                _ref3$animate = _ref3.animate,
                animate = _ref3$animate === undefined ? true : _ref3$animate,
                _ref3$progressbar = _ref3.progressbar,
                progressbar = _ref3$progressbar === undefined ? false : _ref3$progressbar;

            _classCallCheck(this, Tutorial);

            this.elems = [];

            if (steps.length > 0) {
                var _iteratorNormalCompletion = true;
                var _didIteratorError = false;
                var _iteratorError = undefined;

                try {
                    for (var _iterator = steps[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
                        var step = _step.value;

                        var node = document.querySelector(step.highlight);

                        if (!node) {
                            throw new Error("Selector " + step.highlight + " not found.");
                        }

                        if (step.hasOwnProperty("action")) {
                            var action = new ActionStep(node, step.action.template);

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
                        previous: buttons.previous === undefined ? 'Back' : buttons.previous,
                        next: buttons.next === undefined ? 'Next' : buttons.next
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
                    _elements: _extends({
                        blur: this._createBlurElement()
                    }, this._createTutorialBox())
                };
                this.components._elements.highlightBox = this._createHighlightBox(this.components._elements.tutorialBox);

                if (progressbar) {
                    this.components._elements.progressBar = this._createProgressbar();
                }

                this._reset();

                Object.defineProperty(this, "step", {
                    get: function get() {
                        return _this3.components._step;
                    },
                    set: function set(x) {
                        _this3.components._step = x;

                        if (_this3.options.persistent) {
                            _this3._saveCurrentPosition();
                        }
                    }
                });

                if (autoplay) {
                    window.addEventListener("load", this.components._eventHandler.load);
                }
            }
        }

        _createClass(Tutorial, [{
            key: "start",
            value: function start() {
                if (this.options.debug) console.log("Tutorial started...");

                if (this.state.running) {
                    console.warn("Tutorial instance already running");
                } else {
                    this.elems[this.step].node.classList.add("tutorial-highlight");

                    document.body.appendChild(this.components._elements.blur);
                    document.body.appendChild(this.components._elements.highlightBox);
                    document.body.appendChild(this.components._elements.progressBar);

                    this._moveHighlightBox();
                    this._updateTutorialBox();
                    this._updateProgressBar();

                    this.state.running = true;

                    window.addEventListener("resize", this.components._eventHandler.resize);
                }
            }
        }, {
            key: "close",
            value: function close() {
                if (!this.state.running) {
                    console.warn("Tutorial is not running");
                    return;
                }

                this.elems[this.step].node.classList.remove("tutorial-highlight");

                this.components._elements.highlightBox.style.transform = "";
                this.components._elements.highlightBox.childNodes[0].style.transform = "";

                document.body.removeChild(this.components._elements.blur);
                document.body.removeChild(this.components._elements.highlightBox);
                document.body.removeChild(this.components._elements.progressBar);

                window.removeEventListener("resize", this.components._eventHandler.resize);
                this._reset();
            }
        }, {
            key: "prev",
            value: function prev() {
                if (!this.state.running) {
                    console.warn("Tutorial is not running");
                    return;
                } else if (this.animating) {
                    console.warn("Animation is already running");
                    return;
                }

                if (this.options.debug) console.log("Going to previous element: #" + this.step);

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
                this._updateProgressBar();
            }
        }, {
            key: "next",
            value: function next() {
                if (!this.state.running) {
                    console.warn("Tutorial is not running");
                    return;
                } else if (this.animating) {
                    console.warn("Animation is already running");
                    return;
                }

                if (this.options.debug) console.log("Going to next element: #" + this.step);

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
                this._updateProgressBar();
            }
        }, {
            key: "goToStep",
            value: function goToStep(step) {
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

                this._moveHighlightBox();
                this._updateTutorialBox();
                this._updateProgressBar();
            }
        }, {
            key: "_parseAdvancedStep",
            value: function _parseAdvancedStep(step) {
                var _this4 = this;

                var wrapper = document.createElement("div");
                var attr = Tutorial.actions.baseAttributes;
                var custom = Tutorial.actions.custom;

                wrapper.insertAdjacentHTML("afterbegin", step.template);

                var _iteratorNormalCompletion2 = true;
                var _didIteratorError2 = false;
                var _iteratorError2 = undefined;

                try {
                    for (var _iterator2 = wrapper.getElementsByTagName("*")[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
                        var elem = _step2.value;
                        var _iteratorNormalCompletion3 = true;
                        var _didIteratorError3 = false;
                        var _iteratorError3 = undefined;

                        try {
                            var _loop = function _loop() {
                                var mod = _step3.value;


                                if (Array.from(elem.attributes).some(function (item) {
                                    return item.name.includes(mod[0]);
                                })) {
                                    elem.addEventListener("click", function () {
                                        mod[1].call(_this4);
                                    });
                                }
                            };

                            for (var _iterator3 = Object.entries(attr)[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
                                _loop();
                            }
                        } catch (err) {
                            _didIteratorError3 = true;
                            _iteratorError3 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion3 && _iterator3.return) {
                                    _iterator3.return();
                                }
                            } finally {
                                if (_didIteratorError3) {
                                    throw _iteratorError3;
                                }
                            }
                        }

                        var _iteratorNormalCompletion4 = true;
                        var _didIteratorError4 = false;
                        var _iteratorError4 = undefined;

                        try {
                            for (var _iterator4 = custom[Symbol.iterator](), _step4; !(_iteratorNormalCompletion4 = (_step4 = _iterator4.next()).done); _iteratorNormalCompletion4 = true) {
                                var evt = _step4.value;
                                var _iteratorNormalCompletion5 = true;
                                var _didIteratorError5 = false;
                                var _iteratorError5 = undefined;

                                try {
                                    var _loop2 = function _loop2() {
                                        var cattr = _step5.value;

                                        if (cattr.name.includes(evt.key)) {
                                            elem.addEventListener(evt.event, function () {
                                                window[cattr.value]();
                                            });
                                        }
                                    };

                                    for (var _iterator5 = Array.from(elem.attributes)[Symbol.iterator](), _step5; !(_iteratorNormalCompletion5 = (_step5 = _iterator5.next()).done); _iteratorNormalCompletion5 = true) {
                                        _loop2();
                                    }
                                } catch (err) {
                                    _didIteratorError5 = true;
                                    _iteratorError5 = err;
                                } finally {
                                    try {
                                        if (!_iteratorNormalCompletion5 && _iterator5.return) {
                                            _iterator5.return();
                                        }
                                    } finally {
                                        if (_didIteratorError5) {
                                            throw _iteratorError5;
                                        }
                                    }
                                }
                            }
                        } catch (err) {
                            _didIteratorError4 = true;
                            _iteratorError4 = err;
                        } finally {
                            try {
                                if (!_iteratorNormalCompletion4 && _iterator4.return) {
                                    _iterator4.return();
                                }
                            } finally {
                                if (_didIteratorError4) {
                                    throw _iteratorError4;
                                }
                            }
                        }
                    }
                } catch (err) {
                    _didIteratorError2 = true;
                    _iteratorError2 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion2 && _iterator2.return) {
                            _iterator2.return();
                        }
                    } finally {
                        if (_didIteratorError2) {
                            throw _iteratorError2;
                        }
                    }
                }

                return wrapper;
            }
        }, {
            key: "_stepInBounds",
            value: function _stepInBounds(step) {
                return step >= 0 && step < this.elems.length;
            }
        }, {
            key: "_createBlurElement",
            value: function _createBlurElement() {
                var _this5 = this;

                var el = document.createElement("div");
                el.classList.add("tutorial-blur");

                el.addEventListener("click", function (e) {
                    _this5.close();
                });

                return el;
            }
        }, {
            key: "_createHighlightBox",
            value: function _createHighlightBox(tutorialBox) {
                var el = document.createElement("div");
                var background = el.cloneNode();
                var index = document.createElement("i");

                el.classList.add("tutorial-wrapper");
                background.classList.add("tutorial-background");
                index.classList.add("tutorial-index");

                el.addEventListener("click", function (e) {
                    e.stopPropagation();
                });

                el.appendChild(background);
                el.appendChild(index);
                el.appendChild(tutorialBox);

                return el;
            }
        }, {
            key: "_createTutorialBox",
            value: function _createTutorialBox() {
                var _this6 = this;

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

                back.textContent = this.options.buttons.previous;
                next.textContent = this.options.buttons.next;

                close.addEventListener("click", function (e) {
                    _this6.close();
                }, false);
                back.addEventListener("click", function (e) {
                    _this6.prev();
                }, false);
                next.addEventListener("click", function (e) {
                    _this6.next();
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
        }, {
            key: "_createProgressbar",
            value: function _createProgressbar() {
                var progressBarWrapper = document.createElement("div");
                var stepList = document.createElement("ul");
                var progressTrack = document.createElement("div");
                var currentProgressTrack = document.createElement("span");

                progressBarWrapper.classList.add("progressbar-wrapper");
                progressTrack.classList.add("progressbar-track");

                for (var step = 0; step <= this.elems.length - 1; step++) {
                    var currentStep = document.createElement("li");
                    var currentStepText = document.createElement("span");
                    currentStepText.textContent = step + 1;
                    currentStep.appendChild(currentStepText);
                    currentStep.style.left = 100 / (this.elems.length - 1) * step + '%';
                    stepList.appendChild(currentStep);
                }

                progressTrack.appendChild(currentProgressTrack);
                progressBarWrapper.appendChild(progressTrack);
                progressBarWrapper.appendChild(stepList);

                return progressBarWrapper;
            }
        }, {
            key: "_updateProgressBar",
            value: function _updateProgressBar() {

                var progressTrack = this.components._elements.progressBar.childNodes[0].childNodes[0];

                progressTrack.style.width = 100 / (this.elems.length - 1) * this.step + '%';

                for (var i = 0; i <= this.elems.length - 1; i++) {
                    this.components._elements.progressBar.childNodes[1].childNodes[i].classList.remove("active");
                }

                for (var j = 0; j <= this.step - 1; j++) {
                    this.components._elements.progressBar.childNodes[1].childNodes[j].classList.add("finished");
                }

                if (!(this.step === this.elems.length - 1)) {
                    this.components._elements.progressBar.childNodes[1].childNodes[this.step + 1].classList.remove("active");
                    this.components._elements.progressBar.childNodes[1].childNodes[this.step].classList.remove("finished");
                }
                this.components._elements.progressBar.childNodes[1].childNodes[this.step].classList.add("active");
            }
        }, {
            key: "_moveHighlightBox",
            value: function _moveHighlightBox() {
                if (this.state.running && this.options.animate) {
                    this.state.animating = true;

                    window.requestAnimationFrame(this._animateHighlightBox.bind(this));
                } else {
                    var bounds = Util.getElementBounds(this.elems[this.step].node);
                    var bottom = bounds.top + bounds.height + this.components._elements.tutorialBox.offsetHeight + this.options.padding.top * 2;

                    this.components._elements.highlightBox.style.top = bounds.top - this.options.padding.top;
                    this.components._elements.highlightBox.style.left = bounds.left - this.options.padding.left;
                    this.components._elements.highlightBox.childNodes[0].style.height = bounds.bottom - bounds.top + 2 * this.options.padding.top;
                    this.components._elements.highlightBox.childNodes[0].style.width = bounds.width + 2 * this.options.padding.left;

                    this.components._elements.tutorialBox.style.top = bounds.height + 2 * this.options.padding.top + 6 + "px";

                    window.requestAnimationFrame(function () {
                        window.scrollTo(0, bottom - (window.scrollY + window.innerHeight + window.scrollY));
                    });
                }

                this.components._elements.highlightBox.childNodes[1].textContent = this.step + 1;
            }
        }, {
            key: "_animateHighlightBox",
            value: function _animateHighlightBox() {
                var _this7 = this;

                //https://aerotwist.com/blog/flip-your-animations/
                var first = this.elems[0].node;
                var last = this.elems[this.step].node;

                this.state.transform.translateY = last.offsetTop - first.offsetTop;
                this.state.transform.translateX = last.offsetLeft - first.offsetLeft;

                var tutorialBoxOffset = last.offsetHeight + 2 * this.options.padding.top + 6;

                var progressBarHeight = this.components._elements.progressBar.offsetHeight || 0;
                var body = document.body,
                    html = document.documentElement;

                var windowHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) - progressBarHeight;

                var calculatedHeight = this.components._elements.highlightBox.getBoundingClientRect().top + this.components._elements.highlightBox.offsetHeight + window.scrollY + this.components._elements.tutorialBox.offsetHeight + tutorialBoxOffset;

                if (calculatedHeight < windowHeight) {
                    this.components._elements.tutorialBox.style.top = tutorialBoxOffset + "px";
                } else {
                    this.components._elements.tutorialBox.style.top = -tutorialBoxOffset - this.components._elements.tutorialWrapper.offsetHeight + 2 * this.options.padding.top + 6 + "px";
                    // TODO: How can we change the pseudo Element to get a down arrow
                }

                this.components._elements.highlightBox.style.transform = "translateX(" + this.state.transform.translateX + "px) translateY(" + this.state.transform.translateY + "px)";

                this.components._elements.highlightBox.childNodes[0].style.width = last.offsetWidth + 2 * this.options.padding.top;
                this.components._elements.highlightBox.childNodes[0].style.height = last.offsetHeight + 2 * this.options.padding.top;

                this._scroll();

                this.components._elements.highlightBox.addEventListener("transitionend", function () {
                    _this7.state.animating = false;
                });
            }
        }, {
            key: "_updateTutorialBox",
            value: function _updateTutorialBox() {
                if (this.elems[this.step].type === "normal") {
                    if (this.state.type === "advanced") {
                        this.components._elements.tutorialBox.firstChild.remove();
                        this.components._elements.tutorialBox.appendChild(this.components._elements.tutorialWrapper);
                    }
                    this.components._elements.tutorialText.textContent = this.elems[this.step].text;
                    this.components._elements.tutorialTitle.textContent = this.elems[this.step].title;
                } else {
                    this.components._elements.tutorialBox.firstChild.remove();
                    this.components._elements.tutorialBox.appendChild(this.elems[this.step].template);
                }

                this.state.type = this.elems[this.step].type;
            }
        }, {
            key: "_saveCurrentPosition",
            value: function _saveCurrentPosition() {
                if (this.options.advancedStorage) {
                    window.localStorage.setItem("tutorial-" + this.name, this.step);
                } else {
                    document.cookie += "tutorial-" + this.name + "=" + this.step + ";";
                }
            }
        }, {
            key: "_getCurrentPosition",
            value: function _getCurrentPosition() {
                var _this8 = this;

                if (this.options.advancedStorage) {
                    return window.localStorage.getItem("tutorial-" + this.name);
                } else {
                    return document.cookie.split(",").filter(function (item) {
                        return item.includes("tutorial-" + _this8.name);
                    }).map(function (item) {
                        return parseInt(item.replace("tutorial-" + _this8.name + "=", ""));
                    });
                }
            }
        }, {
            key: "_scroll",
            value: function _scroll() {
                var _this9 = this;

                var boxBounds = Util.getElementBounds(this.components._elements.tutorialBox);
                var curElement = Util.getElementBounds(this.elems[this.step].node);
                var progressBarHeight = this.components._elements.progressBar.offsetHeight || 0;

                var bottom = curElement.top + curElement.height + boxBounds.height + this.options.padding.top * 2 + progressBarHeight;

                window.requestAnimationFrame(function (stamp) {
                    _this9.options.scrolling.timer = stamp;
                    _this9.__scrollMovement(stamp, bottom);
                });
            }
        }, {
            key: "_reset",
            value: function _reset() {
                this.step = 0;
                this.state.running = false;

                this.state.transform = {
                    translateY: 0,
                    translateX: 0
                };
            }
        }, {
            key: "__load",
            value: function __load() {
                return function handler() {
                    window.removeEventListener("load", this.components._eventHandler.load);
                    this.start();
                }.bind(this);
            }
        }, {
            key: "__resize",
            value: function __resize() {
                return function handler() {
                    this.components._elements.highlightBox.classList.add("skip-animation");

                    this.components._elements.highlightBox.style.left = this.elems[0].node.offsetLeft - this.options.padding.left;
                    this.components._elements.highlightBox.style.top = this.elems[0].node.offsetTop - this.options.padding.top;

                    this._animateHighlightBox();

                    //debounce to remove after 200ms
                    this.components._elements.highlightBox.classList.remove("skip-animation");
                }.bind(this);
            }
        }, {
            key: "__scrollMovement",
            value: function __scrollMovement(timeStamp, bottom) {
                var _this10 = this;

                var timeDiff = timeStamp - this.options.scrolling.timer;
                var next = Math.ceil(Util.easeOutQuad(timeDiff, this.options.scrolling.position, bottom - window.innerHeight - this.options.scrolling.position, this.options.scrolling.speed));

                if (next < 0) {
                    this.options.scrolling.position = window.scrollY;
                    this.options.scrolling.timer = null;

                    return;
                } else if (bottom !== window.innerHeight + window.scrollY) {
                    window.scrollTo(0, next);
                }

                if (timeDiff < this.options.scrolling.speed) {
                    window.requestAnimationFrame(function (stamp) {
                        _this10.__scrollMovement(stamp, bottom);
                    });
                } else {
                    this.options.scrolling.position = window.scrollY;
                    this.options.scrolling.timer = null;
                }
            }
        }], [{
            key: "installCustomAction",
            value: function installCustomAction() {
                var _ref4 = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {},
                    _ref4$key = _ref4.key,
                    key = _ref4$key === undefined ? Util.mandatory("Identifier") : _ref4$key,
                    _ref4$event = _ref4.event,
                    event = _ref4$event === undefined ? Util.mandatory("Event") : _ref4$event;

                Tutorial.actions.custom.push({
                    key: key,
                    event: event
                });
            }
        }]);

        return Tutorial;
    }();

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