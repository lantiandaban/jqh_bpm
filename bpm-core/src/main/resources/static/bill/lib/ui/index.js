define(function (require, exports, module) {

    var Foundation = require('../foundation');

    exports.BaseComponent = require('./component');
    exports.Button = require('./button');
    exports.Message = require('./message');

    var Fields = require('./form/item');
    Foundation.Object.each(Fields, function (name, Comp) {
        exports[name] = Comp;
    });

    exports.MultiUploadPanel = require('./upload/multi-upload-panel');
    exports.MultiUploadDialog = require('./upload/multi-upload-dialog');
    exports.UploadButton = require('./upload/upload-button');
    exports.Loader = require('./loader');
    exports.Dialog = require('./dialog');
    exports.ServerDataTable = require('./server-datatable');
    exports.Tabs = require('./tab/index');

});

