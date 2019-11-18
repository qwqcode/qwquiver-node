<template>
  <Dialog ref="dialog">
    <div class="table-dialog">
      <div class="dialog-title">
        <span class="title-text">{{ title }}</span>
        <span class="close-btn zmdi zmdi-close" @click="hide()"></span>
      </div>
      <div class="dialog-body">
        <slot />
      </div>
    </div>
  </Dialog>
</template>

<script lang="ts">
import Vue from 'vue'
import { Prop, Component } from 'vue-property-decorator'
import Dialog from './Dialog.vue'
import $ from 'jquery'

@Component({
  components: { Dialog }
})
export default class ScoreTableDialog extends Vue {
  isShow: boolean = false

  @Prop({
    default: ''
  })
  readonly title!: string

  mounted () {
  }

  get dialog () {
    return this.$refs.dialog as Dialog
  }

  show () {
    this.dialog.show()
  }

  hide () {
    this.dialog.hide()
  }
}
</script>

<style lang="scss" scoped>
/* wly-table-action-dialog */
/deep/ .table-dialog {
  background-color: #fff;
  margin: 0 auto;
  padding: 20px;
  border-radius: 4px;
  width: 400px;

  .dialog-title {
    border-bottom: 1px solid #f4f4f4;
    padding-bottom: 15px;
  }

  .title-text {
    font-size: 17px;
  }

  .close-btn {
    float: right;
    cursor: pointer;
    padding: 5px;

    &:hover {
      color: #1a73e8;
    }
  }

  .dialog-body {
    color: #5e5e5e;
  }

  .dialog-label {
    color: #7d7d7d;
    margin-bottom: 10px;
    display: block;
    font-weight: normal;
    word-break: break-all;
    white-space: normal;
    text-align: left;
    border-left: 1px solid #2196f3;
    padding-left: 15px;
    border-radius: 0;
    margin-top: 30px;
    margin-bottom: 10px;

    &:first-child {
      margin-top: 20px;
    }
  }

  .dialog-btn {
    display: block;
    padding: 10px 15px;
    text-align: center;
    box-shadow: 0 1px 4px #d8d8d8;
    border-radius: 3px;
    cursor: pointer;
    transition: 0.3s all;
    margin-bottom: 15px;

    &:hover {
      color: #2196f3;
    }
  }

  .table-ctrl-dialog {
    .field-list {
      .field-item {
        position: relative;
        display: inline-block;
        padding: 6px 20px;
        cursor: pointer;
        margin: 0 0 13px 10px;
        border-radius: 3px;
        box-shadow: 0 1px 4px rgba(177, 177, 177, 0.36);

        &:after {
          font-family: Material-Design-Iconic-Font;
          position: absolute;
          top: -10px;
          right: 0;
          font-size: 18px;
          color: #f78787;
          text-shadow: 0 1px 3px rgba(0, 0, 0, 0.19);
        }

        &:not(.active):after {
          content: '\f15b';
        }
      }
    }

    .page-per-show-input {
      border-radius: 3px;
      border: 1px solid #eee;
      background: #fbfbfb;
      padding: 5px 15px;
      width: 100%;
      margin-top: 10px;
      text-align: center;
      outline: none;
      transition: 0.3s all;

      &:focus {
        border: 1px solid #2196f3;
      }
    }

    .table-font-size-control {
      text-align: center;
      font-size: 18px;
      margin-top: 15px;
    }

    .table-font-size-control .font-size-minus {
      border-radius: 5px 0 0 5px;
    }

    .table-font-size-control .font-size-value {
      font-weight: bold;
    }

    .table-font-size-control .font-size-plus {
      border-radius: 0 5px 5px 0;
    }

    .table-font-size-control > span {
      box-shadow: 0 1px 4px rgba(177, 177, 177, 0.36);
      padding: 4px 17px;
      display: inline-block;
      transition: 0.3s all;
    }

    .table-font-size-control .font-size-minus,
    .table-font-size-control .font-size-plus {
      cursor: pointer;
      user-select: none;
    }

    .table-font-size-control .font-size-minus:hover,
    .table-font-size-control .font-size-plus:hover {
      box-shadow: 0 1px 4px rgba(177, 177, 177, 0.58);
      color: #2196f3;
    }
  }

  .table-data-counter {
    .data-item {
      display: flex;
      padding: 10px 20px;

      &:not(:last-child) {
        border-bottom: 1px solid #f4f4f4;
      }
    }

    .data-name {
      flex-basis: 50px;
    }

    .data-value {
      flex: 1;
      padding-left: 20px;
      border-left: 1px solid #f4f4f4;
    }
  }
}
</style>
