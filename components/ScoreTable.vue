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
            <a :class="{ disabled: data.page-1 <= 0 }" class="paginate-button previous" title="上一页"></a>
            <span>
              <a v-for="pageNum in curtVisiblePageBtn" :key="pageNum" :class="{ current: pageNum === data.page }" class="paginate-button">{{ pageNum }}</a>
            </span>
            <a :class="{ disabled: data.page+1 <= 0 }" class="paginate-button next" title="下一页"></a>
            <a
              class="paginate-button"
              title="最后一页"
            >{{ data.lastPage }}</a>
          </div>
        </div>
        <div ref="tLoading" class="wly-table-loading" style="display: none" data-wlytable="loading">
          <div class="page-loader__spinner" style="display: none">
            <svg viewBox="25 25 50 50">
              <circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import $ from 'jquery'
import { Component, Vue, Prop, Watch } from 'nuxt-property-decorator'
import { ScoreData } from '../common/interfaces/field'
import QueryApiData from '../common/interfaces/QueryApiData'

@Component({})
export default class ScoreTable extends Vue {
  data: QueryApiData | null = null
  isFullScreen = false

  created () {
    this.fetchScoreTableData()
  }

  mounted () {
    $(window).resize(() => {
      this.adjustDisplay()
    })
  }

  @Watch('data')
  onDataChanged () {
    this.$nextTick(() => {
      this.adjustDisplay()
    })
  }

  async fetchScoreTableData () {
    const respData = await this.$axios.$get('./api/query?db=test&page=1&pagePer=50')
    if (respData.success) {
      this.data = respData.data
    }
  }

  get curtVisiblePageBtn () {
    if (this.data === null) return []
    const arr = []
    const showItemNum = 5
    for (let i = 0; i < showItemNum; i++) {
      const pg = this.data.page + i
      if (pg <= this.data.lastPage)
        arr.push(pg)
    }
    return arr
  }

  getHeight () {
    return ($(window).height() || 0) - ($('.main-navbar').outerHeight(true)  || 0) - ($('.card .card-header').outerHeight(true) || 0) - 80;
  }

  adjustDisplay() {
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
</style>
