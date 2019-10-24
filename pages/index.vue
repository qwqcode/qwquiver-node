<template>
  <div class="main-content-area">
    <div class="site-index content-inner">
      <div class="grades-table card">
        <div class="card-header">
          <h2 class="card-title" data-wlytable="title">
            一中 - 高一下 期末 [理科] - 全市考生成绩
            <span style="font-size: 13px;vertical-align: bottom;"
              >[页码 1/492]</span
            >
          </h2>
          <small class="card-subtitle">本次考试共有 492 人参加</small>
          <div class="actions">
            <span
              onclick="wlySearch.showPanel()"
              class="actions__item show-top-badge"
            >
              <i class="zmdi zmdi-search"></i> <span>搜索</span>
            </span>
            <span onclick="wlyTableDataSave.show()" class="actions__item">
              <i class="zmdi zmdi-download"></i> <span>下载</span>
            </span>
            <span data-wly-toggle="wlyTablePrint" class="actions__item">
              <i class="zmdi zmdi-print"></i> <span>打印</span>
            </span>
            <span
              onclick="wlyTable.DisplayController.show()"
              class="actions__item"
            >
              <i class="zmdi zmdi-format-paint"></i> <span>表格调整</span>
            </span>
            <span
              onclick="window.wlyTable.showDataCounter()"
              class="actions__item"
            >
              <i class="zmdi zmdi-flash"></i> <span>平均分</span>
            </span>
            <span data-wly-toggle="wlyTableFullScreen" class="actions__item">
              <i class="zmdi zmdi-fullscreen"></i> <span>全屏显示</span>
            </span>
          </div>
        </div>
        <div class="card-block" style="padding: 0;">
          <ScoreTable />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ScoreTable from '@/components/ScoreTable'

export default {
  components: {
    ScoreTable
  }
}
</script>

<style>
.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.title {
  font-family: 'Quicksand', 'Source Sans Pro', -apple-system, BlinkMacSystemFont,
    'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  display: block;
  font-weight: 300;
  font-size: 100px;
  color: #35495e;
  letter-spacing: 1px;
}

.subtitle {
  font-weight: 300;
  font-size: 42px;
  color: #526488;
  word-spacing: 5px;
  padding-bottom: 15px;
}

.links {
  padding-top: 15px;
}
</style>
