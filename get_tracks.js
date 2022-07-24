#!/usr/bin/env node
const fs = require('fs');
const readline = require('readline');
const fetch = require('isomorphic-unfetch');
const { getData, getPreview, getTracks, getDetails } = require('spotify-url-info')(fetch);

if(process.argv.length !== 3) {
    console.log("Usage: ./get_tracks.js <filename>");
    console.log("Filename should be a file containing a list of spotify URLs");
    process.exit(0);
}

// sanitize a string for CSV format
function sanitize(str) {
    // internal quotation marks (") should be replaced with double-quotation marks ("")
    str = str.replace(/"/g, '""');
    return str
}

async function readFile() {
    const filename = process.argv[2];
    const fin = fs.createReadStream(filename);

    const rl = readline.createInterface({
        input: fin,
        crlfDelay: Infinity
    });

    // create output file CSV
    const fout = fs.createWriteStream("playlist.csv");

    // write headers
    fout.write("\"Artists\",\"Title\",\"Album\",\"Date\",\"URL\",\"Image\"\n");

    // read input file and append tracks to CSV file
    var num_errs = 0;

    for await (const line of rl) {
        // use getData to get album info
        var err = false
        const trackData = await getData(line)
            .catch((err) => {
                if(!err) {
                    console.log("[ERROR] could not fetch info for URL " + line);
                }
                err = true;
            });
        // use getPreview to get the rest of the data
        // note: check if date is undefined before writing
        const trackPreview = await getPreview(line)
            .catch((err) => {
                if(!err) {
                    console.log("[ERROR] could not fetch info for URL " + line);
                }
                err = true;
            });
        
        if(trackData === undefined || trackPreview === undefined) {
            if(!err) {
                console.log("[ERROR] could not fetch info for URL " + line);
            }
            err = true;
        }
        
        if(err) {
            num_errs++;
            continue;
        }

        // append results to file
        fout.write("\"" + sanitize(trackPreview["artist"]) + "\",");
        fout.write("\"" + sanitize(trackPreview["title"]) + "\",");
        fout.write("\"" + sanitize(trackData["album"]["name"]) + "\",");
        
        if(trackPreview["date"] === undefined) {
            fout.write("\"\",");
        } else {
            fout.write("\"" + trackPreview["date"] + "\",");
        }

        // no need to sanitize URLs
        fout.write("\"" + trackPreview["link"] + "\",");
        fout.write("\"" + trackPreview["image"] + "\"");
        fout.write("\n");

        console.log("Got info for track " + trackPreview["title"]);
    }
    
    console.log("\nDONE");
    console.log("Got errors on " + num_errs + " tracks\n");
}

readFile();
