# Character Analysis MicroService

This is a microservice implemented for CS361 partners using NodeJS. The role name requested by the requester is received through socket communication. The microservice will return the corresponding character analysis/guide video or the URL of Tower of Fantasy from Wikipedia. The microservice will automatically judge and return according to the request Video url or wiki url.

### 1. Project file introduction
- **config.json**: character name list and corresponding character analysis/guide video, the data is stored in the format of {"name":"abc", "url":"http://www.xxx.com/abc"} object array.
- **server.js**: The server code of the microservice.
- **client.js**: Microservice request-side example code, interacting with users based on the command line.
### 2. How to run the microservice
- **Run the server**: ```node ./server.js```

It is necessary to ensure that the port 3661 of the computer is not occupied. If it is occupied, you can modify the port in server.js and restart it.

- **Run the client**: ```node ./client.js```

It will enter the command line in interactive mode. When quit or exit is entered, it will exit the command line and the microservice request end.

### 3. Communication rules on the server side
Although the service uses the socket protocol for communication, the format of the requested and returned data is a json string.

- The socket server of the microservice will receive request sample data, such as:
```{"type": "url","data":"Alyss"}```
This means that the video url of the character named Alyss needs to be obtained.

- The server will look for the url named Alyss from config.json, and return a json string if found:
```{"status": 200,"url":"https://m.youtube.com/watch?v=NsjNK-e2avY"}```

- If the requested role name is not found in config.json, the following json string is returned:
```{"status": 400,"url":"not found"}```

- The microservice also supports the return of wiki information of the role name, the sample json string of the request is:
```{"type": "wiki", "data": "Alyss"}```

- The microservice will splice a toweroffantasy.fandom.com url as the returned url, and return it to the requesting end in the format of json string.
```{"status": 200, "url":"https://toweroffantasy.fandom.com/wiki/Alyss"}```


### 4. Microservice request example
In the local environment, start the server first, then start client.js, and perform some interactions on the client's interactive interface to send request data.

- server.js:
![server](https://github.com/jinchuantian/MicroService/blob/main/serverjs.jpg)

- client.js:
![client](https://github.com/jinchuantian/MicroService/blob/main/clientjs.jpg)


### 5. Tips
The server.js of the microservice configures a maximum socket waiting time. If the client does not have any socket communication with the server within 60s after the connection is established, the server will close the current socket connection to reduce idle connections.