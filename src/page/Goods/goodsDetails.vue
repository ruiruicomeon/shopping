<!--商品详情-->
<template>
  <div class="w store-content">
    <div class="indextitle">
      <div class="indextitleFirst">
        <!-- <h3>{{ 'welcome' }}</h3> -->
        <img
          :src="showimg(storeInfo.photo ? storeInfo.photo : '' )"
          :alt="product.productName"
          v-if="storeInfo.photo"
        />
        <img src="../../../static/images/mallLogo.jpg" v-else />
        <h1>{{storeInfo.name ? storeInfo.name : '暂无名称...' }}</h1>
      </div>
      <!-- 显示下拉操作框 -->
      <div class="nav-user-wrapper">
        <div class="nav-user-list">
          <ul>
            <li>
              <span>店铺名称:</span>
              <span>{{ storeInfo.name ? storeInfo.name : '' }}</span>
            </li>
            <li>
              <span>地址:</span>
              <span>{{ storeInfo.address ? storeInfo.address : '暂无地址...' }}</span>
            </li>
            <li>
              <span>联系人:</span>
              <span>{{ storeInfo.contactName ? storeInfo.contactName : '暂无联系人...' }}</span>
            </li>
            <li>
              <span>联系电话:</span>
              <span>{{ storeInfo.contactNumber ? storeInfo.contactNumber : '暂无联系电话...' }}</span>
            </li>
            <li>
              <span>绑定集团:</span>
              <span>{{ storeInfo.location ? storeInfo.location : '暂无绑定集团...' }}</span>
            </li>
            <li style="text-align:center">
              <router-link
                :to="{ path:'shopdetail', query: { id: storeInfo.id } }"
                style="margin:0 auto"
              >进入店铺</router-link>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <!-- 商品部分 -->
    <div class="gray-box">
      <div class="gallery-wrapper">
        <div class="gallery">
          <div class="thumbnail">
            <ul>
              <li
                v-for="(item,i) in small.slice(0,5)"
                :key="i"
                :class="{on:big===item}"
                @click="big=item"
              >
                <img v-lazy="showimg(item)" :alt="product.productName" />
              </li>
            </ul>
          </div>

          <div class="thumbnail" v-if="small&&small.length>4">
            <ul>
              <li
                v-for="(item,i) in small.slice(5,10)"
                :key="i+5"
                :class="{on:big===item}"
                @click="big=item"
              >
                <!-- v-lazy="showimg(item)" -->
                <img v-lazy="showimg(item)" :alt="product.productName" />
              </li>
            </ul>
          </div>

          <div id="thumb">
            <div id="big" style="height:440px;width:440px">
              <img :src="showimg(big)" :alt="product.productName" />
              <!-- <div id="mark" v-show="isShade" ref="shade" style="height:100px;width:100px"></div> -->
            </div>
          </div>
        </div>
      </div>

      <!-- <div id="big-img-box" v-show="isBig">
        <img :src="showimg(big)"/>
      </div>-->
      <!--右边-->
      <div class="banner">
        <div class="sku-custom-title">
          <h4>{{product.goodsName}}</h4>
          <h6>
            <span>{{product.productName}},{{product.typeName}}</span>
            <span class="price">
              <em>¥</em>
              <i>{{getPrice(product.salePrice)}}</i>
            </span>
          </h6>
        </div>

        <el-collapse v-model="activeNames" @change="handleChange">
          <el-collapse-item title="详细信息" name="1" :style="{'padding-left':'10px'}">
            <div :style="{color:'rgb(125, 116, 116)'}">适用年款/车型： {{product.discount}}</div>
            <div :style="{color:'rgb(125, 116, 116)'}">质保日期: {{product.qualityDate}}</div>
            <div :style="{color:'rgb(125, 116, 116)'}">产品编码: {{product.goodsCode}}</div>
            <div :style="{color:'rgb(125, 116, 116)'}">单位: {{product.measuringUnit}}</div>
          </el-collapse-item>
        </el-collapse>
        <div class="num">
          <span class="params-name">数量</span>
          <buy-num @edit-num="editNum"></buy-num>
        </div>

        <div :style="{margin:'16px 10px 16px'}">
          <el-radio-group @change="changeRadio">
            <el-radio
              v-for="(item,i) in goodAttrList"
              :clknumber="item.goodAttrValue"
              v-model="radio1"
              :label="item.id"
              :key="i"
              size="medium"
              border
            >{{item.goodAttrName}}</el-radio>
          </el-radio-group>
        </div>
        <div class="goodprompt" v-if="product.isClose==0">
          该商品已不存在了,
          <router-link to="/goods">
            <a>前往查看其他商品</a>
          </router-link>
        </div>
        <!-- classStyle="main-btn" -->
        <div class="buy">
          <y-button
            :classStyle="radio1&&product.isClose!=0 ?'main-btn':'disabled-btn'"
            text="加入购物车"
            @btnClick="addCart(product.id,product.salePrice,product.goodsName,showimg(product.mainPicture),product.goodlistid,product.storeId ,product.goodlistname , remarks , product.brandType )"
            style="width: 145px;height: 50px;line-height: 48px"
          ></y-button>
          <y-button
            :classStyle="radio1&&product.isClose!=0 ?'':'disabled-btn'"
            text="现在购买"
            @btnClick="checkout(product.id)"
            style="width: 145px;height: 50px;line-height: 48px;margin-left: 10px"
          ></y-button>
        </div>
      </div>
    </div>
    <!--产品信息-->
    <div class="item-info">
      <y-shelf title="图文介绍">
        <div slot="content">
          <div class="img-item" v-if="productMsg">
            <div v-html="productMsg">{{ productMsg}}</div>
          </div>
          <div class="no-info" v-else>
            <img src="../../../static/images/no-data.png" />
            <br />该商品暂无内容数据
          </div>
        </div>
      </y-shelf>
    </div>
  </div>
</template>
<script>
import { productDet, addCart, getGoodsDeatil } from "/api/goods";
import { mapMutations, mapState } from "vuex";
import YShelf from "/components/shelf";
import BuyNum from "/components/buynum";
import YButton from "/components/YButton";
import { getStore, getFullUrl, isNotBlank, getPrice } from "/utils/storage";
export default {
  data() {
    return {
      activeNames: "1",
      radio1: "",
      productMsg: {},
      small: [],
      big: "",
      goodAttrList: [],
      product: {
        salePrice: 0,
        limitNum: 1
      },
      productNum: 1,
      userId: "",
      storeInfo: {},
      id: "",
      isBig: false, // 大图
      isShade: false, // 遮罩层
      remarks: "" // 编码或者总成型号
    };
  },
  computed: {
    ...mapState(["login", "showMoveImg", "showCart"])
  },
  methods: {
    ...mapMutations(["ADD_CART", "ADD_ANIMATION", "SHOW_CART"]),
    _productDet(productId) {
      getGoodsDeatil({ id: productId }).then(res => {
        let result = res.data;
        let storeInfo = res.data.store;
        this.storeInfo = storeInfo;
        this.product = result;
        this.product.limitNum = 1;
        // this.product.salePrice = isNotBlank(result.goodAttrList)&&result.goodAttrList.length>0 ?result.goodAttrList[0].goodAttrValue:0
        this.goodAttrList =
          isNotBlank(result.goodAttrList) && result.goodAttrList.length > 0
            ? result.goodAttrList
            : [];
        this.productMsg = isNotBlank(result.description)
          ? decodeURIComponent(window.atob(result.description))
          : "";
        this.small = result.photo.split("|");
        this.small.unshift(result.mainPicture);
        this.big = this.small[0];
        this.radio1 =
          isNotBlank(result.goodAttrList) && result.goodAttrList.length > 0
            ? result.goodAttrList[0].id
            : "";
        this.remarks =
          isNotBlank(result.goodAttrList) && result.goodAttrList.length > 0
            ? result.goodAttrList[0].remarks
            : "";
        this.product.goodlistid =
          isNotBlank(result.goodAttrList) && result.goodAttrList.length > 0
            ? result.goodAttrList[0].id
            : "";
        this.product.salePrice =
          isNotBlank(result.goodAttrList) && result.goodAttrList.length > 0
            ? result.goodAttrList[0].goodAttrValue
            : "";
      });
      // productDet({params: {productId}}).then(res => {
      //   let result = res.result
      //   this.product = result
      //   this.productMsg = result.detail || ''
      //   this.small = result.productImageSmall
      //   this.big = this.small[0]
      // })
    },
    getPrice(val) {
      return getPrice(val);
    },
    clickRadio(val) {
      this.product.salePrice = val;
    },
    changeRadio(val) {
      this.goodAttrList.forEach(element => {
        if (element.id == val.target.value) {
          this.product.salePrice = element.goodAttrValue;
          this.product.goodlistname = element.goodAttrName;
          this.remarks = element.remarks;
        }
      });
      this.product.goodlistid = val.target.value;
    },
    showimg(url) {
      return getFullUrl(url);
    },

    addCart( id,price, name, img,goodlistid, storeId,goodlistname, remarks,
      brandType
    ) {
      if (!this.showMoveImg) {
        // 动画是否在运动
        // if (this.login) {
        // 登录了 直接存在用户名下
        // addCart({
        //   userId: this.userId,
        //   productId: id,
        //   productNum: this.productNum
        // }).then(res => {
        // 并不重新请求数据
        this.ADD_CART({
          productId: id,
          salePrice: price,
          productName: name,
          productImg: img,
          productNum: this.productNum,
          goodlistid: goodlistid,
          storeId,
          goodlistname,
          remarks,
          brandType
        });
        // });
        // } else {
        //   // 未登录 vuex
        //   this.ADD_CART({
        //     productId: id,
        //     salePrice: price,
        //     productName: name,
        //     productImg: img,
        //     productNum: this.productNum
        //   });
        // }
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
    checkout(productId) {
      this.$router.push({
        path: "/checkout",
        query: {
          productId,
          num: this.productNum,
          gooodid: this.radio1,
          salePrice: this.product.salePrice,
          remarks:this.remarks,
          brandType:this.product.brandType
        }
      });
    },
    editNum(num) {
      this.productNum = num;
    },
    getPageScroll() {
      return {
        scrollTop:
          window.pageYOffset ||
          document.documentElement.scrollTop ||
          document.body.scrollTop ||
          0,
        scrollLeft:
          window.pageXOffset ||
          document.documentElement.scrollLeft ||
          document.body.scrollLeft ||
          0
      };
    },
    getEventPage(e) {
      return {
        pageX: e.clientX + this.getPageScroll().scrollLeft,
        pageY: e.clientY + this.getPageScroll().scrollTop
      };
    },
    // 放大镜
    boxMouseOver(e) {
      e.preventDefault();
      e.stopPropagation();
      this.isShade = true;
      // this.isBig = true;
      var markDom = document.getElementById("mark");
      var thumbDom = document.getElementById("big");
      // 计算阴影的位置
      let x = e.offsetX - parseInt(markDom.style.width) / 2;
      let y = e.offsetY - parseInt(markDom.style.height) / 2;

      let maxLeft =
        parseInt(thumbDom.style.width) - parseInt(markDom.style.width);
      let maxTop =
        parseInt(thumbDom.style.height) - parseInt(markDom.style.height);

      x = x <= 0 ? 0 : x;
      x = x >= maxLeft ? maxLeft : x;
      y = y <= 0 ? 0 : y;
      y = y >= maxTop ? maxTop : y;

      markDom.style.left = x + "px";
      markDom.style.top = y + "px";
    },
    // 鼠标在阴影移动
    shadeMouseMove(e) {
      e.preventDefault();
      e.stopPropagation();
      var markDom = document.getElementById("mark");
      var thumbDom = document.getElementById("big"); //用页面x - 父盒子的offsetLeft - 父盒子的左边框宽度
      var superBig = document.getElementById("big-img-box");
      var x =
        this.getEventPage(e).pageX -
        thumbDom.offsetParent.offsetLeft -
        thumbDom.offsetParent.clientLeft; //用页面y - 父盒子的offsetTop - 父盒子的上边框宽度\

      var y =
        this.getEventPage(e).pageY -
        thumbDom.offsetParent.offsetTop -
        thumbDom.offsetParent.clientTop; //让阴影的坐标居

      x -= parseInt(markDom.style.width) / 2;
      y -= parseInt(markDom.style.height) / 2; // 移动边界限制

      let maxLeft =
        parseInt(thumbDom.style.width) - parseInt(markDom.style.width);
      let maxTop =
        parseInt(thumbDom.style.height) - parseInt(markDom.style.height);
      x = x <= 0 ? 0 : x;
      x = x >= maxLeft ? maxLeft : x;
      y = y <= 0 ? 0 : y;
      y = y >= maxTop ? maxTop : y; // 重新赋值当前的定位值

      markDom.style.left = x + "px";
      markDom.style.top = y + "px";

      // 比例为x:大图宽度/小图宽度 y: 大图高度/小图高度,将小图的定位乘以比例就是大图的定位
      const xRate =
        parseInt(superBig.style.width) / parseInt(thumbDom.style.width);
      const yRate =
        parseInt(superBig.style.height) / parseInt(thumbDom.style.height);
      superBig.style.left = -x * xRate;
      superBig.style.top = -y * yRate;
    },

    boxMouseLeave(e) {
      this.isShade = false;
      this.isBig = false;
    },
    handleChange() {}
  },

  components: {
    YShelf,
    BuyNum,
    YButton
  },
  created() {
    let id = this.$route.query.productId;
    this.id = id;
    this._productDet(id);
    this.userId = getStore("userId");
  },
  mounted() {}
};
</script>
<style lang="scss" scoped>
@import "../../assets/style/mixin";

.goodprompt {
  margin: 16px 0 16px 10px;
  color: rgb(223, 11, 7);
}

.store-content {
  clear: both;
  width: 1220px;
  min-height: 600px;
  padding: 0 0 25px;
  margin: 0 auto;
}

.indextitle {
  width: 1220px;
  padding: 20px;
  box-sizing: border-box;
  margin: 8px 0;
  background: #1a1a1a;
  color: #fff;
  display: flex;
  align-items: center;
  position: relative;
  border-radius: 8px;
  &:hover {
    // transform: translate(-3px, -3px);
    box-shadow: 1px 1px 20px #999;
    transition: all 0.5s;
    .nav-user-wrapper {
      visibility: visible;
      transition: all 0.5s;
      opacity: 1;
      // top: 80px;
    }
  }
  .indextitleFirst {
    display: flex;
    align-items: center;
    > img {
      @include wh(40px);
      margin-left: 38px;
      border-radius: 5px;
    }
    > h1,
    h3 {
      font-size: 30px;
      font-weight: 800;
      padding-left: 12px;
      cursor: pointer;
    }
  }

  // 显示弹出框
  .nav-user-wrapper {
    position: absolute;
    z-index: 30;
    width: 300px;
    height: 300px;
    padding-top: 18px;
    // opacity: 1;
    // left: 80px;
    top: 80px;
    visibility: hidden;
    opacity: 0;
    // top: -3000px;
    .nav-user-list {
      position: relative;
      height: 100%;
      padding-top: 20px;
      background: #fff;
      border: 1px solid #d6d6d6;
      border-color: rgba(0, 0, 0, 0.08);
      border-radius: 8px;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15);
      z-index: 10;
      &:before {
        position: absolute;
        content: " ";
        background: url(../../../static/images/account-icon@2x.32d87deb02b3d1c3cc5bcff0c26314ac.png)
          no-repeat -49px -43px;
        background-size: 240px 107px;
        @include wh(20px, 8px);
        top: -8px;
        left: 50%;
        margin-left: -10px;
      }
      > ul {
        width: 100%;
        li {
          display: flex;
          justify-content: space-between;
          flex-wrap: wrap;
          color: #1a1a1a;
          font-size: 16px;
          padding: 10px;
          border-bottom: 1px solid #f0f0f0;
          // &:hover {
          // background: #ccc;
          // }

          > span {
            width: 50%;
            display: block;
          }
        }
        &:last-child {
          background: none;
        }
      }
    }
  }
}

.gray-box {
  display: flex;
  padding: 60px;
  margin: 20px 0;
  position: relative;
  .gallery-wrapper {
    .gallery {
      display: flex;
      width: 540px;
      .thumbnail {
        li:first-child {
          margin-top: 0px;
        }
        li {
          @include wh(80px);
          margin-top: 10px;
          padding: 12px;
          border: 1px solid #f0f0f0;
          border: 1px solid rgba(0, 0, 0, 0.06);
          border-radius: 5px;
          cursor: pointer;
          &.on {
            padding: 10px;
            border: 3px solid #ccc;
            border: 3px solid rgba(0, 0, 0, 0.2);
          }
          img {
            display: block;
            @include wh(100%);
          }
        }
      }
      #thumb {
        margin-left: 20px;
        #big {
          position: relative;
        }
        img {
          display: block;
          @include wh(440px);
        }
        #mark {
          position: absolute;
          background-color: #333;
          filter: alpha(opacity=0);
          opacity: 0.3;
          z-index: 100;
        }
      }
    }
  }
  // 右边
  .banner {
    width: 450px;
    margin-left: 150px;
    h4 {
      font-size: 24px;
      line-height: 1.25;
      color: #000;
      margin-bottom: 13px;
    }
    h6 {
      font-size: 14px;
      line-height: 1.5;
      color: #544a4a;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }
    .sku-custom-title {
      overflow: hidden;
      padding: 8px 8px 18px 10px;
      position: relative;
    }
    .params-name {
      padding-right: 20px;
      font-size: 14px;
      color: #8d8d8d;
      line-height: 36px;
    }
    .num {
      padding: 29px 0 8px 10px;
      border-top: 1px solid #ebebeb;
      display: flex;
      align-items: center;
    }
    .buy {
      position: relative;
      border-top: 1px solid #ebebeb;
      padding: 30px 0 0 10px;
    }
  }

  // 放大镜
  #big-img-box {
    background: #333;
    height: 500px;
    width: 500px;
    overflow: hidden;
    border: 1px solid #cccccc;
    position: absolute;
    right: 90px;
    top: 30px;
    z-index: 100;
  }
}

.item-info {
  min-height: 280px;
  .gray-box {
    padding: 0;
    display: block;
  }
  .img-item {
    width: 1220px;
    // padding: 1vw;
    // text-align: center;
    img {
      width: 100%;
      height: auto;
      display: block;
    }
  }
}

.no-info {
  padding: 200px 0;
  text-align: center;
  font-size: 30px;
}

.price {
  display: block;
  color: #d44d44;
  font-weight: 700;
  font-size: 16px;
  line-height: 20px;
  text-align: right;
  i {
    padding-left: 2px;
    font-size: 24px;
  }
}
</style>
