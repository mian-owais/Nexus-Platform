import jsdom from "jsdom";
const { JSDOM } = jsdom;
import fs from "fs";

async function run() {
  const html = await fetch("http://localhost:5173/").then(res => res.text());
  
  // We can't really execute Vite's module scripts reliably in jsdom, but we can try
  const dom = new JSDOM(html, { runScripts: "dangerously", resources: "usable", url: "http://localhost:5173/" });
  
  dom.window.onerror = function(msg, url, lineNo, columnNo, error) {
    console.log("JSDOM ERROR:", msg);
    console.log("Error trace:", error);
  };
  
  setTimeout(() => {
    console.log("Done waiting");
    process.exit(0);
  }, 2000);
}
run();
