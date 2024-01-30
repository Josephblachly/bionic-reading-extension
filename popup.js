(() => {
  "use strict";
  console.log("Background script running!");
  // DOM elements
  const toggleButton = document.getElementById('toggleButton');
  console.log("Background script running2!");
  // Get the active tab
  chrome.tabs.query({ active: true, lastFocusedWindow: true }, async (tabs) => {
    const tab = tabs[0];
    console.log("popup::TABID::", tab.id);

    // Query the current state of bionic reading on the active tab
    const isBionicReading = await new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, { queryBionicReading: true }, (response) => {
        resolve(response && response.isBionicReading);
      });
    });

    // Update the button text based on the bionic reading state
    toggleButton.innerText = isBionicReading ? "Deactivate" : "Activate";
    toggleButton.style.display = "block";
  });

  // Toggle bionic reading when the button is clicked
  toggleButton.addEventListener("click", async () => {
    const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });

    // Send a message to the content script to toggle bionic reading
    await chrome.tabs.sendMessage(tab.id, { bionicReading: true });

    // Update the button text and storage based on the new bionic reading state
    const newIsBionicReading = await new Promise((resolve) => {
      chrome.tabs.sendMessage(tab.id, { queryBionicReading: true }, (response) => {
        resolve(response && response.isBionicReading);
      });
    });

    toggleButton.innerText = newIsBionicReading ? "Deactivate" : "Activate";

    // Update storage based on the new state if needed
    if (newIsBionicReading) {
      // Handle activation logic if needed
    } else {
      // Handle deactivation logic if needed
    }
  });

  });
