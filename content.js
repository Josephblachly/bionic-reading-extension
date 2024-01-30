let isBionicReading = false;
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.queryBionicReading) {
    console.log("Querying bionic reading status");
    sendResponse({ isBionicReading });
  } else {
    isBionicReading = request.bionicReading;
    if (isBionicReading) {
      console.log("Applying bionic reading style");
      applyBionicReadingStyle();
    } else {
      console.log("Removing bionic reading style");
      removeBionicReadingStyle();
    }
  }
});


function applyBionicReadingStyle() {
  console.log("Applying bionic reading style");
  const textNodes = getAllTextNodes(document.body);
  textNodes.forEach((node) => {
    const words = node.nodeValue.split(/\s+/);
    const modifiedWords = words.map((word) => boldifyWord(word));
    node.parentNode.replaceChild(document.createTextNode(''), node);
    node.parentNode.innerHTML += modifiedWords.join(' ');
  });
}

function removeBionicReadingStyle() {
   console.log("Removing bionic reading style");
  const boldElements = document.querySelectorAll('.extension-adhd-reader-boldify');
  boldElements.forEach((element) => {
    const text = element.innerText;
    const newText = text.replace(/\*/g, ''); // Remove the asterisks used for boldifying
    element.innerText = newText;
    element.classList.remove('extension-adhd-reader-boldify');
  });
}

function getAllTextNodes(node) {
  const textNodes = [];
  if (node.nodeType === Node.TEXT_NODE) {
    textNodes.push(node);
  } else {
    const children = node.childNodes;
    for (let i = 0; i < children.length; i++) {
      textNodes.push(...getAllTextNodes(children[i]));
    }
  }
  return textNodes;
}

function boldifyWord(word) {
  if (!isNaN(word) || !isNaN(word.slice(0, 1)) || Math.floor(word.length / 3) < 1) {
    return word;
  }

  const prefixLength = Math.min(4, Math.floor(word.length / 3));
  const prefix = word.slice(0, prefixLength);
  const remaining = word.slice(prefixLength);

  const wrapper = document.createElement('span');
  wrapper.classList.add('extension-adhd-reader-boldify');

  const prefixNode = document.createElement('span');
  prefixNode.innerText = prefix;
  prefixNode.style.fontWeight = 'bold';
  wrapper.appendChild(prefixNode);

  const remainingNode = document.createTextNode(remaining);
  wrapper.appendChild(remainingNode);

  return wrapper.outerHTML;
}
