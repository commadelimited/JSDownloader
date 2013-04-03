# JSDownloader

The goal of JSDownloader is to have a simple way to grab the entire content of a JSFiddle or JSBin URL.

## Installation

Clone the repo locally: git clone https://github.com/commadelimited/JSDownloader.git

Run `npm install` in the root of the JSDownloader directory.

Run `node app` to start the application locally.

## Usage

Open your browser to `http://0.0.0.0:3000`

Paste in the URL of a JSFiddle you'd like to download. Here's a few you can try out:

* http://jsfiddle.net/commadelimited/SA45t/2/
* http://jsfiddle.net/odigity/zS5uu/
* http://jsfiddle.net/phillpafford/wvVmT/2/
* http://jsfiddle.net/mT76T/17/
* http://jsfiddle.net/jonathansampson/3y4hz/3/

* http://jsbin.com/oxuyop/777

Files will be downloaded into your `/tmp/` directory, prepended with `jsd`. You should see a new directory with a name something like this:

* jsd-cojosapisa

## Caveats

There is very little error handling at the moment. So you might get raw errors in your console.

## Moving forward

The end result will be to have this app running on Heroku. When a URL is provided all of the files will download to Heroku's ephemeral file system, be zipped up, and streamed to the user from S3.