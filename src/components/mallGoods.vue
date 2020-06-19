
<template>
  <el-col :xs="24" :sm="8" :md="6" :lg="4" :xl="3" class="good-item">
    <div>
      <div class="good-img">
        <a @click="openProduct(msg.id)">
          <img v-lazy="showimg(msg.mainPicture)" :key="showimg(msg.mainPicture)" />
        </a>
      </div>
      <h6 class="good-title" v-html="msg.goodsName">{{msg.goodsName}}</h6>
      <h3 class="sub-title ellipsis">{{msg.store&&msg.store.name?msg.store.name:''}}</h3>
      <div class="brand-type-box">
        <div>{{ msg.productName }}</div>
        <div>{{msg.goodsTypeName}}</div>
        <div>{{ msg.brandName}}</div>
      </div>
      <div class="year">
        <span v-if="msg.discount">年款：</span>
        {{ msg.discount }}
      </div>
      <h6 class="good-transaction">
        <span style="font-size:14px">销量:</span>
        {{msg.transaction ? msg.transaction : 0}}
      </h6>
      <p class="good-price">
        <span style="font-size:14px">￥</span>
        {{Number(msg.unitPrice).toFixed(2)}}
      </p>
      <div class="good-price pr">
        <div class="ds">
          <a @click="openProduct(msg.id)">
            <y-button text="查看详情" style="margin: 0 5px"></y-button>
          </a>
          <y-button
            text="加入购物车"
            style="margin: 0 5px"
            @btnClick="addCart(msg.id,msg.unitPrice,msg.goodsName,showimg(msg.mainPicture),msg.goodAttr.id,msg.storeId ,msg.goodAttr.goodAttrName, msg.goodAttr.remarks , msg.brandType)"
            classStyle="main-btn"
          ></y-button>
        </div>
      </div>
    </div>
  </el-col>
</template>
<script>
import YButton from "/components/YButton";
import { addCart } from "/api/goods.js";
import { mapMutations, mapState } from "vuex";
import { getStore, getFullUrl } from "/utils/storage";
export default {
  props: {
    msg: {
      salePrice: 0
    }
  },
  data() {
    return {};
  },
  methods: {
    ...mapMutations(["ADD_CART", "ADD_ANIMATION", "SHOW_CART"]),
    showimg(url) {
      return getFullUrl(url);
    },
    goodsDetails(id) {
      this.$router.push({
        path: "goodsDetails",
        query: {
          productId: id
        }
      });
    },
    openProduct(id) {
      this.$router.push({
        path: "goodsDetails",
        query: {
          productId: id
        }
      });
    },
    addCart(id, price, name, img, goodlistid, storeId,goodlistname, remarks, brandType) {
      // if (!this.showMoveImg) {
      // 动画是否在运动
      // if (this.login) { // 登录了 直接存在用户名下
      //   addCart({userId: getStore('userId'), productId: id, productNum: 1}).then(res => {
      //     // 并不重新请求数据
      //     this.ADD_CART({productId: id, salePrice: price, productName: name, productImg: img})
      //   })
      // } else { // 未登录 vuex
      //   this.ADD_CART({productId: id, salePrice: price, productName: name, productImg: img})
      // }

      // addCart({
      //   userId: getStore("userId"),
      //   productId: id,
      //   productNum: 1
      // }).then(res => {
      // 并不重新请求数据
      this.ADD_CART({
        productId: id,
        salePrice: price,
        productName: name,
        goodlistid,
        productImg: img,
        storeId,
        goodlistname,
        remarks,
        brandType
      });
      // });

      // 加入购物车动画
      var dom = event.target;
      // 获取点击的坐标
      let elLeft = dom.getBoundingClientRect().left + dom.offsetWidth / 2;
      let elTop = dom.getBoundingClientRect().top + dom.offsetHeight / 2;
      // 需要触发
      this.ADD_ANIMATION({
        moveShow: true,
        elLeft: elLeft,
        elTop: elTop,
        img: img
      });
      if (!this.showCart) {
        this.SHOW_CART({ showCart: true });
      }
      // }
    }
  },
  computed: {
    ...mapState(["login", "showMoveImg", "showCart"])
  },
  mounted() {},
  components: {
    YButton
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
@import "../assets/style/mixin";
@import "../assets/style/theme";

.good-item {
  background: #fff;
  transition: all 0.5s;
  min-width: 200px;
  height: 430px;
  border-right: 1px solid #5249491f;
  border-bottom: 1px solid #5249491f;
  &:hover {
    transform: translateY(-3px);
    box-shadow: 1px 1px 20px #999;
  }
  .ds {
    @extend %block-center;
    width: 100%;
    display: block;
  }

  .good-img {
    img {
      margin: 10px auto 10px;
      @include wh(180px);
      display: block;
    }
  }
  .good-price {
    margin: 5px 0;
    height: 30px;
    text-align: center;
    line-height: 30px;
    color: #d44d44;
    font-family: Arial;
    font-size: 18px;
    font-weight: 700;
  }
  .brand-type-box {
    padding: 5px;
    display: flex;
    justify-content: space-around;
    flex-wrap: wrap;
  }
  .year {
    margin: 3px auto 0;
    text-align: center;
  }
  .good-title {
    line-height: 1.2;
    font-size: 16px;
    color: #424242;
    margin: 0 auto;
    padding: 0 14px;
    text-align: center;
    overflow: hidden;
  }
  .good-transaction {
    margin-top:6px;
    padding: 5px;
    font-size: 14px;
    color: #ca4343;
    font-weight: 700;
    margin: 6px auto 0;
    padding: 0 14px;
    text-align: center;
    overflow: hidden;
  }
  h3 {
    text-align: center;
    line-height: 1.2;
    font-size: 15px;
    color: #373843;
    padding: 10px 10px 0 10px;
  }
}

@media screen and (max-width: 780px) {
  .good-item {
    background: #fff;
    width: 50%;
    transition: all 0.5s;
    height: 430px;
    &:hover {
      transform: translateY(-3px);
      box-shadow: 1px 1px 20px #999;
    }
  }
}
</style>
