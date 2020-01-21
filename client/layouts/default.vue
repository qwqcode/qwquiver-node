<template>
  <div>
    <CardCSSCode />
    <!-- eslint-disable-next-line vue/attributes-order -->
    <component v-for="layer in AllLayersNameList" :is="layer" :key="layer" />
    <TopHeader />

    <div class="wrap">
      <Sidebar />

      <div class="main-content-area">
        <nuxt class="content-inner" />
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import TopHeader from '@/components/TopHeader.vue'
import Sidebar from '@/components/Sidebar.vue'
import CardCSSCode from '@/components/Card.vue'
import Layers from '@/components/layers'
import $ from 'jquery'

@Component({
  components: { TopHeader, Sidebar, ...Layers, CardCSSCode }
})
export default class Default extends Vue {
  created () {
    Vue.prototype.$app = this
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
    padding-left: 300px;
    padding-right: 25px;
    padding-top: 80px;
    padding-bottom: 10px;
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
