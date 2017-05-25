kb = new Tutorial("nico<3", {
    steps: [
        {
            highlight: ".first-step",
            title: "mytitle",
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
        },
        {
            highlight: ".second-step",
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
        },
        {
            highlight: ".third-step",
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
        },
        {
            highlight: "#test-advanced",
            text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt",
            action: {
                template: "test-advanced"
            }
        }],
    //selector: "section",
    debug: true,
    persistent: false,
    buttons: {close: "Schließen"},
    autoplay: true
});

