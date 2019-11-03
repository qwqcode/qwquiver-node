<template>
  <div class="grades-table card">
    <div class="card-header">
      <h2 class="card-title" data-wlytable="title">
        一中 - 高一下 期末 [理科] - 全市考生成绩
        <span style="font-size: 13px;vertical-align: bottom;">[页码 1/492]</span>
      </h2>
      <small class="card-subtitle">本次考试共有 492 人参加</small>
      <div class="actions">
        <span onclick="wlySearch.showPanel()" class="actions__item show-top-badge">
          <i class="zmdi zmdi-search"></i>
          <span>搜索</span>
        </span>
        <span onclick="wlyTableDataSave.show()" class="actions__item">
          <i class="zmdi zmdi-download"></i>
          <span>下载</span>
        </span>
        <span data-wly-toggle="wlyTablePrint" class="actions__item">
          <i class="zmdi zmdi-print"></i>
          <span>打印</span>
        </span>
        <span onclick="wlyTable.DisplayController.show()" class="actions__item">
          <i class="zmdi zmdi-format-paint"></i>
          <span>表格调整</span>
        </span>
        <span onclick="window.wlyTable.showDataCounter()" class="actions__item">
          <i class="zmdi zmdi-flash"></i>
          <span>平均分</span>
        </span>
        <span data-wly-toggle="wlyTableFullScreen" class="actions__item">
          <i class="zmdi zmdi-fullscreen"></i>
          <span>全屏显示</span>
        </span>
      </div>
    </div>
    <div class="card-block" style="padding: 0;">
      <div
        v-if="data !== null"
        ref="tContainer"
        class="wly-table-container"
        data-toggle="wlyTable"
        style="opacity: 1; height: 371px; padding-bottom: 55px;"
      >
        <div ref="tHeader" class="wly-table-header">
          <table class="table table-striped table-hover" style="width: 1868.29px;">
            <thead>
              <tr>
                <th v-for="(fieldName, i) in data.fieldNameList" :key="i">
                  <span class :title="`依 ${fieldName} 降序`">{{ fieldName }}</span>
                </th>
              </tr>
            </thead>
          </table>
        </div>
        <div ref="tBody" class="wly-table-body">
          <table class="table table-striped table-hover" style="margin-top: -47.8571px;">
            <thead>
              <tr>
                <th v-for="(fieldName, i) in data.fieldNameList" :key="i">
                  <span class :title="`依 ${fieldName} 降序`">{{ fieldName }}</span>
                </th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in data.list" :key="i" :data-wlytable-item-id="i">
                <th v-for="(value, fieldName) in item" :key="fieldName">
                  <span>{{ value }}</span>
                </th>
              </tr>
            </tbody>
          </table>
        </div>
        <div ref="tPagination" class="wly-table-pagination">
          <div class="paginate-simple">
            <a :class="{ disabled: data.page-1 <= 0 }" class="paginate-button previous" title="上一页" @click="switchPage(data.page-1)"></a>
            <span>
              <a v-for="(pageNum, i) in visiblePageBtn" :key="i" :class="{ current: pageNum === data.page }" class="paginate-button" @click="switchPage(pageNum)">{{ pageNum }}</a>
            </span>
            <a :class="{ disabled: data.page+1 > data.lastPage }" class="paginate-button next" title="下一页" @click="switchPage(data.page+1)"></a>
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
  </div>
</template>

<script lang="ts">
import $ from 'jquery'
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
import { ScoreData } from '../common/interfaces/field'
import { QueryApiData, QueryApiParams } from '../common/interfaces/QueryApi'
import LoadingLayer from './LoadingLayer.vue'

@Component({
  components: { LoadingLayer }
})
export default class ScoreTable extends Vue {
  data: QueryApiData | null = null
  params: QueryApiParams | null = null
  isFullScreen = false
  loading!: LoadingLayer

  created () {
  }

  mounted () {
    this.loading = this.$refs.tLoading as LoadingLayer
    $(window).resize(() => {
      this.adjustDisplay()
    })

    this.fetchData({
      db: 'test',
      page: 1,
      pagePer: 50
    })
  }

  @Watch('data')
  onDataChanged () {
    this.$nextTick(() => {
      this.adjustDisplay()
    })
  }

  async fetchData (params: QueryApiParams) {
    this.loading.show()
    this.params = params
    const respData = await this.$axios.$get('./api/query', { params })
    this.loading.hide()
    if (respData.success) {
      this.data = respData.data
    }
  }

  async switchPage (pageNum: number) {
    if (!this.data || pageNum <= 0 || pageNum > this.data.lastPage) return
    await this.fetchData({ ...this.params, ...{ page: pageNum } })
  }

  get visiblePageBtn () {
    if (this.data === null) return []
    const arr = []
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
    return ($(window).height() || 0) - ($('.main-navbar').outerHeight(true)  || 0) - ($('.card .card-header').outerHeight(true) || 0) - 80
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
    const bodyThItems = bodyTableEl.find('> thead > tr:first-child:not(.no-records-found) > *')
    $.each(
      bodyThItems,
      (i: number, item: any) => {
        // 逐个设置 head table 中每个 th 的宽度 === body th 的宽度
        headerTableEl
          .find(`> thead th:nth-child(${Number(i) + 1})`)
          .width($(item).width() || '')
      }
    )
    headerTableEl.width((bodyTableEl.outerWidth(true) || 0) - 2) // minus the 2px border-width
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
  font-family: "Glyphicons Halflings";
  font-style: normal;
  font-weight: normal;
  line-height: 1;
  padding-left: 5px;
}

a.asc:after {
  content: /*"\e113"*/ "\e151";
}

a.desc:after {
  content: /*"\e114"*/ "\e152";
}

.sort-numerical a.asc:after {
  content: "\e153";
}

.sort-numerical a.desc:after {
  content: "\e154";
}

.sort-ordinal a.asc:after {
  content: "\e155";
}

.sort-ordinal a.desc:after {
  content: "\e156";
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

      &.select {
        color: #03a9f4;

        &:after {
          font-family: Material-Design-Iconic-Font;
          position: absolute;
          width: 20px;
        }

        &.sort-desc:after {
          content: "\f2fe";
        }
        &.sort-asc:after {
          content: "\f303";
        }
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
        color: #03a9f4;
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
      content: "\f2fa";
    }

    &.next:before {
      content: "\f2fb";
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

/* wly-search-panel */
.wly-search-panel {
  background-color: rgba(0, 0, 0, 0.35);
  position: fixed;
  align-items: center;
  justify-content: center;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 999;
  overflow: hidden;

  .search-panel-inner {
    transition: transform 0.3s, -webkit-transform 0.3s;
    transform: scaleY(0);
    -webkit-transform: scaleY(0);

    &.show-panel {
      -webkit-transform: inherit;
      transform: inherit;
    }
  }

  .card-block {
    padding: 0;
  }

  .search-form {
    .search-input {
      display: block;
      padding: 2.1rem;
      width: 100%;
      border: 0;
      text-align: center;
      outline: none;
      font-size: 21px;
      color: #2196f3;

      &:focus {
      }
    }

    .search-btn {
      position: absolute;
      right: 0;
      top: 0;
      width: 100px;
      height: 100%;
      background: #03a9f4;
      box-shadow: 0 0 4px 1px rgba(181, 181, 181, 0.64);
      color: #fff;
      margin-right: 5px;
      font-size: 30px;
      border: 0;
      outline: none;
      transition: all 0.2s ease-in-out;

      &:hover,
      &:active,
      &:focus {
        background: #30bfff;
      }
    }

    &.query-by-category-form {
      line-height: 90px;
      padding: 0 20px;

      & > select {
        width: auto;
        padding: 5px 5px;
        outline: none;
        border: 1px solid transparent;
        box-shadow: 0 1px 4px rgba(0, 0, 0, 0.11);
        border-radius: 3px;
        cursor: pointer;
      }

      .middle-text {
        margin: 0 20px;
        color: #878990;
        font-weight: bold;
      }

      & > select:focus {
        border: 1px solid #2196f3;
      }
    }
  }

  .search-toolbar {
    padding: 15px 30px;
    width: 100%;
    background: rgb(236, 236, 236);
    border-radius: 0 0 10px 10px;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.075);
    margin-top: -4px;

    .action-btn {
      background: #fff;
      color: #5f5f5f;
      border: none;
      padding: 10px 30px;
      border-radius: 4px;
      box-shadow: 0 2px 7px rgba(0, 0, 0, 0.09);
      outline: none;
      transition: all 0.2s;
      margin-right: 14px;

      &:hover {
        box-shadow: 0 2px 7px rgba(0, 0, 0, 0.16);
        color: #000;
      }
    }

    .copyright {
      float: right;
      line-height: 55px;
      color: #888;

      &:before {
        color: #03a9f4;
        content: "\f1b1";
        margin-right: 5px;
        font: normal normal normal 14px/1 Material-Design-Iconic-Font;
      }
    }
  }

  @media screen and (max-width: 559px) {
    .search-panel-inner {
      transition: transform 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;
      -webkit-transform: translate(0px, -100vh);
      transform: translate(0px, -100vh);
      width: 100%;
    }

    .wly-search-panel {
      align-items: inherit;
      padding-top: 55px;
      background-color: #fff;

      .container {
        padding: 0;
        box-shadow: none;
        border-bottom: 1px solid #f4f4f4;
      }
    }

    .search-form {
      .search-input {
        padding: 25px 25px;
      }

      .search-btn {
        width: 45px;
        line-height: 100%;
        box-shadow: none;
        background: #fff;
        color: #03a9f4;
        font-size: 20px;
      }
    }

    .search-toolbar {
      border-radius: 2px;
      padding: 10px 15px;
      background: #fbfbfb;
      border-bottom: 1px solid #f4f4f4;
      box-shadow: none;
      margin-top: 0;
      text-align: center;

      .action-btn {
        padding: 6px 16px;
        margin-right: 10px;
        border-radius: 2px;
        font-size: 14px;
      }

      .copyright {
        position: fixed;
        display: block;
        color: #888;
        font-size: 12px;
        padding: 20px 10px;
        line-height: 21px;
        bottom: 0;

        &:before {
          color: #888;
          font-size: 12px;
        }
      }
    }
  }
}

/* wly-table-action-dialog */
.wly-table-action-dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.35);
  z-index: 999;
  display: flex;
  align-items: center;

  .wly-table-action-dialog-inner {
    background-color: #fff;
    margin: 0 auto;
    padding: 20px;
    border-radius: 4px;
    width: 400px;
  }

  .dialog-title {
    border-bottom: 1px solid #f4f4f4;
    padding-bottom: 15px;
  }

  .title-text {
    font-size: 17px;
  }

  .close-btn {
    float: right;
    cursor: pointer;
    padding: 5px;

    &:hover {
      color: #03a9f4;
    }
  }

  .dialog-body {
    color: #5e5e5e;
  }

  .dialog-label {
    color: #7d7d7d;
    margin-bottom: 10px;
    display: block;
    font-weight: normal;
    word-break: break-all;
    white-space: normal;
    text-align: left;
    border-left: 1px solid #2196f3;
    padding-left: 15px;
    border-radius: 0;
    margin-top: 30px;
    margin-bottom: 10px;

    &:first-child {
      margin-top: 20px;
    }
  }

  .dialog-btn {
    display: block;
    padding: 10px 15px;
    text-align: center;
    box-shadow: 0 1px 4px #d8d8d8;
    border-radius: 3px;
    cursor: pointer;
    transition: 0.3s all;
    margin-bottom: 15px;

    &:hover {
      color: #2196f3;
    }
  }

  &.display-controller {
    .field-list {
      .field-item {
        position: relative;
        display: inline-block;
        padding: 6px 20px;
        cursor: pointer;
        margin: 0 0 13px 10px;
        border-radius: 3px;
        box-shadow: 0 1px 4px rgba(177, 177, 177, 0.36);

        &:after {
          font-family: Material-Design-Iconic-Font;
          position: absolute;
          top: -10px;
          right: 0;
          font-size: 18px;
          color: #f78787;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.19);
        }

        &:not(.active):after {
          content: "\f15b";
        }
      }
    }

    .page-per-show-input {
      border-radius: 3px;
      border: 1px solid #eee;
      background: #fbfbfb;
      padding: 5px 15px;
      width: 100%;
      margin-top: 10px;
      text-align: center;
      outline: none;
      transition: 0.3s all;

      &:focus {
        border: 1px solid #2196f3;
      }
    }

    .table-font-size-control {
      text-align: center;
      font-size: 18px;
      margin-top: 15px;
    }

    .table-font-size-control .font-size-minus {
      border-radius: 5px 0 0 5px;
    }

    .table-font-size-control .font-size-value {
      font-weight: bold;
    }

    .table-font-size-control .font-size-plus {
      border-radius: 0 5px 5px 0;
    }

    .table-font-size-control > span {
      box-shadow: 0 1px 4px rgba(177, 177, 177, 0.36);
      padding: 4px 17px;
      display: inline-block;
      transition: 0.3s all;
    }

    .table-font-size-control .font-size-minus,
    .table-font-size-control .font-size-plus {
      cursor: pointer;
      user-select: none;
    }

    .table-font-size-control .font-size-minus:hover,
    .table-font-size-control .font-size-plus:hover {
      box-shadow: 0 1px 4px rgba(177, 177, 177, 0.58);
      color: #2196f3;
    }
  }

  &.wly-table-data-counter {
    .data-item {
      display: flex;
      padding: 10px 20px;

      &:not(:last-child) {
        border-bottom: 1px solid #f4f4f4;
      }
    }

    .data-name {
      flex-basis: 50px;
    }

    .data-value {
      flex: 1;
      padding-left: 20px;
      border-left: 1px solid #f4f4f4;
    }
  }
}
</style>
