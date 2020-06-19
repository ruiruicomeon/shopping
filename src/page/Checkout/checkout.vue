<template>
  <div class="checkout">
    <y-header>
      <div slot="nav"></div>
    </y-header>
    <div class="w" style="padding-top: 40px;">
      <!-- 收货地址 -->
      <y-shelf title="收货信息">
        <div slot="content">
          <ul class="address-item-list clearfix">
            <li
              v-for="(item,i) in addList"
              :key="i"
              class="address pr"
              :class="{checked:item.id==addressId}"
              @click="chooseAddress(item.id, item.people, item.phone, item.area, item.address)"
            >
              <span v-if="item.id==addressId" class="pa">
                <svg viewBox="0 0 1473 1024" width="17.34375" height="12">
                  <path
                    d="M1388.020 57.589c-15.543-15.787-37.146-25.569-61.033-25.569s-45.491 9.782-61.023 25.558l-716.054 723.618-370.578-374.571c-15.551-15.769-37.151-25.537-61.033-25.537s-45.482 9.768-61.024 25.527c-15.661 15.865-25.327 37.661-25.327 61.715 0 24.053 9.667 45.849 25.327 61.715l431.659 436.343c15.523 15.814 37.124 25.615 61.014 25.615s45.491-9.802 61.001-25.602l777.069-785.403c15.624-15.868 25.271-37.66 25.271-61.705s-9.647-45.837-25.282-61.717M1388.020 57.589z"
                    fill="#6A8FE5"
                    p-id="1025"
                  />
                </svg>
              </span>
              <p>收货人: {{item.people}} {{item.isDefault ==1 ? '(默认地址)' : ''}}</p>
              <p class="street-name ellipsis">收货区域: {{item.area}}</p>
              <p class="street-name">详细地址地址: {{item.address}}</p>
              <p>手机号码: {{item.phone}}</p>
              <div class="operation-section">
                <span class="update-btn" style="font-size:12px" @click="update(item)">修改</span>
                <span
                  class="delete-btn"
                  style="font-size:12px"
                  :data-id="item.id"
                  @click="del(item.id)"
                >删除</span>
              </div>
            </li>

            <li class="add-address-item" @click="update()">
              <img src="../../../static/svg/jia.svg" alt />
              <p>使用新地址</p>
            </li>
          </ul>
        </div>
      </y-shelf>
      <!-- 购物清单 -->
      <y-shelf title="购物清单">
        <div slot="content">
          <div class="box-inner ui-cart">
            <div>
              <!--标题-->
              <div class="cart-table-title">
                <span class="name">商品信息</span>
                <span class="subtotal">小计</span>
                <span class="num">数量</span>
                <span class="price">单价</span>
                <span class="specification">规格</span>
              </div>
              <!--列表-->
              <!-- v-if="item.checked === '1'" -->
              <div class="cart-table" v-for="(item,i) in cartListAll" :key="i">
                <div class="cart-group divide pr" :data-productid="item.id">
                  <div class="cart-top-items">
                    <div class="cart-items clearfix">
                      <!--图片-->
                      <div class="items-thumb fl">
                        <img :alt="item.productName" :src="showimg(item.mainPicture)" />
                        <a @click="goodsDetails(item.id)" :title="item.goodsName" target="_blank"></a>
                      </div>
                      <!--信息-->
                      <div class="name hide-row fl">
                        <div class="name-table">
                          <a
                            @click="goodsDetails(item.id)"
                            :title="item.goodsName"
                            target="_blank"
                            v-text="item.goodsName"
                          ></a>
                          <!-- <ul class="attribute">
                            <li>白色</li>
                          </ul>-->
                        </div>
                      </div>
                      <!--商品数量-->
                      <div>
                        <!--总价格-->
                        <div
                          class="subtotal"
                          style="font-size: 14px"
                        >¥ {{item.goodsNumber * getPrice(item.unitPrice)}}</div>
                        <!--数量-->
                        <div class="item-cols-num">
                          <span v-text="item.goodsNumber"></span>
                        </div>
                        <!--价格-->
                        <div class="price">¥ {{getPrice(item.unitPrice)}}</div>
                        <!--价格-->
                        <div class="specification">
                          {{(item.goodAttrList.filter(itemin=>{
                          return itemin.id===item.attrId
                          }))[0].goodAttrName}}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- 合计 -->
            <div class="cart-bottom-bg fix-bottom">
              <div class="fix-bottom-inner">
                <div class="shipping">
                  <div class="shipping-box" style="padding: 0 40px;">
                    <div class="shipping-total shipping-price">
                      <h4 class="highlight">
                        应付总额：
                        <em>￥{{getPrice(checkPrice)}}</em>
                      </h4>
                    </div>
                  </div>
                  <y-button
                    class="big-main-btn"
                    :classStyle="submit?'disabled-btn':'main-btn'"
                    style="margin: 0;width: 130px;height: 50px;line-height: 50px;font-size: 16px"
                    :text="submitOrder"
                    @btnClick="_submitOrder"
                  ></y-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </y-shelf>

      <y-popup :open="popupOpen" @close="popupOpen=false" :title="popupTitle">
        <div slot="content" class="md" :data-id="msg.id">
          <div>
            <input type="text" placeholder="收货人姓名" v-model="msg.people" />
          </div>
          <div>
            <input type="number" placeholder="手机号码" v-model="msg.phone" />
          </div>
          <div>
            <el-cascader
              class="s-cascader"
              placeholder="收货区域"
              style="width:100%"
              size="large"
              :options="options"
              :props="showprops"
              v-model="msg.area"
              @change="handleChange"
            ></el-cascader>
          </div>
          <div>
            <input type="text" placeholder="详细地址" v-model="msg.address" />
          </div>
          <div>
            <el-checkbox class="auto-login" v-model="msg.isDefault">设为默认</el-checkbox>
          </div>
          <y-button
            text="保存"
            class="btn"
            :classStyle="btnHighlight?'main-btn':'disabled-btn'"
            @btnClick="save({id:msg.id,people:msg.people,phone:msg.phone,address:msg.address,isDefault:msg.isDefault,area:msg.area})"
          ></y-button>
        </div>
      </y-popup>
    </div>
    <!-- <y-footer></y-footer> -->

    <el-dialog title="删除地址" :visible.sync="dialogVisible" width="30%">
      <!-- :before-close="handleClose" -->
      <span>确定删除该地址</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="onclickdel">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>
<script>
import { findCartByGoodsJson } from "/api/goods";
import {
  getByHarvestAddressListNoPage,
  postByHarvestAddress,
  deleteByHarvestAddress,
  buyAllToOrderr
} from "/api/index";
import YShelf from "/components/shelf";
import YButton from "/components/YButton";
import YPopup from "/components/popup";
import YHeader from "/common/header";
import YFooter from "/common/footer";
import {
  getStore,
  isNotBlank,
  getFullUrl,
  setStore,
  removeStore,
  getPrice
} from "/utils/storage";
import { optionsData } from "./data";
import {
  provinceAndCityData,
  regionData,
  provinceAndCityDataPlus,
  regionDataPlus,
  CodeToText,
  TextToCode
} from "element-china-area-data";

export default {
  data() {
    return {
      cartList: [],
      addList: [],

      addressId: "0",
      popupOpen: false,
      popupTitle: "管理收货地址",
      num: "", // 立刻购买
      productId: "",
      msg: {
        id: "",
        people: "",
        phone: "",
        address: "",
        area: "",
        isDefault: false
      },
      userName: "",
      tel: "",
      streetName: "",
      userId: "",
      orderTotal: 0,
      submit: false,
      submitOrder: "提交订单",
      cartListAll: [],
      options: optionsData,
      selectedOptions: [],
      showprops: { value: "label", label: "label" },
      dialogVisible: false,
      deldata: {},
      orderData: []
    };
  },
  computed: {
    btnHighlight() {
      let msg = this.msg;
      return msg.people && msg.phone && msg.address && msg.area;
    },
    // 选中的总价格
    checkPrice() {
      let totalPrice = 0;
      this.cartListAll &&
        this.cartListAll.forEach(item => {
          totalPrice += item.goodsNumber * item.unitPrice;
        });
      this.orderTotal = totalPrice;
      return totalPrice;
    }
  },
  methods: {
    handleChange(val) {
      console.log(val);
    },
    getPrice(val) {
      return getPrice(val);
    },
    message(m) {
      this.$message.error({
        message: m
      });
    },
    showimg(url) {
      return getFullUrl(url);
    },
    goodsDetails(id) {
      window.open(window.location.origin + "#/goodsDetails?productId=" + id);
    },
    // _getCartList() {
    //   getCartList({ userId: this.userId }).then(res => {
    //     this.cartList = res.result;
    //   });
    // },
    _addressList() {
      let initarr = [];
      if (
        isNotBlank(this.$route.query.productId) &&
        isNotBlank(this.$route.query.num) &&
        isNotBlank(this.$route.query.gooodid) &&
        isNotBlank(this.$route.query.salePrice) &&
        isNotBlank(this.$route.query.remarks) &&
        isNotBlank(this.$$route.query.brandType)
      ) {
        initarr = [
          {
            goodsId: this.$route.query.productId,
            goodsNumber: this.$route.query.num,
            goodAttrId: this.$route.query.gooodid
          }
        ];
        this.orderData.push({
          goodId: this.$route.query.productId,
          goodCount: this.$route.query.num,
          goodUnitPrice: this.$route.query.salePrice,
          priceAmount: this.$route.query.num * this.$route.query.salePrice,
          goodAttrId: this.$route.query.gooodid,
          goodType: this.$$route.query.brandType,
          discount: this.$route.query.remarks
        });
      } else if (isNotBlank(this.$route.query.type)) {
        this.cartList = JSON.parse(getStore("buyCart"));
       
        this.cartList.forEach(item => {
          if (item.checked == 1) {
            initarr.push({
              goodsId: item.productId,
              goodsNumber: item.productNum,
              goodAttrId: item.goodlistid
            });
            this.orderData.push({
              goodId: item.productId,
              goodCount: item.productNum,
              goodUnitPrice: item.salePrice,
              priceAmount: item.salePrice * item.productNum,
              goodAttrId: item.goodlistid,
              discount: isNotBlank(item.remarks) ? item.remarks : "",
              goodType: item.brandType
            });
          }
        });
      }
      initarr = JSON.stringify(initarr);
      findCartByGoodsJson({ cartList: initarr }).then(res => {
        this.cartListAll = res.data.marketableGoodsList[0].goodsList;
      });

      getByHarvestAddressListNoPage().then(res => {
        let data = res.data;
        if (data.length) {
          this.addList = data;
          res.data.forEach((item, idx) => {
            if (item.isDefault == 1) {
              this.addressId = item.id;
              this.people = item.people;
              this.phone = item.phone;
              this.area = item.area;
              this.address = item.address;
            }
          });
        } else {
          this.addList = [];
        }
      });
    },
    // _addressUpdate (params) {
    //   addressUpdate(params).then(res => {
    //     this._addressList()
    //   })
    // },
    // _addressAdd (params) {
    //   addressAdd(params).then(res => {
    //     if (res.success === true) {
    //       this._addressList()
    //     } else {
    //       this.message(res.message)
    //     }
    //   })
    // },
    onclickdel() {
      this.dialogVisible = false;
      deleteByHarvestAddress(this.deldata).then(res => {
        getByHarvestAddressListNoPage().then(res => {
          let data = res.data;
          if (data.length) {
            this.addList = data;
            // this.addressId = data[0].id
            // this.userName = data[0].userName
            // this.tel = data[0].tel
            // this.streetName = data[0].streetName
          } else {
            this.addList = [];
          }
        });
      });
    },
    _addressDel(params) {
      this.dialogVisible = true;
      this.deldata = params;
      // deleteByHarvestAddress(params).then(res => {
      //   // this._addressList();
      // });
    },
    // 提交订单后跳转付款页面
    _submitOrder() {
      this.submitOrder = "提交订单中...";
      this.submit = true;
      if (this.addressId === "0") {
        this.message("请选择收货地址");
        this.submitOrder = "提交订单";
        this.submit = false;
        return;
      }
      if (this.cartListAll.length === 0) {
        this.message("请先选择下单产品!");
        this.submitOrder = "提交订单";
        this.submit = false;
        return;
      }

      // let allMoney = 0
      // this.orderData.forEach(item=>{
      //       allMoney += Number(item.goodUnitPrice)
      // })

      let params = {
        goodsList: JSON.stringify(this.orderData),
        isSend: 1,
        goodsAmount: this.checkPrice,
        orderAmount: this.checkPrice,
        orderShouldPay: this.checkPrice,
        receiveAddress: `${this.area} ${this.address}`,
        receiveUserMobile: this.phone,
        receiveUserName: this.people,
        groupType: 0,
        orderType: 1
      };

      buyAllToOrderr(params).then(res => {
        if (res.success == 1) {
          this.$message.success({
            message: "下单成功"
          });
          this.cartList = this.cartList.filter(item => {
            return item.checked == 0;
          });
          removeStore("buyCart");
          setStore("buyCart", this.cartList);
          this.$router.push({
            path: "/user/orderList"
          });
        } else {
          this.$message.success({
            message: isNotBlank(res.msg) ? res.msg : "下单失败"
          });
          this.submitOrder = "提交订单";
          this.submit = false;
        }
      });

      // submitOrder(params).then(res => {
      //   if (res.success === true) {
      //     this.payment(res.result);
      //   } else {
      //     this.message(res.message);
      //     this.submitOrder = "提交订单";
      //     this.submit = false;
      //   }
      // });
    },
    // 付款
    payment(orderId) {
      // 需要拿到地址id
      this.$route.push({
        path: "/order/payment",
        query: {
          orderId: orderId
        }
      });
    },
    // 选择地址
    chooseAddress(addressId, people, phone, area, address) {
      this.addressId = addressId;
      this.people = people;
      this.phone = phone;
      this.area = area;
      this.address = address;
    },
    // 修改
    update(item) {
      this.popupOpen = true;
      if (item) {
        this.popupTitle = "管理收货地址";
        this.msg.people = item.people;
        this.msg.phone = item.phone;
        this.msg.address = item.address;
        this.msg.isDefault = item.isDefault == 1 ? true : false;
        this.msg.id = item.id;
        this.msg.area = item.area.split(",");
      } else {
        this.popupTitle = "新增收货地址";
        this.msg.people = "";
        this.msg.phone = "";
        this.msg.address = "";
        this.msg.isDefault = false;
        this.msg.id = "";
      }
    },
    // 保存
    save(p) {
      this.popupOpen = false;
      const vals = { ...p };
      vals.isDefault = vals.isDefault ? 1 : 0;
      vals.area = vals.area.join(",");
      if (p.id) {
        // this._addressUpdate(p)
      } else {
        delete p.id;
        // this._addressAdd(p)
      }

      postByHarvestAddress(vals).then(() => {
        getByHarvestAddressListNoPage().then(res => {
          let data = res.data;
          if (data.length) {
            this.addList = data;
            console.log(data);
            res.data.forEach((item, idx) => {
              if (item.isDefault == 1) {
                this.addressId = item.id;
                this.people = item.people;
                this.phone = item.phone;
                this.area = item.area;
                this.address = item.address;
              }
            });
            // this.addressId = data[0].id
            // this.userName = data[0].userName
            // this.tel = data[0].tel
            // this.streetName = data[0].streetName
          } else {
            this.addList = [];
          }
        });
      });
    },
    // 删除
    del(id) {
      this._addressDel({ id });
    }
    // _productDet(productId) {
    //   productDet({ params: { productId } }).then(res => {
    //     let item = res.result;
    //     item.checked = "1";
    //     item.productImg = item.productImageBig;
    //     item.productNum = this.num;
    //     item.productPrice = item.salePrice;
    //     this.cartList.push(item);
    //   });
    // }
  },
  created() {
    // this.userId = getStore('userId')
    // let query = this.$route.query
    // if (query.productId && query.num) {
    //   this.productId = query.productId
    //   this.num = query.num
    //   this._productDet(this.productId)
    // } else {
    //   this._getCartList()
    // }
    this._addressList();
  },
  components: {
    YShelf,
    YButton,
    YPopup,
    YHeader,
    YFooter
  }
};
</script>
<style lang="scss" rel="stylesheet/scss" scoped>
// 收货地址
.address-item-list {
  padding: 30px 13px 0;
  .address {
    padding: 19px 14px 0 19px;
    p {
      line-height: 26px;
    }
  }
  li.checked {
    border-color: #6a8fe5;
    position: relative;
    background: #fff;
    .pa {
      right: 15px;
      top: 18px;
    }
    &:hover {
      background: #fff;
    }
  }
  li {
    position: relative;
    overflow: hidden;
    float: left;
    width: 276px;
    height: 158px;
    margin: 0 0 30px 16px;
    border: 1px solid #e5e5e5;
    border-radius: 3px;
    background: #fafafa;
    line-height: 14px;
    text-align: left;
    word-wrap: break-word;
    word-break: normal;
    color: #626262;
    cursor: pointer;
    -moz-user-select: -moz-none;
    -webkit-user-select: none;
    -o-user-select: none;
    user-select: none;
    &:hover {
      background: #f2f2f2;
      .operation-section {
        visibility: visible;
        transform: translate(0, 0);
      }
    }
    &.add-address-item {
      text-align: center;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      p {
        margin-top: 5px;
      }
    }
    .operation-section {
      visibility: hidden;
      position: absolute;
      left: 0;
      bottom: 0;
      width: 100%;
      height: 28px;
      background: #e1e1e1;
      border-top: 1px solid #e1e1e1;
      transition: all 0.2s ease;
      transform: translate(0, 29px);
      border-top: 1px solid #e1e1e1;
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 11;
      span {
        background: #fff;
        display: flex;
        align-items: center;
        justify-content: center;
        flex: 1;
        height: 100%;
        &:hover {
          background: #f2f2f2;
        }
      }

      span + span {
        border-left: 1px solid #e1e1e1;
      }
    }
  }
}

.s-content {
  .md {
    > div {
      text-align: left;
      margin-bottom: 15px;
      > input {
        width: 100%;
        height: 50px;
        font-size: 18px;
        padding: 10px 20px;
        border: 1px solid #ccc;
        border-radius: 6px;
        box-shadow: 0 3px 5px -4px rgba(0, 0, 0, 0.4) inset,
          -1px 0 3px -2px rgba(0, 0, 0, 0.1) inset;
        line-height: 46px;
      }
      > .s-cascader {
        width: 100%;
        /deep/ .el-input--suffix .el-input__inner {
          width: 100%;
          height: 50px;
          font-size: 18px;
          padding: 10px 20px;
          border: 1px solid #ccc;
          border-radius: 6px;
          box-shadow: 0 3px 5px -4px rgba(0, 0, 0, 0.4) inset,
            -1px 0 3px -2px rgba(0, 0, 0, 0.1) inset;
          line-height: 46px;
        }
        /deep/ .el-cascader__label {
          color: #000 !important;
          font-size: 17px;
          padding-left: 20px !important;
          line-height: 50px;
        }
      }
    }
  }

  .btn {
    margin: 0;
    width: 100%;
    height: 50px;
    font-size: 14px;
    line-height: 48px;
  }
}

.ui-cart {
  img {
    width: 80px;
    height: 80px;
  }

  .cart-table-title {
    position: relative;
    z-index: 1;
    line-height: 38px;
    height: 38px;
    padding: 0 0 0 30px;
    font-size: 12px;
    background: #eee;
    border-bottom: 1px solid #dbdbdb;
    border-bottom-color: rgba(0, 0, 0, 0.08);
    .name {
      float: left;
      text-align: left;
    }
    span {
      width: 160px;
      float: right;
      text-align: center;
      color: #838383;
    }
  }
  .cart-group.divide {
    .cart-items {
      border-top: 1px dashed #eee;
    }
  }
  .cart-items {
    position: relative;
    height: 140px;
    margin-left: 74px;
    .subtotal {
      font-weight: 700;
    }
    .item-cols-num,
    .price,
    .subtotal,
    .specification {
      overflow: hidden;
      float: right;
      width: 160px;
      text-align: center;
      color: #666;
      line-height: 140px;
    }
    /*数量*/
    .subtotal,
    .item-cols-num {
      padding-top: 50px;
      line-height: 40px;
    }
    .select {
      width: 112px;
      height: 40px;
      padding-top: 4px;
      margin: 0 auto;
      line-height: 40px;
      .down {
        background-position: 0 -60px;
      }
      .down.down-disabled:hover {
        background-position: 0 -300px;
        cursor: not-allowed;
      }
      .num {
        position: relative;
        overflow: hidden;
        display: inline-block;
        width: 36px;
        height: 18px;
        margin: 7px 0 0;
        border: none;
        border-radius: 3px;
        line-height: 18px;
        text-align: center;
        font-size: 14px;
        transition: all 0.2s ease-out;
      }
    }
  }
  .down.down-disabled {
    background-position: 0 -300px;
    cursor: not-allowed;
  }
}

.cart-group.divide .cart-top-items:first-child .cart-items {
  border-top: none;
}

.items-choose {
  position: absolute;
  left: -74px;
  top: 0;
  width: 74px;
  height: 20px;
  padding: 60px 0 0 31px;
  font-size: 12px;
  color: #999;
}

.items-thumb {
  position: relative;
  margin-top: 30px;
  overflow: hidden;
  width: 80px;
  height: 80px;
}

.cart-items .items-thumb > a,
.ui-cart .cart-items .items-thumb > i {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
  border: 1px solid #fff;
  border-radius: 3px;
  border: 0 solid rgba(255, 255, 255, 0.1);
  box-shadow: inset 0 0 0 1px rgba(0, 0, 0, 0.06);
}

.name {
  width: 380px;
  margin-left: 20px;
  color: #323232;
  display: table;
  a {
    color: #333;
    font-size: 16px;
  }
}

.name-table {
  display: table-cell;
  vertical-align: middle;
  height: 140px;
}

.fix-bottom {
  padding: 22px 29px 19px 30px;
  height: 90px;
  width: 100%;
  z-index: 1;
  background-position: center;
  background: #fdfdfd;
  background: -webkit-linear-gradient(#fdfdfd, #f9f9f9);
  background: linear-gradient(#fdfdfd, #f9f9f9);
  border-top: 1px solid #e9e9e9;
  box-shadow: 0 -3px 8px rgba(0, 0, 0, 0.04);
  .cart-bottom-bg {
    height: 80px;
    border-top: 1px solid #d9d9d9;
    border-radius: 0 0 8px 8px;
  }
  .fix-bottom-inner {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  }
  .shipping {
    display: flex;
    align-items: center;
  }
  em {
    display: inline-block;
    position: relative;
    top: 3px;
    margin-top: -4px;
    font-size: 24px;
    color: #d44d44;
    font-weight: 700;
  }
}

.attribute,
.name p {
  color: #999;
  font-size: 12px;
  padding-top: 4px;
  line-height: 17px;
}
</style>
