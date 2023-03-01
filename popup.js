let scrapperEmails = document.getElementById("scrapperEmails");
let list = document.getElementById("emaillist");
//handler to receive emails from content script
chrome.runtime.onMessage.addListener((request, sender, sendResponce) => {
  //get emails
  let emails = request.emails;

  //display emails

  if (emails == null || emails.length == 0) {
    let li = document.createElement("li");
    li.innerText = "No emails found";
    list.appendChild(li);
  } else {
    //display emails
    emails.forEach((emails) => {
      let li = document.createElement("li");
      li.innerText = emails;
      list.appendChild(li);
    });
  }
});
scrapperEmails.addEventListener("click", async () => {
  //get current active tag
  let [tab] = await chrome.tabs.query({ active: true, currentWindow: true });

  //execute scritping tp parse emails on page
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    func: scrapEmailsFromPage,
  });
});

// function to scrap emails
function scrapEmailsFromPage() {
  //regex to parse emails form html code
  const emailRegEx = /[\w\.=-]+@[\w\.-]+\.[\w]{2,3}/gim;

  //   parse emails from the html of the code
  let emails = document.body.innerHTML.match(emailRegEx);

  //meaage passing functionality
  chrome.runtime.sendMessage({ emails });
}
