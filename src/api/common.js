/*
 * @Descripttion: 描述
 * @version: 版本
 * @Author: lf
 * @Date: 2020-06-08 13:55:11
 * @LastEditors: lf
 * @LastEditTime: 2020-06-08 15:33:02
 */
import request from '@/utils/request'

export const HTTP_GET = 'GET'

export const HTTP_POST = 'POST'

export function http({ url, methods = HTTP_POST, data = {}, withRoleId = true, withUserId = true, contentType = 'application/x-www-form-urlencoded;charset=UTF-8', responseType = '' }) {
  if (withRoleId && typeof data === 'object' && !data.hasOwnProperty('roleId')) {
    data.roleId = localStorage.getItem('roleId')
  }
  if (withUserId && typeof data === 'object' && !data.hasOwnProperty('userId')) {
    data.userId = localStorage.getItem('userId')
  }
  if (methods === HTTP_POST) {
    return request({
      url,
      method: HTTP_POST,
      data,
      headers: {
        'Content-Type': contentType
      }
    })
  } else {
    return request({
      url,
      method: HTTP_GET,
      params: data,
      responseType,
      headers: {
        'Content-Type': contentType
      }
    })
  }
}

export function blobToFile(data, fileName = new Date().toLocaleTimeString(), type = 'application/zip;charset=utf-8') {
  const blob = new Blob([data], { type })
  const objectUrl = URL.createObjectURL(blob)
  const link = document.createElement('a')
  const fname = fileName // 下载文件的名字
  link.href = objectUrl
  link.setAttribute('download', fname)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function blobToExecl(data, fileName = new Date().toLocaleTimeString()) {
  // const blob = new Blob([data], {
  //   type:
  //     'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8'
  // })
  // const objectUrl = URL.createObjectURL(blob)
  // const link = document.createElement('a')
  // const fname = fileName // 下载文件的名字
  // link.href = objectUrl
  // link.setAttribute('download', fname)
  // document.body.appendChild(link)
  // link.click()
  // document.body.removeChild(link)
  blobToFile(data, fileName, 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8')
}
