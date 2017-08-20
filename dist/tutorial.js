"use strict";

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

//v0.1.2

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
                var element_position = el.getBoundingClientRect();
                return {
                    top: element_position.top,
                    left: element_position.left,
                    bottom: element_position.top + element_position.height,
                    width: element_position.width,
                    height: element_position.height
                };
            }
        }]);

        return Util;
    }();

    var Step = function Step(ctx, node, callback) {
        var position = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "auto";

        _classCallCheck(this, Step);

        this.node = node;
        this.position = position;

        if (!Object.keys(callback).length && typeof callback !== "function") {
            this.callback = function () {};
        } else if (callback.once) {
            this.callback = function () {
                if (this.run) {
                    return;
                }

                callback.fn.call(this, ctx);
                this.run = true;
            };
        } else {
            this.callback = (callback.fn || callback).bind(this, ctx);
        }
    };

    var NormalStep = function (_Step) {
        _inherits(NormalStep, _Step);

        function NormalStep(ctx, node, text) {
            var _ref = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
                _ref$title = _ref.title,
                title = _ref$title === undefined ? "" : _ref$title,
                _ref$callback = _ref.callback,
                callback = _ref$callback === undefined ? {} : _ref$callback,
                _ref$position = _ref.position,
                position = _ref$position === undefined ? "auto" : _ref$position;

            _classCallCheck(this, NormalStep);

            var _this = _possibleConstructorReturn(this, (NormalStep.__proto__ || Object.getPrototypeOf(NormalStep)).call(this, ctx, node, callback, position));

            _this.type = "normal";
            _this.text = text;
            _this.title = title;
            return _this;
        }

        return NormalStep;
    }(Step);

    var ActionStep = function (_Step2) {
        _inherits(ActionStep, _Step2);

        function ActionStep(ctx, node, htmlId) {
            var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
                _ref2$callback = _ref2.callback,
                callback = _ref2$callback === undefined ? {} : _ref2$callback,
                _ref2$position = _ref2.position,
                position = _ref2$position === undefined ? "auto" : _ref2$position;

            _classCallCheck(this, ActionStep);

            var _this2 = _possibleConstructorReturn(this, (ActionStep.__proto__ || Object.getPrototypeOf(ActionStep)).call(this, ctx, node, callback, position));

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
                            var action = new ActionStep(this, node, step.action.template);

                            action.template = this._parseAdvancedStep(action);
                            action.template.classList.add("custom-box");

                            this.elems.push(action);
                        } else {
                            this.elems.push(new NormalStep(this, node, step.text, {
                                title: step.title,
                                callback: step.callback,
                                position: step.position
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
                    var position = item.getAttribute("t-position") || "auto";
                    this.elems = elems.map(function (item) {
                        return new NormalStep(_this3, item, item.getAttribute("t-text"), position, {
                            title: item.getAttribute("t-title")
                        });
                    });
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

                var curPosition = this._getCurrentPosition() || 0;

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
                    _elements: _extends({
                        progressBar: progressbar ? this._createProgressbar() : false,
                        blur: this._createBlurElement()
                    }, this._createTutorialBox())
                };
                this.components._elements.highlightBox = this._createHighlightBox(this.components._elements.tutorialBox);

                Object.defineProperty(this, "step", {
                    get: function get() {
                        return _this3.components._step;
                    },
                    set: function set(x) {
                        if (!_this3.state.running) {
                            console.warn("Tutorial is not running");
                            return;
                        }

                        if (_this3.animating) {
                            console.warn("Animation is already running");
                            return;
                        }

                        if (x < 0) {
                            _this3.close();
                        }
                        if (x === _this3.elems.length) {
                            _this3.close();

                            _this3.components._step = -1;
                        } else {
                            _this3.elems[_this3.components._step].node.classList.remove("tutorial-highlight");
                            _this3.components._step = x;
                            _this3.elems[x].node.classList.add("tutorial-highlight");

                            _this3._updateTutorialBox();
                            _this3._updateProgressBar();
                            _this3._moveHighlightBox();
                        }

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
                } else if (this.step === -1) {
                    console.warn("Tutoral already completed. Please reset steps.");
                } else {
                    this.elems[this.step].node.classList.add("tutorial-highlight");

                    document.body.appendChild(this.components._elements.blur);
                    document.body.appendChild(this.components._elements.highlightBox);

                    if (this.components._elements.progressBar) document.body.appendChild(this.components._elements.progressBar);

                    this._moveHighlightBox();
                    this._updateTutorialBox();
                    this._updateProgressBar();
                    this._checkAndFixHighlightboxOrientation();

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

                this.state.running = false;

                this.elems[this.step].node.classList.remove("tutorial-highlight");

                this.components._elements.highlightBox.style.transform = "";
                this.components._elements.highlightBox.firstChild.style.transform = "";

                document.body.removeChild(this.components._elements.blur);
                document.body.removeChild(this.components._elements.highlightBox);

                if (this.components._elements.progressBar) document.body.removeChild(this.components._elements.progressBar);

                window.removeEventListener("resize", this.components._eventHandler.resize);
            }
        }, {
            key: "prev",
            value: function prev() {
                this.step--;

                if (this.options.debug) console.log("Going to previous element: #" + this.step);
            }
        }, {
            key: "next",
            value: function next() {
                this.elems[this.step].callback();

                this.step++;

                if (this.options.debug) console.log("Going to next element: #" + (this.step === -1 ? 'Finished' : this.step));
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

                this.step = step;
            }
        }, {
            key: "reset",
            value: function reset() {
                this.components._step = 0;
                this.state._firstStep = 0;
                this.state.transform.translateX = 0;
                this.state.transform.translateY = 0;
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

                Object.defineProperties(this.buttonText, {
                    "next": {
                        get: function get() {
                            return _this6.options.buttons.next;
                        },
                        set: function set(x) {
                            _this6.options.buttons.next = x;
                            next.textContent = x;
                        }
                    },
                    "prev": {
                        get: function get() {
                            return _this6.options.buttons.previous;
                        },
                        set: function set(x) {
                            _this6.options.buttons.previous = x;
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
        }, {
            key: "_createProgressbar",
            value: function _createProgressbar() {
                var _this7 = this;

                var progressBarWrapper = document.createElement("div");
                var stepList = document.createElement("ul");
                var progressTrack = document.createElement("div");
                var currentProgressTrack = document.createElement("span");

                progressBarWrapper.classList.add("progressbar-wrapper");
                progressTrack.classList.add("progressbar-track");

                var progressSteps = [];
                for (var step = 0; step <= this.elems.length - 1; step++) {
                    var currentStep = document.createElement("li");
                    var currentStepText = document.createElement("span");
                    var currentStepTitle = document.createElement("i");

                    currentStepTitle.classList.add("step-title");

                    currentStepText.textContent = step + 1;

                    if (!(this.elems[step].title == "")) {
                        currentStepTitle.textContent = this.elems[step].title;
                        currentStep.appendChild(currentStepTitle);
                    }
                    currentStep.appendChild(currentStepText);

                    currentStep.style.left = 100 / (this.elems.length - 1) * step + '%';
                    stepList.appendChild(currentStep);
                    progressSteps.push(currentStep);

                    currentStep.addEventListener("click", function (e) {
                        _this7.goToStep(e.target.textContent - 1);
                    }, false);
                }

                progressTrack.appendChild(currentProgressTrack);
                progressBarWrapper.appendChild(progressTrack);
                progressBarWrapper.appendChild(stepList);

                return progressBarWrapper;
            }
        }, {
            key: "_updateProgressBar",
            value: function _updateProgressBar() {
                if (!this.components._elements.progressBar) {
                    return;
                }

                var progressSteps = Array.from(this.components._elements.progressBar.getElementsByTagName("li"));
                var progressTrack = this.components._elements.progressBar.childNodes[0].childNodes[0];
                progressTrack.style.width = 100 / (this.elems.length - 1) * this.step + '%';

                for (var i = 0; i <= this.elems.length - 1; i++) {
                    progressSteps[i].classList.remove("active", "finished");
                }

                var _iteratorNormalCompletion6 = true;
                var _didIteratorError6 = false;
                var _iteratorError6 = undefined;

                try {
                    for (var _iterator6 = progressSteps.slice(0, this.step)[Symbol.iterator](), _step6; !(_iteratorNormalCompletion6 = (_step6 = _iterator6.next()).done); _iteratorNormalCompletion6 = true) {
                        var j = _step6.value;

                        j.classList.add("finished");
                    }
                } catch (err) {
                    _didIteratorError6 = true;
                    _iteratorError6 = err;
                } finally {
                    try {
                        if (!_iteratorNormalCompletion6 && _iterator6.return) {
                            _iterator6.return();
                        }
                    } finally {
                        if (_didIteratorError6) {
                            throw _iteratorError6;
                        }
                    }
                }

                progressSteps[this.step].classList.add("active");
            }
        }, {
            key: "_moveHighlightBox",
            value: function _moveHighlightBox() {
                var _this8 = this;

                if (this.state.running && this.options.animate) {
                    this.state.animating = true;

                    window.requestAnimationFrame(this._animateHighlightBox.bind(this));
                } else {
                    var bounds = Util.getElementBounds(this.elems[this.step].node);
                    var leftRightBorder = bounds.left - this.options.padding.left;

                    this.components._elements.highlightBox.style.top = bounds.top + window.scrollY - this.options.padding.top + "px";
                    this.components._elements.highlightBox.style.left = leftRightBorder + "px";
                    this.components._elements.highlightBox.style.right = leftRightBorder + "px";
                    this.components._elements.highlightBox.firstChild.style.height = bounds.bottom - bounds.top + 2 * this.options.padding.top + "px";
                    this.components._elements.highlightBox.firstChild.style.width = bounds.width + 2 * this.options.padding.left + "px";

                    this.components._elements.tutorialBox.style.top = bounds.height + 2 * this.options.padding.top + 6 + "px";

                    window.requestAnimationFrame(function () {
                        window.scrollTo(0, bounds.top - (window.innerHeight - (_this8.components._elements.tutorialBox.offsetHeight + _this8.components._elements.highlightBox.firstChild.offsetHeight)) / 2);
                    });
                }

                this.components._elements.highlightBox.childNodes[1].textContent = this.step + 1;
            }
        }, {
            key: "_animateHighlightBox",
            value: function _animateHighlightBox() {
                var _this9 = this;

                //https://aerotwist.com/blog/flip-your-animations/
                var first = this.elems[this.state._firstStep].node;
                var last = this.elems[this.step].node;

                if (this._shouldSmoothTutorialboxTransition()) {
                    this.components._elements.tutorialBox.classList.add("hidden");
                }

                this.state.transform.translateY = Util.getElementBounds(last).top - Util.getElementBounds(first).top;
                this.state.transform.translateX = Util.getElementBounds(last).left - Util.getElementBounds(first).left;

                this.components._elements.tutorialBox.style.top = Util.getElementBounds(last).height + 2 * this.options.padding.top + 6 + "px";
                this.components._elements.highlightBox.style.transform = "translateX(" + this.state.transform.translateX + "px) translateY(" + this.state.transform.translateY + "px)";

                this.components._elements.highlightBox.firstChild.style.width = Util.getElementBounds(last).width + 2 * this.options.padding.top + "px";
                this.components._elements.highlightBox.firstChild.style.height = Util.getElementBounds(last).height + 2 * this.options.padding.top + "px";

                this._scroll();

                this.components._elements.highlightBox.addEventListener("transitionend", function () {
                    _this9.state.animating = false;
                    _this9._checkAndFixHighlightboxOrientation();
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
                    window.localStorage.setItem("tutorial-" + this.name, this.components._step);
                } else {
                    //wrong - has to replace too
                    document.cookie += "tutorial-" + this.name + "=" + this.step + ";";
                }
            }
        }, {
            key: "_getCurrentPosition",
            value: function _getCurrentPosition() {
                var _this10 = this;

                if (this.options.advancedStorage) {
                    return window.localStorage.getItem("tutorial-" + this.name);
                } else {
                    return document.cookie.split(",").filter(function (item) {
                        return item.includes("tutorial-" + _this10.name);
                    }).map(function (item) {
                        return parseInt(item.replace("tutorial-" + _this10.name + "=", ""));
                    });
                }
            }
        }, {
            key: "_getProgressbarHeight",
            value: function _getProgressbarHeight() {
                return this.components._elements.progressBar.offsetHeight || 0;
            }
        }, {
            key: "_scroll",
            value: function _scroll() {
                var _this11 = this;

                var center = Util.getElementBounds(this.elems[this.step].node).top - (window.innerHeight - (this.components._elements.tutorialBox.offsetHeight + this.components._elements.highlightBox.firstChild.offsetHeight)) / 2;
                window.requestAnimationFrame(function (stamp) {
                    _this11.options.scrolling.timer = stamp;

                    _this11.__scrollMovement(stamp, center);
                });
            }
        }, {
            key: "_checkAndFixHighlightboxOrientation",
            value: function _checkAndFixHighlightboxOrientation() {
                var progressBarHeight = this.components._elements.progressBar.offsetHeight || 0;

                var body = document.body,
                    html = document.documentElement;

                var windowHeight = Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight) - progressBarHeight;

                var calculatedHeight = this.components._elements.highlightBox.getBoundingClientRect().top + this.components._elements.highlightBox.offsetHeight + window.scrollY + this.components._elements.tutorialBox.offsetHeight; //+ tutorialBoxOffset;

                var bounds = Util.getElementBounds(this.elems[this.step].node);

                var pos = this.elems[this.step].position;

                this.components._elements.tutorialBox.classList.remove("north");
                this.components._elements.tutorialBox.classList.remove("east");
                this.components._elements.tutorialBox.classList.remove("south");
                this.components._elements.tutorialBox.classList.remove("west");
                this.components._elements.tutorialBox.style.left = "";
                this.components._elements.tutorialBox.style.right = "";

                if (pos === "top" || pos === "auto" && calculatedHeight > windowHeight) {
                    this.components._elements.tutorialBox.style.top = -(this.components._elements.tutorialBox.offsetHeight + (2 * this.options.padding.top - 8)) + "px";
                    this.components._elements.tutorialBox.classList.add("north");
                } else if (pos === "bottom" || pos === "auto" && calculatedHeight <= windowHeight) {
                    this.components._elements.tutorialBox.classList.add("south");
                } else if (pos === "left") {
                    this.components._elements.tutorialBox.style.top = -0.5 * (this.components._elements.tutorialBox.offsetHeight + (2 * this.options.padding.top - 100)) + "px";
                    this.components._elements.tutorialBox.style.left = -(this.components._elements.tutorialBox.offsetWidth + (2 * this.options.padding.left - 8)) + "px";
                    this.components._elements.tutorialBox.classList.add("west");
                } else if (pos === "right") {
                    this.components._elements.tutorialBox.classList.add("east");
                    this.components._elements.tutorialBox.style.top = -0.5 * (this.components._elements.tutorialBox.offsetHeight + (2 * this.options.padding.top - 100)) + "px";
                    //this.components._elements.tutorialBox.style.right = - 0.9 * (this.components._elements.tutorialBox.offsetWidth - (2 * this.options.padding.left - 8)) + "px";
                    this.components._elements.tutorialBox.style.right = -(bounds.width + (2 * this.options.padding.left + 8)) + "px";
                }
                if (this._shouldSmoothTutorialboxTransition()) {
                    this.components._elements.tutorialBox.classList.remove("hidden");
                }
                this.last_position = pos;
            }
        }, {
            key: "_shouldSmoothTutorialboxTransition",
            value: function _shouldSmoothTutorialboxTransition() {
                return this.last_position && this.last_position != this.elems[this.step].position;
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
                    var bounds = Util.getElementBounds(this.elems[this.state._firstStep].node);
                    var leftRightBorder = bounds.left - this.options.padding.left;
                    var topBorder = bounds.top - this.options.padding.top;

                    this.components._elements.highlightBox.classList.add("skip-animation");

                    this.components._elements.highlightBox.style.left = leftRightBorder + "px";
                    this.components._elements.highlightBox.style.right = leftRightBorder + "px";
                    this.components._elements.highlightBox.style.top = topBorder + "px";

                    this._animateHighlightBox();
                    this._checkAndFixHighlightboxOrientation();

                    // debounce to remove after 200ms
                    this.components._elements.highlightBox.classList.remove("skip-animation");
                }.bind(this);
            }
        }, {
            key: "__scrollMovement",
            value: function __scrollMovement(timeStamp, center) {
                var _this12 = this;

                var timeDiff = timeStamp - this.options.scrolling.timer;
                var next = Math.ceil(Util.easeOutQuad(timeDiff, this.options.scrolling.position, center - this.options.scrolling.position, this.options.scrolling.speed));

                window.scrollTo(0, next);

                if (timeDiff < this.options.scrolling.speed) {
                    window.requestAnimationFrame(function (stamp) {
                        _this12.__scrollMovement(stamp, center);
                    });
                } else {
                    this.options.scrolling.timer = null;
                    this.options.scrolling.position = Math.min(center, document.documentElement.offsetHeight - window.innerHeight);
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