var options = function() {

    var DOM = {};

    /* ----- INITIALIZING FUNCTIONS ----- */

    function cache() {
        // Containers
        DOM.settings = $('.multi-slider');

        // Buttons
        DOM.editing = $('.show-editing');

        // Sliders
        DOM.br = $('.slider.brightness');
        DOM.con = $('.slider.contrast');
    }

    function bindEvents() {
        for (let i=0; i < 9; i++) {
            DOM.editing.eq(i).on('click', toggleEdit.bind(null, i));
        }
        for (let i=0; i < 9; i++) {
            DOM.br.eq(i).on('input', brightness.bind(DOM.br.eq(i), i));
        }
        for (let i=0; i < 9; i++) {
            DOM.con.eq(i).on('input', contrast.bind(DOM.con.eq(i), i));
        }
    }

}
