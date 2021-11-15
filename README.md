# aniListStartDateUpdater
https://anilist.co doesn't count watched animes if start_date isn't set. See https://anilist.co/forum/thread/46480  
This sets start_date = finish_date using a MAL XML format

## Important
This only works for Anime. **Not Manga**. If there's enough interest for it, I'll add Manga functionality, if not, then someone else can fork my code and make their own.

## Steps
1. Export your anilist anime in the MAL XML format using an exporter, such as https://malscraper.azurewebsites.net/ (Save this XML as a backup)
2. Upload the exported MAL XML to https://eccos.github.io/aniListStartDateUpdater/
3. It should automatically download, but if not, hit the Download link
4. At https://anilist.co/settings/import, check "Overwrite anime already on my list"
5. Upload the downloaded file in step 3 "anilistAnimeUpdatedStartDate.xml"
