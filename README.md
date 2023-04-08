# nodejspractice_complexapp
FreedomApp.  
No more short tweets and impersonal “shared” posts that are similar to the late 90s email forwards. FreedomApp believes that actual writing is the key to a better World Wide Web.

## What's the purpose of this project?

Just to be able to practice more of NodeJS and general web development techniques. I believe it's essential to know these things before I can move on to Blockchain Development.  

## What's this app about?

This project is a simple social media website. It's like Twitter but without the share (retweet) feature to encourage people to write/post original content.  

## What are the features of this app?

* User registration. The app will automatically create the user profile and grab the avatar from gravatar.com (using your email) if it exists.
* Log-in and Log-out.
* Post content. The author can update and delete any content that they own.
* Any users (when logged in) can search for posts via the search icon from the header.
* A user can also chat with everyone (logged-in users). To access the chat, you have to click the chat icon from the header.
* The app was built following a Model-View-Controller (MVC) design pattern.
* This app also features Cross-Site Request Forgery (CSRF) protection.
* Lastly, you can communicate (create a new post) with the app via API.

## What does this app lack?

* No front-end framework.
* No email confirmation required after registration.
* The user cannot change their username, password, or email after registration.
* No mail notifications for new posts and new followers.
* There's no "like" feature.

## What's the stack used in this project?

MongoDB, Express, NodeJS.

Libraries and APIs:
1. express-session
2. connect-mongo
3. connect-flash
4. marked
5. sanitize-html
6. axios
7. dompurify
8. socket.io
9. webpack
10. dotenv
11. bcryptjs
12. md5
13. validator
14. csurf
15. jsonwebtoken
16. cors


## API (jwt)

* You can use the Postman app to try this out.
* To fetch all posts by a user, you just need to send a GET request to https://(yourhost)/api/postsByAuthor/(username).
* If the username you provided exists, you will see a relevant JSON object(s) response.
* For creating a new post and deleting a post via API, a JWT token is required to process the requests.
* You need to send a POST request to https://(yourhost)/api/login.
* Set your header Content-Type to application/json.
* In the body, set the input to raw and create your JSON object with the properties: username and password.
* Then supply your correct username and password to those properties and hit send.
* If you did it correctly, you should see a response containing your generated token. Copy that to your clipboard.
* Please note that the generated token is only valid for 24 hours. You'll have to request a new one again once it has expired.
* Now to create a new post via API, you need to send a POST request to https://(yourhost)/api/create-post.
* In the body, create a new JSON object with the properties: title, body, and token.
* Supply your desired title and body values for this new post. Paste in the generated token in the token property value and hit send.
* If everything is done correctly, you should see a JSON response: "Congrats! New post created via API."
* For deleting a post, you need to send a DELETE request to https://(yourhost)/api/post/(_id).
* In the body, make sure to only have your token property and value. Hit send.
* If everything went well, you should see a JSON response: "Post deletion successful!"

## What resource(s) did I use to create this app?

* [Stack Overflow](https://stackoverflow.com/)
* [Brad Schiff's JavaScript Course](https://www.udemy.com/course/learn-javascript-full-stack-from-scratch)


## URL
This app was successfully deployed online via [Heroku](https://yapfreedomapp.herokuapp.com/). Feel free to test it out.  

## SCREENSHOT
![Alt text](/screenshots/screenshot-guest-homepage.JPG?raw=true "Homepage")  
![Alt text](/screenshots/screenshot-homepage-dashboard.JPG?raw=true "Homepage Dashboard")  
![Alt text](/screenshots/screenshot-profile-page.JPG?raw=true "Profile Page")  
![Alt text](/screenshots/screenshot-view-others-profile.JPG?raw=true "Others Profile Page")  
![Alt text](/screenshots/screenshot-creating-a-post-page.JPG?raw=true "Create A Post Page")  
![Alt text](/screenshots/screenshot-edit-post.JPG?raw=true "Edit A Post Page")  
![Alt text](/screenshots/screenshot-searchbar.JPG?raw=true "Search bar")  
![Alt text](/screenshots/screenshot-chat.JPG?raw=true "Chat window")  
