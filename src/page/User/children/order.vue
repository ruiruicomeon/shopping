<template>
  <div>
    <y-shelf title="我的订单">
      <div slot="content">
        <div
          v-loading="loading"
          element-loading-text="加载中..."
          v-if="orderList.length"
          style="min-height: 10vw;"
        >
          <div v-for="(item,i) in orderList" :key="item.id">
            <div class="gray-sub-title cart-title">
              <div class="first">
                <div>
                  <span class="date" v-text="item.createDate"></span>
                  <span class="order-id">
                    订单号：
                    <a @click="orderDetail(item.id)">{{item.id}}</a>
                  </span>
                </div>
                <div class="f-bc">
                  <span>产品类型</span>
                  <span>订单状态</span>
                  <span>收货人</span>
                  <span>收货人联系电话</span>
                  <span>店铺名称</span>
                  <span>单价</span>
                  <span class="num">数量</span>
                  <span class="operation">实付金额</span>
                </div>
              </div>
              <div class="last">
                <span class="sub-total">商品操作</span>
                <span class="order-detail">
                  <a @click="orderDetail(item.id)">
                    查看详情 >
                    <em class="icon-font"></em>
                  </a>
                </span>
              </div>
            </div>
            <!-- 页头 -->

            <div class="pr">
              <div class="cart" v-for="(good,j) in item.goodsList" :key="j">
                <div class="cart-l" :class="{bt:j>0}">
                  <div class="car-l-l">
                    <div class="img-box">
                      <a @click="goodsDetails(good.goods.id)">
                        <img :src="getFullUrl(good.goods.mainPicture)" alt />
                      </a>
                    </div>
                    <div class="ellipsis">
                      <a
                        style="color: #626262;"
                        @click="goodsDetails(good.goods.id)"
                      >{{good.goods.goodsName}}</a>
                      <p
                        class="goodsType"
                        v-html="good.goodType == 0 ? `物料编码：${good.discount}` :  `总成编码：${good.discount}`"
                      />
                    </div>
                  </div>
                  <div class="cart-l-r">
                    <div
                      :class="[good.goodType == 0 ? 'peijian' : 'zoncheng' ]"
                    >{{good.goodType == 0 ? '配件产品' : '总成产品'}}</div>
                    <div
                      :class="[item.orderStatus == 0 || item.orderStatus ==1 || item.orderStatus ==2 || item.orderStatus ==3 || item.orderStatus ==4 || item.orderStatus ==5 || item.orderStatus ==6 || item.orderStatus ==7 || item.orderStatus ==10 ? 'okstatus' : 'notokstatus' ]"
                    >{{ item.orderStatus ? getOrderStatus(item.orderStatus) : '' }}</div>
                    <div>{{ item.receiveUserName ? item.receiveUserName : '暂无联系人' }}</div>
                    <div>{{ item.receiveUserMobile ? item.receiveUserMobile : '暂无联系电话' }}</div>
                    <div>{{ item.store && item.store.name ? item.store.name : '暂无' }}</div>
                    <div>¥{{ good.goodUnitPrice ? getPrice(good.goodUnitPrice) : null }}</div>
                    <div>{{Number(good.goodCount)}}</div>
                    <div
                      class="total"
                    >¥ {{ item.orderShouldPay ? getPrice(item.orderShouldPay) : '暂无' }}</div>
                  </div>
                </div>
                <div class="cart-r">
                  <span></span>
                </div>
              </div>
              <div class="prod-operation pa" style="right: 0;top: 0;">
                <div class="type">
                  <el-button
                    @click="canCelOrder(item.id,i)"
                    style="margin-left:20px"
                    type="danger"
                    size="small"
                    v-if="item.orderStatus == 0 || item.orderStatus == 1 || item.orderStatus == 6 "
                    class="del-order"
                  >取消此订单</el-button>
                  <el-button
                    @click="applyRefund(item.id,i)"
                    style="margin-left:20px"
                    type="primary"
                    size="small"
                    v-if="item.orderStatus == 2"
                    class="del-order"
                  >申请退货</el-button>
                  <el-button
                    @click="applyRefundLogs(item.id,i)"
                    style="margin-left:20px"
                    type="primary"
                    size="small"
                    v-if=" item.orderStatus == 5 && !item.orderDiscount"
                    class="del-order"
                  >填写退货物流信息</el-button>
                </div>
                <div v-if="item.orderStatus === '2' || item.orderStatus === 2">
                  <el-button @click="confirmTakeGoods(item.id)" type="primary" size="small">确认收货</el-button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <!-- 没有商品显示 -->
        <div v-loading="loading" element-loading-text="加载中..." class="no-info" v-else>
          <div style="padding: 100px 0;text-align: center">你还未创建过订单</div>
        </div>
      </div>
    </y-shelf>
    <div style="float:right;margin:0 30px 30px 0">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="current"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next"
        :total="total"
        class="el-pagintion"
      ></el-pagination>
    </div>
    <el-dialog title="申请退货" :visible.sync="dialogFormVisible">
      <el-form :model="form" :rules="{ required: true, message: '请输入退货理由'} ">
        <el-form-item label="退货理由" label-width="100px">
          <el-input v-model="form.reasonRefund" placeholder="请输入退货理由"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">取 消</el-button>
        <el-button v-loading="buttonLoading" type="primary" @click="confirmReasonFund()">确 定</el-button>
      </div>
    </el-dialog>
    <!-- 填写物流信息 -->
    <el-dialog title="填写退货物流信息" :visible.sync="dialogFormVisibleLogs">
      <el-form :model="fromLog" :rules="{ required: true, message: '请输入物流单号'} ">
        <el-form-item label="物流公司" label-width="100px">
          <el-input v-model="fromLog.orderDiscount" placeholder="请输入物流公司(快递公司)"></el-input>
        </el-form-item>
        <el-form-item label="物流单号" label-width="100px">
          <el-input v-model="fromLog.orderRedPacket" placeholder="请输入物流单号(快递单号)"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisibleLogs = false">取 消</el-button>
        <el-button v-loading="buttonLoading" type="primary" @click="confirmReasonFundLogs()">确 定</el-button>
      </div>
    </el-dialog>
  </div>
</template>
<script>
import { orderList, delOrder } from "/api/goods";
import YShelf from "/components/shelf";
import { getStore, isNotBlank, getFullUrl, getPrice } from "/utils/storage";
import {
  getUserOrderList,
  userCancelOrder,
  userConfrmTakeGoods,
  applyRefund,
  fillLogistice
} from "/api/order";

export default {
  data() {
    return {
      orderList: [],
      current: 1,
      pageSize: 5,
      total: 0,
      userId: "",
      orderStatus: "",
      loading: false,
      dialogFormVisible: false,
      orderId: "",
      form: {
        reasonRefund: ""
      },
      buttonLoading: false,
      dialogFormVisibleLogs: false,
      fromLog: {
        orderDiscount: "",
        orderRedPacket: ""
      }
    };
  },
  methods: {
    message(m) {
      this.$message.error({
        message: m
      });
    },
    getPrice(val) {
      return getPrice(val);
    },
    handleSizeChange(size) {
      this.pageSize = size;
      let params = {
        pageSize: size,
        current: this.current
      };
      this.loading = true;
      this.getOrderList(params);
    },
    handleCurrentChange(val) {
      this.current = val;
      let params = {
        pageSize: this.pageSize,
        current: val
      };
      this.loading = true;
      this.getOrderList(params);
    },
    goodsDetails(goodsId) {
      this.$router.push({
        name: "goodsDetails",
        query: {
          productId: goodsId
        }
      });
    },
    orderDetail(orderId) {
      this.$router.push({
        path: "orderDetail",
        query: {
          id: orderId
        }
      });
    },
    getOrderStatus(orderStatus) {
      if (orderStatus === -1 || orderStatus === "-1") {
        return "已取消";
      } else if (orderStatus === 0 || orderStatus === "0") {
        return "已下单";
      } else if (orderStatus === "1" || orderStatus === -1) {
        return "已付款";
      } else if (orderStatus === "2" || orderStatus === 2) {
        return "已发货";
      } else if (orderStatus === "3" || orderStatus === 3) {
        return "已完成";
      } else if (orderStatus === "4" || orderStatus === 4) {
        return "已退款";
      } else if (orderStatus === "5" || orderStatus === 5) {
        return "退款中";
      } else if (orderStatus === "6" || orderStatus === 6) {
        return "待发货";
      } else if (orderStatus === "7" || orderStatus === 7) {
        return "拼团成功";
      } else if (orderStatus === "8" || orderStatus === 8) {
        return "库存不足";
      } else if (orderStatus === "9" || orderStatus === 9) {
        return "已拒单";
      } else if (orderStatus === "10" || orderStatus === 10) {
        return "申请退货";
      } else if (orderStatus === "11" || orderStatus === 11) {
        return "商家驳回";
      }
    },

    canCelOrder(orderId, i) {
      let params = {
        current: this.current,
        pageSize: this.pageSize
      };
      this.$confirm("是否取消该订单, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          userCancelOrder({ id: orderId }).then(response => {
            if (response.success == 1) {
              this.$message({ type: "success", message: "取消成功" });
              this.loading = true;
              this.getOrderList(params);
            }
          });
        })
        .catch(() => {});
    },

    confirmTakeGoods(id) {
      let params = {
        current: this.current,
        pageSize: this.pageSize
      };
      this.$confirm("是否确认收货?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          userConfrmTakeGoods({ id }).then(response => {
            if (response.success == 1) {
              this.$message({ type: "success", message: "操作成功" });
              this.loading = true;
              this.getOrderList(params);
            } else if (response.success == 0) {
              this.$message({
                type: "error",
                message: response.msg ? response.msg : "操作失败"
              });
            }
          });
        })
        .catch(() => {
          this.$message({ type: "info", message: "取消操作" });
        });
    },

    applyRefund(id) {
      this.dialogFormVisible = true;
      this.orderId = id;
    },

    applyRefundLogs(id) {
      this.dialogFormVisibleLogs = true;
      this.orderId = id;
    },

    confirmReasonFund() {
      if (!isNotBlank(this.form.reasonRefund)) {
        this.$message({ type: "warning", message: "请填写退货理由" });
        return;
      }
      let params = {
        id: this.orderId,
        reasonRefund: this.form.reasonRefund
      };
      this.buttonLoading = true;
      applyRefund(params).then(response => {
        this.buttonLoading = false;
        this.dialogFormVisible = false;
        this.form = {};
        this.orderId = "";
        if (response.success == 1) {
          this.$message({
            type: "success",
            message: response.msg ? response.msg : "操作成功"
          });
          const params = {
            current: this.current,
            pageSize: this.pageSize
          };
          this.loading = true;
          this.getOrderList(params);
        } else {
          this.$message({
            type: "error",
            message: response.msg ? response.msg : "操作失败"
          });
        }
      });
    },

    confirmReasonFundLogs() {
      if (
        !isNotBlank(this.fromLog.orderDiscount) ||
        !isNotBlank(this.fromLog.orderRedPacket)
      ) {
        this.$message({ type: "warning", message: "请填写物流公司及物流单号" });
        return;
      }
      let params = {
        id: this.orderId,
        orderDiscount: this.fromLog.orderDiscount,
        orderRedPacket: this.fromLog.orderRedPacket
      };
      this.buttonLoading = true;
      fillLogistice(params).then(response => {
        this.buttonLoading = false;
        this.dialogFormVisibleLogs = false;
        this.fromLog = {};
        this.orderId = "";
        if (response.success == 1) {
          const params = {
            current: this.current,
            pageSize: this.pageSize
          };
          this.loading = true;
          this.getOrderList(params);
          this.$message({
            type: "success",
            message: response.msg ? response.msg : "操作成功"
          });
        } else {
          this.$message({
            type: "error",
            message: response.msg ? response.msg : "操作失败"
          });
        }
      });
    },

    getOrderList(params) {
      return getUserOrderList(params).then(response => {
        this.loading = false;
        if (
          isNotBlank(response) &&
          isNotBlank(response.data) &&
          response.data.list
        ) {
          this.orderList = response.data.list;
          this.total = response.data.pagination.total;
        } else {
          this.$message({
            message: "暂无订单",
            type: "warning"
          });
        }
      });
    },
    getFullUrl(url) {
      return getFullUrl(url);
    }
  },
  created() {
    this.userId = getStore("userId");
  },

  mounted() {
    //  创建完成
    const params = {
      current: this.current,
      pageSize: this.pageSize
    };
    this.loading = true;
    this.getOrderList(params);
  },

  components: {
    YShelf
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/style/mixin";

.gray-sub-title {
  height: 38px;
  padding: 0 24px;
  background: #eee;
  border-top: 1px solid #dbdbdb;
  border-bottom: 1px solid #dbdbdb;
  line-height: 38px;
  font-size: 12px;
  color: #666;
  display: flex;
  span {
    display: inline-block;
    height: 100%;
  }
  .first {
    display: flex;
    justify-content: space-between;
    flex: 1;
    .f-bc {
      > span {
        width: 120px;
        text-align: center;
      }
      > span:last-child {
        width: 150px;
        text-align: center;
      }
    }
  }
  .last {
    width: 230px;
    text-align: center;
    display: flex;
    border-left: 1px solid #ccc;
    span {
      flex: 1;
    }
  }
}

.bt {
  border-top: 1px solid #efefef;
}

.date {
  padding-left: 0px;
}

.order-id {
  margin-left: 25px;
}

.cart {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  .del-order {
    display: block;
  }
  .cart-l {
    display: flex;
    align-items: center;
    flex: 1;
    padding: 15px 0;
    justify-content: space-between;
    position: relative;
    &:before {
      position: absolute;
      content: " ";
      right: -1px;
      top: 0;
      width: 1px;
      background-color: #efefef;
      height: 100%;
    }
    .ellipsis {
      margin-left: 20px;
      width: 220px;
      .goodsType {
        color: #666;
        padding: 5px 0;
      }
    }
    .img-box {
      border: 1px solid #ebebeb;
    }
    img {
      display: block;
      @include wh(80px);
    }
    .cart-l-r {
      display: flex;
      justify-content: space-between;
      .peijian {
        color: #409eff;
      }
      .zoncheng {
        color: #666;
      }
      > div {
        text-align: center;
        width: 120px;
        margin-right: 3px;
      }
      > div:last-child {
        width: 150px;
        text-align: center;
        margin-right: 3px;
      }
      .okstatus {
        border: 1px solid #cccccc;
        border-radius: 5px;
        background: #409eff;
        color: #fff;
      }
      .notokstatus {
        border: 1px solid #cccccc;
        border-radius: 5px;
        background: #f56c6c;
        color: #fff;
      }
    }
    .car-l-l {
      display: flex;
      align-items: center;
    }
  }
  .cart-r {
    width: 230px;
    display: flex;
    span {
      text-align: center;
      flex: 1;
    }
  }
}
.type {
  width: 150px;
  text-align: center;
  margin-right: 3px;
}

.prod-operation {
  height: 110px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 254px;
  div {
    width: 100%;
    text-align: center;
  }
  div:last-child {
    padding-right: 24px;
  }
  .status {
  }
  .el-pagintion {
    color: #fff;
  }
}
</style>
