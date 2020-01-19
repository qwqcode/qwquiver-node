<template>
  <div class="grades-table card">
    <div v-if="data !== null" class="card-header">
      <h2 class="card-title" data-wlytable="title">
        一中 - 高一下 期末 [理科] - 全市考生成绩
        <span
          style="font-size: 13px;vertical-align: bottom;"
        >[页码 {{ data.page }}/{{ data.lastPage }}]</span>
      </h2>
      <small class="card-subtitle">本次考试共有 {{ data.total }} 人参加</small>
      <div class="actions">
        <span class="actions__item show-top-badge" @click="$searchLayer.toggle()">
          <i class="zmdi zmdi-search"></i>
          <span>搜索</span>
        </span>
        <span class="actions__item" @click="$refs.tableDataDownloadDialog.show()">
          <i class="zmdi zmdi-download"></i>
          <span>下载</span>
        </span>
        <span data-wly-toggle="wlyTablePrint" class="actions__item">
          <i class="zmdi zmdi-print"></i>
          <span>打印</span>
        </span>
        <span class="actions__item" @click="$refs.tableCtrlDialog.show()">
          <i class="zmdi zmdi-format-paint"></i>
          <span>表格调整</span>
        </span>
        <span class="actions__item" @click="$refs.tableDataCounterDialog.show()">
          <i class="zmdi zmdi-flash"></i>
          <span>平均分</span>
        </span>
        <span data-wly-toggle="wlyTableFullScreen" class="actions__item">
          <i class="zmdi zmdi-fullscreen"></i>
          <span>全屏显示</span>
        </span>
      </div>
    </div>
    <div v-if="data !== null" class="card-block" style="padding: 0;">
      <div
        ref="tContainer"
        class="wly-table-container"
        data-toggle="wlyTable"
        style="opacity: 1; height: 371px; padding-bottom: 55px;"
      >
        <!-- Table -->
        <div ref="tHeader" class="wly-table-header">
          <table class="table table-striped table-hover" style="width: 1868.29px;">
            <thead>
              <tr>
                <th
                  v-for="(fieldName, i) in fieldList"
                  :key="i"
                  @click="switchSort(fieldName)"
                >
                  <span
                    :class="getFieldItemClass(fieldName)"
                    :title="getFieldItemHoverTitle(fieldName)"
                  >{{ getFieldItemLabel(fieldName) }}</span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div ref="tBody" class="wly-table-body">
          <table class="table table-striped table-hover" style="margin-top: -47.8571px;">
            <thead>
              <tr>
                <th
                  v-for="(fieldName, i) in fieldList"
                  :key="i"
                >{{ getFieldItemLabel(fieldName) }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in data.list" :key="i" :data-wlytable-item-id="i">
                <th v-for="fieldName in fieldList" :key="fieldName">
                  <span>{{ item[fieldName] }} </span>
                </th>
              </tr>
            </tbody>
          </table>
        </div>


        <div ref="tPagination" class="wly-table-pagination">
          <div class="paginate-simple">
            <a
              :class="{ disabled: data.page-1 <= 0 }"
              class="paginate-button previous"
              title="上一页"
              @click="switchPage(data.page-1)"
            ></a>
            <span>
              <a
                v-for="(pageNum, i) in visiblePageBtn"
                :key="i"
                :class="{ current: pageNum === data.page }"
                class="paginate-button"
                @click="switchPage(pageNum)"
              >{{ pageNum }}</a>
            </span>
            <a
              :class="{ disabled: data.page+1 > data.lastPage }"
              class="paginate-button next"
              title="下一页"
              @click="switchPage(data.page+1)"
            ></a>
            <a
              class="paginate-button"
              title="最后一页"
              @click="switchPage(data.lastPage)"
            >{{ data.lastPage }}</a>
          </div>
        </div>
      </div>
    </div>
    <LoadingLayer ref="tLoading" />

    <ScoreTableDialog ref="tableCtrlDialog" title="表格显示调整">
      <div class="table-ctrl-dialog">
          <span class="dialog-label">点按下列方块来 显示 / 隐藏 字段</span>
          <div v-if="data !== null" class="field-list">
            <span
              v-for="(fieldName, i) in data.fieldList"
              :key="i"
              class="field-item active"
            >{{ getFieldItemLabel(fieldName) }}</span>
          </div>
          <span class="dialog-label">每页显示项目数量 （数字不宜过大）</span>
          <div class="page-per-show">
            <input type="number" class="page-per-show-input" placeholder="每页显示数" min="1" value="50" />
          </div>
          <span class="dialog-label">表格字体大小调整</span>
          <div class="table-font-size-control">
            <span class="font-size-minus">-</span>
            <span class="font-size-value">15</span>
            <span class="font-size-plus">+</span>
          </div>
      </div>
    </ScoreTableDialog>

    <ScoreTableDialog ref="tableDataDownloadDialog" title="保存数据为电子表格">
      <span class="dialog-label">保存 一中 - 高一下 期末 [理科] 的 全市考生成绩 为电子表格</span>
      <span class="dialog-btn" data-dialog-func="save-now">保存 仅第 1 页 数据</span>
      <span class="dialog-btn" data-dialog-func="save-now-noPaging">保存 第 1~10 页 数据</span>
      <span class="dialog-label">保存 一中 - 高一下 期末 [理科] 全部数据为电子表格</span>
      <span class="dialog-btn" data-dialog-func="save-noPaging">保存 全市成绩</span>
    </ScoreTableDialog>

    <ScoreTableDialog ref="tableDataCounterDialog" title="数据统计">
      <div class="table-data-counter">
      <span class="dialog-label">数据 "全市考生成绩" 平均值</span>
      <span class="data-item">
        <span class="data-name">总分</span>
        <span class="data-value">470.775406504065</span>
      </span>
      <span class="data-item">
        <span class="data-name">语文</span>
        <span class="data-value">97.96036585365853</span>
      </span>
      <span class="data-item">
        <span class="data-name">数学</span>
        <span class="data-value">94.47154471544715</span>
      </span>
      </div>
    </ScoreTableDialog>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
import LoadingLayer from './LoadingLayer.vue'
import ScoreTableDialog from './ScoreTableDialog.vue'
import F, { ScoreData } from '~~/server/Field'
import * as FG from '~~/server/Field/Grp'
import { FTrans } from '~~/server/Field/Trans'
import * as ApiT from '~~/server/ApiTypes'
import $ from 'jquery'
import _ from 'lodash'

@Component({
  components: { LoadingLayer, ScoreTableDialog }
})
export default class ScoreTable extends Vue {
  data: ApiT.QueryData | null = null
  fieldList: F[] | null = null
  params: ApiT.QueryParams | null = null
  isFullScreen = false
  loading!: LoadingLayer

  created () {
    Vue.prototype.$scoreTable = this
  }

  destroyed () {
    Vue.prototype.$scoreTable = undefined
  }

  mounted () {
    this.loading = this.$refs.tLoading as LoadingLayer
    $(window).resize(() => {
      this.adjustDisplay()
    })

    let params: ApiT.QueryParams = {
      tb: 'test',
      page: 1,
      pagePer: 50
    }
    if (this.$route.query) params = { ...params, ...this.$route.query }
    this.onRouteQueryChanged(params as ApiT.QueryParams)
  }

  @Watch('data')
  onDataChanged () {
    this.$nextTick(() => {
      this.adjustDisplay()
    })

    if (this.data === null) return

    // 构建有序字段名列表
    const rawFieldNameList = this.data.fieldList
    const fieldList: F[] = this.fieldList = []

    _.forEach(_.union(FG.F_MAIN, FG.F_RANK, FG.F_NUM_ALL), (fieldName) => {
      if (rawFieldNameList.includes(fieldName))
        fieldList.push(fieldName)
    })
  }

  @Watch('$route.query')
  async onRouteQueryChanged (query: any) {
    if (query === this.params) return

    this.loading.show()
    this.params = query
    const respData = await this.$axios.$get('./api/query', {
      params: this.params
    })
    this.loading.hide()
    if (respData.success) {
      this.data = respData.data
    }
  }

  fetchData (params: ApiT.QueryParams, initialize = false) {
    const reqParams: ApiT.QueryParams = !initialize
      ? { ...this.params, ...params }
      : params
    this.$router.replace({ query: reqParams as any })
  }

  switchTable (tableName: string) {
    this.fetchData({ tb: tableName }, true)
  }

  switchPage (pageNum: number) {
    if (!this.data || pageNum <= 0 || pageNum > this.data.lastPage) return
    this.fetchData({ page: pageNum })
  }

  switchSort (fieldName: F) {
    if (!this.data) return
    this.fetchData({
      page: 1,
      sort: JSON.stringify({
        [fieldName]: this.data.sortList[fieldName] === -1 ? 1 : -1
      })
    })
  }

  get visiblePageBtn () {
    if (this.data === null) return []
    const arr: number[] = []
    const lItemNum = 3
    const rItemNum = 3
    for (let i = lItemNum; i > 0; i--) {
      const pg = this.data.page - i
      if (pg > 0) arr.push(pg)
    }
    for (let i = 0; i < rItemNum; i++) {
      const pg = this.data.page + i
      if (pg <= this.data.lastPage) arr.push(pg)
    }
    return arr
  }

  getHeight () {
    return (
      ($(window).height() || 0) -
      ($('.main-navbar').outerHeight(true) || 0) -
      ($('.card .card-header').outerHeight(true) || 0) -
      80
    )
  }

  adjustDisplay () {
    const topNavbar = $('.main-navbar')

    const containerEl = $(this.$refs.tContainer)
    const headerEl = $(this.$refs.tHeader)
    const headerTableEl = headerEl.find('table')
    const bodyEl = $(this.$refs.tBody)
    const bodyTableEl = bodyEl.find('table')
    const paginationEl = $(this.$refs.tPagination)

    let tableHeight = this.getHeight()
    if (this.isFullScreen)
      tableHeight = tableHeight + (topNavbar.outerHeight(true) || 0)

    containerEl.css('height', tableHeight + 'px')

    if (!this.isFullScreen)
      containerEl.css('padding-bottom', paginationEl.outerHeight() || 0)
    else
      containerEl.css(
        'padding-bottom',
        (paginationEl.outerHeight() || 0) - (headerEl.outerHeight() || 0) + 20
      )

    // 设置悬浮样式
    bodyTableEl.css(
      'margin-top',
      `-${(bodyEl.find('table thead').outerHeight() || 1) - 1}`
    )

    // 获取 body table thead tr 中每个 th 对象
    const bodyThItems = bodyTableEl.find(
      '> thead > tr:first-child:not(.no-records-found) > *'
    )
    $.each(bodyThItems, (i: number, item: any) => {
      // 逐个设置 head table 中每个 th 的宽度 === body th 的宽度
      headerTableEl
        .find(`> thead th:nth-child(${Number(i) + 1})`)
        .width($(item).width() || '')
    })
    headerTableEl.width((bodyTableEl.outerWidth(true) || 0) - 2) // minus the 2px border-width
  }

  getFieldItemLabel (fieldName: F) {
    return FTrans(fieldName)
  }

  getFieldItemClass (fieldName: F) {
    if (!this.data) return ''
    const sortType = this.data.sortList[fieldName]
    if (typeof sortType !== 'number') return ''
    return sortType === 1 ? 'sort-asc' : 'sort-desc'
  }

  getFieldItemHoverTitle (fieldName: F) {
    if (!this.data) return ''
    const sortType = this.data.sortList[fieldName]
    let title = `依 总分 ${sortType === -1 ? '升序' : '降序'} `
    if (typeof sortType === 'number')
      title += `[当前为 ${sortType === -1 ? '降序' : '升序'}]`
    return title
  }
}
</script>

<style scoped lang="scss">
/* table */
table {
  border-spacing: 0;
  border-collapse: collapse;
}

.table {
  width: 100%;
  max-width: 100%;
  margin-bottom: 20px;
  font-size: 15px;
}

.table > thead > tr > th,
.table > tbody > tr > th,
.table > tfoot > tr > th,
.table > thead > tr > td,
.table > tbody > tr > td,
.table > tfoot > tr > td {
  padding: 0.9rem 1.2rem;
  vertical-align: top;
  color: #707070;
  border-top: 1px solid #f2f2f2;
  text-align: center;
}

@media screen and (max-width: 559px) {
  .table > thead > tr > th,
  .table > tbody > tr > th,
  .table > tfoot > tr > th,
  .table > thead > tr > td,
  .table > tbody > tr > td,
  .table > tfoot > tr > td {
    padding: 8px 5px;
    min-width: 100px;
  }

  .table > thead:first-child > tr:first-child > th:first-child,
  .table > tbody > tr > td:first-child {
    min-width: 50px;
  }
}

.table > caption + thead > tr:first-child > th,
.table > colgroup + thead > tr:first-child > th,
.table > thead:first-child > tr:first-child > th,
.table > caption + thead > tr:first-child > td,
.table > colgroup + thead > tr:first-child > td,
.table > thead:first-child > tr:first-child > td {
  border-top: 0;
}

.table > caption + thead > tr:first-child > th,
.table > colgroup + thead > tr:first-child > th,
.table > thead:first-child > tr:first-child > th,
.table > caption + thead > tr:first-child > td,
.table > colgroup + thead > tr:first-child > td,
.table > thead:first-child > tr:first-child > td {
  color: #707070;
  background-color: #fff;
  border-bottom: 2px solid #f2f2f2;
}

.table-striped > tbody > tr:nth-of-type(odd) {
  background: #fff;
}

.table-striped > tbody > tr:nth-of-type(even) {
  background: #fcfcfc;
}

/* add sorting icons to gridview sort links */
a.asc:after,
a.desc:after {
  position: relative;
  top: 1px;
  display: inline-block;
  font-family: 'Glyphicons Halflings';
  font-style: normal;
  font-weight: normal;
  line-height: 1;
  padding-left: 5px;
}

a.asc:after {
  content: /*"\e113"*/ '\e151';
}

a.desc:after {
  content: /*"\e114"*/ '\e152';
}

.sort-numerical a.asc:after {
  content: '\e153';
}

.sort-numerical a.desc:after {
  content: '\e154';
}

.sort-ordinal a.asc:after {
  content: '\e155';
}

.sort-ordinal a.desc:after {
  content: '\e156';
}

.table th,
label {
  font-weight: 500;
}

.wly-table-container {
  position: relative;
  clear: both;
}

.wly-table-header {
  overflow: hidden;
  /* margin-right: 17px; */

  table {
    margin-bottom: 0;
  }
  thead {
    overflow: hidden;

    th span {
      cursor: pointer;

      &.sort-desc,
      &.sort-asc {
        color: #1a73e8;

        &:after {
          font-family: Material-Design-Iconic-Font;
          position: absolute;
          width: 20px;
        }
      }

      &.sort-desc:after {
        content: '\f2fe';
      }
      &.sort-asc:after {
        content: '\f303';
      }
    }
  }
}

@media screen and (max-width: 559px) {
  .wly-table-header thead th span.select:after {
    position: initial;
  }
}

@media print {
  .wly-table-header thead th span.select {
    color: #fff;
  }

  .wly-table-header thead th span:after {
    display: none;
  }
}

.wly-table-body {
  overflow-x: auto;
  overflow-y: auto;
  height: 100%;
  transition: filter 0.15s ease-in-out;

  table {
    border: 0;

    thead {
    }

    tbody td {
      position: relative;

      .ranking {
        font-size: 12px;
        vertical-align: text-top;
        color: #1a73e8;
        position: absolute;
        margin-left: 3px;
      }
    }
  }

  .table-link {
    cursor: pointer;
  }
}

.wly-table-pagination {
  overflow: hidden;
  background: #fff;
}

/* pagination */
.paginate-simple {
  text-align: center;
  padding: 10px 0;

  .paginate-button {
    background-color: #efefef;
    display: inline-block;
    color: #8a8a8a;
    vertical-align: top;
    border-radius: 50%;
    margin: 0 1px 0 2px;
    font-size: 1rem;
    cursor: pointer;
    width: 2.5rem;
    height: 2.5rem;
    line-height: 2.5rem;
    text-align: center;
  }

  .paginate-button {
    &.current {
      background-color: #2ebcfc;
      color: #fff;
      cursor: default;
    }

    &.current,
    &.disabled {
      cursor: default;
    }

    &:not(.current):not(.disabled):focus,
    &:not(.current):not(.disabled):hover {
      background-color: #e2e2e2;
      color: #575757;
      text-decoration: none;
    }

    &.next,
    &.previous,
    &.first-page,
    &.last-page {
      font-size: 0;
      position: relative;
    }

    @media screen and (-ms-high-contrast: active), (-ms-high-contrast: none) {
      &.next,
      &.previous,
      &.first-page,
      &.last-page {
        font-size: 1rem;
      }
    }

    &.previous:before,
    &.next:before,
    &.first-page:before,
    &.last-page:before {
      font-family: Material-Design-Iconic-Font;
      font-size: 1rem;
      line-height: 2.55rem;
    }

    &.previous:before {
      content: '\f2fa';
    }

    &.next:before {
      content: '\f2fb';
    }

    &.disabled {
      opacity: 0.6;
    }

    &.disabled:focus,
    &.disabled:hover {
      color: #8a8a8a;
    }
  }
}
</style>
