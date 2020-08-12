# Crosschat

#### A cross-server data stream system for FXServer

Allows you to connect multiple FXServer instances together and send data between all the servers at once

## Note
This resource does not do anything by default.
I've included a simple example script below.
When sending data, you might want to include a unique identifier per FXServer, this resource does not provide such.

## Installation
Install as you would any other resource
Upon starting for the first time, some packages will be downloaded by the FXServer package manager (yarn or webpack)
If it fails to download the packages, check the Yarn or NPM documentation on how to install the packages manually.

## Network
The structure expected by this system is **one** host server and as many client servers as you want.
Each client FXServer connects to the set host FXServer.

## Configuration
The resource utilizes some console variables to control how to do things.

### xchat_server
Defaults to `false`, set to `true` to mark this FXServer as a host.

### xchat_server_port
Defaults to `30220`, this is the port used by the sockets that send and receive the data.

### xchat_endpoint
Defaults to `http://localhost`, if the FXServer is not set as a host, it will try to connect to this endpoint
You might want to include the port in here aswell.

## Example Scenario
You have two FXServers, one hosted on `420.69.621.0:30120` and one on `926.42.007.0:30120`
In the config for `420.69.621.0:30120`, you set the FXServer as a host (`xchat_server` to `true`) and the port (`xchat_server_port`) to `30220` 
In the config for `926.42.007.0:30120`, you set the endpoint (`xchat_endpoint`) to `420.69.621.0:30220` (using the host port)
Starting the servers should successfully connect them together, and data can be shared between the two.
Any additional clients would simply require the same settings as `926.42.007.0:30120`, essentially making clients identical to configure.

## Events
There are only two events used by this system, one incoming and one outgoing.
Both are server side.

### xchat:sendData ( data[, callback(ok)] )
Sends the data to all connected FXServers (except the one sending it)
Data can be any type and anything.
Callback function's ok value determines if the FXServer could send the data.
ok: `false` means the client is not connected to the host
ok: `true` means the data was sent

Example:
```lua
TriggerEvent('xchat:sendData', 'Hello World', function(ok)
    if ok then print('xchat:', 'message was sent') else print('xchat:', 'failed to send') end
end)
```

### xchat:receivedData (data)
Triggered upon receiving data

Example:
```lua
AddEventHandler('xchat:receivedData', function(data)
    print('xchat:', data)
end)
```

## Example usage
A simple script that relays chat messages between servers (server side)
```lua
AddEventHandler('chatMessage', function(username, color, message)
    TriggerEvent('xchat:sendData', {event = 'chatMessage', username = username, color = color, message = message})
end)

AddEventHandler('xchat:receivedData', function(data)
    if data.event == 'chatMessage' then
        TriggerClientEvent('chatMessage', -1, data.username, data.color, data.message)
    end
end)
```
Any chat message sent should also appear on the other servers in the network

## Credits
Script by @glitchdetector