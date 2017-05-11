/* @flow */

(function(window, document, undefined) {
    class Tutorial {
        constructor({identifier = "tutorial-wrapper", debug = true} = {}) {
            this.identifier = identifier;
            this.debug      = debug;
            this.step       = 0;

            this.elems      = Array.from(document.getElementsByClassName(this.identifier));

            if(this.elems.length === 0) {
                throw new Error("No activitys point defined");
            }
            else if(!this.elems.every(el => el.getAttribute("t-step"))) {
                throw new Error("Not all steps defined");
            }
            else {
                this.elems.sort((a, b) => {
                    return parseInt(a.getAttribute("t-step")) - parseInt(b.getAttribute("t-step"));
                });

                console.log(this.elems)
            }
        }

        start() {

        }

        goToStep(step) {
            
        }
    }

    if(!window.Tutorial) {
        window.Tutorial = Tutorial;
    }
})(window, document)