/*
 * AgentRouter 自动签到脚本
 * 
 * 使用说明：在下方填入你的账号和密码，然后保存即可。
 */

// ==================== [用户配置区] ====================
const USER_EMAIL = "";      // 在双引号内填入你的登录邮箱，例如: "user@example.com"
const USER_PASSWORD = "";   // 在双引号内填入你的登录密码，例如: "123456"
// ======================================================

const BASE_URL = "https://agentrouter.org";
const LOGIN_URL = BASE_URL + "/api/user/login";
const LOG_URL = BASE_URL + "/api/log/self/";
const USER_AGENT = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/138.0.0.0 Safari/537.36";

function getCookie(headers) {
  if (!headers) return "";
  let cookie = headers["Set-Cookie"] || headers["set-cookie"];
  if (!cookie) return "";
  if (Array.isArray(cookie)) {
    return cookie.map(item => String(item).split(";")[0]).join("; ");
  }
  return String(cookie).split(",").map(item => item.split(";")[0]).join("; ");
}

function login(email, password) {
  return new Promise((resolve) => {
    const request = {
      url: LOGIN_URL,
      method: "POST",
      headers: {
        "User-Agent": USER_AGENT,
        "Content-Type": "application/json",
        "Accept": "application/json, text/plain, */*",
        "Origin": BASE_URL,
        "Referer": BASE_URL + "/login"
      },
      body: JSON.stringify({ username: email, password: password })
    };

    $task.fetch(request).then(response => {
      if (!response || response.statusCode !== 200) {
        resolve({ success: false, message: "登录失败 HTTP " + (response ? response.statusCode : "无响应") });
        return;
      }
      let data;
      try { data = JSON.parse(response.body); } catch (e) {
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
        quota: user.quota !== undefined ? user.quota : user.remainder_quota
      });
    }).catch(error => resolve({ success: false, message: "登录请求异常：" + error }));
  });
}

function verifyCheckin(cookie, uid) {
  return new Promise((resolve) => {
    const request = {
      url: LOG_URL + "?p=1&page_size=20",
      method: "GET",
      headers: {
        "User-Agent": USER_AGENT,
        "Accept": "application/json, text/plain, */*",
        "Cookie": cookie,
        "New-API-User": String(uid)
      }
    };

    $task.fetch(request).then(response => {
      if (!response || response.statusCode !== 200) {
        resolve({ success: false, message: "查询失败 HTTP " + (response ? response.statusCode : "无响应") });
        return;
      }
      let data;
      try { data = JSON.parse(response.body); } catch (e) {
        resolve({ success: false, message: "日志返回异常" });
        return;
      }
      const items = (data && data.data && Array.isArray(data.data.items)) ? data.data.items : [];
      let latest = null;
      for (const item of items) {
        if ((item.content || "").indexOf("签到成功") !== -1 || Number(item.type) === 4) {
          const timestamp = Number(item.created_at);
          if (timestamp && (!latest || timestamp > latest.timestamp)) {
            latest = { timestamp, content: item.content };
          }
        }
      }
      if (!latest) {
        resolve({ success: false, message: "未查到签到记录" });
        return;
      }
      resolve({ success: true, message: "签到成功/今日已签" });
    }).catch(error => resolve({ success: false, message: "请求异常：" + error }));
  });
}

async function main() {
  if (!USER_EMAIL || !USER_PASSWORD) {
    $notify("AgentRouter 签到", "❌ 未配置账号密码", "请在 QX 脚本编辑界面中填写 USER_EMAIL 和 USER_PASSWORD");
    $done();
    return;
  }

  const loginRes = await login(USER_EMAIL, USER_PASSWORD);
  if (!loginRes.success) {
    $notify("AgentRouter 签到", "❌ 登录失败", loginRes.message);
    $done();
    return;
  }

  const verifyRes = await verifyCheckin(loginRes.cookie, loginRes.uid);
  let msg = (verifyRes.success ? "✅ " : "⚠️ ") + verifyRes.message;
  if (loginRes.quota !== undefined) {
    msg += "\n当前额度: " + loginRes.quota;
  }

  $notify("AgentRouter 签到", "", msg);
  $done();
}

main();