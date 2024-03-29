// issue: anilist.co doesn't count watched/completed animes if start_date isn't set
// summary: app corrects invalid dates
// details: app takes in a MyAnimeList XML file, then 
// sets invalid dates to valid dates for all completed animes. for example, 
// if invalid start_date & valid finish_date, then start_date = finish_date, and vice versa

const hiddenElems = document.querySelectorAll(".hidden");
const hiddenDatePicker = document.querySelector(".hidden-date");
const chkFakeDate = document.querySelector("#chkCreateFakeDate");
const selectedDate = document.querySelector("#fakeDate");
const xmlFileInput = document.querySelector("#xmlFileInput");
const localeDateString = new Date().toLocaleDateString();

selectedDate.valueAsDate = new Date(localeDateString);

chkFakeDate.addEventListener("change", () => {
    hiddenDatePicker.classList.toggle("hidden-date");
});
xmlFileInput.addEventListener("change", handleFiles, false);

function handleFiles({ currentTarget }) {
    const fileList = currentTarget.files;
    const file = fileList[0];

    if (!file || file.type != "text/xml") {
        alert("File uploaded is not XML");
        return;
    }

    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onerror = () => {
        alert(fileReader.error);
    };
    fileReader.onload = () => {
        // read successful. pass content to parseXML()
        parseXmlStr(fileReader.result);
    };
}

function isValidDate(d) {
    return d instanceof Date && !isNaN(d);
}

/**
 * Parses an anime list in the MyAnimeList XML format.
 * @param {string} xmlstr - String in the text/xml format
 */
function parseXmlStr(xmlstr) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlstr, "text/xml");
    const aniList = xmlDoc.querySelectorAll("anime");

    aniList.forEach((anime) => {
        const status = anime.querySelector("my_status").textContent.toLowerCase();
        if (!["plan to watch", "watching", "dropped", "paused", "completed", "rewatching"].includes(status)) {
            return;
        }
        const start = anime.querySelector("my_start_date");
        const finish = anime.querySelector("my_finish_date")
        const sdate = new Date(start.textContent);
        const fdate = new Date(finish.textContent);
        const sdateValidity = isValidDate(sdate);
        const fdateValidity = isValidDate(fdate);
        const fakedateValidity = isValidDate(new Date(selectedDate.value));

        switch (status) {
            case "plan to watch":
                start.textContent = "0000-00-00";
                finish.textContent = "0000-00-00";
                break;
            case "watching":
            case "dropped":
                finish.textContent = "0000-00-00";
                if (!sdateValidity &&
                    chkFakeDate.checked && fakedateValidity) {
                    start.textContent = selectedDate.value;
                }
                break;
            case "paused":
                if (!sdateValidity && fdateValidity) {
                    start.textContent = finish.textContent;
                } else if (!sdateValidity && !fdateValidity &&
                    chkFakeDate.checked && fakedateValidity) {
                    start.textContent = selectedDate.value;
                }
                break;
            case "completed":
            case "rewatching":
                // if ((sdateValidity && fdateValidity) || (!sdateValidity && !fdateValidity)) {
                //     return;
                // } 
                if (!sdateValidity && fdateValidity) {
                    start.textContent = finish.textContent;
                } else if (sdateValidity && !fdateValidity) {
                    finish.textContent = start.textContent;
                } else if (!sdateValidity && !fdateValidity &&
                    chkFakeDate.checked && fakedateValidity) {
                    start.textContent = selectedDate.value;
                    finish.textContent = selectedDate.value;
                }
                break;
            default:
                break;
        }
    });

    const xmlStr = new XMLSerializer().serializeToString(xmlDoc);
    const xmlTextArea = document.querySelector("#xmlTextArea");
    const filename = "anilistAnimeUpdatedStartDate.xml";
    const dlLink = document.querySelector("#xmlFileDownloadLink");

    xmlTextArea.textContent = xmlStr;
    setLinkAttributes(dlLink, filename, xmlStr);
    hiddenElems.forEach((elem) => {
        elem.classList.remove("hidden");
    });
    autoDownload(filename, xmlStr);
}

function setLinkAttributes(element, filename, text) {
    element.setAttribute('href', 'data:text/xml;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
}

function autoDownload(filename, text) {
    const link = document.createElement("a");
    setLinkAttributes(link, filename, text);
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
