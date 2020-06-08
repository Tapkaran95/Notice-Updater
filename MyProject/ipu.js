let puppeteer = require("puppeteer");
let fs = require("fs");
let credentialsFile = process.argv[2];
let url, pwd, email;
let newNotice;
(async function () {

    let data = await fs.promises.readFile(credentialsFile, "utf-8");
    let credentials = JSON.parse(data);
    url = credentials.url;
    email = credentials.email;
    pwd = credentials.pwd;

    let browser = await puppeteer.launch({
        headless: false,
        defaultViewport: null,
        args: ["--start-maximized", "--disable-notifications"],
        //slowMo: 400
    });

    let numberofPages = await browser.pages();
    let tab = numberofPages[0];
     
    await tab.goto(url, {
        waitUntil: "networkidle2"
    });

    await tab.waitForSelector("#email");
    await tab.type("#email", email, { delay: 100 });
    await tab.type("input[data-testid='royal_pass']", pwd, { delay: 100 });
     Promise.all([tab.waitForNavigation({
        waitUntil:"networkidle2"
        }),tab.click("#u_0_b")])
        let newTab=await browser.newPage()
        await ipu(newTab,browser)
    })()

    async function ipu(tab,browser)
    {
        await tab.goto("http://www.ipu.ac.in/",{
            waitUntil:"networkidle2"
        })

     let noticeWillBeOpened=await tab.$$("#allnews")
    await Promise.all([noticeWillBeOpened[1].click(),tab.waitForNavigation({
      waitUntil:"networkidle2"
    })])

    const data= await tab.evaluate(()=>{

        const tds=Array.from(document.querySelectorAll("table tr td"))
        return tds.map(td=>td.innerText)
    })
    // console.log(data.length)
    
    let chref=[];
    
    let noticeOnPage=await tab.$$("table tr td a")

const href= await tab.evaluate(()=>{

    const tdsa=Array.from(document.querySelectorAll("table tr td a[href]"))
    return tdsa.map(a=>a.getAttribute('href'))
})
    // console.log(href.length) 

let idx=1;
let i=0;
let completeHref=[]
let workcompleted=[]
while(idx<noticeOnPage.length){

    if(data[idx]==="08-06-2020"){
        newNotice="yes";
        let notice=data[idx-1]
        let date=data[idx]
        completeHref[i]=`http://www.ipu.ac.in/${href[i]}`
        let link=completeHref[i]
        // console.log(link)
       let newTab=await browser.newPage()
       let posted = await post(newTab,notice,date,link)
        workcompleted.push(posted)
        console.log("Done")
    }
    
    idx+=2;
    i++
}
await Promise.all(workcompleted);
if(newNotice=="yes"){
    console.log("Notice Posted");
}else{
    newTab=await browser.newPage();
    await noNotice(newTab);
}
await tab.close();
}

async function post(newTab,notice,date,link){
    await newTab.goto("https://www.facebook.com/",{
        waitUntil:"networkidle2"
    })

    await newTab.waitForSelector("._5qtp")
    newTab.click("._5qtp")

    await newTab.waitForSelector("div[aria-autocomplete='list']")
    await newTab.type("div[aria-autocomplete='list']","NEW NOTICE")
    await newTab.keyboard.press("Enter")
    await newTab.type("div[aria-autocomplete='list']","Date: "+date)
    await newTab.keyboard.press("Enter")
    await newTab.type("div[aria-autocomplete='list']","Notice: "+notice)
    await newTab.keyboard.press("Enter")
    await newTab.type("div[aria-autocomplete='list']","Link: "+link)

    let postPromise= await newTab.$$("button[type='submit']")
    await postPromise[1].click()
    await newTab.waitFor(4000)

//     let profile=await newTab.$$("div[dir='ltr']")
//   await Promise.all([newTab.waitForNavigation({
//         waitUntil:"networkidle2"
//     }),profile[0].click()])

    await newTab.goto("https://www.facebook.com/sunny.kohli.7503314",{ //Please paste your profile url here to go to your profile
        waitUntil:"networkidle2"
    })
    // await newTab.waitForSelector("._666k")
    let cPostLike = await newTab.$("._666k");
    await cPostLike.click({ delay: 200 });
    
    await newTab.waitForSelector("._7c-t")
    let comment=await newTab.$("._7c-t")
    await comment.click();
    await comment.type("Kindly Share",{delay:200})
    // await newTab.waitFor(1000);
    await newTab.keyboard.press("Enter")

    await newTab.close();

  }

  async function noNotice(newTab){
    await newTab.goto("https://www.facebook.com/",{
        waitUntil:"networkidle2"
    })

    await newTab.waitForSelector("._5qtp")
    newTab.click("._5qtp")

    await newTab.waitForSelector("div[aria-autocomplete='list']")
    await newTab.type("div[aria-autocomplete='list']","NO NOTICE TODAY")
    
    let postPromise= await newTab.$$("button[type='submit']")
    await postPromise[1].click()
    await newTab.waitFor(4000);
    await newTab.close();
  }