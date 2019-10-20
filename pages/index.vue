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
          <div
            class="wly-table-container"
            data-toggle="wlyTable"
            style="opacity: 1; height: 371px; padding-bottom: 55px;"
          >
            <div class="wly-table-header">
              <table
                class="table table-striped table-hover"
                style="width: 1868.29px;"
              >
                <thead>
                  <tr>
                    <th style="width: 89.7143px;">
                      <span data-wlytable-thead="num" class="" title="依 # 降序"
                        >#</span
                      >
                    </th>
                    <th style="width: 163.429px;">
                      <span
                        data-wlytable-thead="name"
                        class=""
                        title="依 姓名 降序"
                        >姓名</span
                      >
                    </th>
                    <th style="width: 194.286px;">
                      <span
                        data-wlytable-thead="school"
                        class=""
                        title="依 学校 降序"
                        >学校</span
                      >
                    </th>
                    <th style="width: 293.714px;">
                      <span
                        data-wlytable-thead="clas"
                        class=""
                        title="依 班级 降序"
                        >班级</span
                      >
                    </th>
                    <th style="width: 132.571px;">
                      <span
                        data-wlytable-thead="overall"
                        class="select sort-desc"
                        title="依 总分 升序 [当前为降序]"
                        >总分</span
                      >
                    </th>
                    <th style="width: 163.429px;">
                      <span
                        data-wlytable-thead="ranking"
                        class=""
                        title="依 总排名 降序"
                        >总排名</span
                      >
                    </th>
                    <th style="width: 150.286px;">
                      <span
                        data-wlytable-thead="yw"
                        class=""
                        title="依 语文 降序"
                        >语文</span
                      >
                    </th>
                    <th style="width: 132.571px;">
                      <span
                        data-wlytable-thead="sx"
                        class=""
                        title="依 数学 降序"
                        >数学</span
                      >
                    </th>
                    <th style="width: 150.857px;">
                      <span
                        data-wlytable-thead="yy"
                        class=""
                        title="依 英语 降序"
                        >英语</span
                      >
                    </th>
                    <th style="width: 133.143px;">
                      <span
                        data-wlytable-thead="wl"
                        class=""
                        title="依 物理 降序"
                        >物理</span
                      >
                    </th>
                    <th style="width: 133.143px;">
                      <span
                        data-wlytable-thead="hx"
                        class=""
                        title="依 化学 降序"
                        >化学</span
                      >
                    </th>
                    <th style="width: 133.143px;">
                      <span
                        data-wlytable-thead="sw"
                        class=""
                        title="依 生物 降序"
                        >生物</span
                      >
                    </th>
                  </tr>
                </thead>
              </table>
            </div>
            <div class="wly-table-body">
              <table
                class="table table-striped table-hover"
                style="margin-top: -47.8571px;"
              >
                <thead>
                  <tr>
                    <th>
                      <span data-wlytable-thead="num" class="" title="依 # 降序"
                        >#</span
                      >
                    </th>
                    <th>
                      <span
                        data-wlytable-thead="name"
                        class=""
                        title="依 姓名 降序"
                        >姓名</span
                      >
                    </th>
                    <th>
                      <span
                        data-wlytable-thead="school"
                        class=""
                        title="依 学校 降序"
                        >学校</span
                      >
                    </th>
                    <th>
                      <span
                        data-wlytable-thead="clas"
                        class=""
                        title="依 班级 降序"
                        >班级</span
                      >
                    </th>
                    <th>
                      <span
                        data-wlytable-thead="overall"
                        class="select sort-desc"
                        title="依 总分 升序 [当前为降序]"
                        >总分</span
                      >
                    </th>
                    <th>
                      <span
                        data-wlytable-thead="ranking"
                        class=""
                        title="依 总排名 降序"
                        >总排名</span
                      >
                    </th>
                    <th>
                      <span
                        data-wlytable-thead="yw"
                        class=""
                        title="依 语文 降序"
                        >语文</span
                      >
                    </th>
                    <th>
                      <span
                        data-wlytable-thead="sx"
                        class=""
                        title="依 数学 降序"
                        >数学</span
                      >
                    </th>
                    <th>
                      <span
                        data-wlytable-thead="yy"
                        class=""
                        title="依 英语 降序"
                        >英语</span
                      >
                    </th>
                    <th>
                      <span
                        data-wlytable-thead="wl"
                        class=""
                        title="依 物理 降序"
                        >物理</span
                      >
                    </th>
                    <th>
                      <span
                        data-wlytable-thead="hx"
                        class=""
                        title="依 化学 降序"
                        >化学</span
                      >
                    </th>
                    <th>
                      <span
                        data-wlytable-thead="sw"
                        class=""
                        title="依 生物 降序"
                        >生物</span
                      >
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr data-wlytable-item-id="0">
                    <td data-wlytable-item-fn="num">1</td>
                    <td data-wlytable-item-fn="name">
                      <span
                        class="table-link"
                        onclick="wlyMine.goToCharts('NAME', '一中', '市一中01班')"
                        >NAME</span
                      >
                    </td>
                    <td data-wlytable-item-fn="school">
                      <span
                        class="table-link"
                        onclick="wlySearch.queryBySchool($(this).html())"
                        >一中</span
                      >
                    </td>
                    <td data-wlytable-item-fn="clas">
                      <span
                        class="table-link"
                        onclick="wlySearch.queryByClass(wlyTableConfig.data.score[0].school, $(this).html())"
                        >市一中01班</span
                      >
                    </td>
                    <td data-wlytable-item-fn="overall">645</td>
                    <td data-wlytable-item-fn="ranking">1</td>
                    <td data-wlytable-item-fn="yw">116.5</td>
                    <td data-wlytable-item-fn="sx">125</td>
                    <td data-wlytable-item-fn="yy">131.5</td>
                    <td data-wlytable-item-fn="wl">94</td>
                    <td data-wlytable-item-fn="hx">96</td>
                    <td data-wlytable-item-fn="sw">82</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <div class="wly-table-pagination">
              <div class="paginate-simple">
                <a
                  class="paginate-button previous disabled"
                  title="上一页"
                  data-wlytable-page="0"
                ></a
                ><span
                  ><a class="paginate-button current" data-wlytable-page="1"
                    >1</a
                  ><a class="paginate-button" data-wlytable-page="2">2</a
                  ><a class="paginate-button" data-wlytable-page="3">3</a></span
                ><a
                  class="paginate-button next "
                  title="下一页"
                  data-wlytable-page="2"
                ></a
                ><a
                  class="paginate-button"
                  data-wlytable-page="492"
                  title="最后一页"
                  >492</a
                >
              </div>
            </div>
            <div
              class="wly-table-loading"
              style="display: none"
              data-wlytable="loading"
            >
              <div class="page-loader__spinner" style="display: none">
                <svg viewBox="25 25 50 50">
                  <circle
                    cx="50"
                    cy="50"
                    r="20"
                    fill="none"
                    stroke-width="2"
                    stroke-miterlimit="10"
                  ></circle>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  components: {}
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
