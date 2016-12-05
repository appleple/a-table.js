'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var aTemplate = require('a-template');
var $ = require('zepto-browserify').$;
var clone = require('clone');
var toMarkdown = require('./table2md.js');
var template = '<!-- BEGIN showMenu:exist -->\n<ul class="spread-table-menu" style="top:{menuY}px;left:{menuX}px;">\n\t<!-- BEGIN mode:touch#cell -->\n\t<li data-action-click="mergeCells"><!-- BEGIN lang:touch#ja -->\u30BB\u30EB\u306E\u7D50\u5408<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->merge cells<!-- END lang:touch#en --></li>\n\t<li data-action-click="changeCellTypeTo(th)"><!-- BEGIN lang:touch#ja -->th\u306B\u5909\u66F4\u3059\u308B<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->change to th<!-- END lang:touch#en --></li>\n\t<li data-action-click="changeCellTypeTo(td)"><!-- BEGIN lang:touch#ja -->td\u306B\u5909\u66F4\u3059\u308B<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->change to td<!-- END lang:touch#en --></li>\n\t<li data-action-click="align(left)"><!-- BEGIN lang:touch#ja -->\u5DE6\u5BC4\u305B<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->align left<!-- END lang:touch#en --></li>\n\t<li data-action-click="align(center)"><!-- BEGIN lang:touch#ja -->\u4E2D\u592E\u5BC4\u305B<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->align center<!-- END lang:touch#en --></li>\n\t<li data-action-click="align(right)"><!-- BEGIN lang:touch#ja -->\u53F3\u5BC4\u305B<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->align right<!-- END lang:touch#en --></li>\n\t <li data-action-click="splitCell()"><!-- BEGIN lang:touch#ja -->\u30BB\u30EB\u306E\u5206\u5272<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->split cell<!-- END lang:touch#en --></li>\n\t<!-- END mode:touch#cell -->\n\t<!-- BEGIN mode:touch#col -->\n\t<li data-action-click="insertColLeft({selectedRowNo})"><!-- BEGIN lang:touch#ja -->\u5DE6\u306B\u5217\u3092\u8FFD\u52A0<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->insert column on the left<!-- END lang:touch#en --></li>\n\t<li data-action-click="insertColRight({selectedRowNo})"><!-- BEGIN lang:touch#ja -->\u53F3\u306B\u5217\u3092\u8FFD\u52A0<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->insert column on the right<!-- END lang:touch#en --></li>\n\t<li data-action-click="removeCol({selectedRowNo})"><!-- BEGIN lang:touch#ja -->\u5217\u3092\u524A\u9664<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->remove column<!-- END lang:touch#en --></li>\n\t<!-- END mode:touch#col -->\n\t<!-- BEGIN mode:touch#row -->\n\t<li data-action-click="insertRowAbove({selectedColNo})"><!-- BEGIN lang:touch#ja -->\u4E0A\u306B\u884C\u3092\u8FFD\u52A0<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->insert row above<!-- END lang:touch#en --></li>\n\t<li data-action-click="insertRowBelow({selectedColNo})"><!-- BEGIN lang:touch#ja -->\u4E0B\u306B\u884C\u3092\u8FFD\u52A0<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->insert row below<!-- END lang:touch#en --></li>\n\t<li data-action-click="removeRow({selectedColNo})"><!-- BEGIN lang:touch#ja -->\u884C\u3092\u524A\u9664<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->remove row<!-- END lang:touch#en --></li>\n\t<!-- END mode:touch#row -->\n</ul>\n<!-- END showMenu:exist -->\n<!-- BEGIN showBtnList:exist -->\n<div class="spread-table-btn-list">\n\t<!-- <button class="spread-table-btn" data-action-click="backToState(1)"><i class="fa fa-rotate-left"></i></button> -->\n\t<button class="spread-table-btn" data-action-click="mergeCells"><!-- BEGIN lang:touch#ja -->\u30BB\u30EB\u306E\u7D50\u5408<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->merge cells<!-- END lang:touch#en --></button>\n\t<button class="spread-table-btn" data-action-click="splitCell()"><!-- BEGIN lang:touch#ja -->\u30BB\u30EB\u306E\u5206\u5272<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->split cell<!-- END lang:touch#en --></button>\n\t<button class="spread-table-btn" data-action-click="undo()"><!-- BEGIN lang:touch#ja -->\u5143\u306B\u623B\u3059<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->undo<!-- END lang:touch#en --></button>\n\t<button class="spread-table-btn" data-action-click="changeCellTypeTo(td)">td</button>\n\t<button class="spread-table-btn" data-action-click="changeCellTypeTo(th)">th</button>\n\t<button class="spread-table-btn" data-action-click="align(left)"><i class="fa fa-align-left"></i></button>\n\t<button class="spread-table-btn" data-action-click="align(center)"><i class="fa fa-align-center"></i></button>\n\t<button class="spread-table-btn" data-action-click="align(right)"><i class="fa fa-align-right"></i></button>\n</div>\n<!-- END showBtnList:exist -->\n<div class="spread-table-wrapper">\n\t<table class="spread-table">\n\t\t<tr class="spread-table-header js-table-header">\n\t\t\t<th class="spread-table-first"></th>\n\t\t\t<!-- BEGIN highestRow:loop -->\n\t\t\t<th data-action="selectRow({i})"<!-- BEGIN selectedRowNo:touch#{i} -->class="selected"<!-- END selectedRowNo:touch#{i} -->>{i}[noToEn]<span class="spread-table-toggle-btn" data-action-click="selectRowViaBtn({i})"></span></th>\n\t\t\t<!-- END highestRow:loop -->\n\t\t</tr>\n\t\t<!-- BEGIN row:loop -->\n\t\t<tr>\n\t\t\t<th class="spread-table-side js-table-side<!-- BEGIN selectedColNo:touch#{i} --> selected<!-- END selectedColNo:touch#{i} -->"data-action="selectCol({i})">{i}<span class="spread-table-toggle-btn" data-action-click="selectColViaBtn({i})"></span></th>\n\t\t\t<!-- BEGIN row.{i}.col:loop -->\n\t\t\t<td colspan="{colspan}" rowspan="{rowspan}" data-action="updateTable({i},{i})" data-cell-id="{i}-{i}" class="<!-- BEGIN selected:exist -->spread-table-selected<!-- END selected:exist --><!-- BEGIN type:touch#th --> spread-table-th<!-- END \type:touch#th -->"><div class=\'spread-table-editable {align}\' contenteditable>{value}</div><div class=\'spread-table-pseudo\'></div></td>\n\t\t\t<!-- END row.{i}.col:loop -->\n\t\t</tr>\n\t\t<!-- END row:loop -->\n\t</table>\n</div>\n';
var returnTable = '<table>\n\t<!-- BEGIN row:loop -->\n\t<tr>\n\t\t<!-- BEGIN row.{i}.col:loop -->\n\t\t<!-- BEGIN type:touch#th -->\n\t\t<th<!-- BEGIN colspan:touchnot#1 --> colspan="{colspan}"<!-- END colspan:touchnot#1 --><!-- BEGIN rowspan:touchnot#1 --> rowspan="{rowspan}"<!-- END rowspan:touchnot#1 --><!-- BEGIN align:exist -->{align}[getStyleByAlign]<!-- END align:exist -->>{value}</th>\n\t\t<!-- END type:touch#th -->\n\t\t<!-- BEGIN type:touch#td -->\n\t\t<td<!-- BEGIN colspan:touchnot#1 --> colspan="{colspan}"<!-- END colspan:touchnot#1 --><!-- BEGIN rowspan:touchnot#1 --> rowspan="{rowspan}"<!-- END rowspan:touchnot#1 --><!-- BEGIN align:exist -->{align}[getStyleByAlign]<!-- END align:exist -->>{value}</td>\n\t\t<!-- END type:touch#td -->\n\t\t<!-- END row.{i}.col:loop -->\n\t</tr>\n\t<!-- END row:loop -->\n</table>\n';
var style = '.spread-table-wrapper {\n\tposition: relative;\n\tz-index: 0;\n\twidth: 100%;\n}\n\n.spread-table-pseudo {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tz-index: -1;\n}\n\n.spread-table-wrapper {\n\twidth: 100%;\n\t-ms-overflow-x: scroll;\n\toverflow-x: scroll;\n}\n\n.spread-table {\n\tborder-collapse: collapse;\n\ttable-layout: fixed;\n\tfont-family: "Open Sans", Helvetica, Arial, sans-serif;\n}\n\n.spread-table input {\n\twidth: 100%;\n\theight: 100%;\n\tdisplay: block;\n}\n\n.spread-table td,\n.spread-table th {\n\ttext-align: left;\n\twidth: 100px;\n\theight: 15px;\n\twhite-space: nowrap;\n\toverflow: hidden;\n\tposition: relative;\n\tz-index: 0;\n\tborder: 1px solid #cccccc;\n}\n\n.spread-table td:first-child,\n.spread-table th:first-child {\n\twidth: 50px;\n}\n\n.spread-table th {\n\tbackground-color: #eee;\n\tfont-weight: normal;\n}\n\n.spread-table .left {\n\ttext-align: left;\n}\n\n.spread-table .right {\n\ttext-align: right;\n}\n\n.spread-table .center {\n\ttext-align: center;\n}\n\n.spread-table .spread-table-th {\n\tbackground-color: #ddd;\n\tfont-weight: bold;\n}\n\n.spread-table .spread-table-selected {\n\tbackground-color: #eaf2f9;\n}\n\n.spread-table-editable {\n\twidth: 100%;\n\theight: 100%;\n}\n\n.spread-table-pseudo {\n\tposition: absolute;\n\ttop: 0;\n\tleft: 0;\n\twidth: 100%;\n\theight: 100%;\n\tz-index: -1;\n}\n\n.spread-table-menu {\n\tdisplay: block;\n\tlist-style-type: none;\n\tpadding: 0;\n\tmargin: 0;\n\tposition: fixed;\n\ttop: 0;\n\tleft: 0;\n\tz-index: 999999;\n\tbackground-color: #fff;\n\tborder: 1px solid #666;\n\tcolor: #474747;\n\tfont-size: 13px;\n}\n\n.spread-table-menu li {\n\tdisplay: block;\n\tfont-size: 14px;\n\tpadding: 5px 7px;\n\tline-height: 1;\n\tborder-bottom: 1px solid #ddd;\n\tcursor: pointer;\n}\n\n.spread-table-menu li:hover {\n\tbackground-color: #eee;\n}\n\n.spread-table-header th {\n\ttext-align: center;\n\tposition: relative;\n}\n\n.spread-table-header .selected {\n\tbackground-color: #eaf2f9;\n}\n\n.spread-table-side.selected {\n\tbackground-color: #eaf2f9;\n}\n\n.spread-table .spread-table-side {\n\ttext-align: center;\n\tposition: relative;\n}\n\n.spread-table-btn-list {\n\tmargin-bottom: 10px;\n\tdisplay: table;\n}\n\n.spread-table-btn {\n\tdisplay: table-cell;\n\tborder-left: none;\n\tborder: 1px solid #d9d9d9;\n\tbackground-color: #f2f2f2;\n\tfont-size: 12px;\n\tpadding: 3px 5px;\n}\n\n.spread-table-btn:first-child {\n\tborder-top-left-radius: 3px;\n\tborder-bottom-left-radius: 3px;\n}\n\n.spread-table-btn:last-child {\n\tborder-top-right-radius: 3px;\n\tborder-bottom-right-radius: 3px;\n}\n\n.spread-table-toggle-btn {\n\tdisplay: inline-block;\n\tborder: 1px solid #ccc;\n\tpadding: 5px;\n\tposition: absolute;\n\tright: 5px;\n\ttop: 5px;\n\tcursor: pointer;\n\tdisplay: none;\n}\n\n.spread-table-header th:hover .spread-table-toggle-btn {\n\tdisplay: block;\n}\n\n.spread-table-side:hover .spread-table-toggle-btn {\n\tdisplay: block;\n}\n\n.spread-table-toggle-btn:after {\n\tcontent: "";\n\tdisplay: block;\n\tborder: solid transparent;\n\tcontent: " ";\n\theight: 0;\n\twidth: 0;\n\tborder-color: rgba(136, 183, 213, 0);\n\tborder-top-color: #88b7d5;\n\tborder-width: 5px;\n\tmargin-left: -5px;\n\tposition: absolute;\n\ttop: 2px;\n\tleft: 5px;\n}\n\n.spread-table-first {\n\twidth: 15px;\n}\n';
var equals = require('array-equal');
var ids = [];
$('body').append('<style>' + style + '</style>');
$('body').append("<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'>");
var defs = {
  showBtnList: true,
  lang: 'en',
  mark: {
    align: {
      default: 'left',
      left: 'class="left"',
      center: 'class="center"',
      right: 'class="right"'
    }
  }
};

var Spread = function (_aTemplate) {
  _inherits(Spread, _aTemplate);

  function Spread(ele, option) {
    _classCallCheck(this, Spread);

    var _this = _possibleConstructorReturn(this, (Spread.__proto__ || Object.getPrototypeOf(Spread)).call(this));

    _this.id = _this.getRandText(10);
    _this.addTemplate(template, _this.id);
    _this.data = $.extend({}, defs, option);
    _this.data.point = { x: -1, y: -1 };
    _this.data.selectedRowNo = -1;
    _this.data.selectedColNo = -1;
    _this.data.showBtnList = true;
    _this.data.row = _this.parse($(ele).html());
    _this.data.highestRow = _this.highestRow;
    _this.data.history = [];
    _this.data.history.push(clone(_this.data.row));
    _this.convert = {};
    _this.convert.noToEn = _this.noToEn;
    _this.convert.getStyleByAlign = _this.getStyleByAlign;
    $(ele).wrap("<div data-id='" + _this.id + "'></div>");
    $(ele).remove();
    _this.update();
    return _this;
  }

  _createClass(Spread, [{
    key: 'highestRow',
    value: function highestRow() {
      var arr = [];
      this.data.row.forEach(function (item, i) {
        if (!item || !item.col) {
          return;
        }
        item.col.forEach(function (obj, t) {
          var length = parseInt(obj.colspan);
          for (var i = 0; i < length; i++) {
            arr.push(i);
          }
        });
      });
      return arr;
    }
  }, {
    key: 'getCellByIndex',
    value: function getCellByIndex(x, y) {
      return $("[data-id='" + this.id + "'] [data-cell-id='" + x + '-' + y + "']");
    }
  }, {
    key: 'getCellInfoByIndex',
    value: function getCellInfoByIndex(x, y) {
      var id = this.id;
      var $cell = this.getCellByIndex(x, y);
      if ($cell.length == 0) {
        return false;
      }
      var left = $cell.offset().left;
      var top = $cell.offset().top;
      var returnLeft = -1;
      var returnTop = -1;
      var width = parseInt($cell.attr('colspan'));
      var height = parseInt($cell.attr('rowspan'));
      $("[data-id='" + this.id + "'] .js-table-header th").each(function (i) {
        if ($(this).offset().left === left) {
          returnLeft = i;
        }
      });
      $("[data-id='" + this.id + "'] .js-table-side").each(function (i) {
        if ($(this).offset().top === top) {
          returnTop = i;
        }
      });
      return { x: returnLeft - 1, y: returnTop, width: width, height: height };
    }
  }, {
    key: 'getLargePoint',
    value: function getLargePoint() {
      var minXArr = [];
      var minYArr = [];
      var maxXArr = [];
      var maxYArr = [];
      for (var i = 0, n = arguments.length; i < n; i++) {
        minXArr.push(arguments[i].x);
        minYArr.push(arguments[i].y);
        maxXArr.push(arguments[i].x + arguments[i].width);
        maxYArr.push(arguments[i].y + arguments[i].height);
      }
      var minX = Math.min.apply(Math, minXArr);
      var minY = Math.min.apply(Math, minYArr);
      var maxX = Math.max.apply(Math, maxXArr);
      var maxY = Math.max.apply(Math, maxYArr);
      return { x: minX, y: minY, width: maxX - minX, height: maxY - minY };
    }
  }, {
    key: 'getSelectedPoints',
    value: function getSelectedPoints() {
      var arr = [];
      var self = this;
      this.data.row.forEach(function (item, i) {
        if (!item.col) {
          return false;
        }
        item.col.forEach(function (obj, t) {
          if (obj.selected) {
            var point = self.getCellInfoByIndex(t, i);
            if (point) {
              arr.push(point);
            }
          }
        });
      });
      return arr;
    }
  }, {
    key: 'getSelectedPoint',
    value: function getSelectedPoint() {
      var arr = this.getSelectedPoints();
      if (arr && arr[0]) {
        return arr[0];
      }
    }
  }, {
    key: 'getAllPoints',
    value: function getAllPoints() {
      var arr = [];
      var self = this;
      this.data.row.forEach(function (item, i) {
        if (!item || !item.col) {
          return;
        }
        item.col.forEach(function (obj, t) {
          var point = self.getCellInfoByIndex(t, i);
          if (point) {
            arr.push(point);
          }
        });
      });
      return arr;
    }
  }, {
    key: 'getCellIndexByPos',
    value: function getCellIndexByPos(x, y) {
      var a, b;
      var self = this;
      this.data.row.forEach(function (item, i) {
        if (!item || !item.col) {
          return;
        }
        item.col.forEach(function (obj, t) {
          var point = self.getCellInfoByIndex(t, i);
          if (point.x == x && point.y == y) {
            a = t;
            b = i;
          }
        });
      });
      return { row: b, col: a };
    }
  }, {
    key: 'getCellByPos',
    value: function getCellByPos(x, y) {
      var index = this.getCellIndexByPos(x, y);
      if (!this.data.row[index.row]) {
        return;
      }
      return this.data.row[index.row].col[index.col];
    }
  }, {
    key: 'hitTest',
    value: function hitTest(point1, point2) {
      if (point1.x < point2.x + point2.width && point2.x < point1.x + point1.width && point1.y < point2.y + point2.height && point2.y < point1.y + point1.height) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: 'selectRange',
    value: function selectRange(a, b) {
      if (!this.data.point) {
        return;
      }
      var self = this;
      this.data.row[a].col[b].selected = true;
      var points = this.getSelectedPoints();
      var point3 = this.getLargePoint.apply(null, points);
      this.data.row.forEach(function (item, i) {
        if (!item || !item.col) {
          return false;
        }
        item.col.forEach(function (obj, t) {
          var point = self.getCellInfoByIndex(t, i);
          if (point && self.hitTest(point3, point)) {
            obj.selected = true;
          }
        });
      });
      if (points.length > 1) {
        this.update();
      }
    }
  }, {
    key: 'select',
    value: function select(a, b) {
      this.data.point = { x: b, y: a };
      this.data.row.forEach(function (item, i) {
        if (!item || !item.col) {
          return false;
        }
        item.col.forEach(function (obj, t) {
          if (i !== a || t !== b) {
            obj.selected = false;
          }
        });
      });
      if (!this.data.row[a].col[b].selected) {
        this.data.row[a].col[b].selected = true;
      }
    }
  }, {
    key: 'unselectCells',
    value: function unselectCells() {
      this.data.row.forEach(function (item, i) {
        if (!item || !item.col) {
          return false;
        }
        item.col.forEach(function (obj, t) {
          obj.selected = false;
        });
      });
    }
  }, {
    key: 'removeCell',
    value: function removeCell(cell) {
      var row = this.data.row;
      for (var i = 0, n = row.length; i < n; i++) {
        var col = row[i].col;
        for (var t = 0, m = col.length; t < m; t++) {
          var obj = col[t];
          if (obj === cell) {
            col.splice(t, 1);
            t--;
            m--;
          }
        }
      }
    }
  }, {
    key: 'removeSelectedCellExcept',
    value: function removeSelectedCellExcept(cell) {
      var row = this.data.row;
      for (var i = 0, n = row.length; i < n; i++) {
        var col = row[i].col;
        for (var t = 0, m = col.length; t < m; t++) {
          var obj = col[t];
          if (obj !== cell && obj.selected) {
            col.splice(t, 1);
            t--;
            m--;
          }
        }
      }
    }
  }, {
    key: 'contextmenu',
    value: function contextmenu() {
      var $ele = $("[data-id='" + this.id + "']");
      var $target = $(this.e.target);
      this.e.preventDefault();
      this.data.showMenu = true;
      this.data.menuX = this.e.clientX;
      this.data.menuY = this.e.clientY;
      this.update();
    }
  }, {
    key: 'parse',
    value: function parse(html) {
      var arr1 = [];
      $('tr', html).each(function () {
        var ret2 = {};
        var arr2 = [];
        ret2.col = arr2;
        $('th,td', this).each(function () {
          var obj = {};
          if ($(this).is('th')) {
            obj.type = 'th';
          } else {
            obj.type = 'td';
          }
          obj.colspan = $(this).attr('colspan') || 1;
          obj.rowspan = $(this).attr('rowspan') || 1;
          obj.value = $(this).html();
          arr2.push(obj);
        });
        arr1.push(ret2);
      });
      return arr1;
    }
  }, {
    key: 'getTable',
    value: function getTable() {
      return this.getHtml(returnTable, true);
    }
  }, {
    key: 'getMarkdown',
    value: function getMarkdown() {
      return toMarkdown(this.getHtml(returnTable, true));
    }
  }, {
    key: 'onUpdated',
    value: function onUpdated() {
      var points = this.getAllPoints();
      var point = this.getLargePoint.apply(null, points);
      var width = point.width;
      var $th = $('.js-table-header th', "[data-id='" + this.id + "']");
      $th.each(function (i) {
        if (i > width) {
          $(this).remove();
        }
      });
      if (this.afterRendered) {
        this.afterRendered();
      }
    }
  }, {
    key: 'undo',
    value: function undo() {
      var data = this.data.row;
      if (this.data.history.length === 0) {
        return;
      }
      while (equals(data, this.data.row)) {
        data = this.data.history.pop();
      }

      if (data) {
        if (this.data.history.length === 0) {
          this.data.history.push(clone(data));
        }
        this.data.row = data;
        this.update();
      }
    }
    // 行の追加

  }, {
    key: 'insertRow',
    value: function insertRow(a, row) {
      if (this.data.row[a]) {
        this.data.row.splice(a, 0, { col: row });
      } else if (this.data.row.length == a) {
        this.data.row.push({ col: row });
      }
    }
  }, {
    key: 'insertCellAt',
    value: function insertCellAt(a, b, item) {
      if (this.data.row[a] && this.data.row[a].col) {
        this.data.row[a].col.splice(b, 0, item);
      }
    }
  }, {
    key: 'selectRowViaBtn',
    value: function selectRowViaBtn(i) {
      this.unselectCells();
      this.data.mode = 'col';
      this.data.selectedColNo = -1;
      this.data.selectedRowNo = i;
      this.contextmenu();
      this.update();
    }
  }, {
    key: 'selectRow',
    value: function selectRow(i) {
      if (this.e.type == 'contextmenu') {
        this.unselectCells();
        this.contextmenu();
      } else if (this.e.type == 'click') {
        this.unselectCells();
        this.data.showMenu = false;
      } else {
        return;
      }
      this.data.mode = 'col';
      this.data.selectedColNo = -1;
      this.data.selectedRowNo = i;
      this.update();
    }
  }, {
    key: 'selectCol',
    value: function selectCol(i) {
      if (this.e.type == 'contextmenu') {
        this.unselectCells();
        this.contextmenu();
      } else if (this.e.type == 'click') {
        this.unselectCells();
        this.data.showMenu = false;
      } else {
        return;
      }
      this.data.mode = 'row';
      this.data.selectedRowNo = -1;
      this.data.selectedColNo = i;
      this.update();
    }
  }, {
    key: 'selectColViaBtn',
    value: function selectColViaBtn(i) {
      this.unselectCells();
      this.data.mode = 'row';
      this.data.selectedRowNo = -1;
      this.data.selectedColNo = i;
      this.contextmenu();
      this.update();
    }
  }, {
    key: 'removeCol',
    value: function removeCol(selectedno) {
      this.data.showMenu = false;
      var self = this;
      var points = this.getAllPoints();
      var point1 = this.getLargePoint.apply(null, points);
      var newpoint = { x: parseInt(selectedno), y: 0, width: 1, height: point1.height };
      var targetPoints = [];
      points.forEach(function (point) {
        if (self.hitTest(newpoint, point)) {
          targetPoints.push(point);
        }
      });
      targetPoints.forEach(function (point) {
        var index = self.getCellIndexByPos(point.x, point.y);
        var cell = self.getCellByPos(point.x, point.y);
        if (cell.colspan == 1) {
          self.removeCell(cell);
        } else {
          cell.colspan = parseInt(cell.colspan) - 1;
        }
      });
      this.data.history.push(clone(this.data.row));
      this.update();
    }
  }, {
    key: 'removeRow',
    value: function removeRow(selectedno) {
      this.data.showMenu = false;
      var self = this;
      var points = this.getAllPoints();
      var point1 = this.getLargePoint.apply(null, points);
      selectedno = parseInt(selectedno);
      var newpoint = { x: 0, y: selectedno, width: point1.width, height: 1 };
      var nextpoint = { x: 0, y: selectedno + 1, width: point1.width, height: 1 };
      var targetPoints = [];
      var removeCells = [];
      var insertCells = [];
      points.forEach(function (point) {
        if (self.hitTest(newpoint, point)) {
          targetPoints.push(point);
        }
      });
      points.forEach(function (point) {
        if (self.hitTest(nextpoint, point)) {
          var cell = self.getCellByPos(point.x, point.y);
          cell.x = point.x;
          if (point.y == nextpoint.y) {
            insertCells.push(cell);
          }
        }
      });
      targetPoints.forEach(function (point) {
        var cell = self.getCellByPos(point.x, point.y);
        if (cell.rowspan == 1) {
          removeCells.push(cell);
        } else {
          cell.rowspan = parseInt(cell.rowspan) - 1;
          if (selectedno == point.y) {
            cell.x = point.x;
            insertCells.push(cell);
          }
        }
      });
      insertCells.sort(function (a, b) {
        if (a.x > b.x) {
          return 1;
        } else {
          return -1;
        }
      });
      removeCells.forEach(function (cell) {
        self.removeCell(cell);
      });
      this.data.row.splice(selectedno, 1);
      if (insertCells.length > 0) {
        this.data.row[selectedno] = { col: insertCells };
      }
      this.data.history.push(clone(this.data.row));
      this.update();
    }
  }, {
    key: 'updateTable',
    value: function updateTable(b, a) {
      if (this.e.type === 'mouseup' && this.data.showMenu) {
        return;
      }
      a = parseInt(a);
      b = parseInt(b);
      this.data.mode = 'cell';
      this.data.selectedRowNo = -1;
      this.data.selectedColNo = -1;
      this.data.showMenu = false;
      if (this.e.type == 'click') {
        if (this.e.shiftKey) {
          this.selectRange(a, b);
        }
      } else if (this.e.type == 'mousedown') {
        if (this.e.button !== 2 && !this.e.ctrlKey) {
          this.mousedown = true;
          if (!this.data.row[a].col[b].selected) {
            this.select(a, b);
            this.update();
          } else {
            this.select(a, b);
          }
        }
      } else if (this.e.type == 'mousemove') {
        if (this.mousedown) {
          this.selectRange(a, b);
        }
      } else if (this.e.type == 'mouseup') {
        this.mousedown = false;
        this.selectRange(a, b);
      } else if (this.e.type == 'contextmenu') {
        this.mousedown = false;
        this.contextmenu();
      } else {
        this.data.row[a].col[b].value = $(this.e.target).html();
        if (this.afterEntered) {
          this.afterEntered();
        }
      }
    }
  }, {
    key: 'insertColRight',
    value: function insertColRight(selectedno) {
      this.data.selectedRowNo = parseInt(selectedno);
      this.data.showMenu = false;
      var self = this;
      var points = this.getAllPoints();
      var point1 = this.getLargePoint.apply(null, points);
      var newpoint = { x: parseInt(selectedno), y: 0, width: 1, height: point1.height };
      var targetPoints = [];
      points.forEach(function (point) {
        if (self.hitTest(newpoint, point)) {
          targetPoints.push(point);
        }
      });
      targetPoints.forEach(function (point) {
        var index = self.getCellIndexByPos(point.x, point.y);
        var cell = self.getCellByPos(point.x, point.y);
        var newcell = { type: 'td', colspan: 1, rowspan: cell.rowspan, value: '' };
        if (typeof index.row !== 'undefined' && typeof index.col !== 'undefined') {
          if (point.width + point.x - newpoint.x > 1) {
            cell.colspan = parseInt(cell.colspan) + 1;
            cell.colspan += '';
          } else {
            self.insertCellAt(index.row, index.col + 1, newcell);
          }
        }
      });
      this.data.history.push(clone(this.data.row));
      this.update();
    }
  }, {
    key: 'insertColLeft',
    value: function insertColLeft(selectedno) {
      this.data.selectedRowNo = parseInt(selectedno) + 1;
      this.data.showMenu = false;
      var self = this;
      var points = this.getAllPoints();
      var point1 = this.getLargePoint.apply(null, points);
      var newpoint = { x: parseInt(selectedno) - 1, y: 0, width: 1, height: point1.height };
      var targetPoints = [];
      points.forEach(function (point) {
        if (self.hitTest(newpoint, point)) {
          targetPoints.push(point);
        }
      });
      if (selectedno == 0) {
        var length = point1.height;
        for (var i = 0; i < length; i++) {
          var newcell = { type: 'td', colspan: 1, rowspan: 1, value: '' };
          self.insertCellAt(i, 0, newcell);
        }
        self.update();
        return;
      }
      targetPoints.forEach(function (point) {
        var index = self.getCellIndexByPos(point.x, point.y);
        var cell = self.getCellByPos(point.x, point.y);
        var newcell = { type: 'td', colspan: 1, rowspan: cell.rowspan, value: '' };
        if (typeof index.row !== 'undefined' && typeof index.col !== 'undefined') {
          if (point.width + point.x - newpoint.x > 1) {
            cell.colspan = parseInt(cell.colspan) + 1;
            cell.colspan += '';
          } else {
            self.insertCellAt(index.row, index.col + 1, newcell);
          }
        }
      });
      this.data.history.push(clone(this.data.row));
      this.update();
    }
  }, {
    key: 'insertRowBelow',
    value: function insertRowBelow(selectedno) {
      this.data.showMenu = false;
      this.data.selectedColNo = parseInt(selectedno);
      var self = this;
      var points = this.getAllPoints();
      var point1 = this.getLargePoint.apply(null, points);
      selectedno = parseInt(selectedno);
      var newpoint = { x: 0, y: selectedno + 1, width: point1.width, height: 1 };
      var targetPoints = [];
      var newRow = [];
      points.forEach(function (point) {
        if (self.hitTest(newpoint, point)) {
          targetPoints.push(point);
        }
      });
      if (targetPoints.length == 0) {
        var length = point1.width;
        for (var i = 0; i < length; i++) {
          var newcell = { type: 'td', colspan: 1, rowspan: 1, value: '' };
          newRow.push(newcell);
        }
        self.insertRow(selectedno + 1, newRow);
        self.update();
        return;
      }
      targetPoints.forEach(function (point) {
        var index = self.getCellIndexByPos(point.x, point.y);
        var cell = self.getCellByPos(point.x, point.y);
        if (!cell) {
          return;
        }
        var newcell = { type: 'td', colspan: 1, rowspan: 1, value: '' };
        if (typeof index.row !== 'undefined' && typeof index.col !== 'undefined') {
          if (point.height > 1 && point.y <= selectedno) {
            cell.rowspan = parseInt(cell.rowspan) + 1;
            cell.rowspan += '';
          } else if (index.row == selectedno + 1) {
            var length = parseInt(cell.colspan);
            for (var i = 0; i < length; i++) {
              newRow.push({ type: 'td', colspan: 1, rowspan: 1, value: '' });
            }
          } else {
            self.insertCellAt(index.row + 1, index.col, newcell);
          }
        }
      });
      this.insertRow(selectedno + 1, newRow);
      this.data.history.push(clone(this.data.row));
      this.update();
    }
  }, {
    key: 'insertRowAbove',
    value: function insertRowAbove(selectedno) {
      this.data.showMenu = false;
      this.data.selectedColNo = parseInt(selectedno) + 1;
      var self = this;
      var points = this.getAllPoints();
      var point1 = this.getLargePoint.apply(null, points);
      selectedno = parseInt(selectedno);
      var newpoint = { x: 0, y: selectedno - 1, width: point1.width, height: 1 };
      var targetPoints = [];
      var newRow = [];
      points.forEach(function (point) {
        if (self.hitTest(newpoint, point)) {
          targetPoints.push(point);
        }
      });
      if (selectedno == 0) {
        var length = point1.width;
        for (var i = 0; i < length; i++) {
          var newcell = { type: 'td', colspan: 1, rowspan: 1, value: '' };
          newRow.push(newcell);
        }
        self.insertRow(0, newRow);
        self.update();
        return;
      }
      targetPoints.forEach(function (point) {
        var index = self.getCellIndexByPos(point.x, point.y);
        var cell = self.getCellByPos(point.x, point.y);
        if (!cell) {
          return;
        }
        var newcell = { type: 'td', colspan: 1, rowspan: 1, value: '' };
        if (typeof index.row !== 'undefined' && typeof index.col !== 'undefined') {
          if (point.height > 1) {
            cell.rowspan = parseInt(cell.rowspan) + 1;
            cell.rowspan += '';
          } else if (index.row == selectedno - 1) {
            var length = parseInt(cell.colspan);
            for (var i = 0; i < length; i++) {
              newRow.push({ type: 'td', colspan: 1, rowspan: 1, value: '' });
            }
          } else {
            self.insertCellAt(index.row, index.col, newcell);
          }
        }
      });
      this.insertRow(selectedno, newRow);
      this.data.history.push(clone(this.data.row));
      this.update();
    }
  }, {
    key: 'mergeCells',
    value: function mergeCells() {
      var points = this.getSelectedPoints();
      var point = this.getLargePoint.apply(null, points);
      var cell = this.getCellByPos(point.x, point.y);
      this.removeSelectedCellExcept(cell);
      cell.colspan = point.width;
      cell.rowspan = point.height;
      this.data.showMenu = false;
      this.data.history.push(clone(this.data.row));
      this.update();
    }
  }, {
    key: 'splitCell',
    value: function splitCell() {
      var selectedPoint = this.getSelectedPoint();
      var bound = { x: 0, y: selectedPoint.y, width: selectedPoint.x, height: selectedPoint.height };
      var points = this.getAllPoints();
      var currentIndex = this.getCellIndexByPos(selectedPoint.x, selectedPoint.y);
      var currentCell = this.getCellByPos(selectedPoint.x, selectedPoint.y);
      var width = parseInt(currentCell.colspan);
      var height = parseInt(currentCell.rowspan);
      var self = this;
      var targets = [];
      var cells = [];
      var rows = [];
      points.forEach(function (point) {
        if (self.hitTest(bound, point)) {
          var index = self.getCellIndexByPos(point.x, point.y);
          var cell = self.getCellByPos(point.x, point.y);
          targets.push(index);
        }
      });
      targets.forEach(function (item) {
        var row = item.row;
        if (item.row < currentIndex.row) {
          return;
        }
        if (!rows[row]) {
          rows[row] = [];
        }
        rows[row].push(item);
      });
      for (var i = 1, n = rows.length; i < n; i++) {
        if (!rows[i]) {
          continue;
        }
        rows[i].sort(function (a, b) {
          if (a.col > b.col) {
            return 1;
          } else {
            return -1;
          }
        });
      }
      for (var i = selectedPoint.y, n = i + height; i < n; i++) {
        if (!rows[i]) {
          rows[i] = [];
          rows[i].push({ row: i, col: -1 });
        }
      }
      rows.forEach(function (row) {
        var index = row[row.length - 1];
        for (var i = 0; i < width; i++) {
          self.insertCellAt(index.row, index.col + 1, { type: 'td', colspan: 1, rowspan: 1, value: '', selected: true });
        }
      });
      this.removeCell(currentCell);
      this.data.showMenu = false;
      this.data.history.push(clone(this.data.row));
      this.update();
    }
  }, {
    key: 'changeCellTypeTo',
    value: function changeCellTypeTo(type) {
      this.data.row.forEach(function (item, i) {
        item.col.forEach(function (obj, t) {
          if (obj.selected) {
            obj.type = type;
          }
        });
      });
      this.data.showMenu = false;
      this.data.history.push(clone(this.data.row));
      this.update();
    }
  }, {
    key: 'align',
    value: function align(_align) {
      this.data.row.forEach(function (item, i) {
        item.col.forEach(function (obj, t) {
          if (obj.selected) {
            obj.align = _align;
          }
        });
      });
      this.data.showMenu = false;
      this.data.history.push(clone(this.data.row));
      this.update();
    }
  }, {
    key: 'noToEn',
    value: function noToEn(i) {
      return String.fromCharCode(97 + parseInt(i));
    }
  }, {
    key: 'getStyleByAlign',
    value: function getStyleByAlign(align) {
      if (this.data.mark.align.default === align) {
        return '';
      }
      return ' ' + this.data.mark.align[align];
    }
  }]);

  return Spread;
}(aTemplate);

module.exports = Spread;
