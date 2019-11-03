<template>
  <div>
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
import TopHeader from '../components/TopHeader.vue'
import Sidebar from '../components/Sidebar.vue'

@Component({
  components: { TopHeader, Sidebar }
})
export default class Default extends Vue {

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
  color: #03A9F4;
}

.wly-table-header thead th span.select:after {
  font-family: Material-Design-Iconic-Font;
  position: absolute;
  width: 20px;
}
</style>
