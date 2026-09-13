/*
 * AgentRouter 自动签到
 * Quantumult X Script
 *
 * GitHub：https://github.com/Thor-jelly/ProxyRule
 *
 * 功能：
 * 1. AgentRouter 自动签到
 * 2. 自动查询签到状态
 * 3. 查询签到日志
 * 4. 获取当前额度
 * 5. 支持 Quantumult X
 * 6. 支持多账号
 *
 */

const BASE_URL = "https://agentrouter.org";

const LOGIN_URL =  BASE_URL + "/api/user/login";

const LOG_URL =  BASE_URL + "/api/log/self/";

const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/138.0.0.0 Safari/537.36";


/**
 * 获取 QX argument
 *
 * 格式：
 *
 * email=xxx&password=xxx
 */
function getArguments() {

  const result = {};

  if (
    typeof $argument === "undefined" ||
    !$argument
  ) {
    return result;
  }

  const params =
    String($argument).split("&");

  for (const item of params) {

    const index =
      item.indexOf("=");

    if (index === -1) {
      continue;
    }

    const key =
      item.substring(0, index);

    const value =
      item.substring(index + 1);

    result[key] =
      decodeURIComponent(value);
  }

  return result;
}


/**
 * 获取 Cookie
 */
function getCookie(headers) {

  if (!headers) {
    return "";
  }

  let cookie =
    headers["Set-Cookie"] ||
    headers["set-cookie"];

  if (!cookie) {
    return "";
  }

  if (Array.isArray(cookie)) {

    return cookie
      .map(item =>
        String(item).split(";")[0]
      )
      .join("; ");

  }

  return String(cookie)
    .split(",")
    .map(item =>
      item.split(";")[0]
    )
    .join("; ");
}


/**
 * 登录 AgentRouter
 */
function login(email, password) {

  return new Promise(resolve => {

    const request = {

      url: LOGIN_URL,

      method: "POST",

      headers: {

        "User-Agent":
          USER_AGENT,

        "Content-Type":
          "application/json",

        "Accept":
          "application/json, text/plain, */*",

        "Origin":
          BASE_URL,

        "Referer":
          BASE_URL + "/login"

      },

      body: JSON.stringify({

        username: email,

        password: password

      })

    };


    $task.fetch(request)

      .then(response => {

        if (!response) {

          resolve({

            success: false,

            message:
              "登录请求无响应"

          });

          return;
        }


        if (
          response.statusCode !== 200
        ) {

          resolve({

            success: false,

            message:
              "登录失败 HTTP " +
              response.statusCode

          });

          return;
        }


        let data;

        try {

          data =
            JSON.parse(
              response.body
            );

        } catch (error) {

          resolve({

            success: false,

            message:
              "登录接口返回数据异常"

          });

          return;
        }


        if (!data.success) {

          resolve({

            success: false,

            message:
              data.message ||
              "登录失败"

          });

          return;
        }


        const user =
          data.data || {};


        resolve({

          success: true,

          cookie:
            getCookie(
              response.headers
            ),

          uid:
            user.id,

          username:
            user.username ||
            user.display_name ||
            email,

          checkedIn:
            !!user.checked_in,

          quota:
            user.quota !== undefined
              ? user.quota
              : (
                  user.remainder_quota !== undefined
                    ? user.remainder_quota
                    : user.balance
                )

        });

      })

      .catch(error => {

        resolve({

          success: false,

          message:
            "登录请求异常：" +
            error

        });

      });

  });

}


/**
 * 查询签到日志
 */
function verifyCheckin(
  cookie,
  uid
) {

  return new Promise(resolve => {

    if (!uid) {

      resolve({

        success: false,

        message:
          "没有获取到用户 ID"

      });

      return;
    }


    const request = {

      url:
        LOG_URL +
        "?p=1&page_size=20",

      method: "GET",

      headers: {

        "User-Agent":
          USER_AGENT,

        "Accept":
          "application/json, text/plain, */*",

        "Cookie":
          cookie,

        "New-API-User":
          String(uid)

      }

    };


    $task.fetch(request)

      .then(response => {

        if (!response) {

          resolve({

            success: false,

            message:
              "签到日志请求无响应"

          });

          return;
        }


        if (
          response.statusCode !== 200
        ) {

          resolve({

            success: false,

            message:
              "签到日志 HTTP " +
              response.statusCode

          });

          return;
        }


        let data;

        try {

          data =
            JSON.parse(
              response.body
            );

        } catch (error) {

          resolve({

            success: false,

            message:
              "签到日志返回数据异常"

          });

          return;
        }


        const items =
          data &&
          data.data &&
          Array.isArray(
            data.data.items
          )
            ? data.data.items
            : [];


        let latest = null;


        for (const item of items) {

          const content =
            item.content || "";

          const type =
            Number(item.type);


          if (
            content.indexOf(
              "签到成功"
            ) !== -1 ||
            type === 4
          ) {

            const timestamp =
              Number(
                item.created_at
              );


            if (
              timestamp &&
              (
                !latest ||
                timestamp >
                latest.timestamp
              )
            ) {

              latest = {

                timestamp:
                  timestamp,

                content:
                  content

              };

            }

          }

        }


        if (!latest) {

          resolve({

            success: false,

            message:
              "没有找到签到记录"

          });

          return;
        }


        const now =
          Math.floor(
            Date.now() / 1000
          );


        const diff =
          now -
          latest.timestamp;


        let timeText;


        if (diff < 60) {

          timeText =
            diff + " 秒前";

        } else if (
          diff < 3600
        ) {

          timeText =
            Math.floor(
              diff / 60
            ) +
            " 分钟前";

        } else if (
          diff < 86400
        ) {

          timeText =
            Math.floor(
              diff / 3600
            ) +
            " 小时前";

        } else {

          timeText =
            Math.floor(
              diff / 86400
            ) +
            " 天前";

        }


        resolve({

          success: true,

          message:
            "签到记录：" +
            timeText

        });

      })

      .catch(error => {

        resolve({

          success: false,

          message:
            "签到日志查询异常：" +
            error

        });

      });

  });

}


/**
 * 单账号签到
 */
async function checkin(
  email,
  password
) {

  console.log(
    "[AgentRouter] 开始签到：" +
    email
  );


  const loginResult =
    await login(
      email,
      password
    );


  if (!loginResult.success) {

    return {

      success: false,

      message:
        loginResult.message

    };

  }


  console.log(
    "[AgentRouter] 登录成功：" +
    email
  );


  /*
   * 服务端已经返回已签到
   */
  if (loginResult.checkedIn) {

    const verifyResult =
      await verifyCheckin(
        loginResult.cookie,
        loginResult.uid
      );


    return {

      success: true,

      message:
        "今日已签到，" +
        verifyResult.message,

      quota:
        loginResult.quota

    };

  }


  /*
   * checked_in=false
   *
   * 等待 1 秒后查询日志，
   * 确认本次登录是否触发签到。
   */

  await new Promise(
    resolve =>
      setTimeout(
        resolve,
        1000
      )
  );


  const verifyResult =
    await verifyCheckin(
      loginResult.cookie,
      loginResult.uid
    );


  return {

    success:
      verifyResult.success,

    message:
      verifyResult.success
        ? "签到成功，" +
          verifyResult.message
        : "签到状态：" +
          verifyResult.message,

    quota:
      loginResult.quota

  };

}


/**
 * 主程序
 */
async function main() {

  const args =
    getArguments();


  const email =
    args.email || "";

  const password =
    args.password || "";


  /*
   * 检查账号
   */
  if (
    !email ||
    !password
  ) {

    $notify(
      "AgentRouter 自动签到",
      "",
      "❌ 未配置账号\n\n" +
      "请在 QX task_local 中配置：\n" +
      "argument=email=邮箱&password=密码"
    );

    $done();

    return;
  }


  /*
   * 执行签到
   */
  const result =
    await checkin(
      email,
      password
    );


  let message;


  if (result.success) {

    message =
      "✅ " +
      result.message;

  } else {

    message =
      "❌ " +
      result.message;

  }


  /*
   * 显示额度
   */
  if (
    result.quota !== undefined &&
    result.quota !== null
  ) {

    message +=
      "\n额度：" +
      result.quota;

  }


  /*
   * QX 通知
   */
  $notify(
    "AgentRouter 自动签到",
    "",
    message
  );


  console.log(
    "[AgentRouter] " +
    message
  );


  $done();

}


main();