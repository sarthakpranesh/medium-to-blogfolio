const prompt = require('prompt-sync')();
const fetch = require('node-fetch');
const TurndownService = require('turndown');
const fs = require('fs');

const m2b = () => {
    // Ask user for their medium username
    console.log("To get your Medium blogs we'll need your Medium username.");
    const name = prompt('What is your Medium username? ');
    console.log(`Hey there ${name} we'll fetch and convert your blogs to MD`);

    // Creating medium rss feed link
    let mediumRssFeedToJson = `https://api.rss2json.com/v1/api.json?rss_url=https%3A%2F%2Fmedium.com%2F%40${name}%2Ffeed`;
    let rawBlogData = {};
    (async () => {
        const raw = await fetch(mediumRssFeedToJson);
        const response = await raw.json();

        // create folder to store your blogs
        try {
            fs.mkdirSync('medium-to-blogfolio');
        } catch (err) {
            console.log(err.message);
        }
        
        response.items.forEach((item, index) => {
            rawBlogData[index] = '';
            var turndownService = new TurndownService()
            var tabhugo = `---
    title: ${item.title.replace(':', '')}
    date: ${item.pubDate}
    draft: false
    tags: [${item.categories}]
    summary: ${item.title.replace(':', '')}
    ---

    `
            var markdown = turndownService.turndown(item.content)
            fs.writeFileSync(`./medium-to-blogfolio/${item.title}.md`, tabhugo+markdown);
            // console.log(markdown);
        });

        console.log('Your blogs are saved in the `medium-to-blogfolio` folder :>')
    }) ()
};

module.exports = m2b;
