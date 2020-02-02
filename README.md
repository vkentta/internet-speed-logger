# internet-speed-logger
Run internet speed tests periodically.
The tests are run at user set interval (or by default, every 15 minutes), using [speedtest CLI](https://www.speedtest.net/apps/cli) and [fast-speedtest-api](https://www.npmjs.com/package/fast-speedtest-api) (taking turns between the two). The results are stored into sqlite database file and can be displayed with included web UI.

![Internet speed history graph](screenshot.png)

### Requirements:
Docker

## Usage
https://hub.docker.com/r/vkentta/internet-speed-logger

``docker run -e CHECK_PERIOD_MINUTES=15 -v `pwd`:"/usr/src/app/data" -p 3000:3000 --name internet-speed-logger --restart always vkentta/internet-speed-logger``

The database file will be added to / used from the directory you run the above command in.

##### Building with docker

``docker build -t your-custom-tagname .``

##### Running your own image

``docker run -v `pwd`:"/usr/src/app/data" -p 3000:3000 --name internet-speed-logger --restart always your-custom-tagname``

### Displaying speed test results:
After the speed tests have been running for a while, go to [localhost:3000](http://localhost:3000).

## NOTE:

By using this software you automatically accept these:

> You may only use this Speedtest software and information generated from it for personal, non-commercial use, through a command line interface on a personal computer. Your use of this software is subject to the End User License Agreement, Terms of Use and Privacy Policy at these URLs:
>
>https://www.speedtest.net/about/eula
>
>https://www.speedtest.net/about/terms
>
>https://www.speedtest.net/about/privacy

>Ookla collects certain data through Speedtest that may be considered personally identifiable, such as your IP address, unique device identifiers or location. Ookla believes it has a legitimate interest to share this data with internet providers, hardware manufacturers and industry regulators to help them understand and create a better and faster internet. For further information including how the data may be shared, where the data may be transferred and Ookla's contact details, please see our Privacy Policy at:
>
>http://www.speedtest.net/privacy