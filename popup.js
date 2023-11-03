'use strict';

const isValidUrl = urlString=> {
  let url;
  try { 
        url =new URL(urlString); 
    }
    catch(e){ 
      return false; 
    }
    return url.protocol === "http:" || url.protocol === "https:";
}

function setAlarm(event) {
  chrome.alarms.clearAll();
  const time = alarm_time.value;
  chrome.action.setBadgeText({ text: 'ON' });
  chrome.alarms.create({ periodInMinutes: 60*24, when: new Date().setHours(Number(time.split(":")[0]), 0, 0, 0) });
  chrome.storage.sync.set({ time: time });
  window.close();
}

function clearAlarm() {
  chrome.action.setBadgeText({ text: '' });
  chrome.alarms.clearAll();
  chrome.storage.sync.remove(['time']);
  window.close();
}

async function addUrl() {
  const url_text = document.getElementById('urlinput').value;
  document.getElementById('urlinput').value = "";
  if (!isValidUrl(url_text))
    return;

  const items = await chrome.storage.sync.get(['urls']);
  let url_list = [];
  if (items.urls)
  {
    if (items.urls.includes(url_text))
      return;

    url_list = [...items.urls, url_text];
  }
  else
    url_list = [url_text];

  chrome.storage.sync.set({ urls: url_list });
  populateList();
}

document.getElementById('startAlarm').addEventListener('click', setAlarm);
document.getElementById('cancelAlarm').addEventListener('click', clearAlarm);
document.getElementById('addUrl').addEventListener('click', addUrl);
const url_list_div = document.getElementById('urlList');
const alarm_time = document.getElementById('alarmTime');

async function populateList()
{
  url_list_div.innerHTML = '';
  const items = await chrome.storage.sync.get(['urls']);
  if (items.urls)
  {
    items.urls.forEach(element => {
      const para = document.createElement("p");
      para.classList.add("aligned");
      const node = document.createElement("a");
      node.appendChild(document.createTextNode(element));
      node.href = element;
      node.addEventListener('click', () => {chrome.tabs.create({url: element})});
      para.appendChild(node);
      const button = document.createElement("button");
      button.textContent = "X";
      button.addEventListener('click', async () => {
        const items = await chrome.storage.sync.get(['urls']);
        let url_list = [...items.urls];
        let new_url_list = url_list.filter((word) => !(word === element));
        chrome.storage.sync.set({ urls: new_url_list });
        populateList();
      });
      para.appendChild(button);
  
      url_list_div.appendChild(para);
    });
  }

  const time = await chrome.storage.sync.get(['time']);
  if (time.time)
    alarm_time.value = time.time;

}

populateList();
