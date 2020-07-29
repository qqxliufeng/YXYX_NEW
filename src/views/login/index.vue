<template>
  <div class="login-container">
    <img
      class="bg-images"
      src="@/assets/custom-theme/images/login-bg.jpeg"
    >
    <div class="content-wrapper">
      <div class="left-wrapper flex-sub">
        <div class="logo-wrapper">
          <img src="@/assets/custom-theme/images/logo.png">
        </div>
        <div class="tip-wrapper">
          <div>
            <img src="@/assets/custom-theme/images/img-login-youxing-tip.png">
          </div>
        </div>
      </div>
      <div class="right-wrapper">
        <el-form
          ref="loginForm"
          :model="loginForm"
          class="login-form"
          autocomplete="on"
          label-position="left"
        >
          <div class="title-container">
            <h3 class="title">
              优行教育管理系统-v2.0
            </h3>
          </div>
          <el-form-item prop="phone">
            <el-input
              ref="phone"
              v-model="loginForm.phone"
              placeholder="请输入用户名或者手机号"
              name="phone"
              type="text"
              tabindex="1"
              autocomplete="on"
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-user"
              />
            </el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              :key="passwordType"
              ref="password"
              v-model="loginForm.password"
              :type="passwordType"
              placeholder="请输入密码"
              name="password"
              tabindex="2"
              autocomplete="on"
              @keyup.native="checkCapslock"
              @blur="capsTooltip = false"
              @keyup.enter.native="handleLogin"
            >
              <i
                slot="suffix"
                class="el-input__icon el-icon-lock"
              />
            </el-input>
          </el-form-item>
          <div class="text-right">
            <el-tooltip
              class="item"
              effect="dark"
              content="请联系平台管理员"
              placement="bottom"
            >
              <el-link
                :underline="false"
                style="color: #333"
              >忘记密码？</el-link>
            </el-tooltip>
          </div>
          <el-button
            :loading="loading"
            type="primary"
            style="width:100%; margin-top: 20%"
            @click.native.prevent="handleLogin"
          >登录
          </el-button>
          <div class="margin-top flex justify-between">
            <el-link
              :underline="false"
              style="color: #333"
            >建议使用谷歌浏览器</el-link>
            <el-link
              type="primary"
              href="http://jinyouapp.com/download/ChromeStandalone_62.0.3202.94_Setup.exe"
            >点击下载安装包</el-link>
          </div>
          <div class="hat-wrapper">
            <img src="@/assets/custom-theme/images/login-hat-icon.png">
          </div>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    const validateUsername = (rule, value, callback) => {
      if (!value || value.length === 0) {
        callback(new Error('请输入用户名'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      if (value.length < 4) {
        callback(new Error('密码不能少于4位'))
      } else {
        callback()
      }
    }
    return {
      loginForm: {
        phone: '',
        password: ''
      },
      loginRules: {
        phone: [
          { required: true, trigger: 'change', validator: validateUsername }
        ],
        password: [
          { required: true, trigger: 'blur', validator: validatePassword }
        ]
      },
      passwordType: 'password',
      capsTooltip: false,
      loading: false,
      showDialog: false,
      redirect: undefined,
      otherQuery: {}
    }
  },
  watch: {
    $route: {
      handler(route) {
        const query = route.query
        if (query) {
          this.redirect = query.redirect
          this.otherQuery = this.getOtherQuery(query)
        }
      },
      immediate: true
    }
  },
  mounted() {
    if (this.loginForm.phone === '') {
      this.$refs.phone.focus()
    } else if (this.loginForm.password === '') {
      this.$refs.password.focus()
    }
  },
  methods: {
    checkCapslock({ shiftKey, key } = {}) {
      if (key && key.length === 1) {
        if (
          (shiftKey && (key >= 'A' && key <= 'Z')) ||
          (!shiftKey && (key >= 'A' && key <= 'Z'))
        ) {
          this.capsTooltip = true
        } else {
          this.capsTooltip = false
        }
      } else {
        this.capsTooltip = false
      }
      if (key === 'CapsLock' && this.capsTooltip === true) {
        this.capsTooltip = false
      }
    },
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store
            .dispatch('user/login', this.loginForm)
            .then(() => {
              if (this.redirect) {
                this.$router.push({ path: this.redirect, query: this.otherQuery })
              } else {
                this.$router.push({ name: 'VipSchoolInfo' })
              }
              // this.$router.push({ path: '/system/group' })
              this.loading = false
            })
            .catch(() => {
              this.loading = false
            })
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
    getOtherQuery(query) {
      return Object.keys(query).reduce((acc, cur) => {
        if (cur !== 'redirect') {
          acc[cur] = [cur]
        }
        return acc
      }, {})
    }
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$light_gray: #fff;
$cursor: #fff;

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
  }
}
</style>

<style lang="scss" scoped>
$left_bg: #00000000;
$right_bg: #ffffff;
$primary_color: #1890ff;

.login-container {
  min-height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
  .bg-images {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.6;
  }
  .content-wrapper {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 111;
    display: flex;
    .left-wrapper {
      background-color: $left_bg;
      position: relative;
      .logo-wrapper {
        position: absolute;
        top: 5%;
        left: 5%;
        width: 100px;
        height: 125px;
        & img {
          width: 100%;
          height: 100%;
        }
      }
      .tip-wrapper {
        position: absolute;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        display: flex;
        justify-content: center;
        align-items: center;
        & > div {
          width: 100%;
          border-top: rgba($color: #ffffff, $alpha: 0.8) solid 5px;
          border-bottom: rgba($color: #ffffff, $alpha: 0.8) solid 5px;
          background-color: rgba($color: #ffffff, $alpha: 0.5);
          padding: 10px 0;
        }
      }
    }
    .right-wrapper {
      width: 40%;
      display: flex;
      justify-content: center;
      align-items: center;
      .login-form {
        background-color: rgba($color: #ffffff, $alpha: 0.8);
        border-radius: 10px;
        border: rgba($color: #ffffff, $alpha: 0.8) solid 5px;
        position: relative;
        width: 80%;
        height: 60%;
        padding: 40px;
        margin: 0 auto;
        margin-left: 0;
        .hat-wrapper {
          position: absolute;
          top: 0;
          right: 0;
          margin-top: -50px;
          margin-right: -40px;
          width: 100px;
          height: 100px;
          z-index: 999;
          & img {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }
  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $primary_color;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>
