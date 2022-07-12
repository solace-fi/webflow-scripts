# Scripts for Solace.Fi's Webflow websites

Given that Webflow is not a JavaScript framework, and instead, scripts need to be injected manually into the "before `</body>`" box for each page we make, we must store our scripts in a separate place to have them handy when we need to edit them externally.

Please don't edit these scripts directly on Webflow without publishing to this repo.

## How to insert them into Webflow

1. Go to the dashboard: https://webflow.com/dashboard
2. There is only one workspace. So go to Solace main site.
3. On the left bar, click on the Page icon.
4. Click the gear icon to the right of the page that you wish to edit:
   ![screenshot](https://i.ibb.co/h7H9nXH/image.png)
5. Go to the last text box with the title `Before </body> tag`
6. Create the tags `<script defer>` and `</script>` if they are not already there
7. Find the JavaScript code in t he `src` folder. If it's longer than 10,000 characters, minify the file.
8. Paste the JavaScript code between the `<script>` tags. Make sure it doesn't have these tags already.
9. Click _Save_ on the top-right of the left section.
10. Click _Publish_ on the top-right part of the dashboard
11. Select a domain if it's not already selected.
12. Click _Publish to Selected Domains_

## How to minify a script

Sometimes scripts don't fit due to a max-length 10,000 character limit.

1. Install `minify` globally (`yarn global add minify`). NPM link: https://www.npmjs.com/package/minify
2. Run `minify nameOfTheScript.js > nameOfTheScript.min.js` where the first name is the existing one, and the second one will be created/replaced.

That's it.
