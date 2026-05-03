// Service Worker for Contextify
// Currently handles installation event and can be expanded for background tasks

chrome.runtime.onInstalled.addListener(() => {
  console.log('Contextify Extension Installed');
  
  // Initialize storage if needed
  chrome.storage.local.get(['actionsUsed', 'resetDate'], (result) => {
    if (!result.resetDate) {
      const currentMonth = new Date().toISOString().slice(0, 7);
      chrome.storage.local.set({ 
        actionsUsed: 0, 
        resetDate: currentMonth 
      });
    }
  });
});