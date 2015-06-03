# Setup dev
Install Node.js and MongoDB  
Start mongod

    npm install
    node app.js
    
Go to [https://localhost:8443](https://localhost:8443)  
Click connection and create your profile   
Open mongo command line to make your profile admin

    use ageg
    db.users.update({cip:'yourCip'},{$push:{rights:'admin'}})
