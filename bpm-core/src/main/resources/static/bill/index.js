requirejs.config({
    baseUrl: g.ctx + 'static/bill',
    urlArgs: "t=" + +new Date,
    paths: {
        text: "../vendor/require/require.text",
        app: 'app',
        view: 'tpl'
    },
    packages: []
});

require(['lib/index'], function () {
    require(['app/create'], function (LayoutMain) {
        $.ajaxSetup({
            headers: {
                'If-Modified-Since': '0',
                'Cache-Control': 'no-cache'
            }
        });
        new LayoutMain();
    })
});



