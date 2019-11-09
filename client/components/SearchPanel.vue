<template>
  <div class="search-panel">
    <div class="inner">
      <div class="type-switch">
        <span
          v-for="(iLabel, iType) in queryTypeList"
          :key="iType"
          :class="{ active: iType === queryType }"
          @click="queryType = iType"
        >{{ iLabel }}</span>
      </div>
      <form :class="`query-type-${queryType}`" class="search-form">
        <div v-if="queryType === 'Name'">
          <button type="submit">
            <i class="zmdi zmdi-search"></i>
          </button>
          <input
            type="text"
            name="queryData"
            placeholder="搜索..."
            required="required"
            autocomplete="off"
          />
        </div>

        <div v-if="queryType === 'SchoolClass'">
          <LoadingLayer ref="scLoading" />
          <div v-if="!!sc && !!sc.data" class="school-class-list">
            <div class="list school-list">
              <span
                v-for="school in Object.keys(sc.data.school)"
                :key="school"
                :class="{ active: school === sc.openedSchool }"
                class="item"
                @click="sc.openedSchool = school"
              >{{ school }}</span>
            </div>
            <div class="list class-list">
              <template v-if="sc.openedSchool !== null && !!sc.data.school[sc.openedSchool]">
                <span
                  v-for="className in sc.data.school[sc.openedSchool]"
                  :key="className"
                  class="item"
                >{{ className }}</span>
              </template>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Watch } from 'nuxt-property-decorator'
import LoadingLayer from './LoadingLayer.vue'
import { AllSchoolApiData } from '~~/common/interfaces/api/AllSchoolApi'

type QueryType = 'Name' | 'SchoolClass'

@Component({
  components: { LoadingLayer }
})
export default class SearchPanel extends Vue {
  queryType: QueryType = 'Name'
  queryTypeList: { [key in QueryType]: string } = {
    Name: '姓名',
    SchoolClass: '学校班级'
  }

  scLoading!: LoadingLayer
  sc: {
    data: AllSchoolApiData | null
    openedSchool: string | null
  } | null = null

  @Watch('queryType')
  onQueryTypeChanged(queryType: QueryType) {
    if (queryType === 'Name') {
    }

    if (queryType === 'SchoolClass') {
      this.sc = null
      this.$nextTick(async () => {
        this.scLoading = this.$refs.scLoading as LoadingLayer
        this.scLoading.show()
        const respData = await this.$axios.$get('./api/allSchoolClass', {
          params: { db: 'test' }
        })
        if (!respData.success) return
        const data = (respData.data || null) as AllSchoolApiData
        this.sc = { data, openedSchool: Object.keys(data.school)[0] || null }
        this.scLoading.hide()
      })
    }
  }
}
</script>

<style scoped lang="scss">
%card {
  display: flex;
  background: #fff;
  box-shadow: 0 1px 10px rgba(0, 0, 0, 0.2);
  border-radius: 3px;
  overflow: hidden;
  position: relative;
}

/* wly-search-panel */
.search-panel {
  position: fixed;
  justify-content: center;
  display: flex;
  top: 0;
  left: 0;
  width: 100%;
  margin-top: calc(30vh - 20px);
  z-index: 999;
  pointer-events: none;
}

.inner {
  width: 580px;
  position: relative;
}

.type-switch {
  pointer-events: none;
  padding-left: 12px;
  display: flex;
  flex-direction: row;

  & > span {
    @extend %card;
    background: rgba(255, 255, 255, 0.8);
    pointer-events: all;
    border-radius: 2px 3px 0 0;
    padding: 5px 20px;
    margin-left: -3px;
    cursor: pointer;

    &.active {
      background: #fff;
      color: #1a73e8;
      z-index: 2;
    }

    &:hover {
      z-index: 2;
      background: #fff;
    }
  }
}

.search-form {
  @extend %card;
  pointer-events: all;
  z-index: 4;
  height: fit-content;
  width: 100%;
  transition: height 0.2s ease-in-out;

  &.query-type-Name {
    height: 60px;

    & > div {
      display: flex;
      flex: 1;
      flex-direction: row;
      place-items: center;

      input {
        flex: 1;
        height: 100%;
        padding-left: 55px;
        padding-right: 30px;
        outline: none;
        border: none;

        &:focus {
        }
      }

      button {
        cursor: pointer;
        background: transparent;
        border: 0;
        box-shadow: none;
        outline: none;
        left: 10px;
        position: absolute;
        width: 40px;
        height: 40px;
        font-size: 20px;
      }
    }
  }

  &.query-type-SchoolClass {
    height: 300px;

    .school-class-list {
      display: flex;

      .list {
        font-size: 13px;
        height: 300px;
        overflow-y: auto;
        overflow-x: hidden;

        &.school-list {
          flex: 20%;
          box-shadow: 0 -8px 6px rgba(0, 0, 0, 0.2);

          .item {
            position: relative;
            display: block;
            padding: 10px 21px;
            border-left: 1px solid transparent;
            cursor: pointer;

            &.active {
              color: #1a73e8;

              &:before {
                background: #1a73e8;
                content: ' ';
                position: absolute;
                left: -2px;
                top: 10px;
                height: calc(100% - 20px);
                width: 3px;
                box-shadow: 0 2px 15px rgba(0, 131, 255, 0.22);
                border-left: 1px solid #1a73e8;
              }
            }
          }
        }

        &.class-list {
          flex: 80%;
          padding: 8px 13px 8px 23px;

          .item {
            background: #f4f4f4;
            border-radius: 40px;
            display: inline-block;
            padding: 5px 13px;
            margin: 14px 10px 0 0;
            cursor: pointer;

            &:hover {
              color: #1a73e8;
              background: rgba(66,133,244,.12);
            }
          }
        }
      }
    }
  }
}
</style>
