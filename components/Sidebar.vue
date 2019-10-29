<template>
  <div class="sidebar">
    <div class="widget link-list">
      <h2 class="list-label">基本</h2>
      <ul>
        <li class="active">
          <a href="/">
            <i class="zmdi zmdi-view-carousel"></i> 总览
          </a>
        </li>
        <li>
          <a href="/site/charts">
            <i class="zmdi zmdi-equalizer"></i> 趋势
          </a>
        </li>
        <li>
          <a href="/site/about">
            <i class="zmdi zmdi-info-outline"></i> 关于
          </a>
        </li>
      </ul>
      <h2 class="list-label">数据列表</h2>
      <ul>
        <li class="active">
          <a href="/?id=g_16_201910">
            <i class="zmdi zmdi-trending-up"></i> 一中 - 高一下 期末
            [理科]
          </a>
        </li>
        <li>
          <a href="/?id=g_15_201905">
            <i class="zmdi zmdi-trending-up"></i> 一中 - 高一下 半期
            [理科]
          </a>
        </li>
        <li>
          <a href="/?id=g_14_201904">
            <i class="zmdi zmdi-trending-up"></i> 一中 - 高一下 月考一
            [理科]
          </a>
        </li>
        <li>
          <a href="/?id=g_13_201901">
            <i class="zmdi zmdi-trending-up"></i> 一中 - 高一上 期末联考
          </a>
        </li>
        <li>
          <a href="/?id=g_12_201811">
            <i class="zmdi zmdi-trending-up"></i> 一中 - 高一上 半期
          </a>
        </li>
        <li>
          <a href="/?id=g_11_201810">
            <i class="zmdi zmdi-trending-up"></i> 一中 - 高一上 月考一
          </a>
        </li>
        <li>
          <a href="/?id=93_3_201805">
            <i class="zmdi zmdi-trending-up"></i> 中考三模
          </a>
        </li>
        <li>
          <a href="/?id=93_2_201804">
            <i class="zmdi zmdi-trending-up"></i> 中考二模
          </a>
        </li>
        <li>
          <a href="/?id=93_1_201803">
            <i class="zmdi zmdi-trending-up"></i> 中考一模
          </a>
        </li>
        <li>
          <a href="/?id=92_201801">
            <i class="zmdi zmdi-trending-up"></i> 九上期末
          </a>
        </li>
        <li>
          <a href="/?id=91_201711">
            <i class="zmdi zmdi-trending-up"></i> 九上半期
          </a>
        </li>
        <li>
          <a href="/?id=84_201706">
            <i class="zmdi zmdi-trending-up"></i> 八下期末
          </a>
        </li>
        <li>
          <a href="/?id=82_201701">
            <i class="zmdi zmdi-trending-up"></i> 八上期末
          </a>
        </li>
        <li>
          <a href="/?id=81_201610">
            <i class="zmdi zmdi-trending-up"></i> 八上半期
          </a>
        </li>
        <li>
          <a href="/?id=74_201607">
            <i class="zmdi zmdi-trending-up"></i> 七下期末
          </a>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class Sidebar extends Vue {}
</script>

<style scoped lang="scss">
</style>
