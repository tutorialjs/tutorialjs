window.onload = function() {
    var kb = new Tutorial({
        steps: [
            {
                highlight: ".first-step",
                text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
            },
            {
                highlight: ".second-step",
                text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
            },
            {
                highlight: ".third-step",
                text: "Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua."
            }],
        debug: true,
        name: "nico<3",
        persistent: false,
        buttons: { close: "Schließen" },
        autoplay: true
    });
};

