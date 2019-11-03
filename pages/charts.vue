<template>
  <div></div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({})
export default class ChartsPage extends Vue {}
</script>

<style scoped lang="scss">
.site-charts {
  .chart-action {
    display: block;
    margin-bottom: 5px;
    padding-top: 3px;

    .action-item {
      cursor: pointer;
      display: inline-block;
      padding: 2px 0;
      transition: all 0.2s ease-in-out;

      &:not(:last-child) {
        margin-right: 10px;
        padding-right: 10px;
        border-right: 1px solid #F4F4F4;
      }

      & > i {
        margin-left: 5px;
        font-size: 13px;

        &.zmdi-square-o {}

        &.zmdi-check-square {
          color: #03a9f4;
        }
      }
    }
  }
}
</style>
