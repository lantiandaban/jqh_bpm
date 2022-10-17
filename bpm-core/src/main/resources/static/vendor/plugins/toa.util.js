  
;!function () {
    var layer = layui.layer
        , laytpl = layui.laytpl
        , laydate = layui.laydate;
    //时间戳转换时间
    laytpl.timeFormat = function (time) {
        return moment.unix(time).format("YYYY-MM-DD HH:mm");
    };
    //时间戳转换日期
    laytpl.dateFormat = function (time) {
        return moment.unix(time).format("YYYY-MM-DD");
    };
    //金额分割（111,222,11.00）
    laytpl.thousandsFormat = function (num) {
        return Hamster.utils.number(num, '000,000.00')
    };
    //非金额分割（111,111,11）
    laytpl.numberComma = function (num) {
        return Hamster.utils.number(num, '000,')
    };
}();

