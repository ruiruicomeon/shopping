<template>
  <div>
    <y-shelf v-bind:title="orderTitle">
      <div slot="content">
        <div
          v-loading="loading"
          element-loading-text="加载中..."
          style="min-height: 10vw;"
          v-if="orderList.length"
        >
          <div
            class="orderStatus"
            v-if="orderStatus == 1  || orderStatus==2 || orderStatus ==3 || orderStatus ==4 || orderStatus === 5"
          >
            <el-steps :space="200" :active="orderStatus">
              <el-step title="已下单" v-bind:description="orderDataInfo.orderTime"></el-step>
              <el-step
                title="已接单"
                v-bind:description="orderStatus ==2 ?orderDataInfo.updateDate:''"
              ></el-step>
              <el-step title="待发货" description></el-step>
              <el-step title="已发货" :description="orderDataInfo.sendTime"></el-step>
              <el-step title="已完成" v-bind:description="orderDataInfo.closeTime"></el-step>
            </el-steps>
          </div>

          <div class="lookOrserStatus" v-if="orderStatus == 4 && resultList.length <= 0">
            <el-button
              @click="lookOrserStatus(orderDataInfo.orderCourierNumber)"
              style="margin-left:20px"
              type="primary"
              size="small"
              class="del-order"
            >查看物流进度</el-button>
          </div>

          <div class="orderStatus-close" v-if="orderStatus === -1 || orderStatus === '-1'">
            <el-steps :space="780" :active="2">
              <el-step title="下单" v-bind:description="orderDataInfo.createDate"></el-step>
              <el-step title="订单关闭" v-bind:description="orderDataInfo.updateDate"></el-step>
            </el-steps>
          </div>

          <!--  -->
          <div class="status-now" v-if="orderStatus == 7">
            <ul>
              <li class="status-title">
                <h3>订单状态：退款中</h3>
              </li>
              <li class="button">
                <el-button
                  @click="lookOrserStatus(orderDataInfo.orderRedPacket)"
                  type="primary"
                  size="small"
                  v-if="orderDataInfo.orderRedPacket"
                >查看物流</el-button>
                <!-- <el-button @click="_cancelOrder()" size="small">取消订单</el-button> -->
              </li>
            </ul>
            <p class="realtime">
              <span>您的订单正在退款中,请耐心等待！</span>
              <span class="red">
                <!-- <countDown v-bind:endTime="6000" endText="已结束"></countDown> -->
              </span>
            </p>
          </div>
          <!-- 已退款 -->
          <div class="status-now" v-if="orderStatus == 6">
            <ul>
              <li class="status-title">
                <h3>订单状态：已退款</h3>
              </li>
            </ul>
            <p class="realtime">
              <span>订单退款已完成</span>
            </p>
          </div>

          <!-- 已拒单 -->
          <div class="status-now" v-if="orderStatus == 9">
            <ul>
              <li class="status-title">
                <h3>订单状态：已拒单</h3>
              </li>
            </ul>
            <div class="realtime">
              <span>商家已拒绝订单!</span>
              <p>拒单理由:{{ orderDataInfo.reasonRefund ? orderDataInfo.reasonRefund : '无拒绝理由' }}</p>
            </div>
          </div>
          <!-- 申请退款 -->
          <div class="status-now" v-if="orderStatus == 10 ">
            <ul>
              <li class="status-title">
                <h3>订单状态：申请退款</h3>
              </li>
            </ul>
            <p class="realtime">
              <span>订单正在退款申请中,请耐心等待！</span>
            </p>
          </div>
          <!-- 商家驳回 -->
          <div class="status-now" v-if="orderStatus == 11">
            <ul>
              <li class="status-title">
                <h3>订单状态：商家驳回退款</h3>
              </li>
              <li class="button">
                <el-button
                  @click="lookOrserStatus(orderDataInfo.orderCourierNumber)"
                  type="primary"
                  size="small"
                  v-if="orderDataInfo.orderCourierNumber"
                >查看物流</el-button>
              </li>
            </ul>
            <div class="realtime">
              <span>您申请的退款已被商家驳回</span>
              <p>驳回理由：{{ orderDataInfo.remarks ? orderDataInfo.remarks : '无驳回理由' }}</p>
            </div>
          </div>
          <!-- 物流进度条 -->
          <div class="lookOrserStatus-steps" v-if="!isColse">
            <el-steps
              :space="100"
              :active="resultList.length+1"
              class="el-step-warp"
              direction="vertical"
            >
              <el-step
                class="el-step-look"
                v-for="(item,index) in resultList"
                :title="item.status"
                v-bind:description="item.time"
                :key="index"
              ></el-step>
            </el-steps>
          </div>

          <div style="padding:20px;box-sizing: border-box">
            <el-button
              v-if="resultList.length > 0 && !isColse"
              @click="isColse = true"
              style="margin-left:20px"
              type="primary"
              size="small"
              class="del-order"
            >收起物流信息</el-button>
            <el-button
              v-else-if="resultList.length > 0 "
              @click="isColse = false"
              style="margin-left:20px"
              type="primary"
              size="small"
              class="del-order"
            >展开物流信息</el-button>
          </div>

          <div class="gray-sub-title">
            <div class="first">
              <div>商品信息</div>
              <div class="f-bc">
                <span>产品规格</span>
                <span class="price">单价</span>
                <span class="num">数量</span>
                <span class="operation">小计</span>
              </div>
            </div>
          </div>

          <!--商品-->
          <div class="goods-table">
            <div class="cart-items" v-for="(item) in goodsList" :key="item.id">
              <div class="ellipsis">
                <a @click="goodsDetails( item &&  item.goods.id)" class="img-box">
                  <img :src="getFullUrl( item && item.goods.mainPicture)" alt />
                </a>
                <div
                  class="goodsnames"
                  @click="goodsDetails(item.goods.id)"
                >
                   <p>{{item.goods.goodsName}}</p>
                   <p>{{ item.goodAttr.remarks }}</p>
                </div>
              </div>

              <div class="n-b">
                <div class="specification">
                  <p>{{ item.goodAttr.goodAttrName}}</p>
                </div>
                <div class="price">¥ {{ getPrice(item.goodUnitPrice)}}</div>
                <div class="goods-num">{{item.goodCount}}</div>
                <div class="subtotal">¥ {{getPrice(item.goodUnitPrice * item.goodCount)}}</div>
              </div>
            </div>
          </div>
          <!--合计-->
          <div class="order-discount-line">
            <p style="font-size: 14px;font-weight: bolder;">
              <span style="padding-right:47px">商品总计：</span>
              <span
                style="font-size: 16px;font-weight: 500;line-height: 32px;"
              >¥ {{ orderDataInfo.goodsTotalPrice ? getPrice(orderDataInfo.goodsTotalPrice) : '' }}</span>
            </p>
            <p>
              <span style="padding-right:30px">运费：</span>
              <span
                style="font-weight: 700;"
              >+ ¥ {{ orderDataInfo.orderExpfee ? getPrice(orderDataInfo.orderExpfee) : '0.00 '}}</span>
            </p>
            <p class="price-total">
              <span>应付金额：</span>
              <span
                class="price-red"
              >¥ {{orderDataInfo.goodsTotalPrice ? getPrice(orderDataInfo.goodsTotalPrice) : ''}}</span>
            </p>
          </div>

          <div class="gray-sub-title cart-title">
            <div class="first">
              <div>
                <span class="order-id">物流信息</span>
              </div>
            </div>
          </div>
          <div style="height: 100px;padding: 20px 30px;">
            <p
              class="address"
            >物流公司：{{ orderDataInfo.orderCourierName ? orderDataInfo.orderCourierName : '暂无物流信息' }}</p>
            <p
              class="address"
            >物流单号：{{ orderDataInfo.orderCourierNumber ? orderDataInfo.orderCourierNumber : '暂无物流单号' }}</p>
          </div>

          <div class="gray-sub-title cart-title">
            <div class="first">
              <div>
                <span class="order-id">收货信息</span>
              </div>
            </div>
          </div>
          <div style="height: 155px;padding: 20px 30px;">
            <p
              class="address"
            >姓名：{{ orderDataInfo.receiveUserName ? orderDataInfo.receiveUserName : '暂无联系人姓名' }}</p>
            <p
              class="address"
            >联系电话：{{ orderDataInfo.receiveUserMobile ? orderDataInfo.receiveUserMobile : '暂无联系电话' }}</p>
            <p
              class="address"
            >详细地址：{{ orderDataInfo.receiveAddress ? orderDataInfo.receiveAddress : '暂无地址信息' }}</p>
          </div>
        </div>
        <div v-loading="loading" element-loading-text="加载中..." v-else>
          <div style="padding: 100px 0;text-align: center">获取该订单信息失败</div>
        </div>
      </div>
    </y-shelf>
  </div>
</template>
<script>
// import { cancelOrder } from "/api/goods";
import YShelf from "/components/shelf";
import countDown from "/components/countDown";
import { getOrderDet, getKdi } from "/api/order";
import { getStore, isNotBlank, getFullUrl, getPrice } from "/utils/storage";
export default {
  data() {
    return {
      orderList: [0],
      orderStatus: 0,
      orderId: "",
      tel: "",
      streetName: "",
      orderTitle: "",
      createTime: "",
      payTime: "",
      closeTime: "",
      finishTime: "",
      orderTotal: "",
      loading: false,
      countTime: 0,
      goodsList: [],
      orderDataInfo: {},
      resultList: [],
      isColse: false
    };
  },
  methods: {
    message(m) {
      this.$message.error({
        message: m
      });
    },
    orderPayment(orderId) {
      window.open(
        window.location.origin + "#/order/payment?orderId=" + orderId
      );
    },
    goodsDetails(goodsId) {
      this.$router.push({
        name: "goodsDetails",
        query: {
          productId: goodsId
        }
      });
    },
    _getOrderDet() {
      let params = {
        id: this.orderId
      };
      this.loading = true;
      getOrderDet(params).then(res => {
        if (res.success === 1 || res.success === "1") {
          const data = res.data;
          this.orderDataInfo = data;
          this.goodsList = data.goodsList;
          if (data && data.orderStatus) {
            if (data.orderStatus == 0) {
              // 已下单
              this.orderStatus = 1;
            } else if (data.orderStatus == 1) {
              // 已接单
              this.orderStatus = 2;
            } else if (data.orderStatus == 6) {
              // 待发货
              this.orderStatus = 3;
            } else if (data.orderStatus == 2) {
              // 已发货
              this.orderStatus = 4;
            } else if (data.orderStatus == 3) {
              //已完成
              this.orderStatus = 5;
            } else if (data.orderStatus == 4) {
              // 已退款
              this.orderStatus = 6;
            } else if (data.orderStatus == 5) {
              // 退款中
              this.orderStatus = 7;
            } else if (data.orderStatus == 7) {
              // 拼团成功
              this.orderStatus = 8;
            } else {
              this.orderStatus = data.orderStatus;
            }
          }
        }
        this.loading = false;
      });
    },
    _cancelOrder() {
      cancelOrder({ orderId: this.orderId }).then(res => {
        if (res.success === true) {
          this._getOrderDet();
        } else {
          this.message("取消失败");
        }
      });
    },
    getFullUrl(url) {
      return getFullUrl(url);
    },
    getPrice(value) {
      return getPrice(value);
    },

    lookOrserStatus(id) {
      this.loading = true;
      let params = {
        // no: "4306057464278"
        no: id
      };
      getKdi(params).then(response => {
        if (response.success == 1 && response.data) {
          const resultList =
            response.data.result.list && response.data.result.list.length > 0
              ? response.data.result.list
              : [];
          this.resultList = resultList.reverse();
        }
        this.$message({
          type: "success",
          message: response.data.msg
        });
        this.loading = false;
      });
    }
  },
  created() {
    this.orderId = this.$route.query.id;
    this.orderTitle = "订单号：" + this.orderId;
    this._getOrderDet();
  },
  components: {
    YShelf,
    countDown
  }
};
</script>
<style lang="scss" scoped>
@import "../../../assets/style/mixin";

.orderStatus {
  margin: 50px -150px 20px 60px;
}

.orderStatus-close {
  display: flex;
  align-items: center;
  flex-direction: row;
  margin: 50px -800px 20px 60px;
}

.lookOrserStatus {
  margin: 0px 0px 20px 100px;
}

.lookOrserStatus-steps {
  width: 100%;
  padding: 0 20px;
  margin-left: 30px;
}

.status-now {
  background: #f6f6f6;
  border: 1px solid #dadada;
  border-radius: 5px;
  padding: 22px 30px 20px;
  margin: 0 30px 30px 30px;
  line-height: 38px;
}

.status-title {
  font-size: 18px;
  color: #666;
}

.button {
  float: right;
  margin: -37px 0 20px 0;
}

.realtime {
  border-top: 1px solid #dcdcdc;
  margin-top: 20px;
  padding-top: 26px;
}

.red {
  color: #d44d44;
}

.address {
  line-height: 38px;
  word-wrap: break-word;
  word-spacing: normal;
  word-break: break-all;
  color: #626262;
}

.img-box {
  border: 1px solid #ebebeb;
  border-radius: 5px;
  display: block;
}

img {
  display: block;
  @include wh(80px);
}

.goods-table {
  .n-b {
    display: flex;
    align-items: center;
    justify-content: center;
    padding-right: 24px;
    > div {
      color: #626262;
      font-weight: 700;
      width: 130px;
      text-align: center;
    }
  }
  .cart-items {
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 110px;
    padding: 15px 0 15px 20px;
    border-bottom: 1px solid #efefef;
    a {
      color: #333;
    }
    .ellipsis {
      display: flex;
      align-items: center;
      .goodsnames{
        cursor: pointer;
        color: #333;
        padding: 0 5px;
      }
    }
  }
  .price {
    padding-left: 107px;
  }
  .goods-num {
    padding-left: 60px;
  }
}

.order-discount-line {
  padding: 22px 30px 20px;
  line-height: 24px;
  text-align: right;
  font-size: 12px;
  &:first-child {
    line-height: 32px;
    text-align: right;
    font-size: 14px;
    font-weight: bolder;
  }
}

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
        width: 130px;
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
  margin-left: 10px;
}

.cart {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 24px;
  &:hover {
    .del-order {
      display: block;
    }
  }
  .del-order {
    display: none;
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
      display: flex;
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
      > div {
        text-align: center;
        width: 112px;
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
}

.price-total {
  height: 54px;
  line-height: 54px;
  font-size: 18px;
}

.price-red {
  font-weight: 700;
  color: #d44d44;
}
</style>
