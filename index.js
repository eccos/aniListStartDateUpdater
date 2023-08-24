// Purpose: anilist.co doesn't count watched animes if start_date isn't set
// Using MAL XML format,
// if an anime's start_date is invalid and finish_date is valid,
// set start_date = finish_date

// find out what valid/invalid dates return
// console.log(new Date("0000-00-00"));
// console.log(new Date("2021-01-03"));

// handles XML files
const xmlFileInput = document.querySelector("#xmlFileInput");
xmlFileInput.addEventListener("change", handleFiles, false);
function handleFiles({ currentTarget }) {
    const fileList = currentTarget.files; // work with file list
    const file = fileList[0]; // work with 1st file

    if (!file || file.type != "text/xml") {
        alert("File uploaded is not XML");
        return;
    }

    // read file contents
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
    console.log(xmlDoc);

    const aniList = xmlDoc.querySelectorAll("anime");
    // const aniList = xmlDoc.getElementsByTagName("anime");
    console.log(aniList);

    aniList.forEach((anime) => {
        if (anime.querySelector("my_status").textContent.toLowerCase() != "completed") {
            return;
        }
        const start = anime.querySelector("my_start_date");
        const finish = anime.querySelector("my_finish_date")
        const sdate = new Date(start.textContent);
        const fdate = new Date(finish.textContent);

        if ((isValidDate(sdate) && isValidDate(fdate)) || (!isValidDate(sdate) && !isValidDate(fdate))) {
            return;
        }

        if (!isValidDate(sdate) && isValidDate(fdate)) {
            start.textContent = finish.textContent;
            return;
        } else if (isValidDate(sdate) && !isValidDate(fdate)) {
            finish.textContent = start.textContent;
            return;
        }
    });

    // form new MAL formatted XML
    const s = new XMLSerializer();

    // form opening xml
    let newXmlDoc = `<?xml version="1.0" encoding="UTF-8" ?>
<myanimelist>`;
    // append myinfo content (contains info about the user)
    const myinfo = xmlDoc.getElementsByTagName("myinfo");
    for (let index = 0; index < myinfo.length; index++) {
        const element = myinfo[index];
        newXmlDoc += s.serializeToString(element);
    }
    // append animes
    for (let index = 0; index < aniList.length; index++) {
        const element = aniList[index];
        newXmlDoc += s.serializeToString(element);
    }
    // form closing xml
    newXmlDoc += `</myanimelist>`;

    // display new xml in textarea
    const xmlTextArea = document.querySelector("#xmlTextArea");
    xmlTextArea.style.visibility = "visible";
    xmlTextArea.textContent = newXmlDoc;

    // create download link
    const filename = "anilistAnimeUpdatedStartDate.xml";
    const dlLink = document.querySelector("#xmlFileDownloadLink");
    createDownload(filename, newXmlDoc, dlLink);
    dlLink.style.visibility = "visible";

    // auto download after file upload
    autoDownload(filename, newXmlDoc);
}

function createDownload(filename, text, element) {
    if (!element) {
        const element = document.createElement('a');
    }
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    return element;
}

function autoDownload(filename, text) {
    const element = document.createElement('a');
    createDownload(filename, text, element);
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}
