<template>
  <div>
    <CardCSSCode />
    <!-- eslint-disable-next-line vue/attributes-order -->
    <component v-for="layer in AllLayersNameList" :is="layer" :key="layer" />
    <TopHeader />

    <div class="wrap">
      <Sidebar />

      <div :class="{ 'full': contFullScreen }" class="main-content-area">
        <ScoreTable v-show="$route.name === 'index'" />
        <nuxt class="content-inner" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import * as ApiT from '~~/server/ApiTypes'
import F from '~~/server/Field'
import TopHeader from '@/components/TopHeader.vue'
import Sidebar from '@/components/Sidebar.vue'
import ScoreTable from '@/components/ScoreTable.vue'
import CardCSSCode from '@/components/Card.vue'
import Layers from '@/components/layers'
import $ from 'jquery'
import _ from 'lodash'

@Component({
  components: { TopHeader, Sidebar, ScoreTable, ...Layers, CardCSSCode }
})
export default class Default extends Vue {
  Conf: ApiT.ConfData|null = null
  contFullScreen = false

  created () {
    Vue.prototype.$app = this
  }

  mounted () {
    // 载入最新的考试数据
    let params: ApiT.QueryParams = {
      page: 1,
      pageSize: 50,
      init: true
    }
    if (this.$route.query) params = { ...params, ...this.$route.query }
    this.$scoreTable.onRouteQueryChanged(params as ApiT.QueryParams)
  }

  get ExamMap () {
    if (this.Conf === null) return null
    return this.Conf.examMap
  }

  get ExamMapSorted () {
    if (this.ExamMap === null) return null
    const arr = _.sortBy(this.$app.ExamMap, o => o.Date ? -(new Date(o.Date).getTime()) : -1)
    return arr
  }

  get ExamNameToLabelObj () {
    if (this.ExamMap === null) return null
    const obj = {}
    _.forEach(this.ExamMapSorted, (e) => { obj[e.Name] = e.Label })
    return obj
  }

  get FieldTransDict () {
    if (this.Conf === null) return null
    return this.Conf.fieldTransDict
  }

  transField (f: F) {
    if (!this.FieldTransDict) return f
    return this.FieldTransDict[f] || f
  }

  get AllLayersNameList () {
    return Object.keys(Layers)
  }

  getContentHeight () {
    return (
      ($(window).height() || 0) -
      ($('.main-navbar').outerHeight(true) || 0) -
      ($('.card .card-header').outerHeight(true) || 0) -
      80
    )
  }

  setContFullScreen (val: boolean) {
    this.contFullScreen = val
  }
}
</script>

<style scoped lang="scss">
.wrap {
  min-height: 100%;
  height: auto;
  margin: 0 auto;
  padding: 0;
  transition: filter 0.15s ease-in-out;

  & > .container {
    padding: 70px 15px 20px;
  }

  .main-content-area {
    position: relative;
    $paddingLR: 25px;
    padding-left: 300px;
    padding-right: $paddingLR;
    padding-top: 80px;
    padding-bottom: 10px;

    &.full {
      padding-left: $paddingLR !important;
    }
  }
}

/* table-fixed */
.wly-table-container {
  position: relative;
  clear: both;
}

.wly-table-header {
  overflow: hidden;
  /* margin-right: 17px; */
}

.wly-table-header table {
  margin-bottom: 0;
}

.wly-table-header thead {
  overflow: hidden;
}

.wly-table-header thead th {
}

.wly-table-header thead th span {
  cursor: pointer;
}

.wly-table-header thead th span.select {
  color: var(--mainColor);
}

.wly-table-header thead th span.select:after {
  font-family: Material-Design-Iconic-Font;
  position: absolute;
  width: 20px;
}
</style>
