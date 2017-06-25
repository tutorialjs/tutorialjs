Tutorial.installCustomAction({
    key: "dbl",
    event: "dblclick"
});

kb = new Tutorial("nico<3", {
    steps: [
        {
            highlight: ".first-step",
            title: "mytitle",
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
            callback: {
                fn: () => console.log("Just called once"),
                once: true
            }
        },
        {
            highlight: ".second-step",
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
            callback: () => console.log("I´m always called")
        },
        {
            highlight: ".third-step",
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
            callback: {
                fn: () => console.log("Tada much support, very lean")
            }
        },
        {
            highlight: ".fourth-step",
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
            action: {
                template: '#test-advanced'
            }
        },
        {
            highlight: ".scroll-test",
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
        }],
    debug: true,
    persistent: false,
    buttons: {next: "Weiter"},
    autoplay: true,
    progressbar: true
});

function sayHello() {
    alert("yolo");
}

