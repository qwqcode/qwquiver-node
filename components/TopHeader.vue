<template>
  <div class="top-header">
    <div class="main-navbar">
      <div class="left">
        <div class="sidebar-toggle-btn">
          <i class="zmdi zmdi-menu"></i>
        </div>
        <span class="brand">
          <a href="/" class="app-name">市 2018/2021届 初高中 成绩统计</a>
        </span>
      </div>
      <div class="right">
        <ul class="actions-btn-bar main-bar">
          <li>
            <a onclick="wlySearch.showPanel()">
              <i class="zmdi zmdi-search"></i>
              <span>搜索</span>
            </a>
          </li>
        </ul>
        <ul class="actions-btn-bar scene-bar" style="display: none;"></ul>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class TopHeader extends Vue {}
</script>

<style scoped lang="scss">
</style>
