import aTemplate from 'a-template'
import { $ } from 'zepto-browserify'
import clone from 'clone'
import template from './table.html'
import returnTable from './return-table.html'
import style from './a-table.css'

const defs = {
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
      td:'a-table-icon a-table-icon-td03',
      th:'a-table-icon a-table-icon-th02'
    }
  }
}

$('body').append(`<style>${style}</style>`)

class aTable extends aTemplate {

  constructor (ele, option) {
    super()
    this.id = this.getRandText(10)
    this.addTemplate(template, this.id)
    this.data = $.extend(true, {}, defs, option)
    let data = this.data
    data.point = {x: -1, y: -1}
    data.selectedRowNo = -1
    data.selectedColNo = -1
    data.showBtnList = true
    data.row = this.parse($(ele).html())
    data.highestRow = this.highestRow
    data.history = []
    data.inputMode = 'table'
    data.cellClass = ''
    data.history.push(clone(data.row))
    this.convert = {}
    this.convert.getStyleByAlign = this.getStyleByAlign
    this.convert.setClass = this.setClass
    $(ele).wrap(`<div data-id="${this.id}"></div>`)
    $(ele).remove()
    this.update()
  }

  highestRow () {
    let arr = []
    this.data.row.forEach((item, i) => {
      if (!item || !item.col) {
        return
      }
      item.col.forEach((obj, t) => {
        let length = parseInt(obj.colspan)
        for (let i = 0; i < length; i++) {
          arr.push(i)
        }
      })
    })
    return arr
  }

  getCellByIndex (x, y) {
    return $(`[data-id="${this.id}"] [data-cell-id="${x}-${y}"]`)
  }

  getCellInfoByIndex (x, y) {
    let id = this.id
    let $cell = this.getCellByIndex(x, y)
    if ($cell.length === 0) {
      return false
    }
    let left = $cell.offset().left
    let top = $cell.offset().top
    let returnLeft = -1
    let returnTop = -1
    let width = parseInt($cell.attr('colspan'))
    let height = parseInt($cell.attr('rowspan'))
    $(`[data-id="${this.id}"] .js-table-header th`).each(function (i) {
      if ($(this).offset().left === left) {
        returnLeft = i
      }
    })
    $(`[data-id="${this.id}"] .js-table-side`).each(function (i) {
      if ($(this).offset().top === top) {
        returnTop = i
      }
    })
    return {x: returnLeft - 1, y: returnTop, width: width, height: height}
  }

  getLargePoint () {
    let minXArr = []
    let minYArr = []
    let maxXArr = []
    let maxYArr = []
    for (let i = 0, n = arguments.length; i < n; i++) {
      minXArr.push(arguments[i].x)
      minYArr.push(arguments[i].y)
      maxXArr.push(arguments[i].x + arguments[i].width)
      maxYArr.push(arguments[i].y + arguments[i].height)
    }
    let minX = Math.min.apply(Math, minXArr)
    let minY = Math.min.apply(Math, minYArr)
    let maxX = Math.max.apply(Math, maxXArr)
    let maxY = Math.max.apply(Math, maxYArr)
    return {x: minX, y: minY, width: maxX - minX, height: maxY - minY}
  }

  getSelectedPoints () {
    let arr = []
    let self = this
    this.data.row.forEach((item, i) => {
      if (!item.col) {
        return false
      }
      item.col.forEach((obj, t) => {
        if (obj.selected) {
          let point = self.getCellInfoByIndex(t, i)
          if (point) {
            arr.push(point)
          }
        }
      })
    })
    return arr
  }

  getSelectedPoint () {
    let arr = this.getSelectedPoints()
    if (arr && arr[0]) {
      return arr[0]
    }
  }

  getAllPoints () {
    let arr = []
    let self = this
    this.data.row.forEach((item, i) => {
      if (!item || !item.col) {
        return
      }
      item.col.forEach((obj, t) => {
        let point = self.getCellInfoByIndex(t, i)
        if (point) {
          arr.push(point)
        }
      })
    })
    return arr
  }

  getCellIndexByPos (x, y) {
    let a, b
    let self = this
    this.data.row.forEach((item, i) => {
      if (!item || !item.col) {
        return
      }
      item.col.forEach((obj, t) => {
        let point = self.getCellInfoByIndex(t, i)
        if (point.x === x && point.y === y) {
          a = t
          b = i
        }
      })
    })
    return {row: b, col: a}
  }

  getCellByPos (x, y) {
    let index = this.getCellIndexByPos(x, y)
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

  markup () {
    let data = this.data
    if (data.splited) {
      data.splited = false
      return
    }
    let points = this.getSelectedPoints()
    let point1 = this.getLargePoint.apply(null, points)
    let self = this
    data.row.forEach((item, i) => {
      if (!item || !item.col) {
        return false
      }
      item.col.forEach((obj, t) => {
        let point = self.getCellInfoByIndex(t, i)
        let mark = {}
        if (obj.selected) {
          if (point.x === point1.x) {
            mark.left = true
          }
          if (point.x + point.width === point1.x + point1.width) {
            mark.right = true
          }
          if (point.y === point1.y) {
            mark.top = true
          }
          if (point.y + point.height === point1.y + point1.height) {
            mark.bottom = true
          }
        }
        obj.mark = mark
      })
    })
  }

  selectRange (a, b) {
    let data = this.data
    if (!data.point) {
      return
    }
    let self = this
    data.row[a].col[b].selected = true
    let points = this.getSelectedPoints()
    let point3 = this.getLargePoint.apply(null, points)
    data.row.forEach((item, i) => {
      if (!item || !item.col) {
        return false
      }
      item.col.forEach((obj, t) => {
        let point = self.getCellInfoByIndex(t, i)
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
    let data = this.data
    data.point = {x: b, y: a}
    data.row.forEach((item, i) => {
      if (!item || !item.col) {
        return false
      }
      item.col.forEach((obj, t) => {
        if (i !== a || t !== b) {
          obj.selected = false
        }
      })
    })
    if (!data.row[a].col[b].selected) {
      data.row[a].col[b].selected = true
    }
  }

  unselectCells () {
    this.data.row.forEach((item, i) => {
      if (!item || !item.col) {
        return false
      }
      item.col.forEach((obj, t) => {
        obj.selected = false
      })
    })
  }

  removeCell (cell) {
    let row = this.data.row
    for (let i = 0, n = row.length; i < n; i++) {
      let col = row[i].col
      for (let t = 0, m = col.length; t < m; t++) {
        let obj = col[t]
        if (obj === cell) {
          col.splice(t, 1)
          t--
          m--
        }
      }
    }
  }

  removeSelectedCellExcept (cell) {
    let row = this.data.row
    for (let i = 0, n = row.length; i < n; i++) {
      let col = row[i].col
      for (let t = 0, m = col.length; t < m; t++) {
        let obj = col[t]
        if (obj !== cell && obj.selected) {
          col.splice(t, 1)
          t--
          m--
        }
      }
    }
  }

  contextmenu () {
    let $ele = $(`[data-id="${this.id}"]`)
    let $target = $(this.e.target)
    let data = this.data
    this.e.preventDefault()
    data.showMenu = true
    data.menuX = this.e.clientX
    data.menuY = this.e.clientY
    this.update()
  }

  parse (html) {
    let self = this
    let arr1 = []
    $('tr', html).each(function () {
      let ret2 = {}
      let arr2 = []
      ret2.col = arr2
      $('th,td', this).each(function () {
        let obj = {}
        if ($(this).is('th')) {
          obj.type = 'th'
        }else {
          obj.type = 'td'
        }
        obj.colspan = $(this).attr('colspan') || 1
        obj.rowspan = $(this).attr('rowspan') || 1
        obj.value = $(this).html()
        let classAttr = $(this).attr('class')
        let cellClass = ''
        if (classAttr) {
          let classList = classAttr.split(/\s+/)
          classList.forEach((item) => {
            let align = self.getAlignByStyle(item)
            if (align) {
              obj.align = align
            }else {
              cellClass += ' ' + item
            }
          })
        }
        obj.cellClass = cellClass.substr(1)
        arr2.push(obj)
      })
      arr1.push(ret2)
    })
    return arr1
  }

  toMarkdown (html) {
    let $table = $(html)
    let ret = ''
    $table.find('tr').each(function (i) {
      ret += '| '
      let $children = $(this).children()
      $children.each(function () {
        ret += $(this).html()
        ret += ' | '
      })
      if (i == 0) {
        ret += '\n| '
        $children.each(function () {
          ret += '--- | '
        })
      }
      ret += '\n'
    })
    return ret
  }

  getTable () {
    return this
      .getHtml(returnTable, true)
      .replace(/ class=""/g, '')
      .replace(/class="(.*)? "/g, 'class="$1"')
  }

  getMarkdown () {
    return this.toMarkdown(this.getHtml(returnTable, true))
  }

  onUpdated () {
    let points = this.getAllPoints()
    let point = this.getLargePoint.apply(null, points)
    let width = point.width
    let selectedPoints = this.getSelectedPoints()
    let $th = $('.js-table-header th', `[data-id="${this.id}"]`)
    let elem = $('.a-table-selected .a-table-editable', `[data-id="${this.id}"]`)[0]
    if (elem && !this.data.showMenu && selectedPoints.length === 1) {
      setTimeout(() => {
        elem.focus()
        if (typeof window.getSelection != 'undefined'
          && typeof document.createRange != 'undefined') {
          let range = document.createRange()
          range.selectNodeContents(elem)
          range.collapse(false)
          let sel = window.getSelection()
          sel.removeAllRanges()
          sel.addRange(range)
        } else if (typeof document.body.createTextRange != 'undefined') {
          let textRange = document.body.createTextRange()
          textRange.moveToElementText(elem)
          textRange.collapse(false)
          textRange.select()
        }
      }, 1)
    }
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
    let data = this.data
    let row = data.row
    let hist = data.history
    if (data.history.length === 0) {
      return
    }

    while(JSON.stringify(row) === JSON.stringify(data.row)){
      row = hist.pop()
    }

    if (row) {
      if (hist.length === 0) {
        hist.push(clone(row))
      }
      data.row = row
      this.update()
    }
  }

  insertRow (a, newrow) {
    let data = this.data
    let row = data.row
    if (row[a]) {
      row.splice(a, 0, {col: newrow})
    }else if (row.length === a) {
      row.push({col: newrow})
    }
  }

  insertCellAt (a, b, item) {
    let data = this.data
    let row = data.row
    if (row[a] && row[a].col) {
      row[a].col.splice(b, 0, item)
    }
  }

  selectRow (i) {
    let data = this.data
    this.unselectCells()
    data.showMenu = false
    let points = this.getAllPoints()
    let point1 = this.getLargePoint.apply(null, points)
    let newpoint = {x: parseInt(i),y: 0,width: 1,height: point1.height}
    let targetPoints = []
    let self = this
    points.forEach((point) => {
      if (self.hitTest(newpoint, point)) {
        targetPoints.push(point)
      }
    })
    targetPoints.forEach((point) => {
      let cell = self.getCellByPos(point.x, point.y)
      cell.selected = true
    })
    data.mode = 'col'
    data.selectedColNo = -1
    data.selectedRowNo = i
    this.contextmenu()
    this.update()
  }

  selectCol (i) {
    let points = this.getAllPoints()
    let point1 = this.getLargePoint.apply(null, points)
    let newpoint = {x: 0,y: parseInt(i),width: point1.width,height: 1}
    let targetPoints = []
    let self = this
    let data = this.data
    this.unselectCells()
    data.showMenu = false
    points.forEach((point) => {
      if (self.hitTest(newpoint, point)) {
        targetPoints.push(point)
      }
    })
    targetPoints.forEach((point) => {
      let cell = self.getCellByPos(point.x, point.y)
      cell.selected = true
    })
    data.mode = 'row'
    data.selectedRowNo = -1
    data.selectedColNo = i
    this.contextmenu()
    this.update()
  }

  removeCol (selectedno) {
    let data = this.data
    data.showMenu = false
    let self = this
    let points = this.getAllPoints()
    let point1 = this.getLargePoint.apply(null, points)
    let newpoint = {x: parseInt(selectedno),y: 0,width: 1,height: point1.height}
    let targetPoints = []
    points.forEach((point) => {
      if (self.hitTest(newpoint, point)) {
        targetPoints.push(point)
      }
    })
    targetPoints.forEach((point) => {
      let cell = self.getCellByPos(point.x, point.y)
      if (cell.colspan === 1) {
        self.removeCell(cell)
      }else {
        cell.colspan = parseInt(cell.colspan) - 1
      }
    })
    data.history.push(clone(data.row))
    this.update()
  }

  removeRow (selectedno) {
    let data = this.data
    data.showMenu = false
    let self = this
    let points = this.getAllPoints()
    let point1 = this.getLargePoint.apply(null, points)
    selectedno = parseInt(selectedno)
    let newpoint = {x: 0,y: selectedno,width: point1.width,height: 1}
    let nextpoint = {x: 0,y: selectedno + 1,width: point1.width,height: 1}
    let targetPoints = []
    let removeCells = []
    let insertCells = []
    points.forEach((point) => {
      if (self.hitTest(newpoint, point)) {
        targetPoints.push(point)
      }
    })
    points.forEach((point) => {
      if (self.hitTest(nextpoint, point)) {
        let cell = self.getCellByPos(point.x, point.y)
        cell.x = point.x
        if (point.y === nextpoint.y) {
          insertCells.push(cell)
        }
      }
    })
    targetPoints.forEach((point) => {
      let cell = self.getCellByPos(point.x, point.y)
      if (cell.rowspan === 1) {
        removeCells.push(cell)
      }else {
        cell.rowspan = parseInt(cell.rowspan) - 1
        if (selectedno === point.y) {
          cell.x = point.x
          insertCells.push(cell)
        }
      }
    })
    insertCells.sort((a, b) => {
      if (a.x > b.x) {
        return 1
      }else {
        return -1
      }
    })
    removeCells.forEach((cell) => {
      self.removeCell(cell)
    })
    data.row.splice(selectedno, 1)
    if (insertCells.length > 0) {
      data.row[selectedno] = {col: insertCells}
    }
    data.history.push(clone(data.row))
    this.update()
  }

  static isSmartPhone(){
      var agent = navigator.userAgent
      if (agent.indexOf('iPhone') > 0 || agent.indexOf('iPad') > 0
        || agent.indexOf('ipod') > 0 || agent.indexOf('Android') > 0) {
        return true
      }else {
        return false
      }
  }

  updateTable (b, a) {
    let data = this.data
    let type = this.e.type
    let isSmartPhone = aTable.isSmartPhone()
    if (type === 'mouseup' && this.data.showMenu) {
      return
    }
    [a, b] = [parseInt(a), parseInt(b)]
    data.mode = 'cell'
    data.selectedRowNo = -1
    data.selectedColNo = -1
    data.showMenu = false
    if (type === 'compositionstart') {
      data.beingInput = true
    }
    if (type === 'compositionend') {
      data.beingInput = false
    }
    if (type === 'click') {
      if (this.e.shiftKey) {
        this.selectRange(a, b)
      }
    }else if ((type === 'mousedown' && !isSmartPhone) || type === 'touchstart') {
      if (this.e.button !== 2 && !this.e.ctrlKey) {
        this.mousedown = true
        if (!this.data.row[a].col[b].selected) {
          this.select(a, b)
          if(!this.data.beingInput){
            this.update()
          }
        }else {
          this.select(a, b)
        }
      }
    }else if (type === 'mousemove' && !isSmartPhone) {
      if (this.mousedown) {
        this.selectRange(a, b)
      }
    }else if (type === 'mouseup' && !isSmartPhone) {
      this.mousedown = false
      this.selectRange(a, b)
    }else if (type === 'contextmenu') {
      this.mousedown = false
      this.contextmenu()
    }else {
      data.row[a].col[b].value = $(this.e.target).html()
      if (this.afterEntered) {
        this.afterEntered()
      }
    }
  }

  insertColRight (selectedno) {
    let data = this.data
    data.selectedRowNo = parseInt(selectedno)
    data.showMenu = false
    let self = this
    let points = this.getAllPoints()
    let point1 = this.getLargePoint.apply(null, points)
    let newpoint = {x: parseInt(selectedno),y: 0,width: 1,height: point1.height}
    let targetPoints = []
    points.forEach((point) => {
      if (self.hitTest(newpoint, point)) {
        targetPoints.push(point)
      }
    })
    targetPoints.forEach((point) => {
      let index = self.getCellIndexByPos(point.x, point.y)
      let cell = self.getCellByPos(point.x, point.y)
      let newcell = {type: 'td',colspan: 1,rowspan: cell.rowspan,value: ''}
      if (typeof index.row !== 'undefined' && typeof index.col !== 'undefined') {
        if (point.width + point.x - newpoint.x > 1) {
          cell.colspan = parseInt(cell.colspan) + 1
          cell.colspan += ''
        }else {
          self.insertCellAt(index.row, index.col + 1, newcell)
        }
      }
    })
    data.history.push(clone(data.row))
    this.update()
  }

  insertColLeft (selectedno) {
    let data = this.data
    data.selectedRowNo = parseInt(selectedno) + 1
    data.showMenu = false
    let self = this
    let points = this.getAllPoints()
    let point1 = this.getLargePoint.apply(null, points)
    let newpoint = {x: parseInt(selectedno) - 1,y: 0,width: 1,height: point1.height}
    let targetPoints = []
    points.forEach((point) => {
      if (self.hitTest(newpoint, point)) {
        targetPoints.push(point)
      }
    })
    if (selectedno === 0) {
      let length = point1.height
      for (let i = 0; i < length; i++) {
        let newcell = {type: 'td',colspan: 1,rowspan: 1,value: ''}
        self.insertCellAt(i, 0, newcell)
      }
      self.update()
      return
    }
    targetPoints.forEach((point) => {
      let index = self.getCellIndexByPos(point.x, point.y)
      let cell = self.getCellByPos(point.x, point.y)
      let newcell = {type: 'td',colspan: 1,rowspan: cell.rowspan,value: ''}
      if (typeof index.row !== 'undefined' && typeof index.col !== 'undefined') {
        if (point.width + point.x - newpoint.x > 1) {
          cell.colspan = parseInt(cell.colspan) + 1
          cell.colspan += ''
        }else {
          self.insertCellAt(index.row, index.col + 1, newcell)
        }
      }
    })
    data.history.push(clone(data.row))
    this.update()
  }

  beforeUpdated () {
    this.changeSelectOption()
    this.markup()
  }

  insertRowBelow (selectedno) {
    let data = this.data
    data.showMenu = false
    data.selectedColNo = parseInt(selectedno)
    let self = this
    let points = this.getAllPoints()
    let point1 = this.getLargePoint.apply(null, points)
    selectedno = parseInt(selectedno)
    let newpoint = {x: 0,y: selectedno + 1,width: point1.width,height: 1}
    let targetPoints = []
    let newRow = []
    points.forEach((point) => {
      if (self.hitTest(newpoint, point)) {
        targetPoints.push(point)
      }
    })
    if (targetPoints.length === 0) {
      let length = point1.width
      for (let i = 0; i < length; i++) {
        let newcell = {type: 'td',colspan: 1,rowspan: 1,value: ''}
        newRow.push(newcell)
      }
      self.insertRow(selectedno + 1, newRow)
      self.update()
      return
    }
    targetPoints.forEach((point) => {
      let index = self.getCellIndexByPos(point.x, point.y)
      let cell = self.getCellByPos(point.x, point.y)
      if (!cell) {
        return
      }
      let newcell = {type: 'td',colspan: 1,rowspan: 1,value: ''}
      if (typeof index.row !== 'undefined' && typeof index.col !== 'undefined') {
        if (point.height > 1 && point.y <= selectedno) {
          cell.rowspan = parseInt(cell.rowspan) + 1
          cell.rowspan += ''
        } else if (index.row === selectedno + 1) {
          let length = parseInt(cell.colspan)
          for (let i = 0; i < length; i++) {
            newRow.push({type: 'td',colspan: 1,rowspan: 1,value: ''})
          }
        } else {
          self.insertCellAt(index.row + 1, index.col, newcell)
        }
      }
    })
    this.insertRow(selectedno + 1, newRow)
    data.history.push(clone(data.row))
    this.update()
  }

  insertRowAbove (selectedno) {
    let data = this.data
    data.showMenu = false
    data.selectedColNo = parseInt(selectedno) + 1
    let self = this
    let points = this.getAllPoints()
    let point1 = this.getLargePoint.apply(null, points)
    selectedno = parseInt(selectedno)
    let newpoint = {x: 0,y: selectedno - 1,width: point1.width,height: 1}
    let targetPoints = []
    let newRow = []
    points.forEach((point) => {
      if (self.hitTest(newpoint, point)) {
        targetPoints.push(point)
      }
    })
    if (selectedno === 0) {
      let length = point1.width
      for (let i = 0; i < length; i++) {
        let newcell = {type: 'td',colspan: 1,rowspan: 1,value: ''}
        newRow.push(newcell)
      }
      self.insertRow(0, newRow)
      self.update()
      return
    }
    targetPoints.forEach((point) => {
      let index = self.getCellIndexByPos(point.x, point.y)
      let cell = self.getCellByPos(point.x, point.y)
      if (!cell) {
        return
      }
      let newcell = {type: 'td',colspan: 1,rowspan: 1,value: ''}
      if (typeof index.row !== 'undefined' && typeof index.col !== 'undefined') {
        if (point.height > 1) {
          cell.rowspan = parseInt(cell.rowspan) + 1
          cell.rowspan += ''
        } else if (index.row === selectedno - 1) {
          let length = parseInt(cell.colspan)
          for (let i = 0; i < length; i++) {
            newRow.push({type: 'td',colspan: 1,rowspan: 1,value: ''})
          }
        } else {
          self.insertCellAt(index.row, index.col, newcell)
        }
      }
    })
    this.insertRow(selectedno, newRow)
    data.history.push(clone(this.data.row))
    this.update()
  }

  mergeCells () {
    let data = this.data
    if (!this.isSelectedCellsRectangle()) {
      alert('結合するには、結合範囲のすべてのセルを選択する必要があります。')
      return
    }
    let points = this.getSelectedPoints()
    let point = this.getLargePoint.apply(null, points)
    let cell = this.getCellByPos(point.x, point.y)
    this.removeSelectedCellExcept(cell)
    cell.colspan = point.width
    cell.rowspan = point.height
    data.showMenu = false
    data.history.push(clone(data.row))
    this.update()
  }

  splitCell () {
    let data = this.data
    let selectedPoints = this.getSelectedPoints()
    if (selectedPoints.length > 1) {
      alert('結合解除するには、セルが一つだけ選択されている必要があります')
      return
    }
    let selectedPoint = this.getSelectedPoint()
    let bound = {x: 0, y: selectedPoint.y, width: selectedPoint.x, height: selectedPoint.height}
    let points = this.getAllPoints()
    let currentIndex = this.getCellIndexByPos(selectedPoint.x, selectedPoint.y)
    let currentCell = this.getCellByPos(selectedPoint.x, selectedPoint.y)
    let width = parseInt(currentCell.colspan)
    let height = parseInt(currentCell.rowspan)
    let self = this
    let targets = []
    let cells = []
    let rows = []
    points.forEach((point) => {
      if (self.hitTest(bound, point)) {
        let index = self.getCellIndexByPos(point.x, point.y)
        let cell = self.getCellByPos(point.x, point.y)
        targets.push(index)
      }
    })
    targets.forEach((item) => {
      let row = item.row
      if (item.row < currentIndex.row) {
        return
      }
      if (!rows[row]) {
        rows[row] = []
      }
      rows[row].push(item)
    })
    for (let i = 1, n = rows.length; i < n; i++) {
      if (!rows[i]) {
        continue
      }
      rows[i].sort((a, b) => {
        if (a.col > b.col) {
          return 1
        }else {
          return -1
        }
      })
    }
    for (let i = selectedPoint.y, n = i + height; i < n; i++) {
      if (!rows[i]) {
        rows[i] = []
        rows[i].push({row: i,col: -1})
      }
    }
    rows.forEach((row) => {
      let index = row[row.length - 1]
      for (let i = 0; i < width; i++) {
        self.insertCellAt(index.row, index.col + 1, {type: 'td',colspan: 1,rowspan: 1,value: '', selected: true})
      }
    })
    this.removeCell(currentCell)
    data.showMenu = false
    data.history.push(clone(data.row))
    data.splited = true
    this.update()
  }

  changeCellTypeTo (type) {
    let data = this.data
    data.row.forEach((item, i) => {
      item.col.forEach((obj, t) => {
        if (obj.selected) {
          obj.type = type
        }
      })
    })
    data.showMenu = false
    data.history.push(clone(data.row))
    this.update()
  }

  align (align) {
    let data = this.data
    data.row.forEach((item, i) => {
      item.col.forEach((obj, t) => {
        if (obj.selected) {
          obj.align = align
        }
      })
    })
    data.showMenu = false
    data.history.push(clone(data.row))
    this.update()
  }

  getStyleByAlign (val) {
    let align = this.data.mark.align
    if (align.default === val) {
      return ''
    }
    return align[val]
  }

  getAlignByStyle (style) {
    let align = this.data.mark.align
    if (align.right === style) {
      return 'right'
    }else if (align.center === style) {
      return 'center'
    }else if (align.left === style) {
      return 'left'
    }
  }

  isSelectedCellsRectangle () {
    let selectedPoints = this.getSelectedPoints()
    let largePoint = this.getLargePoint.apply(null, selectedPoints)
    let points = this.getAllPoints()
    let flag = true
    let self = this
    points.forEach((point) => {
      if (self.hitTest(largePoint, point)) {
        let cell = self.getCellByPos(point.x, point.y)
        if (!cell.selected) {
          flag = false
        }
      }
    })
    return flag
  }

  changeInputMode (source) {
    let data = this.data
    data.inputMode = source
    if (source === 'source') {
      data.tableResult = this.getTable()
    }else {
      data.row = this.parse(data.tableResult)
    }
    this.update()
  }

  changeCellClass () {
    let data = this.data
    let cellClass = data.cellClass
    data.row.forEach((item, i) => {
      item.col.forEach((obj, t) => {
        if (obj.selected) {
          obj.cellClass = cellClass
        }
      })
    })
    data.history.push(clone(data.row))
    this.update()
  }

  changeSelectOption () {
    let cellClass
    let flag = true
    let data = this.data
    data.row.forEach((item, i) => {
      item.col.forEach((obj, t) => {
        if (obj.selected) {
          if (!cellClass) {
            cellClass = obj.cellClass
          } else if (cellClass && cellClass != obj.cellClass) {
            flag = false
          }
        }
      })
    })
    if (flag) {
      data.cellClass = cellClass
    }else {
      data.cellClass = ''
    }
  }
}

module.exports = aTable
