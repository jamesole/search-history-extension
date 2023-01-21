const getLinks = () => {
  var list = document.querySelector("ol");

  chrome.runtime.sendMessage(
    {
      message: "get-links",
    },
    (response) => {
      if (response.message === "success") {
        var links = response.links;
        for (let i = 0; i < links.length; i++) {
          var item = document.createElement("li");
          var anchor = document.createElement("a");
          anchor.setAttribute("href", links[i].link);
          anchor.setAttribute("target", "_blank");
          anchor.innerText = links[i].title;
          item.appendChild(anchor);

          list.appendChild(item);
        }
        console.log(links);
      }
    }
  );
};

document.addEventListener("DOMContentLoaded", getLinks);
