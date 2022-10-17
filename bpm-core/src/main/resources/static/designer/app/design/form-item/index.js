define(function(require, exports, module) {
    var formItemManager = require('./manager');
    var constants = require('../constants');

    var LabelItem = require('./label');
    var TextItem = require('./text');
    var TextAreaItem = require('./textarea');
    var NumberItem = require('./number');
    var MoneyItem = require('./money');
    var DateTimeItem = require('./datetime');
    var SelectItem = require('./select');
    var MultiSelectItem = require('./multiselect');
    var CheckBoxGroupItem = require('./checkboxgroup');
    var RadioGroupItem = require('./radiogroup');
    // var ExplainItem = require('./explain');
    // var AddressItem = require('./address');
    // var DateTimeScopeItem = require('./datetimescope');
    var ImageUploadItem = require('./imageupload');
    var FileUploadItem = require('./fileupload');
    // var LocationItem = require('./location');
    // var LinkQueryItem = require('./linkquery');
    var DetailGroupItem = require('./detailgroup');
    var TriggerSelectItem = require('./triggerselect');
    var biz = require('./biz');
    var detailcalculate = require('./detailcalculate');


    formItemManager.register('label', LabelItem);
    formItemManager.register('text', TextItem);
    formItemManager.register('textarea', TextAreaItem);
    formItemManager.register('number', NumberItem);
    formItemManager.register('money', MoneyItem);
    formItemManager.register('datetime', DateTimeItem);
    formItemManager.register('select', SelectItem);
    formItemManager.register('multiselect', MultiSelectItem);
    formItemManager.register('radiogroup', RadioGroupItem);
    formItemManager.register('checkboxgroup', CheckBoxGroupItem);
    // formItemManager.register('explain', ExplainItem);
    // formItemManager.register('address', AddressItem);
    // formItemManager.register('datetimescope', DateTimeScopeItem);
    formItemManager.register('imageupload', ImageUploadItem);
    formItemManager.register('fileupload', FileUploadItem);
    // formItemManager.register('location', LocationItem);
    // formItemManager.register('linkquery', LinkQueryItem);
    formItemManager.register('detailgroup', DetailGroupItem);
    formItemManager.register('triggerselect', TriggerSelectItem);
    formItemManager.register('biz', biz);
    formItemManager.register('detailcalculate', detailcalculate);

    return formItemManager
});