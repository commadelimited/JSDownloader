# JSDownloader

The goal of JSDownloader is to have a simple way to grab the entire contents of a JSFiddle, JSBin or CodePen URL.

## Try it live
Try out the live version at [JSDownloader.com](http://JSDownloader.com).

## Installation

Clone the repo locally: git clone https://github.com/commadelimited/JSDownloader.git

Run `npm install` in the root of the JSDownloader directory.

Run `node app` to start the application locally.

## Usage

Open your browser to `http://0.0.0.0:3000`

Paste in the URL of a JSFiddle you'd like to download, or click one of the links in the Recently Downloaded section to load that one up.

Files will be downloaded into your `tmp/` directory, prepended with `jsd`. You should see a new directory with a name something like this:

* jsd-cojosapisa

## Caveats

There is very little error handling at the moment. So you might get raw errors in your console.