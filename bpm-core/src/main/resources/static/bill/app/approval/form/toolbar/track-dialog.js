define(function (require, exports, module) {

    var Hamster = require('lib/index');

    /**
     * 审批轨迹弹出框
     * */
    var ApprovalTrackDialog = Class.create({

        statics: {},

        extend: Hamster.ui.Dialog,

        title: '查看轨迹',

        width: 900,

        height: 600,

        autoClose: true,

        billId: null,

        contentPadding: 0,

        _beforeInit: function () {
            this.btnItems = [
                {
                    name: 'confirm',
                    icon: 'ui-icon-check',
                    title: "确定",
                    handler: this.onConfirm.bind(this)
                }
            ];
            ApprovalTrackDialog.superclass._beforeInit.apply(this);
        },

        onRenderContent: function () {
            ApprovalTrackDialog.superclass.onRenderContent.apply(this);

            this.el._dialog_content.css('marginTop', 10);
            this.initTab();
        },

        initTab: function () {
            this.tab = new Hamster.ui.Tabs({
                appendToEl: this.el._dialog_content,
                height: this.getBodySize().height - 10,
                items: [
                    // {
                    //     name: 'approval-log',
                    //     title: "审批日志"
                    // },
                    {
                        name: 'track-image',
                        title: "轨迹图"
                    },
                    // {
                    //     name: 'comments',
                    //     title: "评论"
                    // }
                ]
            });
            this.tab.on('panel-rendered', this.onTabPanelRendered, this);
            this.tab.active('track-image');
        },

        onTabPanelRendered: function (name, content, panel) {
            switch (name) {
                case 'track-image':
                    this.renderTrackImage(content);
                    break;
                case 'approval-log':
                    this.renderApprovalLog(content);
                    break;
                case 'comments':
                    this.renderComments(content);
                    break;
            }
        },

        renderTrackImage: function (content) {
            this.el.trackImage = $('<div class="g-row">' +
                '<img style="width: 890px;background:white;" alt="审批流程图" id="process_diagram_image"/>' +
                '</div><div class="g-row p-m"><div class="g-col-12 ui-font-weight">温馨提示：</div>' +
                '<ul class="typography-list p-m"><li>您可以点击流程图进行查看大图。</li>' +
                '<li>流程图中<span style="color: #1a9a59;">青色节点</span>表示已经运行过的流程节点。</li>' +
                '<li>流程图中<span style="color: red;">红色节点</span>表示当前正在处理的流程节点。</li>' +
                '<li>查看大图模式下在浏览器底部有放大、旋转等按钮操作。</li></ul></div>')
                .appendTo(content);

            var dialgramURL = g.ctx + 'bill/diagram/rest/run/' + this.billId;
            var $diagramImage = this.el.trackImage.find('#process_diagram_image');
            $diagramImage.prop('src', dialgramURL + '?_=' + new Date().getTime());

            var viewer = new Viewer(document.getElementById('process_diagram_image'), {
                navbar: false,
                zIndex: 10000999,
                fullscreen: false,
                transition: false,
                viewed: function () {
                    $('.viewer-canvas').click(function (e) {
                        if (e.target.className == 'viewer-canvas') {
                            viewer.hide();
                        }
                    });
                }
            });
            $diagramImage.on('click', function (e) {
                e.preventDefault();
                viewer.show();
            })
        },

        renderApprovalLog: function (content) {
            var self = this;
            this.el.approvalLogContent = $('<div class="approval-track-timeline"></div>').appendTo(content);

            var dataHttpAjax = new HttpAjax({
                url: 'bill/flow/rest/approval/history',
                type: 'GET',
                params: {
                    billId: this.billId
                }
            });
            dataHttpAjax.successHandler(function (data) {
                data = data || [];
                var historySize = data.length + 1;
                Hamster.Array.each(data, function (item, index) {
                    this.createApprovalLogItem(item, historySize);
                    historySize--;
                }, self)
            });
            dataHttpAjax.send();
        },

        renderComments: function (content) {
            var self = this;
            content.css('padding', 10);
            this.el.approvalCommentsContent = $('<table class="ui-table ui-table-border">' +
                '<colgroup><col style="width: 100px;"/><col /><col style="width: 180px;"/></colgroup>' +
                '<thead class="ui-table-thead"><tr><th>评论人</th><th>评论内容</th><th>评论时间</th></tr></thead>' +
                '<tbody></tbody></table><form class="layui-form layui-form-pane" action="">' +
                '<div class="layui-form-item layui-form-text">' +
                '<label class="layui-form-label">发起评论</label><div class="layui-input-block">' +
                '<textarea name="approval_commit" id="bill_reply_content" maxlength="200" placeholder="请输入评论内容" class="layui-textarea"></textarea>' +
                '</div><button class="layui-btn layui-btn-small" id="bill_reply_btn" type="button">立即回复</button></div></form>').appendTo(content);

            self.replyDataInit();

            self.el.approvalCommentsContent.find('#bill_reply_btn').on('click', function (e) {
                // 回复信息
                var contentBox = self.el.approvalCommentsContent.find('#bill_reply_content');
                var content = contentBox.val();
                if (Hamster.isEmpty(content)) {
                    layer.msg('请输入回复内容');
                    return false;
                }
                var replyHttpAjax = new HttpAjax({
                    url: 'bill/reply/rest/submit',
                    type: 'POST',
                    params: {
                        billId: self.billId,
                        content: content
                    }
                });

                replyHttpAjax.successHandler(function (result) {
                    self.el.approvalCommentsContent.find('tbody').empty();
                    self.replyDataInit();
                    contentBox.val('');
                });

                replyHttpAjax.satusCodeHandler(500, function () {
                    layer.msg("回复失败，请稍后重试", {icon: 5});
                });
                replyHttpAjax.send();

                return false;
            })
        },
        // 获取回复内容
        replyDataInit: function () {
            var self = this;
            var dataHttpAjax = new HttpAjax({
                url: 'bill/reply/rest/list',
                type: 'GET',
                params: {
                    page: 1,
                    pageSize: 10000,
                    billId: this.billId
                }
            });
            dataHttpAjax.successHandler(function (result) {
                var replyList = result.data || [];
                if (Hamster.isEmpty(replyList)) {
                    var rowHTML = '<tr id="bill_reply_emply_tr">' +
                        '<td colspan="3" align="center">暂无评论信息</td>' +
                        '</tr>';
                    self.el.approvalCommentsContent.find('tbody').append(rowHTML);
                    return;
                } else {
                    self.el.approvalCommentsContent.find('tr#bill_reply_emply_tr').remove();
                }
                Hamster.Array.forEach(replyList, function (item) {
                    self.createApprovalCommentRow(item)
                });

                self.el.approvalCommentsContent.find('button.reply-remove').on('click', function (e) {
                    var replyId = $(this).attr('data-id');
                    layer.confirm('您确定要删除该评论么？', function (index) {
                        var replyHttpAjax = new HttpAjax({
                            url: 'bill/reply/rest/delete',
                            type: 'POST',
                            params: {
                                billId: self.billId,
                                replyId: replyId
                            }
                        });

                        replyHttpAjax.successHandler(function (result) {
                            self.el.approvalCommentsContent.find('tbody').empty();
                            self.replyDataInit();
                        });

                        replyHttpAjax.satusCodeHandler(500, function () {
                            layer.msg("回复失败，请稍后重试", {icon: 5});
                        });
                        replyHttpAjax.send();
                        layer.close(index);
                    });

                    return false;
                });
            });
            dataHttpAjax.send();
        },

        createRemark: function (item) {
            var remark = "<span style='color: cornflowerblue;'>" + item.userName + "</span>:";
            if (item.targetTaskType == 2) {
                remark = remark + "请求【" + item.targetUserName + "】加签";
            } else if (item.targetTaskType == 3) {
                remark = remark + "转办【" + item.targetUserName + "】";
            } else if (item.targetTaskType == 4) {
                remark = remark + "移交【" + item.targetUserName + "】";
            }
            if (item.taskType == 2) {
                remark = remark + "【加签】";
            }
            var statusStr = this.formatApprovalStatus(item.status);
            if (Hamster.isEmpty(statusStr)) {
                var indexOf = remark.lastIndexOf(":");
                remark = remark.substr(0, indexOf);
            }
            return remark + statusStr;

        },
        createApprovalLogItem: function (item, historySize) {
            var statueText = (item.nodeName == undefined ? item.userName : item.nodeName);
            var time = this.formatApprovalTime(item);
            var remark = this.createRemark(item);
            var itemElement = $(Hamster.String.format('<div class="approval-track-timeline-item">' +
                '<p class="status">{1}</p>' +
                '<p>{0}</p>' +
                '<p class="time">{2}</p>' +
                '<em class="approval-track-timeline-head">{3}</em>' +
                '<b class="approval-track-timeline-tail"></b>' +
                '</div>',
                remark,
                statueText,
                time,
                historySize - 1));

            if (item.status == 3 || item.status == 4) {
                itemElement.addClass('approval-track-timeline-item-warning');
            }
            this.el.approvalLogContent.append(itemElement);
        },
        formatApprovalTime: (item) => {
            var time;
            if (item.status == 1 || item.status == 10) {
                // 审批中、支付中 则不显示 时间
                time = '';
            } else if (item.status == 9) {
                if (item.dateline != 0) {
                    // 如果是重新发起的，并且如果是有了时间，则表示发起，如果没有时间，则是填写中
                    time = moment(item.dateline * 1000).format('YYYY/MM/DD HH:mm');
                    statueText = '重新发起';
                } else {
                    time = '';
                }
            } else {
                time = moment(item.dateline * 1000).format('YYYY/MM/DD HH:mm');
            }
            return time;
        },
        formatApprovalStatus: function (status) {
            switch (status) {
                case 1:
                    return "【审批中】";
                case 2:
                    return "【已同意】";
                case 3:
                    return "【已拒绝】";
                case 4:
                    return "【他人已审批】";
                case 5:
                    return "【已归档】";
                case 6:
                    return "【撤销审批】";
                case 8:
                    return "【发起申请】";
                case 9:
                    return "【重新填写】";
                case 10:
                    return "【归档中】";
                case 11:
                    return "";
                case 12:
                    return "退回";
                case 13:
                    return "";
                case 14:
                    return "已转办";
                case 15:
                    return "已移交";
                default:
                    return "";
            }
        },

        createApprovalCommentRow: function (item) {
            var replyTime = moment(item.dateline * 1000).format('YYYY-MM-DD HH:mm');
            var timeHtml;
            if (item.self) {
                timeHtml = Hamster.String.format('{0}<button type="button" data-id="{1}"' +
                    ' style="margin-left: 10px;" class="layui-btn layui-btn-danger layui-btn-mini reply-remove"><i class="layui-icon"></i></button>', replyTime, item.id);
            } else {
                timeHtml = replyTime;
            }
            var rowHTML = Hamster.String.format('<tr>' +
                '<td>{0}</td>' +
                '<td>{2}</td>' +
                '<td>{1}</td>' +
                '</tr>',
                item.userName,
                timeHtml,
                item.content || ""
            );
            this.el.approvalCommentsContent.find('tbody').append(rowHTML);
        },

        onConfirm: function () {
            this.close();
        },

        destroy: function () {
            this.tab.destroy();
            ApprovalTrackDialog.superclass.destroy.apply(this, arguments);
        }

    });

    return ApprovalTrackDialog;
});