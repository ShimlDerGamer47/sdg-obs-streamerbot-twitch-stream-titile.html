document.addEventListener("DOMContentLoaded", () => {
  const html = document.documentElement;

  const fontFamilyVar = "--font-family-var";
  const robotoBold = getComputedStyle(html)
    .getPropertyValue(fontFamilyVar)
    .trim();

  const rootBorderVar = "--border-var";
  const borderVar = getComputedStyle(html)
    .getPropertyValue(rootBorderVar)
    .trim();

  const rootBackgroundVar = "--background-var";
  const backgroundVar = getComputedStyle(html)
    .getPropertyValue(rootBackgroundVar)
    .trim();

  const rootNoneVar = "--none-var";
  const noneVar = getComputedStyle(html).getPropertyValue(rootNoneVar).trim();

  const rootDefaultVar = "--default-var";
  const defaultVar = getComputedStyle(html)
    .getPropertyValue(rootDefaultVar)
    .trim();

  let streamerbotHost = "localhost";
  let streamerbotPort = "8080";
  let streamerbotPassword = "";

  const params = new URLSearchParams(window.location.search);
  let twitchTitleStream = params.get("twitchTitleStream");
  const targetUserProfileImageId = params.get("targetUserProfileImageId");

  const body = document.body;

  Object.assign(body.style, {
    fontFamily: robotoBold,
    background: backgroundVar,
    WebkitUserSelect: noneVar,
    userSelect: noneVar,
    cursor: defaultVar,
    pointerEvents: noneVar,
  });

  const style = document.querySelector("style");

  const get = (id) => document.getElementById(id);

  const mainDiv = get("mainContainerId");
  const twitchStreamTitleDiv = get("streamTitleContainerId");
  const twitchStreamTitle = get("streamTitleId");

  twitchStreamTitle.innerText = "";

  mainDiv.hidden = true;
  mainDiv.style.visibility = "hidden";
  mainDiv.style.opacity = 0;

  twitchStreamTitleDiv.hidden = true;
  twitchStreamTitleDiv.style.visibility = "hidden";
  twitchStreamTitleDiv.style.opacity = 0;

  twitchStreamTitle.hidden = true;
  twitchStreamTitle.style.visibility = "hidden";
  twitchStreamTitle.style.opacity = 0;

  const exampleAspectRatio = 300;
  const timeNumber = 2000;

  const randomStyleToken = () => {
    const randomColor = `#${Math.floor(Math.random() * 0xffffff)
      .toString(16)
      .padStart(6, "0")}`;

    const cssStyle = `
        .underline-class {
          position: relative;
           transition: opacity 420ms cubic-bezier(0.2, 0.9, 0.2, 1),
           transform 420ms cubic-bezier(0.2, 0.9, 0.2, 1);
        }

        .underline-class::after {
          content: "";
          background-color: ${randomColor};
          position: absolute;
          left: 0%;
          bottom: 0%;
          width: 100%;
          height: 3px;
          transform: scale(1);
          transform-origin: center;
          -webkit-user-select: var(--none-var);
          user-select: var(--none-var);
          cursor: var(--default-var);
          pointer-events: var(--none-var);
          transition: background ${timeNumber}ms ease-in-out;
        }
    `;

    style.innerHTML = cssStyle;

    if (!twitchStreamTitle.classList.contains("underline-class")) {
      twitchStreamTitle.classList.add("underline-class");
    }
  };
  setInterval(randomStyleToken, timeNumber);
  randomStyleToken();

  function twitchStreamTitleToken() {
    const twitchProfileImageUrl = targetUserProfileImageId
      ? `https://static-cdn.jtvnw.net/jtv_user_pictures/${targetUserProfileImageId}-profile_image-${exampleAspectRatio}x${exampleAspectRatio}.png`
      : null;

    twitchStreamTitle.textContent = "";
    if (twitchTitleStream) {
      twitchStreamTitle.textContent = "Stream Titel:";
      twitchStreamTitle.appendChild(document.createElement("br"));
      twitchStreamTitle.appendChild(document.createTextNode(twitchTitleStream));
    }

    if (twitchProfileImageUrl) {
      twitchStreamTitle.style.backgroundImage = `url("${twitchProfileImageUrl}")`;
      twitchStreamTitle.style.backgroundSize = "cover";
      twitchStreamTitle.style.backgroundPosition = "center";
      twitchStreamTitle.style.backgroundRepeat = "no-repeat";
    } else {
      twitchStreamTitle.style.backgroundImage = "";
    }

    const shouldShow =
      Boolean(twitchTitleStream) || Boolean(twitchProfileImageUrl);

    toggleVisibility(mainDiv, shouldShow);
    toggleVisibility(twitchStreamTitleDiv, shouldShow);
    toggleVisibility(twitchStreamTitle, shouldShow);

    adjustFontSize();
  }

  function toggleVisibility(element, visible) {
    if (!element) return;
    if (visible) {
      element.hidden = false;
      element.style.visibility = "visible";
      void element.offsetWidth;
      element.style.transition = "opacity 420ms cubic-bezier(0.2,0.9,0.2,1)";
      element.style.opacity = 1;
    } else {
      element.style.opacity = 0;
      setTimeout(() => {
        element.hidden = true;
        element.style.visibility = "hidden";
      }, 450);
    }
  }

  function elementSecurityToken() {
    const elementArray = [mainDiv, twitchStreamTitleDiv];

    const eventArray = ["copy", "dragstart", "keydown", "select"];

    const dataStyle = {
      fontFamily: robotoBold,
      background: backgroundVar,
      border: borderVar,
      WebkitUserSelect: noneVar,
      userSelect: noneVar,
      cursor: defaultVar,
      pointerEvents: noneVar,
    };

    elementArray.forEach((element) => {
      if (!element) return;

      eventArray.forEach((event) => {
        if (!event) return;
        element.addEventListener(event, (e) => e.preventDefault());
      });

      Object.assign(element.style, dataStyle);
    });

    eventArray.forEach((event) => {
      if (!event) return;
      twitchStreamTitle.addEventListener(event, (e) => e.preventDefault());
    });

    Object.assign(twitchStreamTitle.style, {
      fontFamily: robotoBold,
      WebkitUserSelect: noneVar,
      userSelect: noneVar,
      cursor: defaultVar,
      pointerEvents: noneVar,
    });
  }
  elementSecurityToken();

  function parsePx(value) {
    if (!value) return NaN;
    return parseFloat(value.replace("px", "").trim());
  }

  function getInitialFontSize() {
    const cs = getComputedStyle(twitchStreamTitle);
    const fs = cs.getPropertyValue("font-size");
    const parsed = parsePx(fs);
    return isFinite(parsed) ? parsed : 60;
  }

  const MIN_FONT_SIZE = 8;
  const MAX_FONT_SIZE = getInitialFontSize();

  function adjustFontSize() {
    if (!twitchStreamTitle || !twitchStreamTitleDiv) return;
    const wasHidden = twitchStreamTitle.hidden;
    if (wasHidden) {
      twitchStreamTitle.style.visibility = "hidden";
      twitchStreamTitle.style.display = "block";
      twitchStreamTitle.style.opacity = 0;
    }

    const container = twitchStreamTitleDiv;
    const containerStyle = getComputedStyle(container);
    const padTop = parsePx(containerStyle.paddingTop) || 0;
    const padBottom = parsePx(containerStyle.paddingBottom) || 0;
    const padLeft = parsePx(containerStyle.paddingLeft) || 0;
    const padRight = parsePx(containerStyle.paddingRight) || 0;

    const availableWidth = Math.max(
      10,
      container.clientWidth - (padLeft + padRight) - 6
    );
    const availableHeight = Math.max(
      10,
      container.clientHeight - (padTop + padBottom) - 4
    );

    let fontSize = MAX_FONT_SIZE;
    twitchStreamTitle.style.fontSize = fontSize + "px";
    twitchStreamTitle.style.lineHeight = "1";

    while (
      (twitchStreamTitle.scrollWidth > availableWidth ||
        twitchStreamTitle.scrollHeight > availableHeight) &&
      fontSize > MIN_FONT_SIZE
    ) {
      fontSize -= 1;
      twitchStreamTitle.style.fontSize = fontSize + "px";
    }

    while (
      fontSize < MAX_FONT_SIZE &&
      twitchStreamTitle.scrollWidth <= availableWidth &&
      twitchStreamTitle.scrollHeight <= availableHeight
    ) {
      twitchStreamTitle.style.fontSize = fontSize + 1 + "px";
      if (
        twitchStreamTitle.scrollWidth <= availableWidth &&
        twitchStreamTitle.scrollHeight <= availableHeight
      ) {
        fontSize += 1;
      } else {
        twitchStreamTitle.style.fontSize = fontSize + "px";
        break;
      }
    }

    if (wasHidden) {
      twitchStreamTitle.style.display = "";
      twitchStreamTitle.style.visibility = "hidden";
      twitchStreamTitle.style.opacity = 0;
    }
  }

  window.addEventListener("resize", () => {
    adjustFontSize();
  });

  const mo = new MutationObserver(() => {
    clearTimeout(mo._t);
    mo._t = setTimeout(() => adjustFontSize(), 50);
  });
  if (twitchStreamTitle) {
    mo.observe(twitchStreamTitle, {
      childList: true,
      subtree: true,
      characterData: true,
    });
  }

  function initStreamerBotConnection({
    host = streamerbotHost,
    port = streamerbotPort,
    password = streamerbotPassword,
  } = {}) {
    let client = null;
    let ws = null;

    function handleIncoming(raw) {
      let data = raw;
      if (typeof raw === "string") {
        try {
          data = JSON.parse(raw);
        } catch (e) {
          return;
        }
      }

      if (data && typeof data === "object") {
        if ("key" in data && "value" in data) {
          const k = String(data.key);
          const v = data.value;
          if (k === "twitchTitleStream") {
            twitchTitleStream = v == null ? "" : String(v);
            twitchStreamTitleToken();
          } else if (k === "targetUserProfileImageId") {
            targetUserProfileImageId = v == null ? "" : String(v);
            twitchStreamTitleToken();
          }
          return;
        }

        if (data.updates && typeof data.updates === "object") {
          if (data.updates.twitchTitleStream !== undefined) {
            twitchTitleStream = String(data.updates.twitchTitleStream || "");
          }
          if (data.updates.targetUserProfileImageId !== undefined) {
            targetUserProfileImageId = String(
              data.updates.targetUserProfileImageId || ""
            );
          }
          twitchStreamTitleToken();
          return;
        }

        if (data.payload && typeof data.payload === "object") {
          if (data.payload.twitchTitleStream !== undefined) {
            twitchTitleStream = String(data.payload.twitchTitleStream || "");
          }
          if (data.payload.targetUserProfileImageId !== undefined) {
            targetUserProfileImageId = String(
              data.payload.targetUserProfileImageId || ""
            );
          }
          twitchStreamTitleToken();
          return;
        }
      }
    }

    const tryStreamerbotClient = () => {
      try {
        if (window.StreamerbotClient) {
          client = new StreamerbotClient({
            host,
            port: Number(port),
            password: password || undefined,
          });

          if (typeof client.on === "function") {
            client.on("open", () => console.log("StreamerbotClient: open"));
            client.on("close", () => console.log("StreamerbotClient: close"));
            client.on("error", (e) =>
              console.warn("StreamerbotClient error:", e)
            );
            client.on("message", (m) => handleIncoming(m));
          }

          if (typeof client.connect === "function") client.connect();
          if (typeof client.open === "function") client.open();

          return true;
        }
      } catch (e) {
        console.warn("StreamerbotClient init failed:", e);
      }
      return false;
    };

    const tryWebSocket = () => {
      try {
        const protocol = location.protocol === "https:" ? "wss:" : "ws:";
        const wsUrl = `${protocol}//${host}:${port}`;
        ws = new WebSocket(wsUrl);

        ws.addEventListener("open", () => {
          console.log("WebSocket -> connected to Streamer.bot at", wsUrl);
          if (password) {
            try {
              ws.send(JSON.stringify({ type: "auth", password }));
            } catch (e) {}
          }
        });

        ws.addEventListener("message", (evt) => {
          handleIncoming(evt.data);
        });

        ws.addEventListener("close", () => {
          console.log("WebSocket closed.");
        });

        ws.addEventListener("error", (err) => {
          console.warn("WebSocket error:", err);
        });

        return true;
      } catch (e) {
        console.warn("WebSocket init failed:", e);
      }
      return false;
    };

    if (!tryStreamerbotClient()) {
      tryWebSocket();
    }

    return {
      send: (obj) => {
        const payload = typeof obj === "string" ? obj : JSON.stringify(obj);
        try {
          if (client && typeof client.send === "function") client.send(payload);
          else if (ws && ws.readyState === WebSocket.OPEN) ws.send(payload);
        } catch (e) {
          console.warn("Send failed:", e);
        }
      },
      reconnect: (newCfg = {}) => {
        try {
          if (ws && ws.close) ws.close();
        } catch (e) {}
        try {
          if (client && typeof client.close === "function") client.close();
        } catch (e) {}
        if (newCfg.host) streamerbotHost = newCfg.host;
        if (newCfg.port) streamerbotPort = newCfg.port;
        if (newCfg.password !== undefined)
          streamerbotPassword = newCfg.password;
        return initStreamerBotConnection({
          host: streamerbotHost,
          port: streamerbotPort,
          password: streamerbotPassword,
        });
      },
    };
  }

  const sb = initStreamerBotConnection({
    host: streamerbotHost,
    port: streamerbotPort,
    password: streamerbotPassword,
  });

  twitchStreamTitleToken();

  window.updateTwitchTitleFromParams = function (newParams) {
    if (newParams && typeof newParams === "object") {
      if (newParams.twitchTitleStream !== undefined) {
        twitchTitleStream = newParams.twitchTitleStream;
      }
      if (newParams.targetUserProfileImageId !== undefined) {
        targetUserProfileImageId = newParams.targetUserProfileImageId;
      }
    }
    twitchStreamTitleToken();
  };

  window.reconnectStreamerBot = function (cfg = {}) {
    if (sb && typeof sb.reconnect === "function") {
      return sb.reconnect(cfg);
    } else {
      return initStreamerBotConnection(cfg);
    }
  };
});
