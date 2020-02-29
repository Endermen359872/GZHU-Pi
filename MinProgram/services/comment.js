/**
 * 留言服务
 *@class commentService
 *@constructor
 */
class CommentService {
  /**
   * 构造函数
   */
  constructor() { }

  create(data) {

    wx.$ajax({
      url: wx.$param.server["prest"] + "/postgres/public/comment",
      method: "post",
      showErr: false,
      data: data,
      header: {
        "content-type": "application/json"
      }
    })
      .then(res => {
        console.log("auth", res)
        if (res.data.open_id == openid) {
          wx.setStorage({
            key: 'gzhupi_user',
            data: res.data,
          })
        }
      })
  }

  // getLevelList(successCallback) {
  //   db.collection('level')
  //     .get()
  //     .then(res => {
  //       console.log(res)
  //       //回调函数处理数据查询结果
  //       typeof successCallback == "function" && successCallback(res.data)
  //     })
  //     .catch(err => {
  //       console.log(err) //跳转出错页面
  //       wx.redirectTo({
  //         url: '../../errorpage/errorpage'
  //       })
  //       console.error(err)
  //     })
  // }

  update_create() {

    wx.BaaS.auth.getCurrentUser().then(user => {
      console.log(user)
      let stu_id = wx.getStorageSync("student_info").student_id
      if (stu_id == undefined || stu_id == null) {
        stu_id = ""
      }
      let form = {
        stu_id: stu_id,
        minapp_id: user.user_id,
        open_id: user.openid,
        union_id: user.unionid,
        avatar: user.avatar,
        nickname: user.nickname,
        city: user.city,
        country: user.country,
        gender: user.gender,
        language: user.language,
        phone: user._phone,
      }
      wx.$ajax({
        url: wx.$param.server["prest"] + "/postgres/public/t_user",
        method: "put",
        data: form,
        showErr: false,
        header: {
          "content-type": "application/json"
        }
      })
        .then(res => {
          console.log(res)
          if (res.data.rows_affected == 0) {
            wx.$ajax({
              url: wx.$param.server["prest"] + "/postgres/public/t_user",
              method: "post",
              data: form,
              checkStatus: false,
              header: {
                "content-type": "application/json"
              }
            })
              .then(res => {
                console.log(res)
              })
          }
        })

    }).catch(err => {
      if (err.code === 604) {
        console.log('用户未登录')
      }
    })


  }


}

export default UserService