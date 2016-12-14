'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _aTemplate2 = require('a-template');

var _aTemplate3 = _interopRequireDefault(_aTemplate2);

var _zeptoBrowserify = require('zepto-browserify');

var _clone = require('clone');

var _clone2 = _interopRequireDefault(_clone);

var _table2md = require('./table2md.js');

var _table2md2 = _interopRequireDefault(_table2md);

var _table = require('./table.html');

var _table2 = _interopRequireDefault(_table);

var _returnTable = require('./return-table.html');

var _returnTable2 = _interopRequireDefault(_returnTable);

var _aTable = require('./a-table.css');

var _aTable2 = _interopRequireDefault(_aTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var ids = [];
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
      alignLeft: "a-table-icon a-table-icon-left",
      alignCenter: "a-table-icon a-table-icon-center",
      alignRight: "a-table-icon a-table-icon-right",
      undo: "a-table-icon a-table-icon-undo",
      merge: "a-table-icon a-table-icon-merge02",
      split: "a-table-icon a-table-icon-split02",
      table: "a-table-icon a-table-icon-th02",
      source: "a-table-icon a-table-icon-source01"
    }
  }
};
(0, _zeptoBrowserify.$)('body').append('<style>' + _aTable2.default + '</style>');

var aTable = function (_aTemplate) {
  _inherits(aTable, _aTemplate);

  function aTable(ele, option) {
    _classCallCheck(this, aTable);

    var _this = _possibleConstructorReturn(this, (aTable.__proto__ || Object.getPrototypeOf(aTable)).call(this));

    _this.id = _this.getRandText(10);
    _this.addTemplate(_table2.default, _this.id);
    _this.data = _zeptoBrowserify.$.extend(true, {}, defs, option);
    _this.data.point = { x: -1, y: -1 };
    _this.data.selectedRowNo = -1;
    _this.data.selectedColNo = -1;
    _this.data.showBtnList = true;
    _this.data.row = _this.parse((0, _zeptoBrowserify.$)(ele).html());
    _this.data.highestRow = _this.highestRow;
    _this.data.history = [];
    _this.data.inputMode = "table";
    _this.data.cellClass = "";
    _this.data.history.push((0, _clone2.default)(_this.data.row));
    _this.convert = {};
    _this.convert.getStyleByAlign = _this.getStyleByAlign;
    _this.convert.setClass = _this.setClass;
    (0, _zeptoBrowserify.$)(ele).wrap('<div data-id="' + _this.id + '"></div>');
    (0, _zeptoBrowserify.$)(ele).remove();
    _this.update();
    return _this;
  }

  _createClass(aTable, [{
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
      return (0, _zeptoBrowserify.$)('[data-id="' + this.id + '"] [data-cell-id="' + x + '-' + y + '"]');
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
      (0, _zeptoBrowserify.$)('[data-id="' + this.id + '"] .js-table-header th').each(function (i) {
        if ((0, _zeptoBrowserify.$)(this).offset().left === left) {
          returnLeft = i;
        }
      });
      (0, _zeptoBrowserify.$)('[data-id="' + this.id + '"] .js-table-side').each(function (i) {
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
    key: 'markup',
    value: function markup() {
      if (this.data.splited) {
        this.data.splited = false;
        return;
      }
      var points = this.getSelectedPoints();
      var point1 = this.getLargePoint.apply(null, points);
      var self = this;
      this.data.row.forEach(function (item, i) {
        if (!item || !item.col) {
          return false;
        }
        item.col.forEach(function (obj, t) {
          var point = self.getCellInfoByIndex(t, i);
          var mark = {};
          if (obj.selected) {
            if (point.x == point1.x) {
              mark.left = true;
            }
            if (point.x + point.width == point1.x + point1.width) {
              mark.right = true;
            }
            if (point.y == point1.y) {
              mark.top = true;
            }
            if (point.y + point.height == point1.y + point1.height) {
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
      var $ele = (0, _zeptoBrowserify.$)('[data-id="' + this.id + '"]');
      var $target = (0, _zeptoBrowserify.$)(this.e.target);
      this.e.preventDefault();
      this.data.showMenu = true;
      this.data.menuX = this.e.clientX;
      this.data.menuY = this.e.clientY;
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
          var classAttr = (0, _zeptoBrowserify.$)(this).attr("class");
          var cellClass = "";
          if (classAttr) {
            var classList = classAttr.split(/\s+/);
            classList.forEach(function (item) {
              var align = self.getAlignByStyle(item);
              if (align) {
                obj.align = align;
              } else {
                cellClass += " " + item;
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
    key: 'getTable',
    value: function getTable() {
      return this.getHtml(_returnTable2.default, true).replace(/ class=""/g, "").replace(/class="(.*)? "/g, 'class="$1"');
    }
  }, {
    key: 'getMarkdown',
    value: function getMarkdown() {
      return (0, _table2md2.default)(this.getHtml(_returnTable2.default, true));
    }
  }, {
    key: 'onUpdated',
    value: function onUpdated() {
      var points = this.getAllPoints();
      var point = this.getLargePoint.apply(null, points);
      var width = point.width;
      var $th = (0, _zeptoBrowserify.$)('.js-table-header th', '[data-id="' + this.id + '"]');
      var elem = (0, _zeptoBrowserify.$)(".a-table-selected .a-table-editable", '[data-id="' + this.id + '"]')[0];
      if (elem && !this.data.showMenu) {
        setTimeout(function () {
          elem.focus();
          if (typeof window.getSelection != "undefined" && typeof document.createRange != "undefined") {
            var range = document.createRange();
            range.selectNodeContents(elem);
            range.collapse(false);
            var sel = window.getSelection();
            sel.removeAllRanges();
            console.log(range);
            sel.addRange(range);
          } else if (typeof document.body.createTextRange != "undefined") {
            var textRange = document.body.createTextRange();
            textRange.moveToElementText(elem);
            textRange.collapse(false);
            textRange.select();
          }
        }, 1);
      }
      $th.each(function (i) {
        if (i > width) {
          (0, _zeptoBrowserify.$)(this).remove();
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

      while (JSON.stringify(data) === JSON.stringify(this.data.row)) {
        data = this.data.history.pop();
      }

      if (data) {
        if (this.data.history.length === 0) {
          this.data.history.push((0, _clone2.default)(data));
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
    key: 'selectRow',
    value: function selectRow(i) {
      this.unselectCells();
      this.data.showMenu = false;
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
        var index = self.getCellIndexByPos(point.x, point.y);
        var cell = self.getCellByPos(point.x, point.y);
        cell.selected = true;
      });
      this.data.mode = 'col';
      this.data.selectedColNo = -1;
      this.data.selectedRowNo = i;
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
      this.unselectCells();
      this.data.showMenu = false;
      points.forEach(function (point) {
        if (self.hitTest(newpoint, point)) {
          targetPoints.push(point);
        }
      });
      targetPoints.forEach(function (point) {
        var index = self.getCellIndexByPos(point.x, point.y);
        var cell = self.getCellByPos(point.x, point.y);
        cell.selected = true;
      });
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
      this.data.history.push((0, _clone2.default)(this.data.row));
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
      this.data.history.push((0, _clone2.default)(this.data.row));
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

      if (this.e.type == 'compositionstart') {
        this.data.beingInput = true;
      }
      if (this.e.type == 'compositionend') {
        this.data.beingInput = false;
      }
      if (this.e.type == 'click') {
        if (this.e.shiftKey) {
          this.selectRange(a, b);
        }
      } else if (this.e.type == 'mousedown') {
        if (this.e.button !== 2 && !this.e.ctrlKey) {
          this.mousedown = true;
          if (!this.data.row[a].col[b].selected) {
            this.select(a, b);
            if (!this.data.beingInput) {
              this.update();
            }
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
        this.data.row[a].col[b].value = (0, _zeptoBrowserify.$)(this.e.target).html();
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
      this.data.history.push((0, _clone2.default)(this.data.row));
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
      this.data.history.push((0, _clone2.default)(this.data.row));
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
      this.data.history.push((0, _clone2.default)(this.data.row));
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
      this.data.history.push((0, _clone2.default)(this.data.row));
      this.update();
    }
  }, {
    key: 'mergeCells',
    value: function mergeCells() {
      if (!this.isSelectedCellsRectangle()) {
        alert("結合するには、結合範囲のすべてのセルを選択する必要があります。");
        return;
      }
      var points = this.getSelectedPoints();
      var point = this.getLargePoint.apply(null, points);
      var cell = this.getCellByPos(point.x, point.y);
      this.removeSelectedCellExcept(cell);
      cell.colspan = point.width;
      cell.rowspan = point.height;
      this.data.showMenu = false;
      this.data.history.push((0, _clone2.default)(this.data.row));
      this.update();
    }
  }, {
    key: 'splitCell',
    value: function splitCell() {
      var selectedPoints = this.getSelectedPoints();
      if (selectedPoints.length > 1) {
        alert("結合解除するには、セルが一つだけ選択されている必要があります");
        return;
      }
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
      this.data.history.push((0, _clone2.default)(this.data.row));
      this.data.splited = true;
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
      this.data.history.push((0, _clone2.default)(this.data.row));
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
      this.data.history.push((0, _clone2.default)(this.data.row));
      this.update();
    }
  }, {
    key: 'getStyleByAlign',
    value: function getStyleByAlign(align) {
      if (this.data.mark.align.default === align) {
        return '';
      }
      return this.data.mark.align[align];
    }
  }, {
    key: 'getAlignByStyle',
    value: function getAlignByStyle(style) {
      var align = this.data.mark.align;
      if (align.right === style) {
        return "right";
      } else if (align.center === style) {
        return "center";
      } else if (align.left === style) {
        return "left";
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
      this.data.inputMode = source;
      if (source === "source") {
        this.data.tableResult = this.getTable();
      } else {
        this.data.row = this.parse(this.data.tableResult);
      }
      this.update();
    }
  }, {
    key: 'changeCellClass',
    value: function changeCellClass() {
      var cellClass = this.data.cellClass;
      this.data.row.forEach(function (item, i) {
        item.col.forEach(function (obj, t) {
          if (obj.selected) {
            obj.cellClass = cellClass;
          }
        });
      });
      this.data.history.push((0, _clone2.default)(this.data.row));
      this.update();
    }
  }, {
    key: 'changeSelectOption',
    value: function changeSelectOption() {
      var cellClass;
      var flag = true;
      this.data.row.forEach(function (item, i) {
        item.col.forEach(function (obj, t) {
          if (obj.selected) {
            if (!cellClass) {
              cellClass = obj.cellClass;
            } else if (cellClass && cellClass != obj.cellClass) {
              flag = false;
            }
          }
        });
      });
      if (flag) {
        this.data.cellClass = cellClass;
      } else {
        this.data.cellClass = "";
      }
    }
  }]);

  return aTable;
}(_aTemplate3.default);

module.exports = aTable;
