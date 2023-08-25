# aniListStartDateUpdater
[Try Me](https://eccos.github.io/aniListStartDateUpdater)

[AniList](https://anilist.co) doesn't count watched/completed animes if start_date isn't set. See [forum thread](https://anilist.co/forum/thread/46480).  
This website corrects invalid dates.  
It takes in a MyAnimeList XML file, then sets invalid dates to valid dates for all completed animes.  
For example, if start_date is invalid & finish_date is valid, then start_date = finish_date, and vice versa.

## Important
This only works for Anime. **Not Manga**.  
If there's enough interest for it, I'll add Manga functionality, if not, then someone else can fork my code and make their own.

## Steps
1. Export your AniList anime in the MAL XML format using an exporter, such as [MALScraper](https://malscraper.azurewebsites.net)  
  Select "List type: AniList Anime List" (Save the XML as a backup)
2. Upload the exported MAL XML in the "Upload MAL XML" section 
3. An updated XML "anilistAnimeUpdatedStartDate.xml" should automatically download, but if not, hit the Download link
4. In [AniList's XML Importer](https://anilist.co/settings/import), check "Overwrite anime already on my list", then upload the downloaded file in step 3
