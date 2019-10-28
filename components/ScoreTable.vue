<template>
  <div
    v-if="queryData !== null"
    class="wly-table-container"
    data-toggle="wlyTable"
    style="opacity: 1; height: 371px; padding-bottom: 55px;"
  >
    <div class="wly-table-header">
      <table class="table table-striped table-hover" style="width: 1868.29px;">
        <thead>
          <tr>
            <th v-for="(fieldName, i) in queryData.fieldNameList" :key="i">
              <span class :title="`依 ${fieldName} 降序`">{{ fieldName }}</span>
            </th>
          </tr>
        </thead>
      </table>
    </div>
    <div class="wly-table-body">
      <table class="table table-striped table-hover" style="margin-top: -47.8571px;">
        <thead>
          <tr>
            <th v-for="(fieldName, i) in queryData.fieldNameList" :key="i">
              <span class :title="`依 ${fieldName} 降序`">{{ fieldName }}</span>
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(item, i) in queryData.list" :key="i" :data-wlytable-item-id="i">
            <th v-for="(value, fieldName) in item" :key="fieldName">
              <span>{{ value }}</span>
            </th>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="wly-table-pagination">
      <div class="paginate-simple">
        <a class="paginate-button previous disabled" title="上一页" data-wlytable-page="0"></a>
        <span>
          <a class="paginate-button current" data-wlytable-page="1">1</a>
          <a class="paginate-button" data-wlytable-page="2">2</a>
          <a class="paginate-button" data-wlytable-page="3">3</a>
        </span>
        <a class="paginate-button next" title="下一页" data-wlytable-page="2"></a>
        <a class="paginate-button" data-wlytable-page="492" title="最后一页">{{ queryData.lastPage }}</a>
      </div>
    </div>
    <div class="wly-table-loading" style="display: none" data-wlytable="loading">
      <div class="page-loader__spinner" style="display: none">
        <svg viewBox="25 25 50 50">
          <circle cx="50" cy="50" r="20" fill="none" stroke-width="2" stroke-miterlimit="10" />
        </svg>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'nuxt-property-decorator'
import { ScoreData } from '../api/interfaces/field'
import QueryApiData from '../api/interfaces/QueryApiData'

@Component({})
export default class ScoreTable extends Vue {
  @Prop({ default: null })
  readonly queryData!: QueryApiData|null
}
</script>

<style scoped lang="scss">
</style>
