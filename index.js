// Purpose: anilist.co doesn't count watched animes if start_date isn't set
// Using MAL XML format,
// if an anime's start_date is invalid and finish_date is valid,
// set start_date = finish_date

// find out what valid/invalid dates return
// console.log(new Date("0000-00-00"));
// console.log(new Date("2021-01-03"));

// handles XML files
const xmlFileInput = document.getElementById("xmlFileInput");
xmlFileInput.addEventListener("change", handleFiles, false);
function handleFiles() {
    const fileList = this.files; /* now you can work with the file list */
    // only working with 1 file
    const file = fileList[0];
    if (file.type != "text/xml") {
        console.log("File uploaded is not XML");
        return;
    }

    // read file contents
    const fileReader = new FileReader();
    fileReader.readAsText(file);
    fileReader.onload = function () {
        // read successful. pass content to parseXML()
        parseXML(fileReader.result);
    };
    fileReader.onerror = function () {
        alert(fileReader.error);
    };
}

// parses MAL formatted XML anime list
function parseXML(file) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(file, "text/xml");
    console.log(xmlDoc);

    const aniList = xmlDoc.getElementsByTagName("anime");
    console.log(aniList);

    // for each anime in list
    for (let i = 0; i < aniList.length; i++) {
        // get data list
        const anime = aniList[i];
        const aniDataList = anime.children;
        let startDateIndex = null;
        let startDate = "";
        let finishDate = "";
        // for each anime's data list
        for (let j = 0; j < aniDataList.length; j++) {
            // get each data field
            const aniData = aniDataList[j];

            if (aniData.tagName == "my_start_date") {
                startDateIndex = j;
                startDate = aniData.textContent;
                const sDate = new Date(startDate);
                if (sDate != "Invalid Date") {
                    // if start date is valid, break out
                    // only care to fix invalid start dates
                    break;
                }
            }
            if (aniData.tagName == "my_finish_date") {
                finishDate = aniData.textContent;
                const fDate = new Date(finishDate);
                if (fDate == "Invalid Date") {
                    // cannot fix start dates with invalid finish date
                    // break out
                    break;
                }
            }
            if (startDate != "" && finishDate != "") {
                // console.log(fDate);
                const fDate = new Date(finishDate);
                if (fDate != "Invalid Date") {
                    // console.log("Valid " + fDate);
                    aniList[i].children[startDateIndex].textContent = finishDate;
                    console.log(i + " " + aniDataList[1].textContent);
                } else {
                    // console.log("Invalid");
                }
                // done with fix. break out
                break;
            }
        }
    }

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
    const xmlTextArea = document.getElementById("xmlTextArea");
    xmlTextArea.style.visibility = "visible";
    xmlTextArea.textContent = newXmlDoc;

    // create download link
    const filename = "anilistAnimeUpdatedStartDate.xml";
    const dlLink = document.getElementById("xmlFileDownloadLink");
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
