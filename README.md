# Spotify Playlist to CSV

This is a tiny script I wrote to generate a CSV from a Spotify playlist. It's written in JavaScript to take advantage of the [Spotify-URL-Info](https://github.com/microlinkhq/spotify-url-info) NPM package.

The output CSV contains the following information on each track:

```
Artist(s), Title, Album, Date, URL, Cover Image URL
```

## Dependencies

Spotify Playlist to CSV requires NodeJS to be installed on your system. You'll also need to install the [Spotify-URL-Info](https://github.com/microlinkhq/spotify-url-info) NPM package,
which can be installed via the following command:

```
npm install spotify-url-info
```

Spotify-URL-Info depends on the [Isomorphic Unfetch](https://www.npmjs.com/package/isomorphic-unfetch) package, which can be installed via the following command:

```
npm install isomorphic-unfetch
```

## Usage

Spotify Playlist to CSV takes as input a file containing a list of Spotify track URLs. This can be easily generated via the Spotify client. Open a playlist, press `CTRL + A` to select all the tracks, and then press `CTRL + C` to copy their URLs. Then, paste the URLs into a text editor (e.g. Notepad).

To run the script:

```
./get_tracks.js <filename>
```

where filename is the file containing a list of Spotify Track URLs.