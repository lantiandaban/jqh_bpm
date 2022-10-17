define(function (require, exports, module) {

    var Hamster = window.Hamster = require('./foundation');

    window.Class = Hamster.Class = require('./class');
    window.Event = Hamster.Event = require('./event');
    window.HttpAjax = Hamster.HttpAjax = require('./http-ajax');

    Hamster.utils = require('./util');
    Hamster.ui = require('./ui/index');

    window.Component = Hamster.Component = Hamster.ui.BaseComponent;

    return Hamster;
});

