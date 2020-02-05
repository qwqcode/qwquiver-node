<template>
  <div class="sidebar" :class="{ 'hide': !isShow }">
    <div class="widget link-list">
      <h2 class="list-label">基本</h2>
      <ul>
        <li :class="{ active: $route.name === 'index' }">
          <span @click="$router.replace('/').catch(err => {})">
            <i class="zmdi zmdi-view-carousel"></i> 总览
          </span>
        </li>
        <li :class="{ active: $route.name === 'chart' }">
          <span @click="$router.replace('/chart').catch(err => {})">
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
      <ul v-if="!!$app.ExamMapSorted">
        <li v-for="(exam) in $app.ExamMapSorted" :key="exam.Name" :class="{ active: !!$scoreTable.params && $scoreTable.params.exam === exam.Name }">
          <span @click="switchExam(exam.Name)">
            <i class="zmdi zmdi-trending-up"></i> {{ exam.Label || exam.Name }}
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import _ from 'lodash'

@Component({})
export default class Sidebar extends Vue {
  isShow = true

  created () {
    Vue.prototype.$sidebar = this
  }

  mounted () {

  }

  switchExam (name: string) {
    this.$scoreTable.switchExam(name, true)
  }

  show () {
    this.isShow = true
    this.$app.setContFullScreen(false)
    this.$nextTick(() => {
      this.$scoreTable.adjustDisplay()
    })
  }

  hide () {
    this.$app.setContFullScreen(true)
    this.isShow = false
    this.$nextTick(() => {
      this.$scoreTable.adjustDisplay()
    })
  }

  toggle () {
    if (this.isShow) {
      this.hide()
    } else {
      this.show()
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

  &.sidebar.hide {
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
        color: var(--mainColor);
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
