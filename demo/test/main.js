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
                fn: (ctx) => console.log(ctx),
                once: true
            }
        },
        {
            highlight: ".second-step",
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua.",
            callback: (ctx) => console.log("Tutorial is bound to this context")
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
    persistent: 1,
    buttons: {next: "Weiter"},
    autoplay: true,
    progressbar: false
});

function sayHello() {
    alert("yolo");
}

