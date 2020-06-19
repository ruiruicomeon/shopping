<template>
  <div>
    <y-shelf title="收货地址">
      <span slot="right">
        <y-button text="添加收货地址" style="margin: 0" @btnClick="update()"></y-button>
      </span>
      <div slot="content">
        <!--标题-->
        <div class="table-title">
          <span class="name">收货人</span>
          <span class="address">所属区域</span>
          <span class="address">详细地址</span>
          <span class="tel">电话</span>
          <span style="width:335px"></span>
        </div>
        <div v-if="addList.length">
          <div class="address-item" v-for="(item,i) in addList" :key="i">
            <div class="name">{{item.people}}</div>
            <div class="address-msg">{{item.area}}</div>
            <div class="address-msg">{{item.address}}</div>
            <div class="telephone">{{item.phone}}</div>
            <div class="defalut">
              <a
                @click="changeDef(item)"
                href="javascript:;"
                v-text="item.isDefault==1 ?'( 默认地址 )':'设为默认'"
                :class="{'defalut-address':item.isDefault==1}"
              ></a>
            </div>
            <div class="operation">
              <el-button type="primary" icon="edit" size="small" @click="update(item)">修改</el-button>
              <el-button
                type="danger"
                icon="delete"
                size="small"
                :data-id="item.id"
                @click="del(item.id,i)"
              >删除</el-button>
            </div>
          </div>
        </div>
        <div v-else>
          <div style="padding: 80px 0;text-align: center">
            <div style="font-size: 20px">你还未添加收货地址</div>
            <div style="margin: 20px ">
              <y-button text="添加地址" @btnClick="update()"></y-button>
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
        <!-- @change="handleChange" -->
        <div>
          <el-cascader
             class='s-cascader'
            placeholder="收货区域"
            size="large"
            :options="options"
            :props="showprops"
            v-model="msg.area"
          ></el-cascader>
        </div>
        <div>
          <input type="text" placeholder="收货地址" v-model="msg.address" />
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
// import { addressList } from "/api/goods";
import {
  getByHarvestAddressListNoPage,
  deleteByHarvestAddress,
  postByHarvestAddress
} from "/api/index";
import YButton from "/components/YButton";
import YPopup from "/components/popup";
import YShelf from "/components/shelf";
import {
  getStore,
  isNotBlank,
  getFullUrl,
  setStore,
  removeStore,
  getPrice
} from "/utils/storage";
import { optionsData } from "../../Checkout/data";
export default {
  data() {
    return {
      addList: [],
      popupOpen: false,
      dialogVisible: false,
      popupTitle: "管理收货地址",
       msg: {
        id: "",
        people: "",
        phone: "",
        address: "",
        area: "",
        isDefault: false
      },
      userId: "",
      deldata: {},
      options: optionsData,
      selectedOptions: [],
      showprops: { value: "label", label: "label" },
      dialogVisible: false
    };
  },
  computed: {
    // btnHighlight() {
    //   let msg = this.msg;
    //   return msg.userName && msg.tel && msg.streetName;
    // }
      btnHighlight() {
      let msg = this.msg;
      console.log(msg.people,msg.phone,msg.address,msg.area)
      return msg.people && msg.phone && msg.address && msg.area;
    },
  },
  methods: {
    message(m) {
      this.$message.error({
        message: m
      });
    },
    _addressList() {
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

      // addressList({userId: this.userId}).then(res => {
      //   let data = res.result
      //   if (data.length) {
      //     this.addList = res.result
      //     this.addressId = res.result[0].addressId || '1'
      //   } else {
      //     this.addList = []
      //   }
      // })
    },
    _addressUpdate(params) {
      // addressUpdate(params).then(res => {
      //   this._addressList()
      // })

      const vals = {
        id: params.id,
        people: params.people,
        phone: params.phone,
        area: params.area,
        address: params.address,
        isDefault: 1
      };

      postByHarvestAddress(vals).then(resout => {
        if (resout.success == 1) {
          this.$message.success({
            message: "修改成功"
          });
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
        } else {
          this.$message.error({
            message: isNotBlank(resout.msg) ? resout.msg : "修改失败"
          });
        }
      });
    },
    // _addressAdd(params) {
    //   addressAdd(params).then(res => {
    //     if (res.success === true) {
    //       this._addressList();
    //     } else {
    //       this.message(res.message);
    //     }
    //   });
    // },
    changeDef(item) {
      if (item.isDefault != 1) {
        // item.isDefault = 1
        this._addressUpdate(item);
      }
      return false;
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
    // save (p) {
    //   this.popupOpen = false
    //   if (p.addressId) {
    //     this._addressUpdate(p)
    //   } else {
    //     delete p.addressId
    //     this._addressAdd(p)
    //   }
    // },
    // 删除
    del(id) {
      this._addressDel({ id });
    },
    _addressDel(params) {
      this.dialogVisible = true;
      this.deldata = params;
      // deleteByHarvestAddress(params).then(res => {
      //   // this._addressList();
      // });
    },
    // del (addressId, i) {
    //   addressDel({addressId: addressId}).then(res => {
    //     if (res.success === true) {
    //       this.addList.splice(i, 1)
    //     } else {
    //       this.message('删除失败')
    //     }
    //   })
    // },
    // 修改
    // update (item) {
    //   this.popupOpen = true
    //   if (item) {
    //     this.popupTitle = '管理收货地址'
    //     this.msg.userName = item.userName
    //     this.msg.tel = item.tel
    //     this.msg.streetName = item.streetName
    //     this.msg.isDefault = item.isDefault
    //     this.msg.addressId = item.addressId
    //   } else {
    //     this.popupTitle = '新增收货地址'
    //     this.msg.userName = ''
    //     this.msg.tel = ''
    //     this.msg.streetName = ''
    //     this.msg.isDefault = false
    //     this.msg.addressId = ''
    //   }
    // }
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
    }
  },
  created() {
    this.userId = getStore("userId");
    this._addressList();
  },
  components: {
    YButton,
    YPopup,
    YShelf
  }
};
</script>
<style scoped lang="scss">
.table-title {
  display:flex;
  // position: relative;
  // z-index: 1;
  line-height: 38px;
  height: 38px;
  // padding: 0 0 0 38px;
  font-size: 12px;
  background: #eee;
  border-bottom: 1px solid #dbdbdb;
  border-bottom-color: rgba(0, 0, 0, 0.08);
  .name {
    float: left;
    text-align: center;
  }
  span {
    width: 160px;
    // float: left;
    text-align: center;
    color: #838383;
  }
  .address {
    flex:1
    // margin-left: 115px;
  }
  .tel {
    width:160px
    // margin-left: 195px;
  }
}

.address-item {
  display: flex;
  align-items: center;
  height: 115px;
  text-align: center;
  .name {
    width: 160px;
  }
  .address-msg {
    flex: 1;
  }
  .telephone {
    width: 160px;
  }
  .defalut {
    width: 80px;
    > a {
      text-align: center;
      /*display: none;*/
    }
  }
  .operation {
    width: 255px;
    a {
      padding: 10px 5px;
    }
  }
  &:hover {
    .defalut > a {
      display: block;
    }
  }
}

.address-item + .address-item {
  border-top: 1px solid #cfcfcf;
}

.defalut-address {
  color: #626262;
  display: block;
  pointer-events: none;
  cursor: default;
}

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
        /deep/ .el-input--suffix .el-input__inner{
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
        /deep/ .el-cascader__label{
          color:#000!important;
          font-size: 17px;
          padding-left:20px !important;
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
</style>
