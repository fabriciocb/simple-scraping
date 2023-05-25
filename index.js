const puppeteer = require('puppeteer');
const ObjectsToCsv = require('objects-to-csv');

(async () =>{
    const pageLinks = [
        // Add the list of URLS were you need to extract the information
        'https://www.url.com/', 
    ]
    
    const allPages = []
    for (let pageLink of pageLinks){
        
        const browser = await puppeteer.launch({headless: true}); //set to false to see the script action in real time
        const page = await browser.newPage();
        await page.goto(pageLink);
        // await page.setDefaultTimeout(15000) //no recomended.Just in case the page to much to load. 
        await page.waitForSelector('.class') // add the main selector
    
        
        const swSearchData = await page.evaluate(()=>{
            const elements = document.querySelectorAll('.class'); //add selector
            const links = [];
            for (let element of elements){
                const tmp = {}
                    try{
                        //save the elements you need from each page. Example:
                        tmp.heading = element.childNodes[1].innerText; 
                        tmp.link = element.childNodes[5].childNodes[1].href; 
                        tmp.date = element.childNodes[3].innerText;
                    }catch(e){
                        console.error(e)
                    }
                    links.push(tmp);
            }
            return links;
        })
        allPages.push(...swSearchData)
        await browser.close();
    }
    
    const csv = new ObjectsToCsv(allPages);
    await csv.toDisk('./file.csv');    
})();
