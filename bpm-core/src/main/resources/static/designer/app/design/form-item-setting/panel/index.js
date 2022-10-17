define(function(require, exports, module) {

    exports.BasePanel = require('./base');
    exports.LabelPanel = require('./label');
    exports.TextPanel = require('./text');
    exports.TextAreaPanel = require('./textarea');
    exports.SelectPanel = require('./select');
    exports.MultiSelectPanel = require('./multiselect');
    exports.NumberPanel = require('./number');
    exports.MoneyPanel = require('./money');
    exports.LocationPanel = require('./location');

    exports.FileUploadPanel = require('./fileupload');
    exports.ImageUploadPanel = require('./imageupload');

    exports.AddressPanel = require('./address');
    exports.DateTimePanel = require('./datetime');
    exports.DateTimeScopePanel = require('./datetimescope');

    exports.ExplainPanel = require('./explain');

    exports.RadioGroupPanel = require('./radiogroup');
    exports.CheckBoxGroupPanel = require('./checkboxgroup');

    exports.LinkQueryPanel = require('./linkquery');

    exports.DetailGroupPanel = require('./detailgroup');
    exports.TriggerSelectPanel = require('./triggerselect');
    exports.bizPanel = require('./biz');
    exports.detailCalculatePanel = require('./detailcalculate');
});