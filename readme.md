##Overview

This is a simple server that allows generalized control of the SIUI CTS909 via a websever.  The program can also intercept the connection between the PC software and 9009 box.  Nodejs is required.


##Installing
Assuming you have nodejs, all tahat is required is in this respositoty

##Running

Start the server via:

`node serveSIUI.js PORT IP`  

where PORT is the http port you want to connect to and IP is the IP address of the SIUI unit.  

The order of operations is

1. Turn on SIUI box
2. Start server via command above
3. Connect the windows SIUI software _to the server_ not the SIUI box. (optional)

##Commands

from your browser (or favorite language) these commands will serve you well

###Get Data
`http://SERVERADDY:PORT/data/`

returns the last full data stream from the SIUI.  Analysis of what this data means to come.  Plot it and you can see where the waveform is pretty easily

###Set Gain
`http://SERVERADDY:PORT/setGain/f.f`

where f.f is some float for the db setting.

###Send Command
`http://SERVERADDY:PORT/setGain/f.f`
