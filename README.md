# wallet

Wallet is an angular / ionic firebase app which allows users to upload, share, comment on and apply filters to images.
It uses firebase for storing / retrieving images, user data, and providing authentication information, 
Cloudinary API for converting images into cloud based URLs, and also for providing image filters.\

The User service provides some of the basic features such as following other users, viewing their profiles,
and leaving likes or comments.\

The Image service provides a useful method for interacting with firebase as an api and connecting to a node backend - by sending requests to a firebase request ref, and responding in the app when a response is returned to the firebase response ref.  
