
console.log('script.js loaded');


function copyEventUserFilePath() {
  const input = document.getElementById("event-user-file-path");
  navigator.clipboard.writeText(input.value)
    .then(() => {
      input.classList.add("border-success");
      setTimeout(() => input.classList.remove("border-success"), 1000);
    })
    .catch(err => {
      console.error("Не удалось скопировать путь:", err);
    });
}

document.addEventListener("DOMContentLoaded", function () {
  const basePath = window.location.origin + "/interface/";
  const inputs = [
    { id: "raid-user-file-path", path: "raid_user_display.html" },
    { id: "reward-user-file-path", path: "reward_user_display.html" },
    { id: "clip-user-file-path", path: "clip_user_display.html" },
    { id: "event-user-file-path", path: "event_user_display.html" },
    { id: "subscription-user-file-path", path: "subscription_user_display.html" },
    { id: "portal-user-file-path", path: "portal_user_display.html" },
    { id: "follow-user-file-path", path: "follow_user_display.html" },
    { id: "raid-count-file-path", path: "raid_count_display.html" },
    { id: "like-count-file-path", path: "like_count_display.html" }
  ];

  inputs.forEach(({ id, path }) => {
    const input = document.getElementById(id);
    if (input) {
      input.value = basePath + path;
      input.addEventListener("click", function () {
        input.select();
        document.execCommand("copy");
        console.log("Путь скопирован:", input.value);
      });
    }
  });
});

// ======= TTS: SUB =======
function onSubTtsToggleChange() {
  pywebview.api.setSubTtsEnabled(document.getElementById("sub-tts-toggle").checked);
}
function onSubTtsTextChange() {
  pywebview.api.setSubTtsText(document.getElementById("sub-tts-text").value);
}
function updateSubTtsSettings(enabled, text) {
  document.getElementById("sub-tts-toggle").checked = !!enabled;
  document.getElementById("sub-tts-text").value = text || "";
}

// ======= TTS: EFFECT SUB =======
function onEffectSubTtsToggleChange() {
  pywebview.api.setEffectSubTtsEnabled(document.getElementById("effect-sub-tts-toggle").checked);
}
function onEffectSubTtsTextChange() {
  pywebview.api.setEffectSubTtsText(document.getElementById("effect-sub-tts-text").value);
}
function updateEffectSubTtsSettings(enabled, text) {
  document.getElementById("effect-sub-tts-toggle").checked = !!enabled;
  document.getElementById("effect-sub-tts-text").value = text || "";
}

// ======= TTS: PORTAL =======
function onPortalTtsToggleChange() {
  pywebview.api.setPortalTtsEnabled(document.getElementById("portal-tts-toggle").checked);
}
function onPortalTtsTextChange() {
  pywebview.api.setPortalTtsText(document.getElementById("portal-tts-text").value);
}
function updatePortalTtsSettings(enabled, text) {
  document.getElementById("portal-tts-toggle").checked = !!enabled;
  document.getElementById("portal-tts-text").value = text || "";
}

// ======= TTS: RAID =======
function onRaidTtsToggleChange() {
  pywebview.api.setRaidTtsEnabled(document.getElementById("raid-tts-toggle").checked);
}
function onRaidTtsTextChange() {
  pywebview.api.setRaidTtsText(document.getElementById("raid-tts-text").value);
}
function updateRaidTtsSettings(enabled, text) {
  document.getElementById("raid-tts-toggle").checked = !!enabled;
  document.getElementById("raid-tts-text").value = text || "";
}


  function uploadAudioGeneric(input, apiSetMethod, fileSpanId) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (e) {
      const base64Data = e.target.result.split(',')[1];
      pywebview.api.save_sub_audio(file.name, base64Data).then(() => {
        pywebview.api[apiSetMethod](file.name).then(() => {
          document.getElementById(fileSpanId).innerText = file.name;
        });
      });
    };
    reader.readAsDataURL(file);
  }

  // ======= Отслеживает канал =======
  function onSubAudioToggleChange() {
    pywebview.api.setSubscriptionSoundEnabled(document.getElementById("sub-audio-toggle").checked);
  }
  function uploadSubAudio(input) {
    uploadAudioGeneric(input, "setSubscriptionSound", "sub-audio-filename");
  }
  function updateSubscriptionSound(fileName, enabled) {
    document.getElementById("sub-audio-filename").innerText = fileName || "Файл не выбран";
    document.getElementById("sub-audio-toggle").checked = !!enabled;
  }

  // ======= Оформил подписку =======
  function onEffectSubAudioToggleChange() {
    pywebview.api.setEffectSubscriptionEnabled(document.getElementById("effect-sub-audio-toggle").checked);
  }
  function uploadEffectSubAudio(input) {
    uploadAudioGeneric(input, "setEffectSubscriptionSound", "effect-sub-audio-filename");
  }
  function updateEffectSubscriptionSound(fileName, enabled) {
    document.getElementById("effect-sub-audio-filename").innerText = fileName || "Файл не выбран";
    document.getElementById("effect-sub-audio-toggle").checked = !!enabled;
  }

  // ======= Из портала =======
  function onPortalAudioToggleChange() {
    pywebview.api.setPortalEnabled(document.getElementById("portal-audio-toggle").checked);
  }
  function uploadPortalAudio(input) {
    uploadAudioGeneric(input, "setPortalSound", "portal-audio-filename");
  }
  function updatePortalSound(fileName, enabled) {
    document.getElementById("portal-audio-filename").innerText = fileName || "Файл не выбран";
    document.getElementById("portal-audio-toggle").checked = !!enabled;
  }

  // ======= Рейд =======
  function onRaidAudioToggleChange() {
    pywebview.api.setRaidEnabled(document.getElementById("raid-audio-toggle").checked);
  }
  function uploadRaidAudio(input) {
    uploadAudioGeneric(input, "setRaidSound", "raid-audio-filename");
  }
  function updateRaidSound(fileName, enabled) {
    document.getElementById("raid-audio-filename").innerText = fileName || "Файл не выбран";
    document.getElementById("raid-audio-toggle").checked = !!enabled;
  }


let lastKnownRaidUser = null;
let lastKnownRewardUser = null;
let lastKnownClipUser = null;
let lastKnownEventUser = null;
let lastKnownSubscriptionUser = null;
let lastKnownPortalUser = null;
let lastKnownFollowUser = null;
let lastKnownRaidCount = null;
let lastKnownLikeCount = null;

async function updateLastRaidUser() {
  try {
    const user = await window.pywebview.api.get_last_raid_user();
    if (user !== lastKnownRaidUser) {
      console.log("Ник рейдера обновился:", user);
      document.getElementById("last-raid-user").textContent = user || "-";
      lastKnownRaidUser = user;
    } else {
      console.log("Ник рейдера не изменился");
    }
  } catch (e) {
    console.error("Ошибка при получении ника рейдера:", e);
  }
}

async function updateLastRewardUser() {
  try {
    const user = await window.pywebview.api.get_last_reward_user();
    if (user !== lastKnownRewardUser) {
      console.log("Ник награды обновился:", user);
      document.getElementById("last-reward-user").textContent = user || "-";
      lastKnownRewardUser = user;
    } else {
      console.log("Ник награды не изменился");
    }
  } catch (e) {
    console.error("Ошибка при получении ника награды:", e);
  }
}

async function updateLastClipUser() {
  try {
    const user = await window.pywebview.api.get_last_clip_user();
    if (user !== lastKnownClipUser) {
      console.log("Ник награды обновился:", user);
      document.getElementById("last-clip-user").textContent = user || "-";
      lastKnownClipUser = user;
    } else {
      console.log("Ник награды не изменился");
    }
  } catch (e) {
    console.error("Ошибка при получении ника награды:", e);
  }
}

async function updateLastEventUser() {
  try {
    const user = await window.pywebview.api.get_last_event_user();
    if (user !== lastKnownEventUser) {
      console.log("Ник события обновился:", user);
      document.getElementById("last-event-user").textContent = user || "-";
      lastKnownEventUser = user;
    } else {
      console.log("Ник события не изменился");
    }
  } catch (e) {
    console.error("Ошибка при получении ника события:", e);
  }
}

async function updateLastSubscriptionUser() {
  try {
    const user = await window.pywebview.api.get_last_subscription_user();
    if (user !== lastKnownSubscriptionUser) {
      console.log("Ник подписчика обновился:", user);
      document.getElementById("last-subscription-user").textContent = user || "-";
      lastKnownSubscriptionUser = user;
    } else {
      console.log("Ник подписчика не изменился");
    }
  } catch (e) {
    console.error("Ошибка при получении ника подписчика:", e);
  }
}

async function updateLastPortalUser() {
  try {
    const user = await window.pywebview.api.get_last_portal_user();
    if (user !== lastKnownPortalUser) {
      console.log("Ник портала обновился:", user);
      document.getElementById("last-portal-user").textContent = user || "-";
      lastKnownPortalUser = user;
    } else {
      console.log("Ник портала не изменился");
    }
  } catch (e) {
    console.error("Ошибка при получении ника портала:", e);
  }
}

async function updateLastFollowUser() {
  try {
    const user = await window.pywebview.api.get_last_follow_user();
    if (user !== lastKnownFollowUser) {
      console.log("Ник подписчика канала обновился:", user);
      document.getElementById("last-follow-user").textContent = user || "-";
      lastKnownFollowUser = user;
    } else {
      console.log("Ник подписчика канала не изменился");
    }
  } catch (e) {
    console.error("Ошибка при получении ника подписчика канала:", e);
  }
}

async function updateLastRaidCount() {
  try {
    const count = await window.pywebview.api.get_last_raid_count();
    if (count !== lastKnownRaidCount) {
      console.log("Число рейдеров обновилось:", count);
      document.getElementById("last-raid-count").textContent = count || "-";
      lastKnownRaidCount = count;
    } else {
      console.log("Число рейдеров не изменилось");
    }
  } catch (e) {
    console.error("Ошибка при получении числа рейдеров:", e);
  }
}

async function updateLastLikeCount() {
  try {
    const count = await window.pywebview.api.get_last_like_count();
    if (count !== lastKnownLikeCount) {
      console.log("Количество лайков обновилось:", count);
      document.getElementById("last-like-count").textContent = count || "-";
      lastKnownLikeCount = count;
    } else {
      console.log("Количество лайков не изменилось");
    }
  } catch (e) {
    console.error("Ошибка при получении количества лайков:", e);
  }
}

window.addEventListener('pywebviewready', () => {
  updateLastRaidUser();
  updateLastRewardUser();
  updateLastEventUser();
  updateLastSubscriptionUser();
  updateLastPortalUser();
  updateLastFollowUser();
  updateLastRaidCount();
  updateLastClipUser();
  updateLastLikeCount();
  setInterval(updateLastRaidUser, 4000);
  setInterval(updateLastRewardUser, 4000);
  setInterval(updateLastEventUser, 4000);
  setInterval(updateLastClipUser, 4000);
  setInterval(updateLastSubscriptionUser, 4000);
  setInterval(updateLastPortalUser, 4000);
  setInterval(updateLastFollowUser, 4000);
  setInterval(updateLastRaidCount, 4000);
  setInterval(updateLastLikeCount, 4000);
});








async function openAlerts(event) {
  event.preventDefault();
  const url = await window.pywebview.api.get_twitch_alert_url();
  if (url) {
    window.open(url, '_blank');
  } else {
    alert('Канал не задан!');
  }
}

function updateDropPercentThresholdSlider(value) {
  const slider = document.getElementById("dropPercentThresholdSlider");
  const label = document.getElementById("dropPercentThresholdLabel");
  slider.value = value;
  label.innerText = parseFloat(value).toFixed(1);
}

function onDropPercentThresholdSliderChange(value) {
  const parsedValue = parseFloat(value).toFixed(1);
  document.getElementById("dropPercentThresholdLabel").innerText = parsedValue;
  if (window.pywebview) {
    window.pywebview.api.set_drop_percent_threshold(parsedValue)
      .then(response => {
        if (response.status !== "ok") {
          console.error("Ошибка сохранения порога потерь кадров:", response.error);
          alert("Ошибка сохранения порога потерь кадров: " + response.error);
        }
      })
      .catch(error => {
        console.error("Ошибка при вызове set_drop_percent_threshold:", error);
        alert("Ошибка при сохранении настроек: " + error);
      });
  }
}

function loadObsSettings() {
  if (window.pywebview) {
    window.pywebview.api.get_drop_percent_threshold()
      .then(response => {
        if (response.status === "ok") {
          updateDropPercentThresholdSlider(response.drop_percent_threshold);
        } else {
          console.error("Ошибка загрузки настроек OBS:", response.error);
        }
      })
      .catch(error => {
        console.error("Ошибка при загрузке настроек OBS:", error);
      });
  }
}
window.addEventListener("load", loadObsSettings);

let platformFilter = null;
let searchQuery = "";
let reportsData = {};
let rewardsData = {};
let allFiles = [];
let allRewardFiles = [];
let currentYear = null;
let currentMonthFile = null;
let currentRewardMonthFile = null;
let currentDate = null;
let currentSort = { key: "name", direction: 1 };
let currentTable = 'viewers';

function switchTable(mode) {
  currentTable = mode;
  document.getElementById('switchViewers').classList.toggle('active', mode === 'viewers');
  document.getElementById('switchRewards').classList.toggle('active', mode === 'rewards');
  document.getElementById('viewersTableHead').style.display = mode === 'viewers' ? '' : 'none';
  document.getElementById('rewardsTableHead').style.display = mode === 'rewards' ? '' : 'none';
  loadAvailableReports(allFiles);
}

function filterByPlatform(platform) {
  platformFilter = platform;
  document.querySelectorAll('#platformFilter button').forEach(btn => {
    btn.classList.remove('active');
    const btnPlatform = btn.textContent;
    if ((platform === null && btnPlatform === 'Все') || btnPlatform === platform) {
      btn.classList.add('active');
    }
  });
  showTable();
}

function onSearchInput(value) {
  searchQuery = value.toLowerCase();
  showTable();
}

async function loadAvailableReports(files) {
  allFiles = files.sort().reverse();
  try {
    allRewardFiles = (await window.pywebview.api.get_reward_report_files()).sort().reverse();
    console.log("Reward files:", allRewardFiles);
  } catch (error) {
    console.error("Ошибка загрузки файлов наград:", error);
    allRewardFiles = [];
  }

  const years = currentTable === 'viewers'
    ? [...new Set(allFiles.map(f => f.split('-')[1]))].sort().reverse()
    : [...new Set(allRewardFiles.map(f => f.split('-')[1]))].sort().reverse();
  const yearButtons = document.getElementById("yearButtons");
  yearButtons.innerHTML = "";
  years.forEach(year => {
    const btn = document.createElement("button");
    btn.textContent = year;
    btn.onclick = () => {
      selectYear(year);
      yearButtons.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
    yearButtons.appendChild(btn);
  });

  const today = new Date();
  const thisYear = today.getFullYear().toString();
  if (years.includes(thisYear)) {
    selectYear(thisYear);
    yearButtons.querySelectorAll("button").forEach(b => {
      if (b.textContent === thisYear) b.classList.add("active");
    });
  } else if (years.length) {
    selectYear(years[0]);
    yearButtons.querySelectorAll("button").forEach(b => {
      if (b.textContent === years[0]) b.classList.add("active");
    });
  }
}

async function selectYear(year) {
  currentYear = year;
  currentMonthFile = null;
  currentRewardMonthFile = null;
  currentDate = null;

  const monthsFiles = currentTable === 'viewers'
    ? allFiles.filter(f => f.includes(`-${year}-`)).sort()
    : allRewardFiles.filter(f => f.includes(`-${year}-`)).sort();
  const monthButtons = document.getElementById("monthButtons");
  monthButtons.innerHTML = "";
  monthsFiles.forEach(file => {
    const month = file.split('-')[0];
    const btn = document.createElement("button");
    btn.textContent = month;
    btn.onclick = () => {
      selectMonth(file, true);
      monthButtons.querySelectorAll("button").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
    };
    monthButtons.appendChild(btn);
  });

  document.getElementById("dateButtons").innerHTML = "";
  clearTable();

  if (monthsFiles.length) {
    const today = new Date();
    const thisMonth = (today.getMonth() + 1).toString().padStart(2, "0");
    const targetFile = monthsFiles.find(f => f.startsWith(thisMonth)) || monthsFiles[0];
    const targetMonth = targetFile.split("-")[0];
    selectMonth(targetFile);
    monthButtons.querySelectorAll("button").forEach(b => {
      if (b.textContent === targetMonth) b.classList.add("active");
    });
  }
}



async function selectMonth(file, userClickedMonth = false) {
    let records;
    if (currentTable === 'viewers') {
        currentMonthFile = file;
        currentRewardMonthFile = null;
        if (!reportsData[file]) {
            records = await window.pywebview.api.load_report_file(file).catch(() => []);
            reportsData[file] = records;
        } else {
            records = reportsData[file];
        }
    } else {
        currentRewardMonthFile = file;
        currentMonthFile = null;
        if (!rewardsData[file]) {
            records = await window.pywebview.api.load_reward_report_file(file).catch(() => []);
            rewardsData[file] = records;
        } else {
            records = rewardsData[file];
        }
    }

    const dates = [...new Set(records.map(r => r.date))].sort();
    const dateButtons = document.getElementById("dateButtons");
    dateButtons.innerHTML = "";

    // создаём кнопки дней
    dates.forEach(date => {
        const btn = document.createElement("button");
        btn.textContent = date.slice(-2);
        btn.onclick = () => {
            currentDate = date; // выбран конкретный день
            dateButtons.querySelectorAll("button").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
            showTable();
        };
        dateButtons.appendChild(btn);
    });

    if (!userClickedMonth) {
        // Автозагрузка: текущий день или последний
        const today = new Date().toISOString().slice(0, 10);
        currentDate = dates.includes(today) ? today : (dates[dates.length - 1] || null);

        // Подсветка выбранного дня
        dateButtons.querySelectorAll("button").forEach(btn => {
            if (currentDate && btn.textContent === currentDate.slice(-2)) {
                btn.classList.add("active");
            }
        });
    } else {
        // Пользователь кликнул на месяц → показываем весь месяц
        currentDate = null; // ВСЕ записи месяца
        dateButtons.querySelectorAll("button").forEach(btn => btn.classList.remove("active"));
    }

    showTable();
}


function showTable() {
  if (currentTable === 'viewers') {
    showViewersTable();
  } else {
    showRewardsTable();
  }
}

function showViewersTable() {
    if (!currentMonthFile || !reportsData[currentMonthFile]) {
        clearTable();
        return;
    }

    // если currentDate = null → показываем весь месяц
    const records = currentDate
        ? reportsData[currentMonthFile].filter(r => r.date === currentDate)
        : reportsData[currentMonthFile];

    if (!records.length) {
        clearTable();
        return;
    }

    const viewerData = {};
    records.forEach(r => {
        if (!viewerData[r.name]) viewerData[r.name] = { count: 0, firstTime: r.time, platform: r.platform };
        viewerData[r.name].count += 1;
        if (r.time < viewerData[r.name].firstTime) viewerData[r.name].firstTime = r.time;
    });

    const dataArray = Object.entries(viewerData).map(([name, data]) => ({
        name,
        minutes: data.count * 3,
        firstTime: data.firstTime,
        platform: data.platform
    }));

    const maxMinutes = Math.max(...dataArray.map(d => d.minutes)) || 1;
    dataArray.forEach(d => d.retention = Math.round((d.minutes / maxMinutes) * 100));

    let filteredData = dataArray;
    if (platformFilter) filteredData = filteredData.filter(d => d.platform === platformFilter);
    if (searchQuery) filteredData = filteredData.filter(d => d.name.toLowerCase().includes(searchQuery));
    filteredData.sort((a,b) => {
        const key = currentSort.key, dir = currentSort.direction;
        if (a[key] < b[key]) return -1*dir;
        if (a[key] > b[key]) return 1*dir;
        return 0;
    });

    const totalNames = filteredData.length;
    const totalMinutes = filteredData.reduce((sum,d)=>sum+d.minutes,0);
    document.querySelector("#viewersTableHead th:nth-child(2)").innerHTML = `Имя [<span style="font-size:0.8em;color:white">${totalNames}</span>]`;
    document.querySelector("#viewersTableHead th:nth-child(3)").innerHTML = `Онлайн [<span style="font-size:0.8em;color:white">${totalMinutes}</span>] <small>(~минуты)</small>`;

    const tbody = document.querySelector("#viewersTable tbody");
    tbody.innerHTML = "";
    filteredData.forEach(({name, minutes, firstTime, platform, retention}) => {
        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${getPlatformIcon(platform)}</td>
            <td>${name}</td>
            <td>${minutes}</td>
            <td>${firstTime}</td>
            <td>${retention}%</td>
        `;
        tr.style.borderBottom = "1px solid #3d3d3d";
        tbody.appendChild(tr);
    });
}

function showRewardsTable() {
    if (!currentRewardMonthFile || !rewardsData[currentRewardMonthFile]) {
        clearTable();
        return;
    }

    const records = currentDate
        ? rewardsData[currentRewardMonthFile].filter(r => r.date === currentDate)
        : rewardsData[currentRewardMonthFile];

    if (!records.length) {
        clearTable();
        return;
    }

    let filteredData = records;
    if (platformFilter) filteredData = filteredData.filter(r => r.platform === platformFilter);
    if (searchQuery) filteredData = filteredData.filter(r => r.name.toLowerCase().includes(searchQuery));
    filteredData.sort((a,b) => {
        const key = currentSort.key, dir = currentSort.direction;
        if (a[key] < b[key]) return -1*dir;
        if (a[key] > b[key]) return 1*dir;
        return 0;
    });

    const uniqueNames = new Set(filteredData.map(r=>r.name)).size;
    const totalRewards = filteredData.length;
    const totalPrice = filteredData.reduce((sum,r)=>(sum+(r.price||0)),0);
    document.querySelector("#rewardsTableHead th:nth-child(2)").innerHTML = `Имя [<span style="font-size:0.8em;color:white">${uniqueNames}</span>]`;
    document.querySelector("#rewardsTableHead th:nth-child(3)").innerHTML = `Награда [<span style="font-size:0.8em;color:white">${totalRewards}</span>]`;
    document.querySelector("#rewardsTableHead th:nth-child(5)").innerHTML = `Баллы [<span style="font-size:0.8em;color:white">${totalPrice}</span>]`;

    const tbody = document.querySelector("#viewersTable tbody");
    tbody.innerHTML = "";
    filteredData.forEach(r => {
        let displayContent = r.content||'-';
        const maxLength = 40;
        const isUrl = displayContent.startsWith('http://')||displayContent.startsWith('https://');
        if(displayContent!=='-' && displayContent.length>maxLength) displayContent = displayContent.substring(0,maxLength-3)+'...';
        const contentHtml = isUrl? `<a href="${r.content}" target="_blank">${displayContent}</a>` : displayContent;

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${getPlatformIcon(r.platform)}</td>
            <td>${r.name}</td>
            <td>${r.reward}</td>
            <td>${r.time}</td>
            <td>${r.price}</td>
            <td>${contentHtml}</td>
        `;
        tr.style.borderBottom="1px solid #3d3d3d";
        tbody.appendChild(tr);
    });
}


function clearTable() {
  document.querySelector("#viewersTableHead th:nth-child(2)").innerHTML = "Имя";
  document.querySelector("#viewersTableHead th:nth-child(3)").innerHTML = "Онлайн <small>(~минуты)</small>";
  document.querySelector("#rewardsTableHead th:nth-child(2)").innerHTML = "Имя";
  document.querySelector("#rewardsTableHead th:nth-child(5)").innerHTML = "Цена";
  document.querySelector("#viewersTable tbody").innerHTML = "";
}

document.querySelectorAll("#viewersTableHead th").forEach((th, index) => {
  th.style.cursor = "pointer";
  th.onclick = () => {
    const keys = ["platform", "name", "minutes", "firstTime", "retention"];
    const key = keys[index];
    if (!key) return;
    if (currentSort.key === key) {
      currentSort.direction *= -1;
    } else {
      currentSort.key = key;
      currentSort.direction = 1;
    }
    showTable();
  };
});

document.querySelectorAll("#rewardsTableHead th").forEach((th, index) => {
  th.style.cursor = "pointer";
  th.onclick = () => {
    const keys = ["platform", "name", "reward", "time", "price", "content"];
    const key = keys[index];
    if (!key) return;
    if (currentSort.key === key) {
      currentSort.direction *= -1;
    } else {
      currentSort.key = key;
      currentSort.direction = 1;
    }
    showTable();
  };
});

function getPlatformIcon(platform) {
  const icons = {
    Twitch: '<img src="svg/Twitch.png" alt="Twitch" width="20">',
    VK: '<img src="svg/vk.png" alt="VK" width="20">'
  };
  return icons[platform] || '🔵';
}

document.getElementById("refreshButton").onclick = async () => {
  reportsData = {};
  rewardsData = {};
  try {
    allFiles = await window.pywebview.api.get_report_files();
    allRewardFiles = await window.pywebview.api.get_reward_report_files();
    await loadAvailableReports(allFiles);
  } catch (error) {
    console.error("Ошибка при обновлении данных:", error);
    alert("Ошибка при загрузке данных отчетов: " + error);
  }
};

document.addEventListener('DOMContentLoaded', () => {
  window.pywebview.api.get_report_files().then(loadAvailableReports).catch(error => {
    console.error("Ошибка при начальной загрузке файлов отчетов:", error);
    alert("Ошибка при начальной загрузке отчетов: " + error);
  });
});





let existingIds = new Set();
let editingIds = new Set();
let unsavedIds = new Set();
let loading = false; // для предотвращения наложения запросов
// Вызовем загрузку памяти, когда PyWebView API готов
window.addEventListener('pywebviewready', () => {
    loadMemory();
    setInterval(loadMemory, 4000); // автообновление каждые 4 сек
});
async function loadMemory() {
    if (loading) return; // предотвращаем наложение
    if (!window.pywebview || !window.pywebview.api || !window.pywebview.api.get_bot_memory) {
        console.error("API ещё не готов");
        return;
    }
    loading = true;
    try {
        const data = await window.pywebview.api.get_bot_memory();
        const tbody = document.querySelector("#bot-memory-table tbody");
        const currentIds = new Set(Object.keys(data));
        // Удаляем строки, которых больше нет в памяти и которые не редактируются
        tbody.querySelectorAll('tr').forEach(tr => {
            const id = tr.dataset.id;
            if (!currentIds.has(id) && !editingIds.has(id) && !unsavedIds.has(id)) {
                tr.remove();
                existingIds.delete(id);
            }
        });
        // Добавляем новые строки
        for (const [id, qa] of Object.entries(data)) {
            if (!existingIds.has(id)) {
                addRow(qa.question, qa.answer, id);
            }
        }
    } catch (err) {
        console.error("Error loading memory:", err);
    } finally {
        loading = false;
    }
}
function addRow(question = '', answer = '', id = null) {
    if (!id) id = crypto.randomUUID();
    const tbody = document.querySelector("#bot-memory-table tbody");
    const tr = document.createElement('tr');
    tr.dataset.id = id;
    tr.innerHTML = `
        <td contenteditable="true" class="question" style="width: 35%; border: 1px solid rgba(200, 200, 200, 0.3);">${question}</td>
        <td contenteditable="true" class="answer" style="width: 58%; border: 1px solid rgba(200, 200, 200, 0.3);">${answer}</td>
        <td style="width: 7%;"><button class="btn-danger btn-sm delete-row" style="border: 1px solid rgba(200, 200, 200, 0.3); font-weight: bold; padding: 3px;">Удалить</button></td>
    `;
    tbody.appendChild(tr);
    existingIds.add(id);
    if (!question && !answer) unsavedIds.add(id);
    // События редактирования ячеек
    tr.querySelectorAll('[contenteditable]').forEach(cell => {
        cell.addEventListener('focus', () => editingIds.add(id));
        cell.addEventListener('blur', () => {
            editingIds.delete(id);
            saveMemory(id);
        });
        cell.addEventListener('keydown', e => {
            if (e.key === 'Enter') {
                e.preventDefault();
                cell.blur();
            }
        });
    });
    // Кнопка удаления
    tr.querySelector('.delete-row').addEventListener('click', () => {
        tr.remove();
        existingIds.delete(id);
        editingIds.delete(id);
        unsavedIds.delete(id);
        saveMemory();
    });
    return tr;
}
async function saveMemory(changedId = null) {
    if (!window.pywebview || !window.pywebview.api || !window.pywebview.api.save_bot_memory) {
        console.error("API save_bot_memory ещё не готов");
        return;
    }
    try {
        const tbody = document.querySelector("#bot-memory-table tbody");
        const newData = {};
        tbody.querySelectorAll('tr').forEach(tr => {
            const id = tr.dataset.id;
            const q = tr.querySelector('.question').innerText.replace(/\n/g, '').trim();
            const a = tr.querySelector('.answer').innerText.replace(/\n/g, '').trim();
            if (q) {
                newData[id] = { question: q, answer: a };
                unsavedIds.delete(id);
            }
        });
        await window.pywebview.api.save_bot_memory(newData);
        console.log("Memory saved:", newData);
    } catch (err) {
        console.error("Error saving memory:", err);
    }
}
// Добавление новой строки по кнопке
document.getElementById('add-memory-row').addEventListener('click', () => addRow());









let zoomLevel = 1.0;
let baseWidth;
let baseHeight;

function setZoom(level) {
  if (typeof baseWidth !== 'number' || typeof baseHeight !== 'number') {
    console.warn('baseWidth or baseHeight is not set correctly');
    return;
  }
  zoomLevel = Math.max(0.5, Math.min(2.0, level));
  document.body.style.zoom = zoomLevel;
  const newWidth = Math.round(baseWidth * zoomLevel);
  const newHeight = Math.round(baseHeight * zoomLevel);
  if (window.pywebview?.api?.resize_window) {
    window.pywebview.api.resize_window(newWidth, newHeight);
  }
  if (window.pywebview?.api?.set_zoom_level) {
    window.pywebview.api.set_zoom_level(zoomLevel);
  }
}
// Клавиши Ctrl + ↑ / ↓
document.addEventListener("keydown", (e) => {
  if (e.ctrlKey && e.code === "ArrowUp") {
    e.preventDefault();
    setZoom(zoomLevel + 0.05);
  } else if (e.ctrlKey && e.code === "ArrowDown") {
    e.preventDefault();
    setZoom(zoomLevel - 0.05);
  }
});
// Кнопки + и −
document.getElementById("zoomInBtn").addEventListener("click", () => {
  setZoom(zoomLevel + 0.05);
});
document.getElementById("zoomOutBtn").addEventListener("click", () => {
  setZoom(zoomLevel - 0.05);
});
// Инициализация с данными от Python
function initializeZoom(width, height, zoom) {
  baseWidth = width;
  baseHeight = height;
  zoomLevel = zoom || 1.0;
  setZoom(zoomLevel);
}








function openClearQueueModal() {
  document.getElementById("clearQueueModal").style.display = "flex";
}
function closeClearQueueModal() {
  document.getElementById("clearQueueModal").style.display = "none";
}
async function confirmClearQueueNow() {
  await window.pywebview.api.clear_video_queue();
  closeClearQueueModal();
}


let editingAuthorIndex = null;
let authorsList = [];
// Открыть модалку со списком авторов
async function openAuthorsModal() {
  authorsList = await window.pywebview.api.get_author_tts();
  renderAuthorsTable();
  document.getElementById("modalAuthors").style.display = "flex";
}
// Закрыть модалку авторов
function closeAuthorsModal() {
  document.getElementById("modalAuthors").style.display = "none";
}
// Отрисовка таблицы авторов
function renderAuthorsTable() {
  const tbody = document.querySelector("#authorsTable tbody");
  tbody.innerHTML = "";
  authorsList.forEach((entry, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${entry.name}</td>
      <td>${entry.speak_as}</td>
      <td>
        <button onclick="editAuthor(${index})" class="btn btn-primary" style="width: 42%; height: 20px; padding: 0;">✏️</button>
        <button onclick="confirmDeleteAuthor(${index})" class="btn btn-primary" style="width: 42%; height: 20px; padding: 0;">🗑</button>
      </td>
    `;
    tbody.appendChild(tr);
  });
}
// Открыть модалку добавления автора
function openAddAuthorModal() {
  editingAuthorIndex = null;
  document.getElementById("authorModalTitle").innerText = "Добавить имя";
  document.getElementById("authorNameInput").value = "";
  document.getElementById("speakAsInput").value = "";
  document.getElementById("authorTtsModal").style.display = "flex";
}
// Закрыть модалку автора
function closeAuthorModal() {
  document.getElementById("authorTtsModal").style.display = "none";
}
// Редактировать автора
function editAuthor(index) {
  editingAuthorIndex = index;
  const entry = authorsList[index];
  document.getElementById("authorModalTitle").innerText = "Редактировать имя";
  document.getElementById("authorNameInput").value = entry.name;
  document.getElementById("speakAsInput").value = entry.speak_as;
  document.getElementById("authorTtsModal").style.display = "flex";
}
// Сохранить (добавить или обновить) автора
async function saveAuthor() {
  const name = document.getElementById("authorNameInput").value.trim();
  const speak_as = document.getElementById("speakAsInput").value.trim();
  if (!name || !speak_as) {
    alert("Заполните оба поля");
    return;
  }
  if (editingAuthorIndex === null) {
    await window.pywebview.api.add_author_tts({ name, speak_as });
  } else {
    await window.pywebview.api.update_author_tts(editingAuthorIndex, { name, speak_as });
  }
  closeAuthorModal();
  await openAuthorsModal(); // обновить таблицу
}
// Загрузка и скрытие таблицы при старте
async function loadAuthorTTS() {
  await openAuthorsModal();
  await closeAuthorsModal();
}
// ======= Удаление автора (через модалку подтверждения) =======
let pendingDeleteAuthorIndex = null;
function confirmDeleteAuthor(index) {
  pendingDeleteAuthorIndex = index;
  const name = authorsList[index].name;
  document.getElementById("deleteAuthorDescription").innerText = `Удалить автора "${name}"?`;
  document.getElementById("deleteAuthorModal").style.display = "flex";
}
function closeDeleteAuthorModal() {
  document.getElementById("deleteAuthorModal").style.display = "none";
}
async function confirmDeleteAuthorNow() {
  if (pendingDeleteAuthorIndex !== null) {
    await window.pywebview.api.delete_author_tts(pendingDeleteAuthorIndex);
    await openAuthorsModal();
  }
  closeDeleteAuthorModal();
}



//кнопка очереди
const toggleBtn = document.getElementById('toggleQueueBtn');
async function updateButtonText() {
    const isVisible = await window.pywebview.api.is_queue_visible();
    toggleBtn.textContent = isVisible ? 'Скрыть очередь' : 'Показать очередь';
}
toggleBtn.addEventListener('click', async () => {
    await window.pywebview.api.toggle_queue_window();
    await updateButtonText();
});
setInterval(updateButtonText, 1500);

document.addEventListener('DOMContentLoaded', function () {
  const scriptTab = document.getElementById('script-tab');
  const modalObs = document.getElementById('modalObs');
  const closeModalBtn = document.getElementById('closeObsModal');
  const eventsContainer = document.getElementById('eventsContainer');
  const obsWarning = document.getElementById('obsConnectionWarning');
  async function checkObsConnection(showModalIfNotConnected = false) {
    if (window.pywebview && window.pywebview.api) {
      try {
        const isObsConnected = await window.pywebview.api.check_obs_connection();
        if (isObsConnected) {
          eventsContainer.style.display = 'block';
          obsWarning.style.display = 'none';
          modalObs.style.display = 'none';
          return true;
        } else {
          eventsContainer.style.display = 'none';
          obsWarning.style.display = 'block';
          if (showModalIfNotConnected) {
            modalObs.style.display = 'flex';
          } else {
            modalObs.style.display = 'none';
          }
          return false;
        }
      } catch (err) {
        console.error('Ошибка при вызове check_obs_connection:', err);
        eventsContainer.style.display = 'none';
        obsWarning.style.display = 'block';
        if (showModalIfNotConnected) {
          modalObs.style.display = 'flex';
        } else {
          modalObs.style.display = 'none';
        }
        return false;
      }
    } else {
      eventsContainer.style.display = 'none';
      obsWarning.style.display = 'block';
      if (showModalIfNotConnected) {
        modalObs.style.display = 'flex';
      } else {
        modalObs.style.display = 'none';
      }
      return false;
    }
  }
  async function waitForObsConnection() {
    let connected = false;
    for (let i = 0; i < 2; i++) {
      connected = await checkObsConnection(false);
      if (connected) break;
      await new Promise(r => setTimeout(r, 1000));
    }
  }
  waitForObsConnection();
  scriptTab.addEventListener('click', async function (e) {
    e.preventDefault();
    const connected = await checkObsConnection(true);
    if (connected) {
      const tab = new bootstrap.Tab(scriptTab);
      tab.show();
    }
  });
  closeModalBtn.addEventListener('click', function () {
    modalObs.style.display = 'none';
  });
});






let scriptToDeleteIndex = null;
let scriptToDeleteName = '';

function deleteScript(idx) {
  const script = window.loadedScripts[idx];
  scriptToDeleteIndex = idx;
  scriptToDeleteName = script.name;
  document.getElementById('confirmDeleteTitle').textContent =
    `Вы действительно хотите удалить скрипт "${scriptToDeleteName}"?`;
  document.getElementById('confirmDeleteModal').style.display = 'flex';
}

function closeConfirmDeleteModal() {
  scriptToDeleteIndex = null;
  scriptToDeleteName = '';
  document.getElementById('confirmDeleteModal').style.display = 'none';
}

async function confirmDelete() {
  if (scriptToDeleteIndex !== null) {
    await window.pywebview.api.delete_script(scriptToDeleteIndex);
    closeConfirmDeleteModal();
    await loadScripts();
  }
}

function openCreateRewardModal() {
  document.getElementById("reward_script_name").value = "";
  document.getElementById("reward_name").value = "";
  document.getElementById("createRewardModal").style.display = "flex";
}

function closeCreateRewardModal() {
  document.getElementById("createRewardModal").style.display = "none";
}

async function submitCreateReward() {
  const name = document.getElementById("reward_script_name").value.trim();
  const reward = document.getElementById("reward_name").value.trim();
  if (!name || !reward) {
    alert("Пожалуйста, заполните оба поля.");
    return;
  }
  await window.pywebview.api.create_script({ name, reward, type: "reward" });
  closeCreateRewardModal();
  await loadScripts();  
}

function openCreateEventModal() {
  document.getElementById("event_script_name").value = "";
  document.getElementById("event_name").value = "";
  document.getElementById("createEventModal").style.display = "flex";
}

function closeCreateEventModal() {
  document.getElementById("createEventModal").style.display = "none";
}

async function submitCreateEvent() {
  const name = document.getElementById("event_script_name").value.trim();
  const reward = document.getElementById("event_name").value.trim();
  if (!name || !reward) {
    alert("Пожалуйста, заполните оба поля.");
    return;
  }
  await window.pywebview.api.create_script({ name, reward, type: "event" });
  closeCreateEventModal();  // ✅ Закрываем модалку после создания
  await loadScripts();      // 🔄 Обновляем список
}


async function createScript(name, reward, type) {
  await window.pywebview.api.create_script({ name, reward, type });
  await loadScripts();
  const list = await window.pywebview.api.get_scripts();
  const lastIdx = list.length - 1;
  await showParams(lastIdx);
}

async function loadScripts() {
  const list = await window.pywebview.api.get_scripts();
  window.loadedScripts = list;
  const rewards = list.filter(script => script.type === "reward");
  const events = list.filter(script => script.type === "event");
  const renderGroup = (scripts, containerId, icon, color) => {
    const container = document.getElementById(containerId);
    container.innerHTML = '';
    scripts.forEach((script, idx) => {
      const div = document.createElement('div');
      div.innerHTML = `
        <table style="width: 100%; border-collapse: collapse;">
          <tr style="border-bottom: 1px solid #797979;">
            <td style="width: 40px; text-align: center; font-weight: bold;">${idx + 1}</td>
            <td style="width: 40px;">
              <span style="font-size: 18px;">${icon}</span>
            </td>
            <td style="padding: 2px 4px;">
              <div><strong>${script.name} </strong> <a style="font-size: 11px; color: #888888;"> [${script.reward}]</a></div>
            </td>
            <td style="text-align: right; white-space: nowrap;">
              <button class="btn btn-primary btn-round custom-btn btn-16" style="height: 26px;width: 80px;" onclick="testScript(${list.indexOf(script)})">▶ Пуск</button>
              <button class="btn btn-primary btn-round custom-btn btn-16" style="height: 26px;width: 150px;" onclick="openScriptEditor(${list.indexOf(script)})">⚙️ Редактировать</button>
              <button class="btn btn-danger" style="height: 26px;width: 100px; padding: 2px;" onclick="deleteScript(${list.indexOf(script)})">🗑 Удалить</button>
            </td>
            <td style="width: 0.5%"></td>
          </tr>
        </table>
      `;
      container.appendChild(div);
    });
  };

  renderGroup(rewards, "rewardScripts", "🎁", "#DAA520");
  renderGroup(events, "eventScripts", "🎉", "#1E90FF");
}

async function openScriptEditor(index) {
  const list = await window.pywebview.api.get_scripts();
  window.scripts = list;
  const script = list[index];
  const modal = document.getElementById('scriptModal');
  const modalContent = document.getElementById('modalContent');
  modalContent.innerHTML = `
    <h3 style="margin-bottom: 14px;">${script.name}</h3><div id="script_${index}_actions"></div>
    <div id="params_${index}"></div>
    <div style="text-align: right; margin-top: 10px;">
      <button class="btn btn-primary btn-round custom-btn btn-16" style="height: 32px;width: 190px;" onclick="addAction(${index})">➕ Добавить действие</button>
      <button class="btn btn-secondary" style="height: 32px;width: 100px; padding: 0;" onclick="closeModal()">Закрыть</button>
    </div>
  `;
  renderActions(index, script.actions);
  await showParams(index);
  modal.style.display = "flex";
}

function closeModal() {
  document.getElementById('scriptModal').style.display = "none";
}




// Переменные для drag & drop
let dragSrcEl = null;

// Функция рендера действий с поддержкой drag & drop
function renderActions(scriptIdx, actions) {
  const el = document.getElementById(`script_${scriptIdx}_actions`);
  let html = `
    <div style="max-height: 300px; height: 300px; overflow-y: auto; border: 1px solid #797979; border-radius: 4px;">
      <table style="width: 100%; border-collapse: collapse; table-layout: fixed;">
        <thead style="position: sticky; top: 0; background: #3b3b3b; color: var(--primary-color); z-index: 1;">
          <tr style="text-align: left; border-bottom: 1px solid #ccc;">
            <th style="width: 1%;"></th>
            <th style="width: 22%;">Тип</th>
            <th style="width: 44%;">Описание</th>
            <th style="width: 20%;">Задержка (мс)</th>
            <th style="width: 12%;">Действия</th>
          </tr>
        </thead>
        <tbody style="font-size: 14px; line-height: 1.3;">
  `;
  actions.forEach((a, i) => {
    const desc = a.type === "obs_switch_scene"
      ? `Сцена: <strong>${a.scene_name}</strong>`
      : a.type === "toggle_filter"
        ? `Источник: <strong>${a.source}</strong><br>Фильтр: <strong>${a.filter || "—"}</strong><br>Вкл: <strong>${a.enable}</strong>`
        : a.type === "volume_control"
          ? `Источник: <strong>${a.source}</strong><br>Громкость: <strong>${a.volume}</strong>`
          : a.type === "exec"
            ? `Код: <code>${(a.code?.substring(0, 40) || "").replace(/\n/g, ' ')}...</code>`
            : `<code>${JSON.stringify(a)}</code>`;
    html += `
      <tr draggable="true" id="action_${scriptIdx}_${i}" style="cursor: all-scroll; border-bottom: 1px solid #5f5f5f;">
        <td></td>
        <td><strong>${a.type}</strong></td>
        <td>${desc}</td>
        <td>
          <input type="number" id="delay_${scriptIdx}_${i}" value="${a.delay || 0}" onchange="autoSaveDelay(${scriptIdx}, ${i})" style="width: 90px; padding: 2px; margin: 0px;">
        </td>
        <td>
          <button class="btn btn-danger" style="width: 70%; height: 25px; padding: 0;" 
            onclick="showDeleteActionModal(${scriptIdx}, ${i})" title="Удалить действие">🗑</button>
        </td>
      </tr>
    `;
  });
  html += `
        </tbody>
      </table>
    </div>
  `;
  el.innerHTML = html;

  // Навешиваем обработчики drag & drop
  const rows = el.querySelectorAll('tr[draggable="true"]');
  rows.forEach(row => {
    row.addEventListener('dragstart', dragStart);
    row.addEventListener('dragover', dragOver);
    row.addEventListener('drop', drop);
    row.addEventListener('dragend', dragEnd);
  });
}

// Обработчики drag & drop

function dragStart(e) {
  dragSrcEl = this;
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', this.innerHTML);
  this.style.opacity = '0.4';
}

function dragOver(e) {
  e.preventDefault(); // разрешаем drop
  e.dataTransfer.dropEffect = 'move';
  return false;
}

async function drop(e) {
  e.stopPropagation();
  if (dragSrcEl !== this) {
    const srcId = dragSrcEl.id;
    const targetId = this.id;
    const [_, scriptIdxStr, srcIndexStr] = srcId.split('_');
    const [__, scriptIdxStr2, targetIndexStr] = targetId.split('_');
    const scriptIdx = parseInt(scriptIdxStr, 10);
    const srcIndex = parseInt(srcIndexStr, 10);
    const targetIndex = parseInt(targetIndexStr, 10);
    if(window.scripts && window.scripts[scriptIdx]) {
      const actions = window.scripts[scriptIdx].actions;
      const movedAction = actions.splice(srcIndex, 1)[0];
      actions.splice(targetIndex, 0, movedAction);
      renderActions(scriptIdx, actions);
      // Сохраняем новый порядок на бекенде
      if(window.pywebview && window.pywebview.api) {
        await window.pywebview.api.save_scripts(window.scripts);
      }
    }
  }
  return false;
}

function dragEnd(e) {
  this.style.opacity = '1';
}

// ======= Удаление действий скрипта (не трогаем) =======
let pendingDeleteScriptIndex = null;
let pendingDeleteActionIndex = null;
  // Показывает модальное окно с подтверждением удаления
  function showDeleteActionModal(scriptIdx, actionIdx) {
    pendingDeleteScriptIndex = scriptIdx;
    pendingDeleteActionIndex = actionIdx;
    document.getElementById("deleteActionModal").style.display = "flex";
  }
  // Скрывает модальное окно подтверждения
  function closeDeleteActionModal() {
    document.getElementById("deleteActionModal").style.display = "none";
  }
  // Функция удаления действия из скрипта
  async function removeAction(scriptIdx, actionIdx) {
    // Здесь нужно вызвать API или изменить данные
    // Ниже просто пример с глобальным массивом scripts, замени под свой случай
    if(window.scripts && window.scripts[scriptIdx]) {
      window.scripts[scriptIdx].actions.splice(actionIdx, 1);
      renderActions(scriptIdx, window.scripts[scriptIdx].actions);
    } else {
      console.warn('Массив scripts или actions не определён');
    }
  }
  // Подтверждение удаления — кнопка "Удалить" в модальном окне
  async function confirmDeleteActionNow() {
    await removeAction(pendingDeleteScriptIndex, pendingDeleteActionIndex);
    closeDeleteActionModal();
  }
  // Навешиваем обработчики кнопок модального окна после загрузки страницы
  document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll('#platformFilter button').forEach(btn => {
    if (btn.textContent === 'Все') {
      btn.classList.add('active');
    }
  });
    document.getElementById("confirmDeleteActionBtn").addEventListener("click", confirmDeleteActionNow);
    document.getElementById("cancelDeleteActionBtn").addEventListener("click", closeDeleteActionModal);
  });





async function autoSaveDelay(scriptIdx, actionIdx) {
  const delayInput = document.getElementById(`delay_${scriptIdx}_${actionIdx}`);
  if (!delayInput) return;
  const newDelay = parseInt(delayInput.value) || 0;

  if (window.scripts && window.scripts[scriptIdx] && window.scripts[scriptIdx].actions[actionIdx]) {
    window.scripts[scriptIdx].actions[actionIdx].delay = newDelay;

    if (window.pywebview && window.pywebview.api) {
      await window.pywebview.api.save_scripts(window.scripts);
    }
  }
}

async function addAction(index) {
  const sceneEl = document.getElementById(`scene_select_${index}`);
  if (!sceneEl || !sceneEl.value) return alert("Выберите сцену");
  const scene = sceneEl.value;

  const actionEl = document.getElementById(`action_select_${index}`);
  if (!actionEl || !actionEl.value) return alert("Выберите действие с сценой");
  const actionType = actionEl.value;

  let action = null;

  if (actionType === "switch_scene") {
    action = { type: "obs_switch_scene", scene_name: scene, delay: 0 };

  } else if (actionType === "exec") {
    const code = prompt("Введите JavaScript-код, который должен быть выполнен:");
    if (!code) return alert("Код не введён");
    action = { type: "exec", code, delay: 0 };

  } else if (actionType === "source_action") {
    const sourceEl = document.getElementById(`source_select_${index}`);
    if (!sourceEl || !sourceEl.value) return alert("Выберите источник");
    const source = sourceEl.value;

    const sourceActionEl = document.getElementById(`source_action_select_${index}`);
    if (!sourceActionEl || !sourceActionEl.value) return alert("Выберите действие с источником");
    const sourceAction = sourceActionEl.value;

    if (sourceAction === "show_hide_source") {
      const visibilityEl = document.getElementById(`visibility_select_${index}`);
      if (!visibilityEl || !visibilityEl.value) return alert("Выберите видимость источника");
      const enable = visibilityEl.value === "true";
      action = { type: "toggle_filter", source, filter: "", enable, delay: 0, scene };  // вот тут scene добавлено
    } else if (sourceAction === "filter_action") {
      const filterEl = document.getElementById(`filter_select_${index}`);
      if (!filterEl || !filterEl.value) return alert("Выберите фильтр");
      const filter = filterEl.value;
      const filterActionEl = document.getElementById(`filter_action_select_${index}`);
      if (!filterActionEl || !filterActionEl.value) return alert("Выберите действие с фильтром");
      const enable = filterActionEl.value === "enable";
      action = { type: "toggle_filter", source, filter, enable, delay: 0, scene };  // тут тоже добавлено scene
    } else if (sourceAction === "volume_control") {
      const volumeSlider = document.getElementById(`volume_slider_${index}`);
      if (!volumeSlider) return alert("Выберите громкость источника");
      const volume = parseInt(volumeSlider.value);
      action = { type: "volume_control", source, volume, delay: 0 };
    }

  } else if (actionType === "scene_filter_action") {
    const filterEl = document.getElementById(`filter_select_${index}`);
    if (!filterEl || !filterEl.value) return alert("Выберите фильтр");
    const filter = filterEl.value;
    const filterActionEl = document.getElementById(`filter_action_select_${index}`);
    if (!filterActionEl || !filterActionEl.value) return alert("Выберите действие с фильтром");
    const enable = filterActionEl.value === "enable";
    action = { type: "toggle_filter", source: scene, filter, enable, delay: 0, scene };
  }

  if (!action) return alert("Не выбрано действие для добавления");

  await window.pywebview.api.add_action_to_script(index, action);
  const scripts = await window.pywebview.api.get_scripts();
  window.scripts = scripts;  // <- обновляем глобальный массив
  renderActions(index, window.scripts[index].actions);
  await showParams(index);
  await loadScripts();
}




async function removeAction(scriptIdx, actionIdx) {
  if(window.scripts && window.scripts[scriptIdx]) {
    window.scripts[scriptIdx].actions.splice(actionIdx, 1);
    renderActions(scriptIdx, window.scripts[scriptIdx].actions);

    if(window.pywebview && window.pywebview.api && window.pywebview.api.save_scripts) {
      await window.pywebview.api.save_scripts(window.scripts);
    }
  }
}
function deleteScript(index) {
  const script = window.loadedScripts[index];
  scriptToDeleteIndex = index;
  scriptToDeleteName = script.name;
  document.getElementById('confirmDeleteTitle').textContent =
    `Вы действительно хотите удалить скрипт "${scriptToDeleteName}"?`;
  document.getElementById('confirmDeleteModal').style.display = 'flex';
}

async function testScript(index) {
    await window.pywebview.api.execute_script(index);
}
loadScripts();
async function populateScenes(index) {
    const res = await window.pywebview.api.get_obs_scenes();
    const container = document.getElementById(`params_${index}`);
    if (res.status === "ok") {
        const options = res.scenes.map(s => `<option value="${s}">${s}</option>`).join('');
        container.innerHTML = `
            <label>Сцена:</label>
            <select id="scene_${index}" onchange="loadSceneSources(${index})">${options}</select>
            <div id="scene_sources_${index}"></div>
        `;
        await loadSceneSources(index);
    } else {
        container.innerHTML = `<input id="scene_${index}" placeholder="Название сцены (ошибка OBS)">`;
    }
}
async function loadSceneSources(index) {
    const sceneName = document.getElementById(`scene_${index}`).value;
    const res = await window.pywebview.api.get_scene_sources(sceneName);
    const container = document.getElementById(`scene_sources_${index}`);
    if (res.status !== "ok") {
        container.innerHTML = `<div>Источники не найдены</div>`;
        return;
    }
    const blocks = await Promise.all(res.sources.map(async (source) => {
        const filtersRes = await window.pywebview.api.get_filters(source);
        const filters = filtersRes.status === "ok" ? filtersRes.filters : [];
        const filterOptions = filters.map(f => `<option value="${f}">${f}</option>`).join('');
        return `
            <div style="margin-top:10px; padding-left:15px; border-left:2px solid #ccc;">
                <h4>${source}</h4>
                <label>Задержка (мс):</label>
                <input type="number" id="delay_${index}_${source}" value="0" style="width:80px;">
                <br>
                <button onclick="addShowHide(${index}, '${source}', true)">👁 Показать</button>
                <button onclick="addShowHide(${index}, '${source}', false)">🙈 Скрыть</button>
                <br><br>
                <label>Фильтр:</label>
                <select id="filter_${index}_${source}">${filterOptions}</select>
                <button onclick="addFilterToggle(${index}, '${source}', true)">✅ Вкл</button>
                <button onclick="addFilterToggle(${index}, '${source}', false)">🚫 Выкл</button>
            </div>
        `;
    }));
    container.innerHTML = blocks.join('');
}
async function addShowHide(index, source, enable) {
    const delay = parseInt(document.getElementById(`delay_${index}_${source}`)?.value || 0);
    const action = {
        type: "toggle_filter",
        source: source,
        filter: "",
        enable: enable,
        delay: delay
    };
    console.log("Добавляем действие (показ/скрытие):", action);
    await window.pywebview.api.add_action_to_script(index, action);
    loadScripts();
}
async function addFilterToggle(index, source, enable) {
    const delay = parseInt(document.getElementById(`delay_${index}_${source}`)?.value || 0);
    const filterSelectId = `filter_${index}_${source}`;
    const filterEl = document.getElementById(filterSelectId);
    if (!filterEl || !filterEl.value) {
        console.warn("Нет фильтра, действие не добавлено");
        return;
    }
    const filter = filterEl.value;
    const action = {
        type: "toggle_filter",
        source: source,
        filter: filter,
        enable: enable,
        delay: delay
    };
    console.log("Добавляем действие (фильтр):", action);
    await window.pywebview.api.add_action_to_script(index, action);
    await loadScripts();
}

async function showParams(index) {
  const container = document.getElementById(`params_${index}`);
  container.innerHTML = `<em>Загрузка сцен...</em>`;
  const scenesRes = await window.pywebview.api.get_obs_scenes();
  if (scenesRes.status !== "ok" || scenesRes.scenes.length === 0) {
    container.innerHTML = `<div>Ошибка загрузки сцен</div>`;
    return;
  }
  renderSceneSelector(index, scenesRes.scenes);
}

function renderSceneSelector(index, scenes) {
  const container = document.getElementById(`params_${index}`);
  container.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px; margin-top: 30px;">
      <label style="width: 60%;">Выберите сцену:</label>
      <select id="scene_select_${index}">
        <option value="">-- выберите сцену --</option>
        ${scenes.map(s => `<option value="${s}">${s}</option>`).join('')}
      </select>
    </div>
    <div id="step2_${index}" style="margin-top: 4px;"></div>
  `;
  document.getElementById(`scene_select_${index}`).onchange = (e) => handleSceneChange(index, e.target.value);
}

function handleSceneChange(index, sceneName) {
  const step2 = document.getElementById(`step2_${index}`);
  if (!sceneName) return step2.innerHTML = '';

  step2.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px;">
      <label style="width: 60%;">Действие:</label>
      <select id="action_select_${index}">
        <option value="">-- выберите действие --</option>
        <option value="switch_scene">Переключить на сцену</option>
        <option value="scene_filter_action">Фильтры сцены</option>
        <option value="source_action">Источники сцены</option>
      </select>
    </div>
    <div id="step3_${index}" style="margin-top: 4px;"></div>
  `;
  document.getElementById(`action_select_${index}`).onchange = (e) => handleActionChange(index, sceneName, e.target.value);
}

async function handleActionChange(index, sceneName, action) {
  const step3 = document.getElementById(`step3_${index}`);
  if (!action) return step3.innerHTML = '';

  if (action === 'switch_scene') {
    step3.innerHTML = `<p>Действие: переключение на сцену <strong>${sceneName}</strong></p>`;
  } else if (action === 'scene_filter_action') {
    const res = await window.pywebview.api.get_filters(sceneName);
    if (res.status !== "ok" || res.filters.length === 0) {
      step3.innerHTML = `<div>Фильтры сцены не найдены</div>`;
      return;
    }
    renderFilterSelection(index, res.filters, `step3_${index}`, "scene");
  } else if (action === 'source_action') {
    const res = await window.pywebview.api.get_scene_sources(sceneName);
    if (res.status !== "ok" || res.sources.length === 0) {
      step3.innerHTML = `<div>Ошибка загрузки источников сцены</div>`;
      return;
    }
    renderSourceSelection(index, res.sources);
  }
}

function renderFilterSelection(index, filters, containerId, context) {
  const container = document.getElementById(containerId);
  container.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px;">
      <label style="width: 60%;">Выберите фильтр:</label>
      <select id="filter_select_${index}">
        <option value="">-- выберите фильтр --</option>
        ${filters.map(f => `<option value="${f}">${f}</option>`).join('')}
      </select>
    </div>
    <div id="step6_${index}" style="margin-top: 4px;"></div>
  `;
  document.getElementById(`filter_select_${index}`).onchange = function () {
    const filter = this.value;
    const step4 = document.getElementById(`step6_${index}`);
    if (!filter) return step4.innerHTML = '';

    step4.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <label style="width: 60%;">Действие с фильтром <strong>${filter}</strong>:</label>
        <select id="filter_action_select_${index}">
          <option value="enable">Включить</option>
          <option value="disable">Выключить</option>
        </select>
      </div>
    `;
  };
}

function renderSourceActionSelection(index, source, hasVolume) {
  const step4 = document.getElementById(`step4_${index}`);

  step4.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px;">
      <label style="width: 60%;">Действие с источником <strong>${source}</strong>:</label>
      <select id="source_action_select_${index}">
        <option value="">-- выберите действие --</option>
        <option value="show_hide_source">Показать / Скрыть</option>
        <option value="filter_action">Фильтры источника</option>
        ${hasVolume ? `<option value="volume_control">Изменить громкость</option>` : ''}
      </select>
    </div>
    <div id="step5_${index}" style="margin-top: 4px;"></div>
  `;
  document.getElementById(`source_action_select_${index}`).onchange = (e) =>
    handleSourceAction(index, source, e.target.value);
}

async function renderSourceSelection(index, sources) {
  const step3 = document.getElementById(`step3_${index}`);
  const sourcesWithVolume = {};
  for (const s of sources) {
    try {
      const res = await window.pywebview.api.get_vol(s);
      sourcesWithVolume[s] = res && typeof res.volume === "number";
    } catch (e) {
      sourcesWithVolume[s] = false;
    }
  }
  step3.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px;">
      <label style="width: 60%;">Выберите источник:</label>
      <select id="source_select_${index}">
        <option value="">-- выберите источник --</option>
        ${sources.map(s => `<option value="${s}">${s}</option>`).join('')}
      </select>
    </div>
    <div id="step4_${index}" style="margin-top: 4px;"></div>
  `;
  document.getElementById(`source_select_${index}`).onchange = (e) => {
    const selectedSource = e.target.value;
    if (!selectedSource) return;
    const hasVolume = sourcesWithVolume[selectedSource];
    renderSourceActionSelection(index, selectedSource, hasVolume);
  };
}

function handleSourceChange(index, source) {
  const step4 = document.getElementById(`step4_${index}`);
  if (!source) return step4.innerHTML = '';

  step4.innerHTML = `
    <div style="display:flex; align-items:center; gap:8px;">
      <label style="width: 60%;">Действие с источником <strong>${source}</strong>:</label>
      <select id="source_action_select_${index}">
        <option value="">-- выберите действие --</option>
        <option value="show_hide_source">Показать / Скрыть</option>
        <option value="filter_action">Фильтры источника</option>
        <option value="volume_control">Изменить громкость</option>
      </select>
    </div>
    <div id="step5_${index}" style="margin-top: 4px;"></div>
  `;
  document.getElementById(`source_action_select_${index}`).onchange = (e) =>
    handleSourceAction(index, source, e.target.value);
}

const lastVolumesSent = {};
async function handleSourceAction(index, source, action) {
  const step5 = document.getElementById(`step5_${index}`);
  step5.innerHTML = ''; // очищаем всё при смене действия

  if (!action) return;

  if (action === 'show_hide_source') {
    step5.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px;">
        <label style="width: 60%;">Видимость:</label>
        <select id="visibility_select_${index}">
          <option value="true">Показать</option>
          <option value="false">Скрыть</option>
        </select>
      </div>
    `;

  } else if (action === 'filter_action') {
    const res = await window.pywebview.api.get_filters(source);
    if (res.status !== "ok" || res.filters.length === 0) {
      step5.innerHTML = `<div>Фильтры не найдены</div>`;
      return;
    }
    renderFilterSelection(index, res.filters, `step5_${index}`, "source");

  } else if (action === 'volume_control') {
    const volRes = await window.pywebview.api.get_vol(source);
    if (!volRes || typeof volRes.volume !== "number") {
      step5.innerHTML = `<div>⚠️ У этого источника нет управления громкостью</div>`;
      return;
    }
    const currentVolume = volRes.volume;

    step5.innerHTML = `
      <div style="display:flex; align-items:center; gap:8px; align-items:center;">
        <label style="width: 60%;">Громкость источника:</label>
        <input type="range" min="0" max="100" step="1" value="${currentVolume}" id="volume_slider_${index}">
        <span id="volume_value_${index}">${currentVolume}%</span>
      </div>
    `;

    const slider = document.getElementById(`volume_slider_${index}`);
    const label = document.getElementById(`volume_value_${index}`);

    slider.oninput = () => {
      label.textContent = `${slider.value}%`;
    };
  }
}





async function onSceneSelected(index) {
    const sceneName = document.getElementById(`scene_${index}`).value;
    const res = await window.pywebview.api.get_scene_sources(sceneName);
    const container = document.getElementById(`scene_sources_${index}`);
    if (res.status !== "ok") {
        container.innerHTML = `<div>Не удалось загрузить источники</div>`;
        return;
    }
    const options = res.sources.map(s => `<option value="${s}">${s}</option>`).join('');
    container.innerHTML = `
        <label>Источник:</label>
        <select id="source_${index}" onchange="onSourceSelected(${index})">
            <option value="">-- выберите источник --</option>
            ${options}
        </select>
        <div id="source_filters_${index}"></div>
    `;
}
async function onSourceSelected(index) {
    const sourceName = document.getElementById(`source_${index}`).value;
    if (!sourceName) return;
    const res = await window.pywebview.api.get_filters(sourceName);
    const container = document.getElementById(`source_filters_${index}`);
    if (res.status !== "ok" || res.filters.length === 0) {
        container.innerHTML = `<div>Нет фильтров или ошибка</div>`;
        return;
    }
    const options = res.filters.map(f => `<option value="${f}">${f}</option>`).join('');
    container.innerHTML = `
        <label>Фильтр:</label>
        <select id="filter_${index}">${options}</select>
        <br>
        <button onclick="addFilterToggle(${index}, '${sourceName}', true)">✅ Включить</button>
        <button onclick="addFilterToggle(${index}, '${sourceName}', false)">🚫 Выключить</button>
    `;
}
async function loadFilters(index) {
    const source = document.getElementById(`filter_source_${index}`).value;
    const res = await window.pywebview.api.get_filters(source);
    if (res.status === "ok") {
        const filterSelect = document.getElementById(`filter_filter_${index}`);
        filterSelect.innerHTML = res.filters.map(f => `<option value="${f}">${f}</option>`).join('');
    }
}





// Кнопка включения озвучки
document.addEventListener("DOMContentLoaded", () => {
  if (window.pywebview) {
    pywebview.api.get_tts_enabled().then(enabled => {
      document.getElementById("ttsToggleSwitch").checked = enabled;
    });
  }
});
function onTtsToggle(enabled) {
  if (window.pywebview) {
    pywebview.api.set_tts_enabled(enabled);
  }
}
function updateTtsToggle(enabled) {
  const checkbox = document.getElementById("ttsToggleSwitch");
  checkbox.checked = enabled;
}


// Кнопка включения оверлея
document.addEventListener("DOMContentLoaded", () => {
  console.log("DEBUG: DOMContentLoaded");
  if (!window.pywebview) {
    console.log("DEBUG: pywebview не найден");
    return;
  }
  ['overlay', 'overlay2', 'overlay3'].forEach(name => {
    pywebview.api.get_overlay_enabled(name).then(enabled => {
      console.log(`DEBUG: состояние ${name}: ${enabled}`);
      const el = document.getElementById(name + "Toggle");
      if (el) {
        el.checked = enabled;
        if (enabled) {
          console.log(`DEBUG: запускаем ${name} из JS`);
          window.pywebview.api[`start_${name}`]()
            .then(res => console.log(`${name} started on load:`, res))
            .catch(e => console.error(e));
        }
      }
    });
  });
});

function toggleOverlay(name, enabled) {
  if (!window.pywebview) return;
  window.pywebview.api.set_overlay_enabled(name, enabled)
    .then(() => {
      if (enabled) {
        window.pywebview.api[`start_${name}`]()
          .then(res => console.log(`${name} started on toggle:`, res))
          .catch(e => console.error(e));
      } else {
        window.pywebview.api[`stop_${name}`]()
          .then(res => console.log(`${name} stopped on toggle:`, res))
          .catch(e => console.error(e));
      }
    })
    .catch(err => console.error("set_overlay_enabled error:", err));
}


function updateOverlayToggle(name, enabled) {
  const idMap = {
    overlay: "overlayToggle",
    overlay2: "overlay2Toggle",
    overlay3: "overlay3Toggle"
  };
  const el = document.getElementById(idMap[name]);
  if (el) el.checked = enabled;
  // Запускаем или останавливаем оверлей согласно состоянию
  if (window.pywebview) {
    if (enabled) {
      window.pywebview.api[`start_${name}`]()
        .then(resp => console.log(`${name} started:`, resp))
        .catch(err => console.error(err));
    } else {
      window.pywebview.api[`stop_${name}`]()
        .then(resp => console.log(`${name} stopped:`, resp))
        .catch(err => console.error(err));
    }
  }
}


//автоматическое добавление из плейлиста
const select = document.getElementById("selectPlatform");
const icon = document.getElementById("platformIcon");

select.addEventListener("change", () => {
  const value = select.value;
  if (value === "vk") icon.src = "svg/vk.png";
  else if (value === "twitch") icon.src = "svg/Twitch.png";
});


// Элементы управления
const rolesList = document.getElementById("rolesList");
const btnAddRole = document.getElementById("btnAddRole");
const modalAddRole = document.getElementById("modalAddRole");
const inputRoleName = document.getElementById("inputRoleName");
const confirmAddRole = document.getElementById("configAddRole");
const cancelAddRole = document.getElementById("cancelAddRole");
const selectPlatform = document.getElementById("selectPlatform");

// Инициализация пустой структуры
let roles_by_platform = {
  vk: [],
  twitch: []
};

const iconOptions = [
  "001.png",
  "002.png",
  "003.png",
  "004.png",
  "005.png",
  "006.png",
  "007.png",
  "008.png",
  "009.png"
];

function updateRolesUI() {
  rolesList.innerHTML = "";
  const orderedPlatforms = ["vk", "twitch"];
  let globalIndex = 0;

  for (const platform of orderedPlatforms) {
    let users = roles_by_platform[platform] || [];

    users = users.map(u => {
      if (typeof u === "string") return { nick: u, icon: "001.png" };
      if (typeof u === "object" && u.nick) return u;
      return null;
    }).filter(Boolean);

    users = [...users].sort((a, b) => a.nick.localeCompare(b.nick));
    users.forEach(user => {
      const li = document.createElement("li");
      li.style.display = "flex";
      li.style.justifyContent = "space-between";
      li.style.alignItems = "center";
      li.style.padding = "0px 4px";
      li.style.margin = "2px 1px";
      li.style.fontWeight = "600";
      li.style.backgroundColor = globalIndex % 2 === 0 ? "rgba(40, 40, 40, 0.8)" : "transparent";
      const spanNick = document.createElement("span");
      const platformIcon = platform === "vk" ? "vk.png" : "twitch.png";
      spanNick.innerHTML = `
        <img src="svg/${platformIcon}" style="width: 24px; vertical-align: middle;  margin-top: -5px;">
        ${user.nick}
      `;

//<img src="moder/${user.icon || "001.png"}" style="width: 20px; vertical-align: middle; margin-right: 6px;">

      const rightContainer = document.createElement("div");
      rightContainer.style.display = "flex";
      rightContainer.style.alignItems = "center";
      const iconDropdown = createIconDropdown(user.icon || "001.png", (newIcon) => {
        const updatedUsers = roles_by_platform[platform].map(u =>
          u.nick === user.nick ? { ...u, icon: newIcon } : u
        );
        roles_by_platform = {
          ...roles_by_platform,
          [platform]: updatedUsers
        };
        saveRolesToConfig()
          .then(response => {
            if (response.status === "ok") {
              updateRolesUI();
              console.log("Роли успешно сохранены и обновлены");
            } else {
              console.error("Ошибка сохранения ролей:", response.message);
            }
          })
          .catch(err => console.error("Ошибка при сохранении ролей:", err));
      });
      iconDropdown.style.marginRight = "12px";
      const btnDel = document.createElement("button");
      btnDel.textContent = "Удалить";
      btnDel.style.fontWeight = "bold";
      btnDel.className = "btn-danger btn-sm";
      btnDel.onclick = () => {
        showDeleteModal(user.nick, platform);
      };

      rightContainer.appendChild(iconDropdown);
      rightContainer.appendChild(btnDel);
      li.appendChild(spanNick);
      li.appendChild(rightContainer);
      rolesList.appendChild(li);

      globalIndex++;
    });
  }
}

// Возвращаем Promise для корректной работы then/catch
function saveRolesToConfig() {
  return window.pywebview.api.set_roles_by_platform(roles_by_platform);
}

// Добавление новой роли
btnAddRole.onclick = () => {
  inputRoleName.value = "";
  modalAddRole.style.display = "flex";
};

confirmAddRole.onclick = () => {
  const nick = inputRoleName.value.trim();
  const platform = selectPlatform.value;
  if (nick && !roles_by_platform[platform]?.some(u => u.nick === nick)) {
    if (!roles_by_platform[platform]) roles_by_platform[platform] = [];
    // Создаём новый массив с добавленной ролью
    roles_by_platform = {
      ...roles_by_platform,
      [platform]: [...roles_by_platform[platform], { nick, icon: "001.png" }]
    };
    updateRolesUI(roles_by_platform);
    saveRolesToConfig()
      .then(response => {
        if (response.status === "ok") {
          console.log("Роль добавлена и сохранена");
        } else {
          console.error("Ошибка сохранения ролей:", response.message);
        }
      })
      .catch(err => console.error("Ошибка при сохранении ролей:", err));
  }
  modalAddRole.style.display = "none";
};

cancelAddRole.onclick = () => {
  modalAddRole.style.display = "none";
};

function createIconDropdown(currentIcon, onChange) {
  const container = document.createElement("div");
  container.style.position = "relative";
  container.style.width = "90px";

  const selected = document.createElement("div");
  selected.style.display = "flex";
  selected.style.alignItems = "center";
  selected.style.cursor = "pointer";
  selected.style.backgroundColor = "#333";
  selected.style.padding = "2px 6px";
  selected.style.borderRadius = "4px";
  selected.style.color = "white";
  selected.style.userSelect = "none";
  selected.style.width = "60px";

  const imgSelected = document.createElement("img");
  imgSelected.src = `svg/${currentIcon}`;
  imgSelected.style.width = "20px";
  imgSelected.style.marginRight = "6px";
  selected.appendChild(imgSelected);

  const arrow = document.createElement("span");
  arrow.textContent = "▼";
  arrow.style.fontSize = "10px";
  arrow.style.marginLeft = "auto";
  selected.appendChild(arrow);

  container.appendChild(selected);

  const dropdown = document.createElement("div");
  dropdown.style.position = "absolute";
  dropdown.style.top = "100%";
  dropdown.style.left = "0";
  dropdown.style.backgroundColor = "#222";
  dropdown.style.border = "1px solid #555";
  dropdown.style.borderRadius = "4px";
  dropdown.style.marginTop = "2px";
  dropdown.style.zIndex = "1000";
  dropdown.style.display = "none";
  dropdown.style.maxHeight = "150px";
  dropdown.style.overflowY = "auto";

  iconOptions.forEach(icon => {
    const option = document.createElement("div");
    option.style.padding = "4px 6px";
    option.style.display = "flex";
    option.style.alignItems = "center";
    option.style.cursor = "pointer";
    option.style.color = "white";

    const img = document.createElement("img");
    img.src = `svg/${icon}`;
    img.style.width = "20px";
    img.style.marginRight = "6px";
    option.appendChild(img);

    option.onmouseenter = () => option.style.backgroundColor = "#444";
    option.onmouseleave = () => option.style.backgroundColor = "transparent";

    option.onclick = () => {
      imgSelected.src = `svg/${icon}`;
      dropdown.style.display = "none";

      setTimeout(() => {
        onChange(icon);
      }, 0);
    };

    dropdown.appendChild(option);
  });

  container.appendChild(dropdown);

  selected.onclick = () => {
    dropdown.style.display = dropdown.style.display === "none" ? "block" : "none";
  };

  // Закрывать дропдаун при клике вне
  document.addEventListener("click", e => {
    if (!container.contains(e.target)) {
      dropdown.style.display = "none";
    }
  });

  return container;
}

// Модалка подтверждения удаления
const modalConfirmDelete = document.getElementById("modalConfirmDelete");
const deleteMessage = document.getElementById("deleteMessage");
const confirmDeleteBtn = document.getElementById("confirmDelete");
const cancelDeleteBtn = document.getElementById("cancelDelete");

let pendingDelete = { nick: "", platform: "" };

function showDeleteModal(nick, platform) {
  pendingDelete.nick = nick;
  pendingDelete.platform = platform;
  deleteMessage.textContent = `Удалить ${nick} с платформы ${platform}?`;
  modalConfirmDelete.style.display = "flex";
}

confirmDeleteBtn.onclick = () => {
  const { nick, platform } = pendingDelete;
  roles_by_platform[platform] = roles_by_platform[platform].filter(u => u.nick !== nick);
  updateRolesUI(roles_by_platform);
  saveRolesToConfig();
  modalConfirmDelete.style.display = "none";
};

cancelDeleteBtn.onclick = () => {
  modalConfirmDelete.style.display = "none";
};

// Загрузка данных при старте
function waitForPywebviewApi(callback) {
    if (window.pywebview && window.pywebview.api && window.pywebview.api.get_roles_by_platform) {
        console.log("🚀 pywebview API найден");
        callback();
    } else {
        console.log("⏳ Ожидание pywebview.api...");
        setTimeout(() => waitForPywebviewApi(callback), 100);
    }
}

waitForPywebviewApi(() => {
    window.pywebview.api.get_roles_by_platform()
    .then(data => {
        console.log("🔧 Полученные роли из Python:", data);
        if (data && typeof data === 'object') {
            roles_by_platform = data;
            updateRolesUI(roles_by_platform);
        } else {
            console.error("❌ Некорректные данные из Python:", data);
        }
    }).catch(err => {
        console.error("❌ Ошибка при получении ролей:", err);
    });
});



//Настройки озвучки сообщений
function updateTtsRateSlider(rate) {
    const slider = document.getElementById("ttsRateSlider");
    const label = document.getElementById("ttsRateLabel");

    slider.value = rate;
    label.innerText = rate;
}
document.getElementById("ttsRateSlider").addEventListener("input", function(e) {
    const rate = parseInt(e.target.value);
    document.getElementById("ttsRateLabel").innerText = rate;
    if (window.pywebview) {
        pywebview.api.set_tts_rate(rate);
    }
});

document.addEventListener("DOMContentLoaded", () => {
  if (window.pywebview) {
    pywebview.api.get_tts_settings().then(settings => {
      updateTtsVolumeSlider(settings.tts_volume);
      updateVoiceSelect(settings.tts_voice);
      updateTtsRateSlider(settings.tts_rate);
    });
  }
    const toggles = document.querySelectorAll("h2.toggle");
    toggles.forEach(toggle => {
      toggle.addEventListener("click", () => {
        const next = toggle.nextElementSibling;
        next.classList.toggle("open");
      });
    });
});
function updateTtsVolumeSlider(volume) {
    const slider = document.getElementById("ttsVolumeSlider");
    const label = document.getElementById("ttsVolumeLabel");

    slider.value = volume * 100;
    label.innerText = Math.round(volume * 100);
}
function updateVoiceSelect(voice) {
    const select = document.getElementById("voiceSelect");
    select.value = voice;
}
document.getElementById("ttsVolumeSlider").addEventListener("input", function(e) {
    const vol = parseInt(e.target.value);
    document.getElementById("ttsVolumeLabel").innerText = vol;
    if (window.pywebview) {
        pywebview.api.set_tts_volume(vol / 100);
    }
});
document.getElementById("voiceSelect").addEventListener("change", function(e) {
    if (window.pywebview) {
        pywebview.api.set_tts_voice(e.target.value);
    }
});
function testTts() {
    if (window.pywebview) {
        pywebview.api.say("Тест озвучки сообщения");
    }
}



function showAddToPlaylistModal() {
  document.getElementById("addToPlaylistModal").classList.add("active");
}
function hideAddToPlaylistModal() {
  document.getElementById("addToPlaylistModal").classList.remove("active");
}
document.getElementById("btnCancelAddToPlaylist").onclick = hideAddToPlaylistModal;


function selectStyle(styleId) {
  // Сразу применяем стиль локально, чтобы не ждать pywebview
  applyStyle(styleId);
  // Вызываем запись стиля (оставляем как есть)
  window.pywebview.api.setStyle(styleId);
  // Обновляем UI выделение
  document.querySelectorAll('.style-box').forEach(el => el.classList.remove('selected'));
  const selectedBox = document.querySelector(`.style-box[data-style="${styleId}"]`);
  if (selectedBox) selectedBox.classList.add('selected');
}


  // Обновить интерфейс по стилю (например, фон)
function applyStyle(styleId) {
  const root = document.documentElement;

  if (styleId === 1) {
    root.style.setProperty('--primary-color', '#d9a000');
    root.style.setProperty('--primary-color-translucent', '#d9a00082');
    root.style.setProperty('--primary-text', '#000');
    root.style.setProperty('--btn-primary-bg-color', '#ffbc00');
    root.style.setProperty('--btn-primary-bg-gradient', 'linear-gradient(to bottom left, #ffa700, #7e5c00, #ffa100)');
    root.style.setProperty('--btn-primary-text-color', '#000');
    root.style.setProperty('--btn-primary-hover-bg-color', '#d9a000');
    root.style.setProperty('--btn-primary-hover-bg-gradient', 'linear-gradient(to bottom left, #ffbc00, #d9a000, #ffbc00)');
    root.style.setProperty('--btn-primary-hover-text-color', '#000');
    root.style.setProperty('--btn-16-background', 'linear-gradient(to bottom left, #ffad12, #bd8a00, #ffa915)');
    root.style.setProperty('--btn-16-after-background', '#e2a700');
    root.style.setProperty('--range-start-color', '#886300');
    root.style.setProperty('--range-end-color', '#ffbc00');
    root.style.setProperty('--favorites-scrollbar-thumb', '#ff9900');
    root.style.setProperty('--favorites-scrollbar-track', '#2b2b2b');
    root.style.setProperty('--favorite-item-hover-color', '#e0c146');
    root.style.setProperty('--favorite-item-shadow-color', 'rgba(255, 165, 0, 0.5)');
    root.style.setProperty('--on-hue1', '45');
    root.style.setProperty('--on-hue2', '55');

  } else if (styleId === 2) {
    root.style.setProperty('--primary-color', '#ae7cf7');
    root.style.setProperty('--primary-color-translucent', '#873ff080');
    root.style.setProperty('--primary-text', '#fff');
    root.style.setProperty('--btn-primary-bg-color', '#8b48ee');
    root.style.setProperty('--btn-primary-bg-gradient', 'linear-gradient(to bottom left, #8d46f5, #7121e4, #8b48ee)');
    root.style.setProperty('--btn-primary-text-color', '#fff');
    root.style.setProperty('--btn-primary-hover-bg-color', '#7121e4');
    root.style.setProperty('--btn-primary-hover-bg-gradient', 'linear-gradient(to bottom left, #7a39d1, #ae7cf7, #7a39d1)');
    root.style.setProperty('--btn-primary-hover-text-color', '#fff');
    root.style.setProperty('--btn-16-background', 'linear-gradient(to bottom left, #8d46f5, #7121e4, #8b48ee)');
    root.style.setProperty('--btn-16-after-background', '#7a39d1');
    root.style.setProperty('--range-start-color', '#6f3ed1');
    root.style.setProperty('--range-end-color', '#a17ff7');
    root.style.setProperty('--favorites-scrollbar-thumb', '#ae7cf7');
    root.style.setProperty('--favorites-scrollbar-track', '#1a1a1a');
    root.style.setProperty('--favorite-item-hover-color', '#b6a8f7');
    root.style.setProperty('--favorite-item-shadow-color', 'rgba(150, 79, 253, 0.5)');
    root.style.setProperty('--on-hue1', '270');
    root.style.setProperty('--on-hue2', '280');

  } else if (styleId === 3) {
    root.style.setProperty('--primary-color', '#5181b8');
    root.style.setProperty('--primary-color-translucent', '#5181b880');
    root.style.setProperty('--primary-text', '#fff');
    root.style.setProperty('--btn-primary-bg-color', '#5181b8');
    root.style.setProperty('--btn-primary-bg-gradient', 'linear-gradient(to bottom left, #37598a, #5181b8)');
    root.style.setProperty('--btn-primary-text-color', '#fff');
    root.style.setProperty('--btn-primary-hover-bg-color', '#3e6499');
    root.style.setProperty('--btn-primary-hover-bg-gradient', 'linear-gradient(to bottom left, #37598a, #3e6499, #37598a)');
    root.style.setProperty('--btn-primary-hover-text-color', '#fff');
    root.style.setProperty('--btn-16-background', 'linear-gradient(to bottom left, #37598a, #5181b8)');
    root.style.setProperty('--btn-16-after-background', '#3e6499');
    root.style.setProperty('--range-start-color', '#37598a');
    root.style.setProperty('--range-end-color', '#6a8cc9');
    root.style.setProperty('--favorites-scrollbar-thumb', '#5181b8');
    root.style.setProperty('--favorites-scrollbar-track', '#1a1a1a');
    root.style.setProperty('--favorite-item-hover-color', '#7a94c3');
    root.style.setProperty('--favorite-item-shadow-color', 'rgba(81, 129, 184, 0.5)');
    root.style.setProperty('--on-hue1', '210');
    root.style.setProperty('--on-hue2', '220');

  } else if (styleId === 4) {
    root.style.setProperty('--primary-color', '#00bfa5');
    root.style.setProperty('--primary-color-translucent', '#00bfa580');
    root.style.setProperty('--primary-text', '#fff');
    root.style.setProperty('--btn-primary-bg-color', '#00c8b3');
    root.style.setProperty('--btn-primary-bg-gradient', 'linear-gradient(to bottom left, #00d3b8, #00796b)');
    root.style.setProperty('--btn-primary-text-color', '#fff');
    root.style.setProperty('--btn-primary-hover-bg-color', '#009e89');
    root.style.setProperty('--btn-primary-hover-bg-gradient', 'linear-gradient(to bottom left, #00bfa5, #00796b)');
    root.style.setProperty('--btn-primary-hover-text-color', '#fff');
    root.style.setProperty('--btn-16-background', 'linear-gradient(to bottom left, #00796b, #00d3b8)');
    root.style.setProperty('--btn-16-after-background', '#009e89');
    root.style.setProperty('--range-start-color', '#00897b');
    root.style.setProperty('--range-end-color', '#00d8c4');
    root.style.setProperty('--favorites-scrollbar-thumb', '#00bfa5');
    root.style.setProperty('--favorites-scrollbar-track', '#1a1a1a');
    root.style.setProperty('--favorite-item-hover-color', '#33e6cf');
    root.style.setProperty('--favorite-item-shadow-color', 'rgba(0, 191, 165, 0.4)');
    root.style.setProperty('--on-hue1', '170');
    root.style.setProperty('--on-hue2', '180');

  } else if (styleId === 5) {
    root.style.setProperty('--primary-color', '#ff6f61');
    root.style.setProperty('--primary-color-translucent', '#ff6f6180');
    root.style.setProperty('--primary-text', '#fff');
    root.style.setProperty('--btn-primary-bg-color', '#ff7a70');
    root.style.setProperty('--btn-primary-bg-gradient', 'linear-gradient(to bottom left, #ff8c7a, #e64c3c)');
    root.style.setProperty('--btn-primary-text-color', '#fff');
    root.style.setProperty('--btn-primary-hover-bg-color', '#e64c3c');
    root.style.setProperty('--btn-primary-hover-bg-gradient', 'linear-gradient(to bottom left, #ff6f61, #b03a2e)');
    root.style.setProperty('--btn-primary-hover-text-color', '#fff');
    root.style.setProperty('--btn-16-background', 'linear-gradient(to bottom left, #ff857c, #ff6f61)');
    root.style.setProperty('--btn-16-after-background', '#d1443a');
    root.style.setProperty('--range-start-color', '#c43e35');
    root.style.setProperty('--range-end-color', '#ff9990');
    root.style.setProperty('--favorites-scrollbar-thumb', '#ff6f61');
    root.style.setProperty('--favorites-scrollbar-track', '#2b2b2b');
    root.style.setProperty('--favorite-item-hover-color', '#ffb2a9');
    root.style.setProperty('--favorite-item-shadow-color', 'rgba(255, 111, 97, 0.4)');
    root.style.setProperty('--on-hue1', '10');
    root.style.setProperty('--on-hue2', '20');
  
} else if (styleId === 6) {
  // 🌊 Глубокая лагуна (между 3 и 4 стилем)
  root.style.setProperty('--primary-color', '#2196f3'); // лазурный (чуть ярче, ближе к морской синеве)
  root.style.setProperty('--primary-color-translucent', '#2196f380');
  root.style.setProperty('--primary-text', '#ffffff'); // отлично читается
  root.style.setProperty('--btn-primary-bg-color', '#1cb0f6');
  root.style.setProperty('--btn-primary-bg-gradient', 'linear-gradient(to bottom left, #00c4ff, #0077c2)');
  root.style.setProperty('--btn-primary-text-color', '#ffffff');
  root.style.setProperty('--btn-primary-hover-bg-color', '#008dd1');
  root.style.setProperty('--btn-primary-hover-bg-gradient', 'linear-gradient(to bottom left, #00e0ff, #005eaa)');
  root.style.setProperty('--btn-primary-hover-text-color', '#ffffff');
  root.style.setProperty('--btn-16-background', 'linear-gradient(to bottom left, #00c4ff, #2196f3)');
  root.style.setProperty('--btn-16-after-background', '#0077c2');
  root.style.setProperty('--range-start-color', '#00bcd4');
  root.style.setProperty('--range-end-color', '#64b5f6');
  root.style.setProperty('--favorites-scrollbar-thumb', '#00b0ff');
  root.style.setProperty('--favorites-scrollbar-track', '#1a1a1a');
  root.style.setProperty('--favorite-item-hover-color', '#a2d9ff');
  root.style.setProperty('--favorite-item-shadow-color', 'rgba(33, 150, 243, 0.4)');
  root.style.setProperty('--on-hue1', '200');
  root.style.setProperty('--on-hue2', '210');

  } else if (styleId === 7) {
    // 🍃 Лесной стиль
    root.style.setProperty('--primary-color', '#4caf50');
    root.style.setProperty('--primary-color-translucent', '#4caf5080');
    root.style.setProperty('--primary-text', '#fff');
    root.style.setProperty('--btn-primary-bg-color', '#43a047');
    root.style.setProperty('--btn-primary-bg-gradient', 'linear-gradient(to bottom left, #66bb6a, #388e3c)');
    root.style.setProperty('--btn-primary-text-color', '#fff');
    root.style.setProperty('--btn-primary-hover-bg-color', '#388e3c');
    root.style.setProperty('--btn-primary-hover-bg-gradient', 'linear-gradient(to bottom left, #4caf50, #2e7d32)');
    root.style.setProperty('--btn-primary-hover-text-color', '#fff');
    root.style.setProperty('--btn-16-background', 'linear-gradient(to bottom left, #43a047, #66bb6a)');
    root.style.setProperty('--btn-16-after-background', '#388e3c');
    root.style.setProperty('--range-start-color', '#2e7d32');
    root.style.setProperty('--range-end-color', '#81c784');
    root.style.setProperty('--favorites-scrollbar-thumb', '#43a047');
    root.style.setProperty('--favorites-scrollbar-track', '#1a1a1a');
    root.style.setProperty('--favorite-item-hover-color', '#a5d6a7');
    root.style.setProperty('--favorite-item-shadow-color', 'rgba(76, 175, 80, 0.4)');
    root.style.setProperty('--on-hue1', '120');
    root.style.setProperty('--on-hue2', '130');

  } else if (styleId === 8) {
    // 🦄 Радужный стиль
    root.style.setProperty('--primary-color', '#e91e63');
    root.style.setProperty('--primary-color-translucent', '#e91e6380');
    root.style.setProperty('--primary-text', '#fff');
    root.style.setProperty('--btn-primary-bg-color', '#ff4081');
    root.style.setProperty('--btn-primary-bg-gradient', 'linear-gradient(to bottom left, #ff4081, #7c4dff, #00bcd4)');
    root.style.setProperty('--btn-primary-text-color', '#fff');
    root.style.setProperty('--btn-primary-hover-bg-color', '#d81b60');
    root.style.setProperty('--btn-primary-hover-bg-gradient', 'linear-gradient(to bottom left, #e91e63, #7c4dff)');
    root.style.setProperty('--btn-primary-hover-text-color', '#fff');
    root.style.setProperty('--btn-16-background', 'linear-gradient(to bottom left, #ff4081, #7c4dff)');
    root.style.setProperty('--btn-16-after-background', '#c2185b');
    root.style.setProperty('--range-start-color', '#ff4081');
    root.style.setProperty('--range-end-color', '#7c4dff');
    root.style.setProperty('--favorites-scrollbar-thumb', '#e91e63');
    root.style.setProperty('--favorites-scrollbar-track', '#1a1a1a');
    root.style.setProperty('--favorite-item-hover-color', '#f8bbd0');
    root.style.setProperty('--favorite-item-shadow-color', 'rgba(233, 30, 99, 0.4)');
    root.style.setProperty('--on-hue1', '320');
    root.style.setProperty('--on-hue2', '330');

  } else if (styleId === 9) {
    root.style.setProperty('--primary-color', '#ff7043');
    root.style.setProperty('--primary-color-translucent', '#ff704380');
    root.style.setProperty('--primary-text', '#000');
    root.style.setProperty('--btn-primary-bg-color', '#ff8a65');
    root.style.setProperty('--btn-primary-bg-gradient', 'linear-gradient(to bottom left, #ff7043, #d84315)');
    root.style.setProperty('--btn-primary-text-color', '#000');
    root.style.setProperty('--btn-primary-hover-bg-color', '#f4511e');
    root.style.setProperty('--btn-primary-hover-bg-gradient', 'linear-gradient(to bottom left, #ff8a65, #d84315)');
    root.style.setProperty('--btn-primary-hover-text-color', '#000');
    root.style.setProperty('--btn-16-background', 'linear-gradient(to bottom left, #ff7043, #ff5722)');
    root.style.setProperty('--btn-16-after-background', '#d84315');
    root.style.setProperty('--range-start-color', '#ff7043');
    root.style.setProperty('--range-end-color', '#ffa270');
    root.style.setProperty('--favorites-scrollbar-thumb', '#ff7043');
    root.style.setProperty('--favorites-scrollbar-track', '#2b2b2b');
    root.style.setProperty('--favorite-item-hover-color', '#ffab91');
    root.style.setProperty('--favorite-item-shadow-color', 'rgba(255, 112, 67, 0.4)');
    root.style.setProperty('--on-hue1', '18');
    root.style.setProperty('--on-hue2', '25');

  } else if (styleId === 10) {
    root.style.setProperty('--primary-color', '#00796b'); // более тёмный зелёный
    root.style.setProperty('--primary-color-translucent', '#00796b80');
    root.style.setProperty('--primary-text', '#fff');
    root.style.setProperty('--btn-primary-bg-color', '#004d40'); // ещё темнее
    root.style.setProperty('--btn-primary-bg-gradient', 'linear-gradient(to bottom left, #00796b, #004d40)');
    root.style.setProperty('--btn-primary-text-color', '#fff');
    root.style.setProperty('--btn-primary-hover-bg-color', '#00695c'); // оттенок для ховера
    root.style.setProperty('--btn-primary-hover-bg-gradient', 'linear-gradient(to bottom left, #004d40, #00695c)');
    root.style.setProperty('--btn-primary-hover-text-color', '#fff');
    root.style.setProperty('--btn-16-background', 'linear-gradient(to bottom left, #004d40, #00695c)');
    root.style.setProperty('--btn-16-after-background', '#004d40');
    root.style.setProperty('--range-start-color', '#00695c');
    root.style.setProperty('--range-end-color', '#009688'); // немного светлее в градиенте
    root.style.setProperty('--favorites-scrollbar-thumb', '#00695c');
    root.style.setProperty('--favorites-scrollbar-track', '#121212');
    root.style.setProperty('--favorite-item-hover-color', '#00897b');
    root.style.setProperty('--favorite-item-shadow-color', 'rgba(0, 105, 92, 0.4)');
    root.style.setProperty('--on-hue1', '150');
    root.style.setProperty('--on-hue2', '160');

  } else if (styleId === 11) {
    root.style.setProperty('--primary-color', '#3f51b5'); // насыщенный синий
    root.style.setProperty('--primary-color-translucent', '#3f51b580');
    root.style.setProperty('--primary-text', '#fff');
    root.style.setProperty('--btn-primary-bg-color', '#303f9f');
    root.style.setProperty('--btn-primary-bg-gradient', 'linear-gradient(to bottom left, #3f51b5, #283593)');
    root.style.setProperty('--btn-primary-text-color', '#fff');
    root.style.setProperty('--btn-primary-hover-bg-color', '#283593');
    root.style.setProperty('--btn-primary-hover-bg-gradient', 'linear-gradient(to bottom left, #303f9f, #1a237e)');
    root.style.setProperty('--btn-primary-hover-text-color', '#fff');
    root.style.setProperty('--btn-16-background', 'linear-gradient(to bottom left, #3f51b5, #303f9f)');
    root.style.setProperty('--btn-16-after-background', '#1a237e');
    root.style.setProperty('--range-start-color', '#283593');
    root.style.setProperty('--range-end-color', '#7986cb');
    root.style.setProperty('--favorites-scrollbar-thumb', '#3f51b5');
    root.style.setProperty('--favorites-scrollbar-track', '#2b2b2b');
    root.style.setProperty('--favorite-item-hover-color', '#9fa8da');
    root.style.setProperty('--favorite-item-shadow-color', 'rgba(63, 81, 181, 0.4)');
    root.style.setProperty('--on-hue1', '225');
    root.style.setProperty('--on-hue2', '230');

  } else if (styleId === 12) {
    root.style.setProperty('--primary-color', '#a1887f'); // светлее коричневый
    root.style.setProperty('--primary-color-translucent', '#a1887f80');
    root.style.setProperty('--primary-text', '#000'); // сменил на тёмный текст для контраста
    root.style.setProperty('--btn-primary-bg-color', '#bcaaa4');
    root.style.setProperty('--btn-primary-bg-gradient', 'linear-gradient(to bottom left, #a1887f, #8d6e63)');
    root.style.setProperty('--btn-primary-text-color', '#000');
    root.style.setProperty('--btn-primary-hover-bg-color', '#8d6e63');
    root.style.setProperty('--btn-primary-hover-bg-gradient', 'linear-gradient(to bottom left, #bcaaa4, #6d4c41)');
    root.style.setProperty('--btn-primary-hover-text-color', '#000');
    root.style.setProperty('--btn-16-background', 'linear-gradient(to bottom left, #a1887f, #bcaaa4)');
    root.style.setProperty('--btn-16-after-background', '#6d4c41');
    root.style.setProperty('--range-start-color', '#8d6e63');
    root.style.setProperty('--range-end-color', '#d7ccc8');
    root.style.setProperty('--favorites-scrollbar-thumb', '#a1887f');
    root.style.setProperty('--favorites-scrollbar-track', '#1a1a1a');
    root.style.setProperty('--favorite-item-hover-color', '#d7ccc8');
    root.style.setProperty('--favorite-item-shadow-color', 'rgba(161, 136, 127, 0.4)');
    root.style.setProperty('--on-hue1', '20');
    root.style.setProperty('--on-hue2', '25');

  } else if (styleId === 13) {
    root.style.setProperty('--primary-color', '#607d8b'); // серо-голубой из CSS
    root.style.setProperty('--primary-color-translucent', '#607d8b80');
    root.style.setProperty('--primary-text', '#fff');
    root.style.setProperty('--btn-primary-bg-color', '#546e7a');
    root.style.setProperty('--btn-primary-bg-gradient', 'linear-gradient(to bottom left, #607d8b, #455a64)');
    root.style.setProperty('--btn-primary-text-color', '#fff');
    root.style.setProperty('--btn-primary-hover-bg-color', '#455a64');
    root.style.setProperty('--btn-primary-hover-bg-gradient', 'linear-gradient(to bottom left, #546e7a, #263238)');
    root.style.setProperty('--btn-primary-hover-text-color', '#fff');
    root.style.setProperty('--btn-16-background', 'linear-gradient(to bottom left, #607d8b, #546e7a)');
    root.style.setProperty('--btn-16-after-background', '#263238');
    root.style.setProperty('--range-start-color', '#546e7a');
    root.style.setProperty('--range-end-color', '#90a4ae');
    root.style.setProperty('--favorites-scrollbar-thumb', '#607d8b');
    root.style.setProperty('--favorites-scrollbar-track', '#1a1a1a');
    root.style.setProperty('--favorite-item-hover-color', '#b0bec5');
    root.style.setProperty('--favorite-item-shadow-color', 'rgba(96, 125, 139, 0.4)');
    root.style.setProperty('--on-hue1', '190');
    root.style.setProperty('--on-hue2', '200');
  }
}


// Настройка названий наград
function reward_clip() {
  const val = document.getElementById("reward_clip").value;
  window.pywebview.api.setRewardClip(val);
}
function reward_clip_out() {
  const val = document.getElementById("reward_clip_out").value;
  window.pywebview.api.setRewardClipOut(val);
}
function updateRewardClip(val) {
  document.getElementById("reward_clip").value = val;
}
function updateRewardClipOut(val) {
  document.getElementById("reward_clip_out").value = val;
}


function reward_science() {
  const val = document.getElementById("reward_science").value;
  window.pywebview.api.setRewardScience(val);
}
function updateRewardScience(val) {
  document.getElementById("reward_science").value = val;
}
function reward_history() {
  const val = document.getElementById("reward_history").value;
  window.pywebview.api.setRewardHistory(val);
}
function updateRewardHistory(val) {
  document.getElementById("reward_history").value = val;
}


function reward_fact() {
  const val = document.getElementById("reward_fact").value;
  window.pywebview.api.setRewardFact(val);
}
function updateRewardFact(val) {
  document.getElementById("reward_fact").value = val;
}

function reward_joke() {
  const val = document.getElementById("reward_joke").value;
  window.pywebview.api.setRewardJoke(val);
}
function updateRewardJoke(val) {
  document.getElementById("reward_joke").value = val;
}

function reward_aphorism() {
  const val = document.getElementById("reward_aphorism").value;
  window.pywebview.api.setRewardAphorism(val);
}
function updateRewardAphorism(val) {
  document.getElementById("reward_aphorism").value = val;
}

function window1_width() {
  const val = document.getElementById("window1_width").value;
  window.pywebview.api.setWindow1_Width(val);
}
function updateWindow1_Width(val) {
  document.getElementById("window1_width").value = val;
}
function window1_height() {
  const val = document.getElementById("window1_height").value;
  window.pywebview.api.setWindow1_Height(val);
}
function updateWindow1_Height(val) {
  document.getElementById("window1_height").value = val;
}
function window2_width() {
  const val = document.getElementById("window2_width").value;
  window.pywebview.api.setWindow2_Width(val);
}
function updateWindow2_Width(val) {
  document.getElementById("window2_width").value = val;
}
function window2_height() {
  const val = document.getElementById("window2_height").value;
  window.pywebview.api.setWindow2_Height(val);
}
function updateWindow2_Height(val) {
  document.getElementById("window2_height").value = val;
}


// Спам фильтр
function updateSpamThresholds() {
  try {
    const thresholds = {
      char_repeat_threshold: parseInt(document.getElementById("char_repeat_threshold").value) || 3,
      word_repeat_sequence_length: parseInt(document.getElementById("word_repeat_sequence_length").value) || 4,
      phrase_repeat_threshold: parseInt(document.getElementById("phrase_repeat_threshold").value) || 3,
      special_char_repeat_threshold: parseInt(document.getElementById("special_char_repeat_threshold").value) || 4,
      max_emojis_total: parseInt(document.getElementById("max_emojis_total").value) || 4,
      emoji_repeat_threshold: parseInt(document.getElementById("emoji_repeat_threshold").value) || 4,
    };
    window.pywebview.api.setSpamThresholds(thresholds);
  } catch (err) {
    console.error("Ошибка при отправке параметров в Python:", err);
  }
}

function updateSpamSettings(thresholds) {
  try {
    document.getElementById("char_repeat_threshold").value = thresholds.char_repeat_threshold;
    document.getElementById("word_repeat_sequence_length").value = thresholds.word_repeat_sequence_length;
    document.getElementById("phrase_repeat_threshold").value = thresholds.phrase_repeat_threshold;
    document.getElementById("special_char_repeat_threshold").value = thresholds.special_char_repeat_threshold;
    document.getElementById("max_emojis_total").value = thresholds.max_emojis_total;
    document.getElementById("emoji_repeat_threshold").value = thresholds.emoji_repeat_threshold;
  } catch (e) {
    console.error("Ошибка при установке значений из Python:", e);
  }
}


// Настройка озвучки
function reward_voice() {
  const val = document.getElementById("reward_voice").value;
  window.pywebview.api.setRewardVoice(val);
}
function updateRewardVoice(val) {
  document.getElementById("reward_voice").value = val;
}

function tts_text() {
  const val = document.getElementById("tts_text").value;
  window.pywebview.api.setTtsText(val);
}
function tts_scream() {
  const val = document.getElementById("tts_scream").value;
  window.pywebview.api.setTtsScream(val);
}
function tts_text_raid() {
  const val = document.getElementById("tts_text_raid").value;
  window.pywebview.api.setTtsTextRaid(val);
}
function site_text() {
  const val = document.getElementById("site_text").value;
  window.pywebview.api.setSiteText(val);
}
function welcome_portal() {
  const val = document.getElementById("welcome_portal").value;
  window.pywebview.api.setWelcomePortal(val);
}
function updateTtsText(val) {
  document.getElementById("tts_text").value = val;
}
function updateTtsScream(val) {
  document.getElementById("tts_scream").value = val;
}
function updateTtsTextRaid(val) {
  document.getElementById("tts_text_raid").value = val;
}
function updateSiteText(val) {
  document.getElementById("site_text").value = val;
}
function updateWelcomePortal(val) {
  document.getElementById("welcome_portal").value = val;
}

function onCollectViewersChange() {
  const val = document.getElementById("collect_viewers").checked ? 1 : 0;
  window.pywebview.api.setCollectViewers(val);
}
function onTtsClipChange() {
  const val = document.getElementById("tts_clip").checked ? 1 : 0;
  window.pywebview.api.setTtsClip(val);
}
function onStatSenderChange() {
  const val = document.getElementById("stat_sender").checked ? 1 : 0;
  window.pywebview.api.setStatSender(val);
}
function onChatTimeChange() {
  const val = document.getElementById("chat_time").checked ? 1 : 0;
  window.pywebview.api.setChatTime(val);
}
function updateChatTime(val) {
  document.getElementById("chat_time").checked = val == 1;
}


function onChatLikeChange() {
  const val = document.getElementById("chat_like").checked ? 1 : 0;
  window.pywebview.api.setChatLike(val);
}
function updateLikeTime(val) {
  document.getElementById("chat_like").checked = val == 1;
}


function updateCollectViewers(val) {
  document.getElementById("collect_viewers").checked = val == 1;
}
function updateTtsClip(val) {
  document.getElementById("tts_clip").checked = val == 1;
}
function updateStatSender(val) {
  document.getElementById("stat_sender").checked = val == 1;
}


function onChatFrameChange() {
  const val = document.getElementById("chat_frame").checked ? 1 : 0;
  window.pywebview.api.setChatFrame(val);
}
function updateChatFrame(val) {
  document.getElementById("chat_frame").checked = val == 1;
}

function onChatFramenChange() {
  const val = document.getElementById("chat_framen").checked ? 1 : 0;
  window.pywebview.api.setChatFramen(val);
}
function updateChatFramen(val) {
  document.getElementById("chat_framen").checked = val == 1;
}

function onSkipRepeatedSenderChange() {
  const val = document.getElementById("skip_repeated_sender").checked ? 1 : 0;
  window.pywebview.api.setSkipRepeatedSender(val);
}
function updateSkipRepeatedSender(val) {
  document.getElementById("skip_repeated_sender").checked = val == 1;
}

function obs_video() {
  const val = document.getElementById("obs_video").value;
  window.pywebview.api.setObsVideo(val);
}
function updateObsVideo(val) {
  document.getElementById("obs_video").value = val;
}
function obs_target() {
  const val = document.getElementById("obs_target").value;
  window.pywebview.api.setObsTarget(val);
}
function updateObsTarget(val) {
  document.getElementById("obs_target").value = val;
}


function onTtsToggle(enabled) {
  window.pywebview.api.set_tts_enabled(enabled);
}

  function autoSaveObsConfig() {
    const host = document.getElementById('obs-host').value;
    const port = document.getElementById('obs-port').value;
    const password = document.getElementById('obs-password').value;
    window.pywebview.api.set_obs_config(host, port, password)
      .then(response => console.log("[OK] OBS config saved"))
      .catch(err => console.error("[ERR] Saving OBS config:", err));
  }

  function loadObsConfig() {
    window.pywebview.api.get_obs_config()
      .then(config => {
        document.getElementById('obs-host').value = config.host || "";
        document.getElementById('obs-port').value = config.port || "";
        document.getElementById('obs-password').value = config.password || "";
      })
      .catch(err => console.error("[ERR] Loading OBS config:", err));
  }

  function waitForPywebview(callback) {
    if (window.pywebview) {
      callback();
    } else {
      setTimeout(() => waitForPywebview(callback), 100);
    }
  }

  window.addEventListener('DOMContentLoaded', () => {
    waitForPywebview(() => {
      loadObsConfig();
      document.getElementById('obs-host').addEventListener('input', autoSaveObsConfig);
      document.getElementById('obs-port').addEventListener('input', autoSaveObsConfig);
      document.getElementById('obs-password').addEventListener('input', autoSaveObsConfig);
    });
  });





  // Bootstrap tab init
  document.querySelectorAll('[data-bs-toggle="tab"]').forEach(tab => {
    tab.addEventListener('click', e => {
      e.preventDefault();
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
      tab.classList.add('active');
      document.querySelector(tab.getAttribute('href')).classList.add('active');
    });
  });


function onChatSizeChange() {
  const color = document.getElementById("chatBgColor").value;
  const alpha = parseFloat(document.getElementById("chatBgAlpha").value);
  const r = parseInt(color.substr(1, 2), 16);
  const g = parseInt(color.substr(3, 2), 16);
  const b = parseInt(color.substr(5, 2), 16);
  const rgba = `rgba(${r},${g},${b},${alpha})`;

  console.log("[JS] Sending chat size/color:", rgba);
  window.pywebview.api.setChatSize(rgba);
}
function updateChatbgcolor(rgba) {
  const match = rgba.match(/rgba?\((\d+), ?(\d+), ?(\d+), ?([\d.]+)\)/);
  if (match) {
    const r = parseInt(match[1]).toString(16).padStart(2, '0');
    const g = parseInt(match[2]).toString(16).padStart(2, '0');
    const b = parseInt(match[3]).toString(16).padStart(2, '0');
    const a = parseFloat(match[4]);
    document.getElementById('chatBgColor').value = `#${r}${g}${b}`;
    document.getElementById('chatBgAlpha').value = a;
    document.documentElement.style.setProperty('--msg-bg', rgba);
  }
}


function onChatTextColorChange() {
  const color = document.getElementById("chatTextColor").value;
  console.log("[JS] Sending chat text color:", color);
  window.pywebview.api.setChatTextColor(color);
}
function updateChatTextColor(color) {
  document.getElementById("chatTextColor").value = color;
  document.documentElement.style.setProperty('--msg-text-color', color);
}

function onChatTextColorNameChange() {
  const color = document.getElementById("chatTextColorName").value;
  console.log("[JS] Sending chat text color:", color);
  window.pywebview.api.setChatTextColorName(color);
}
function updateChatTextColorName(color) {
  document.getElementById("chatTextColorName").value = color;
}


   // Стиль текста  
    function onChatFontFamilyChange() {
      const selectedFont = document.getElementById("chatFontFamily").value;
      window.pywebview.api.setChatFont(selectedFont); // 💡 вызывает Python
    }
    document.getElementById("chatFontFamily").addEventListener('change', onChatFontFamilyChange);

    function updateChatFontFamily(font) {
      document.getElementById("chatFontFamily").value = font;
    }
    // Запрашиваем текущий шрифт при загрузке
    window.addEventListener("pywebviewready", () => {
      window.pywebview.api.getChatFont().then(data => {
        updateChatFontFamily(data.font);
      });
    });


   // Стиль текста  
  function onChatOverlayChange() {
    const selectedOverlay = document.getElementById("chatOverlay").value;
    console.log(`▶️ Новый overlay: ${selectedOverlay}`);
    window.pywebview.api.setChatOverlay(selectedOverlay).then(response => {
      console.log("Ответ от Python:", response);
    });
  }
  document.getElementById("chatOverlay").addEventListener('change', onChatOverlayChange);
  function updateChatOverlay(overlay) {
    document.getElementById("chatOverlay").value = overlay;
  }
  // Запрашиваем текущий overlay при загрузке
  window.addEventListener("pywebviewready", () => {
    window.pywebview.api.getChatOverlay().then(data => {
      updateChatOverlay(data.overlay);
    });
  });



function onChatTimeoutChange() {
  const timeout = parseInt(document.getElementById("chatTimeout").value, 10);
  window.pywebview.api.setChatTimeout(timeout);
}

function onChatLimitChange() {
  const limit = parseInt(document.getElementById("chatMaxMessages").value, 10);
  window.pywebview.api.setChatLimit(limit);
}

function updateChatOvd(val) {
  document.getElementById("chatOvd").value = val;
}

function updateChatWidthX(val) {
  document.getElementById("chatWidthX").value = val;
}
function updateChatWidthY(val) {
  document.getElementById("chatWidthY").value = val;
}
function updateChatWidthOv(val) {
  document.getElementById("chatWidthOv").value = val;
}

function updateChatHeightOv(val) {
  document.getElementById("chatHeightOv").value = val;
}

function updateChatZoomOv(val) {
  document.getElementById("chatZoomOv").value = val;
}

function toggleInputs2(isChecked) {
  const widthInput2 = document.getElementById('window1_width');
  const heightInput2 = document.getElementById('window1_height');
  const overInput2 = document.getElementById('chatOvd');
  widthInput2.disabled = isChecked;
  heightInput2.disabled = isChecked;
  overInput2.disabled = isChecked;
  widthInput2.style.cursor = isChecked ? 'not-allowed' : 'auto';
  heightInput2.style.cursor = isChecked ? 'not-allowed' : 'auto';
  overInput2.style.cursor = isChecked ? 'not-allowed' : 'auto';
  onChatSizeChangeOv();
}
function toggleInputs3(isChecked) {
  const widthInput3 = document.getElementById('window2_width');
  const heightInput3 = document.getElementById('window2_height');
  const overInput3 = document.getElementById('chatOvd2');
  widthInput3.disabled = isChecked;
  heightInput3.disabled = isChecked;
  overInput3.disabled = isChecked;
  widthInput3.style.cursor = isChecked ? 'not-allowed' : 'auto';
  heightInput3.style.cursor = isChecked ? 'not-allowed' : 'auto';
  overInput3.style.cursor = isChecked ? 'not-allowed' : 'auto';
  onChatSizeChangeOv();
}

function onChatSizeChangeOv() {
  const widthx = document.getElementById("chatWidthX").value;
  const widthy = document.getElementById("chatWidthY").value;
  const width = document.getElementById("chatWidthOv").value;
  const height = document.getElementById("chatHeightOv").value;
  const zoom = document.getElementById("chatZoomOv").value;
  const ovd = document.getElementById("chatOvd").value;
  window.pywebview.api.setChatSizeOv(widthx, widthy, width, height, zoom, ovd);
}
function onChatSizeChangeOv2() {
  const ovd2 = document.getElementById("chatOvd2").value;
  window.pywebview.api.setChatSizeOv2(ovd2);
}

function updateChatOvd2(val) {
  document.getElementById("chatOvd2").value = val;
}


  let currentVisible = null;

  function showLog() {
    const log = document.getElementById("logContainer");
    const fav = document.getElementById("favoritesContainer");

    if (currentVisible === 'log') {
      log.style.display = "none";
      currentVisible = null;
    } else {
      log.style.display = "block";
      fav.style.display = "none";
      currentVisible = 'log';
    }
  }

  function showFavorites() {
    const log = document.getElementById("logContainer");
    const fav = document.getElementById("favoritesContainer");

    if (currentVisible === 'favorites') {
      fav.style.display = "none";
      currentVisible = null;
    } else {
      fav.style.display = "block";
      log.style.display = "none";
      currentVisible = 'favorites';
    }
  }



  // Проверка на доступность функции
  console.log('Функция updateMaxVideoLength доступна:', typeof updateMaxVideoLength);
  
  // Определение функции
  function updateMaxVideoLength(minutes) {
    console.log("[DEBUG] updateMaxVideoLength вызвана с:", minutes);
    const inputField = document.getElementById('maxVideoLength');
    inputField.value = minutes; // Обновляем поле ввода
  }
  
  
  
  
function waitForAPI(callback) {
    if (window.pywebview && window.pywebview.api && window.pywebviewReady) {
        callback();
    } else {
        setTimeout(() => waitForAPI(callback), 100);
    }
}

function minimizeWindow() {
    waitForAPI(() => window.pywebview.api.minimize());
}

function closeWindow() {
    waitForAPI(() => window.pywebview.api.close());
}



  window.onload = function () {
    console.log('[JS] Всё загружено. Сообщаем Python.');
    if (window.pywebview && window.pywebview.api && window.pywebview.api.notifyReady) {
      window.pywebview.api.notifyReady();  // вызовет backend
    }
  };
  

if (typeof div !== 'undefined') {
  div.addEventListener("mouseenter", () => {
    isHovered = true;
    if (!isOverRemoveBtn) {
      div.classList.add("favorite-item-hovered");
    }
  });

  div.addEventListener("mouseleave", () => {
    isHovered = false;
    div.classList.remove("favorite-item-hovered");
  });

}






















window.addEventListener('load', async () => {
  console.log("Все ресурсы загружены");

  const isMainWindow = document.getElementById('volumeSlider') !== null;
  const isQueueWindow = document.getElementById('queueList') !== null;

  if (window.pywebview) {
    if (isMainWindow) {
      // === MAIN WINDOW ===
      try {
        // Получаем громкость
        const volume = await pywebview.api.get_volume();
        console.log('Загруженная громкость:', volume);

        // Проверяем, что volume - число
        if (typeof volume === 'number') {
          updateVolume(volume);  // Обновляем ползунок громкости
        } else {
          console.error("Ошибка: Неверное значение громкости:", volume);
        }
      } catch (err) {
        console.error("Ошибка при получении громкости:", err);
      }

      // Остальной код для загрузки данных
      const maxVideoLength = await pywebview.api.get_max_video_length();
      document.getElementById('maxVideoLength').value = maxVideoLength;

      const keywords = await pywebview.api.get_keywords();
      updateKeywordList(keywords);

      const logs = await pywebview.api.get_logs();
      logs.forEach(l => appendLog(l));
    }

    if (isQueueWindow) {
      // === QUEUE WINDOW ===
      const queue = await pywebview.api.get_queue();
      updateQueue(queue);
    }
  }

  // Автообновление очереди только в окне очереди
  if (isQueueWindow) {
    setInterval(async () => {
      if (window.pywebview) {
        const queue = await pywebview.api.get_queue();
        updateQueue(queue);
      }
    }, 4000);
  }
});

function updateChatWidthY(value) {
  console.log("[JS] updateChatWidthY:", value);
  const input = document.getElementById('chatWidthY'); // ✅ должно совпадать с HTML
  if (input) input.value = value;
}
function updateChatWidthX(value) {
  console.log("[JS] updateChatWidthX:", value);
  const input = document.getElementById('chatWidthX'); // ✅ должно совпадать с HTML
  if (input) input.value = value;
}
function updateChatWidthOv(value) {
  console.log("[JS] updateChatWidthOv:", value);
  const input = document.getElementById('chatWidthOv'); // ✅ должно совпадать с HTML
  if (input) input.value = value;
}
function updateChatHeightOv(value) {
  console.log("[JS] updateChatHeightOv:", value);
  const input = document.getElementById('chatHeightOv');
  if (input) input.value = value;
}
function updateChatZoomOv(value) {
  console.log("[JS] updateChatZoomOv:", value);
  const input = document.getElementById('chatZoomOv');
  if (input) input.value = value;
}


  function updateChatWidth(value) {
    console.log("[JS] updateChatWidth:", value);
    const input = document.getElementById('chatWidth');
    if (input) input.value = value;
  }
  function updateChatHeight(value) {
    console.log("[JS] updateChatHeight:", value);
    const input = document.getElementById('chatHeight');
    if (input) input.value = value;
  }
  function updateChatTimeout(value) {
    console.log("[JS] updateChatTimeout:", value);
    const input = document.getElementById('chatTimeout');
    if (input) input.value = value;
  }
  function updateChatLimit(value) {
    console.log("[JS] updateChatLimit:", value);
    const input = document.getElementById('chatMaxMessages');
    if (input) input.value = value;
  }


// === Громкость ===
function updateVolume(volume) {
    const slider = document.getElementById('volumeSlider');
    const label = document.getElementById('volumeLabel');

    console.log("[DEBUG] updateVolume вызван с:", volume);

    slider.value = volume;
    label.innerText = volume;
}

function onVolumeSliderChange(val) {
  console.log("[DEBUG] Изменение громкости через ползунок:", val);  // Отладка
  updateVolume(val);
  if (window.pywebview) {
    pywebview.api.set_volume(val);
  }
}

// Обработчик для клика на ползунок
document.getElementById('volumeSlider').addEventListener('input', (e) => {
  const value = e.target.value;
  onVolumeSliderChange(value);  // Обновляем громкость через функцию
});


// === Громкость VLC ===
function updateVlcVolume(volume) {
    const slider = document.getElementById('vlcVolumeSlider');
    const label = document.getElementById('vlcVolumeLabel');

    console.log("[DEBUG] updateVlcVolume вызван с:", volume);

    slider.value = volume;
    label.innerText = volume;
}

function onVlcVolumeSliderChange(val) {
    console.log("[DEBUG] Изменение громкости VLC через ползунок:", val);
    updateVlcVolume(val);
    if (window.pywebview) {
        pywebview.api.set_vlc_volume(val);  // Вызов Python API
    }
}

// Обработчик для ползунка VLC
document.getElementById('vlcVolumeSlider').addEventListener('input', (e) => {
    const value = e.target.value;
    onVlcVolumeSliderChange(value);
});




// Проверяем доступность функции
console.log('Функция updateMaxVideoLength доступна:', typeof updateMaxVideoLength);
// Функция для обновления максимальной длины видео
function updateMaxVideoLength(minutes) {
  console.log("[DEBUG] updateMaxVideoLength вызвана с:", minutes);
  const inputField = document.getElementById('maxVideoLength');
  if (inputField) {
    inputField.value = minutes; // Обновляем поле ввода
  } else {
    console.log("[DEBUG] Элемент input не найден");
  }
}
// Максимальная длина видео
function onMaxVideoLengthChange(value) {
    let minutes = parseInt(value);
    if (isNaN(minutes) || minutes <= 0) {
        minutes = 10; // если пользователь фигню введёт, сбрасываем на 10
    }
    let seconds = minutes * 60;
    pywebview.api.set_max_video_length(seconds);
}



// Проверяем доступность функции
console.log('Функция updateMinViews доступна:', typeof updateMinViews);
// Функция для обновления минимального числа просмотров
function updateMinViews(views) {
  console.log("[DEBUG] updateMinViews вызвана с:", views);
  const inputField = document.getElementById('minViews');
  if (inputField) {
    inputField.value = views; // Обновляем поле ввода
  } else {
    console.log("[DEBUG] Элемент input minViews не найден");
  }
}
// Обработка изменения минимального количества просмотров
function onMinViewsChange(value) {
  let views = parseInt(value);
  if (isNaN(views) || views <= 0) {
    views = 1000; // дефолт если фигню ввели
  }
  pywebview.api.set_min_views(views);
}




// === Ключевые слова ===
async function addKeyword() {
  const input = document.getElementById('keywordInput');
  const word = input.value.trim();
  if (!word) return;
  const res = await pywebview.api.add_keyword(word);
  if (res.status === 'added') updateKeywordList(res.keywords);
  input.value = '';
}

function updateKeywordList(list) {
  const ul = document.getElementById('keywordsList');
  ul.innerHTML = '';
  list.forEach(word => {
    const li = document.createElement('li');
    li.textContent = word;
    ul.appendChild(li);
  });
}

// === Лог ===
function appendLog(message) {
  const logArea = document.getElementById('log');
  logArea.value += message + '\n';
  logArea.scrollTop = logArea.scrollHeight;
}



// Функция для получения прогресса (в процентах)
function getProgress(duration) {
  const elapsed = getElapsedTime(); // Получаем время, которое прошло (например, через WebSocket или другой источник данных)
  return (elapsed / duration) * 100;
}

// Функция для получения прошедшего времени
function getElapsedTime() {
  // Это пример, в реальной ситуации вы должны получить прошедшее время из вашего плеера или API.
  return 45; // Примерное значение для прогресса (можно заменить на реальное время)
}


function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
}



// Функция обновления мини-очереди - вынесена наружу, чтобы была видна всем

  // --- Элементы модалки ---
const modalClip = document.getElementById("modalConfirmClipDelete");
const messageClipElem = document.getElementById("clipDeleteMessage");
const btnConfirmClip = document.getElementById("confirmDeleteClip");
const btnCancelClip = document.getElementById("cancelDeleteClip");

let clipToDelete = null;
let clipToDeleteIndex = null;

function openClipDeleteModal(item, idx) {
  clipToDelete = item;
  clipToDeleteIndex = idx;
  const cleanTitle = item.title.split('[')[0].trim();
  messageClipElem.innerHTML = `Хотите удалить клип из очереди? <br><br><b>${cleanTitle}</b><br><br>от <b>${item.customer}</b>`;
  modalClip.style.display = "flex";
}

function closeClipDeleteModal() {
  clipToDelete = null;
  clipToDeleteIndex = null;
  modalClip.style.display = "none";
}

btnConfirmClip.onclick = async () => {
  if (!clipToDelete) return;

  try {
    if (clipToDeleteIndex === 0) {
      // Если это первый элемент → вызываем skip_video
      console.log("Первый элемент, выполняем skip_video()");
      await window.pywebview.api.skip_video();
    } else {
      // Для остальных → обычное удаление
      console.log("Удаляем клип:", clipToDelete.title);
      const response = await window.pywebview.api.remove_clip_from_queue(clipToDelete.title);
      if (response.status !== "ok") {
        console.error("Ошибка удаления:", response.message);
      }
    }

    // В любом случае обновляем очередь
    await refreshQueue();
  } catch (err) {
    console.error("Ошибка при удалении/скипе клипа:", err);
  } finally {
    closeClipDeleteModal();
  }
};


btnCancelClip.onclick = () => {
  closeClipDeleteModal();
};

  function cleanTitle(title) {
    return title.replace(/\s*\[[^\]]{1,11}\].*$/, "").trim();
  }

  // --- Твоя функция обновления мини-очереди с заменой confirm на модалку ---
  function updateQueueMini(queue) {
    const left = document.getElementById("queueMiniLeft");
    const center = document.getElementById("queueMiniCenter");
    const right = document.getElementById("queueMiniRight");
    if (!left || !center || !right) return;

    left.innerHTML = "";
    center.innerHTML = "";
    right.innerHTML = "";

    queue.forEach((item, idx) => {
      const li = document.createElement("li");
      li.style.marginLeft = "0";
      li.style.paddingLeft = "0";
      li.className = "row";
      li.style.display = "flex";
      li.style.alignItems = "center";
      li.style.gap = "2px";
      li.style.marginBottom = "2px";
      li.style.borderRadius = "8px";
      li.style.padding = "0px";
      li.style.position = "relative";
      li.style.width = "100%";
      li.style.maxWidth = "100%";
      li.style.overflow = "hidden";
      li.style.boxSizing = "border-box";

      const wrapper = document.createElement("div");
      wrapper.style.display = "flex";
      wrapper.style.alignItems = "center";
      wrapper.style.background = "#1c1c1c";
      wrapper.style.padding = "4px";
      wrapper.style.borderRadius = "8px";
      wrapper.style.flex = "1";
      wrapper.style.width = "100%";
      wrapper.style.maxWidth = "100%";
      wrapper.style.overflow = "hidden";
      wrapper.style.boxSizing = "border-box";

      let thumbSrc = item.thumbnail;
      if (thumbSrc && /^[a-zA-Z]:\\/.test(thumbSrc)) {
        thumbSrc = "file:///" + thumbSrc.replace(/\\/g, "/");
      }

      const img = document.createElement("img");
      img.src = thumbSrc;
      img.alt = "Thumbnail";
      img.style.height = "48px";
      img.style.width = "84px";
      img.style.objectFit = "contain";
      img.style.borderRadius = "5px";
      img.style.flexShrink = "0";

      const rootStyles = getComputedStyle(document.documentElement);
      const highlightColor = rootStyles
        .getPropertyValue("--favorite-item-hover-color")
        .trim();

      const info = document.createElement("div");
      info.style.marginLeft = "8px";
      info.style.overflow = "hidden";
      info.style.textOverflow = "ellipsis";
      info.style.whiteSpace = "nowrap";
      info.style.flex = "1";
      info.style.minWidth = "0";
      const clean = cleanTitle(item.title);
      info.innerHTML = `<div style="color: #f5f5f5; font-weight: bold; font-size: 13px;">${truncate(
        clean,
        22
      )}</div>
           <div style="color: #969696; font-size: 11px;">${
             formatDuration(item.duration) === "0:00"
               ? "playlist"
               : formatDuration(item.duration)
           }</div>
           <div style="color: ${highlightColor}; font-size: 12px; font-weight: 700;">${truncate(
        item.customer,
        28
      )}</div>`;

      // Кнопка удаления "-" только если не первый элемент
      const del = document.createElement("div");
      del.className = "del-btn btn-danger";
      del.textContent = "-";
      del.style.position = "absolute";
      del.style.bottom = "4px";
      del.style.right = "28px";
      del.style.width = "24px";
      del.style.height = "24px";
      del.style.background = "#a00";
      del.style.color = "white";
      del.style.display = "flex";
      del.style.alignItems = "center";
      del.style.justifyContent = "center";
      del.style.fontSize = "16px";
      del.style.fontWeight = "bold";
      del.style.cursor = "pointer";
      del.style.zIndex = "10";
      del.addEventListener("click", (e) => {
        e.stopPropagation();
        openClipDeleteModal(item, idx); // передаём item и индекс
      });
      wrapper.appendChild(del);

      // Кнопка "+" только если не "Избранное"
      if (item.customer !== "Избранное") {
        const plus = document.createElement("div");
        plus.className = "plus-btn btn-primary";
        plus.textContent = "+";
        plus.style.position = "absolute";
        plus.style.bottom = "4px";
        plus.style.right = "1px";
        plus.style.width = "24px";
        plus.style.height = "24px";
        plus.style.background = "#444";
        plus.style.color = "white";
        plus.style.display = "flex";
        plus.style.alignItems = "center";
        plus.style.justifyContent = "center";
        plus.style.fontSize = "16px";
        plus.style.fontWeight = "bold";
        plus.style.cursor = "pointer";
        plus.style.zIndex = "10";

        plus.addEventListener("click", async (e) => {
          e.stopPropagation();
          currentItemToAdd = item;
          await loadPlaylistsForModal();
          addToPlaylistModal.style.display = "block";
        });

        wrapper.appendChild(plus);
      }

      wrapper.appendChild(img);
      wrapper.appendChild(info);
      li.appendChild(wrapper);

      if (idx % 3 === 0) {
        left.appendChild(li);
      } else if (idx % 3 === 1) {
        center.appendChild(li);
      } else {
        right.appendChild(li);
      }
    });

    if (queue.length > 0) {
      updateNowPlaying(queue[0]);
    }
  }

  // Функция обновления очереди из API
async function refreshQueue() {
  console.log('refreshQueue called...');
  try {
    const queue = await window.pywebview.api.get_current_queue();
    console.log('Current queue:', queue);
    updateQueueMini(queue);
    if (
      autoAddFromPlaylist &&
      currentPlaylist &&
      queue &&
      queue.length === 0
    ) {
      console.log('Очередь пуста и авто-добавление ВКЛЮЧЕНО — пробуем добавить трек...');
      await addNextTrackFromPlaylist(currentPlaylist);
      const updatedQueue = await window.pywebview.api.get_current_queue();
      updateQueueMini(updatedQueue);
    }
  } catch (err) {
    console.error("Ошибка обновления очереди:", err);
  }
}


document.addEventListener('DOMContentLoaded', async () => {
  while (!window.pywebview?.api?.get_playlists) {
    await new Promise(r => setTimeout(r, 1000));
  }
  await loadPlaylists();
  await loadFavorites();
  setInterval(refreshQueue, 10000); 
});


let lastPlayedIndexByPlaylist = {};

async function addNextTrackFromPlaylist(playlistName) {
  const items = await window.pywebview.api.get_playlist_files(playlistName);
  if (!items || items.length === 0) {
    console.warn("Нет файлов в плейлисте:", playlistName);
    return;
  }
  if (!(playlistName in lastPlayedIndexByPlaylist)) {
    lastPlayedIndexByPlaylist[playlistName] = -1;
  }
  let nextIndex = lastPlayedIndexByPlaylist[playlistName] + 1;
  if (nextIndex >= items.length) {
    nextIndex = 0; // Циклический переход
  }
  const nextItem = items[nextIndex];
  console.log(`Добавляем из плейлиста [${playlistName}] трек №${nextIndex}: ${nextItem.filename}`);
  lastPlayedIndexByPlaylist[playlistName] = nextIndex;
  await window.pywebview.api.add_favorite_by_filename(nextItem.filename);
}



function extractYoutubeIdFromFilename(filename) {
  const match = filename.match(/([A-Za-z0-9_-]{11})/);
  return match ? match[1] : null;
}


// Текущий добавляемый элемент
let currentItemToAdd = null;
let addToPlaylistModal = null;
let playlistSelectModal = null;
let btnConfirmAddToPlaylist = null;
let btnCancelAddToPlaylist = null;

async function loadPlaylistsForModal() {
  const playlists = await window.pywebview.api.get_playlists();
  playlistSelectModal.innerHTML = '';
  playlists.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    playlistSelectModal.appendChild(option);
  });
}
// --- DOMContentLoaded ---
document.addEventListener('DOMContentLoaded', () => {
  addToPlaylistModal = document.getElementById('addToPlaylistModal');
  playlistSelectModal = document.getElementById('playlistSelectModal');
  btnConfirmAddToPlaylist = document.getElementById('btnConfirmAddToPlaylist');
  btnCancelAddToPlaylist = document.getElementById('btnCancelAddToPlaylist');

  btnConfirmAddToPlaylist.onclick = async () => {
    if (!currentItemToAdd) {
      alert('Нет выбранного видео для добавления');
      return;
    }
    if (!currentItemToAdd.filepath || currentItemToAdd.filepath === "") {
      alert('Видео ещё не скачано, попробуйте позже');
      return;
    }

    const selectedPlaylist = playlistSelectModal.value;
    if (!selectedPlaylist) {
      alert('Выберите плейлист');
      return;
    }

    try {
      const res = await window.pywebview.api.add_favorite_to_playlist(
        currentItemToAdd.filepath,
        selectedPlaylist
      );
      console.log('Добавление в плейлист результат:', res);
      if (!res.success) {
        alert(res.error);
      } else {
        // 🔥 сразу обновляем список избранного
        await loadFavorites();
      }
    } catch (err) {
      alert('Ошибка при добавлении в плейлист');
      console.error(err);
    }

    addToPlaylistModal.style.display = 'none';
    currentItemToAdd = null;
  };



  btnCancelAddToPlaylist.onclick = () => {
    console.log('Cancel clicked');
    addToPlaylistModal.style.display = 'none';
    currentItemToAdd = null;
  };

  // Здесь вызываем автообновление очереди и обновление списка
  (async () => {
    if (window.pywebview) {
      const queue = await window.pywebview.api.get_queue();
      updateQueueMini(queue);
    }
  })();

  setInterval(async () => {
    if (window.pywebview) {
      const queue = await window.pywebview.api.get_queue();
      updateQueueMini(queue);
    }
  }, 5000);
});



// Пометить видео как избранное
function markAsFavorite(title) {
  console.log('📤 Отправляем в Python:', title);  // <-- ДОБАВЬ ЭТО
  if (window.pywebview) {
    window.pywebview.api.mark_favorite(title)
      .then(res => {
        console.log("📥 Ответ от Python:", res);  // <-- ДОБАВЬ ЭТО
        if (res.success) {
          console.log("✅ Добавлено в избранное:", res.filename);
        } else {
          console.warn("❌ Ошибка:", res.error);
        }
      })
      .catch(err => console.error("❗ Ошибка вызова API:", err));  // <-- ДОБАВЬ ЭТО
  } else {
    console.warn("⚠️ pywebview не найден!");
  }
}


function renderFavoritesList(favorites) {
  const container = document.getElementById("favoritesList");
  container.innerHTML = "";

  const grouped = {};

  favorites.forEach(fav => {
    const match = fav.filepath.match(/cache[\\/](.*?)[\\/]/);
    const groupName = match ? match[1] : "Без плейлиста";

    // 🎯 Фильтрация по выбранному плейлисту (если он выбран)
    if (currentPlaylist && groupName !== currentPlaylist) return;

    if (!grouped[groupName]) grouped[groupName] = [];
    grouped[groupName].push(fav);
  });

  if (Object.keys(grouped).length === 0) {
    container.innerHTML = "<i style='color: #777; padding: 4px'>Нет избранного</i>";
    return;
  }

  for (const [groupName, groupItems] of Object.entries(grouped)) {
    const groupHeader = document.createElement("div");
    groupHeader.textContent = `—  ${groupName}  —`;
    groupHeader.style.margin = "2px 2px 2px";
    groupHeader.style.fontWeight = "bold";
    groupHeader.style.color = "#ccc";
    groupHeader.style.fontSize = "13px";
    groupHeader.style.textAlign = "center";
    container.appendChild(groupHeader);

    groupItems.forEach(fav => {
      const div = document.createElement("div");
      div.className = "favorite-item";
      div.style.display = "flex";
      div.style.justifyContent = "space-between";
      div.style.alignItems = "center";
      div.style.padding = "0px 8px";
      div.style.transition = "box-shadow 0.0s, background-color 0.0s";
      div.style.borderRadius = "6px";
      div.style.cursor = "pointer"; // курсор по всей строке

      let isHovered = false;
      let isOverRemoveBtn = false;

      const titleSpan = document.createElement("span");
      titleSpan.textContent = `+ ${fav.title}`;
      titleSpan.style.width = "100%";
      // Убираем обработчик с titleSpan

      const removeBtn = document.createElement("button");
      removeBtn.textContent = "-";
      removeBtn.style.background = "rgb(255 68 68 / 60%)";
      removeBtn.style.border = "none";
      removeBtn.style.color = "#fff";
      removeBtn.style.padding = "1px 8px";
      removeBtn.style.marginLeft = "8px";
      removeBtn.style.cursor = "pointer";
      removeBtn.style.borderRadius = "4px";
      removeBtn.title = "Удалить из избранного";

      removeBtn.addEventListener("click", async (e) => {
        e.stopPropagation();

        // 📌 Удаление работает и для подпапок
        await window.pywebview.api.remove_favorite_by_filename(fav.filepath.replace(/^.*cache[\\/]/, ""));
        console.log("🧹 Удаляем файл:", fav.filename);
        loadFavorites(); // обновим
      });

      // Hover-эффекты
      div.addEventListener("mouseenter", () => {
        isHovered = true;
        if (!isOverRemoveBtn) {
          div.style.boxShadow = "0 0 4px 2px rgba(255, 165, 0, 0.5)";
          div.style.backgroundColor = "#2a2a2a";
        }
      });

      div.addEventListener("mouseleave", () => {
        isHovered = false;
        div.style.boxShadow = "none";
        div.style.backgroundColor = "transparent";
      });

      removeBtn.addEventListener("mouseenter", () => {
        isOverRemoveBtn = true;
        div.style.boxShadow = "0 0 5px 2px rgba(255, 0, 0, 0.5)";
        div.style.backgroundColor = "#331111";
      });

      removeBtn.addEventListener("mouseleave", () => {
        isOverRemoveBtn = false;
        if (isHovered) {
          div.style.boxShadow = "0 0 4px 2px rgba(255, 165, 0, 0.5)";
          div.style.backgroundColor = "#2a2a2a";
        } else {
          div.style.boxShadow = "none";
          div.style.backgroundColor = "transparent";
        }
      });

      // Вешаем обработчик клика на весь div
      div.addEventListener("click", async () => {
        console.log("▶️ Добавление из избранного в очередь:", fav.filename);
        await window.pywebview.api.add_favorite_by_filename(fav.filename);
      });

      div.appendChild(titleSpan);
      div.appendChild(removeBtn);
      container.appendChild(div);
    });
  }
}





document.addEventListener("DOMContentLoaded", async () => {
  console.log('[JS] DOM готов');

  // Ожидаем pywebview, если надо
  while (!window.pywebview?.api?.get_playlists) {
    console.log("⏳ Ожидание pywebview.api...");
    await new Promise(res => setTimeout(res, 100));
  }

  console.log("🚀 pywebview API найден");

  await loadPlaylists();
  await loadFavorites();
});



function fillPlaylistsSelect(playlists) {
  const select = document.getElementById("playlistSelect");
  select.innerHTML = '<option value="">Все плейлисты</option>';
  playlists.forEach(name => {
    const option = document.createElement("option");
    option.value = name;
    option.textContent = name;
    select.appendChild(option);
  });

  select.onchange = () => {
    currentPlaylist = select.value || null;
    loadFavorites();
  };
}

function updateFavoritesList(favorites) {
  renderFavoritesList(favorites);
}


window.v_list_text = 'Очередь пуста - Закажи Клип за баллы';
function setVListUrl(val) {
  window.v_list_text = val && val.trim() ? val : window.v_list_text;
  const input = document.getElementById("vlist");
  if (input) input.value = window.v_list_text;
}


function updateQueue(queue) {
  const container = document.getElementById('queueList');
  if (!container) return;

  // Очистим очередь ВНЕ зависимости от содержимого
  container.innerHTML = '';

  if (queue.length === 0) {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;
    td.style.textAlign = 'center';
    td.style.color = '#aaa';
    td.style.fontSize = '26px';
    td.style.fontWeight = 'bold';

    // 🔄 Используем переменную вместо текста напрямую
    td.textContent = window.v_list_text || 'Очередь пуста - Закажи Клип за баллы';

    tr.appendChild(td);
    container.appendChild(tr);
    return;
  }

  queue.forEach((item, idx) => {
    const tr = document.createElement('tr');
    const td = document.createElement('td');
    td.colSpan = 4;

    const isPlaying = idx === 0 ? 'playing' : '';
	
	let thumbSrc = item.thumbnail;
	if (thumbSrc && /^[a-zA-Z]:\\/.test(thumbSrc)) {
	  thumbSrc = 'file:///' + thumbSrc.replace(/\\/g, '/');
	}
	
	function cleanTitle(title) {
	  return title.replace(/\s*\[[a-zA-Z0-9-_]{11}\].*$/, '').trim();
	}

    td.innerHTML = `
      <div class="queue-item ${isPlaying}" style="display: flex; align-items: center; gap: 11px; border-radius: 8px; padding: 2px;">
        <img src="${thumbSrc}" alt="Thumbnail" style="height: 60px; object-fit: contain; border-radius: 6px; width: 107px;" />
        <div style="display: flex; flex-direction: column;">
          <div style="color: #f5f5f5; font-weight: bold;">${truncate(cleanTitle(item.title), 44)}</div>
          <div style="color: #969696; font-size: 13px;">${formatDuration(item.duration) === '0:00' ? 'playlist' : formatDuration(item.duration)}</div>
          <div style="color: #e0c146; font-size: 13px; font-weight: 700;">${truncate(item.customer, 44)}</div>
        </div>
      </div>
    `;

    tr.appendChild(td);
    container.appendChild(tr);
  });

  updateNowPlaying(queue[0]);
}


function updateNowPlaying(item) {
  const now = document.getElementById('nowPlaying');
  const cust = document.getElementById('nowCustomer');
  if (item && now && cust) {
    now.textContent = item.title;
    cust.textContent = item.customer;
  }
}

function truncate(text) {
  const maxLength = 56;
  return text.length <= maxLength ? text : text.slice(0, maxLength - 3) + '...';
}

// === Трекер ===
let isTracking = false;
async function toggleTracking() {
  isTracking = await pywebview.api.toggle_tracking();
  const btn = document.getElementById('trackingBtn');
  btn.textContent = isTracking ? 'Остановить' : 'Запустить';
}


// Функция для паузы видео
function pauseVideo() {
    console.log("Видео приостановлено");
    if (window.pywebview) {
        pywebview.api.pause_video();  // Вызов метода паузы из Python
    }
}
// Функция для остановки видео
function stopVideo() {
    console.log("Видео остановлено");
    if (window.pywebview) {
        pywebview.api.stop_video();  // Вызов метода остановки из Python
    }
}
// Функция для пропуска видео
function skipVideo() {
    console.log("Видео пропущено");
    if (window.pywebview) {
        pywebview.api.skip_video();  // Вызов метода пропуска из Python
    }
}
function resumeVideo() {
    console.log("Видео продолжено");
    if (window.pywebview) {
        pywebview.api.resume_video();
    }
}


function onVkChannelInput(value) {
  if (window.pywebview) {
    window.pywebview.api.set_vk_channel_url(value);
  }
}
function setVkChannelUrl(value) {
  const input = document.getElementById('vkChannel');
  if (input) {
    input.value = value;
  }
}
function onTwitchChannelInput(value) {
  if (window.pywebview) {
    window.pywebview.api.set_twitch_channel_url(value);
  }
}
function setTwitchChannelUrl(value) {
  const input = document.getElementById('twitchChannel');
  if (input) {
    input.value = value;
  }
}

function onVListInput(value) {
  if (window.pywebview) {
    window.pywebview.api.set_v_list_url(value);
  }
}

//Запустить оверлей
  function startOverlay() {
    window.pywebview.api.launch_overlay().then(response => {
      console.log(response);
      alert(response);
    });
  }
  
  
  
  let currentPlaylist = null;
  const btnAddPlaylist = document.getElementById('btnAddPlaylist');
  const btnEditPlaylist = document.getElementById('btnEditPlaylist');

  const modalAdd = document.getElementById('modalAdd');
  const inputAddName = document.getElementById('inputAddName');
  const cancelAdd = document.getElementById('cancelAdd');
  const confirmAdd = document.getElementById('confirmAdd');

  const modalEdit = document.getElementById('modalEdit');
  const inputEditName = document.getElementById('inputEditName');
  const cancelEdit = document.getElementById('cancelEdit');
  const confirmEdit = document.getElementById('confirmEdit');
  const btnDeleteInModal = document.getElementById('btnDeletePlaylist');
  const playlistSelect = document.getElementById('playlistSelect');


  // Загрузка списка плейлистов из Python
  async function loadPlaylists() {
    try {
      const playlists = await window.pywebview.api.get_playlists();
      playlistSelect.innerHTML = '<option value="">Все плейлисты</option>';
      playlists.forEach(name => {
        const option = document.createElement('option');
        option.value = name;
        option.textContent = name;
        playlistSelect.appendChild(option);
      });
      btnEditPlaylist.disabled = !currentPlaylist;
    } catch (e) {
      alert('Ошибка загрузки плейлистов');
      console.error(e);
    }
  }

// При выборе плейлиста
playlistSelect.onchange = async () => {
  currentPlaylist = playlistSelect.value || null;
  btnEditPlaylist.disabled = !currentPlaylist;
  btnToggleAutoAdd.disabled = !currentPlaylist;
  if (!currentPlaylist) {
    autoAddFromPlaylist = false;
    btnToggleAutoAdd.classList.remove('btn-primary');
    btnToggleAutoAdd.classList.add('btn-secondary');
    btnToggleAutoAdd.textContent = '▶️ Авто';
  }
  await loadFavorites();
  if (currentPlaylist) {
    await loadPlaylistItems(currentPlaylist);
  } else {
    document.getElementById('playlistItems').innerHTML = '';
    modalEdit.classList.remove('active');
  }
};



let autoAddFromPlaylist = false; // глобально
btnToggleAutoAdd.onclick = () => {
  autoAddFromPlaylist = !autoAddFromPlaylist;

  btnToggleAutoAdd.classList.toggle('btn-primary', autoAddFromPlaylist);
  btnToggleAutoAdd.classList.toggle('btn-secondary', !autoAddFromPlaylist);
  btnToggleAutoAdd.classList.toggle('auto-enabled', autoAddFromPlaylist);

  // Убираем или возвращаем класс btn-16
  if (autoAddFromPlaylist) {
    btnToggleAutoAdd.classList.remove('btn-16');
    btnToggleAutoAdd.setAttribute('tabindex', '-1');  // убрать возможность фокуса
    btnToggleAutoAdd.blur(); // снять текущее выделение
  } else {
    btnToggleAutoAdd.classList.add('btn-16');
    btnToggleAutoAdd.setAttribute('tabindex', '0');  // снова можно фокусировать
  }

  // Меняем текст
  btnToggleAutoAdd.textContent = autoAddFromPlaylist ? '⏸️ Авто' : '▶️ Авто';

  // Меняем фон
  if (autoAddFromPlaylist) {
    btnToggleAutoAdd.style.backgroundColor = '#4CAF50';
  } else {
    btnToggleAutoAdd.style.backgroundColor = '';
  }

  console.log(`Auto-Add is now ${autoAddFromPlaylist ? 'ENABLED' : 'DISABLED'}`);
};


  // Открыть окно создания плейлиста
  btnAddPlaylist.onclick = () => {
    inputAddName.value = '';
    modalAdd.classList.add('active');
    inputAddName.focus();
  };

  cancelAdd.onclick = () => {
    modalAdd.classList.remove('active');
  };


	confirmAdd.onclick = async () => {
	  const name = inputAddName.value.trim();
	  if (!name) return alert('Введите имя плейлиста');
	  const res = await window.pywebview.api.create_playlist(name);
	  if (res.success) {
		await loadPlaylists();
		modalAdd.classList.remove('active');
		playlistSelect.value = name;
		currentPlaylist = name;
		btnEditPlaylist.disabled = !currentPlaylist;
		// Запускаем код обработки выбора плейлиста
		await playlistSelect.onchange();
		await loadFavorites();
	  } else {
		alert(`Ошибка создания: ${res.error}`);
	  }
	};


  // Открыть окно редактирования плейлиста
  btnEditPlaylist.onclick = () => {
    if (!currentPlaylist) return;
    inputEditName.value = currentPlaylist;
    modalEdit.classList.add('active');
    inputEditName.focus();
  };

  cancelEdit.onclick = () => {
    modalEdit.classList.remove('active');
  };

  confirmEdit.onclick = async () => {
    const newName = inputEditName.value.trim();
    if (!newName) return alert('Введите новое имя');
    if (!currentPlaylist) return;
    const res = await window.pywebview.api.rename_playlist(currentPlaylist, newName);
    if (res.success) {
      await loadPlaylists();
      playlistSelect.value = newName;
      currentPlaylist = newName;
      modalEdit.classList.remove('active');
      await loadFavorites();
    } else {
      alert(`Ошибка переименования: ${res.error}`);
    }
  };

// Удаление из окна редактирования
async function updateUIOnPlaylistChange() {
  currentPlaylist = playlistSelect.value || null;
  btnEditPlaylist.disabled = !currentPlaylist;

  await loadFavorites();

  if (currentPlaylist) {
    await loadPlaylistItems(currentPlaylist);
  } else {
    document.getElementById('playlistItems').innerHTML = '';
    modalEdit.classList.remove('active'); // Закрываем редактор, если нет плейлиста
  }
}

btnDeleteInModal.onclick = async () => {
  if (!currentPlaylist) return;
  if (!confirm(`Удалить плейлист "${currentPlaylist}"?`)) return;

  const res = await window.pywebview.api.delete_playlist(currentPlaylist);
  if (res.success) {
    // Обновляем список плейлистов
    await loadPlaylists();

    // Сбрасываем выбор на "Все плейлисты"
    playlistSelect.value = '';

    // Гарантированно закрываем редактор
    modalEdit.classList.remove('active');

    // Обновляем UI
    await updateUIOnPlaylistChange();

  } else {
    alert(`Ошибка удаления: ${res.error}`);
  }
};


  // Загрузить избранное (фильтруется по currentPlaylist внутри Python)
  async function loadFavorites() {
    const favorites = await window.pywebview.api.get_favorites_from_cache_favs();
    renderFavoritesList(favorites);
  }

  // Инициализация при загрузке страницы
  document.addEventListener('DOMContentLoaded', async () => {
    while (!window.pywebview?.api?.get_playlists) {
      await new Promise(r => setTimeout(r, 100));
    }
    await loadPlaylists();
    await loadFavorites();
  });
  