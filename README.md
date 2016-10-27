How to use:
1. npm install
2. Client side: npm run watch
3. mkdir db for database if you do not have one. Better do this on another directory.
4. Set up Mongo: mongod —-dbpath (the directory you set up in previous step) —-port ( your port)
5. Populate the database: mongorestore —-drop —-port (your port)
In server/MongoUtil.js, client.connect('mongodb://localhost:40001/homeless',(err,db)=>{ Change 40001 to the port currently running the database
7. node server/app.js



Please do not push your database into Github, this will exceed the file size limit.
If step 4 fails, you might have a database running using that directory. Just simply skip this step, but use this port to send data to your server.