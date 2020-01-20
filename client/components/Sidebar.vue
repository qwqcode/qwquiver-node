<template>
  <div class="sidebar">
    <div class="widget link-list">
      <h2 class="list-label">基本</h2>
      <ul>
        <li :class="{ active: $route.name === 'index' }">
          <span @click="$router.replace('/').catch(err => {})">
            <i class="zmdi zmdi-view-carousel"></i> 总览
          </span>
        </li>
        <li :class="{ active: $route.name === 'charts' }">
          <span @click="$router.replace('/charts').catch(err => {})">
            <i class="zmdi zmdi-equalizer"></i> 趋势
          </span>
        </li>
        <li :class="{ active: $route.name === 'about' }">
          <span @click="$router.replace('/about').catch(err => {})">
            <i class="zmdi zmdi-info-outline"></i> 关于
          </span>
        </li>
      </ul>
      <h2 class="list-label">数据列表</h2>
      <ul v-if="!!data.examList">
        <li v-for="(exam, name) in data.examList" :key="name" :class="{ active: false }">
          <span @click="switchExam(name)">
            <i class="zmdi zmdi-trending-up"></i> {{ exam.label || name }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class Sidebar extends Vue {
  created () {
    Vue.prototype.$sidebar = this
  }

  mounted () {
    this.fetchConf()
  }

  data: any = {}

  async fetchConf () {
    const respData = await this.$axios.$get('./api/conf', {
      params: {}
    })
    if (respData.success) {
      this.data = respData.data
    }
  }

  switchExam (name: string) {
    if (this.$scoreTable) {
      this.$scoreTable.switchExam(name)
    }
  }
}
</script>

<style scoped lang="scss">
.sidebar {
  width: 270px;
  position: fixed;
  z-index: 3;
  left: 0;
  padding-top: 55px;
  height: 100%;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  overflow-y: auto;
  transform: translate(0px, 0px);
  transition: transform 450ms cubic-bezier(0.23, 1, 0.32, 1) 0ms;

  &.sidebar.sidebar-hide {
    transform: translate(-270px, 0px) !important;
  }
}

.widget {
  position: relative;
  display: block;
  overflow: hidden;
  padding: 0 20px;

  &.link-list {
    padding: 0;

    .list-label {
      position: relative;
      color: #919da8;
      font-size: 13px;
      font-weight: normal;
      padding: 10px 25px;
      margin: 15px 0 10px 0;
    }

    ul {
      padding: 0;
      margin: 10px 0;
      list-style: none;
    }

    ul > li {
      &:hover > span,
      &.active > span {
        color: #1a73e8;
      }

      & > span {
        text-decoration: none;
        color: #82888d;
        padding: 10px 25px;
        display: block;
        cursor: pointer;

        & > i {
          margin-right: 5px;
          width: 20px;
          text-align: center;
        }
      }
    }
  }
}

</style>
