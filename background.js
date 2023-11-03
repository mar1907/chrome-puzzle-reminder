'use strict';

chrome.alarms.onAlarm.addListener(async () => {
  const items = await chrome.storage.sync.get(['urls']);
  let url_string = ""
  if (items.urls)
    items.urls.forEach(element => {url_string += element+"\n"});

  chrome.notifications.create(
    'wordle_reminder',
    {
      type: 'basic',
      iconUrl: 'wordle_icon.png',
      title: 'Puzzle Reminder',
      message: "Complete these puzzles today:\n" + url_string,
      buttons: [{ title: 'Open' }],
      priority: 0
    });
});

chrome.notifications.onButtonClicked.addListener(async () => {
  const items = await chrome.storage.sync.get(['urls']);
  items.urls.forEach(element => {chrome.tabs.create({url: element})});
});
