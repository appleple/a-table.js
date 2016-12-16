import aTemplate from 'a-template'
import { $ } from 'zepto-browserify'
import clone from 'clone'
var template = `<!-- BEGIN showMenu:exist -->
<ul class="a-table-menu" style="top:{menuY}px;left:{menuX}px;">
	<!-- BEGIN mode:touch#cell -->
	<li data-action-click="mergeCells"><!-- BEGIN lang:touch#ja -->セルの結合<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->merge cells<!-- END lang:touch#en --></li>
	<li data-action-click="splitCell()"><!-- BEGIN lang:touch#ja -->セルの分割<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->split cell<!-- END lang:touch#en --></li>
	<li data-action-click="changeCellTypeTo(th)"><!-- BEGIN lang:touch#ja -->thに変更する<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->change to th<!-- END lang:touch#en --></li>
	<li data-action-click="changeCellTypeTo(td)"><!-- BEGIN lang:touch#ja -->tdに変更する<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->change to td<!-- END lang:touch#en --></li>
	<li data-action-click="align(left)"><!-- BEGIN lang:touch#ja -->左寄せ<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->align left<!-- END lang:touch#en --></li>
	<li data-action-click="align(center)"><!-- BEGIN lang:touch#ja -->中央寄せ<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->align center<!-- END lang:touch#en --></li>
	<li data-action-click="align(right)"><!-- BEGIN lang:touch#ja -->右寄せ<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->align right<!-- END lang:touch#en --></li>
	<!-- END mode:touch#cell -->
	<!-- BEGIN mode:touch#col -->
	<li data-action-click="insertColLeft({selectedRowNo})"><!-- BEGIN lang:touch#ja -->左に列を追加<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->insert column on the left<!-- END lang:touch#en --></li>
	<li data-action-click="insertColRight({selectedRowNo})"><!-- BEGIN lang:touch#ja -->右に列を追加<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->insert column on the right<!-- END lang:touch#en --></li>
	<li data-action-click="removeCol({selectedRowNo})"><!-- BEGIN lang:touch#ja -->列を削除<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->remove column<!-- END lang:touch#en --></li>
	<!-- END mode:touch#col -->
	<!-- BEGIN mode:touch#row -->
	<li data-action-click="insertRowAbove({selectedColNo})"><!-- BEGIN lang:touch#ja -->上に行を追加<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->insert row above<!-- END lang:touch#en --></li>
	<li data-action-click="insertRowBelow({selectedColNo})"><!-- BEGIN lang:touch#ja -->下に行を追加<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->insert row below<!-- END lang:touch#en --></li>
	<li data-action-click="removeRow({selectedColNo})"><!-- BEGIN lang:touch#ja -->行を削除<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->remove row<!-- END lang:touch#en --></li>
	<!-- END mode:touch#row -->
</ul>
<!-- END showMenu:exist -->
<!-- BEGIN showBtnList:exist -->
<div class="a-table-btn-group-list">
	<div class="\{mark.btn.group\}">
		<!-- BEGIN inputMode:touch#table -->
		<button type="button" class="\{mark.btn.item\}" data-action-click="changeInputMode(source)"><i class="\{mark.icon.source\}"></i><!-- BEGIN lang:touch#ja -->ソース<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->Source<!-- END lang:touch#en --></button>
		<!-- END inputMode:touch#table -->
		<!-- BEGIN inputMode:touch#source -->
		<button type="button" class="\{mark.btn.itemActive\}" data-action-click="changeInputMode(table)"><i class="\{mark.icon.source\}"><!-- BEGIN lang:touch#ja -->ソース<!-- END lang:touch#ja --><!-- BEGIN lang:touch#en -->Source<!-- END lang:touch#en --></i></button>
		<!-- END inputMode:touch#source -->
	</div>
	<div class="\{mark.btn.group\}">
		<button type="button" class="\{mark.btn.item\}" data-action-click="mergeCells"><i class="\{mark.icon.merge\}"></i></button>
		<button type="button" class="\{mark.btn.item\}" data-action-click="splitCell()"><i class="\{mark.icon.split\}"></i></button>
		<button type="button" class="\{mark.btn.item\}" data-action-click="undo()"><i class="\{mark.icon.undo\}"></i></button>
	</div>
	<div class="\{mark.btn.group\}">
		<button type="button" class="\{mark.btn.item\}" data-action-click="changeCellTypeTo(td)"><i class="\{mark.icon.td\}"></i></button>
		<button type="button" class="\{mark.btn.item\}" data-action-click="changeCellTypeTo(th)"><i class="\{mark.icon.th\}"></i></button>
	</div>
	<div class="\{mark.btn.group\}">
		<button type="button" class="\{mark.btn.item\}" data-action-click="align(left)"><i class="\{mark.icon.alignLeft\}"></i></button>
		<button type="button" class="\{mark.btn.item\}" data-action-click="align(center)"><i class="\{mark.icon.alignCenter\}"></i></button>
		<button type="button" class="\{mark.btn.item\}" data-action-click="align(right)"><i class="\{mark.icon.alignRight\}"></i></button>
	</div>
	<div class="\{mark.btn.group\}">
		<select class="\{mark.selector.self\}" data-bind="cellClass" data-action-change="changeCellClass()">
			<option value=""></option>
			<!-- BEGIN selector.option:loop -->
			<option value="{value}">{label}</option>
			<!-- END selector.option:loop -->
		</select>
	</div>
</div>
<!-- END showBtnList:exist -->
<div class="a-table-wrapper">
	<!-- BEGIN inputMode:touch#table -->
	<table class="a-table">
		<tr class="a-table-header js-table-header">
			<th class="a-table-first"></th>
			<!-- BEGIN highestRow:loop -->
			<th data-action-click="selectRow({i})"<!-- \BEGIN selectedRowNo:touch#{i} -->class="selected"<!-- \END selectedRowNo:touch#{i} -->><span class="a-table-toggle-btn"></span></th>
			<!-- END highestRow:loop -->
		</tr>
		<!-- BEGIN row:loop -->
		<tr>
			<th class="a-table-side js-table-side<!-- \BEGIN selectedColNo:touch#{i} --> selected<!-- \END selectedColNo:touch#{i} -->" data-action-click="selectCol({i})"><span class="a-table-toggle-btn"></span></th>
			<!-- \BEGIN row.{i}.col:loop -->
			<td colspan="\{colspan\}" rowspan="\{rowspan\}" data-action="updateTable(\{i\},{i})" data-cell-id="\{i\}-{i}" class="<!-- \BEGIN selected:exist -->a-table-selected<!-- \END selected:exist --><!-- \BEGIN type:touch#th --> a-table-th<!-- END \type:touch#th --><!-- \BEGIN mark.top:exist --> a-table-border-top<!-- \END mark.top:exist --><!-- \BEGIN mark.right:exist --> a-table-border-right<!-- \END mark.right:exist --><!-- \BEGIN mark.bottom:exist --> a-table-border-bottom<!-- \END mark.bottom:exist --><!-- \BEGIN mark.left:exist --> a-table-border-left<!-- \END mark.left:exist --><!-- \BEGIN cellClass:exist --> \{cellClass\}<!-- \END cellClass:exist -->"><div class='a-table-editable \{align\}' contenteditable>\{value\}</div></td>
			<!-- \END row.{i}.col:loop -->
		</tr>
		<!-- END row:loop -->
	</table>
	<!-- END inputMode:touch#table -->
	<!-- BEGIN inputMode:touch#source -->
	<textarea data-bind="tableResult" class="a-table-textarea"></textarea>
	<!-- END inputMode:touch#source -->
</div>
`
var returnTable = `<table>
	<!-- BEGIN row:loop -->
	<tr>
		<!-- \BEGIN row.{i}.col:loop -->
		<!-- \BEGIN type:touch#th -->
		<th<!-- \BEGIN colspan:touchnot#1 --> colspan="\{colspan\}"<!-- \END colspan:touchnot#1 --><!-- \BEGIN rowspan:touchnot#1 --> rowspan="\{rowspan\}"<!-- \END rowspan:touchnot#1 --> class="<!-- \BEGIN align:exist -->\{align\}[getStyleByAlign]<!-- \END align:exist --><!-- \BEGIN cellClass:exist --> \{cellClass\}<!-- \END cellClass:exist -->">\{value\}</th>
		<!-- \END type:touch#th -->
		<!-- \BEGIN type:touch#td -->
		<td<!-- \BEGIN colspan:touchnot#1 --> colspan="\{colspan\}"<!-- \END colspan:touchnot#1 --><!-- \BEGIN rowspan:touchnot#1 --> rowspan="\{rowspan\}"<!-- \END rowspan:touchnot#1 --> class="<!-- \BEGIN align:exist -->\{align\}[getStyleByAlign] <!-- \END align:exist --><!-- \BEGIN cellClass:exist -->\{cellClass\}<!-- \END cellClass:exist -->">\{value\}</td>
		<!-- \END type:touch#td -->
		<!-- \END row.{i}.col:loop -->
	</tr>
	<!-- END row:loop -->
</table>
`
var style = `.a-table-wrapper {
  position: relative;
  z-index: 0;
  width: 100%;
}

.a-table-pseudo {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.a-table-wrapper {
  width: 100%;
  -ms-overflow-x: scroll;
  overflow-x: scroll;
}

.a-table {
  border-collapse: collapse;
  table-layout: fixed;
  font-family: "Open Sans", Helvetica, Arial, sans-serif;
}

.a-table input {
  width: 100%;
  height: 100%;
  display: block;
}

.a-table td,
.a-table th {
  text-align: left;
  width: 100px;
  white-space: nowrap;
  background-color: #fff;
  z-index: 0;
}

.a-table-cell-inner {
  position: relative;
  width: 100%;
  height: 100%;
}

.a-table th {
  border: 1px dashed #a7a7aa;
  background-color: transparent;
  font-weight: normal;
  cursor: pointer;
}

.a-table th:hover {
  background-image: -webkit-linear-gradient(#f8f8f8 0%, #e1e1e1 100%);
  background-image: -o-linear-gradient(#f8f8f8 0%, #e1e1e1 100%);
  background-image: linear-gradient(#f8f8f8 0%, #e1e1e1 100%);
  border: 1px solid #a7a7aa;
}

.a-table td {
  border: 1px solid #cccccc;
}

.a-table-editable:focus {
  outline: none;
}

.a-table td:first-child,
.a-table th:first-child {
  width: 30px;
}

.a-table .left {
  text-align: left;
}

.a-table .right {
  text-align: right;
}

.a-table .center {
  text-align: center;
}

.a-table .a-table-th {
  background-color: #ddd;
  font-weight: bold;
}

.a-table .a-table-selected {
  background-color: #eaf2f9;
}

.a-table-editable {
  min-width: 100%;
  min-height: 100%;
}

.a-table-pseudo {
  background-color: #ffffff;
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
}

.a-table-menu {
  display: block;
  list-style-type: none;
  padding: 0;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 999999;
  background-color: #fff;
  border: 1px solid #cccccc;
  color: #474747;
  font-size: 13px;
  -webkit-box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
  box-shadow: 0px 2px 4px 0px rgba(0, 0, 0, 0.5);
}

.a-table-menu li {
  display: block;
  font-size: 13px;
  padding: 9px 7px;
  border-bottom: 1px solid #ddd;
  cursor: pointer;
}

.a-table-menu li:hover {
  background-color: #ebf0f6;
}

.a-table-header th {
  text-align: center;
  height: 27px;
  vertical-align: middle;
}

.a-table-header .selected {
  background-color: #eaf2f9;
}

.a-table-side.selected {
  background-color: #eaf2f9;
}

.a-table .a-table-side {
  text-align: center;
  position: relative;
}

.a-table-btn-list {
  margin-bottom: 10px;
  display: table;
}

.a-table-btn {
  display: table-cell;
  border-left: none;
  border: 1px solid #d9d9d9;
  background-color: #f2f2f2;
  font-size: 12px;
  padding: 3px 5px;
}

.a-table-btn:first-child {
  border-top-left-radius: 3px;
  border-bottom-left-radius: 3px;
}

.a-table-btn:last-child {
  border-top-right-radius: 3px;
  border-bottom-right-radius: 3px;
}

.a-table-toggle-btn {
  display: inline-block;
  padding: 5px;
  cursor: pointer;
  position: relative;
}

.a-table-toggle-btn:after {
  content: "";
  display: block;
  border: solid transparent;
  content: " ";
  height: 0;
  width: 0;
  border-color: rgba(136, 183, 213, 0);
  border-top-color: #fff;
  border-width: 5px;
  margin-left: -5px;
  position: absolute;
  top: 2px;
  left: 5px;
}

.a-table-header th:hover .a-table-toggle-btn:after {
  border-top-color: #999;
}

.a-table-side .a-table-toggle-btn:after {
  border: solid transparent;
  border-left-color: #fff;
  border-width: 5px;
  top: 0;
}

.a-table-side:hover .a-table-toggle-btn:after {
  border-left-color: #999;
}

.a-table-first {
  width: 15px;
}

.a-table .a-table-border-left {
  border-left: 2px solid #006dec;
}

.a-table .a-table-border-top {
  border-top: 2px solid #006dec;
}

.a-table .a-table-border-right {
  border-right: 2px solid #006dec;
}

.a-table .a-table-border-bottom {
  border-bottom: 2px solid #006dec;
}

.a-table-border-top.a-table-border-left .a-table-pseudo:before {
  content: "";
  display: block;
  position: absolute;
  top: -3px;
  left: -3px;
  width: 6px;
  height: 6px;
  background-color: #006dec;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}

.a-table-border-bottom.a-table-border-right .a-table-pseudo:before {
  content: "";
  display: block;
  position: absolute;
  bottom: -3px;
  right: -3px;
  width: 6px;
  height: 6px;
  background-color: #006dec;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}

.a-table-textarea {
  width: 100%;
  height: 200px;
  margin-bottom: 10px;
  line-height: 1.7;
  border: 1px solid #ccc;
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
`

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
    let points = this.getSelectedPoints();
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
    if (type === 'click' && !isSmartPhone) {
      if (this.e.shiftKey) {
        this.selectRange(a, b)
      }
    }else if (type === 'mousedown' && !isSmartPhone) {
      if (this.e.button !== 2 && !this.e.ctrlKey) {
        this.mousedown = true
        if(!this.data.beingInput){
          if(points.length !== 1 || !this.data.row[a].col[b].selected) {
            this.select(a, b)
            this.update()
          }
        }
      }
    }else if (type === 'mousemove' && !isSmartPhone) {
      if (this.mousedown) {
        this.selectRange(a, b)
      }
    }else if (type === 'mouseup' && !isSmartPhone) {
      this.mousedown = false
    }else if (type === 'contextmenu') {
      this.mousedown = false
      this.contextmenu()
    }else if (type === 'touchstart'){
      if (points.length !== 1 || !this.data.row[a].col[b].selected) {
          if(!this.data.beingInput){
            this.select(a, b)
            this.update()
          }
      }
    }else if (type === 'input') {
      if($(this.e.target).hasClass('a-table-editable') && $(this.e.target).parents('td').attr('data-cell-id') === `${b}-${a}`){
        data.row[a].col[b].value = $(this.e.target).html()
      }
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
    let points = this.getSelectedPoints()
    if (!this.isSelectedCellsRectangle()) {
      alert('結合するには、結合範囲のすべてのセルを選択する必要があります。')
      return
    }
    if (points.length === 0){
      return
    }
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
    let length = selectedPoints.length
    if (length === 0) {
      return
    }else if (length > 1) {
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
