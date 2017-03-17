'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _aTemplate2 = require('a-template');

var _aTemplate3 = _interopRequireDefault(_aTemplate2);

var _zeptoBrowserify = require('zepto-browserify');

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var template = '<!-- BEGIN showMenu:exist --><ul class="a-table-menu" style="top:{menuY}px;left:{menuX}px;">	<!-- BEGIN mode:touch#cell -->	<li data-action-click="mergeCells"><!-- BEGIN lang:touch#ja -->セルの結合<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->merge cells<!-- END lang:touch#en --></li>	<li data-action-click="splitCell()"><!-- BEGIN lang:touch#ja -->セルの分割<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->split cell<!-- END lang:touch#en --></li>	<li data-action-click="changeCellTypeTo(th)"><!-- BEGIN lang:touch#ja -->thに変更する<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->change to th<!-- END lang:touch#en --></li>	<li data-action-click="changeCellTypeTo(td)"><!-- BEGIN lang:touch#ja -->tdに変更する<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->change to td<!-- END lang:touch#en --></li>	<li data-action-click="align(left)"><!-- BEGIN lang:touch#ja -->左寄せ<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->align left<!-- END lang:touch#en --></li>	<li data-action-click="align(center)"><!-- BEGIN lang:touch#ja -->中央寄せ<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->align center<!-- END lang:touch#en --></li>	<li data-action-click="align(right)"><!-- BEGIN lang:touch#ja -->右寄せ<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->align right<!-- END lang:touch#en --></li>	<!-- END mode:touch#cell -->	<!-- BEGIN mode:touch#col -->	<li data-action-click="insertColLeft({selectedRowNo})"><!-- BEGIN lang:touch#ja -->左に列を追加<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->insert column on the left<!-- END lang:touch#en --></li>	<li data-action-click="insertColRight({selectedRowNo})"><!-- BEGIN lang:touch#ja -->右に列を追加<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->insert column on the right<!-- END lang:touch#en --></li>	<li data-action-click="removeCol({selectedRowNo})"><!-- BEGIN lang:touch#ja -->列を削除<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->remove column<!-- END lang:touch#en --></li>	<!-- END mode:touch#col -->	<!-- BEGIN mode:touch#row -->	<li data-action-click="insertRowAbove({selectedColNo})"><!-- BEGIN lang:touch#ja -->上に行を追加<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->insert row above<!-- END lang:touch#en --></li>	<li data-action-click="insertRowBelow({selectedColNo})"><!-- BEGIN lang:touch#ja -->下に行を追加<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->insert row below<!-- END lang:touch#en --></li>	<li data-action-click="removeRow({selectedColNo})"><!-- BEGIN lang:touch#ja -->行を削除<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->remove row<!-- END lang:touch#en --></li>	<!-- END mode:touch#row --></ul><!-- END showMenu:exist --><div class="a-table-wrapper">	<!-- BEGIN inputMode:touch#table -->	<table class="a-table">		<tr class="a-table-header js-table-header">			<th class="a-table-first"></th>			<!-- BEGIN highestRow:loop -->			<th data-action-click="selectRow({i})"<!-- \\BEGIN selectedRowNo:touch#{i} -->class="selected"<!-- \\END selectedRowNo:touch#{i} -->><span class="a-table-toggle-btn"></span></th>			<!-- END highestRow:loop -->		</tr>		<!-- BEGIN row:loop -->		<tr>			<th class="a-table-side js-table-side<!-- \\BEGIN selectedColNo:touch#{i} --> selected<!-- \\END selectedColNo:touch#{i} -->" data-action-click="selectCol({i})"><span class="a-table-toggle-btn"></span></th>			<!-- \\BEGIN row.{i}.col:loop -->			<td colspan="\\{colspan\\}" rowspan="\\{rowspan\\}" data-action="updateTable(\\{i\\},{i})" data-cell-id="\\{i\\}-{i}" class="<!-- \\BEGIN selected:exist -->a-table-selected<!-- \\END selected:exist --><!-- \\BEGIN type:touch#th --> a-table-th<!-- END \\type:touch#th --><!-- \\BEGIN mark.top:exist --> a-table-border-top<!-- \\END mark.top:exist --><!-- \\BEGIN mark.right:exist --> a-table-border-right<!-- \\END mark.right:exist --><!-- \\BEGIN mark.bottom:exist --> a-table-border-bottom<!-- \\END mark.bottom:exist --><!-- \\BEGIN mark.left:exist --> a-table-border-left<!-- \\END mark.left:exist --><!-- \\BEGIN cellClass:exist --> \\{cellClass\\}<!-- \\END cellClass:exist -->"><div class="a-table-editable \\{align\\}" contenteditable>\\{value\\}</div></td>			<!-- \\END row.{i}.col:loop -->		</tr>		<!-- END row:loop -->	</table>	<!-- END inputMode:touch#table -->	<!-- BEGIN inputMode:touch#source -->	<textarea data-bind="tableResult" class="a-table-textarea" data-action-input="updateResult"></textarea>	<!-- END inputMode:touch#source --></div>';
var menu = '<!-- BEGIN showBtnList:exist --><div class="a-table-btn-group-list">	<div class="\\{mark.btn.group\\}">		<!-- BEGIN inputMode:touch#table -->		<button type="button" class="\\{mark.btn.item\\}" data-action-click="changeInputMode(source)"><i class="\\{mark.icon.source\\}"></i><!-- BEGIN lang:touch#ja -->ソース<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->Source<!-- END lang:touch#en --></button>		<!-- END inputMode:touch#table -->		<!-- BEGIN inputMode:touch#source -->		<button type="button" class="\\{mark.btn.itemActive\\}" data-action-click="changeInputMode(table)"><i class="\\{mark.icon.source\\}"></i><!-- BEGIN lang:touch#ja -->ソース<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->Source<!-- END lang:touch#en --></button>		<!-- END inputMode:touch#source -->	</div>	<div class="\\{mark.btn.group\\}">		<button type="button" class="\\{mark.btn.item\\}" data-action-click="mergeCells"><i class="\\{mark.icon.merge\\}"></i></button>		<button type="button" class="\\{mark.btn.item\\}" data-action-click="splitCell()"><i class="\\{mark.icon.split\\}"></i></button>		<button type="button" class="\\{mark.btn.item\\}" data-action-click="undo()"><i class="\\{mark.icon.undo\\}"></i></button>	</div>	<div class="\\{mark.btn.group\\}">		<button type="button" class="\\{mark.btn.item\\}" data-action-click="changeCellTypeTo(td)"><!-- BEGIN mark.icon.td:empty -->td<!-- END mark.icon.td:empty --><!-- BEGIN mark.icon.td:exist --><i class="\\{mark.icon.td\\}"></i><!-- END mark.icon.td:exist --></button>		<button type="button" class="\\{mark.btn.item\\}" data-action-click="changeCellTypeTo(th)"><!-- BEGIN mark.icon.th:empty -->th<!-- END mark.icon.th:empty --><!-- BEGIN mark.icon.th:exist --><i class="\\{mark.icon.th\\}"></i><!-- END mark.icon.th:exist --></button>	</div>	<div class="\\{mark.btn.group\\}">		<button type="button" class="\\{mark.btn.item\\}" data-action-click="align(left)"><i class="\\{mark.icon.alignLeft\\}"></i></button>		<button type="button" class="\\{mark.btn.item\\}" data-action-click="align(center)"><i class="\\{mark.icon.alignCenter\\}"></i></button>		<button type="button" class="\\{mark.btn.item\\}" data-action-click="align(right)"><i class="\\{mark.icon.alignRight\\}"></i></button>	</div>	<div class="\\{mark.btn.group\\}">		<select class="\\{mark.selector.self\\}" data-bind="cellClass" data-action-change="changeCellClass()">			<option value=""></option>			<!-- BEGIN selector.option:loop -->			<option value="{value}">{label}</option>			<!-- END selector.option:loop -->		</select>	</div></div><!-- END showBtnList:exist -->';
var returnTable = '<table class="{tableClass}">	<!-- BEGIN row:loop -->	<tr>		<!-- \\BEGIN row.{i}.col:loop -->		<!-- \\BEGIN type:touch#th -->		<th<!-- \\BEGIN colspan:touchnot#1 --> colspan="\\{colspan\\}"<!-- \\END colspan:touchnot#1 --><!-- \\BEGIN rowspan:touchnot#1 --> rowspan="\\{rowspan\\}"<!-- \\END rowspan:touchnot#1 --> class="<!-- \\BEGIN align:exist -->\\{align\\}[getStyleByAlign]<!-- \\END align:exist --><!-- \\BEGIN cellClass:exist --> \\{cellClass\\}<!-- \\END cellClass:exist -->">\\{value\\}</th>		<!-- \\END type:touch#th -->		<!-- \\BEGIN type:touch#td -->		<td<!-- \\BEGIN colspan:touchnot#1 --> colspan="\\{colspan\\}"<!-- \\END colspan:touchnot#1 --><!-- \\BEGIN rowspan:touchnot#1 --> rowspan="\\{rowspan\\}"<!-- \\END rowspan:touchnot#1 --> class="<!-- \\BEGIN align:exist -->\\{align\\}[getStyleByAlign] <!-- \\END align:exist --><!-- \\BEGIN cellClass:exist -->\\{cellClass\\}<!-- \\END cellClass:exist -->">\\{value\\}</td>		<!-- \\END type:touch#td -->		<!-- \\END row.{i}.col:loop -->	</tr>	<!-- END row:loop --></table>';

var defs = {
  showBtnList: true,
  lang: 'en',
  mark: {
    align: {
      default: 'left',
      left: 'left',
      center: 'center',
      right: 'right'
    },
    btn: {
      group: 'a-table-btn-list',
      item: 'a-table-btn',
      itemActive: 'a-table-btn-active'
    },
    icon: {
      alignLeft: 'a-table-icon a-table-icon-left',
      alignCenter: 'a-table-icon a-table-icon-center',
      alignRight: 'a-table-icon a-table-icon-right',
      undo: 'a-table-icon a-table-icon-undo',
      merge: 'a-table-icon a-table-icon-merge02',
      split: 'a-table-icon a-table-icon-split02',
      table: 'a-table-icon a-table-icon-th02',
      source: 'a-table-icon a-table-icon-source01',
      td: 'a-table-icon a-table-icon-td03',
      th: 'a-table-icon a-table-icon-th02'
    },
    selector: {
      self: 'a-table-selector'
    }
  }
};

var aTable = function (_aTemplate) {
  _inherits(aTable, _aTemplate);

  function aTable(ele, option) {
    _classCallCheck(this, aTable);

    var _this = _possibleConstructorReturn(this, (aTable.__proto__ || Object.getPrototypeOf(aTable)).call(this));

    _this.id = aTable.getUniqId();
    _this.menu_id = aTable.getUniqId();
    _this.addTemplate(_this.id, template);
    _this.addTemplate(_this.menu_id, menu);
    _this.data = _zeptoBrowserify.$.extend(true, {}, defs, option);
    var data = _this.data;
    data.point = { x: -1, y: -1 };
    data.selectedRowNo = -1;
    data.selectedColNo = -1;
    data.showBtnList = true;
    data.row = _this.parse((0, _zeptoBrowserify.$)(ele).html());
    data.tableClass = _this.getTableClass(data.tableResult);
    data.highestRow = _this.highestRow;
    data.history = [];
    data.inputMode = 'table';
    data.cellClass = '';
    data.history.push((0, _clone2.default)(data.row));
    _this.convert = {};
    _this.convert.getStyleByAlign = _this.getStyleByAlign;
    _this.convert.setClass = _this.setClass;
    var html = '\n    <div class=\'a-table-container\'>\n        <div data-id=\'' + _this.menu_id + '\'></div>\n        <div class=\'a-table-outer\'>\n          <div class=\'a-table-inner\'>\n            <div data-id=\'' + _this.id + '\'></div>\n          </div>\n        </div>\n    </div>';
    (0, _zeptoBrowserify.$)(ele).before(html);
    (0, _zeptoBrowserify.$)(ele).remove();
    _this.update();
    return _this;
  }

  _createClass(aTable, [{
    key: 'highestRow',
    value: function highestRow() {
      var arr = [];
      var firstRow = this.data.row[0];
      var i = 0;
      if (!firstRow) {
        return arr;
      }
      var row = firstRow.col;
      row.forEach(function (item) {
        var length = parseInt(item.colspan);
        for (var t = 0; t < length; t++) {
          arr.push(i);
          i++;
        }
      });
      return arr;
    }
  }, {
    key: 'getCellByIndex',
    value: function getCellByIndex(x, y) {
      return (0, _zeptoBrowserify.$)('[data-id=\'' + this.id + '\'] [data-cell-id=\'' + x + '-' + y + '\']');
    }
  }, {
    key: 'getCellInfoByIndex',
    value: function getCellInfoByIndex(x, y) {
      var id = this.id;
      var $cell = this.getCellByIndex(x, y);
      if ($cell.length === 0) {
        return false;
      }
      var left = $cell.offset().left;
      var top = $cell.offset().top;
      var returnLeft = -1;
      var returnTop = -1;
      var width = parseInt($cell.attr('colspan'));
      var height = parseInt($cell.attr('rowspan'));
      (0, _zeptoBrowserify.$)('[data-id=\'' + this.id + '\'] .js-table-header th').each(function (i) {
        if ((0, _zeptoBrowserify.$)(this).offset().left === left) {
          returnLeft = i;
        }
      });
      (0, _zeptoBrowserify.$)('[data-id=\'' + this.id + '\'] .js-table-side').each(function (i) {
        if ((0, _zeptoBrowserify.$)(this).offset().top === top) {
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
      var a = void 0,
          b = void 0;
      var self = this;
      this.data.row.forEach(function (item, i) {
        if (!item || !item.col) {
          return;
        }
        item.col.forEach(function (obj, t) {
          var point = self.getCellInfoByIndex(t, i);
          if (point.x === x && point.y === y) {
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
      }
      return false;
    }
  }, {
    key: 'markup',
    value: function markup() {
      var data = this.data;
      if (data.splited) {
        data.splited = false;
        return;
      }
      var points = this.getSelectedPoints();
      var point1 = this.getLargePoint.apply(null, points);
      var self = this;
      data.row.forEach(function (item, i) {
        if (!item || !item.col) {
          return false;
        }
        item.col.forEach(function (obj, t) {
          var point = self.getCellInfoByIndex(t, i);
          var mark = {};
          if (obj.selected) {
            if (point.x === point1.x) {
              mark.left = true;
            }
            if (point.x + point.width === point1.x + point1.width) {
              mark.right = true;
            }
            if (point.y === point1.y) {
              mark.top = true;
            }
            if (point.y + point.height === point1.y + point1.height) {
              mark.bottom = true;
            }
          }
          obj.mark = mark;
        });
      });
    }
  }, {
    key: 'selectRange',
    value: function selectRange(a, b) {
      var data = this.data;
      if (!data.point) {
        return;
      }
      var self = this;
      data.row[a].col[b].selected = true;
      var points = this.getSelectedPoints();
      var point3 = this.getLargePoint.apply(null, points);
      data.row.forEach(function (item, i) {
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
      var data = this.data;
      data.point = { x: b, y: a };
      data.row.forEach(function (item, i) {
        if (!item || !item.col) {
          return false;
        }
        item.col.forEach(function (obj, t) {
          if (i !== a || t !== b) {
            obj.selected = false;
          }
        });
      });
      if (!data.row[a].col[b].selected) {
        data.row[a].col[b].selected = true;
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
      var $ele = (0, _zeptoBrowserify.$)('[data-id=\'' + this.id + '\']');
      var $target = (0, _zeptoBrowserify.$)(this.e.target);
      var data = this.data;
      this.e.preventDefault();
      data.showMenu = true;
      data.menuX = this.e.clientX;
      data.menuY = this.e.clientY;
      this.update();
    }
  }, {
    key: 'parse',
    value: function parse(html) {
      var self = this;
      var arr1 = [];
      (0, _zeptoBrowserify.$)('tr', html).each(function () {
        var ret2 = {};
        var arr2 = [];
        ret2.col = arr2;
        (0, _zeptoBrowserify.$)('th,td', this).each(function () {
          var obj = {};
          if ((0, _zeptoBrowserify.$)(this).is('th')) {
            obj.type = 'th';
          } else {
            obj.type = 'td';
          }
          obj.colspan = (0, _zeptoBrowserify.$)(this).attr('colspan') || 1;
          obj.rowspan = (0, _zeptoBrowserify.$)(this).attr('rowspan') || 1;
          obj.value = (0, _zeptoBrowserify.$)(this).html();
          var classAttr = (0, _zeptoBrowserify.$)(this).attr('class');
          var cellClass = '';
          if (classAttr) {
            var classList = classAttr.split(/\s+/);
            classList.forEach(function (item) {
              var align = self.getAlignByStyle(item);
              if (align) {
                obj.align = align;
              } else {
                cellClass += ' ' + item;
              }
            });
          }
          obj.cellClass = cellClass.substr(1);
          arr2.push(obj);
        });
        arr1.push(ret2);
      });
      return arr1;
    }
  }, {
    key: 'parseText',
    value: function parseText(text) {
      var arr1 = [];
      //replace newline codes inside double quotes to <br> tag
      text = text.replace(/"(([\n\r\t]|.)*?)"/g, function (match, str) {
        return str.replace(/[\n\r]/g, '<br>');
      });
      var rows = text.split(String.fromCharCode(13));
      rows.forEach(function (row) {
        var ret2 = {};
        var arr2 = [];
        ret2.col = arr2;
        var cells = row.split(String.fromCharCode(9));
        cells.forEach(function (cell) {
          var obj = {};
          obj.type = 'td';
          obj.colspan = 1;
          obj.rowspan = 1;
          obj.value = cell;
          arr2.push(obj);
        });
        arr1.push(ret2);
      });
      arr1.pop();
      return arr1;
    }
  }, {
    key: 'getTableClass',
    value: function getTableClass(html) {
      return (0, _zeptoBrowserify.$)(html).attr('class');
    }
  }, {
    key: 'toMarkdown',
    value: function toMarkdown(html) {
      var $table = (0, _zeptoBrowserify.$)(html);
      var ret = '';
      $table.find('tr').each(function (i) {
        ret += '| ';
        var $children = (0, _zeptoBrowserify.$)(this).children();
        $children.each(function () {
          ret += (0, _zeptoBrowserify.$)(this).html();
          ret += ' | ';
        });
        if (i === 0) {
          ret += '\n| ';
          $children.each(function () {
            ret += '--- | ';
          });
        }
        ret += '\n';
      });
      return ret;
    }
  }, {
    key: 'getTable',
    value: function getTable() {
      return this.getHtml(returnTable, true).replace(/ class=""/g, '').replace(/class="(.*)? "/g, 'class="$1"');
    }
  }, {
    key: 'getMarkdown',
    value: function getMarkdown() {
      return this.toMarkdown(this.getHtml(returnTable, true));
    }
  }, {
    key: 'onUpdated',
    value: function onUpdated() {
      var points = this.getAllPoints();
      var point = this.getLargePoint.apply(null, points);
      var width = point.width;
      var selectedPoints = this.getSelectedPoints();
      var $th = (0, _zeptoBrowserify.$)('.js-table-header th', '[data-id=\'' + this.id + '\']');
      var $table = (0, _zeptoBrowserify.$)('table', '[data-id=\'' + this.id + '\']');
      var $inner = $table.parents('.a-table-inner');
      var elem = (0, _zeptoBrowserify.$)('.a-table-selected .a-table-editable', '[data-id=\'' + this.id + '\']')[0];
      if (elem && !this.data.showMenu) {
        setTimeout(function () {
          elem.focus();
          if (selectedPoints.length !== 1) {
            return;
          }
          if (typeof window.getSelection !== 'undefined' && typeof document.createRange !== 'undefined') {
            var range = document.createRange();
            range.selectNodeContents(elem);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            sel.addRange(range);
          } else if (typeof document.body.createTextRange !== 'undefined') {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(elem);
            textRange.collapse(false);
            textRange.select();
          }
        }, 1);
      }

      //for scroll
      $inner.width(9999);
      var tableWidth = $table.width();

      if (tableWidth) {
        $inner.width(tableWidth);
      } else {
        $inner.width('auto');
      }

      if (this.afterRendered) {
        this.afterRendered();
      }
    }
  }, {
    key: 'undo',
    value: function undo() {
      var data = this.data;
      var row = data.row;
      var hist = data.history;
      if (data.history.length === 0) {
        return;
      }

      while (JSON.stringify(row) === JSON.stringify(data.row)) {
        row = hist.pop();
      }

      if (row) {
        if (hist.length === 0) {
          hist.push((0, _clone2.default)(row));
        }
        data.row = row;
        this.update();
      }
    }
  }, {
    key: 'insertRow',
    value: function insertRow(a, newrow) {
      var data = this.data;
      var row = data.row;
      if (row[a]) {
        row.splice(a, 0, { col: newrow });
      } else if (row.length === a) {
        row.push({ col: newrow });
      }
    }
  }, {
    key: 'insertCellAt',
    value: function insertCellAt(a, b, item) {
      var data = this.data;
      var row = data.row;
      if (row[a] && row[a].col) {
        row[a].col.splice(b, 0, item);
      }
    }
  }, {
    key: 'selectRow',
    value: function selectRow(i) {
      var data = this.data;
      this.unselectCells();
      data.showMenu = false;
      var points = this.getAllPoints();
      var point1 = this.getLargePoint.apply(null, points);
      var newpoint = { x: parseInt(i), y: 0, width: 1, height: point1.height };
      var targetPoints = [];
      var self = this;
      points.forEach(function (point) {
        if (self.hitTest(newpoint, point)) {
          targetPoints.push(point);
        }
      });
      targetPoints.forEach(function (point) {
        var cell = self.getCellByPos(point.x, point.y);
        cell.selected = true;
      });
      data.mode = 'col';
      data.selectedColNo = -1;
      data.selectedRowNo = i;
      this.contextmenu();
      this.update();
    }
  }, {
    key: 'selectCol',
    value: function selectCol(i) {
      var points = this.getAllPoints();
      var point1 = this.getLargePoint.apply(null, points);
      var newpoint = { x: 0, y: parseInt(i), width: point1.width, height: 1 };
      var targetPoints = [];
      var self = this;
      var data = this.data;
      this.unselectCells();
      data.showMenu = false;
      points.forEach(function (point) {
        if (self.hitTest(newpoint, point)) {
          targetPoints.push(point);
        }
      });
      targetPoints.forEach(function (point) {
        var cell = self.getCellByPos(point.x, point.y);
        cell.selected = true;
      });
      data.mode = 'row';
      data.selectedRowNo = -1;
      data.selectedColNo = i;
      this.contextmenu();
      this.update();
    }
  }, {
    key: 'removeCol',
    value: function removeCol(selectedno) {
      var data = this.data;
      data.showMenu = false;
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
        var cell = self.getCellByPos(point.x, point.y);
        if (cell.colspan === 1) {
          self.removeCell(cell);
        } else {
          cell.colspan = parseInt(cell.colspan) - 1;
        }
      });
      data.history.push((0, _clone2.default)(data.row));
      this.update();
    }
  }, {
    key: 'removeRow',
    value: function removeRow(selectedno) {
      var data = this.data;
      data.showMenu = false;
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
          if (point.y === nextpoint.y) {
            insertCells.push(cell);
          }
        }
      });
      targetPoints.forEach(function (point) {
        var cell = self.getCellByPos(point.x, point.y);
        if (cell.rowspan === 1) {
          removeCells.push(cell);
        } else {
          cell.rowspan = parseInt(cell.rowspan) - 1;
          if (selectedno === point.y) {
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
      data.row.splice(selectedno, 1);
      if (insertCells.length > 0) {
        data.row[selectedno] = { col: insertCells };
      }
      data.history.push((0, _clone2.default)(data.row));
      this.update();
    }
  }, {
    key: 'updateTable',
    value: function updateTable(b, a) {
      var data = this.data;
      var e = this.e;
      var type = e.type;
      var points = this.getSelectedPoints();
      var isSmartPhone = aTable.isSmartPhone();
      if (type === 'mouseup' && this.data.showMenu) {
        return;
      }
      var _ref = [parseInt(a), parseInt(b)];
      a = _ref[0];
      b = _ref[1];

      data.mode = 'cell';
      data.selectedRowNo = -1;
      data.selectedColNo = -1;
      data.showMenu = false;
      if (type === 'compositionstart') {
        data.beingInput = true;
      } else if (type === 'compositionend') {
        data.beingInput = false;
      } else if (type === 'click' && !isSmartPhone) {
        if (this.e.shiftKey) {
          this.selectRange(a, b);
        }
      } else if (type === 'copy') {
        this.copyTable(e, points);
      } else if (type === 'paste') {
        this.pasteTable(e);
      } else if (type === 'mousedown' && !isSmartPhone) {
        if (this.e.button !== 2 && !this.e.ctrlKey) {
          this.mousedown = true;
          if (!this.data.beingInput) {
            if (points.length !== 1 || !this.data.row[a].col[b].selected) {
              this.select(a, b);
              this.update();
            }
          }
        }
      } else if (type === 'mousemove' && !isSmartPhone) {
        if (this.mousedown) {
          this.selectRange(a, b);
        }
      } else if (type === 'mouseup' && !isSmartPhone) {
        this.mousedown = false;
      } else if (type === 'contextmenu') {
        this.mousedown = false;
        this.contextmenu();
      } else if (type === 'touchstart') {
        if (points.length !== 1 || !this.data.row[a].col[b].selected) {
          if (!this.data.beingInput) {
            this.select(a, b);
            this.update();
          }
        }
      } else if (type === 'input') {
        if ((0, _zeptoBrowserify.$)(this.e.target).hasClass('a-table-editable') && (0, _zeptoBrowserify.$)(this.e.target).parents('td').attr('data-cell-id') === b + '-' + a) {
          data.history.push((0, _clone2.default)(data.row));
          data.row[a].col[b].value = (0, _zeptoBrowserify.$)(this.e.target).html();
        }
        if (this.afterEntered) {
          this.afterEntered();
        }
      } else if (type === 'keyup' && aTable.getBrowser().indexOf('ie') !== -1) {
        if ((0, _zeptoBrowserify.$)(this.e.target).hasClass('a-table-editable') && (0, _zeptoBrowserify.$)(this.e.target).parents('td').attr('data-cell-id') === b + '-' + a) {
          data.history.push((0, _clone2.default)(data.row));
          data.row[a].col[b].value = (0, _zeptoBrowserify.$)(this.e.target).html();
        }
        if (this.afterEntered) {
          this.afterEntered();
        }
      }
    }
  }, {
    key: 'copyTable',
    value: function copyTable(e, points) {
      var _this2 = this;

      e.preventDefault();
      var copy_y = -1;
      var copy_text = '<meta name="generator" content="Sheets"><table>';
      var first = true;
      points.forEach(function (point) {
        var cell = _this2.getCellByPos(point.x, point.y);
        if (copy_y !== point.y) {
          if (!first) {
            copy_text += '</tr>';
            first = false;
          }
          copy_text += '<tr><' + cell.type + ' colspan="' + cell.colspan + '" rowspan="' + cell.rowspan + '">' + cell.value + '</' + cell.type + '>';
        } else {
          copy_text += '<' + cell.type + ' colspan="' + cell.colspan + '" rowspan="' + cell.rowspan + '">' + cell.value + '</' + cell.type + '>';
        }
        copy_y = point.y;
      });
      copy_text += '</tr></table>';
      if (e.originalEvent.clipboardData) {
        e.originalEvent.clipboardData.setData('text/html', copy_text);
      } else if (window.clipboardData) {
        window.clipboardData.setData('Text', copy_text);
      }
    }
  }, {
    key: 'pasteTable',
    value: function pasteTable(e) {
      var pastedData = void 0;
      var data = this.data;
      if (e.originalEvent.clipboardData) {
        pastedData = e.originalEvent.clipboardData.getData('text/html');
      } else if (window.clipboardData) {
        pastedData = window.clipboardData.getData('Text');
      }
      if (pastedData) {
        var tableHtml = pastedData.match(/<table(.*)>(([\n\r\t]|.)*?)<\/table>/i);
        if (tableHtml && tableHtml[0]) {
          var newRow = this.parse(tableHtml[0]);
          if (newRow && newRow.length) {
            e.preventDefault();
            data.row = newRow;
            data.history.push((0, _clone2.default)(data.row));
            this.update();
            return;
          }
        }
        //for excel;
        var row = this.parseText(pastedData);
        if (row && row.length) {
          e.preventDefault();
          data.row = row;
          this.update();
          data.history.push((0, _clone2.default)(data.row));
          return;
        }
      }
    }
  }, {
    key: 'updateResult',
    value: function updateResult() {
      var data = this.data;
      data.row = this.parse(data.tableResult);
      data.tableClass = this.getTableClass(data.tableResult);
      data.history.push((0, _clone2.default)(data.row));
      if (data.inputMode === 'table') {
        this.update();
      }
      if (this.afterEntered) {
        this.afterEntered();
      }
    }
  }, {
    key: 'insertColRight',
    value: function insertColRight(selectedno) {
      var data = this.data;
      data.selectedRowNo = parseInt(selectedno);
      data.showMenu = false;
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
      data.history.push((0, _clone2.default)(data.row));
      this.update();
    }
  }, {
    key: 'insertColLeft',
    value: function insertColLeft(selectedno) {
      var data = this.data;
      selectedno = parseInt(selectedno);
      data.selectedRowNo = selectedno + 1;
      data.showMenu = false;
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
      if (selectedno === 0) {
        var length = point1.height;
        for (var i = 0; i < length; i++) {
          var newcell = { type: 'td', colspan: 1, rowspan: 1, value: '' };
          self.insertCellAt(i, 0, newcell);
        }
        data.history.push((0, _clone2.default)(data.row));
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
      data.history.push((0, _clone2.default)(data.row));
      this.update();
    }
  }, {
    key: 'beforeUpdated',
    value: function beforeUpdated() {
      this.changeSelectOption();
      this.markup();
    }
  }, {
    key: 'insertRowBelow',
    value: function insertRowBelow(selectedno) {
      var data = this.data;
      data.showMenu = false;
      data.selectedColNo = parseInt(selectedno);
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
      if (targetPoints.length === 0) {
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
          } else if (index.row === selectedno + 1) {
            var _length = parseInt(cell.colspan);
            for (var _i = 0; _i < _length; _i++) {
              newRow.push({ type: 'td', colspan: 1, rowspan: 1, value: '' });
            }
          } else {
            self.insertCellAt(index.row + 1, index.col, newcell);
          }
        }
      });
      this.insertRow(selectedno + 1, newRow);
      data.history.push((0, _clone2.default)(data.row));
      this.update();
    }
  }, {
    key: 'insertRowAbove',
    value: function insertRowAbove(selectedno) {
      var data = this.data;
      data.showMenu = false;
      data.selectedColNo = parseInt(selectedno) + 1;
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
      if (selectedno === 0) {
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
          } else if (index.row === selectedno - 1) {
            var _length2 = parseInt(cell.colspan);
            for (var _i2 = 0; _i2 < _length2; _i2++) {
              newRow.push({ type: 'td', colspan: 1, rowspan: 1, value: '' });
            }
          } else {
            self.insertCellAt(index.row, index.col, newcell);
          }
        }
      });
      this.insertRow(selectedno, newRow);
      data.history.push((0, _clone2.default)(this.data.row));
      this.update();
    }
  }, {
    key: 'mergeCells',
    value: function mergeCells() {
      var data = this.data;
      var points = this.getSelectedPoints();
      if (!this.isSelectedCellsRectangle()) {
        if (data.lang === 'en') {
          alert('All possible cells should be selected so to merge cells into one');
        } else if (data.lang === 'ja') {
          alert('結合するには、結合範囲のすべてのセルを選択する必要があります。');
        }
        return;
      }
      if (points.length === 0) {
        return;
      }
      if (!confirm('セルを結合すると、一番左上の値のみが保持されます。 結合しますか？')) {
        return;
      }
      var point = this.getLargePoint.apply(null, points);
      var cell = this.getCellByPos(point.x, point.y);
      this.removeSelectedCellExcept(cell);
      cell.colspan = point.width;
      cell.rowspan = point.height;
      data.showMenu = false;
      data.history.push((0, _clone2.default)(data.row));
      this.update();
    }
  }, {
    key: 'splitCell',
    value: function splitCell() {
      var data = this.data;
      var selectedPoints = this.getSelectedPoints();
      var length = selectedPoints.length;
      if (length === 0) {
        if (data.lang === 'en') {
          alert('No cell is selected');
        } else if (data.lang === 'ja') {
          alert('セルが選択されていません');
        }
        return;
      } else if (length > 1) {
        if (data.lang === 'en') {
          alert('Only One cell should be selected so to split');
        } else if (data.lang === 'ja') {
          alert('結合解除するには、セルが一つだけ選択されている必要があります');
        }
        return;
      }
      var selectedPoint = this.getSelectedPoint();
      var bound = { x: 0, y: selectedPoint.y, width: selectedPoint.x, height: selectedPoint.height };
      var points = this.getAllPoints();
      var currentIndex = this.getCellIndexByPos(selectedPoint.x, selectedPoint.y);
      var currentCell = this.getCellByPos(selectedPoint.x, selectedPoint.y);
      var width = parseInt(currentCell.colspan);
      var height = parseInt(currentCell.rowspan);
      var currentValue = currentCell.value;
      var self = this;
      var targets = [];
      var cells = [];
      var rows = [];
      if (width === 1 && height === 1) {
        if (data.lang === 'en') {
          alert('Selected cell cannnot be splited anymore');
        } else if (data.lang === 'ja') {
          alert('選択されたセルはこれ以上分割できません');
        }
        return;
      }
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
      for (var _i3 = selectedPoint.y, _n = _i3 + height; _i3 < _n; _i3++) {
        if (!rows[_i3]) {
          rows[_i3] = [];
          rows[_i3].push({ row: _i3, col: -1 });
        }
      }
      var first = true;
      rows.forEach(function (row) {
        var index = row[row.length - 1];
        for (var _i4 = 0; _i4 < width; _i4++) {
          var val = '';
          //スプリットされる前のコルのデータを保存
          if (first === true && _i4 === width - 1) {
            val = currentValue;
            first = false;
          }
          self.insertCellAt(index.row, index.col + 1, { type: 'td', colspan: 1, rowspan: 1, value: val, selected: true });
        }
      });
      this.removeCell(currentCell);
      data.showMenu = false;
      data.history.push((0, _clone2.default)(data.row));
      data.splited = true;
      this.update();
    }
  }, {
    key: 'changeCellTypeTo',
    value: function changeCellTypeTo(type) {
      var data = this.data;
      data.row.forEach(function (item, i) {
        item.col.forEach(function (obj, t) {
          if (obj.selected) {
            obj.type = type;
          }
        });
      });
      data.showMenu = false;
      data.history.push((0, _clone2.default)(data.row));
      this.update();
    }
  }, {
    key: 'align',
    value: function align(_align) {
      var data = this.data;
      data.row.forEach(function (item, i) {
        item.col.forEach(function (obj, t) {
          if (obj.selected) {
            obj.align = _align;
          }
        });
      });
      data.showMenu = false;
      data.history.push((0, _clone2.default)(data.row));
      this.update();
    }
  }, {
    key: 'getStyleByAlign',
    value: function getStyleByAlign(val) {
      var align = this.data.mark.align;
      if (align.default === val) {
        return '';
      }
      return align[val];
    }
  }, {
    key: 'getAlignByStyle',
    value: function getAlignByStyle(style) {
      var align = this.data.mark.align;
      if (align.right === style) {
        return 'right';
      } else if (align.center === style) {
        return 'center';
      } else if (align.left === style) {
        return 'left';
      }
    }
  }, {
    key: 'isSelectedCellsRectangle',
    value: function isSelectedCellsRectangle() {
      var selectedPoints = this.getSelectedPoints();
      var largePoint = this.getLargePoint.apply(null, selectedPoints);
      var points = this.getAllPoints();
      var flag = true;
      var self = this;
      points.forEach(function (point) {
        if (self.hitTest(largePoint, point)) {
          var cell = self.getCellByPos(point.x, point.y);
          if (!cell.selected) {
            flag = false;
          }
        }
      });
      return flag;
    }
  }, {
    key: 'changeInputMode',
    value: function changeInputMode(source) {
      var data = this.data;
      data.inputMode = source;
      if (source === 'source') {
        data.tableResult = this.getTable();
      } else {
        data.row = this.parse(data.tableResult);
        data.tableClass = this.getTableClass(data.tableResult);
      }
      this.update();
    }
  }, {
    key: 'changeCellClass',
    value: function changeCellClass() {
      var data = this.data;
      var cellClass = data.cellClass;
      data.row.forEach(function (item, i) {
        item.col.forEach(function (obj, t) {
          if (obj.selected) {
            obj.cellClass = cellClass;
          }
        });
      });
      data.history.push((0, _clone2.default)(data.row));
      this.update();
    }
  }, {
    key: 'changeSelectOption',
    value: function changeSelectOption() {
      var cellClass = void 0;
      var flag = true;
      var data = this.data;
      data.row.forEach(function (item) {
        item.col.forEach(function (obj) {
          if (obj.selected) {
            if (!cellClass) {
              cellClass = obj.cellClass;
            } else if (cellClass && cellClass !== obj.cellClass) {
              flag = false;
            }
          }
        });
      });
      if (flag) {
        data.cellClass = cellClass;
      } else {
        data.cellClass = '';
      }
    }
  }], [{
    key: 'isSmartPhone',
    value: function isSmartPhone() {
      var agent = navigator.userAgent;
      if (agent.indexOf('iPhone') > 0 || agent.indexOf('iPad') > 0 || agent.indexOf('ipod') > 0 || agent.indexOf('Android') > 0) {
        return true;
      } else {
        return false;
      }
    }
  }, {
    key: 'getBrowser',
    value: function getBrowser() {
      var ua = window.navigator.userAgent.toLowerCase();
      var ver = window.navigator.appVersion.toLowerCase();
      var name = 'unknown';

      if (ua.indexOf("msie") != -1) {
        if (ver.indexOf("msie 6.") != -1) {
          name = 'ie6';
        } else if (ver.indexOf("msie 7.") != -1) {
          name = 'ie7';
        } else if (ver.indexOf("msie 8.") != -1) {
          name = 'ie8';
        } else if (ver.indexOf("msie 9.") != -1) {
          name = 'ie9';
        } else if (ver.indexOf("msie 10.") != -1) {
          name = 'ie10';
        } else {
          name = 'ie';
        }
      } else if (ua.indexOf('trident/7') != -1) {
        name = 'ie11';
      } else if (ua.indexOf('chrome') != -1) {
        name = 'chrome';
      } else if (ua.indexOf('safari') != -1) {
        name = 'safari';
      } else if (ua.indexOf('opera') != -1) {
        name = 'opera';
      } else if (ua.indexOf('firefox') != -1) {
        name = 'firefox';
      }
      return name;
    }
  }, {
    key: 'getUniqId',
    value: function getUniqId() {
      return (Date.now().toString(36) + Math.random().toString(36).substr(2, 5)).toUpperCase();
    }
  }]);

  return aTable;
}(_aTemplate3.default);

module.exports = aTable;
