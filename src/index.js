var aTemplate = require('a-template')
var $ = require('zepto-browserify').$
var clone = require('clone')
var toMarkdown = require('./table2md.js')
var template = require('./table.html')
var returnTable = require('./return-table.html')
var style = require('./spread.css')
var equals = require('array-equal')
var ids = []
$('body').append('<style>' + style + '</style>')
$('body').append("<link rel='stylesheet' href='https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css'>")
var defs = {
  showBtnList: true,
  lang: 'en',
  mark:{
  	align:{
  		default:'left',
  		left:'class="left"',
  		center:'class="center"',
  		right:'class="right"'
  	}
  }
}

class Spread extends aTemplate {
  constructor (ele, option) {
    super()
    this.id = this.getRandText(10)
    this.addTemplate(template, this.id)
    this.data = $.extend({}, defs, option)
    this.data.point = {x: -1, y: -1}
    this.data.selectedRowNo = -1
    this.data.selectedColNo = -1
    this.data.showBtnList = true
    this.data.row = this.parse($(ele).html())
    this.data.highestRow = this.highestRow
    this.data.history = []
    this.data.history.push(clone(this.data.row))
    this.convert = {}
    this.convert.noToEn = this.noToEn
    this.convert.getStyleByAlign = this.getStyleByAlign
    $(ele).wrap("<div data-id='" + this.id + "'></div>")
    $(ele).remove()
    this.update()
  }

  highestRow () {
    var arr = []
    this.data.row.forEach(function (item, i) {
      if (!item || !item.col) {
        return
      }
      item.col.forEach(function (obj, t) {
        var length = parseInt(obj.colspan)
        for (var i = 0; i < length; i++) {
          arr.push(i)
        }
      })
    })
    return arr
  }

  getCellByIndex (x, y) {
    return $("[data-id='" + this.id + "'] [data-cell-id='" + x + '-' + y + "']")
  }

  getCellInfoByIndex (x, y) {
    var id = this.id
    var $cell = this.getCellByIndex(x, y)
    if ($cell.length == 0) {
      return false
    }
    var left = $cell.offset().left
    var top = $cell.offset().top
    var returnLeft = -1
    var returnTop = -1
    var width = parseInt($cell.attr('colspan'))
    var height = parseInt($cell.attr('rowspan'))
    $("[data-id='" + this.id + "'] .js-table-header th").each(function (i) {
      if ($(this).offset().left === left) {
        returnLeft = i
      }
    })
    $("[data-id='" + this.id + "'] .js-table-side").each(function (i) {
      if ($(this).offset().top === top) {
        returnTop = i
      }
    })
    return {x: returnLeft - 1, y: returnTop, width: width, height: height}
  }
  getLargePoint () {
    var minXArr = []
    var minYArr = []
    var maxXArr = []
    var maxYArr = []
    for (var i = 0, n = arguments.length; i < n; i++) {
      minXArr.push(arguments[i].x)
      minYArr.push(arguments[i].y)
      maxXArr.push(arguments[i].x + arguments[i].width)
      maxYArr.push(arguments[i].y + arguments[i].height)
    }
    var minX = Math.min.apply(Math, minXArr)
    var minY = Math.min.apply(Math, minYArr)
    var maxX = Math.max.apply(Math, maxXArr)
    var maxY = Math.max.apply(Math, maxYArr)
    return {x: minX, y: minY, width: maxX - minX, height: maxY - minY}
  }

  getSelectedPoints () {
    var arr = []
    var self = this
    this.data.row.forEach(function (item, i) {
      if (!item.col) {
        return false
      }
      item.col.forEach(function (obj, t) {
        if (obj.selected) {
          var point = self.getCellInfoByIndex(t, i)
          if (point) {
            arr.push(point)
          }
        }
      })
    })
    return arr
  }

  getSelectedPoint () {
    var arr = this.getSelectedPoints()
    if (arr && arr[0]) {
      return arr[0]
    }
  }

  getAllPoints () {
    var arr = []
    var self = this
    this.data.row.forEach(function (item, i) {
      if (!item || !item.col) {
        return
      }
      item.col.forEach(function (obj, t) {
        var point = self.getCellInfoByIndex(t, i)
        if (point) {
          arr.push(point)
        }
      })
    })
    return arr
  }

  getCellIndexByPos (x, y) {
    var a,b
    var self = this
    this.data.row.forEach(function (item, i) {
      if (!item || !item.col) {
        return
      }
      item.col.forEach(function (obj, t) {
        var point = self.getCellInfoByIndex(t, i)
        if (point.x == x && point.y == y) {
          a = t
          b = i
        }
      })
    })
    return {row: b,col: a}
  }

  getCellByPos (x, y) {
    var index = this.getCellIndexByPos(x, y)
    if (!this.data.row[index.row]) {
      return
    }
    return this.data.row[index.row].col[index.col]
  }

  hitTest (point1, point2) {
    if ((point1.x < point2.x + point2.width)
      && (point2.x < point1.x + point1.width)
      && (point1.y < point2.y + point2.height)
      && (point2.y < point1.y + point1.height)) {
      return true
    }else {
      return false
    }
  }

  selectRange (a, b) {
    if (!this.data.point) {
      return
    }
    var self = this
    this.data.row[a].col[b].selected = true
    var points = this.getSelectedPoints()
    var point3 = this.getLargePoint.apply(null, points)
    this.data.row.forEach(function (item, i) {
      if (!item || !item.col) {
        return false
      }
      item.col.forEach(function (obj, t) {
        var point = self.getCellInfoByIndex(t, i)
        if (point && self.hitTest(point3, point)) {
          obj.selected = true
        }
      })
    })
    if (points.length > 1) {
      this.update()
    }
  }

  select (a, b) {
    this.data.point = {x: b,y: a}
    this.data.row.forEach(function (item, i) {
      if (!item || !item.col) {
        return false
      }
      item.col.forEach(function (obj, t) {
        if (i !== a || t !== b) {
          obj.selected = false
        }
      })
    })
    if (!this.data.row[a].col[b].selected) {
      this.data.row[a].col[b].selected = true
    }
  }

  unselectCells () {
    this.data.row.forEach(function (item, i) {
      if (!item || !item.col) {
        return false
      }
      item.col.forEach(function (obj, t) {
        obj.selected = false
      })
    })
  }

  removeCell (cell) {
    var row = this.data.row
    for (var i = 0, n = row.length; i < n; i++) {
      var col = row[i].col
      for (var t = 0, m = col.length; t < m; t++) {
        var obj = col[t]
        if (obj === cell) {
          col.splice(t, 1)
          t--
          m--
        }
      }
    }
  }

  removeSelectedCellExcept (cell) {
    var row = this.data.row
    for (var i = 0, n = row.length; i < n; i++) {
      var col = row[i].col
      for (var t = 0, m = col.length; t < m; t++) {
        var obj = col[t]
        if (obj !== cell && obj.selected) {
          col.splice(t, 1)
          t--
          m--
        }
      }
    }
  }

  contextmenu () {
    var $ele = $("[data-id='" + this.id + "']")
    var $target = $(this.e.target)
    this.e.preventDefault()
    this.data.showMenu = true
    this.data.menuX = this.e.clientX
    this.data.menuY = this.e.clientY
    this.update()
  }

  parse (html) {
    var arr1 = []
    $('tr', html).each(function () {
      var ret2 = {}
      var arr2 = []
      ret2.col = arr2
      $('th,td', this).each(function () {
        var obj = {}
        if ($(this).is('th')) {
          obj.type = 'th'
        }else {
          obj.type = 'td'
        }
        obj.colspan = $(this).attr('colspan') || 1
        obj.rowspan = $(this).attr('rowspan') || 1
        obj.value = $(this).html()
        arr2.push(obj)
      })
      arr1.push(ret2)
    })
    return arr1
  }

  getTable () {
    return this.getHtml(returnTable, true)
  }

  getMarkdown () {
    return toMarkdown(this.getHtml(returnTable, true))
  }

  onUpdated () {
    var points = this.getAllPoints()
    var point = this.getLargePoint.apply(null, points)
    var width = point.width
    var $th = $('.js-table-header th', "[data-id='" + this.id + "']")
    $th.each(function (i) {
      if (i > width) {
        $(this).remove()
      }
    })
    if (this.afterRendered) {
      this.afterRendered()
    }
  }

  undo () {
    var data = this.data.row
    if(this.data.history.length === 0){
    	return;
    }
    while(equals(data,this.data.row)){
    	data = this.data.history.pop()
    }

    if (data) {
    	if(this.data.history.length === 0){
    		this.data.history.push(clone(data));
    	}
      this.data.row = data
      this.update()
    }
  }
  // 行の追加
  insertRow (a, row) {
    if (this.data.row[a]) {
      this.data.row.splice(a, 0, {col: row})
    }else if (this.data.row.length == a) {
      this.data.row.push({col: row})
    }
  }

  insertCellAt (a, b, item) {
    if (this.data.row[a] && this.data.row[a].col) {
      this.data.row[a].col.splice(b, 0, item)
    }
  }

  selectRowViaBtn (i) {
    this.unselectCells()
    this.data.mode = 'col'
    this.data.selectedColNo = -1
    this.data.selectedRowNo = i
    this.contextmenu()
    this.update()
  }

  selectRow (i) {
    if (this.e.type == 'contextmenu') {
      this.unselectCells()
      this.contextmenu()
    }else if (this.e.type == 'click') {
      this.unselectCells()
      this.data.showMenu = false
    } else {
      return
    }
    this.data.mode = 'col'
    this.data.selectedColNo = -1
    this.data.selectedRowNo = i
    this.update()
  }
  selectCol (i) {
    if (this.e.type == 'contextmenu') {
      this.unselectCells()
      this.contextmenu()
    } else if (this.e.type == 'click') {
      this.unselectCells()
      this.data.showMenu = false
    } else {
      return
    }
    this.data.mode = 'row'
    this.data.selectedRowNo = -1
    this.data.selectedColNo = i
    this.update()
  }
  selectColViaBtn (i) {
    this.unselectCells()
    this.data.mode = 'row'
    this.data.selectedRowNo = -1
    this.data.selectedColNo = i
    this.contextmenu()
    this.update()
  }

  removeCol (selectedno) {
    this.data.showMenu = false
    var self = this
    var points = this.getAllPoints()
    var point1 = this.getLargePoint.apply(null, points)
    var newpoint = {x: parseInt(selectedno),y: 0,width: 1,height: point1.height}
    var targetPoints = []
    points.forEach(function (point) {
      if (self.hitTest(newpoint, point)) {
        targetPoints.push(point)
      }
    })
    targetPoints.forEach(function (point) {
      var index = self.getCellIndexByPos(point.x, point.y)
      var cell = self.getCellByPos(point.x, point.y)
      if (cell.colspan == 1) {
        self.removeCell(cell)
      }else {
        cell.colspan = parseInt(cell.colspan) - 1
      }
    })
    this.data.history.push(clone(this.data.row))
    this.update()
  }
  removeRow (selectedno) {
    this.data.showMenu = false
    var self = this
    var points = this.getAllPoints()
    var point1 = this.getLargePoint.apply(null, points)
    selectedno = parseInt(selectedno)
    var newpoint = {x: 0,y: selectedno,width: point1.width,height: 1}
    var nextpoint = {x: 0,y: selectedno + 1,width: point1.width,height: 1}
    var targetPoints = []
    var removeCells = []
    var insertCells = []
    points.forEach(function (point) {
      if (self.hitTest(newpoint, point)) {
        targetPoints.push(point)
      }
    })
    points.forEach(function (point) {
      if (self.hitTest(nextpoint, point)) {
        var cell = self.getCellByPos(point.x, point.y)
        cell.x = point.x
        if (point.y == nextpoint.y) {
          insertCells.push(cell)
        }
      }
    })
    targetPoints.forEach(function (point) {
      var cell = self.getCellByPos(point.x, point.y)
      if (cell.rowspan == 1) {
        removeCells.push(cell)
      }else {
        cell.rowspan = parseInt(cell.rowspan) - 1
        if (selectedno == point.y) {
          cell.x = point.x
          insertCells.push(cell)
        }
      }
    })
    insertCells.sort(function (a, b) {
      if (a.x > b.x) {
        return 1
      }else {
        return -1
      }
    })
    removeCells.forEach(function (cell) {
      self.removeCell(cell)
    })
    this.data.row.splice(selectedno, 1)
    if (insertCells.length > 0) {
      this.data.row[selectedno] = {col: insertCells}
    }
    this.data.history.push(clone(this.data.row))
    this.update()
  }
  updateTable (b, a) {
    if (this.e.type === 'mouseup' && this.data.showMenu) {
      return
    }
    a = parseInt(a)
    b = parseInt(b)
    this.data.mode = 'cell'
    this.data.selectedRowNo = -1
    this.data.selectedColNo = -1
    this.data.showMenu = false
    if (this.e.type == 'click') {
      if (this.e.shiftKey) {
        this.selectRange(a, b)
      }
    }else if (this.e.type == 'mousedown') {
      if (this.e.button !== 2 && !this.e.ctrlKey) {
        this.mousedown = true
        if (!this.data.row[a].col[b].selected) {
          this.select(a, b)
          this.update()
        }else {
          this.select(a, b)
        }
      }
    }else if (this.e.type == 'mousemove') {
      if (this.mousedown) {
        this.selectRange(a, b)
      }
    }else if (this.e.type == 'mouseup') {
      this.mousedown = false
      this.selectRange(a, b)
    }else if (this.e.type == 'contextmenu') {
      this.mousedown = false
      this.contextmenu()
    }else {
      this.data.row[a].col[b].value = $(this.e.target).html()
      if (this.afterEntered) {
        this.afterEntered()
      }
    }
  }
  insertColRight (selectedno) {
    this.data.selectedRowNo = parseInt(selectedno)
    this.data.showMenu = false
    var self = this
    var points = this.getAllPoints()
    var point1 = this.getLargePoint.apply(null, points)
    var newpoint = {x: parseInt(selectedno),y: 0,width: 1,height: point1.height}
    var targetPoints = []
    points.forEach(function (point) {
      if (self.hitTest(newpoint, point)) {
        targetPoints.push(point)
      }
    })
    targetPoints.forEach(function (point) {
      var index = self.getCellIndexByPos(point.x, point.y)
      var cell = self.getCellByPos(point.x, point.y)
      var newcell = {type: 'td',colspan: 1,rowspan: cell.rowspan,value: ''}
      if (typeof index.row !== 'undefined' && typeof index.col !== 'undefined') {
        if (point.width + point.x - newpoint.x > 1) {
          cell.colspan = parseInt(cell.colspan) + 1
          cell.colspan += ''
        }else {
          self.insertCellAt(index.row, index.col + 1, newcell)
        }
      }
    })
    this.data.history.push(clone(this.data.row))
    this.update()
  }
  insertColLeft (selectedno) {
    this.data.selectedRowNo = parseInt(selectedno) + 1
    this.data.showMenu = false
    var self = this
    var points = this.getAllPoints()
    var point1 = this.getLargePoint.apply(null, points)
    var newpoint = {x: parseInt(selectedno) - 1,y: 0,width: 1,height: point1.height}
    var targetPoints = []
    points.forEach(function (point) {
      if (self.hitTest(newpoint, point)) {
        targetPoints.push(point)
      }
    })
    if (selectedno == 0) {
      var length = point1.height
      for (var i = 0; i < length; i++) {
        var newcell = {type: 'td',colspan: 1,rowspan: 1,value: ''}
        self.insertCellAt(i, 0, newcell)
      }
      self.update()
      return
    }
    targetPoints.forEach(function (point) {
      var index = self.getCellIndexByPos(point.x, point.y)
      var cell = self.getCellByPos(point.x, point.y)
      var newcell = {type: 'td',colspan: 1,rowspan: cell.rowspan,value: ''}
      if (typeof index.row !== 'undefined' && typeof index.col !== 'undefined') {
        if (point.width + point.x - newpoint.x > 1) {
          cell.colspan = parseInt(cell.colspan) + 1
          cell.colspan += ''
        }else {
          self.insertCellAt(index.row, index.col + 1, newcell)
        }
      }
    })
    this.data.history.push(clone(this.data.row))
    this.update()
  }
  insertRowBelow (selectedno) {
    this.data.showMenu = false
    this.data.selectedColNo = parseInt(selectedno)
    var self = this
    var points = this.getAllPoints()
    var point1 = this.getLargePoint.apply(null, points)
    selectedno = parseInt(selectedno)
    var newpoint = {x: 0,y: selectedno + 1,width: point1.width,height: 1}
    var targetPoints = []
    var newRow = []
    points.forEach(function (point) {
      if (self.hitTest(newpoint, point)) {
        targetPoints.push(point)
      }
    })
    if (targetPoints.length == 0) {
      var length = point1.width
      for (var i = 0; i < length; i++) {
        var newcell = {type: 'td',colspan: 1,rowspan: 1,value: ''}
        newRow.push(newcell)
      }
      self.insertRow(selectedno + 1, newRow)
      self.update()
      return
    }
    targetPoints.forEach(function (point) {
      var index = self.getCellIndexByPos(point.x, point.y)
      var cell = self.getCellByPos(point.x, point.y)
      if (!cell) {
        return
      }
      var newcell = {type: 'td',colspan: 1,rowspan: 1,value: ''}
      if (typeof index.row !== 'undefined' && typeof index.col !== 'undefined') {
        if (point.height > 1 && point.y <= selectedno) {
          cell.rowspan = parseInt(cell.rowspan) + 1
          cell.rowspan += ''
        } else if (index.row == selectedno + 1) {
          var length = parseInt(cell.colspan)
          for (var i = 0; i < length; i++) {
            newRow.push({type: 'td',colspan: 1,rowspan: 1,value: ''})
          }
        } else {
          self.insertCellAt(index.row + 1, index.col, newcell)
        }
      }
    })
    this.insertRow(selectedno + 1, newRow)
    this.data.history.push(clone(this.data.row))
    this.update()
  }
  insertRowAbove (selectedno) {
    this.data.showMenu = false
    this.data.selectedColNo = parseInt(selectedno) + 1
    var self = this
    var points = this.getAllPoints()
    var point1 = this.getLargePoint.apply(null, points)
    selectedno = parseInt(selectedno)
    var newpoint = {x: 0,y: selectedno - 1,width: point1.width,height: 1}
    var targetPoints = []
    var newRow = []
    points.forEach(function (point) {
      if (self.hitTest(newpoint, point)) {
        targetPoints.push(point)
      }
    })
    if (selectedno == 0) {
      var length = point1.width
      for (var i = 0; i < length; i++) {
        var newcell = {type: 'td',colspan: 1,rowspan: 1,value: ''}
        newRow.push(newcell)
      }
      self.insertRow(0, newRow)
      self.update()
      return
    }
    targetPoints.forEach(function (point) {
      var index = self.getCellIndexByPos(point.x, point.y)
      var cell = self.getCellByPos(point.x, point.y)
      if (!cell) {
        return
      }
      var newcell = {type: 'td',colspan: 1,rowspan: 1,value: ''}
      if (typeof index.row !== 'undefined' && typeof index.col !== 'undefined') {
        if (point.height > 1) {
          cell.rowspan = parseInt(cell.rowspan) + 1
          cell.rowspan += ''
        } else if (index.row == selectedno - 1) {
          var length = parseInt(cell.colspan)
          for (var i = 0; i < length; i++) {
            newRow.push({type: 'td',colspan: 1,rowspan: 1,value: ''})
          }
        } else {
          self.insertCellAt(index.row, index.col, newcell)
        }
      }
    })
    this.insertRow(selectedno, newRow)
    this.data.history.push(clone(this.data.row))
    this.update()
  }
  mergeCells () {
    var points = this.getSelectedPoints()
    var point = this.getLargePoint.apply(null, points)
    var cell = this.getCellByPos(point.x, point.y)
    this.removeSelectedCellExcept(cell)
    cell.colspan = point.width
    cell.rowspan = point.height
    this.data.showMenu = false
    this.data.history.push(clone(this.data.row))
    this.update()
  }
  splitCell () {
    var selectedPoint = this.getSelectedPoint()
    var bound = {x: 0, y: selectedPoint.y, width: selectedPoint.x, height: selectedPoint.height}
    var points = this.getAllPoints()
    var currentIndex = this.getCellIndexByPos(selectedPoint.x, selectedPoint.y)
    var currentCell = this.getCellByPos(selectedPoint.x, selectedPoint.y)
    var width = parseInt(currentCell.colspan)
    var height = parseInt(currentCell.rowspan)
    var self = this
    var targets = []
    var cells = []
    var rows = []
    points.forEach(function (point) {
      if (self.hitTest(bound, point)) {
        var index = self.getCellIndexByPos(point.x, point.y)
        var cell = self.getCellByPos(point.x, point.y)
        targets.push(index)
      }
    })
    targets.forEach(function (item) {
      var row = item.row
      if(item.row < currentIndex.row){
      	return;
      }
      if (!rows[row]) {
        rows[row] = []
      }
      rows[row].push(item)
    })
    for (var i = 1, n = rows.length; i < n; i++) {
    	if(!rows[i]){
    		continue;
    	}
      rows[i].sort(function (a, b) {
        if (a.col > b.col) {
          return 1
        }else {
          return -1
        }
      })
    }
    for (var i = selectedPoint.y, n = i + height; i < n; i++){
    	if(!rows[i]){
    		rows[i] = [];
    		rows[i].push({row:i,col:-1});
    	}
    }
   	rows.forEach(function (row) {
   		var index = row[row.length - 1];
      for (var i = 0; i < width; i++) {
        self.insertCellAt(index.row, index.col + 1, {type: 'td',colspan: 1,rowspan: 1,value: '', selected: true})
      }
    })
    this.removeCell(currentCell)
    this.data.showMenu = false
    this.data.history.push(clone(this.data.row))
    this.update()
  }
  changeCellTypeTo (type) {
    this.data.row.forEach(function (item, i) {
      item.col.forEach(function (obj, t) {
        if (obj.selected) {
          obj.type = type
        }
      })
    })
    this.data.showMenu = false
    this.data.history.push(clone(this.data.row))
    this.update()
  }
  align (align) {
    this.data.row.forEach(function (item, i) {
      item.col.forEach(function (obj, t) {
        if (obj.selected) {
          obj.align = align
        }
      })
    })
    this.data.showMenu = false
    this.data.history.push(clone(this.data.row))
    this.update()
  }

  noToEn (i) {
    return String.fromCharCode(97 + parseInt(i))
  }

  getStyleByAlign(align){
  	if(this.data.mark.align.default === align){
  		return '';
  	}
  	return ' '+this.data.mark.align[align];
  }
}

module.exports = Spread
