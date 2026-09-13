/*
 * AgentRouter 自动签到 ( Quantumult X )
 *
 * Repository: https://github.com/Thor-jelly/ProxyRule
 */

const BASE_URL = "https://agentrouter.org";
const LOGIN_URL = BASE_URL + "/api/user/login";
const LOG_URL = BASE_URL + "/api/log/self/";
const USER_AGENT =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
  "AppleWebKit/537.36 (KHTML, like Gecko) " +
  "Chrome/138.0.0.0 Safari/537.36";

/**
 * 调试与参数提取函数
 */
function getArguments() {
  const result = { email: "", password: "" };

  console.log("================ [DEBUG START] ================");
  // 1. 打印 QX 传入的全部 $environment 对象结构
  console.log(
    "[DEBUG] 全部环境对象: " +
      JSON.stringify(typeof $environment !== "undefined" ? $environment : {})
  );

  // 2. 检查 $argument 变量的数据类型与内容
  const argType = typeof $argument;
  console.log("[DEBUG] $argument 变量类型: " + argType);

  let rawArg = "";
  if (argType !== "undefined" && $argument) {
    rawArg = String($argument);
    console.log("[DEBUG] 读取到的 $argument 原文: [" + rawArg + "]");
  } else {
    console.log("[DEBUG] $argument 为 undefined 或为空");
  }

  // 3. 备用读取方案：尝试从 $environment.option 提取
  if (!rawArg && typeof $environment !== "undefined" && $environment && $environment.option) {
    if ($environment.option.argument) {
      rawArg = String($environment.option.argument);
      console.log("[DEBUG] 从 $environment.option 提取到的 argument: [" + rawArg + "]");
    }
  }

  if (!rawArg || rawArg.trim() === "") {
    console.log("[DEBUG] 最终可用的参数原文为空，无法提取账号密码");
    console.log("================ [DEBUG END] ================");
    return result;
  }

  // 清理可能误包的外层双引号与首尾空格
  let cleanArg = rawArg.replace(/^argument\s*=\s*/i, "").trim();
  cleanArg = cleanArg.replace(/^["']+|["']+$|\s/g, "");
  console.log("[DEBUG] 清理后的待匹配字符串: [" + cleanArg + "]");

  // 4. 正则提取 email
  const emailMatch = cleanArg.match(/email\s*=\s*([^&"'\s,]+)/i);
  if (emailMatch && emailMatch[1]) {
    try {
      result.email = decodeURIComponent(emailMatch[1].trim());
    } catch (e) {
      result.email = emailMatch[1].trim();
    }
  }

  // 5. 正则提取 password
  const passMatch = cleanArg.match(/password\s*=\s*([^&"'\s,]+)/i);
  if (passMatch && passMatch[1]) {
    try {
      result.password = decodeURIComponent(passMatch[1].trim());
    } catch (e) {
      result.password = passMatch[1].trim();
    }
  }

  console.log(
    "[DEBUG] 最终匹配结果: email=[" +
      result.email +
      "], password=[" +
      (result.password ? "已获取" : "未获取") +
      "]"
  );
  console.log("================ [DEBUG END] ================");

  return result;
}

function getCookie(headers) {
  if (!headers) return "";
  let cookie = headers["Set-Cookie"] || headers["set-cookie"];
  if (!cookie) return "";
  if (Array.isArray(cookie)) {
    return cookie.map((item) => String(item).split(";")[0]).join("; ");
  }
  return String(cookie)
    .split(",")
    .map((item) => item.split(";")[0])
    .join("; ");
}

function login(email, password) {
  return new Promise((resolve) => {
    const request = {
      url: LOGIN_URL,
      method: "POST",
      headers: {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
        Accept: "application/json, text/plain, */*",
        Origin: BASE_URL,
        Referer: BASE_URL + "/login",
      },
      body: JSON.stringify({ username: email, password: password }),
    };

    $task
      .fetch(request)
      .then((response) => {
        if (!response || response.statusCode !== 200) {
          resolve({
            success: false,
            message:
              "登录失败 HTTP " + (response ? response.statusCode : "无响应"),
          });
          return;
        }

        let data;
        try {
          data = JSON.parse(response.body);
        } catch (e) {
          resolve({ success: false, message: "登录接口返回数据异常" });
          return;
        }

        if (!data.success) {
          resolve({ success: false, message: data.message || "登录失败" });
          return;
        }

        const user = data.data || {};
        resolve({
          success: true,
          cookie: getCookie(response.headers),
          uid: user.id,
          username: user.username || user.display_name || email,
          checkedIn: !!user.checked_in,
          quota:
            user.quota !== undefined
              ? user.quota
              : user.remainder_quota !== undefined
              ? user.remainder_quota
              : user.balance,
        });
      })
      .catch((error) =>
        resolve({ success: false, message: "登录请求异常：" + error })
      );
  });
}

function verifyCheckin(cookie, uid) {
  return new Promise((resolve) => {
    if (!uid) {
      resolve({ success: false, message: "没有获取到用户 ID" });
      return;
    }

    const request = {
      url: LOG_URL + "?p=1&page_size=20",
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "application/json, text/plain, */*",
        Cookie: cookie,
        "New-API-User": String(uid),
      },
    };

    $task
      .fetch(request)
      .then((response) => {
        if (!response || response.statusCode !== 200) {
          resolve({
            success: false,
            message:
              "签到日志 HTTP " + (response ? response.statusCode : "无响应"),
          });
          return;
        }

        let data;
        try {
          data = JSON.parse(response.body);
        } catch (e) {
          resolve({ success: false, message: "签到日志返回数据异常" });
          return;
        }

        const items =
          data && data.data && Array.isArray(data.data.items)
            ? data.data.items
            : [];
        let latest = null;

        for (const item of items) {
          const content = item.content || "";
          const type = Number(item.type);
          if (content.indexOf("签到成功") !== -1 || type === 4) {
            const timestamp = Number(item.created_at);
            if (timestamp && (!latest || timestamp > latest.timestamp)) {
              latest = { timestamp, content };
            }
          }
        }

        if (!latest) {
          resolve({ success: false, message: "没有找到签到记录" });
          return;
        }

        const now = Math.floor(Date.now() / 1000);
        const diff = now - latest.timestamp;
        let timeText =
          diff < 60
            ? diff + " 秒前"
            : diff < 3600
            ? Math.floor(diff / 60) + " 分钟前"
            : diff < 86400
            ? Math.floor(diff / 3600) + " 小时前"
            : Math.floor(diff / 86400) + " 天前";

        resolve({ success: true, message: "签到记录：" + timeText });
      })
      .catch((error) =>
        resolve({ success: false, message: "签到日志查询异常：" + error })
      );
  });
}

async function checkin(email, password) {
  console.log("[AgentRouter] 开始签到：" + email);
  const loginResult = await login(email, password);

  if (!loginResult.success) {
    return { success: false, message: loginResult.message };
  }

  console.log("[AgentRouter] 登录成功：" + email);

  if (loginResult.checkedIn) {
    const verifyResult = await verifyCheckin(loginResult.cookie, loginResult.uid);
    return {
      success: true,
      message: "今日已签到，" + verifyResult.message,
      quota: loginResult.quota,
    };
  }

  await new Promise((resolve) => setTimeout(resolve, 1000));
  const verifyResult = await verifyCheckin(loginResult.cookie, loginResult.uid);

  return {
    success: verifyResult.success,
    message: verifyResult.success
      ? "签到成功，" + verifyResult.message
      : "签到状态：" + verifyResult.message,
    quota: loginResult.quota,
  };
}

async function main() {
  const args = getArguments();
  const email = args.email || "";
  const password = args.password || "";

  if (!email || !password) {
    $notify(
      "AgentRouter 自动签到",
      "",
      "❌ 未配置账号\n\n请在 QX 配置中加上 argument：\nargument=\"email=你的邮箱&password=你的密码\""
    );
    $done();
    return;
  }

  const result = await checkin(email, password);
  let message = (result.success ? "✅ " : "❌ ") + result.message;

  if (result.quota !== undefined && result.quota !== null) {
    message += "\n额度：" + result.quota;
  }

  $notify("AgentRouter 自动签到", "", message);
  console.log("[AgentRouter] " + message);
  $done();
}

main();